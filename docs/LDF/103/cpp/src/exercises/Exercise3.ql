/**
 * @name Format string injection
 * @id cpp/format-string-injection
 * @kind problem
 */

import cpp
import semmle.code.cpp.dataflow.TaintTracking
import semmle.code.cpp.security.Security

class TaintedFormatConfig extends TaintTracking::Configuration {
  TaintedFormatConfig() { this = "TaintedFormatConfig" }

  override predicate isSource(DataFlow::Node source) {
    /* TODO Delete the `any()` below and complete this predicate's definition */
    any()
  }

  override predicate isSink(DataFlow::Node sink) {
    /* TBD */
    any()
  }
}

from TaintedFormatConfig cfg, DataFlow::Node source, DataFlow::Node sink
where cfg.hasFlow(source, sink)
select sink, "This format string may be derived from a $@.", source, "user-controlled value"
