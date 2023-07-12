/**
 * @name Format string injection
 * @id cpp/format-string-injection
 * @kind problem
 */

import cpp
import semmle.code.cpp.dataflow.new.TaintTracking
import semmle.code.cpp.security.Security

module CustomTaintTracking = TaintTracking::Make<TaintConfig>;

module TaintConfig implements DataFlow::ConfigSig {
  predicate isSource(DataFlow::Node source) {
    exists(SecurityOptions opts | opts.isUserInput(source.asExpr(), _))
  }

  predicate isSink(DataFlow::Node sink) {
    /* TBD */
    any()
  }
}

from DataFlow::Node source, DataFlow::Node sink
where CustomTaintTracking::hasFlow(source, sink)
select sink.asExpr(), "This format string may be derived from a $@.", source.asExpr(),
  "user-controlled value"
