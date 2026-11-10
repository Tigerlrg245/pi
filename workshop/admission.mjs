// Pure, fail-closed quota admission; this module never reserves or launches work.
import { parseAdmissionInput, parseSettings } from './schema.mjs';

/** Decide whether one job may enter the active slot from external settings and account data. */
export function evaluateAdmission(settingsValue, inputValue) {
	let settings;
	let input;
	try {
		settings = parseSettings(settingsValue);
		input = parseAdmissionInput(inputValue);
	} catch (error) {
		return { admitted: false, reason: 'invalid-input', detail: error.message };
	}
	const deny = (reason) => ({ admitted: false, reason });
	if (settings.mode !== 'GREEN') return deny('red');
	if (!input.machineReady) return deny('machine-not-ready');
	if (input.activeJobs !== 0) return deny('job-slot-occupied');
	const { snapshot, nowMs } = input;
	const limits = settings.limits;
	if (snapshot.accountId !== settings.accountId) return deny('account-mismatch');
	const ageMs = nowMs - snapshot.fetchedAtMs;
	if (ageMs < -limits.futureToleranceMs) return deny('future-snapshot');
	if (ageMs > limits.maxSnapshotAgeMs) return deny('stale-snapshot');
	const ids = Object.keys(limits.windows);
	if (snapshot.windows.length !== ids.length || snapshot.windows.some((window) => !Object.hasOwn(limits.windows, window.id))) {
		return deny('window-set-mismatch');
	}
	for (const field of [input.job, input.reservations]) {
		if (Object.keys(field).length !== ids.length || ids.some((id) => !Object.hasOwn(field, id))) {
			return deny('window-set-mismatch');
		}
	}
	const budgets = [];
	for (const window of snapshot.windows) {
		// A reset must still be in the future, even within snapshot clock tolerance.
		if (window.resetAtMs <= nowMs || window.resetAtMs <= snapshot.fetchedAtMs) return deny('reset-not-future');
		const limit = limits.windows[window.id];
		const requestedPp = input.job[window.id];
		if (requestedPp > limit.maxJobPp) return deny('job-limit-exceeded');
		const foregroundPp = limit.foregroundPpPerDay * ((window.resetAtMs - nowMs) / 86_400_000);
		const availablePp = window.remainingPp - limit.hardReservePp - foregroundPp - input.reservations[window.id];
		const requiredPp = requestedPp + limit.safetyHeadroomPp;
		if (!Number.isFinite(availablePp) || availablePp < requiredPp) return deny('insufficient-budget');
		budgets.push({ id: window.id, availablePp, requiredPp });
	}
	return { admitted: true, reason: 'within-limits', settingsRevision: settings.revision, budgets };
}
