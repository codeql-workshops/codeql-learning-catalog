/**
 * @kind problem
 */

import java

class SomeApiClass extends Class {
  SomeApiClass() { hasName("SomeApi") }
}

class InitializeAccess extends MethodAccess {
  Method initialize;

  InitializeAccess() {
    this.getMethod() = initialize and
    initialize.hasName("initialize") and
    initialize.getDeclaringType() instanceof SomeApiClass
  }
}

class SomeActionAccess extends MethodAccess {
  Method someAction;

  SomeActionAccess() {
    this.getMethod() = someAction and
    someAction.hasName("someAction") and
    someAction.getDeclaringType() instanceof SomeApiClass
  }
}

predicate reachable(ControlFlowNode source, ControlFlowNode destination) {
  source.getASuccessor*() = destination
}

from SomeActionAccess someActionAccess
where
  not exists(InitializeAccess initializeAccess |
    reachable(initializeAccess.getControlFlowNode(), someActionAccess)
  )
select someActionAccess, "Method $@ called without being preceded by initialize.", someActionAccess,
  someActionAccess.getMethod().getName()
