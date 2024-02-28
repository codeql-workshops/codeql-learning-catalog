/**
 * @kind path-problem
 */

import java

query predicate edges(Stmt pred, Stmt succ) { succ = getANextStmt(pred) }

query predicate nodes(ControlFlowNode n, string key, string val) {
  key = "semmle.label" and val = n.toString() + " : " + n.getAPrimaryQlClass()
}

Stmt getANextStmt(ControlFlowNode node) { any() }

from IfStmt pred, IfStmt succ
where succ = getANextStmt+(pred)
select pred, pred, succ, "Control flow starting at stmt $@", pred, pred.toString()
