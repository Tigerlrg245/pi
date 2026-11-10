ASDS protocol: v0.2

# First end-to-end workshop

Owner request, 2026-11-10: move from design to a usable low-maintenance backlog,
starting with practical 3D assets and decorations from the existing XR workflow.
Fork creation and a source foundation are not a running workshop.

Implement in this order, retaining the single controller and existing mobile Hub:

1. Source-only settings/admission core exists in
   [[features/admission source foundation.feature]]; qualify it under an explicitly
   authorized scope, then add durable queue/leases and stage records.
2. Fresh account-bound Codex quota adapter, including applicable window/reset
   semantics. Do not scrape a chat status line into permanent scheduling truth.
3. Pi worker integration and bounded job/reservation accounting; qualified PC
   transport through upstream pi-env, or PC-local worker fallback.
4. Authenticated Workshop API and controls in the existing mobile Hub, keeping
   research status routes read-only. Always-on host persistence is required.
5. One Blender asset through private result storage to a phone preview; then
   revision-bound feedback and a retained-source revision. A disconnected phone
   must not stop already saved policy. No claims of offline remote editing.
6. Explicit reset-announcement metadata and bounded opt-in policy, Ghost upstream
   maintenance integration, then additional models/animations and Qwen experiments.

Concrete remaining deployment conditions: live quota credentials/adapter not wired;
PC execution availability and Windows SSH/daemon not qualified; service and phone
integration not deployed; no software test authorization or handset acceptance
evidence. These do not block continued source work. Keep actual evidence in
[[records/bootstrap and remote execution.record]], design in
[[specs/admission and feedback.spec]], and production procedure in
[[guides/workshop execution.guide]].

Completion means an authorized job is admitted under saved limits, interrupted and
resumed without duplicate work, produces attributable previews, and receives
revision-bound feedback through the existing mobile application. Documentation
and source review alone do not meet that end-to-end criterion.
