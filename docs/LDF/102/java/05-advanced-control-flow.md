---
layout: page
title: Advanced Control Flow
octicon: package
toc: false
---

#### Exercise 7

CodeQL constructs an intraprocedural CFG, meaning it only considers the program elements in a method.
However, methods are not used in isolation and there are cases where we need to extend the control flow analysis.

In this exercise we are going to extend our test case with an object creation pattern and a valid use case that is incorrectly detected to introduce option to reason about CFG interprocedurally.

Extend the test case with the class `SomeApiBuilder` and the test case `correctUse2`.

```java
class SomeApiBuilder {
    static SomeApi createApi() {
        SomeApi api = new SomeApi();

        api.initialize();
        return api;
    }
}
```

```java
void correctUse2() {
        SomeApi api = SomeApiBuilder.createApi();

        api.someAction();
}
```

To be able to correctly identify the `correctUse2` case we need to determine that there exists a _method access_ that _dominates_ the _method accesses_ `someAction` and that _method access_ must always call the `initialize` method.

The [Paths](https://codeql.github.com/codeql-standard-libraries/java/semmle/code/java/controlflow/Paths.qll/module.Paths.html) module provides _predicates_ to reason about the set of all paths through a callable. The module provides the class [ActionConfiguration](https://codeql.github.com/codeql-standard-libraries/java/semmle/code/java/controlflow/Paths.qll/type.Paths$ActionConfiguration.html) to define the analysis we want to perform. The _Configuration_ pattern is used for interprocedural analysis to ensure the analysis is tractable. You will encounter this pattern a lot when working with data flow.

To define an _action configuration_ we are going to create a QL class that extends the `ActionConfiguration` and implements the `abstract` predicates that require an implementation. These predicates together define the analysis.

Implement exercises/Exercise7.ql by completing the _action configuration_ and adding an extra condition that excludes call that always call `Initialize` and dominate `someAction` calls.

<details>
<summary>Hints</summary>

- The `ActionConfiguration` class provides two predicates named `callAlwaysPerformsAction` and `callableAlwaysPerformsAction` to reason about calls and callables for which every path goes through at least one action node.

</details>

A solution can be found in the query solutions/Exercise7.ql.

#### Exercise 8

In the previous exercise we started to reason interprocedurally about the control flow. However, our reasoning was incomplete because we only considered calls dominating the `someAction` method access within the same callable (i.e. method in the test case).

Consider the following interprocedural case where one caller correctly initializes the API, and one that doesn't.

```java
void correctCaller() {
  SomeApi api = SomeApiBuilder.createApi();
  correctAndIncorrectUse(api);
}

void incorrectCaller() {
  SomeApi api = new SomeApi();
  correctAndIncorrectUse(api);
}

void correctAndIncorrectUse(SomeApi api) {
  api.someAction();
}
```

To identify the correct uses, we need to determine if all the _callers_ of `correctAndIncorrectUse` are dominated by an initialize method access, or call that always performs the initialize method access.

The reasoning about _callers_ and _callees_ makes use of a different control flow graph known as the (static) [Call graph](https://en.wikipedia.org/wiki/Call_graph).
Implement the query `alwaysPrecededByInitializationCall` in exercises/Exercise8.ql and use it to determine that a `ControlFlowNode` is always directly preceded by an initialization method access, or the property holds for all the callers of its enclosing callable.

<details>
<summary>Hints</summary>

- The `Call` class has a member predicate `getCallee` to reason about the callables it can call.
- The `ControlFlowNode` class has a member predicate `getEnclosingCallable` to reason about the callable that contains the control flow node.
- To state that a property must hold for all values (e.g., all callers) use the formula [forall](https://codeql.github.com/docs/ql-language-reference/formulas/#forall). Note that the `forall` formula holds vacuously if there are no values to test the property on because it is logicall the same as `not exists(<vars> | <formula 1> | not <formula 2>)`.
If there needs to be atleast one value for which the property holds you can use the [forex](https://codeql.github.com/docs/ql-language-reference/formulas/#forex) formula.

</details>

A solution can be found in the query solutions/Exercise8.ql.

#### Exercise 9

Multiple corner cases down the line the question arises whether there isn't a better way to solve our problem.
While our solutions improved incrementally, we still have a lot of corner cases to cover.
For example, we didn't even consider that the qualifiers of the `initialize` calls are the same as the `someAction` calls.

The answer to the question is yes. Data flow is analysis enabled by the CFG that can with a more succinct analysis specification and more precision answer the question we tried to solve with only the CFG. Is a method access preceded by another method access.

As a precursor to the data flow workshop, we are going to implement parts of an interprocedural dataflow configuration to find uses of `someAction` without a preceding call to `initialize`. The core idea is to track the object instance to its use as a qualifier to the method access `someAction` and stop tracking the object instance if it is used as a qualifier to the method access `initialize`.

Complete the dataflow configuration in solutions/Exercise9.ql.

<details>
<summary>Hints</summary>

- The class `ConstructorCall` can be used to reason about type creations.
- The class `ConstructorCall` has a member predicate `getConstructedType()` to get the type of the object that is created.
- Interprocedural dataflow uses the concepts of a _source_ and a _sink_ for which it determines if the source can reach the sink.
  A barrier is a condition that prevents further analysis to determine if a sink is reachable and is typically used to exclude data that is sanitized or validated.

</details>

A solution can be found in the query solutions/Exercise9.ql.
