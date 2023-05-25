# CodeQL workshop: Syntactical elements of C/C++

## Problem Statement

In this workshop, we use CodeQL to analyze the source code of a [vulnerable Linux driver](https://github.com/invictus-0x90/vulnerable_linux_driver) to pinpoint a portion of source code that causes a buffer overflow.

Linux kernels allows users to register their simple drivers as a [miscellaneous character driver](https://www.linuxjournal.com/article/2920) (henceforth misc driver), and this project aims to provide a misc driver ready to be inserted into the kernel. Linux misc drivers need to be added and removed to the kernel via two API functions provided by the kernel, [`misc_register`](https://github.com/torvalds/linux/blob/8ca09d5fa3549d142c2080a72a4c70ce389163cd/include/linux/miscdevice.h#L91) and [`misc_unregister`](https://github.com/torvalds/linux/blob/8ca09d5fa3549d142c2080a72a4c70ce389163cd/include/linux/miscdevice.h#L92), respectively.

Looking close to the source code of this project, we can see it [register a vulnerable device](https://github.com/invictus-0x90/vulnerable_linux_driver/blob/2bbfdadd403b6def98f98f6ee3f465286f35e0c9/src/vuln_driver.c#L156) represented as a `static struct` that contains another struct that implements `file_operations` which bridges between user-space application code (performing I/O with the device) and the kernel. The vulnerable point is the `do_ioctl` function being registered as that user-space code, hence the aim of our investigation.

Starting from the `misc_register` function we will traverse function calls, expressions, structure definitions, and variable initializations to find this entrypoint `do_ioctl`. In the course of this investigation, you will learn how to:

- Discover how QL represents C/C++ program elements.
- Query program elements in the AST ([Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)).
- Learn how to express descriptions of certain program elements using QL classes.

## Setup instructions

### GitHub Codespaces

<!-- TODO Pure imagination. Need to make concrete by actually trying everything ourselves. -->

- From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
- Choose `vld.zip` provided by Git LFS.  <!-- This implies that git lfs pull is done as the codespace is built; post-init-hook, as it were. -->
- No further steps are necessary!

### Working locally

- Install [Visual Studio Code](https://code.visualstudio.com/).
- Install the [CodeQL extension for Visual Studio Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/setting-up-codeql-in-visual-studio-code/).
- Clone this repository and additionally run `git lfs pull` to get the precompiled database to work on.
- Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `ldf-101-cpp-src`.
- From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
- Choose `vld.zip` provided by Git LFS.

## Documentation Links

If you get stuck, try searching our documentation and blog posts for help and ideas. Below are a few links to help you get started:

- [Learning CodeQL](https://codeql.github.com/docs/writing-codeql-queries/)
- [CodeQL Language Guides for C/C++](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
- [CodeQL Standard Library for C/C++](https://codeql.github.com/codeql-standard-libraries/cpp)
- [CodeQL](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
- [Using the CodeQL extension for VS Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/)

## Workshop

The workshop is split into several steps. You can write one query per step, or work with a single query that you refine at each step. Each step has a **hint** that suggests useful classes and predicates in the CodeQL standard libraries for C/C++. You can explore these in VSCode using the autocomplete suggestions `Ctrl+Space` and the `Go to Definition` command bound to `F12`.

### Exercise 1

Since we are first looking for calls to the function `misc_register`, we start off by listing all the function calls in the program. Find all the function calls in the program by implementing [Exercise1.ql](exercises/Exercise1.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` can be used to reason about function calls in the program.

</details>

A solution can be found in the query [Exercise1.ql](solutions/Exercise1.ql).

### Exercise 2

That's a big list of function calls! So let's narrow it down to what we're actually looking for. Filter out rows from the previous table to only have the calls to function `misc_register` by implementing [Exercise2.ql](exercises/Exercise2.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` provides the member predicate `getTarget` to refer to the called function.
- The class `Function` provides the member predicate `getName` to get the name of the function.

</details>

A solution can be found in the query [Exercise2.ql](solutions/Exercise2.ql).

There should be only one such call if the result is correct.

### Exercise 3

So far, we have been adding our constraints to the `where` clause directly. That works, but it makes the `where` clause increasingly hard to read and makes it hard for us to introduce new concepts to be used in some of the constraints. [Predicates](https://codeql.github.com/docs/ql-language-reference/predicates/) and [classes](https://codeql.github.com/docs/ql-language-reference/types/#classes) allow you to do that by encapsulating logical conditions in a reusable format.

Convert your solution to [Exercise2.ql](exercises/Exercise2.ql) into a _class_ in [Exercises3.ql](exercises/Exercise3.ql) by replacing the [none](https://codeql.github.com/docs/ql-language-reference/formulas/#none) formula in the [characteristic predicate](https://codeql.github.com/docs/ql-language-reference/types/#characteristic-predicates) of the `MiscRegisterFunction` class.

Also, besides relying on the name, try to add another property to distinguish the function we're looking for. What about the path to the file a program element lives in?

<details>
<summary>Hints</summary>

- Each program element represented by the class `Element` can be related to the primary file the element occurs in using the member predicate `getFile`.
- Each program element has an absolute path that can be accessed using the member predicate `getAbsolutePath` on the class `File`.
- The QL string type provides [built-in member predicates](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#built-ins-for-string) such as `matches` and `regexpMatch` to match patterns in strings. The `matches` predicate interprets `_` to match any single character and `%` to match any sequences of characters in the provided pattern.

</details>

A solution can be found in the query [Exercise3.ql](solutions/Exercise3.ql)

### Exercise 4

Now that we found the call to `misc_register` in question, we shift gears to its argument `&vuln_device`, a representation of the problematic driver. This seems interesting, so let us inspect this in detail. Obtain the argument to the call, and determine the argument's type and its primary QL class by implementing [Exercise4.ql](exercises/Exercise4.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` provides the member predicate `getArgument` to get an argument by index.
- Each expression represented by the class `Expr` has a type that can be retrieved with the member predicate `getType`.
- Each program element represented by the class `Element` has a member predicate `getPrimaryQlClass` that returns the QL class that is the most precise syntactic category the element belongs to.
- Relate expressions as much as you can. Relate the call to the misc_register call to the misc_register function, use it to retrieve its argument, and again associate to its type and the primary QL class. `Select` the latter three.

</details>

A solution can be found in the query [Exercise4.ql](solutions/Exercise4.ql)

### Exercise 5

The definition of the miscellaneous driver is defined by the structure `miscdevice`.
Implement the characteristic predicate of the class `MiscDeviceStruct` in
[Exercise5.ql](exercises/Exercise5.ql) so we can reason about its use.

<details>
<summary>Hints</summary>

- The class `Struct` inherits the member predicate `getName` from the class `UserType` that returns the name of the struct.
- Each program element represented by the class `Element` can be related to the primary file the element occurs in using the member predicate `getFile`.
- Each program element has an absolute path that can be accessed using the member predicate `getAbsolutePath` on the class `File`.
- The QL string type provides [builtins](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#built-ins-for-string) such as `matches` and `regexpMatch` to match patterns in strings. The `matches` builtin member predicate interprets `_` to match any single character and `%` to match any sequences of characters in the provided pattern.

</details>

A solution can be found in the query [Exercise5.ql](solutions/Exercise5.ql)

### Exercise 6

Now that we can reason about the structure `miscdevice` we can look for all it instantiations.
Implement the characteristic predicate of the class `MiscDeviceDefinition` in
[Exercise6.ql](exercises/Exercise6.ql) so we use it to find all its instances.

<details>
<summary>Hints</summary>

- The class `Variable` has a member predicate `getType` that gets the type of this variable.

</details>

A solution can be found in the query [Exercise6.ql](solutions/Exercise6.ql)

### Exercise 7

The instantiation `vuln_device` initializes 3 members of the `miscdevice` structure.
Find the type of the third field initialized with `&vuln_fops` by implementing
[Exercise7.ql](exercises/Exercise7.ql).

<details>
<summary>Hints</summary>

- The class `Struct` inherits the member predicate `getAMember` from the class `Class` that gets the zero-based indexed member declared in the struct.
- The class `Field` inherits the member predicate `getType` from the class `MemberVariable` that returns the type of the field.

<!-- TODO -->
// Implement the where clause that relates the third field of the miscDeviceStruct to field, and field to its type fieldType..
</details>

A solution can be found in the query [Exercise7.ql](solutions/Exercise7.ql)

### Exercise 8

With knowledge of the type of third field om the `miscdevice` structure we can now identify all file operation definitions such as `vuln_fops`.
Implement the characteristic predicates for the class `FileOperationsStruct` and `FileOperationsDefinition` in [Exercise8.ql](exercises/Exercise8.ql).

<details>
<summary>Hints</summary>

- The class `Struct` inherits the member predicate `getName` from the class `UserType` that returns the name of the struct.
- Each program element represented by the class `Element` can be related to the primary file the element occurs in using the member predicate `getFile`.
- Each program element has an absolute path that can be accessed using the member predicate `getAbsolutePath` on the class `File`.
- The QL string type provides [builtins](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#built-ins-for-string) such as `matches` and `regexpMatch` to match patterns in strings. The `matches` builtin member predicate interprets `_` to match any single character and `%` to match any sequences of characters in the provided pattern.

</details>

A solution can be found in the query [Exercise8.ql](solutions/Exercise8.ql)

### Exercise 9

The single file operation definition `vuln_fops` is initialized with, among others, a function pointer for the field `unlocked_ioctl`.
This is the function that is invoked when a user-mode application performs the `ioctl` system call to communicate with the driver.

Extend the class `FileOperationsDefinition` with a member predicate `getUnlockedIoctl` that returns a `Function` with which the file operations definition is initialized in
[Exercise9.ql](exercises/Exercise9.ql).

<details>
<summary>Hints</summary>

- The class `Variable` has the member predicate `getAnAssignedValue` that returns an `Expr` representing an expression that is assigned to this variable somewhere in the program.
- The class `Field` inherits the member predicate `hasName` from the class `Declaration` that holds if the field has the provided name.
- The class `ClassAggregrateLiteral` has the member predicate `getFieldExpr` that returns an `Expr` that is part of the aggregrate literal that is used to initialize the provided field.

</details>

A solution can be found in the query [Exercise9.ql](solutions/Exercise9.ql)

### Exercise 10

We have successfully identified the miscellaneous driver definition, the file operations definition, and linked the ioctl handler to the file operations definition.
Extend the class `MiscDeviceDefinition` with the member predicate `getFileOperations` that returns a `FileOperationsDefinition` that the miscellaneous driver definition is initialized with in [Exercise10.ql](exercises/Exercise10.ql).

<details>
<summary>Hints</summary>

- The class `Variable` has the member predicate `getAnAssignedValue` that returns an `Expr` representing an expression that is assigned to this variable somewhere in the program.
- The class `Field` inherits the member predicate `hasName` from the class `Declaration` that holds if the field has the provided name.
- The class `ClassAggregrateLiteral` has the member predicate `getFieldExpr` that returns an `Expr` that is part of the aggregrate literal that is used to initialize the provided field.
- A class can be cast to a subclass using the syntax `variable.(Class).predicate()`. For example, to cast an expression `expr` to a `AddressOfExpr` to get an operand of the expression you can use the syntax `expr.(AddressOfExpr).getOperand()`.
- The class `AddressOfExpr` that represents the expression taking the address `&expr` has a member predicate `getOperand` that returns the expression of which the address is taken.
- The class `Variable` has a member predicate `getAnAccess` that returns all the access to this variable.

</details>

A solution can be found in the query [Exercise10.ql](solutions/Exercise10.ql)

### Exercise 11

In this final exercise we have to relate the call to `misc_register` to the miscellaneous driver definition so we can find the driver's entrypoint for user-mode.
Implement the characteristic predicate for the class `MiscDriverUserModeEntry` in [Exercise11.ql](exercises/Exercise11.ql) that relates the classes `MiscRegisterFunction`, `MiscDeviceDefinition`, and `FileOperationsDefinition` to obtain the unlocked ioctl handler function.

<details>
<summary>Hints</summary>

- The class `Function` has a member predicate `getACallToThisFunction` that returns all the function call to this function.
- The class `FunctionCall` inherits the member predicate `getArgument` from the class `Call` that returns the nth argument for this call.
- A class can be casted to a subclass using the syntax `variable.(Class).predicate()`. For example, to cast an expression `expr` to a `AddressOfExpr` to get an operand of the expression you can use the syntax `expr.(AddressOfExpr).getOperand()`.
- The class `Variable` has a member predicate `getAnAccess` that returns all the access to this variable.

</details>

A solution can be found in the query [Exercise11.ql](solutions/Exercise11.ql)
