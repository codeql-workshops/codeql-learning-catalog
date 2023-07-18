import cpp
import semmle.code.cpp.dataflow.new.DataFlow
import semmle.code.cpp.security.Security

from SecurityOptions opts, DataFlow::Node source
where opts.isUserInput(source.asExpr(), _)
select source
