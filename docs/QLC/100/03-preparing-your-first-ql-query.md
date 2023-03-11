---
layout: page
title: Preparing your first QL query
octicon: package
toc: false
---

With the development environment set up we can start with writing your first
query. For this workshop, you will need to clone the repository `https://github.com/codeql-workshops/codeql-learning-catalog` and save your work in the
`docs/QLC/100/src/problems` directory.

```bash
git clone https://github.com/codeql-workshops/codeql-learning-catalog
```

After cloning the repository open the folder in Visual Studio Code.

Before we can write our actual query we need to create a [CodeQL pack](https://codeql.github.com/docs/codeql-cli/creating-and-working-with-codeql-packs/). A CodeQL pack is a unit of queries or libraries that can be shared. CodeQL pack also provides the necessary information to CodeQL to run a query part of that pack.

Let's start with switching to the workshop directory to store our the workshop assets.

In Visual Studio Code, open the [integrated terminal](https://code.visualstudio.com/docs/terminal/basics) and run the following commands to create a CodeQL pack.

```bash
cd docs/QLC/100/
codeql pack init qlc-100/problems -d src
```

This will create a subdirectory of `src` named `qlc-100/problems` which will contain the file `qlpack.yml` with the following contents:

```yaml
---
library: false
name: qlc-100/problems
version: 0.0.1
```

The `qlpack.yml` describes the metadata of a CodeQL pack through properties. A description of the properties can be found [here](https://codeql.github.com/docs/codeql-cli/about-codeql-packs/#qlpack-yml-properties). For now we start with this minimal CodeQL pack specification that states it is a query pack, as opposed to a library pack, via the key `library: false`. The difference will be become apparent when you publish a package. A query pack, when published, will include all its dependencies and a precompiled version of the queries to ensure a fast deployment and evaluation.

With the query pack set up we are going to create another query pack to hold our tests. CodeQL provides testing infrastructure to create system agnostic unit tests for your queries. System agnostic means that it will not depend on external dependencies and that the tests will provide the same results on different operating systems with different compilers/interpreters and libraries installed.

```bash
codeql pack init --extractor cpp qlc-100-tests/problems -d tests
```

This will generate a file (`qlpack.yml`), similar what we have seen before, with an additional property `extractor` set to the value `cpp`. Normally the target language is specified by the database, because a database can only target a single language. With the `extractor` property we inform the testing infrastructure to use the C/C++ extractor to create test databases to validate our queries.

To test a query in the `qlc-100/problems` CodeQL pack we need to inform the `qlc-100-tests/problems` CodeQL pack how to resolve that query. This can be achieved through the `dependencies` property.

Change the `qlpack.yml` to match the following contents.

```yaml
---
library: false
name: qlc-100-tests/problems
version: 0.0.1
extractor: cpp
dependencies:
  "qlc-100/problems": "*"
```

A dependency is resolved by the CodeQL pack name and a version. While our query CodeQL pack has version `0.0.1` we specify the `*` value to direct the CodeQL package manager to consider a local version of the query pack before reaching out to the package registry to download the latest version.

With our query and test CodeQL pack up and running we can run the command `codeql pack ls` to list the CodeQL packs that the CodeQL CLI can resolve.

```bash
▶ codeql pack ls
Running on packs: qlc-100-tests/solutions, qlc-100/solutions.
Found qlc-100/solutions@0.0.1
Found qlc-100-tests/solutions@0.0.1
```

The command doesn't list our just created problem packs. The
`codeql-workspace.yml` files helps the CodeQL CLI resolve CodeQL packs when
multiple are defined in a project.

Open the file `codeql-workspace.yml` in `docs/QLC/100` and ensure it has the
following content by adding the item `"*/problems/qlpack.yml"`:

```yaml
provide:
  - "*/solutions/qlpack.yml"
  - "*/problems/qlpack.yml"
```

With the CodeQL workspace re-running the `codeql pack ls` command succeeds.

```bash
▶ codeql pack ls
Running on packs: qlc-100-tests/problems, qlc-100/problems, qlc-100-tests/solutions, qlc-100/solutions.
Found qlc-100/problems@0.0.1
Found qlc-100-tests/problems@0.0.1
Found qlc-100/solutions@0.0.1
Found qlc-100-tests/solutions@0.0.1
```

The `provide` key holds an array of path patterns for CodeQL pack files (i.e., `qlpack.yml` files) that this directory provides. A CodeQL workspace can be considered a container for multiple CodeQL packs. Path patterns allow lightweight globbing where each path component can be a `*`: matching any path component, or `**`: matching multiple arbitrary path components. The latter is useful if your projects contains multiple CodeQL packs organized per category, for example per language. Then the CodeQL workspace file can contain a path pattern per category. For example:

```yaml
provide:
  - "cpp/**/qlpack.yml"
  - "java/**/qlpack.yml"
```

can be used for the directory tree:

```yaml
- cpp /
  - github
    - security-queries
  qlpack.yml
    - security-tests
  qlpack.yml
    - security-libs
  qlpack.yml
- java /
  - github
    - security-queries
  qlpack.yml
    - security-tests
  qlpack.yml
    - security-libs
  qlpack.yml
```
