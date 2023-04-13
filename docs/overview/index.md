---
layout: page
title: Learning Catalog Overview
description: Learn about the Learning Catalog
banner: banner-code-graph-shield.png
octicon: mortar-board
toc: true
---

## Welcome to the CodeQL Learning Catalog

The CodeQL Learning Catalog is a learning resource that has been designed to
deliver interactive CodeQL workshops. In addition to the content in this
website, each of the courses within the catalog exists as a directory within the
repository that serves this site.

To access the source of this site, please visit:
[workshops/codeql-learning-catalog](https://github.com/codeql-workshops/codeql-learning-catalog),
which contains the source of this website as well as the source of each workshop
contained inside.

## How to Use The Catalog

The CodeQL Learning Catalog can be used in two different ways: as a workshop
author and as a workshop participant. In either use case, you may launch a
codespace from this repository with the following configurations:

- `.devcontainer/authors/devcontainer.json` - The container targeted for
  authors. This contains additional tools for creating workshops. 
- `.devcontainer/devcontainer.json` - The container for workshop participants.
  This contains the components needed to execute the workshop examples. 

**To launch a codespace, click the "Open In Codespaces" button at the top of this page.**

## How Content is Structured

The content of the catalog is organized by both subject area and difficulty. Our
system for categorizing CodeQL workshops can be broken down into 4 main content
areas:

* **CodeQL Core (QLC)** - Fundamental, language-agnostic features
* **Language Dependent Features (LDF)** - Various features for which dedicated
  language-specific workshops must be constructed.
* **CodeQL Tooling, Infrastructure, and Practice (TIP)** - Topics related to the
  usage of CodeQL tooling from the perspective of a query author, for example,
  dedicated instruction on query performance optimization.
* **CodeQL Exploration and Projects (EXP)** - Interactive workshops and projects
  in CodeQL typically focused on a single language which may address issues like
  finding a relevant CVE or capture the flag exercise.

![img](/assets/images/overview/codeql-workshop-course-catalog.png "The CodeQL
Workshop Course Catalog")
