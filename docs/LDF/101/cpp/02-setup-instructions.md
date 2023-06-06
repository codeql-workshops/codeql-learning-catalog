---
layout: page
title: Setup Instructions
octicon: package
toc: false
---

Before we move on to write our queries, let us set up our development environment of choice: there are two such ones we recommend: GitHub Codespaces and making a local copy, though we strongly prefer the former.

### GitHub Codespaces

This is the easiest and fastest way to get started!

1. From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
2. `cd` to `docs/LDF/101/cpp`.
3. Run `git lfs pull` to get the precompiled database to work on.
4. Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `ldf-101-cpp/solutions`, `ldf-101-cpp/tests`, and `ldf-101-cpp/exercises`.
5. Choose `vld.zip` provided by Git LFS.

### Working locally

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the [CodeQL extension for Visual Studio Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/setting-up-codeql-in-visual-studio-code/).
3. Clone this repository and `cd` to `docs/LDF/101/cpp`.
4. Run `git lfs pull` to get the precompiled database to work on.
5. Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `ldf-101-cpp/solutions`, `ldf-101-cpp/tests`, and `ldf-101-cpp/exercises`.
6. From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
7. Choose `vld.zip` provided by Git LFS.

## Documentation Links

If you get stuck, try searching our documentation and blog posts for help and ideas. Below are a few links to help you get started:

- [Learning CodeQL](https://codeql.github.com/docs/writing-codeql-queries/)
- [CodeQL Language Guides for C/C++](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
- [CodeQL Standard Library for C/C++](https://codeql.github.com/codeql-standard-libraries/cpp)
- [CodeQL](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
- [Using the CodeQL extension for VSCode](https://codeql.github.com/docs/codeql-for-visual-studio-code/)
