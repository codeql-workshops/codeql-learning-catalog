---
layout: page
title: Intermediate Control Flow
octicon: package
toc: false
---

#### Exercise 4

From the results of the previous exercises, we can see that the control flow paths include both statements and expressions.
In some cases, you would be interested in determining the successor statement of another statement.
For example, given an _if_ statement, what is the next reachable _if_ statement.
Our `reachable` predicate will return all reachable _if_ statement so additional logic is required to answer the question.

Implement the predicate `getANextStmt` in [Exercise4.ql](exercises/Exercise4.ql).
While implementing the predicate consider the following Java snippet and which `if` statements should be returned by [Exercise4.ql](exercises/Exercise4.ql) for the first `if` statement.

```java
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

If you run your query on the _Pet Clinic_ database, you will see results without a path.
Can you explain why this happens?


<details>
<summary>Hints</summary>

When you use the `reachable` predicate you need to exclude results to include only the strict successor statements.
However, you cannot exclude the correct nodes due to conditional nodes. See the above example snippet and CFG.

To implement a correct solution, you need to resort to a _recursive_ predicate.

</details>

A solution can be found in the query [Exercise4.ql](solutions/Exercise4.ql)

#### Exercise 5

Now that we understand the _successor_ relation, the control flow graph, and _reachability_, we can look at how reachability can be used.

In multiple scenarios, including security relevant scenarios, a certain action must be performed before another action.
For example, before you can use a method you must first initialize the class providing the method.

Look at the [test case](exercises-tests/Exercise5/Test.java) for [Exercise5.ql](exercises/Exercise5.ql) using the following Java snippet and implement [Exercise5.ql](exercises/Exercise5.ql) to ensure the `incorrectUse` is detected.

```java
class SomeApi {
    void initialize() {

    }

    void someAction() {

    }
}

class Test {
    void correctUse() {
        SomeApi api = new SomeApi();

        api.initialize();
        api.someAction();
    }

    void incorrectUse() {
        SomeApi api = new SomeApi();

        api.someAction();
    }
}
```

<details>
<summary>Hints</summary>

For all correct uses, the `someAction` method access is reachable from the `initialize` method access.

</details>

A solution can be found in the query [Exercise5.ql](solutions/Exercise5.ql)

#### Exercise 6

First time use of the _successor_ relationship and _reachability_ can result in surprising result.
The _successor_ relationship relates program elements that can reside in different scopes within a method.

For example, any program element following an `if` statement will be related to one or more statements in the `if` body.
Consider the following case:

```java
  void incorrectUse2() {
        SomeApi api = new SomeApi();

        if (false) {
            api.initialize();
        }
        api.someAction();

    }
```

The `someAction` method access is reachable from an `initialize` method access.
This means that the solution to exercise 5 will not find this incorrect use, which is the case for our solution to exercise 5.

To ensure that all accesses of the method `someAction` are preceded by an `initialize` access we can make use of the [dominator](https://en.wikipedia.org/wiki/Dominator_(graph_theory)) concept from graph theory.
A node **dominates** another node if every path from the _entry node_ to a node _m_ must go through node _n_.
If we swap _m_ with method access for `someAction`  and _n_ with method access of `initialize` then this describes the property we want.

The standard library provides the predicate `dominates` that is defined in the the module [Dominance](https://codeql.github.com/codeql-standard-libraries/java/semmle/code/java/controlflow/Dominance.qll/module.Dominance.html).

Use the predicate `dominates` and update the solution to [Exercise5.ql](exercises/Exercise5.ql) in  [Exercise6.ql](exercises/Exercise6.ql) to account for the new case.

<details>
<summary>Hints</summary>

</details>

A solution can be found in the query [Exercise6.ql](solutions/Exercise6.ql)
