import java

from ControlFlowNode pred, ControlFlowNode succ
where pred.getASuccessor() = succ
select pred, succ