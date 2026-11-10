ASDS protocol: v0.2

# Admission and feedback

Implements the intended behavior in
[[requirements/persistent mission control.requirement]]. This document is a
design contract; code existence is not deployment or runtime acceptance.

## Ownership and topology

The orchestration host owns persistent settings and the scheduler. The existing
mobile Hub receives a Workshop view beside its read-only research status views.
Do not turn those existing read-only endpoints into arbitrary execution routes.
Workshop control writes require separate authenticated authorization and revision
checks. The desktop/phone does not own the scheduler. If the worker eventually
runs on a PC instead, policy still lives on the always-on host and the worker
needs a short-lived admission lease; lost connectivity prevents further stages.

Use a small external controller and Pi extensions/RPC before altering upstream
agent internals. Initial concurrency is one backlog job. Remote execution uses
upstream pi-env where qualified; see the actual source evidence in
[[records/bootstrap and remote execution.record]].

## Policy and persistence

Persist red/green, account binding, protected reserve, daily foreground allowance,
per-job bound, snapshot maximum age, revision and update time in server storage
outside the checkout. First start is red. Green requires explicitly configured
limits. Invalid state fails closed, not a silent reset to permissive defaults.
Use atomic writes with expected revision; concurrent stale phone edits fail with
the current revision. A saved acknowledgement means durable server state, not a
browser-local flag. Preserve settings across restarts and disconnected clients.

For each applicable provider limit window, use percentage points of that window:

`available = remaining - hardReserve - dailyForeground * daysUntilReset - reservedInFlight`

Admit only if the bounded job estimate plus safety headroom fits every reported
window, the account and observation freshness are valid, a future reset is known,
green is set, and required execution resources are available. Recheck at stage
boundaries. Validate finite numbers, ranges, timestamps and identity at the input
boundary. Changing usage from other clients means admission cannot guarantee no
overrun: combine conservative reservations with turn/time bounds and checkpointing.
Do not infer subscription consumption from API dollar prices or raw token totals.

Scheduled account reset is authoritative for the basic budget. Optional trusted,
explicit dated reset announcements can later offer a bounded earlier-deadline
policy while preserving the hard reserve; they never create additional remaining
allowance. Speculative probabilities/teasers are display-only. Banked resets are
shown separately and never automatically redeemed. Require a new account reading
after an announced reset before changing actual available capacity. Stale,
withdrawn, ambiguous or elapsed announcements revert to normal account timing.
Initial admission code consumes only real account reset timestamps; announcement
integration is deferred until provenance/expiry handling exists.

## Jobs, results and feedback

The future durable queue uses stable job IDs, attempt IDs, current stage, bounded
retry count, lease expiry and saved checkpoint. States distinguish queued,
waiting-for-budget, waiting-for-host, running, awaiting-review, accepted, failed
and cancelled. Restart reconciles an unfinished attempt before replay; it does
not duplicate a Unity operation or discard the best artifact.

A result manifest binds asset ID, source revision, attempt, stage, artifact hashes,
render/clip references, actual checks, limitations and next action. Preview files
remain private, served only through authenticated artifact access. Paths supplied
by a phone are not executable paths or arbitrary filesystem reads. Feedback stores
result revision, decision (approve/request-changes/reject), comment and timestamp.
An approval of an old revision never approves a new one. Agent visual critique,
owner design approval, engine qualification and headset acceptance remain distinct.

The gallery is an aggregated view, not another artifact owner. Clients show last
server update and offline/stale state; no silent replay of offline destructive or
green-light edits. Text requests and optional references should be enough to add
work; defaults come from a style brief, not repeated mandatory questionnaires.

[[guides/workshop execution.guide]] gives the production loop;
[[issues/first end-to-end workshop.issue]] tracks implementation gaps.
