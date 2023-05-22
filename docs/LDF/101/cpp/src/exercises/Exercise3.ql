import cpp

module Linux {
  class MiscRegisterFunction extends Function {
    MiscRegisterFunction() {
      // Provide an implementation for the characteristic predicate.
      none()
    }
  }
}

from Linux::MiscRegisterFunction miscRegister
select miscRegister.getACallToThisFunction()
