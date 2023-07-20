---
layout: page
title: Using Reachability
octicon: package
toc: false
---

Now that we understand the _successor_ relation, the control flow graph, and _reachability_, we can look at how reachability can be used.

In multiple scenarios, including security relevant scenarios, a certain action must be performed before another action.
For example, before you can use a method you must first initialize the class providing the method.

Look at the `test/exercises/Exercise5/test.cpp` for `src/exercises/Exercise5.ql` and implement `src/exercises/Exercise5.ql` to ensure the `incorrect_use` is detected.

<details>
<summary>Hints</summary>

For all correct uses, the `some_action` method access is reachable from the `init` function call.

</details>

A solution can be found in the query `src/solutions/Exercise5.ql`.
