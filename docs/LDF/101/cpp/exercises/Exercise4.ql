import cpp

module Linux {
  class MiscRegisterFunction extends Function {
    MiscRegisterFunction() {
      // Copy the solution from Exercise 3 here.
      none()
    }
  }
}

from
  Linux::MiscRegisterFunction miscRegister, FunctionCall miscRegisterCall, Expr argument,
  Type argumentType, string qlClass
// Provide the where class to relate the miscRegisterCall to the miscRegister function, the function call to the function's argument,
// the argument to its type and primary QL class.
where none()
select miscRegisterCall, argument, argumentType, qlClass
