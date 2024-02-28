/**
 * @kind problem
 */

import java
import semmle.code.java.controlflow.Dominance
import semmle.code.java.controlflow.Paths

class InitActionConfiguration extends ActionConfiguration {
  InitActionConfiguration() { this = "InitActionConfiguration" }

  override predicate isAction(ControlFlowNode node) {
    // Replace with solution to exercise 7.
    none()
  }
}

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

predicate alwaysPrecededByInitializationCall(ControlFlowNode node) {
  // Ensure that `node` is always preceded by a initialization call.
  // This should hold for the `node` or all the callers of the enclosing callable of this `node`.
  none()
}

from SomeActionAccess someActionAccess
where not alwaysPrecededByInitializationCall(someActionAccess)
select someActionAccess, "Method $@ called without being preceded by initialize.", someActionAccess,
  someActionAccess.getMethod().getName()
