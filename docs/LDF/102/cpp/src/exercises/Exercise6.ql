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

from SomeAction someAction, FunctionCall someActionCall
where
  // Replace the line below with suitable conditions
  none()
select someActionCall, "Function '$@' called without being preceded by call to 'init'.", someAction,
  someAction.getName()
