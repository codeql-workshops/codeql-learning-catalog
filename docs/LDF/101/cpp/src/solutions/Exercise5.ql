import cpp

module Linux {
  class MiscDeviceStruct extends Struct {
    MiscDeviceStruct() {
      this.getName() = "miscdevice" and
      this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
    }
  }
}

from Linux::MiscDeviceStruct miscDeviceStruct
select miscDeviceStruct
