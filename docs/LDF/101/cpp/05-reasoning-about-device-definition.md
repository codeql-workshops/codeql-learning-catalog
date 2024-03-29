---
layout: page
title: Finding the Function that Overflows a Buffer
octicon: package
toc: false
---

We are now ready to find the culprit that is responsible for overflowing a buffer! As you have notices, that code is injected into the kernel by being included in the driver definition and registered to the kernel.

### Exercise 8

Having known what type the third field of `struct miscdevice` has, we can now identify all `file_operation`s such as `vuln_ops`. Implement the characteristic predicates for the class `FileOperationsStruct` and `FileOperationsDefinition` in Exercise8.ql.

<details>
<summary>Hints</summary>

- The class `Struct` inherits the member predicate `getName` from the class `UserType` that gives the name of the struct.
- Each program element represented by the class `Element` can be related to the primary file the element occurs in using the member predicate `getFile`.
- Each program element has an absolute path that can be accessed using the member predicate `getAbsolutePath` on the class `File`.
- The QL string type provides [builtins](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#built-ins-for-string) such as `matches` and `regexpMatch` to match patterns in strings. The `matches` builtin member predicate interprets `_` to match any single character and `%` to match any sequences of characters in the provided pattern.

</details>

### Exercise 9

The single file operation definition `vuln_ops` is initialized with, among others, a function pointer for the field `unlocked_ioctl`. This is the function that is invoked when a user-mode application performs the `ioctl` system call to communicate to the driver.

Extend the class `FileOperationsDefinition` with a member predicate `getUnlockedIoctl` that returns a `Function` with which the file operations definition is initialized in
Exercise9.ql.

<details>
<summary>Hints</summary>

- The class `Variable` has the member predicate `getAnAssignedValue` that returns an `Expr` representing an expression that is assigned to this variable somewhere in the program.
- The class `Field` inherits the member predicate `hasName` from the class `Declaration` that holds if the field has the provided name.
- The class `ClassAggregateLiteral` has the member predicate `getFieldExpr` that returns an `Expr` that is part of the aggregate literal that is used to initialize the provided field.

Did you find the function referred to by the pointer?

</details>
