/**
 * @kind path-problem
 */

import cpp
import semmle.code.cpp.dataflow.DataFlow
import semmle.code.cpp.controlflow.Guards
import DataFlow::PathGraph

class SomeAction extends Function {
  SomeAction() { this.hasName("some_action") }
}

class Init extends Function {
  Init() { this.hasName("init") }
}

predicate isInitializedGuardCheck(GuardCondition g, Expr e, boolean branch) {
  exists(FunctionCall initCall | initCall.getTarget().hasName("is_initialized") |
    g = initCall and
    e = initCall.getArgument(0) and
    branch = true
  )
}

predicate initCallDominatesExit(FunctionCall initCall, Function function) {
  initCall.getTarget() instanceof Init and
  dominates(initCall, function)
}

predicate callAlwaysCallsInit(FunctionCall call) { initCallDominatesExit(_, call.getTarget()) }

predicate alwaysPrecededByInitCall(ControlFlowNode node) {
  exists(FunctionCall call | dominates(call, node) |
    call.getTarget() instanceof Init
    or
    callAlwaysCallsInit(call)
  )
  or
  forex(FunctionCall caller | caller.getTarget() = node.getControlFlowScope() |
    alwaysPrecededByInitCall(caller)
  )
}

class MissingInitConfiguration extends DataFlow::Configuration {
  MissingInitConfiguration() { this = "MissingInitConfiguration" }

  override predicate isSource(DataFlow::Node source) {
    source.asUninitialized().getType().(Struct).hasName("ctx")
  }

  override predicate isSink(DataFlow::Node sink) {
    exists(FunctionCall call |
      sink.asExpr() = call.getArgument(0) and
      call.getTarget() instanceof SomeAction
    )
  }

  override predicate isBarrier(DataFlow::Node node) {
    DataFlow::BarrierGuard<isInitializedGuardCheck/3>::getABarrierNode() = node
    or
    alwaysPrecededByInitCall(node.asExpr())
  }
}

from MissingInitConfiguration cfg, DataFlow::PathNode source, DataFlow::PathNode sink
where cfg.hasFlowPath(source, sink)
select sink.getNode(), source, sink, "Function 'some_action' called without being initialized."
