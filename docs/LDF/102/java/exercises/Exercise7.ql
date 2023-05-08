/**
 * @kind problem
 */

import java
import semmle.code.java.controlflow.Dominance
import semmle.code.java.controlflow.Paths

class InitActionConfiguration extends ActionConfiguration {
  InitActionConfiguration() { this = "InitActionConfiguration" }

  override predicate isAction(ControlFlowNode node) { none() }
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

from SomeActionAccess someActionAccess
// Add the solution from exercise 6 and
// add a condition that excludes calls that dominate someAction method accesses and that always call the initialize method.
select someActionAccess, "Method $@ called without being preceded by initialize.", someActionAccess,
  someActionAccess.getMethod().getName()
