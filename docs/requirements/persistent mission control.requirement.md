ASDS protocol: v0.2

# Persistent mission control

Accepted owner direction, 2026-11-10: build a low-maintenance backlog for editable
3D assets and later systems, using surplus Codex capacity. Control it from the
existing mobile Hub; do not require the phone to remain connected or awake.

The always-on orchestration host owns saved settings, queue state, quota reads,
admission and result/feedback records. The phone is only a client. Disconnecting
it does not revoke previously saved green light or discard limits. A disconnected
client must not claim new changes are saved; on reconnect it fetches the current
server revision before committing edits. Remote control itself still needs a
connection to the private network. Do not expose a public endpoint merely to
make offline controls appear functional.

Green permits spending up to a limit based on remaining usage and time to reset;
it is never an unlimited-spend override. Red blocks new jobs/stages and requests
a safe checkpoint. Explicit cancel is distinct. Keep an owner-configurable hard
reserve, foreground budget and per-job bound. Missing/stale usage waits. Persist
all changes before acknowledging them. Observe reset announcements without
mistaking speculative forecasts or banked-reset grants for available capacity.

The phone eventually shows current phase, last progress, previews/clips, evidence
and limitations, and accepts revision-bound approval or requested changes.
ASDS records intent and unresolved work; it is not the runtime queue. Modern and
fantasy are separate style lanes; a missing fantasy brief does not authorize
inventing its setting. Qwen routing is deferred; initial provider is Codex.

[[specs/admission and feedback.spec]] defines the first contracts;
[[issues/first end-to-end workshop.issue]] distinguishes unbuilt integrations.
Update this requirement when the owner's intended control or autonomy changes.
