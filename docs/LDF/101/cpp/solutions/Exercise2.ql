import cpp

from FunctionCall call
where call.getTarget().getName() = "misc_register"
select call
