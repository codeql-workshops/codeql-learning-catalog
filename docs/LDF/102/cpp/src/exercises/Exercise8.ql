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
  // Copy your implementation of this predicate from exercise 7.
  none()
}

predicate callAlwaysCallsInit(FunctionCall call) {
  // Copy your implementation of this predicate from exercise 7.
  none()
}

predicate alwaysPrecededByInitCall(ControlFlowNode node) {
  // Implement this predicate to hold if `node` is always preceded by a call to `init` or a function that calls `init` on all execution paths.
  none()
}

from SomeAction someAction, FunctionCall someActionCall
where
  someActionCall = someAction.getACallToThisFunction() and
  not alwaysPrecededByInitCall(someActionCall)
select someActionCall, "Function '$@' called without being preceded by call to 'init'.", someAction,
  someAction.getName()
