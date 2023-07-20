---
layout: page
title: Restricting Control Flow
octicon: package
toc: false
---

To visualize the intra-procedural CFG, that is the CFG of a method not crossing method boundaries, restrict the begin node and the reachable node by completing the query in  `src/exercises/Exercise3.ql`.

To understand how to restrict the begin node and the end node we first have to determine what a begin node and end node in a CFG are with respect to the _successor_ relationship.

<details>
<summary>Hints</summary>

- The `ControlFlowNode` class has member predicate `getAPredecessor` to get a predecessor. How could you get a predecessor with only the `getASuccessor` member predicate?
- You can use the pattern `not exists(...)` to state that a predicate has no results.
- The CodeQL CLI command `codeql database analyze` can output to the `dot` format. The result can be rendered with Graphviz. See the file `control-flow-graph.png` for a rendering of the control flow graphs in `src/`exercises-tests/Exercise3/test.cpp`.

</details>

A solution can be found in the query `src/solutions/Exercise3.ql`.
