---
layout: page
title: "CodeQL workshop for C/C++: Introduction to global data flow"
topics: dataflow, taint
octicon: package
toc: true
---

## Problem statement

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

But global data flows are not feasible to compute for all funtions in a database because the number of paths becomes _exponentially_ larger for global data flow, making infeasible to build a reachability table for the whole program, given any reasonably sized one. That is, constructing the table is bounded by `O(n*n)` where `n` is the number of data flow nodes in the _entire_ program.

The global data flow (and taint tracking) library avoids this problem by requiring that the query specifies what _sources_ and _sinks_ to look for. This allows CodeQL to compute paths containing only the restricted set of nodes between the specified sources and sinks, rather than for the entire set of data flow nodes present in the program.

In this workshop we will try to write a global data flow query to find if there is a format string that is supplied by an attacker from outside the program which might travel through several functions. To do this, we will learn the following:

- How to use the `Security` library for predefined entry-point definitions
- How to use the `DataFlow` library to specify an analysis
- How to use the `PathGraph` library to find the full path with intermediate nodes

## Setup instructions

### Writing queries on your local machine

To run CodeQL queries on dotnet/coreclr, follow these steps:

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Download and install the [CodeQL extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-codeql)
3. Create a folder and open it with Visual Studio Code.
4. Get the `dotnet/coreclr` database added to this repository by doing a `git lfs pull`. It's at `data/`.
5. Import the unzipped database into Visual Studio Code by the `CodeQL: Choose Database from Archive` command available at the Command Palette (bound to `Ctrl+Shift+p` or `Cmd+Shift+p`).
6. Create a new CodeQL pack using the command `codeql pack init workshop-queries` using the terminal in the created folder.
7. Create a new file, name it `FormatStringInjection.ql`, and save it under `workshop-queries`.

## Documentation links

If you get stuck, try searching our documentation and blog posts for help and ideas. Below are a few links to help you get started:

- [Learning CodeQL](https://codeql.github.com/docs/writing-codeql-queries/)
- [Learning CodeQL for C/C++](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
- [Using the CodeQL extension for VS Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/)

## Finding Format String Injection in CoreCLR

The workshop is split into several steps. You can write one query per step, or work with a single query that you refine at each step. Each step has a **hint** that describes useful classes and predicates in the CodeQL standard libraries for C/C++. You can explore these in VSCode using the autocomplete suggestions `Ctrl+Space` and the `Go to Definition` command bound to `F12`.

### Problem Statement

The source code from which our database was compiled contains a formatting function `snprintf` with a format string supplied from outside the program:

1. A user invokes the `createdump` command and passes an `-f` flag to create a dump file and supplies a format string `"%p"` for the `--name` parameter (A printf call with "%p" as its format string reveals the current stack position of the host machine). This abuses the `--name` parameter as it is originally intended to be a file path to write the dump file to.
2. `dumpFilePath` is handed this format string from `argv`.
3. `dumpFilePath` is passed to `CreateDumpCommon` of `createdump.cpp`.
4. `CreateDumpCommon` uses `dumpFilePath` as the format string to `snprintf`.

This does not constitute an actual vulnerability, however, since `snprintf` stores the formatted string to another buffer rather than directly printing to the standard output, for example. Nevertheless, if the subsequent `printf` call at line 39 used the char buffer `dumpPath` as its format string, then this would have been an actual vulnerability.

Such non-constant format strings can be detected using local data flow only; if the variable is placed at the format string position of `snprintf`, we can suspect the format string the variable points to is supplied from outside the program by an attacker. However, that is not the case if every caller of `CreateDumpCommon` passes a hard-coded string literal to it. Therefore, we cannot be sure of whether if the format string variable is actually controllable from the outside, without looking between procedures, that is, looking into the global data flow.

### Finding Program Elements Holding User Inputs

If we consider what we mean by "non-constant", what we really care about is whether an attacker can provide this format string. As a first step, we try to identify elements in the codebase which represent untrusted user input.

**Exercise 1**: Use the `semmle.code.cpp.security.Security` library to identify `DataFlow::Node`s whose expressions are considered user input.

<details>
<summary>Hint</summary>

- The `Security` library contains a `SecurityOptions` class. This class is a little different from the existing classes we have seen, because it is a _configuration_ class which does not represent any set of particular values in the database. Instead, we use a variable of this type to use its member predicates which are useful for writing security related queries.
  - For our case it provides a predicate called `isUserInput` which is a set of expressions in the program which are considered user inputs. You can use the `Go to Definition` command bound to `F12`, to see what counts as a user input function.
- `isUserInput` has two parameters, but we are not interested in the second parameter, so we can use `_` to ignore it.
- We want the `DataFlow::Node` for the user input, so remember to use `.asExpr()` to make that compatible with the `isUserInput` API.
- You can configure custom sources by creating a new subclass of `SecurityOptions`, and overriding one of the existing predicates. However, the default definitions are sufficient for our purposes.

</details>
<details>
<summary>Solution</summary>

A solution can be found in the query [Exercise1.ql](./solutions/Exercise1.ql).

</details>

### Finding Format Strings to a Calls to Some Formatting Function

Now we consider our another point of interest: the format strings to formatting functions like `printf`. It would be a good next step to identify what such function calls are and where they are.

**Exercise 2**: Find formatting function calls to identify `DataFlow::Node`s whose expressions are considered as a format string to a formatting function call.

<details>
<summary>Hint</summary>

- We do not need any additional libraries like `semmle.code.security.Security` from the above.
- The overall approach is exactly the same as the previous exercise.

</details>
<details>
<summary>Solution</summary>

A solution can be found in the query [Exercise2.ql](./solutions/Exercise2.ql).

</details>

### Writing a Global Taint Query

We now know where a user input enters the program, and where format strings are used. What's left is to combine these to find out whether data flows from one of these sources to one of these format strings by looking for what global data flows there are.

As we mentioned in the introduction, unlike local flows when looking for global data flows we need to specify what sources and sinks we are interested in. We express the flows we aim to find by passing a configuration module to an aptly named module `TaintTracking::Make` which is available by importing `semmle.code.cpp.dataflow.new.TaintTracking`.

`TaintTracking::Make` is a special kind of module in that it is _parameterized_. An ordinary module simply groups different classes and predicates in one scope, whereas a parameterized module needs to be passed predicates or even modules to complete its definition. In the case of `TaintTracking::Make`, it needs a module that contains predicates `isSource` and `isSink`. So, we declare a module with our own definitions of `isSource` and `isSink`, and pass that module to `TaintTracking::Make` to create our own version of `TaintTracking` relevant to our problem.

Therefore, in this workshop we focus on implementing a configuration module along with using the customized `TaintTracking` module. For the configuration module, let us declare one named `TaintConfig` with `isSource` and `isSink`.

```ql
module TaintConfig implements DataFlow::ConfigSig {
  predicate isSource(DataFlow::Node source) {
    /* TBD */
  }

  predicate isSink(DataFlow::Node sink) {
    /* TBD */
  }
}
```

Then, we pass `TaintConfig` to `TaintTracking::Make`:

```
module CustomTaintTracking = TaintTracking::Make<TaintConfig>;
```

Now, `CustomTaintTracking` is now our version of `TaintTracking` configured to use our definition of isSource and isSink, tailored to our problem of finding possible format string injections. We use the `hasFlow` predicate inside `CustomTaintTracking` to find what flows are there from a source and a sink.

Putting it all together, we get an outline of the query we will write:

```ql
import cpp
import semmle.code.cpp.dataflow.new.TaintTracking
import semmle.code.cpp.security.Security

module CustomTaintTracking = TaintTracking::Make<TaintConfig>;

module TaintConfig implements DataFlow::ConfigSig {
  predicate isSource(DataFlow::Node source) {
    /* TBD */
  }

  predicate isSink(DataFlow::Node sink) {
    /* TBD */
  }
}

from DataFlow::Node source, DataFlow::Node sink
where CustomTaintTracking::hasFlow(source, sink)
select sink.asExpr(), "This format string may be derived from a $@.", source.asExpr(),
  "user-controlled value"
```

**Exercise 3**: Implement the `isSource` predicate in this using the previous query for identifying user input `DataFlow::Node`s.
<details>
<summary>Hint</summary>

- Use an `exists(..)` to introduce a new variable for `SecurityOptions` within the `isSource` predicate.

</details>
<details>
<summary>Solution</summary>

A solution can be found in the query [Exercise3.ql](./solutions/Exercise3.ql).

</details>

**Exercise 4**: Implement the `isSink` predicate to identify format strings of format calls as sinks.
<details>
<summary>Hint</summary>

- Use an `exists` to introduce a new variable of type `FormattingFunctionCall`, and use the predicate `getFormat()` to identify the format strings.
- Remember to use `DataFlow::Node.asExpr()` when comparing with the result of `getFormat()`.

</details>
<details>
<summary>Solution</summary>

A solution can be found in the query [Exercise4.ql](./solutions/Exercise4.ql).

</details>

If we now run the query, we find the `argv` parameter of the `main` function as the source, and an `snprintf` call at `CreateDumpCommon`.

### Turning the Taint Query into a Path Query

If we look at the previous results, however, it can be hard to verify whether the results are genuine or not, because we only see the source of the problem and the sink, but not the path in between. This can be achieved by converting the query to a _path problem_ query. After we're done, the CodeQL VSCode extension will now show the intermediate path nodes when we click to unfold a drawer.

**Exercise 5**: Convert the previous query to a path problem query.

<details>
<summary>Hint</summary>

- Convert the `@kind` from `problem` to `path-problem`. This tells the CodeQL toolchain to interpret the results of this query as path results.
- Add a new import `CustomTaintTracking::PathGraph`, which will report the path data alongside the query results.
- Change the type of `source` and `sink` variables from `DataFlow::Node` to `CustomTaintTracking::PathNode`, to ensure that the nodes retain path information and they are relevant to our domain of format string injection.
- Use `hasFlowPath` instead of `hasFlow`.
- Change the `select` statement to report the `source` and `sink` as the second and third columns. The toolchain combines this data with the path information from `PathGraph` to build the paths.

</details>

<details>
<summary>Solution</summary>

A solution can be found in the query [Exercise5.ql](./solutions/Exercise5.ql).

</details>

Now we should see a path from `argv` to the `snprintf` call, chained together by threading intermediate path nodes!
