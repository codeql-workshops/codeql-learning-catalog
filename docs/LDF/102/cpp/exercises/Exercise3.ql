/**
 * @id cpp/control-flow-graph
 * @kind path-problem
 */

import cpp

query predicate edges(ControlFlowNode pred, ControlFlowNode succ) { pred.getASuccessor() = succ }

query predicate nodes(ControlFlowNode n, string key, string val) {
  key = "semmle.label" and
  val = n.toString() + " : " + n.getAPrimaryQlClass()
}

predicate reachable(ControlFlowNode source, ControlFlowNode destination) {
  // Copy solution from Exercise 2 here
  none()
}

from ControlFlowNode source, ControlFlowNode destination
where
  reachable(source, destination) and
  source != destination
// Add additional conditions here
select source, source, destination, "Control flow starting at $@", source, source.toString()
