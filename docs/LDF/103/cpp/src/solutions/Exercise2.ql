import cpp
import semmle.code.cpp.dataflow.new.DataFlow

from FormattingFunctionCall printfCall, DataFlow::Node sink
where sink.asExpr() = printfCall.getFormat()
select sink
