---
layout: page
title: Describing Each Entry-points
octicon: package
toc: false
---

## Exercise 1

By "_non-constant_ format strings", what we really care mean is whether an external attacker can provide it. As a first step, we try to identify elements in the codebase which represent untrusted user input. Use the `SecurityOptions` class provided by `semmle.code.cpp.security.Security` to identify `DataFlow::Node`s whose expressions are considered user input.

<details>
<summary>Hint</summary>

- The `SecurityOptions` class is a little different from the existing classes we have seen, because it is a _configuration_ class which does not represent any set of particular values in the database. Instead, we use a variable of this type to use its member predicates which are useful for writing security related queries.
  - For our case it provides a predicate called `isUserInput` which is a set of expressions in the program which are considered user inputs. You can use the `Go to Definition` command bound to `F12`, to see what counts as a user input function.
- `isUserInput` has two parameters, but we are not interested in the second parameter, so we can just plug it with `_` to ignore it.
- We want the `DataFlow::Node` for the user input, so remember to use `.asExpr()` to make that compatible with the `isUserInput` API.
- You can configure custom sources by creating a new subclass of `SecurityOptions`, and overriding one of the existing predicates. However, the default definitions are sufficient for our purposes.

</details>

## Exercise 2

Now we consider our another point of interest: the format strings to formatting functions like `printf`. It would be a good next step to identify what such function calls are and where they are. Find formatting function calls to identify `DataFlow::Node`s whose expressions are considered as a format string to a formatting function call.

<details>
<summary>Hint</summary>

- We do not need any additional libraries like `semmle.code.security.Security` from the above.
- The overall approach is exactly the same as the previous exercise.

</details>

By now, we have identified one end where the data flows start, and another where the flows end.
