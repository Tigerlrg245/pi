// Validation at the settings-file and admission-input boundaries.

/** @typedef {{hardReservePp: number, foregroundPpPerDay: number, safetyHeadroomPp: number, maxJobPp: number}} WindowLimits */
/** @typedef {{maxSnapshotAgeMs: number, futureToleranceMs: number, windows: Record<string, WindowLimits>}} Limits */
/** @typedef {{schemaVersion: 1, revision: number, mode: 'RED' | 'GREEN', accountId: string | null, limits: Limits | null}} Settings */
/** @typedef {{id: string, remainingPp: number, resetAtMs: number}} QuotaWindow */
/** @typedef {{accountId: string, source: 'account-api', fetchedAtMs: number, windows: QuotaWindow[]}} Snapshot */
/** @typedef {{nowMs: number, machineReady: boolean, activeJobs: number, snapshot: Snapshot, job: Record<string, number>, reservations: Record<string, number>}} AdmissionInput */

/** Validate and detach an external settings value; invalid state throws. @returns {Settings} */
export function parseSettings(value) {
	const data = jsonCopy(value);
	object(data, ['schemaVersion', 'revision', 'mode', 'accountId', 'limits'], 'settings');
	if (data.schemaVersion !== 1) fail('unsupported settings schema');
	integer(data.revision, 0, 'revision');
	if (!['RED', 'GREEN'].includes(data.mode)) fail('invalid mode');
	if (data.accountId !== null) identifier(data.accountId, 'accountId');
	if (data.limits !== null) {
		object(data.limits, ['maxSnapshotAgeMs', 'futureToleranceMs', 'windows'], 'limits');
		integer(data.limits.maxSnapshotAgeMs, 1, 'maxSnapshotAgeMs');
		integer(data.limits.futureToleranceMs, 0, 'futureToleranceMs');
		if (data.limits.futureToleranceMs > 5_000) fail('futureToleranceMs must not exceed 5000');
		record(data.limits.windows, 'limit windows');
		if (!Object.keys(data.limits.windows).length) fail('at least one quota window is required');
		for (const [id, limit] of Object.entries(data.limits.windows)) {
			identifier(id, 'window id');
			object(limit, ['hardReservePp', 'foregroundPpPerDay', 'safetyHeadroomPp', 'maxJobPp'], 'window limits');
			percentage(limit.hardReservePp, 'hard reserve');
			percentage(limit.foregroundPpPerDay, 'foreground allowance');
			percentage(limit.safetyHeadroomPp, 'safety headroom', true);
			percentage(limit.maxJobPp, 'maximum job estimate', true);
		}
	}
	if (data.mode === 'GREEN' && (data.accountId === null || data.limits === null)) {
		fail('GREEN requires an account and explicitly configured limits');
	}
	return data;
}

/** Validate and detach an external admission request; no prediction fields are accepted. @returns {AdmissionInput} */
export function parseAdmissionInput(value) {
	const data = jsonCopy(value);
	object(data, ['nowMs', 'machineReady', 'activeJobs', 'snapshot', 'job', 'reservations'], 'admission');
	integer(data.nowMs, 1, 'nowMs');
	if (typeof data.machineReady !== 'boolean') fail('machineReady must be boolean');
	integer(data.activeJobs, 0, 'activeJobs');
	object(data.snapshot, ['accountId', 'source', 'fetchedAtMs', 'windows'], 'snapshot');
	identifier(data.snapshot.accountId, 'snapshot accountId');
	if (data.snapshot.source !== 'account-api') fail('an account API snapshot is required');
	integer(data.snapshot.fetchedAtMs, 1, 'fetchedAtMs');
	if (!Array.isArray(data.snapshot.windows) || !data.snapshot.windows.length) fail('snapshot windows are required');
	const seen = new Set();
	for (const window of data.snapshot.windows) {
		object(window, ['id', 'remainingPp', 'resetAtMs'], 'snapshot window');
		identifier(window.id, 'window id');
		if (seen.has(window.id)) fail('duplicate snapshot window');
		seen.add(window.id);
		percentage(window.remainingPp, 'remaining quota');
		integer(window.resetAtMs, 1, 'resetAtMs');
	}
	for (const field of ['job', 'reservations']) {
		record(data[field], field);
		for (const [id, amount] of Object.entries(data[field])) {
			identifier(id, 'window id');
			percentage(amount, field, field === 'job');
		}
	}
	return data;
}

function jsonCopy(value) {
	// Reject lossy JSON conversion (NaN, undefined, class instances) before detaching.
	function check(item) {
		if (item === null || typeof item === 'string' || typeof item === 'boolean') return;
		if (typeof item === 'number' && Number.isFinite(item)) return;
		if (Array.isArray(item)) {
			for (const child of item) check(child);
			return;
		}
		if (typeof item === 'object' && Object.getPrototypeOf(item) === Object.prototype) {
			for (const child of Object.values(item)) check(child);
			return;
		}
		fail('expected finite JSON data');
	}
	check(value);
	return JSON.parse(JSON.stringify(value));
}

function object(value, keys, label) {
	record(value, label);
	if (Object.keys(value).length !== keys.length || keys.some((key) => !Object.hasOwn(value, key))) {
		fail(`${label} has missing or unknown fields`);
	}
}

function record(value, label) {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object`);
}

function identifier(value, label) {
	if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._:@/-]{0,199}$/.test(value)) {
		fail(`${label} must be a nonempty identifier`);
	}
}

function integer(value, minimum, label) {
	if (!Number.isSafeInteger(value) || value < minimum) fail(`${label} must be a safe integer >= ${minimum}`);
}

function percentage(value, label, positive = false) {
	if (typeof value !== 'number' || !Number.isFinite(value) || value > 100 || (positive ? value <= 0 : value < 0)) {
		fail(`${label} must be ${positive ? 'positive and ' : ''}between 0 and 100 percentage points`);
	}
}

function fail(message) {
	throw new TypeError(message);
}
