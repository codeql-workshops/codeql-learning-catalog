---
layout: page
title: The essence of a QL query
octicon: package
toc: false
---

With a basic understanding of the structure of a query we can continue looking at the building blocks of queries, namely *types*, *expressions*, *formulas*, and *predicates*.

In essence, a query is about relating types and their values. By solving a logic puzzle we are going to learn more about the building blocks and how they can be used.

### Predicates

Let's start with a simple logic puzzle. There are five racers named `A`, `B`, `C`, `D`, and `E`. Each finish the race as follows:

- `C` finishes before `B`, but not before `D`
- `E` finishes before `A`, but not before `B`

What is the finish order?

We have a relation between racers that determines who finishes before another racer. How can we capture such a relation?

Let's start with a first attempt where we use integers combined with comparison expressions. Create the query file `PuzzleOneAttemptOne.ql` and the corresponding QL test files in the directory `PuzzleOne`.

```ql file=./src/solutions/PuzzleOneAttemptOne.ql
```

When we run this query we get the following results.

```diff file=./tests/solutions/PuzzleOneAttemptOne.expected
```

Representing the correct result `D` `C` `B` `E` `A`.

However, the query doesn't seem very *elegant*. We have to manually construct the final result. What if we add more racers, lets say up to a total of 1024? That would become very unwieldy. We need a better way to capture the relation between two racers.

In logic, a *predicate* represents a property or relation. QL, being a logical language, supports predicates. Create the query file `PuzzleOneAttemptTwo.ql` and the corresponding QL test files. In the query file define the predicate `finishesBefore` that captures the relation between the racers.

```ql file=./src/solutions/PuzzleOneAttemptTwoA.ql
```

Run the `PuzzleOneAttemptTwo.qlref` test and mount the test database `PuzzleOne.testproj` of the failed test. Note that the test database has the name of the test directory, because the parent directory of each `.qlref` file is used to construct a test database.

With the test database mounted we can now test our predicate `finishesBefore` with quick evaluation. The Visual Studio Code editor will provide hints as to what can be quick evaluated.

![img](/assets/images/QLC/100/quick-evaluation.png "Quick evaluating hint on `finishesBefore` predicate.")

The result of quick evaluating the `finishesBefore` predicate should match:

```ql file=./tests/solutions/PuzzleOneAttemptTwoA.expected
```

The quick evaluation functionality is super useful when debugging your logic. Besides the hints provided by Visual Studio Code you can also select *formulas*, *expressions*, and *types* and quick evaluate them with a right-click to access the `CodeQL: Quick Evaluation` command.

![img](/assets/images/QLC/100/partial-quick-evaluation.png "Quick evaluating the first two disjunctions.")

To find the finish order we want to *connect* the tuples created by the predicate `finishesBefore`. For example, `(D, C)` and `(C, B)` to get a partial finish order `(D,C,B)`. That is, the second argument in one predicate call becomes the first argument in another call.

<details><summary>Implement a query to find the partial finish order `D C B` using the `finishesBefore` predicate.</summary>

```ql
from string one, string two, string three
where one = "D" and finishesBefore(one, two) and finishesBefore(two, three)
select one, two, three
```

</details>

The solution works well for this partial finish order, but we are back to representing each of the racers as a variable and having to make multiple predicate calls to get the complete finish order.

This repeated connecting of predicate calls is a common pattern in reachability problems and are typically concerned with whether one location can reach another location given a step function. More concrete examples are:

- Can function `foo` reach function `bar` through function calls?
- Can the value of variable `foo` reach argument `bar` of function `baz`?

We can treat the finish order problem as a reachability problem by finding the path from the first finisher to the last.

QL supports the repeated application of a predicate through recursion. In a recursive predicate we have to consider two cases:

1. The base case, which determines when we are done.
2. The recursive case

The following example demonstrates how recursion can be used to find all the finishers after a certain finisher. Note that we renamed the predicate `finishesBefore` to `finishesBeforeStep` to highlight it is a step function.

```ql file=./src/solutions/PuzzleOneAttemptTwoB.ql#L1-L17

```

The base case is our step predicate `finishesBeforeStep`, finding all the finishers reachable with a single step. The recursive case uses the [quantified formula](https://codeql.github.com/docs/ql-language-reference/formulas/#quantified-formulas) [exists](https://codeql.github.com/docs/ql-language-reference/formulas/#exists). Quantified formulas allow us to introduce temporary variables that we can use in the formula's body to create new formulas from existing ones. The `exists` formula has the syntax `exists(<variable declarations> | <formula>)`. The syntax used in our example, `exists(<variable declarations> | <formula1> | <formula2>)`, is equivalent to `exists(<variable declarations> | <formula1> and <formula2>)`.

We use the `exists` to create a new formula from the predicate `finishesBeforeStep` and the predicate `finishesBefore` to find another racer that we can reach with a single step and all the racers that reachable from that other racer.

Quick evaluating the new `finishesBefore` predicate provides us with the result:

```ql file=./tests/solutions/PuzzleOneAttemptTwoB.expected
```

Because this type of recursion is very common QL has implemented a shortcut that computes a [transitive closure](https://codeql.github.com/docs/ql-language-reference/recursion/#transitive-closures) of a predicate. The transitive closure is obtained by repeatedly calling a predicate.

QL has two types of transitive closures. The transitive closure `+` that calls a predicate one ore more times. The reflexive transitive closure `*` calls a predicate zero or more times. The transitive closure of a predicate call can be used by appending a `+` or a `*` to the predicate name in a predicate call.

Using our step function we can compute the transitive closure by calling it as `finishesBeforeStep+(racerOne, racerTwo)`.

The transitive closure cannot be used on all predicate calls. The predicate must have two arguments with types that are [compatible](https://codeql.github.com/docs/ql-language-reference/types/#type-compatibility).

<details><summary>Write a query that uses the transitive closure of the predicate `finishesBeforeStep` to compute the same results as the recursive predicate `finishesBefore`.</summary>

```ql file=./src/solutions/PuzzleOneAttemptTwoC.ql#L11-L14

```

</details>

To determine if the results are the same you can use the `Compare Results` option in the `Query History` pane of the CodeQL extension.

Select to last two items in the history, right-click, and select `Compare Results`. This should result in an empty comparison.

![img](/assets/images/QLC/100/compare-results.png "Compare query results")

With our transitive closure we are almost done with finding the finish order. First we want to limit the reachable racers from the first finisher. Secondly we want a single answer.

Let's continue with determining which racer is the first to finish.

<details><summary>How can you determine who is the first finisher?</summary>

The first finisher is a finisher with no finisher before them. That is, it is not the case there exists another finisher that finishes before the first one.

</details>

In QL you can negate a formula by prepending a `not` to that formula. For example, the following query returns all pairs where `racerOne` does not finish before `racerTwo`.

```ql file=./src/solutions/PuzzleOneAttemptTwoD.ql#L11-L16
```

The extra equality expressions for `racerOne` and `racerTwo` are required because we can't determine the range of values for `racerOne` and `racerTwo` from a negation. That is, `not` is not [binding](https://codeql.github.com/docs/ql-language-reference/evaluation-of-ql-programs/#binding). Without those the CodeQL will give an error that `racerOne` and `racerTwo` are not bounded to a value. This is caused by the fact that many of the primitive types including `string` are infinite. They have an infinite number of values. Since QL can only work with finite results we need to restrict the set of values for the result. Before, that was done by the `finishesBeforeStep` predicate.

To restrict the set of values we use the member predicate `charAt` that expects an index. We, however, are not interested in a particular index so we pass the [dont'-care expression](https://codeql.github.com/docs/ql-language-reference/expressions/#don-t-care-expressions). That is any value which will result in calling the predicate with all the indices binding the racers to the characters `["A", "B", "C", "D", "E"]`. `racerOne = "ABCDE".charAt(_)` is equivalent to `racerOne = ["A", "B", "C", "D", "E"]` where the latter is the [set literal expression](https://codeql.github.com/docs/ql-language-reference/expressions/#set-literal-expressions) we used in the very beginning.

<details><summary>Using the `not` formula, write a predicate `firstFinisher` that holds if a finisher is the first finisher. Remember, `not` is not [binding](https://codeql.github.com/docs/ql-language-reference/evaluation-of-ql-programs/#binding).</summary>

```ql file=./src/solutions/PuzzleOneAttemptTwoE.ql#L11-L14
```

</details>

With the `firstFinisher` predicate we can now limit the results to the first finisher and all those that are reachable from the first finisher.

<details><summary>Write a query that returns the first finisher and all the finisher reachable from that first finisher.</summary>

```ql file=./src/solutions/PuzzleOneAttemptTwoF.ql#L16-L18
```

</details>

So now we have the first finisher and all those that finish after. However, there are still multiple results. The last task is to [aggregate](https://codeql.github.com/docs/ql-language-reference/expressions/#aggregations) the finishers to get the final finish order.

In our case the aggregate `[[https://codeql.github.com/docs/ql-language-reference/expressions/#aggregations][concat]]` looks interesting, however, we can't properly control the order of the results which in this case is important.

That is, the following does not give the correct order because strings are sorted lexicographically.

```ql file=./src/solutions/PuzzleOneAttemptTwoG.ql#L16-L20
```

<details><summary>Why does the query use the reflexive transitive closure operator `*`?</summary>

To include the `firstFinisher` that does not have a finisher before them.

</details>

That means we need to build the final finish order ourselves, recursively. We have seen recursion and the closely related transitive closure before. In most cases the transitive closure is sufficient, but sometimes you want more control. For example when the goal is to find all the functions reachable from a function `entrypoint` that are not reachable by an authorization function to determine authentication bypasses.

In this case we want to build up the finish order from the first finisher. A recursive problem requires two cases, the base case, and the recursive case.

<details><summary>The base case determines when we are done. What would that be in our problem?</summary>

When we have reached the last finisher.

</details>

<details><summary>Implement the predicate `lastFinisher` using the already defined predicate `finishesBeforeStep`. You can take inspiration from the predicate `firstFinisher`. Remember that the `not` does not *bind*.</summary>

```ql file=./src/solutions/PuzzleOneAttemptTwoH.ql#L16-L18
predicate lastFinisher(string racer) {
    not finishesBeforeStep(racer, _) and finishesBeforeStep(_, racer)
}
```

</details>

<details><summary>Write the predicate `finishOrderFor`. QL supports [predicates with results](https://codeql.github.com/docs/ql-language-reference/predicates/#predicates-with-result). A predicate with a result is defined by replacing the keyword `predicate` with the type of the result. The result can be referenced through a special variable `result`. Semantically it is the same as predicates without a result, the result would just be a parameter, but it can result in a more readable query because you can omit a `exists`.

```ql
string finishOrderFor(string racer) {
    none() // replace with implementation
}
```

</summary>

With the predicate `finishesBeforeStep` rewritten as a predicate with a value, and the predicate `finishOrderFor` written as a predicate with a value, the complete query becomes.

```ql file=./src/solutions/PuzzleOneAttemptTwo.ql
```

The result of this query should be:

```ql file=./tests/solutions/PuzzleOneAttemptTwo.expected
```

</details>
