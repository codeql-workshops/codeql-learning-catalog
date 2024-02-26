---
layout: page
title: Introduction
octicon: package
banner: banner-code-graph-shield.png
toc: false
---

This workshop is an introduction to identifying syntactical elements using QL by implementing a basic Andersen style points-to analysis.
A points-to analysis is a [pointer analysis](https://en.wikipedia.org/wiki/Pointer_analysis) that statically determines the set of object a variable can point to and provides information that can be used to improve the accuracy of other analyses such as computing a call-graph.
For example, consider the following Java snippet. How do we determine which `foo` method is called?
To answer the question we need to know to what object `a` points to, which can be an instance of `A` or `B` depending on how `bar` is called.

```java
class A {
    public void foo() {}
}

class B extends A {
    @Override
    public void foo() {}
}

class C {
    public void bar(A a) {
        a.foo();
    }
}
```

In this workshop the focus will be on syntactically describing elements and not the points-to algorithm.
We will learn how to describe:

- How objects are created.
- How methods are called.
- How variables are accessed and assigned a value.
- How fields are accessed, assigned a value, and how to get the qualifier of a field access.
- How to syntactically matchup method arguments with method parameters.
- How to reason about statements in a method.

We will follow the declarative formulation of the basic points-to analysis as found in the book [Pointer Analysis](https://yanniss.github.io/points-to-tutorial15.pdf)[^2]
