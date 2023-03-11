---
layout: page
title: The structure of a QL query
octicon: package
toc: false
---

Our first query didn't provide a lot of information around the structure of a QL query besides the use of the `select` keyword.

A typical query contains the following elements:

- Query metadata.
- Import statements
- Definitions of classes and predicates
- The `from`, `where`, and `select` clause.

Let start exploring these components from the bottom up.

1. The `select` clause

    For those familiar with query languages such as SQL the syntax of the `select` clause, consisting of the two optional `from` and `where` parts and the mandatory `select` part, should look familiar.

    ```ql
    from ...
    where ...
    select ...
    ```

    The `from` part can be used to declare variables. Each variable represents a set of values of the same sort described by the variable's type. Because sets of values can overlap (that is, their intersection is not empty) it can be the case that values have multiple types.

    <details><summary>Can you think of an example of a value in a program that would be described by multiple types?</summary>

    For example, a type representing all the expressions in a program and a type representing all the arithmetic expressions in a program.

    </details>

    The following examples describe types and the values they represent.

    - The primitive type `int` with each value being a 32-bit two's complement integer.
    - The primitive type `string` with each value being a finite sequence of 16-bit characters, each interpreted as a Unicode code point.
    - The class `Expr` with each value being an expression in a program (part of the database being queried).

    Note that in the last example we used the term *class* instead of *type*. In QL you can define your own *type* by defining a *class*.

    To reason about the variables and their values we can further restrict the values of the variables in the `where` part.

    QL is a *logic programming language* and is built up of logical formulas. In the `where` part we can use formulas to define logical relations between expressions and are of the form `<expr> <op> <expr>`. Wait, didn't we discussed variables instead of expressions?

    [Expressions](https://codeql.github.com/docs/ql-language-reference/expressions/) evaluate to a set of values.

    <details><summary>What determines the set of values?</summary>

    The set of values an expression evaluates to is determined by a type.

    </details>

    During query writing we will get introduced to the many kinds of expressions. For now we will continue with variables. In a formula a variable can be referenced using a *[variable reference](https://codeql.github.com/docs/ql-language-reference/expressions/#variable-references)*.

    Finally, we have the [select clause](https://codeql.github.com/docs/ql-language-reference/queries/#select-clauses) that determines what we want to *select* as a result for the query. The result of a query will be a set of ordered tuples commonly represented as a table with columns and rows. The columns are determined by the expression provided to the `select` clause. The provided *expressions* **must** evaluate to a value part of a *primitive type*. We will discuss what *primitive types* later on in this workshop. Classes have a *member predicate* `toString` that is used to convert them to a `string`.

    The `as` keyword can be used to label to a column of results and allows the result to be referenced in other expressions part of the select clause. The `order by` keyword allows you to sort the result set. To control the ordering you can use the keywords `asc`, for ascending, and `desc` for descending.

    Let's have a look at some concrete examples!

    1. Add the query `FromWhereSelect.ql` to the CodeQL pack `qlc-100/problems` with the following contents

        ```ql file=./src/solutions/FromWhereSelect.ql
        ```

    2. Add a directory `FromWhereSelect` with the files `FromWhereSelect.qlref` and `FromWhereSelect.expected` to the CodeQL pack `qlc-100-tests/problems`. Make sure to add the path `FromWhereSelect.ql`, the path to the query relative to the CodeQL pack it belongs to, in the `FromWhereSelect.qlref` file.

    3. Run the newly created QL test.

    The test will fail and output the following result.

    ```diff file=./tests/solutions/FromWhereSelect.expected
    ```

    <details><summary>Why did the test fail?</summary>

    The output of the query didn't match our test's expected file.

    </details>

    For each test that fails, the CodeQL extension keeps the database so we can investigate why the test failed. In the directory `FromWhereSelect` there should be an additional directory named `FromWhereSelect.testproj`. You can mount the test database with the command `CodeQL: Set Current Database` that is available in the context menu when you right click on the directory `FromWhereSelect.testproj` in the Visual Studio Code file explorer.

    ![img](/assets/images/QLC/100/mount-testproj.png "Select the failed test database as the current database.")

    To investigate a failed test you can make use of the `CodeQL: Quick query` functionality. This allows you to quickly create a one-off query for a mounted database.

    To test this, perform the following steps:

    1. Mount the `FromWhereSelect.testproj` database.
    2. Execute the command `CodeQL: Quick Query` using the Visual Studio Code [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette). Answer with Yes when prompted to reload the workspace as a multi-folder workspace, and yes when prompted to trust the workspace.

    In the Visual Studio Code Explorer you can now find a new folder named `Quick Queries` with, among others, a file `quick-query.ql` with the contents

    ```ql
    import cpp

    select ""
    ```

    ![img](/assets/images/QLC/100/quick-query-folder.png "Quick query folder added to the workspace")

    The contents of the `quick-query.ql` file has been setup to match the language of your selected database. The language can also be seen in the database section of the CodeQL extension.

    ![img](/assets/images/QLC/100/codeql-databases-section.png "CodeQL extension databases section")

    The query can be executed using the command `CodeQL: Run Query` via the Command Palette or the right-click menu.

    Once you have established why the test cased failed, and corrected your query you can re-run the test. If you start with an empty `FromWhereSelect.expected` file you can accept the test output via the right-click menu that is available on the test or run the CodeQL CLI command `codeql test accept tests/problems/FromWhereSelect/FromWhereSelect.qlref`.

    ![img](/assets/images/QLC/100/accept-test-output.png "Accept test output")

2. Imports

    QL supports [modules](https://codeql.github.com/docs/ql-language-reference/modules/#modules) to organize and reuse QL code. Each query file, with the extension `.ql`, and library file, with the extension `.qll`, *implicitly* defines a module. The `import` statement can be used to import public names (i..e, not annotated [private](https://codeql.github.com/docs/ql-language-reference/annotations/#private)), of a library module, into the namespace of the current module containing the `import` statement.

    By convention the first statement in a query module is the import of the language library you are targeting. For example, `import cpp`.

    Modules will not be further discussed in this quick-start.

3. Query metadata

    A query has properties that provide information to users of a query and provides information to consumer of the query result on how to display its results. These properties are known as query metadata.

    The query metadata resides at the top in a query file as a [QLDoc comment](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#qldoc-qldoc). A QLDoc comment starts with a `/**`, ends with a `*/`, and can span multiple lines. The body of QLDoc, the *contents*, is compromised of all the text surrounded by~/\*\*~ and `*/`. For each line the leading whitespace followed by a `*` is ignored and excluded from the content. The [contents](https://codeql.github.com/docs/ql-language-reference/ql-language-specification/#content) is interpreted as [CommonMark](https://commonmark.org/). The properties of a query are specified as tags. A tag is started with a `@` sign followed by any number of non-whitespace characters to form the *key* of the tag. A single whitespace character separates the key from the value, with the value being the remainder of the line.

    The supported properties of a query can be found [here.](https://codeql.github.com/docs/writing-codeql-queries/metadata-for-codeql-queries/#metadata-properties) The next snippet shows the metadata for a standard library query.

    ```ql
    /**
    * @name Uncontrolled data used in OS command
    * @description Using user-supplied data in an OS command, without
    *              neutralizing special elements, can make code vulnerable
    *              to command injection.
    * @kind path-problem
    * @problem.severity error
    * @security-severity 9.8
    * @precision high
    * @id cpp/command-line-injection
    * @tags security
    *       external/cwe/cwe-078
    *       external/cwe/cwe-088
    */
    ```

    Here are a few takeaways for query metadata when consuming the results in GitHub Code Scanning:

    - A `@name` property is **required** and defines a display name for the query. The [metadata style guide](https://github.com/github/codeql/blob/master/docs/query-metadata-style-guide.md#query-name-name) prescribes you should use sentence capitalization without a full stop.
    - A `@description` property is **required** and defines a short help message. The [meta data style guide](https://github.com/github/codeql/blob/main/docs/query-metadata-style-guide.md#query-descriptions-description) prescribes you should be written as a sentence or a short paragraph with sentence capitalization and a full stop.
    - A `@id` property is **required**. The id must uniquely identify a query and *should* follow the CodeQL convention by starting the id with a *language code* followed by a `/`. The remainder of the id should consists of a short noun phrase. For example, `cpp/command-line-injection`. Additional terms can be added to group queries. For example, `js/angular-js/missing-explicit-injection` and `js/angular-js/dpulicate-dependency`. **Note: Code Scanning uses the id to track alerts, changing the id will result in alerts tracked with the old id being closed and new alerts with the new id being introduced.**
    - A `@kind` property is **required**. There are multiple query types, but the most common alert kinds are: `problem` and `path-problem`. The kind property determines how to display the result of a query and expects a specific `select` form described in [Defining the results of a query](https://codeql.github.com/docs/writing-codeql-queries/defining-the-results-of-a-query/) and [Creating path queries](https://codeql.github.com/docs/writing-codeql-queries/creating-path-queries/#creating-path-queries).
    - A `@precision` property is *optional* for alert queries and indicates the proportion of true positives expected for the query. Possible values are:
        - `low`, expect a lot of false positives
        - `medium`, expect a moderate number of false positives
        - `high`, expect a low number of false positives
        - `very-high`, expect false positives in exceptional cases
    - A `@problem.severity` property is *optional* for alert queries and indicates the severity for alerts. Possible values are:
        - `error`, an issue that likely results in incorrect program behavior such as a crash or vulnerability
        - `warning`, an issue indicating a potential problem and could become a problem due to changes in the code.
        - `recommendation`, an issue that indicates code behaves correctly, but could be improved.
    - A `@tags` property is *optional*. Tags can be used to group queries into categories for identification purposes. The common tags are: `correctness`, `maintainabilility`, `readability`, `security`. Other known uses cases are to tag a query with a known weakness classification such as a [CWE](https://cwe.mitre.org/) or [OWASP Top 10](https://owasp.org/Top10/). Our standard queries, for example, use a CWE tag like `external/cwe/cwe-119`.
        - An additional `@security-severity` property is available for queries with `security` tag. This defines a severity with the range `0.0` - `10.0`. The blog [CodeQL code scanning: new severity levels for security alerts](https://github.blog/changelog/2021-07-19-codeql-code-scanning-new-severity-levels-for-security-alerts/) describes how to compute a severity.

    The query properties can be used to filter which queries are part of a [CodeQL query suite](https://codeql.github.com/docs/codeql-cli/creating-codeql-query-suites/#filtering-the-queries-in-a-query-suite). This won't be discussed in this quick-start.
