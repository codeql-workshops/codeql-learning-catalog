---
layout: page
title: Conclusion
octicon: package
toc: false
---

In this workshop, we have seen how to reason about global data flows in a C program. We opted for taint flows since "breaking out" array elements needed to be taken into account, and for global flows because the format string value passed across function scope boundaries.

For this, we used the `TaintTracking` library and wrote our own configuration for it. We encapsulated the `where` clause into predicates, `isSource` and `isSink` in a module `CustomTaintTracking`. Also, we learned the concept of modules, parameterized modules, and their uses when it comes to configuring the `TaintTracking` library.
