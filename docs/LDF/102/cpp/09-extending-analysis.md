---
layout: page
title: Extending Control Flow Analysis
octicon: package
toc: false
---

CodeQL constructs an intraprocedural CFG, meaning it only considers the program elements in a function.
However, function are not used in isolation and there are cases where we need to extend the control flow analysis.

The test case `test/exercises/Exercise7/test.cpp` is extended with the function `default_ctx` that initializes the context and sets some fields to default values.
To detect this case we need to reason about the control flow graph interprocedurally.
The reasoning about _callers_ and _callees_, flow of control crossing function boundaries, requires the use of the (static) [Call graph](https://en.wikipedia.org/wiki/Call_graph).

To be able to correctly identify the `correct_use2` case we need to determine that there exists a _function call_ that _dominates_ the _function call_ `some_action` and confirm that the _function call_ always call the `init` method.

Implement `src/exercises/Exercise7.ql` by completing the predicates `initCallDominatesExit`, that holds if a function calls the `init` function on all execution paths, and `callAlwaysCallsInit`, that holds if a function call calls a function that always calls `init` on all execution paths.

<details>
<summary>Hints</summary>

- The predicate `dominates` holds if a control flow node can only be reached by going through another control flow node.
- The `Function` is the last node in the control flow graph of a function.

</details>

A solution can be found in the query `src/solutions/Exercise7.ql`.
