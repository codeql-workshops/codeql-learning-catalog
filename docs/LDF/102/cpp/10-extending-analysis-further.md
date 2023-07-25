---
layout: page
title: Extending Interprocedural Analysis Further
octicon: package
toc: false
---

In the previous exercise we started to reason interprocedurally about the control flow.
However, our reasoning was incomplete because we only considered calls dominating the `some_action` function call within the same function.

Consider the test case `test/exercises/Exercise8/test.cpp` that includes multiple calls to `correct_or_incorrect_use` where one caller has initialized the context and the other is didn't.

To identify the correct uses, we need to determine if all the _callers_ of `correct_or_incorrect_use` are dominated by an `init` function call, or a function call that always performs calls the `init` function.

Implement the query `alwaysPrecededByInitializationCall` in `src/exercises/Exercise8.ql` and use it to determine that a `ControlFlowNode` is always directly preceded by an `init` function call, or the property holds for all the callers of its enclosing callable.

<details>
<summary>Hints</summary>

- The `FunctionCall` class has a member predicate `getTarget` to reason about the functions it can call.
- The `ControlFlowNode` class has a member predicate `getControlFlowScope` to reason about the function that contains the control flow node.
- To state that a property must hold for all values (e.g., all callers) use the formula [forall](https://codeql.github.com/docs/ql-language-reference/formulas/#forall). Note that the `forall` formula holds vacuously if there are no values to test the property on because it is logicall the same as `not exists(<vars> | <formula 1> | not <formula 2>)`.
If there needs to be at least one value for which the property holds you can use the [forex](https://codeql.github.com/docs/ql-language-reference/formulas/#forex) formula.

</details>

A solution can be found in the query `src/solutions/Exercise8.ql`.
