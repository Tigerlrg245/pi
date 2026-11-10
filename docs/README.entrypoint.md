ASDS protocol: v0.2

# Workshop documentation

This is the fork's single ASDS root. It documents a small, restartable backlog
controller around Pi, not a replacement for the upstream package documentation.
Upstream coding-agent docs remain in `packages/coding-agent/docs/`.

Read [[requirements/persistent mission control.requirement]] for accepted needs,
[[specs/admission and feedback.spec]] for the chosen initial design,
[[guides/workshop execution.guide]] for the asset loop, and
[[records/bootstrap and remote execution.record]] for actual bootstrap evidence.
[[issues/first end-to-end workshop.issue]] owns remaining integration work.
[[guides/upstream maintenance.guide]] describes the intended maintenance role.
[[features/admission source foundation.feature]] explains the limited source
slice and explicitly unimplemented integrations.

Base and code guidance are installed at [.asds/base.md](.asds/base.md) and
[.asds/code.md](.asds/code.md), copied from ASDProtocol revision
`648b0c90b5321ef42e4240e2f74dc0a7fdee6794`. No local type overrides. Nodes use
full docs-root wikilinks and filename suffixes. This is developing v0.2, not a
claim of a general protocol release.

Stage changed files, review/acknowledge through the paired `asds_registry.py`
and `asds_review.py` tools at that revision, stage `.asds/review-registry.json`,
then commit. Registry review is not software testing. No software tests, smoke
checks or CI test runs without explicit owner authorization. The upstream root
`npm run check` includes a browser smoke step and is not exempt from that rule.

Keep source and generic contracts public-safe. Credentials, account identities,
hosts, private briefs, reference media, assets and runtime state stay outside this
repository. Private asset projects own their own detailed ASDS acceptance criteria.
