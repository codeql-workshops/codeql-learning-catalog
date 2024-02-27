/**
 * @id java/control-flow-graph
 * @kind path-problem
 */

import java

query predicate edges(ControlFlowNode pred, ControlFlowNode succ) {
  pred.getASuccessor() = succ and
  pred.getLocation().getStartLine() = [131 .. 144] and
  pred.getFile().getBaseName() = "Owner.java" and
  succ.getLocation().getStartLine() = [131 .. 144]
}

query predicate nodes(ControlFlowNode n, string key, string val) {
  key = "semmle.label" and
  val = n.toString() + " : " + n.getAPrimaryQlClass() and
  n.getLocation().getStartLine() = [131 .. 144] and
  n.getFile().getBaseName() = "Owner.java"
}

predicate reachable(ControlFlowNode source, ControlFlowNode destination) {
  source.getASuccessor*() = destination
}

from ControlFlowNode source, ControlFlowNode destination
where
  reachable(source, destination) and
  source.getLocation().getStartLine() = 132 and
  source.getFile().getBaseName() = "Owner.java" and
  source != destination and
  not exists(source.getAPredecessor()) and
  not exists(destination.getASuccessor())
select source, source, destination, "Control flow starting at $@", source, source.toString()
