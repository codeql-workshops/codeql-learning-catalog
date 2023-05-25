import cpp

class MiscRegisterFunction extends Function {
  MiscRegisterFunction() {
    this.getName() = "misc_register" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

from MiscRegisterFunction miscRegister
select miscRegister.getACallToThisFunction()
