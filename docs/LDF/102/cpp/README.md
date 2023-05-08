# CodeQL workshop for C/C++: Control flow

In this workshop we will explore control flow, how it is represented by the standard library, and how you can use it to reason about reachability.

## Contents

- [CodeQL workshop for C/C++: Control flow](#codeql-workshop-for-cc-control-flow)
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
  git clone https://github.com/rvermeulen/codeql-workshop-control-flow-cpp
  ```

- Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `exercises`, `exercises-tests`, `solutions`, and `solutions-tests`.

## Workshop

### Learnings

The workshop is split into multiple exercises introducing control flow.
In these exercises you will learn:

- About control flow and the control flow graph (CFG).
- How control flow is represented in QL.
- Learn about reachability and how you can answer reachability questions using recursive predicates and transitive closures.
- About properties of control flow graph nodes, such as dominating other control flow nodes.
- About corner-cases when reasoning using control flow, how data flow provides higher level construct to answer reachability questions, but still requires control flow to excludes correct cases.

### Control flow

Control flow is an ordering on program elements that dictates the order in which program elements are executed or evaluated.
The control flow of a program is captured by a control flow graph that has labelled directed edges between nodes that capture the order and conditions for the flow to occur.

When CodeQL extracts code, it will create an abstract syntax tree (AST), and based on the AST it will create a control flow graph (CFG) to capture the order of execution.
The CodeQL standard library for C/C++ computes an expression-level intra-procedural CFG and exposes the CFG via the class `ControlFlowNode` and the successor relation `getASuccessor`.
This means that the CFG has edges between expressions, statements, and methods.
An important goal of the computed CFG is to accurately capture the order of side-effects in a program.

Consider the following snippet:

```cpp
int add(int m, int n) {
  return m + n;
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

                 AST                       ┌───────────────┐                           CFG
                                           │ Unconditional │
                                           └───────────────┘

             .─────────.                                                           .─────────.
            ( Function  )                                                         ( Function  )◀────┐
             `─────────'                                                           `─────────'      │
                  │                                                                                 │
                                                                                                    │
                  │                                                                                 │
                  ▼                                                                                 │
             .─────────.                                                            .─────────.     │
            ( BlockStmt )                                        ────────(1)──────▶( BlockStmt )    │
             `─────────'                                                            `─────────'     │(6)
                  │                                                                      │          │
                                                                ┌────────────────────────┘          │
                  │                                             │                                   │
                  ▼                                             │    (2)                ┌───────────┘
             .─────────.                                        │                       │
            (ReturnStmt )                                       │                       │
             `─────────'                                        │                       │
                  │                                             │                       │
                                                                │                       │
                  │                                             ▼                       │
                                                          .───────────.                 │
                  ▼                                      ( ReturnStmt  )           .─────────.
             .─────────.                                  `───────────'           (  AddExpr  )◀───────┐
            (  AddExpr  )                                       │                  `─────────'         │
             `─────────'                                        │ (3)                              (5) │
                  Λ                                             │                                      │
          ─ ─ ─ ─   ─ ─ ─ ─ ─ ─                                 ▼                                      │
        ▼                       ▼                       .───────────────.                      .───────────────.
 .─────────────.         .─────────────.               ( VariableAccess  )─────────(4)───────▶( VariableAccess  )
(VariableAccess )       (VariableAccess )               `───────────────'                      `───────────────'
 `─────────────'         `─────────────'
```

Each CFG node in the previous example has a single successor.
When we include constructs like conditions or loops, we will encounter CFG nodes with multiple successors.

Consider the following snippet:

```cpp
unsigned int absolute(int i) {
  if (i < 0) {
    return -i;
  }
  return i;
}
```

For which we generate the following AST and CFG:

```text

                             AST                                                                             CFG

                          .───────.                                                                       .───────.
                         (Function )                                                                     (Function )◀───────────────────────────────────────────┐
                          `───────'                              ┌───────────────┐                        `───────'                                             │
                              │                                  │  Conditional  │                            ▲                                                 │
                              │                                  └───────────────┘                            │                                                 │
                              │                                                                               └─────────────────────────────────────────────────┼──┐
                              ▼                                                                                                                                 │  │
                         .─────────.                                                                     .─────────.                                            │  │
                        ( BlockStmt )                                                      ────────────▶( BlockStmt )                                           │  │
                         `─────────'                                                                     `─────────'                                            │  │
                              │                                                                               │                                                 │  │
                              │                                                                               │                                                 │  │
                              │                                                                               │                                                 │  │
                              ▼                                                                               ▼                                                 │  │
                          .───────.                                                                       .───────.                                             │  │
                         ( IfStmt  )                                                                     ( IfStmt  )                                            │  │
                          `───────'                                                                       `───────'                                             │  │
                              │                                                                               │                                                 │  │
                              │                                                                               │                                                 │  │
                 ┌────────────┴────────────────┬───────────────────┐                    ┌─────────────────────┘                                                 │  │
                 │                             │                   │                    │        ┌────────────────────────────(false)──────────────┐            │  │
                 ▼                             ▼                   ▼                    │        │                                                 ▼            │  │
             .───────.                    .─────────.         .─────────.               │    .───────.                    .─────────.         .─────────.       │  │
            ( LTExpr  )                  ( BlockStmt )       ( BlockStmt )              │   ( LTExpr  )─────────────────▶( BlockStmt )       ( BlockStmt )      │  │
             `───────'                    `─────────'         `─────────'               │    `───────'       (true)       `─────────'         `─────────'       │  │
                 │                             │                   │                    │        ▲                             │                   │            │  │
        ┌────────┴────────┐                    │                   │                    │        └────────┐                    │                   │            │  │
        │                 │                    │                   │                    │                 │                    │                   │            │  │
        ▼                 ▼                    ▼                   ▼                    ▼                 │                    ▼                   ▼            │  │
 .─────────────.   .─────────────.      .─────────────.     .─────────────.      .─────────────.   .─────────────.      .─────────────.     .─────────────.     │  │
(VariableAccess ) (    Literal    )    (  ReturnStmt   )   (  ReturnStmt   )    (VariableAccess ) (    Literal    )    (  ReturnStmt   )   (  ReturnStmt   )    │  │
 `─────────────'   `─────────────'      `─────────────'     `─────────────'      `─────────────'   `─────────────'      `─────────────'     `─────────────'     │  │
                                               │                   │                    │                 ▲                    │                   │            │  │
                                               ▼                   ▼                    │                 │        ┌───────────┘                   ▼            │  │
                                       .───────────────.   .───────────────.            └─────────────────┘        │   .───────────────.   .───────────────.    │  │
                                      ( UnaryMinuxExpr  ) ( VariableAccess  )                                      │  ( UnaryMinuxExpr  ) ( VariableAccess  ) ──┘  │
                                       `───────────────'   `───────────────'                                       │   `────────────┬──'   `───────────────'       │
                                               │                                                                   │           ▲    │                              │
                                               │                                                                   │           │    └──────────────────────────────┘
                                               ▼                                                                   │           │
                                       .───────────────.                                                           │   .───────────────.
                                      ( VariableAccess  )                                                          └─▶( VariableAccess  )
                                       `───────────────'                                                               `───────────────'
```

Here we can see a CFG with a node that has multiple successors.
The `LTExpr` part of the condition in the `IfStmt` statement continues execution to one of two successors depending on whether the condition evaluates to `true` or `false`.
This is reflected in the labels of the outgoing CFG edges.

Next are the exercises used to further explore control flow.

### Exercises

#### Exercise 1

Find all the control flow nodes and their successors by implementing [exercise1.ql](exercises/Exercise1.ql).

<details>
<summary>Hints</summary>

- The `cpp` module provides a class `ControlFlowNode` to reason about control flow nodes in a program.

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
- The CodeQL CLI command `codeql database analyze` can output to the `dot` format. The result can be rendered with Graphviz. See the file `control-flow-graph.png` for a rendering of the control flow graphs in [test.cpp](exercises-tests/Exercise3/test.cpp).

</details>

A solution can be found in the query [Exercise3.ql](solutions/Exercise3.ql)

#### Exercise 4

From the results of the previous exercises, we can see that the control flow paths include both statements and expressions.
In some cases, you would be interested in determining the successor statement of another statement.
For example, given an _if_ statement, what is the next reachable _if_ statement.
Our `reachable` predicate will return all reachable _if_ statement so additional logic is required to answer the question.

Implement the predicate `getANextStmt` in [Exercise4.ql](exercises/Exercise4.ql).
While implementing the predicate consider the following C/C++ snippet and which `if` statements should be returned by [Exercise4.ql](exercises/Exercise4.ql) for the first `if` statement.

```cpp
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

Look at the [test case](exercises-tests/Exercise5/test.cpp) for [Exercise5.ql](exercises/Exercise5.ql) and implement [Exercise5.ql](exercises/Exercise5.ql) to ensure the `incorrect_use` is detected.

<details>
<summary>Hints</summary>

For all correct uses, the `some_action` method access is reachable from the `init` function call.

</details>

A solution can be found in the query [Exercise5.ql](solutions/Exercise5.ql)

#### Exercise 6

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
This means that the solution to exercise 5 will not find this incorrect use, which is the case for our solution to exercise 5.

To ensure that all accesses of the method `some_action` are preceded by an `init` access we can make use of the [dominator](https://en.wikipedia.org/wiki/Dominator_(graph_theory)) concept from graph theory.
A node **dominates** another node if every path from the _entry node_ to a node _m_ must go through node _n_.
If we swap _m_ with method access for `someAction`  and _n_ with method access of `initialize` then this describes the property we want.

The standard library provides the predicate `dominates` that is defined in the the module [Dominance](https://codeql.github.com/codeql-standard-libraries/cpp/semmle/code/cpp/controlflow/Dominance.qll/module.Dominance.html).

Use the predicate `dominates` and update the solution to [Exercise5.ql](exercises/Exercise5.ql) in  [Exercise6.ql](exercises/Exercise6.ql) to account for the new case.

<details>
<summary>Hints</summary>

</details>

A solution can be found in the query [Exercise6.ql](solutions/Exercise6.ql)

#### Exercise 7

CodeQL constructs an intraprocedural CFG, meaning it only considers the program elements in a function.
However, function are not used in isolation and there are cases where we need to extend the control flow analysis.

The [test case](exercises-tests/Exercise7/test.cpp) is extended with the function `default_ctx` that initializes the context and sets some fields to default values.
To detect this case we need to reason about the control flow graph interprocedurally.
The reasoning about _callers_ and _callees_, flow of control crossing function boundaries, requires the use of the (static) [Call graph](https://en.wikipedia.org/wiki/Call_graph).

To be able to correctly identify the `correct_use2` case we need to determine that there exists a _function call_ that _dominates_ the _function call_ `some_action` and confirm that the _function call_ always call the `init` method.

Implement [Exercise7.ql](exercises/Exercise7.ql) by completing the predicates `initCallDominatesExit`, that holds if a function calls the `init` function on all execution paths, and `callAlwaysCallsInit`, that holds if a function call calls a function that always calls `init` on all execution paths.

<details>
<summary>Hints</summary>

- The predicate `dominates` holds if a control flow node can only be reached by going through another control flow node.
- The `Function` is the last node in the control flow graph of a function.

</details>

A solution can be found in the query [Exercise7.ql](solutions/Exercise7.ql)

#### Exercise 8

In the previous exercise we started to reason interprocedurally about the control flow.
However, our reasoning was incomplete because we only considered calls dominating the `some_action` function call within the same function.

Consider the [test case](exercises-tests/Exercise8/test.cpp) that includes multiple calls to `correct_or_incorrect_use` where one caller has initialized the context and the other is didn't.

To identify the correct uses, we need to determine if all the _callers_ of `correct_or_incorrect_use` are dominated by an `init` function call, or a function call that always performs calls the `init` function.

Implement the query `alwaysPrecededByInitializationCall` in [Exercise8.ql](exercises/Exercise8.ql) and use it to determine that a `ControlFlowNode` is always directly preceded by an `init` function call, or the property holds for all the callers of its enclosing callable.

<details>
<summary>Hints</summary>

- The `FunctionCall` class has a member predicate `getTarget` to reason about the functions it can call.
- The `ControlFlowNode` class has a member predicate `getControlFlowScope` to reason about the function that contains the control flow node.
- To state that a property must hold for all values (e.g., all callers) use the formula [forall](https://codeql.github.com/docs/ql-language-reference/formulas/#forall). Note that the `forall` formula holds vacuously if there are no values to test the property on because it is logicall the same as `not exists(<vars> | <formula 1> | not <formula 2>)`.
If there needs to be at least one value for which the property holds you can use the [forex](https://codeql.github.com/docs/ql-language-reference/formulas/#forex) formula.

</details>

A solution can be found in the query [Exercise8.ql](solutions/Exercise8.ql)

#### Exercise 9

Multiple corner cases down the line the question arises whether there isn't a better way to solve our problem.
While our solutions improved incrementally, we still have a lot of corner cases to cover.
For example, we didn't even consider that the arguments to the `init` calls are the same as to the `some_action` calls.

The answer to the question is yes. Data flow analysis allows us to more succinctly describe the problem and provide us with more precise answers.
However, for the correct answer, we still need to reason about control flow.

As a precursor to the data flow workshop, we are going to implement parts of an interprocedural dataflow configuration to find uses of `some_action` without a preceding call to `init`. The core idea is to track the struct's instance to its uses as an argument to `some_action` calls and stop tracking the instance if it is used as an argument to `init`.
However, because C/C++'s data flow implementation relies on _def-use_ relations, and not on _use-use_ relations, we still need the predicates we created so far to filter out correct uses.

Complete the dataflow configuration in [Exercise9.ql](solutions/Exercise9.ql)

<details>
<summary>Hints</summary>

- The class `DataFlow::Node` can transformed to uninitialized local variables using the member predicate `asUninitialized`.
- The class `LocalVariable` has a member predicate `getType()` to get the type of the variable.
- Interprocedural dataflow uses the concepts of a _source_ and a _sink_ for which it determines if the source can reach the sink.
  A barrier is a condition that prevents further analysis to determine if a sink is reachable and is typically used to exclude data that is sanitized or validated.

</details>

A solution can be found in the query [exercise9.ql](solutions/Exercise9.ql)
