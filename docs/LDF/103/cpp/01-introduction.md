---
layout: page
title: Introduction
octicon: package
banner: banner-code-graph-shield.png
toc: false
---

In this workshop, we will use CodeQL to analyze the source code of
[CoreCLR](https://github.com/dotnet/coreclr), the runtime for .NET
Core, to see if there are possible attack vectors of a [format string injection vulnerability](https://owasp.org/www-community/attacks/Format_string_attack).

CoreCLR contains a debugger called `createdump` which provides dumping functionalities for later inspection. The `createdump` command accepts flagged arguments supplied from outside the program and it can lead to format string vulnerability:

1. A user invokes the `createdump` command and passes an `-f` flag to create a dump file and supplies a format string `"%p"` for the `--name` parameter (A printf call with `"%p"` as its format string reveals the current stack position of the host machine). This abuses the `--name` parameter as it is originally intended to be a file path to write the dump file to.
2. `dumpFilePath` is handed this format string from `argv`.
3. `dumpFilePath` is passed to `CreateDumpCommon` of `createdump.cpp`.
4. `CreateDumpCommon` uses `dumpFilePath` as the format string to `snprintf`.

Such untrusted (_tainted_) non-constant format strings can be detected using local taint flow only; if the variable is placed at the format string position of `snprintf`, we can suspect the format string the variable points to is supplied from outside the program by an attacker. However, that is not the case if every caller of `CreateDumpCommon` passes a hard-coded string literal to it. Therefore, we cannot be sure of whether if the format string variable is actually controllable from the outside without looking between procedures, that is, looking into the global taint flow.

But global taint flows are not feasible to compute for all functions in a database because the number of paths becomes _exponentially_ larger for global taint flow, making it infeasible to build a reachability table for the whole program, given any reasonably sized one. That is, constructing the table is bounded by `O(n*n)` where `n` is the number of taint flow nodes in the _entire_ program.

The global taint tracking library avoids this problem by requiring that the query specifies what _sources_ and _sinks_ to look for. This allows CodeQL to compute paths containing only the restricted set of nodes between the specified sources and sinks, rather than for the entire set of taint flow nodes present in the program.

We first describe what taint flow nodes count as sources and sinks in the program, and then we plug those definitions into the `isSource` and `isSink` predicates. We pass a module containing the two predicates to a parameterized module to guide the `TaintTracking` library to look for those nodes only. Finally, we convert the taint query into a path-problem query to reveal the intermediate steps to take to reach a sink node from a source node.

The workshop is split into several steps. You can write one query per step, or work with a single query that you refine at each step. Each step has a **hint** that describes useful classes and predicates in the CodeQL standard libraries for C/C++. You can explore these in VSCode using the autocomplete suggestions `Ctrl+Space` and the `Go to Definition` command bound to `F12`.
