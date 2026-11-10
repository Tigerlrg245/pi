// Server-owned settings with revision checks and atomic, durable replacement.
import { open, readFile, realpath, rename, unlink } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { parseSettings } from './schema.mjs';

const queues = new Map();
const checkout = fileURLToPath(new URL('..', import.meta.url));

/** Create a store in an existing external directory. All I/O happens on read/update. */
export function createSettingsStore(statePath) {
	if (typeof statePath !== 'string' || !isAbsolute(statePath)) throw new TypeError('statePath must be absolute');
	const requestedPath = resolve(statePath);
	return {
		/** Read durable settings; only a missing file yields RED revision zero. */
		read: () => operation(requestedPath, readSettings),
		/** Replace settings after a revision match; resolves only after durable save. */
		update: (expectedRevision, replacement) => {
			if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || expectedRevision === Number.MAX_SAFE_INTEGER) {
				return Promise.reject(new TypeError('expectedRevision must allow a safe increment'));
			}
			let next;
			try {
				// Validate before queuing so callers cannot mutate a pending save.
				const parsed = parseSettings(replacement);
				if (parsed.revision !== expectedRevision) throw new TypeError('replacement revision must match expectedRevision');
				next = { ...parsed, revision: expectedRevision + 1 };
			} catch (error) {
				return Promise.reject(error);
			}
			return operation(requestedPath, async (path) => {
				const current = await readSettings(path);
				if (current.revision !== expectedRevision) {
					const error = new Error('settings revision conflict; reload before saving');
					error.code = 'REVISION_CONFLICT';
					throw error;
				}
				await writeSettings(path, next);
				return next;
			});
		},
	};
}

async function operation(requestedPath, action) {
	// Canonicalize the directory so aliases share the same single-process queue.
	const directory = await realpath(dirname(requestedPath));
	const repository = await realpath(checkout);
	const location = relative(repository, directory);
	if (location === '' || (!location.startsWith(`..${sep}`) && location !== '..' && !isAbsolute(location))) {
		throw new Error('settings must live outside the source checkout');
	}
	const path = join(directory, basename(requestedPath));
	const previous = queues.get(path) ?? Promise.resolve();
	const pending = previous.catch(() => {}).then(async () => {
		// An exclusive lock also rejects another process; never steal a stale lock.
		const lockPath = `${path}.lock`;
		const lock = await open(lockPath, 'wx', 0o600);
		try {
			return await action(path);
		} finally {
			await lock.close();
			await unlink(lockPath);
		}
	});
	queues.set(path, pending);
	try {
		return await pending;
	} finally {
		if (queues.get(path) === pending) queues.delete(path);
	}
}

async function readSettings(path) {
	let content;
	try {
		content = await readFile(path, 'utf8');
	} catch (error) {
		if (error.code !== 'ENOENT') throw error;
		return { schemaVersion: 1, revision: 0, mode: 'RED', accountId: null, limits: null };
	}
	return parseSettings(JSON.parse(content));
}

async function writeSettings(path, settings) {
	const temporary = `${path}.${randomUUID()}.tmp`;
	try {
		const file = await open(temporary, 'wx', 0o600);
		try {
			await file.writeFile(`${JSON.stringify(settings, null, 2)}\n`, 'utf8');
			await file.sync();
		} finally {
			await file.close();
		}
		await rename(temporary, path);
		const directory = await open(dirname(path), 'r');
		try {
			await directory.sync();
		} finally {
			await directory.close();
		}
	} finally {
		await unlink(temporary).catch((error) => {
			if (error.code !== 'ENOENT') throw error;
		});
	}
}
