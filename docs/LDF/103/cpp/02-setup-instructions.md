---
layout: page
title: Setup Instructions
octicon: package
toc: false
---

Before we start iterating on our queries, let us setup our development environment of choice. There are two such ones we recommend: GitHub Codespaces and making a local copy, though we strongly prefer the former.

### GitHub Codespaces

This is the easiest and fastest way to get started!

1. From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
2. `cd` to `docs/LDF/103/cpp`.
3. Run `git lfs pull` to get the precompiled database to work on.
4. Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `ldf-103-cpp/solutions`, `ldf-103-cpp/test`, and `ldf-103-cpp/exercises`.
5. From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
6. Choose `dotnet_coreclr_fbe0c77.zip` provided by Git LFS.

### Working Locally

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the [CodeQL extension for Visual Studio Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/setting-up-codeql-in-visual-studio-code/).
3. Clone this repository, open it in VSCode, and `cd` to `docs/LDF/103/cpp`.
4. Run `git lfs pull` to get the precompiled database to work on.
5. Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `ldf-103-cpp/solutions`, `ldf-103-cpp/test`, and `ldf-103-cpp/exercises`.
6. From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
7. Choose `dotnet_coreclr_fbe0c77.zip` provided by Git LFS.

## Documentation Links

If you get stuck, try searching our documentation and blog posts for help and ideas. Below are a few links to help you get started:

- [Learning CodeQL](https://codeql.github.com/docs/writing-codeql-queries/)
- [CodeQL Language Guides for C/C++](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
  - [Basic query for C and C++ code](https://codeql.github.com/docs/codeql-language-guides/basic-query-for-cpp-code/)
  - [CodeQL library for C and C++](https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-cpp/)
  - [Functions in C and C++](https://codeql.github.com/docs/codeql-language-guides/functions-in-cpp/)
  - [Analyzing data flow in C and C++](https://codeql.github.com/docs/codeql-language-guides/analyzing-data-flow-in-cpp-new/)
- [CodeQL Standard Library for C/C++](https://codeql.github.com/codeql-standard-libraries/cpp)
- [Using the CodeQL extension for VSCode](https://codeql.github.com/docs/codeql-for-visual-studio-code/)
