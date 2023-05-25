import cpp

class MiscRegisterFunction extends Function {
  MiscRegisterFunction() {
    this.getName() = "misc_register" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

from
  MiscRegisterFunction miscRegister, FunctionCall miscRegisterCall, Expr argument,
  Type argumentType, string qlClass
where
  miscRegisterCall.getTarget() = miscRegister and
  argument = miscRegisterCall.getArgument(0) and
  argumentType = argument.getType() and
  qlClass = argument.getAPrimaryQlClass()
select miscRegisterCall, argument, argumentType, qlClass
