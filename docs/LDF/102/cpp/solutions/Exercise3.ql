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
  source.getASuccessor*() = destination
}

from ControlFlowNode source, ControlFlowNode destination
where
  reachable(source, destination) and
  source != destination and
  not exists(source.getAPredecessor()) and
  not exists(destination.getASuccessor())
select source, source, destination, "Control flow starting at $@", source, source.toString()
