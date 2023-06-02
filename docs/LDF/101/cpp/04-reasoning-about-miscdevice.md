---
layout: page
title: Reasoning about the Driver Definition
octicon: package
toc: false
---

Now that we found the call to `misc_register` in question, we shift gears to its argument `&vuln_device`, a representation of the problematic driver. This seems interesting, so let us inspect this object in detail.

## Exercise 4

First, identifying the type of the object `vuln_device` might be a good start. Obtain the argument to the call to `misc_register`, the argument's type and the QL class that most precisely represents it by implementing Exercise4.ql.

<details>
<summary>Hints</summary>

- The class `FunctionCall` provides the member predicate `getArgument` to get an argument by index.
- Each expression represented by the class `Expr` has a type that can be retrieved with the member predicate `getType`.
- Each program element represented by the class `Element` has a member predicate `getPrimaryQlClass` that returns the QL class that is the most precise syntactic category the element belongs to.
- Relate QL expressions as much as you can. Relate the call to the misc_register call to the misc_register function, use it to retrieve its argument, and again associate to its type and the primary QL class. `Select` the latter three.

</details>

Does the result indicate that the argument `&vuln_device` is some address of an expression?

## Exercise 5

The `vuln_device` object is of type `struct miscdevice`, defined in one of the Linux headers. If we represent this `struct`, it may be useful later on. Why don't we model it as a class called `MiscDeviceStruct`? Complete the characteristic predicate of the class `MiscDeviceStruct` in Exercise5.ql so we can reason about its use.

<details>
<summary>Hints</summary>

- The class `Struct` inherits the member predicate `getName` from the class `UserType` that returns the name of the struct.
- Each program element represented by the class `Element` can be related to the primary file the element occurs in using the member predicate `getFile`.
- Each program element has an absolute path that can be accessed using the member predicate `getAbsolutePath` on the class `File`.
- The QL `string` type provides [built-in member predicates](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#built-ins-for-string) such as `matches` and `regexpMatch` to match patterns in strings. The `matches` predicate interprets `_` to match any single character and `%` to match any sequences of characters in the provided pattern.

</details>

## Exercise 6

Now that we have the representation of `struct miscdevice`, we can look for all it instantiations. Implement the characteristic predicate of the class `MiscDeviceDefinition` in Exercise6.ql so we can use it to find all its instances.

<details>
<summary>Hints</summary>

- The class `Variable` has a member predicate `getType` that gets the type of this variable.

</details>

## Exercise 7

The instantiation `vuln_device` initializes 3 members of the `miscdevice` structure:

1. `minor`: initialized as `MISC_DYNAMIC_MINOR`, so that the device gets a unique minor number on the fly.
2. `name`: initialized as `DEVICE_NAME`, an alias to string `"vulnerable_device"`.
3. `fops`: this field denotes a file/IO operation to be performed for this device.

The third ones seems interesting. What is its type? Find the type of the third field initialized with `&vuln_fops` by completing Exercise7.ql.

<details>
<summary>Hints</summary>

- The class `Struct` inherits the member predicate `getAMember` from the class `Class` that gets the zero-based indexed member declared in the struct.
- The class `Field` inherits the member predicate `getType` from the class `MemberVariable` that returns the type of the field.
- Relate the QL expressions as much as possible. Relate the third field of the `misc_device` struct to its field with a suitable predicate, then associate the field to its type with another predicate. `Select` the type.

</details>
