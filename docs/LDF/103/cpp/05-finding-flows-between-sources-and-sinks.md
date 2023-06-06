---
layout: page
title: Finding Flows Between Sources and Sinks
octicon: package
toc: false
---

## Turning the Taint Query into a Path Problem Query

If we look at the previous results, however, it can be hard to verify whether the results are genuine or not, because we only see the source of the problem and the sink, but not the path in between. This can be achieved by converting the query to a _path problem_ query. After we're done, the CodeQL VSCode extension will now show the intermediate path nodes when we click to unfold a drawer.

### Exercise 5

Let us take the regular `@problem` query we wrote for Exercise 4. How can we lift this into a query for path problem? Convert it to a path problem query.

<details>
<summary>Hint</summary>

- Convert the `@kind` from `problem` to `path-problem`. This tells the CodeQL toolchain to interpret the results of this query as path results.
- Add a new import `CustomTaintTracking::PathGraph`, which will report the path data alongside the query results.
- Change the type of `source` and `sink` variables from `DataFlow::Node` to `CustomTaintTracking::PathNode`, to ensure that the nodes retain path information and they are relevant to our domain of format string injection.
- Use `hasFlowPath` instead of `hasFlow`.
- Change the `select` statement to report the `source` and `sink` as the second and third columns. The toolchain combines this data with the path information from `PathGraph` to build the paths.

</details>

Now we should see a path from `argv` to the `snprintf` call, chained together by threading intermediate path nodes!