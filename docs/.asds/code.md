# ASDS v0.2 code package

Requirements express intention; specs retain detailed design; features explain
realized capability. No mandatory chain, pairing or reciprocal links. Bugs
preserve software defect reproduction and diagnosis.

## requirement

A requirement is an accepted need or constraint that the project should satisfy, preserve, or respect. It is intentionally broad and may include hard requirements, design needs, accepted constraints, or principle-like obligations.

Create a requirement when an issue, design need, or recognized constraint has become important enough to treat as an accepted condition on future work.

Edit a requirement when its meaning, acceptance conditions, interpretation, related specs, features, executable tests, or historical context change.

Retire or merge a requirement when it is superseded, mistaken, or duplicative.

A requirement often links to issues, specs, features, executable tests, ADRs, records, and tools. Other nodes should point back to requirements they satisfy, clarify, validate, or explain.

A requirement should include the accepted need, why it matters, and how one
would know whether it is met or respected. It does not assert implementation.
Acceptance conditions may be automated, partially automated, or require user
validation. A relevant feature describes actual fulfillment and limitations;
neither node requires a one-to-one counterpart.

## spec

A spec is the detailed, implementation-ready definition of chosen behavior or design. It makes a contract concrete enough to build and maintain; it is not a higher acceptance status than a requirement.

Create a spec when a chosen design needs implementation-ready precision to
avoid drift. It may refine requirements or define a communication/interface
contract without its own directly corresponding requirement or feature.

Edit a spec when interfaces, behavior, constraints, structure, or implementation assumptions become clearer.

Keep a spec after implementation while its design contract remains relevant.
Retire or merge it when superseded, duplicative or genuinely no longer useful;
feature existence alone is not a retirement condition.

A spec often links to requirements, features, executable tests, ADRs, records, and implementation or validation tools.

A spec should include chosen behavior/design, scope, interfaces, key constraints
and their rationale, and enough detail to implement or maintain the contract.
Link relevant requirements, capabilities and code without copying their entire
accounts. Spec existence or a code link does not prove implementation.

## feature

A feature explains an implemented capability as it actually exists, at a higher
level than a detailed spec or individual functions. It is the current-state
counterpart to the intention expressed in requirements, not the last stage of
every spec. It explains purpose, current scope and how the capability is realized.

Create a feature when implementation is concrete enough that the project should maintain a live description rather than only an issue, requirement, or spec.

Edit a feature whenever behavior, limitations, linked tests, linked bugs, validation, or navigation changes.

Retire or merge a feature when the capability is removed, folded into another feature, or preserved only as history.

A feature often links to requirements, specs, executable tests, bugs, ADRs, records, and relevant tools. Other nodes should point to it when they explain, validate, break, or depend on the implemented capability.

A feature should explain what exists now, why it is useful, important limits,
and relevant code locations. Link applicable specs, requirements and validation
rather than reproducing detailed contracts or listing every function. State
partial fulfillment and evidence limits honestly. Specs and features may each
stand alone or relate many-to-many; no placeholder counterpart is required.

## bug

A bug captures wrong behavior, failure, regression, or a defect worth tracking. It should make the problem easier to reproduce, explain, validate, and remember.

Create a bug when behavior diverges from expectation in a way that deserves stable tracking, especially when reproduction, diagnosis, validation, or history would otherwise get lost.

Edit a bug when reproduction improves, diagnosis becomes clearer, impact changes, or linked tests, tools, or fixes change how the bug should be approached.

Retire a bug when it is fixed and kept as history, merged into another bug, or determined not to be real.

A bug often links to issues, features, executable tests, tools, records, and sometimes requirements or specs.

A bug should include symptoms, expected-versus-actual behavior, reproduction steps if possible, impact, diagnosis when known, and the nodes most useful for understanding or validating it.
