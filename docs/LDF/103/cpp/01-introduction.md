---
layout: page
title: Introduction
octicon: package
banner: banner-code-graph-shield.png
toc: false
---

In this workshop, we will use CodeQL to analyze the source code of
[dotnet/coreclr](https://github.com/dotnet/coreclr), the runtime for .NET
Core, to see if there are possible attack vectors of a [format string injection vulnerability](https://owasp.org/www-community/attacks/Format_string_attack).

Many security problems, format string injection, can be phrased in terms of _information flow_:

> _Given a (problem-specific) set of sources and sinks, is there a path in the data flow graph from some source to some sink?_

Some real world examples include:

- SQL injection: A user input received outside a program is a source, and the assembled SQL query run against a database is a sink.
- Reflected XSS: An HTTP request received by a server backend is a source, and an HTTP response containing possibly malicious Javascript code is a sink.

We can solve such problems using either the data flow library or the taint tracking library. There are two variants of data tracking available in CodeQL:

- Local ("intra-procedural") data flow models flow within one function.
- Global ("inter-procedural") data flow models flow across function calls, chained by their arguments.

On the one hand, local data flow is computed only within a scope of a single function and is feasible to compute for all functions in a CodeQL database, but does not give an interesting result by itself. On the other hand, global data flow allows us to understand how a piece of data might travel through the entire program, hence yields more interesting result.

But global data flows are not feasible to compute for all functions in a database because the number of paths becomes _exponentially_ larger for global data flow, making infeasible to build a reachability table for the whole program, given any reasonably sized one. That is, constructing the table is bounded by `O(n*n)` where `n` is the number of data flow nodes in the _entire_ program.

The global data flow (and taint tracking) library avoids this problem by requiring that the query specifies what _sources_ and _sinks_ to look for. This allows CodeQL to compute paths containing only the restricted set of nodes between the specified sources and sinks, rather than for the entire set of data flow nodes present in the program.

In this workshop we will try to write a global data flow query to find if there is a format string that is supplied by an attacker from outside the program which might travel through several functions. To do this, we will learn the following:

- How to use the `Security` library for predefined entry-point definitions
- How to use the `DataFlow` library to specify an analysis
- How to use the `PathGraph` library to find the full path with intermediate nodes

The workshop is split into several steps. You can write one query per step, or work with a single query that you refine at each step. Each step has a **hint** that describes useful classes and predicates in the CodeQL standard libraries for C/C++. You can explore these in VSCode using the autocomplete suggestions `Ctrl+Space` and the `Go to Definition` command bound to `F12`.