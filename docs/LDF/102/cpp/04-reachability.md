---
layout: page
title: Control Flow and Reachability
octicon: package
toc: false
---

Now that we have described how two control flow nodes relate using the successor relationship we can reason about reachability.

Reachability is a concept from graph theory that refers to the ability to get from one vertex to another within a graph.
In our case it means that control can be transferred from one node in the CFG to another node in the CFG.
Or more concretely, the reachable node will be executed after executing the node it is reachable from.

Implement the _predicate_ `reachable` using the successor relationship by completing the query `src/exercises/Exercise2.ql`.

<details>
<summary>Hints</summary>

This query can be implemented using [recursion](https://codeql.github.com/docs/ql-language-reference/recursion/#recursion) or using the [transitive closure](https://codeql.github.com/docs/ql-language-reference/recursion/#transitive-closures)

</details>

A solution can be found in the query `src/solutions/Exercise2.ql`.
