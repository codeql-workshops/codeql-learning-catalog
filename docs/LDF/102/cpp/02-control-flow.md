---
layout: page
title: What is Control Flow?
octicon: package
toc: false
---

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

In the next section we will see how we can use the control flow graph to find control flow nodes that are of interest to us.
