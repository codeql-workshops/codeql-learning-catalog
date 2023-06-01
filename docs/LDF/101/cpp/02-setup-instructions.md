---
layout: page
title: Setup Instructions
octicon: package
toc: false
---

Before we move on to write our queries, let us set up our development environment of choice: there are two such ones we recommend: GitHub Codespaces and making a local copy, though we strongly prefer the former.

### GitHub Codespaces

You can start off by

- From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
- Choose `vld.zip` provided by Git LFS.
- No further steps are necessary!

### Working locally

- Install [Visual Studio Code](https://code.visualstudio.com/).
- Install the [CodeQL extension for Visual Studio Code](https://codeql.github.com/docs/codeql-for-visual-studio-code/setting-up-codeql-in-visual-studio-code/).
- Clone this repository and additionally run `git lfs pull` to get the precompiled database to work on.
- Install the CodeQL pack dependencies using the command `CodeQL: Install Pack Dependencies` and select `ldf-101-cpp-src`.
- From the command palette (bound to `Ctrl+Shift+P` or `Cmd+Shift+P`), choose `CodeQL: Choose Database from Archive`.
- Choose `vld.zip` provided by Git LFS.

## Documentation Links

If you get stuck, try searching our documentation and blog posts for help and ideas. Below are a few links to help you get started:

- [Learning CodeQL](https://codeql.github.com/docs/writing-codeql-queries/)
- [CodeQL Language Guides for C/C++](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
- [CodeQL Standard Library for C/C++](https://codeql.github.com/codeql-standard-libraries/cpp)
- [CodeQL](https://codeql.github.com/docs/codeql-language-guides/codeql-for-cpp/)
- [Using the CodeQL extension for VSCode](https://codeql.github.com/docs/codeql-for-visual-studio-code/)
