import cpp

module Linux {
  class MiscDeviceStruct extends Struct {
    MiscDeviceStruct() {
      this.getName() = "miscdevice" and
      this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
    }
  }

  class MiscDeviceDefinition extends Variable {
    MiscDeviceDefinition() { this.getType() instanceof MiscDeviceStruct }
  }
}

from Linux::MiscDeviceDefinition miscDeviceDefinition
select miscDeviceDefinition
