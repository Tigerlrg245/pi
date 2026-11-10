ASDS protocol: v0.2

# Bootstrap and remote execution

2026-11-10 source/API inspection. Created `Tigerlrg245/pi` as a public GitHub fork
of `earendil-works/pi`; original `badlogic/pi-mono` URLs refer to this upstream.
Initial base: `b2aabe02966a6b4528c7498a3bb406c14396932d`. `workshop` is the fork's
integration branch; `main` remains the upstream baseline. GitHub Actions were
disabled on the new fork before publishing additions, to avoid inherited CI tests
or publication jobs without authorization. No dependencies or hooks installed.

## Remote work exists upstream

[pi-env README](../../packages/env/README.md) documents a Rust remote daemon,
`RemoteExecutionEnv`, SSH bootstrap with host-key checking and Linux/macOS/Windows
x86-64/arm64 support. Windows bootstrap uses PowerShell; argv commands execute
directly, string commands use Git Bash. Windows PTYs are not supported, but pipe
process execution is documented. [p2 remote environments](../../apps/p2/docs/remote-envs.md)
already integrate this while keeping model calls, storage and credentials on the
orchestrator. The plain CLI separately has an SSH extension example.

Therefore Beast-orchestrator/PC-tools is feasible at the source-contract level.
This is not OpenClaw node pairing and does not establish a working connection,
installed daemon, Windows SSH access or Unity CLI execution in this deployment.
Prefer this upstream facility over inventing another node protocol. If it proves
unsuitable, running the worker directly on the PC remains the authorized fallback;
server-owned policy stays on the always-on orchestration host.

## Reset source

Fetched [codex-reset.com/api/feed](https://codex-reset.com/api/feed), HTTP 200 JSON:
version 1, fetched_at, stale, source, signal, and source-linked tweet records.
At inspection signal was null; the home page said no official upcoming reset
window. Its probability forecast and banked-reset counters are not account quota.
The site describes itself as independent. Treat its classifiers and prose as
untrusted advisory data; never executable instructions or authority to redeem a
reset. [[specs/admission and feedback.spec]] defines the intended signal boundary.

No model job, software test, Blender/Unity operation, remote deployment or phone
acceptance performed. [[issues/first end-to-end workshop.issue]] owns next work.
