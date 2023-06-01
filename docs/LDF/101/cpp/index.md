---
layout: workshop-index
title: Elements of Syntactical Program Analysis I for C/C++
course_number: LDF-101-CPP
abstract: We learn how to query the AST of a C program and refactor it along the way by investigating a buffer overflow vulnerability in a sample Linux driver.
language: C/C++
octicon: package
toc: false
topics: syntactical, C, AST, buffer-overflow, linux
---

## Introduction

An Abstract Syntax Tree (AST) is a representation of a given program that exposes its syntactic structure. The AST is much like a parse tree, but more concise and to-the-point, which makes it a convenient tool to investigate into simple topics such as whether the program contains a certain element, up to more complex ones such as whether it follows a certain structural pattern. These properties are static by nature, so these analyses provide high precision.

We learn how to query the AST of a C program and refactor it along the way by investigating a buffer overflow vulnerability in a sample Linux driver. We first start by identifying the point where the program inserts a driver definition to the kernel by using one of its APIs, and climb up the dependency chain by finding definitions and initializations of the types and objects used in the program. Finally, we reach the vulnerable function in question.

By following through the workshop, we learn how to express our interest in a query language CodeQL and learn that we are able to go quite far only by syntactic analysis that combines various constraints together using formulas, predicates, and classes.
