---
layout: workshop-overview
title: LDF-103 - Dataflow I
description: Dataflow I focuses on language specific concepts for helping users identify dataflow present inside a program.
banner: banner-code-graph-shield.png
octicon: package
toc: false
---

## Workshop Description

We have learned how to query the AST in LDF-101 and how to think about the input program in terms of control flow in LDF-102. Now, reasoning about programs takes on a third dimension: thinking in terms of data flow. Data which flow within a program are represented as paths from a certain set of data-flow nodes to another set of data-flow nodes. These data-flow nodes can roughly be matched to nodes in the AST, which we have learned in LDF-101, but they add more subtleties such as reading or writing to an access path formed against an object variable. Also, they live in a separate graph called data flow graph apart from the other two graphs which are ASTs (abstract syntax trees) and CFGs (control flow graphs).

Data flow analysis shines when looking into a program for its security aspects, since a vast majority of security vulnerabilities can be framed as an untrusted data being able to travel through a program, ending up on critical endpoints such as those which render templated HTML, send HTTP requests, or update a production database with an assembled SQL statement. Therefore, CodeQL provides a taint-tracking library (`TaintTracking`) better suited for these queries which propagates untrust towards certain data, as well as providing a more general but basic library (`DataFlow`) that tracks a certain piece of data until it gets modified.

In these set of courses we learn how to use the two libraries for statically-typed languages such as C/C++, Java, Go, and Swift, as well as dynamically-typed languages such as Python, JavaScript, and Ruby. The latter class of languages depends more on data flow analyses than the former, since they lack static type information to reason about program elements. We will also experience the power and convenience of security-related classes and queries included in the CodeQL standard library.
