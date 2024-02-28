---
layout: page
title: Representing Programs
octicon: package
toc: false
---

This workshops focuses on reasoning about syntactical elements.
Reasoning about syntactical elements means that we work with a representation of source code.
The representation used by CodeQL is called an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)(AST).
It is a tree representation that captures the *parent/child* relationship of program elements in the source code and elides concrete syntax elements that do not or are no longer necessary once the *parent/child* relationship is established.
An example of concrete syntax that is commonly elided are parenthesis used to define precedence within expression `(expression) op expression`.
The parentheses are required in a linear representation such as text, but are not necessary in a tree representation such as an AST.

The AST for the following expression demonstrates this.
For the expression `(a + b) * c` we have the following corresponding AST:

```plaintext
                  .─.
                 ( * )
                  `─'
            ┌────────────┐
            │            │
            ▼            ▼
           .─.         ┌───┐
          ( + )        │ c │
           `─'         └───┘
      ┌───────────┐
      ▼           ▼
    ┌───┐       ┌───┐
    │ a │       │ b │
    └───┘       └───┘
```

The AST captures the relationships between the operators and the operands and there is no ambiguity for the precedence of the operations.
When working with QL, the *parent/child* relationships are made available in a more meaningful way through the QL classes in the standard library.
For binary expression, for example, we talk about operands and for method calls we talk about arguments instead of children.
However, if you peek into their definitions, like for the `BinaryExpr` member predicate `[getLeftOperand](https://github.com/github/codeql/blob/main/java/ql/lib/semmle/code/java/Expr.qll#L731)` you can see it relies on the *parent/child relationship captured by the AST with the `isNthChildOf` predicate.

To explore the AST representation of a Java class you can use the AST viewer functionality available in the Visual Code CodeQL extension.
With a selected database, select a Java file in the Visual Studio Code Explorer in the folder that is added to the workspace when selecting a database, and click on the *View AST* button in the AST view in the CodeQL view found on the Visual Studio Code [Activity Bar](https://code.visualstudio.com/docs/getstarted/userinterface#_basic-layout).
Alternatively, you can right-click in the Editor and run the command *CodeQL: View AST*.
