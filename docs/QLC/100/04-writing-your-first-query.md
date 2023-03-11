---
layout: page
title: Writing your first QL query
octicon: package
toc: false
---

Now that we have created our query and test CodeQL packs we can finally start with our first query!

Create the file `HelloWorld.ql` in the `qlc-100/problems` CodeQL pack with the following content:

```c file=./src/solutions/HelloWorld.ql
```

That is it for our first query. To determine if it works as intended we want to test it so we should add a unit test to our `qlc-100-tests/problems` CodeQL pack.

1. Create a folder `HelloWorld` in the `qlc-100-tests/problems` directory.
2. Add the file `HelloWorld.qlref` in the just created directory `HelloWorld` with the contents:

    ```c file=./tests/solutions/HelloWorld.qlref
    ```

3. Add the file `HelloWorld.expected` in the just created directory `HelloWorld` with the contents:

    ```c file=./tests/solutions/HelloWorld.expected
    ```

The `HelloWorld.qlref` is a query reference file that references to a query to be tested. It is a path relative to a CodeQL pack.

<details><summary>How does CodeQL know which CodeQL pack?</summary>

CodeQL will go through the dependencies to determine which CodeQL pack contains the query.

</details>

Instead of a query reference file you can also specify a query file directly. However, it is common to separate them into their own CodeQL packs so they can be independently be published and deployed.

The `HelloWorld.expected` file contains the expected output when running the query on a database built from files residing in the `HelloWorld` directory. In our case we have none, so the database will be empty.

With the qlpack specification for the test we can run the test using the [Test Explorer UI](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-test-explorer) extension that is installed as a dependency of the CodeQL extension.

![img](/assets/images/QLC/100/test-explorer-ui-extension.png "The HelloWorld test listed in the Test Explorer UI")

We can run the test from the Test Explorer UI or run the test from the terminal with the command:

```bash
codeql test run tests/problems/HelloWorld
```

Either way, running the test will result in the error:

```bash
Error: Could not locate a dbscheme to compile against.
You probably need to specify a libraryPathDependencies list in
/.../src/qlpack.yml
```

The test is unable to determine the database schema to our query in the `qlc-100/problems` CodeQL pack. Every CodeQL database adheres to a language specific database schema and every query should adhere to the same schema so it can correctly query the database. The database schema for queries (as supposed to the extractor creating the database) is located in the standard library `all` pack of the language we want to query.

While we remain language agnostic with the queries discussed in this workshop, we still need to pick a language for the database schema. Adjust the `qlpack.yml` of the `qlc-100/problems` CodeQL pack to match the following content:

```yaml
---
library: false
name: qlc-100/problems
version: 0.0.1
dependencies:
  "codeql/cpp-all": "*"
```

To ensure the dependency is available we need to run the command:

```bash
▶ codeql pack install qlc-100/problems
Dependencies resolved. Installing packages...
Install location: /.../.codeql/packages
Package install location: /.../.codeql/packages
Already installed codeql/cpp-all@0.4.3 (library)
```

Through the `qlc-100/problems` CodeQL pack the `qlc-100-tests/problems` CodeQL pack has a dependency on `codeql/cpp-all` as well. So we need to resolve those dependencies by running the command:

```bash
▶ codeql pack install qlc-100-tests/problems
Dependencies resolved. Installing packages...
Install location: /.../.codeql/packages
Package install location: /.../.codeql/packages
Already installed codeql/cpp-all@0.4.3 (library)
```

With all the dependencies resolved we can re-run the test. Try running both from Testing Explorer UI and using the CodeQL CLI.

Congrats, you have written your first query!
