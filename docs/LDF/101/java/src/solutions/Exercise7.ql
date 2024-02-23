import cpp

class MiscDeviceStruct extends Struct {
  MiscDeviceStruct() {
    this.getName() = "miscdevice" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

from MiscDeviceStruct miscDeviceStruct, Field field, Type fieldType
where miscDeviceStruct.getAMember(2) = field and field.getType() = fieldType
select miscDeviceStruct, field, fieldType
