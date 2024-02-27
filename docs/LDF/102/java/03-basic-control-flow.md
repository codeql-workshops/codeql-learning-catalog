---
layout: page
title: Basic Control Flow
octicon: package
toc: false
---

#### Exercise 1

Find all the control flow nodes and their successors by implementing [exercise1.ql](exercises/Exercise1.ql).

<details>
<summary>Hints</summary>

- The `java` module provides a class `ControlFlowNode` to reason about control flow nodes in a program.
- The class `Method` provides the member predicates `getName` and `hasName` to reason about the name of a method.

</details>

A solution can be found in the query [Exercise1.ql](solutions/Exercise1.ql)

#### Exercise 2

Now that we have described how two control flow nodes relate using the successor relationship we can reason about reachability.
Reachability is a concept from graph theory that refers to the ability to get from one vertex to another within a graph.
In our case it means that control can be transferred from one node in the CFG to another node in the CFG.
Or more concretely, the reachable node will be executed after executing the node it is reachable from.

Implement the _predicate_ `reachable` using the successor relationship by completing the query [Exercise2.ql](exercises/Exercise2.ql).

<details>
<summary>Hints</summary>

This query can be implemented using [recursion](https://codeql.github.com/docs/ql-language-reference/recursion/#recursion) or using the [transitive closure](https://codeql.github.com/docs/ql-language-reference/recursion/#transitive-closures)

</details>

A solution can be found in the query [exercise2.ql](solutions/Exercise2.ql)

#### Exercise 3

To visualize the intra-procedural CFG, that is the CFG of a method not crossing method boundaries, restrict the begin node and the reachable node by completing the query in  [Excercise3.ql](exercises/Exercise3.ql).

To understand how to restrict the begin node and the end node we first have to determine what a begin node and end node in a CFG are with respect to the _successor_ relationship.

<details>
<summary>Hints</summary>

- The `ControlFlowNode` class has member predicate `getAPredecessor` to get a predecessor. How could you get a predecessor with only the `getASuccessor` member predicate?
- You can use the pattern `not exists(...)` to state that a predicate has no results.

</details>

A solution can be found in the query [Exercise3.ql](solutions/Exercise3.ql)
