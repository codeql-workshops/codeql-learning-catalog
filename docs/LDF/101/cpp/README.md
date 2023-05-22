# CodeQL workshop: Syntactical elements of C/C++

## Setup instructions

- Install [Visual Studio Code](https://code.visualstudio.com/).
- Install the [CodeQL extension for Visual Studio Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/setting-up-codeql-in-visual-studio-code/).
- (Optionally) Install [Docker](https://www.docker.com/) if you want to build your own CodeQL database.
- (Optionally) Install the [CodeQL CLI](https://github.com/github/codeql-cli-binaries/releases) if you want to build your own CodeQL database.
- Clone this repository recursively:
  
  ```bash
  git clone --recursive https://github.com/rvermeulen/codeql-workshop-elements-of-syntactical-program-analysis-cpp
  ```

- Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `exercises` and `solutions`.
- Download the [prebuilt database](https://drive.google.com/file/d/1upETVaHIwE9YnJHQcxW9bNJSWCClDmBg/view?usp=sharing) or build the database using the predefined Makefile by running `make`.
- Select the Vulnerable Linux Driver database as the current database by right-clicking on the file `vulnerable-linux-driver-db.zip` in the File explorer and running the command `CodeQL: Set Current Database`.

## Workshop

### Learnings

In this workshop you will learn how to describe syntactical elements of the C/C++ programming language.
With the goal of describing the user-mode entry point of the intentionally [vulnerable Linux driver](https://github.com/invictus-0x90/vulnerable_linux_driver) you will:

- Discover how QL represents C/C++ program elements.
- Learn to query program elements.
- Learn how to encapsulate descriptions of program elements using QL classes.

This workshop focusses on the syntactical parts. Some parts in this workshop can be generalized using more advanced techniques, such as dataflow analysis, that are covered in other workshops.

### Linux Miscellaneous Driver

The intentionally vulnerable Linux driver project implements a [Miscellaneous Character Driver](https://www.linuxjournal.com/article/2920) to expose multiple vulnerabilities to learn about Kernel driver exploitation.

The miscellaneous character driver was designed for use cases that require a small device driver to support custom hardware or software hacks.
To register or unregister a miscellaneous driver, the **misc** driver exports two functions for user modules, that can be found in the header [linux/miscdevice.h](https://github.com/torvalds/linux/blob/master/include/linux/miscdevice.h), called [misc_register](https://github.com/torvalds/linux/blob/8ca09d5fa3549d142c2080a72a4c70ce389163cd/include/linux/miscdevice.h#L91) and [misc_unregister](https://github.com/torvalds/linux/blob/8ca09d5fa3549d142c2080a72a4c70ce389163cd/include/linux/miscdevice.h#L92).

With the `misc_register` function as the starting point we will traverse function calls, expressions, structure definitions, and variable initializations to find the user module entrypoint. This entrypoint will be the start of future workshops that will discuss the vulnerabilities that can be found in this intentionally vulnerable Linux driver.

## Exercises

### Exercise 1

Find all the function calls in the program by implementing [Exercise1.ql](exercises/Exercise1.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` can be used to reason about all the function calls in the program.

</details>

A solution can be found in the query [Exercise1.ql](solutions/Exercise1.ql)

### Exercise 2

Find all the function calls to the function `misc_register` by implementing [Exercise2.ql](exercises/Exercise2.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` provides the member predicate `getTarget` to reason about the called function.
- The class `Function` provides the member predicate `getName` to get the name of the function.

</details>

A solution can be found in the query [Exercise2.ql](solutions/Exercise2.ql)

### Exercise 3

Recall that [predicates](https://codeql.github.com/docs/ql-language-reference/predicates/) and [classes](https://codeql.github.com/docs/ql-language-reference/types/#classes) allow you to encapsulate logical conditions in a reusable format.

Convert your solution to [Exercise2.ql](exercises/Exercise2.ql) into a _class_ in [Exercises3.ql](exercises/Exercise3.ql) by replacing the [none](https://codeql.github.com/docs/ql-language-reference/formulas/#none) formula in the [characteristic predicate](https://codeql.github.com/docs/ql-language-reference/types/#characteristic-predicates) of the `MiscRegisterFunction` class.

Besides relying on the name, try to add another property to distinguish the correct function.

<details>
<summary>Hints</summary>

- Each program element represented by the class `Element` can be related to the primary file the element occurs in using the member predicate `getFile`.
- Each program element has an absolute path that can be accessed using the member predicate `getAbsolutePath` on the class `File`.
- The QL string type provides [builtins](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#built-ins-for-string) such as `matches` and `regexpMatch` to match patterns in strings. The `matches` builtin member predicate interprets `_` to match any single character and `%` to match any sequences of characters in the provided pattern.

</details>

A solution can be found in the query [Exercise3.ql](solutions/Exercise3.ql)

### Exercise 4

The definition of the driver is passed as a parameter to the `misc_register` function.
Obtain the argument to the call, determine the arguments type and primary QL class by implementing [Exercise4.ql](exercises/Exercise4.ql).

<details>
<summary>Hints</summary>

- The class `FunctionCall` provides the member predicate `getArgument` to get a provided argument by index.
- Each expression represented by the class `Expr` has a type that can be retrieved with the member predicate `getType`.
- Each program element represented by the class `Element` has a member predicate `getPrimaryQlClass` that returns the QL class that is the most precise syntactic category the element belongs to.

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
