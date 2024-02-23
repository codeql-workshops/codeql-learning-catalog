---
layout: workshop-index
title: Elements of Syntactical Program Analysis I for Java
course_number: LDF-101-JAVA
abstract: We learn how to query the AST of a Java program as a means of implementing a points-to analysis.
language: java
octicon: package
banner: banner-code-graph-shield.png
toc: false
topics: syntactical, Java, AST, points-to, linux
---

## Introduction

An Abstract Syntax Tree (AST) is a representation of a given program that exposes its syntactic structure. The AST is much like a parse tree, but more concise and to-the-point, which makes it a convenient tool to investigate into simple topics such as whether the program contains a certain element, up to more complex ones such as whether it follows a certain structural pattern. These properties are static by nature, so these analyses provide high precision.

By following through the workshop, we:

- Discover how QL represents Java program elements.
- Learn how to Query program elements in the AST ([Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)).
- Learn how to express descriptions of certain program elements using QL classes.
