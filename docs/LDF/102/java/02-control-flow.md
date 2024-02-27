---
layout: page
title: What is Control Flow?
octicon: package
toc: false
---

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
