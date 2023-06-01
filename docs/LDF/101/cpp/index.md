---
layout: workshop-index
title: Elements of Syntactical Program Analysis I for C/C++
course_number: LDF-101-CPP
abstract: We learn how to query the AST of a C program and refactor it along the way by investigating a buffer overflow vulnerability in a sample Linux driver.
language: C/C++
octicon: package
toc: false
topics: syntactical, C, AST, buffer-overflow, linux
---

## Introduction

We learn how to query the AST of a C program and refactor it along the way by investigating a buffer overflow vulnerability in a sample Linux driver. We first start by identifying the point where the program inserts a driver definition to the kernel by using one of its APIs, and climb up the dependency chain by finding definitions and initializations of the types and objects used in the program. Finally, we reach the vulnerable function in question.
