---
layout: page
title: Introduction
octicon: package
banner: banner-code-graph-shield.png
toc: false
---

In this workshop, we use CodeQL to analyze the source code of a [vulnerable Linux driver](https://github.com/invictus-0x90/vulnerable_linux_driver) to pinpoint a portion of source code that causes a buffer overflow.

The Linux kernel allows users to register their simple drivers as a [miscellaneous character driver](https://www.linuxjournal.com/article/2920) (henceforth misc driver), and this project aims to provide a misc driver ready to be inserted into the kernel. Linux misc drivers need to be added and removed to the kernel via two API functions provided by the kernel, [`misc_register`](https://github.com/torvalds/linux/blob/8ca09d5fa3549d142c2080a72a4c70ce389163cd/include/linux/miscdevice.h#L91) and [`misc_unregister`](https://github.com/torvalds/linux/blob/8ca09d5fa3549d142c2080a72a4c70ce389163cd/include/linux/miscdevice.h#L92), respectively.

Looking close to the source code of this project, we can see it [register a vulnerable device](https://github.com/invictus-0x90/vulnerable_linux_driver/blob/2bbfdadd403b6def98f98f6ee3f465286f35e0c9/src/vuln_driver.c#L156) represented as a `static struct` that contains another struct that implements `file_operations` which bridges between user-space application code (performing I/O with the device) and the kernel. The vulnerable point is the `do_ioctl` function being registered as that user-space code, hence the aim of our investigation.

Starting from the `misc_register` function we will traverse function calls, expressions, structure definitions, and variable initializations to find this entrypoint `do_ioctl`. In the course of this investigation, you will learn how to express our interest in a query language CodeQL and learn that we are able to go quite far only by syntactic analysis that combines various constraints together using formulas, predicates, and classes.

The workshop is split into several steps. You can write one query per step, or work with a single query that you refine at each step. Each step has a **hint** that suggests useful classes and predicates in the CodeQL standard libraries for C/C++. You can explore these in VSCode using the autocomplete suggestions `Ctrl+Space` and the `Go to Definition` command bound to `F12`.
