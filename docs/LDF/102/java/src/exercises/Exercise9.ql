/**
 * @kind path-problem
 */

import java
import semmle.code.java.dataflow.DataFlow
import DataFlow::PathGraph

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

class MissingInitConfig extends DataFlow::Configuration {
  MissingInitConfig() { this = "MissingInitConfig" }

  override predicate isSource(DataFlow::Node node) {
    // Implement this predicate that determine where we start tracking data flow.
    none()
  }

  override predicate isSink(DataFlow::Node node) {
    // Implement this predicate that determine when we are done tracking data flow and have established that this node is reachable from a source.
    none()
  }

  override predicate isBarrier(DataFlow::Node node) {
    // Implement this predicate that determine when we should stop tracking data flow through a node.
    none()
  }
}

from MissingInitConfig config, DataFlow::PathNode source, DataFlow::PathNode sink
where config.hasFlowPath(source, sink)
select sink, source, sink, "Method $@ can reach $@ without being preceded by initialize",
  source.getNode(), "source", sink.getNode(), "destination"
