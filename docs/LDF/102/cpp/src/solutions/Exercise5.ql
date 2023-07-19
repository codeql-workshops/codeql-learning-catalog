/**
 * @kind problem
 */

import cpp

class SomeAction extends Function {
  SomeAction() { this.hasName("some_action") }
}

class Init extends Function {
  Init() { this.hasName("init") }
}

predicate reachable(ControlFlowNode source, ControlFlowNode destination) {
  source.getASuccessor*() = destination
}

from SomeAction someAction, FunctionCall someActionCall
where
  someActionCall = someAction.getACallToThisFunction() and
  not exists(Call initCall | initCall = any(Init init).getACallToThisFunction() |
    reachable(initCall, someActionCall)
  )
select someActionCall, "Function '$@' called without being preceded by call to 'init'.", someAction,
  someAction.getName()
