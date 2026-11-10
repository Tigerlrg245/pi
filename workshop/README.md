# Workshop admission foundation

Experimental, dependency-free Node ESM modules, separate from Pi core. This is
source scaffolding, not an operational job service. Nothing here calls a quota
API, queues or launches a process, serves HTTP, schedules jobs, or implements a UI.
No tests, smoke checks, builds, or real workloads have been run for this slice.

## Server-owned settings

`createSettingsStore(absoluteStatePath)` from `settings-store.mjs` returns
`read()` and `update(expectedRevision, replacement)`. The caller supplies a file
in an existing private directory outside the checkout and all other Git working
trees. The checkout restriction is enforced; other repositories are the caller's
responsibility. Use a local filesystem with atomic same-directory rename and
file/directory fsync support; cross-platform filesystem behavior is unverified.

A missing file reads as `{schemaVersion: 1, revision: 0, mode: 'RED',
accountId: null, limits: null}`. A malformed/unreadable file throws; it is never
silently replaced. `replacement` is the complete settings object with its old
revision. A save validates it, checks the expected revision under a lock, increments
the revision, syncs a private temporary file, renames it, then syncs the directory.
Only then does the update resolve. Calls in one process are serialized per path;
an exclusive `.lock` file rejects competing processes. A crash can leave a lock or
temporary file: operator recovery must first establish that no writer is alive.
Do not delete a lock automatically. A save error after rename can mean the new
revision is present but its durability was not acknowledged; reload before retry.

The phone is not the owner of settings. A future server must call this API and
acknowledge the returned revision before showing changes as saved. Disconnects
do not undo acknowledged settings; offline unsent edits are not saved. Persisted
GREEN survives restart, but a fresh readiness/quota decision is still required.

Settings contain exactly:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | `1` |
| `revision` | Nonnegative safe integer, managed by the store |
| `mode` | `RED` (deny) or `GREEN` (bounded admission only) |
| `accountId` | Exact opaque account identifier, or `null` while unconfigured |
| `limits` | `null`, or the explicit configuration below |

`limits` has `maxSnapshotAgeMs` (positive safe integer), `futureToleranceMs`
(integer from 0 to 5000; explicitly use `0` unless a small clock tolerance is
justified), and `windows`, a nonempty map of quota-window IDs to:

| Window limit | Unit / requirement |
| --- | --- |
| `hardReservePp` | Percentage points, 0–100 |
| `foregroundPpPerDay` | Percentage points per 24 hours, 0–100 |
| `safetyHeadroomPp` | Percentage points, greater than 0 and at most 100 |
| `maxJobPp` | Upper estimate cap per job, greater than 0 and at most 100 |

GREEN cannot be saved without an account and all limits explicitly configured.
There are no automatic numeric spending defaults. Identifiers are 1–200 ASCII
characters, starting alphanumeric, then alphanumeric or `._:@/-`.

## Pure admission

`evaluateAdmission(settings, input)` from `admission.mjs` returns
`{admitted: false, reason}` (with a validation detail for invalid input), or
`{admitted: true, reason: 'within-limits', settingsRevision, budgets}`. All external
values are validated, including finite numbers, exact object fields, percentage
ranges, duplicate windows, positive known resets and complete matching windows.
Exceptions while parsing become a denial, not an admission.

The input contains exactly:

| Field | Meaning |
| --- | --- |
| `nowMs` | Server time, positive safe integer Unix milliseconds |
| `machineReady` | Server-observed boolean readiness |
| `activeJobs` | Nonnegative safe integer active/in-flight count; must be zero |
| `snapshot` | `{accountId, source: 'account-api', fetchedAtMs, windows}` |
| `snapshot.windows` | Nonempty array of `{id, remainingPp, resetAtMs}` |
| `job` | Map of every configured window ID to positive upper estimated job cost (percentage points, at most 100) |
| `reservations` | Map of every configured window ID to aggregate outstanding reserved percentage points, 0–100 |

The snapshot must be account-bound, fresh, not excessively future-dated, and
include exactly every configured window; extra or missing snapshot windows deny
admission rather than being ignored. Every reset must be later than both
server time and snapshot time. Configure all applicable account windows: omitting
one from both settings and snapshot is not detectable here. A trusted account
adapter must supply actual remaining quota and actual reset times. A caller's
`source` string is not cryptographic proof; do not pass phone/client or third-party
predictions as authoritative quota data. This module does not predict resets.

For **every** window, in percentage points:

```text
available = remaining - hardReserve
            - foregroundPpPerDay * (actualResetMs - nowMs) / 86400000
            - outstandingReservations
required  = upperJobEstimate + safetyHeadroom
admit only if available >= required AND upperJobEstimate <= maxJobPp
```

The foreground allowance covers the entire time to that window's actual reset,
including fractional days; it is not an arbitrary one-day subtraction. For
example, 60 remaining, 10 reserve, 4/day with 2 days left, and 3 reserved leaves
39 points; an upper estimate of 35 plus 5 headroom is denied.

## Integration still required

Admission is advisory and has no side effects. A future coordinator must own the
single active/in-flight job slot, atomically recheck settings/quota/readiness and
reserve budget before launch, prevent simultaneous decisions from both
spending the same allowance, and conservatively reconcile reservations with
quota refreshes. Reevaluate at launch and after restart; no saved decision is a
standing authorization. An existing queued backlog does not occupy that active
slot and is not an input to this policy. Account changes must not inherit another account's
reservations. Settings locking alone does not solve the admission/launch race.

Still absent: authenticated control transport, phone saved/pending states, actual
account quota adapter, machine readiness adapter, durable job/reservation state,
failure recovery, cancellation/process supervision, provider cost-bound enforcement,
and runtime verification. An upper estimate and safety margin cannot guarantee a
provider will stop at the estimate. RED's process-control semantics and reactions
to later settings changes belong to the future coordinator, not this pure policy.
