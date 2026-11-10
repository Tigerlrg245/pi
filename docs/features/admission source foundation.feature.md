ASDS protocol: v0.2

# Admission source foundation

The initial source slice implements standalone, dependency-free Node modules:
[admission](../../workshop/admission.mjs),
[settings store](../../workshop/settings-store.mjs) and
[boundary schema](../../workshop/schema.mjs). Their exact API and limitations
are in [the module README](../../workshop/README.md).

The pure policy evaluates fresh account-bound window data against explicit
reserve, foreground, job and headroom limits. Missing configuration defaults red;
new work is denied when another job is active or machine/quota conditions fail.
It returns a decision and never launches, reserves or cancels a job.

The store accepts an external state path and revision-checked replacement. It
uses a per-path queue, exclusive lock, temporary file, fsync and rename. Invalid
state throws rather than silently permitting spending. A stale crash lock needs
operator reconciliation; filesystem durability and restart behavior have not
been exercised. Do not mistake source mechanisms for acceptance evidence.

This is an undeployed source foundation, not an HTTP service, durable scheduler,
mobile control or live Pi worker. No tests or smoke checks ran. Root checking was
not run because its command includes a browser smoke step; no dependencies were
installed. The code was inspected, not executed. No credential, live quota
adapter or fabricated production snapshot is embedded.

[[specs/admission and feedback.spec]] retains the wider target contract and
[[issues/first end-to-end workshop.issue]] owns the remaining queue, quota,
transport, worker, results and phone integration. Update this feature as those
capabilities actually exist and receive evidence.
