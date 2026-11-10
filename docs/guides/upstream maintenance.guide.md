ASDS protocol: v0.2

# Upstream maintenance

Keep this fork inexpensive to maintain. `main` is the upstream mirror;
`workshop` carries isolated additions. No release automation is enabled by
adopting this guide. The intended maintenance owner is Ghost, with scoped access
and an explicitly configured runner; no handoff/recurring job is yet installed.

Fetch upstream and record the current base and candidate release/revision.
Review release/security notes and changes affecting providers, credential storage,
execution, dependencies and public contracts. Fast-forward a clean mirror where
possible; merge the candidate into a temporary maintenance branch from workshop.
Preserve authored work. Conflicts, changed capabilities and qualification needs
are reported rather than hidden or resolved by dropping fork functionality.

Propose the exact integration revision for review. Tests are owner-controlled;
inherited GitHub workflows remain disabled until explicitly selected/authorized.
Do not enable upstream publication, scheduled scans or test suites incidentally.
Once qualified under the agreed scope, promote a pinned deployment at an idle
boundary, retaining the previous revision and state-compatible rollback. Never
hot-swap a running asset job or overwrite active settings with repository defaults.

Use Git for source transfer. Keep credentials/host paths out of this public repo.
[[records/bootstrap and remote execution.record]] retains the initial upstream
revision; [[issues/first end-to-end workshop.issue]] owns maintenance integration.
