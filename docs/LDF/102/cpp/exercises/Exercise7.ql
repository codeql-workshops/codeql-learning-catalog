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
  // Implement this predicate to hold if `initCall` is a call to the `init` function and `function` calls `init` on all execution paths.
  none()
}

predicate callAlwaysCallsInit(FunctionCall call) {
  // Implement this predicate to hold if `call` calls a function that calls `init` on all execution paths.
  none()
}

from SomeAction someAction, FunctionCall someActionCall
where
  // Replace the line below with suitable conditions from exercise 6 and additional conditions for this exercise.
  none()
select someActionCall, "Function '$@' called without being preceded by call to 'init'.", someAction,
  someAction.getName()
