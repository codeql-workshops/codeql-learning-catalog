import cpp

class MiscDeviceStruct extends Struct {
  MiscDeviceStruct() {
    this.getName() = "miscdevice" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

from MiscDeviceStruct miscDeviceStruct, Field field, Type fieldType
where
  /* Delete `none()` below and complete the `where` clause. */
  none()
select miscDeviceStruct, field, fieldType
