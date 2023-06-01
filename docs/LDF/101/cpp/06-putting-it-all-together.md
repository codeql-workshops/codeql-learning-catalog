---
layout: page
title: Putting it all together
octicon: package
toc: false
---

We are almost there and we have all the necessary QL definitions to be assembled into a complete query! Now we refactor our code first, and then connect every bit together to complete this workshop.

### Exercise 10

We have successfully identified the miscellaneous driver definition (`miscdevice`), the file operations definition (`vuln_ops`), and linked the ioctl handler (`do_ioctl`) to the definition of type `file_operations`. Now, we would like to include the act of getting the `file_operation` of `struct miscdevice` under the class which expresses that very `struct miscdevice`, much like encapsulation in object-oriented languages.

Get the class `MiscDeviceStruct` that represents `struct miscdevice` we wrote at Exercise 5, and add a [member predicate](https://codeql.github.com/docs/ql-language-reference/types/#member-predicates) `getFileOperations` that returns a `FileOperationsDefinition` that the miscellaneous driver definition is initialized with in [Exercise10.ql](exercises/Exercise10.ql).

<details>
<summary>Hints</summary>

- The class `Variable` has the member predicate `getAnAssignedValue` that returns an `Expr` representing an expression that is assigned to this variable somewhere in the program.
- The class `Field` inherits the member predicate `hasName` from the class `Declaration` that holds if the field has the provided name.
- The class `ClassAggregateLiteral` has the member predicate `getFieldExpr` that returns an `Expr` that is part of the aggregate literal that is used to initialize the provided field.
- A class can be cast to a subclass using the syntax `variable.(Class).predicate()`. For example, to cast an expression `expr` to a `AddressOfExpr` to get an operand of the expression you can use the syntax `expr.(AddressOfExpr).getOperand()`.
- The class `AddressOfExpr` that represents the expression taking the address `&expr` has a member predicate `getOperand` that returns the expression of which the address is taken.
- The class `Variable` has a member predicate `getAnAccess` that returns all the access to this variable.

</details>

### Exercise 11

Let's put everything together we've done so far by weaving these classes into one:

1. `MiscRegisterFunction`,
2. `MiscDeviceDefinition`, and
3. `FileOperationsDefinition`.

As a result, we will be able to chain the program elements from the misc_register function call, all the way to `do_ioctl` function.

Implement the characteristic predicate for the class `MiscDriverUserModeEntry` in [Exercise11.ql](exercises/Exercise11.ql) that relates the classes `MiscRegisterFunction`, `MiscDeviceDefinition`, and `FileOperationsDefinition` such that its covers the call to `misc_register` and all the way to the definition of `do_ioctl`.

<details>
<summary>Hints</summary>

- The class `Function` has a member predicate `getACallToThisFunction` that returns all the function call to this function.
- The class `FunctionCall` inherits the member predicate `getArgument` from the class `Call` that returns the nth argument for this call.
- A class can be casted to a subclass using the syntax `variable.(Class).predicate()`. For example, to cast an expression `expr` to a `AddressOfExpr` to get an operand of the expression you can use the syntax `expr.(AddressOfExpr).getOperand()`.
- The class `Variable` has a member predicate `getAnAccess` that returns all the access to this variable.

</details>

Now, we can run this final query that successfully identifies the vulnerable function. Is the result as described?
