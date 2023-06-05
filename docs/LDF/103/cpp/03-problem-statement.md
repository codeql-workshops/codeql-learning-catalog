---
layout: page
title: Problem Statement
octicon: package
toc: false
---

The source code from which our database was compiled contains a formatting function `snprintf` with a format string supplied from outside the program:

1. A user invokes the `createdump` command and passes an `-f` flag to create a dump file and supplies a format string `"%p"` for the `--name` parameter (A printf call with "%p" as its format string reveals the current stack position of the host machine). This abuses the `--name` parameter as it is originally intended to be a file path to write the dump file to.
2. `dumpFilePath` is handed this format string from `argv`.
3. `dumpFilePath` is passed to `CreateDumpCommon` of `createdump.cpp`.
4. `CreateDumpCommon` uses `dumpFilePath` as the format string to `snprintf`.

This does not constitute an actual vulnerability, however, since `snprintf` stores the formatted string to another buffer rather than directly printing to the standard output, for example. Nevertheless, if the subsequent `printf` call at line 39 used the char buffer `dumpPath` as its format string, then this would have been an actual vulnerability.

Such non-constant format strings can be detected using local data flow only; if the variable is placed at the format string position of `snprintf`, we can suspect the format string the variable points to is supplied from outside the program by an attacker. However, that is not the case if every caller of `CreateDumpCommon` passes a hard-coded string literal to it. Therefore, we cannot be sure of whether if the format string variable is actually controllable from the outside, without looking between procedures, that is, looking into the global data flow.
