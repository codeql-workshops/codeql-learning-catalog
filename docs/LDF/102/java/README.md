# CodeQL workshop for Java: Control flow

In this workshop we will explore control flow, how it is represented by the standard library, and how you can use it to reason about reachability.

## Contents

- [CodeQL workshop for Java: Control flow](#codeql-workshop-for-java-control-flow)
  - [Contents](#contents)
  - [Prerequisites and setup instructions](#prerequisites-and-setup-instructions)
  - [Workshop](#workshop)
    - [Learnings](#learnings)
    - [Control flow](#control-flow)
    - [Exercises](#exercises)
      - [Exercise 1](#exercise-1)
      - [Exercise 2](#exercise-2)
      - [Exercise 3](#exercise-3)
      - [Exercise 4](#exercise-4)
      - [Exercise 5](#exercise-5)
      - [Exercise 6](#exercise-6)
      - [Exercise 7](#exercise-7)
      - [Exercise 8](#exercise-8)
      - [Exercise 9](#exercise-9)

## Prerequisites and setup instructions

- Install [Visual Studio Code](https://code.visualstudio.com/).
- Install the [CodeQL extension for Visual Studio Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/setting-up-codeql-in-visual-studio-code/).
- You do _not_ need to install the CodeQL CLI: the extension will handle this for you.
- Clone this repository:

  ```bash
  git clone https://github.com/rvermeulen/codeql-workshop-control-flow-java
  ```

- Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `exercises`, `exercises-tests`, `solutions`, and `solutions-tests`.
- Select the Spring Pet Clinic database as the current database by right-clicking on the file `spring-petclinic.zip` in the File explorer and running the command `CodeQL: Set Current Database`.

## Workshop

### Learnings

The workshop is split into multiple exercises introducing control flow.
In these exercises you will learn:

- About control flow and the control flow graph (CFG).
- How control flow is represented in QL.
- Learn about reachability and how you can answer reachability questions using recursive predicates and transitive closures.
- About properties of control flow graph nodes, such as dominating other control flow nodes.
- About corner-cases when reasoning using control flow and how data flow provides higher level construct to answer reachability questions.

### Control flow

Control flow is an ordering on program elements that dictates the order in which program elements are executed or evaluated.
The control flow of a program is captured by a control flow graph that has labelled directed edges between nodes that capture the order and conditions for the flow to occur.

When CodeQL extracts code, it will create an abstract syntax tree (AST), and based on the AST it will create a control flow graph (CFG) to capture the order of execution.
The CodeQL standard library for Java computes an expression-level intra-procedural CFG and exposes the CFG via the class `ControlFlowNode` and the successor relation `getASuccessor`.
This means that the CFG has edges between expressions, statements, and methods.
An important goal of the computed CFG is to accurately capture the order of side-effects in a program.

Consider the following snippet:

```java
public int foo(int n) {
  return n + 1
}
```

The following AST captures the parent child relationship and based on that relationship the following CFG is generated.
The edges are labelled with the order for clarification and are not part of the actual CFG.

Looking at the CFG we can make a few observations:

- For expression (e.g., `AddExpr`) their children are executed from left to right before the expression itself is executed (post-order traversal on the AST node).
- Statements with side-effects (e.g, `ReturnStmt`) are executed like expression.
- Statements without side-effects (e.g, `BlockStmt`) are their own entry point (pre-order traversal on the AST node).
- The method itself is the last node of the CFG.

```text
                 AST                                                                   CFG



              .───────.                                                              .───────.
             ( Method  )                                                            ( Method  )◀────┐
              `───────'                                                              `───────'      │
                  │                                                                                 │
                                                                                                    │
                  │                                                                                 │
                  ▼                                                                                 │
             .─────────.                                                            .─────────.    (6)
            ( BlockStmt )                                        ────────(1)──────▶( BlockStmt )    │
             `─────────'                                                            `─────────'     │
                  │                                                                      │          │
                                                                 ┌───────────────────────┘          │
                  │                                              │                                  │
                  ▼                                              │                                  │
             .─────────.                                         │                .───────────.     │
            (ReturnStmt )                                        │               ( ReturnStmt  )────┘
             `─────────'                                         │                `───────────'
                  │                                              │                      ▲
                                                                 │                      │
                  │                                             (2)                    (5)
                                                                 │                      │
                  ▼                                              │                 .─────────.
             .─────────.                                         │                (  AddExpr  )◀────┐
            (  AddExpr  )                                        │                 `─────────'      │
             `─────────'                                         │                                 (4)
                  Λ                                              │                                  │
        ─ ─ ─ ─ ─   ─ ─ ─ ─ ─                                    │                                  │
      ▼                       ▼                                  │     .─────────.             .─────────.
 .─────────.             .─────────.                             └───▶( VarAccess )───(3)────▶(  Literal  )
( VarAccess )           (  Literal  )                                  `─────────'             `─────────'
 `─────────'             `─────────'
```

Each CFG node in the previous example has a single successor.
When we include constructs like conditions or loops, we will encounter CFG nodes with multiple successors.

Consider the following snippet:

```java
void foo() {
  if (bar.baz()) {
    bar.quux();
  }
}
```

For which we generate the following AST and CFG:

```text

                 AST                                                  CFG

              .───────.                                             .───────.
             ( Method  )                                           ( Method  )◀────────────────────┐
              `───────'                                             `───────'                      │
                  │                                                     ▲                          │
                  │                                                     │                          │
                  │                                                     └───────┐                  │
                  ▼                                                             │                  │
             .─────────.                                           .─────────.  │                  │
            ( BlockStmt )                          ───────────────▶ BlockStmt ) │                  │
             `─────────'                                           `─────────'  │                  │
                  │                                                     │       │                  │
                  │                                                     │       │                  │
                  │                                                     │     false                │
                  ▼                                                     ▼       │                  │
              .───────.                                             .───────.   │                  │
             ( IfStmt  )                         ┌─────────────────( IfStmt  )  │                  │
              `───────'                          │                  `───────'   │                  │
                  │                              │                              │                  │
                  │                              │                              │                  │
        ┌─────────┴──────────┐                   │            ┌─────────────────┘                  │
        │                    │                   │            │                                    │
        ▼                    ▼                   │            │                                    │
 .─────────────.        .─────────.              │     .─────────────.             .─────────.     │
( MethodAccess  )      ( BlockStmt )             │    ( MethodAccess  )──true────▶( BlockStmt )    │
 `─────────────'        `─────────'              │     `─────────────'             `─────────'     │
        │                    │                   │            ▲                         │          │
        ▼                    ▼                   │            │         ┌───────────────┘          │
   .─────────.        .─────────────.            │            │         │        .─────────────.   │
  ( VarAccess )      ( MethodAccess  )           │            │         │       ( MethodAccess  )──┘
   `─────────'        `─────────────'            │            │         │        `─────────────'
                             │                   │       .─────────.    │               ▲
                             ▼                   └─────▶( VarAccess )   │               │
                        .─────────.                      `─────────'    │               │
                       ( VarAccess )                                    │               │
                        `─────────'                                     │          .─────────.
                                                                        └────────▶( VarAccess )
                                                                                   `─────────'
```

Here we can see a CFG with a node that has multiple successors.
The `MethodAccess` part of the condition in the `if` statement continues execution to one of two successors depending on whether the condition evaluates to `true` or `false`.
This is reflected in the labels of the outgoing CFG edges.

Next are the exercises used to further explore control flow.

### Exercises

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

#### Exercise 4

From the results of the previous exercises, we can see that the control flow paths include both statements and expressions.
In some cases, you would be interested in determining the successor statement of another statement.
For example, given an _if_ statement, what is the next reachable _if_ statement.
Our `reachable` predicate will return all reachable _if_ statement so additional logic is required to answer the question.

Implement the predicate `getANextStmt` in [Exercise4.ql](exercises/Exercise4.ql).
While implementing the predicate consider the following Java snippet and which `if` statements should be returned by [Exercise4.ql](exercises/Exercise4.ql) for the first `if` statement.

```java
if (...) {
  if (...) {
    ...
  }
}

if (...) {
  ...
}
```

with the following CFG.

```text
                   │
                   │
                   │
                   │
                   ▼
               .───────.
              ( IfStmt  )
               `───────'
                   │
     ┌─────────────┘
     ▼
 .───────.               .───────.
(   ...   )───(true)───▶(BlockStmt)
 `───────'               `───────'
     │                       │
     │                       │
     │                       ▼
     │                   .───────.
     │                  ( IfStmt  )
     │                   `───────'
     │                       │
  (false)         ┌──────────┘
     │            ▼
     │       .───────.              .───────.
     │      (   ...   )─(true)────▶(BlockStmt)
     │       `───────'              `───────'
     │           │                      │
     │           │                      │
     │        (false)                   │
     │           │                      │
     │           ▼                      ▼
     │       .───────.              .───────.
     └─────▶( IfStmt  )◀───────────(   ...   )
             `───────'              `───────'
                 │
        ┌────────┘
        ▼
    .───────.          .───────.
   (   ...   )───────▶(   ...   )─ ─ ─ ─ ─▶
    `───────'          `───────'
```

If you run your query on the _Pet Clinic_ database, you will see results without a path.
Can you explain why this happens?

<details>
<summary>Hints</summary>

When you use the `reachable` predicate you need to exclude results to include only the strict successor statements.
However, you cannot exclude the correct nodes due to conditional nodes. See the above example snippet and CFG.

To implement a correct solution, you need to resort to a _recursive_ predicate.

</details>

A solution can be found in the query [Exercise4.ql](solutions/Exercise4.ql)

#### Exercise 5

Now that we understand the _successor_ relation, the control flow graph, and _reachability_, we can look at how reachability can be used.

In multiple scenarios, including security relevant scenarios, a certain action must be performed before another action.
For example, before you can use a method you must first initialize the class providing the method.

Look at the [test case](exercises-tests/Exercise5/Test.java) for [Exercise5.ql](exercises/Exercise5.ql) using the following Java snippet and implement [Exercise5.ql](exercises/Exercise5.ql) to ensure the `incorrectUse` is detected.

```java
class SomeApi {
    void initialize() {

    }

    void someAction() {

    }
}

class Test {
    void correctUse() {
        SomeApi api = new SomeApi();

        api.initialize();
        api.someAction();
    }

    void incorrectUse() {
        SomeApi api = new SomeApi();

        api.someAction();
    }
}
```

<details>
<summary>Hints</summary>

For all correct uses, the `someAction` method access is reachable from the `initialize` method access.

</details>

A solution can be found in the query [Exercise5.ql](solutions/Exercise5.ql)

#### Exercise 6

First time use of the _successor_ relationship and _reachability_ can result in surprising result.
The _successor_ relationship relates program elements that can reside in different scopes within a method.

For example, any program element following an `if` statement will be related to one or more statements in the `if` body.
Consider the following case:

```java
  void incorrectUse2() {
        SomeApi api = new SomeApi();

        if (false) {
            api.initialize();
        }
        api.someAction();

    }
```

The `someAction` method access is reachable from an `initialize` method access.
This means that the solution to exercise 5 will not find this incorrect use, which is the case for our solution to exercise 5.

To ensure that all accesses of the method `someAction` are preceded by an `initialize` access we can make use of the [dominator](https://en.wikipedia.org/wiki/Dominator_(graph_theory)) concept from graph theory.
A node **dominates** another node if every path from the _entry node_ to a node _m_ must go through node _n_.
If we swap _m_ with method access for `someAction`  and _n_ with method access of `initialize` then this describes the property we want.

The standard library provides the predicate `dominates` that is defined in the the module [Dominance](https://codeql.github.com/codeql-standard-libraries/java/semmle/code/java/controlflow/Dominance.qll/module.Dominance.html).

Use the predicate `dominates` and update the solution to [Exercise5.ql](exercises/Exercise5.ql) in  [Exercise6.ql](exercises/Exercise6.ql) to account for the new case.

<details>
<summary>Hints</summary>

</details>

A solution can be found in the query [Exercise6.ql](solutions/Exercise6.ql)

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

Implement [Exercise7.ql](exercises/Exercise7.ql) by completing the _action configuration_ and adding an extra condition that excludes call that always call `Initialize` and dominate `someAction` calls.

<details>
<summary>Hints</summary>

- The `ActionConfiguration` class provides two predicates named `callAlwaysPerformsAction` and `callableAlwaysPerformsAction` to reason about calls and callables for which every path goes through at least one action node.

</details>

A solution can be found in the query [Exercise7.ql](solutions/Exercise7.ql)

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
Implement the query `alwaysPrecededByInitializationCall` in [Exercise8.ql](exercises/Exercise8.ql) and use it to determine that a `ControlFlowNode` is always directly preceded by an initialization method access, or the property holds for all the callers of its enclosing callable.

<details>
<summary>Hints</summary>

- The `Call` class has a member predicate `getCallee` to reason about the callables it can call.
- The `ControlFlowNode` class has a member predicate `getEnclosingCallable` to reason about the callable that contains the control flow node.
- To state that a property must hold for all values (e.g., all callers) use the formula [forall](https://codeql.github.com/docs/ql-language-reference/formulas/#forall). Note that the `forall` formula holds vacuously if there are no values to test the property on because it is logicall the same as `not exists(<vars> | <formula 1> | not <formula 2>)`.
If there needs to be atleast one value for which the property holds you can use the [forex](https://codeql.github.com/docs/ql-language-reference/formulas/#forex) formula.

</details>

A solution can be found in the query [Exercise8.ql](solutions/Exercise8.ql)

#### Exercise 9

Multiple corner cases down the line the question arises whether there isn't a better way to solve our problem.
While our solutions improved incrementally, we still have a lot of corner cases to cover.
For example, we didn't even consider that the qualifiers of the `initialize` calls are the same as the `someAction` calls.

The answer to the question is yes. Data flow is analysis enabled by the CFG that can with a more succinct analysis specification and more precision answer the question we tried to solve with only the CFG. Is a method access preceded by another method access.

As a precursor to the data flow workshop, we are going to implement parts of an interprocedural dataflow configuration to find uses of `someAction` without a preceding call to `initialize`. The core idea is to track the object instance to its use as a qualifier to the method access `someAction` and stop tracking the object instance if it is used as a qualifier to the method access `initialize`.

Complete the dataflow configuration in [Exercise9.ql](solutions/Exercise9.ql)

<details>
<summary>Hints</summary>

- The class `ConstructorCall` can be used to reason about type creations.
- The class `ConstructorCall` has a member predicate `getConstructedType()` to get the type of the object that is created.
- Interprocedural dataflow uses the concepts of a _source_ and a _sink_ for which it determines if the source can reach the sink.
  A barrier is a condition that prevents further analysis to determine if a sink is reachable and is typically used to exclude data that is sanitized or validated.

</details>

A solution can be found in the query [exercise9.ql](solutions/Exercise9.ql)
