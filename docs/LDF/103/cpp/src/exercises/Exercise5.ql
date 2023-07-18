/**
 * @name Format string injection
 * @id cpp/format-string-injection
 * @kind // TODO Change the `@kind` to something else
 */

import cpp
import semmle.code.cpp.dataflow.TaintTracking
import semmle.code.cpp.security.Security

class TaintedFormatConfig extends TaintTracking::Configuration {
  TaintedFormatConfig() { this = "TaintedFormatConfig" }

  override predicate isSource(DataFlow::Node source) {
    exists(SecurityOptions opts | opts.isUserInput(source.asExpr(), _))
  }

  override predicate isSink(DataFlow::Node sink) {
    exists(FormattingFunctionCall printfCall | sink.asExpr() = printfCall.getFormat())
  }
}

from TaintedFormatConfig cfg, DataFlow::Node source, DataFlow::Node sink // TODO change `DataFlow::Node` to an appropriate type
where any() // TODO Delete `any()` and complete this `where` clause
select sink, source, sink, "This format string may be derived from a $@.", source,
  "user-controlled value"
