---
layout: page
title: Setup Instructions
octicon: package
toc: false
---

Before we move on to write our queries, let us set up our development environment of choice: there are two such ones we recommend: GitHub Codespaces and making a local copy, though we strongly prefer the former.

### GitHub Codespaces

This is the easiest and fastest way to get started!

1. `cd` to `docs/LDF/101/java`.
2. Run `git lfs pull` to get the precompiled database to work on.
3. Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select the followings:
    - `ldf-101-java/test`,
    - `ldf-101-java/exercises`, and
    - `ldf-101-java/solutions`.
    - The easiest way of doing it without manually clicking the checkboxes is to type the prefix `ldf-101-java` and then click on the checkbox that selects all of the candidates at once.

### Working locally

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the [CodeQL extension for Visual Studio Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/setting-up-codeql-in-visual-studio-code/).
3. Clone this repository, open it in VSCode, and `cd` to `docs/LDF/101/java`.
4. Run `git lfs pull` to get the precompiled database to work on.
5. Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select the followings:
    - `ldf-101-java/test`,
    - `ldf-101-java/exercises`, and
    - `ldf-101-java/solutions`.
    - The easiest way of doing it without manually clicking the checkboxes is to type the prefix `ldf-101-java` and then click on the checkbox that selects all of the candidates at once.

## Documentation Links

If you get stuck, try searching our documentation and blog posts for help and ideas. Below are a few links to help you get started:

- [Learning CodeQL](https://codeql.github.com/docs/writing-codeql-queries/)
- [CodeQL Language Guides for Java](https://codeql.github.com/docs/codeql-language-guides/codeql-for-java/)
- [CodeQL Standard Library for Java](https://codeql.github.com/codeql-standard-libraries/java)
- [CodeQL](https://codeql.github.com/docs/codeql-language-guides/codeql-for-java/)
- [Using the CodeQL extension for VSCode](https://codeql.github.com/docs/codeql-for-visual-studio-code/)
