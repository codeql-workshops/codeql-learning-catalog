/**
 * @kind path-problem
 */

import cpp
import semmle.code.cpp.dataflow.DataFlow
import DataFlow::PathGraph

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
  // Copy your implementation of this predicate from exercise 8.
  none()
}

class MissingInitConfiguration extends DataFlow::Configuration {
  MissingInitConfiguration() { this = "MissingInitConfiguration" }

  override predicate isSource(DataFlow::Node source) {
    // Implement this predicate to hold if `source` is an uninitialized `ctx` struct.
    none()
  }

  override predicate isSink(DataFlow::Node sink) {
    // Implement this predicate to hold if `sink` is the first argument to a call to `some_action`.
    none()
  }

  override predicate isBarrier(DataFlow::Node node) {
    // Implement this predicate to hold if `node` is always preceded by a call to `init` or a function that calls `init` on all execution paths.
    none()
  }
}

from MissingInitConfiguration cfg, DataFlow::PathNode source, DataFlow::PathNode sink
where cfg.hasFlowPath(source, sink)
select sink.getNode(), source, sink, "Function 'some_action' called without being initialized."
