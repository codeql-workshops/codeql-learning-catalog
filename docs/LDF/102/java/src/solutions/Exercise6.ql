/**
 * @kind problem
 */

import java
import semmle.code.java.controlflow.Dominance

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

from SomeActionAccess someActionAccess
where not exists(InitializeAccess initializeAccess | dominates(initializeAccess, someActionAccess))
select someActionAccess, "Method $@ called without being preceded by initialize.", someActionAccess,
  someActionAccess.getMethod().getName()
