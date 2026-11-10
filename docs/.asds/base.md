# ASDS v0.2 base package

Shared rules apply to every installed extension. Filename suffixes identify types;
do not emit `Node type:` fields or create `.node.md` documents.


Choose a type by the document's purpose, not by a compulsory sequence. Shared
semantics supply expectations; do not repeat the whole type reference in each
node or turn its prompts into mandatory headings.

Explain the subject, purpose and rationale for non-obvious definitions or
constraints. Supply the background needed to understand the node; where more
knowledge belongs elsewhere, introduce it and provide a relevant wikilink at
that point. A paragraph or two may suffice. Be straightforward, not cryptic;
do not assume the reader has the original conversation. This applies to all
node types, including optional extensions, not just specs.

Keep one canonical detailed contract where practical. Brief repeated facts can
make an explanation readable, but avoid maintaining a second full assertion of
the same contract. Distinguish accepted intent, observed behavior, inference,
open questions and dated evidence. An implementation gap is not necessarily a
contradiction: do not weaken intended behavior or overstate existing behavior
merely to make documents agree.

Use an existing issue when it already describes a coherent remaining gap;
narrow or retire it as work is resolved, preserving useful evidence in its
ordinary owner. Neither each gap nor each review candidate requires a new file.
A completed review is not completed implementation or requirement satisfaction.

Update current-facing explanations as their meaning changes. Preserve dated
history as history: a statement about what was unsupported then need not be
rewritten as a statement about today. Explain supersession and route readers
to current owners rather than accumulating competing status summaries.

## Links

Links are explicit, Obsidian-style wikilinks in v0.1 and v0.2.

Use:

- `[[path/to/node]]` for an internal ASDS node link
- `[[path/to/node|Display name]]` when the visible label should differ
- `[[path/to/node#Heading]]` for a heading anchor when needed

The link target should be the full path from the ASDS documentation root, without the `.md` extension. For example, from any node in the same project:

```markdown
[[requirements/status dashboard.requirement]]
[[specs/web dashboard.spec|web dashboard spec]]
```

Prefer full paths over bare titles so links remain unambiguous as the network grows. A bare link such as `[[web dashboard.spec]]` is acceptable only when the target is unique and local convention explicitly allows it.

Explain connections in ordinary prose and place each wikilink where a reader
encounters that explanation. Links are not formally typed in v0.1 or v0.2;
headings such as `Satisfied by` do not become edge types.

The network should behave more like a small Wikipedia than a strict graph database. Links should be intentional, readable, and useful to the next human or agent. A node should link outward to nearby docs that explain its purpose, ground it in implementation or validation, record a relevant decision, preserve history, or provide a tool for acting on it.

Remove links when they are stale, misleading, redundant, or preserve dead context that no longer matters.

ASDS tools may group nodes by folder, node type, or explicit links. They should not invent inferred graph edges from folder names, node titles, or the usual implementation chain. If a relationship matters, write the wikilink in the Markdown.

Search by filename, keyword (including ripgrep), semantic similarity or other
appropriate methods as well as following links. Explicit wikilinks supplement
these methods; they do not exhaust the project's semantic relationships. Tools
must distinguish authored edges from inferred search candidates, but agents are
not restricted to edge traversal. Connectivity is not a correctness criterion.

## issue

An issue is the origin-stage node. It captures a user request, AI suggestion, suspected problem, report, or other incoming concern before the project fully commits to what it is.

Create an issue when the origin matters, when there may later be acceptance or rejection, or when the item may branch into a requirement, bug, record, or other specialized node.

Edit an issue when its origin, framing, acceptance/rejection, or downstream path becomes clearer.

An issue often links to requirements, bugs, records, tools, and nearby context. Preserve provenance, but remove links that only keep stale framing.

An issue should include what arrived, where it came from, why it seemed worth recording, and the next likely interpretation paths.

## blocker

A blocker captures a specific unresolved condition that prevents or materially risks the next responsible development step.

Create a blocker when progress needs human design input, missing information, environment access, credentials, permissions, an unavailable data source, a failing tool or API, a technical failure fix, or an external state change before work can continue responsibly.

A blocker is not limited to the gap between issue and requirement. It may block an issue from becoming a requirement, a requirement from becoming a spec, a spec from becoming a feature, a feature from being validated, or any similar step in the ASDS network.

Edit a blocker when the blocked path, known facts, needed input, retry condition, workaround, owner, or resolution changes.

Remove a blocker when the input is supplied, the environment is fixed, the tool/API failure is worked around, or the blocked path becomes obsolete. Before removing it, fold any durable decision, requirement, spec, feature, guide, record, or context into the ordinary ASDS nodes it was blocking. Git history is the normal historical record for resolved blockers; the active ASDS graph should not keep resolved blockers unless there is a deliberate reason.

A blocker often links to the issue, requirement, spec, feature, bug, guide, tool, or context node whose progress is blocked. Other nodes should point to a blocker when it explains why the next step is paused or unsafe. Remove those links when deleting the resolved blocker, replacing them with links to the node that now carries the durable decision.

A blocker should include what is blocked, why it is blocked, what kind of blocker it is, what is needed, any available workaround, and the retry or closure condition.

## query

A query captures a durable question, missing context, unclear intent, contradictory source, missing reference, or weak understanding that does not currently block the next responsible step but may affect future interpretation, implementation, or maintenance.

Create a query when an uncertainty is important enough that future humans or agents should see it before confidently editing nearby nodes, but not urgent enough to pause current work as a blocker.

Edit a query when evidence, human answers, related nodes, current assumptions, or the risk of ignoring it changes.

Resolve a query by folding any durable answer into the ordinary ASDS nodes it affects, such as context, issue, requirement, spec, feature, guide, ADR, or record nodes. Remove the query when it no longer adds useful active graph context. Keep it as a record only when the history of the question still matters.

A query often links to affected requirements, specs, features, issues, ADRs, blockers, context nodes, records, or executable tests. Other nodes should point to a query when the query is an important warning about how to read or modify them.

A query should include the question or missing context, why it matters, the current working assumption if one exists, affected nodes, evidence needed to resolve it, risk if ignored, and the expected promotion or closure path.

Do not use a query as a raw chat transcript. If a human-agent Q&A resolves the uncertainty, fold the answer into the relevant nodes and retire or update the query.

## entrypoint

An entrypoint is meant to be read early, especially by an agent. It routes readers toward the most relevant nearby nodes without unnecessary context overload.

Create an entrypoint when a project, subdomain, workflow, or documentation root needs a clear front door for navigation.

Edit an entrypoint when the recommended reading path, important neighboring nodes, local node conventions, or navigation role changes.

Retire an entrypoint when a better one replaces it or when a local sub-entrypoint no longer needs to exist separately.

An entrypoint often links to issues, requirements, specs, features, tools, ADRs, records, context nodes, and executable tests.

An entrypoint should include who it is for, when it should be read, where the
reader should go next, and local node-reference differences. Introduce purpose
and essential vocabulary before specialized operational routes. Route different
reading needs to their owners; do not make the front door an accumulated status
journal or require every reader to load the entire graph.

## context

A context node provides broad orientation for understanding the repository or a subsystem. It is for project overview, coding conventions, naming conventions, architectural orientation, vocabulary, and other material that shapes how the rest of the network should be read.

Create a context node when repository-wide or subsystem-wide guidance should stay visible and linkable.

Edit a context node when guidance becomes clearer, conventions change, project structure shifts, or the node no longer routes readers effectively.

Retire or merge a context node when it has been replaced, absorbed into another context node, or no longer reflects how the repository is understood.

A context node often links to entrypoints, requirements, specs, features, ADRs, records, and tools.

A context node should include what area it orients, why that orientation matters, and which nodes a reader should visit next.

## guide

A guide is an actionable workflow or procedure node. It explains how a human or agent should carry out a recurring task, especially when the steps are more operational than broad `context`, less binding than a `requirement`, and not an implementation-ready `spec`.

Create a guide for agent startup workflows, repository-specific development procedures, migration playbooks, testing or verification routines, release/update checklists, recurring debugging procedures, and other repeatable processes that should be easy to follow.

Edit a guide when the workflow changes, prerequisites shift, a step becomes misleading, linked tools or validation paths change, or the guide no longer reflects the safest or preferred way to do the work.

Retire or merge a guide when a better guide replaces it, the workflow disappears, or the procedure has become fully represented by a tool, executable test, or another appropriate surface.

A guide often links to entrypoints, context nodes, tools, executable tests, requirements, specs, features, records, and ADRs. Other nodes should point to a guide when it is the recommended way to perform or validate nearby work.

A guide should include when to use it, prerequisites, the procedure, expected outputs or completion checks, important cautions, and nearby nodes that explain context or validation.

## tool

A tool describes a capability that changes what a human or agent can do. This may be an emulator, debugger, UI navigator, inspector, test harness, automation routine, or other reusable action surface.

Create a tool when a capability materially expands what the project can inspect, test, debug, navigate, or build, especially if the path is non-obvious or likely to be forgotten.

Edit a tool when invocation, capabilities, limitations, prerequisites, or the preferred usage path changes.

Retire or merge a tool when it is obsolete, replaced, or useful only as historical context.

A tool often links to issues, requirements, specs, features, bugs, executable tests, records, and entrypoints. Other nodes should point to it when it is relevant to acting on them.

A tool should include what it enables, how it is used, prerequisites, limitations, and where it is especially relevant.

## ADR

An ADR records a durable decision. It exists so the project can remember what was chosen and why that choice became active.

Create an ADR when a decision has meaningful long-term impact on architecture, protocol shape, workflow, or another structural concern.

Edit an ADR when consequences need clarification, related decisions should be linked, or a later supersession should be explicit.

Do not usually remove ADRs outright. Keep them and link to newer ADRs that supersede them.

An ADR often links to requirements, specs, features, records, and other ADRs. Other nodes should point to it when the decision materially constrains or explains them.

An ADR should include the decision, context, live alternatives, reasoning, and consequences.

## record

A record is the general historical memory node. It preserves things worth remembering that do not need a more specific history type.

Create a record when something happened or was learned that future work may benefit from remembering, especially if it would otherwise disappear into chat history, commit history, or vague memory. Failed attempts, useful revelations, migrations, experiments, incidents, and lessons are good record candidates.

Edit a record when later understanding sharpens what happened, more relevant links should be added, or the significance of the event changes.

Retire or merge a record when another record or ADR is the better historical surface. It may also remain as stable history.

A record can link almost anywhere if the connection is genuinely informative. Other nodes should point to records when historical memory helps explain them.

A record should include what happened or was learned, why it mattered, and what current nodes it still helps illuminate.
