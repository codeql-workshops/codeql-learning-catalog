---
layout: page
title: Domination and Scopes in Reachability Analysis
octicon: package
toc: false
---

First time use of the _successor_ relationship and _reachability_ can result in surprising result.
The _successor_ relationship relates program elements that can reside in different scopes within a method.

For example, any program element following an `if` statement will be related to one or more statements in the `if` body.
Consider the following case:

```cpp
void incorrect_use2(const char *input) {
  struct ctx ctx;

  if (input) {
    init(&ctx);
  }

  some_action(&ctx, input);
}
```

The `some_action` method access is reachable from an `init` function call.
This means that the solution to the previous exercise will not find this incorrect use.

To ensure that all accesses of the method `some_action` are preceded by an `init` access we can make use of the [dominator](https://en.wikipedia.org/wiki/Dominator_(graph_theory)) concept from graph theory.
A node **dominates** another node if every path from the _entry node_ to a node _m_ must go through node _n_.
If we swap _m_ with method access for `someAction`  and _n_ with method access of `initialize` then this describes the property we want.

The standard library provides the predicate `dominates` that is defined in the the module [Dominance](https://codeql.github.com/codeql-standard-libraries/cpp/semmle/code/cpp/controlflow/Dominance.qll/module.Dominance.html).

Use the predicate `dominates` and update the solution to `src/exercises/Exercise5.ql` in  `src/exercises/Exercise6.ql` to account for the new case.

<details>
<summary>Hints</summary>

</details>

A solution can be found in the query `src/solutions/Exercise6.ql`
