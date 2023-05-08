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
    node.asExpr().(ConstructorCall).getConstructedType() instanceof SomeApiClass
  }

  override predicate isSink(DataFlow::Node node) {
    node.asExpr() = any(SomeActionAccess a).getQualifier()
  }

  override predicate isBarrier(DataFlow::Node node) {
    node.asExpr() = any(InitializeAccess a).getQualifier()
  }
}

from MissingInitConfig config, DataFlow::PathNode source, DataFlow::PathNode sink
where config.hasFlowPath(source, sink)
select sink, source, sink, "Method $@ can reach $@ without being preceded by initialize",
  source.getNode(), "source", sink.getNode(), "destination"
