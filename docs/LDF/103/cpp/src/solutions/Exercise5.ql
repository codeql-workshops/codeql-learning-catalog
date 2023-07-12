/**
 * @name Format string injection
 * @id cpp/format-string-injection
 * @kind path-problem
 */

import cpp
import semmle.code.cpp.dataflow.new.TaintTracking
import semmle.code.cpp.security.Security

module CustomTaintTracking = TaintTracking::Make<TaintConfig>;

import CustomTaintTracking::PathGraph

module TaintConfig implements DataFlow::ConfigSig {
  predicate isSource(DataFlow::Node source) {
    exists(SecurityOptions opts | opts.isUserInput(source.asExpr(), _))
  }

  predicate isSink(DataFlow::Node sink) {
    exists(FormattingFunctionCall printfCall | sink.asExpr() = printfCall.getFormat())
  }
}

from CustomTaintTracking::PathNode source, CustomTaintTracking::PathNode sink
where CustomTaintTracking::hasFlowPath(source, sink)
select sink, source, sink, "This format string may be derived from a $@.", source,
  "user-controlled value"
