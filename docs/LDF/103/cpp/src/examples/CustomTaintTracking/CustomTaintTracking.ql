import cpp
import semmle.code.cpp.dataflow.new.TaintTracking
import semmle.code.cpp.security.Security

module CustomTaintTracking = TaintTracking::Make<TaintConfig>;

module TaintConfig implements DataFlow::ConfigSig {
  predicate isSource(DataFlow::Node source) {
    any() /* Replace this with your definition */
  }

  predicate isSink(DataFlow::Node sink) {
    any() /* Replace this with your definition */
  }
}

from DataFlow::Node source, DataFlow::Node sink
where CustomTaintTracking::hasFlow(source, sink)
select sink.asExpr(), "This format string may be derived from a $@.", source.asExpr(),
  "user-controlled value"
