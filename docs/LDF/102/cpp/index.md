---
layout: workshop-index
title: Reasoning about Control Flow I for C/C++
course_number: LDF-102-CPP
abstract: We learn how to query the AST of a C program and refactor it along the way by investigating a buffer overflow vulnerability in a sample Linux driver.
language: cpp
octicon: package
banner: banner-code-graph-shield.png
toc: false
topics: syntactical, C, AST, Control Flow, linux
---

## Introduction

"LDF-102 - Reasoning about Control Flow I" is a comprehensive workshop designed to introduce and deepen your understanding of using CodeQL to reason about control flow in your code. CodeQL, a powerful semantic code analysis engine, allows you to explore your codebase in a way that goes beyond syntax-based analysis. This workshop will guide you through the process of using CodeQL to identify and understand the control flow paths in your code, which is crucial for detecting potential vulnerabilities and bugs.

Contrasting this with syntax-based analysis, CodeQL offers a more profound and insightful analysis. While syntax-based analysis focuses on the structure of the code, CodeQL delves deeper into the semantics of the code, providing a more accurate and detailed understanding of the code's behavior. This difference makes CodeQL a more powerful tool for code analysis, as it can identify complex code patterns and potential issues that might be missed by a syntax-based analysis.

In this workshop, you will learn how to use CodeQL to analyze control flow in a variety of contexts. You will gain insights into how control flow can affect the behavior of your code, and how to use this knowledge to improve your code quality. You will also learn how to write your own CodeQL queries to explore and reason about the control flow in your codebase. This knowledge will empower you to identify and fix potential issues in your code, leading to more robust and secure software.

The workshop is split into multiple exercises introducing control flow.
In these exercises you will learn:

- About control flow and the control flow graph (CFG).
- How control flow is represented in QL.
- Learn about reachability and how you can answer reachability questions using recursive predicates and transitive closures.
- About properties of control flow graph nodes, such as dominating other control flow nodes.
- About corner-cases when reasoning using control flow, how data flow provides higher level construct to answer reachability questions, but still requires control flow to excludes correct cases.
