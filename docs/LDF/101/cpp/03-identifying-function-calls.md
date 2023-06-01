---
layout: page
title: Identifying the Linux Driver API Call
octicon: package
toc: false
---

We track the insecure function in question, the I/O function which overflows the buffer, backwards from the API call `misc_register` that registers a vulnerable driver. We take a number of steps to actually get there, so keep track of where we are at and where we are heading towards during the workshop!

## Exercise 1

Since we are first looking for calls to the function `misc_register`, we start off by listing all the function calls in the program. Find all the function calls in the program by implementing [Exercise1.ql](exercises/Exercise1.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` can be used to reason about function calls in the program.

</details>

## Exercise 2

That's a big list of function calls! So let's narrow it down to what we're actually looking for. Filter out rows from the previous table to only have the calls to function `misc_register` by implementing [Exercise2.ql](exercises/Exercise2.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` provides the member predicate `getTarget` to refer to the called function.
- The class `Function` provides the member predicate `getName` to get the name of the function.

</details>

There should be only one such call if the result is correct. Is that the one inside the definition of `vuln_module_init` as seen below?

```c
/**
* Register the device.
*/
static int vuln_module_init(void)
{
    int ret;

    ret = misc_register(&vuln_device);

    ...
}
```

## Exercise 3

So far, we have been adding our constraints to the `where` clause directly. That works, but it makes the `where` clause increasingly hard to read and makes it hard for us to introduce new concepts to be used in some of the constraints. [Predicates](https://codeql.github.com/docs/ql-language-reference/predicates/) and [classes](https://codeql.github.com/docs/ql-language-reference/types/#classes) allow you to do that by capturing logical conditions in a reusable format.

Convert your solution to [Exercise2.ql](exercises/Exercise2.ql) into a CodeQL class in [Exercises3.ql](exercises/Exercise3.ql) by replacing the [none](https://codeql.github.com/docs/ql-language-reference/formulas/#none) formula in the [characteristic predicate](https://codeql.github.com/docs/ql-language-reference/types/#characteristic-predicates) of the `MiscRegisterFunction` class. Also, besides relying on the name, try to add another property to distinguish the function we're looking for. What about the path to the file a program element lives in?

<details>
<summary>Hints</summary>

- Each program element represented by the class `Element` can be related to the primary file the element occurs in using the member predicate `getFile`.
- Each program element has an absolute path that can be accessed using the member predicate `getAbsolutePath` on the class `File`.
- The QL `string` type provides [built-in member predicates](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#built-ins-for-string) such as `matches` and `regexpMatch` to match patterns in strings. The `matches` predicate interprets `_` to match any single character and `%` to match any sequences of characters in the provided pattern.

</details>
