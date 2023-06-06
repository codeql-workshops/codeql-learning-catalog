---
layout: page
title: Identifying Connected Sources and Sinks
octicon: package
toc: false
---

## Creating a Custom Taint Analysis

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

```ql
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

## Exercise 3

At Exercise 1, we have already described the entry-points from which data flows in; we just have to wrap that query into a predicate. Implement the `isSource` predicate in this using the previous query for identifying user input `DataFlow::Node`s.

<details>
<summary>Hint</summary>

- Use an `exists(..)` to introduce a new variable for `SecurityOptions` within the `isSource` predicate.

</details>

## Exercise 4

We also described the other entry-points where the data flows out of the program at Exercise 2. Implement the `isSink` predicate to identify format strings of format calls as sinks, in a similar manner as in Exercise 1.

<details>
<summary>Hint</summary>

- Use an `exists` to introduce a new variable of type `FormattingFunctionCall`, and use the predicate `getFormat()` to identify the format strings.
- Remember to use `DataFlow::Node.asExpr()` when comparing with the result of `getFormat()`.

</details>

If we now run the query, we find the `argv` parameter of the `main` function as the source, and an `snprintf` call at `CreateDumpCommon`.
