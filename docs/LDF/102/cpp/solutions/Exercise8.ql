/**
 * @kind problem
 */

import cpp
import semmle.code.cpp.controlflow.Dominance

class SomeAction extends Function {
  SomeAction() { this.hasName("some_action") }
}

class Init extends Function {
  Init() { this.hasName("init") }
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

from SomeAction someAction, FunctionCall someActionCall
where
  someActionCall = someAction.getACallToThisFunction() and
  not alwaysPrecededByInitCall(someActionCall)
select someActionCall, "Function '$@' called without being preceded by call to 'init'.", someAction,
  someAction.getName()
