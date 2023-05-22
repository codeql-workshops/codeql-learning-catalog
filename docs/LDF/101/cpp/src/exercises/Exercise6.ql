import cpp

module Linux {
  class MiscDeviceStruct extends Struct {
    MiscDeviceStruct() {
      // Copy the solution from Exercise 5 here.
      none()
    }
  }

  class MiscDeviceDefinition extends Variable {
    MiscDeviceDefinition() {
      // Provide an implementation for the characteristic predicate.
      none()
    }
  }
}

from Linux::MiscDeviceDefinition miscDeviceDefinition
select miscDeviceDefinition
