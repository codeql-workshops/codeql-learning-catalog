import cpp

class MiscDeviceStruct extends Struct {
  MiscDeviceStruct() {
    this.getName() = "miscdevice" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

class MiscDeviceDefinition extends Variable {
  MiscDeviceDefinition() {
    /* TODO Delete `none()` below and complete this characteristic predicate's definition */
    none()
  }
}

from MiscDeviceDefinition miscDeviceDefinition
select miscDeviceDefinition
