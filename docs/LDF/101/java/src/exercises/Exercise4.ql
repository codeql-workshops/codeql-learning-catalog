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
  /* TODO Delete the `none()` below and complete the where clause */
  none()
select miscRegisterCall, argument, argumentType, qlClass
