import cpp

module Linux {
  class MiscRegisterFunction extends Function {
    MiscRegisterFunction() {
      this.getName() = "misc_register" and
      this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
    }
  }
}

from Linux::MiscRegisterFunction miscRegister
select miscRegister.getACallToThisFunction()
