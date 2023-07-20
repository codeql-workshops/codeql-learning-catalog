---
layout: page
title: Corner Cases in Control Flow
octicon: package
toc: false
---

Multiple corner cases down the line the question arises whether there isn't a better way to solve our problem.
While our solutions improved incrementally, we still have a lot of corner cases to cover.
For example, we didn't even consider that the arguments to the `init` calls are the same as to the `some_action` calls.

The answer to the question is yes. Data flow analysis allows us to more succinctly describe the problem and provide us with more precise answers.
However, for the correct answer, we still need to reason about control flow.

As a precursor to the data flow workshop, we are going to implement parts of an interprocedural dataflow configuration to find uses of `some_action` without a preceding call to `init`. The core idea is to track the struct's instance to its uses as an argument to `some_action` calls and stop tracking the instance if it is used as an argument to `init`.
However, because C/C++'s data flow implementation relies on _def-use_ relations, and not on _use-use_ relations, we still need the predicates we created so far to filter out correct uses.

Complete the dataflow configuration in `src/solutions/Exercise9.ql`.

<details>
<summary>Hints</summary>
- The class `DataFlow::Node` can transformed to uninitialized local variables using the member predicate `asUninitialized`.
- The class `LocalVariable` has a member predicate `getType()` to get the type of the variable.
- Interprocedural dataflow uses the concepts of a _source_ and a _sink_ for which it determines if the source can reach the sink.
  A barrier is a condition that prevents further analysis to determine if a sink is reachable and is typically used to exclude data that is sanitized or validated.
</details>

A solution can be found in the query `src/solutions/Exercise9.ql`.
