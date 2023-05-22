import cpp

module Linux {
  class MiscDeviceStruct extends Struct {
    MiscDeviceStruct() {
      // Provide an implementation for the characteristic predicate.
      none()
    }
  }
}

from Linux::MiscDeviceStruct miscDeviceStruct
select miscDeviceStruct
