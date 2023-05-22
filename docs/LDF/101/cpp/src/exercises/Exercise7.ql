import cpp

module Linux {
  class MiscDeviceStruct extends Struct {
    MiscDeviceStruct() {
      // Copy the solution from Exercise 5 here.
      none()
    }
  }
}

from Linux::MiscDeviceStruct miscDeviceStruct, Field field, Type fieldType
// Implement the where clause that relates the third field of the miscDeviceStruct to field, and field to its type fieldType..
where none()
select miscDeviceStruct, field, fieldType
