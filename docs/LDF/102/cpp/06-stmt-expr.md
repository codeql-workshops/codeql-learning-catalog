---
layout: page
title: Statement Successors 
octicon: package
toc: false
---

From the results of the previous exercises, we can see that the control flow paths include both statements and expressions.
In some cases, you would be interested in determining the successor statement of another statement.
For example, given an _if_ statement, what is the next reachable _if_ statement.
Our `reachable` predicate will return all reachable _if_ statement so additional logic is required to answer the question.

Implement the predicate `getANextStmt` in `src/exercises/Exercise4.ql`.
While implementing the predicate consider the following C/C++ snippet and which `if` statements should be returned by `src/exercises/Exercise4.ql` for the first `if` statement.

```cpp
if (...) {
  if (...) {
    ...
  }
}

if (...) {
  ...
}
```

with the following CFG.

```text
                   │
                   │
                   │
                   │
                   ▼
               .───────.
              ( IfStmt  )
               `───────'
                   │
     ┌─────────────┘
     ▼
 .───────.               .───────.
(   ...   )───(true)───▶(BlockStmt)
 `───────'               `───────'
     │                       │
     │                       │
     │                       ▼
     │                   .───────.
     │                  ( IfStmt  )
     │                   `───────'
     │                       │
  (false)         ┌──────────┘
     │            ▼
     │       .───────.              .───────.
     │      (   ...   )─(true)────▶(BlockStmt)
     │       `───────'              `───────'
     │           │                      │
     │           │                      │
     │        (false)                   │
     │           │                      │
     │           ▼                      ▼
     │       .───────.              .───────.
     └─────▶( IfStmt  )◀───────────(   ...   )
             `───────'              `───────'
                 │
        ┌────────┘
        ▼
    .───────.          .───────.
   (   ...   )───────▶(   ...   )─ ─ ─ ─ ─▶
    `───────'          `───────'
```

<details>
<summary>Hints</summary>

When you use the `reachable` predicate you need to exclude results to include only the strict successor statements.
However, you cannot exclude the correct nodes due to conditional nodes. See the above example snippet and CFG.

To implement a correct solution, you need to resort to a _recursive_ predicate.

</details>

A solution can be found in the query `src/solutions/Exercise4.ql`.
