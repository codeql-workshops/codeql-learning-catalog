import cpp

class MiscRegisterFunction extends Function {
  MiscRegisterFunction() {
    this.getName() = "misc_register" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

class MiscDeviceStruct extends Struct {
  MiscDeviceStruct() {
    this.getName() = "miscdevice" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

class MiscDeviceDefinition extends Variable {
  MiscDeviceDefinition() { this.getType() instanceof MiscDeviceStruct }

  FileOperationsDefinition getFileOperations() {
    // Provide an implementation for this predicate.
    none()
  }
}

class FileOperationsStruct extends Struct {
  FileOperationsStruct() {
    // Copy solution from Exercise 8 here.
    none()
  }
}

class FileOperationsDefinition extends Variable {
  FileOperationsDefinition() {
    // Copy solution from Exercise 8 here.
    none()
  }

  Function getUnlockedIoctl() {
    // Copy solution from Exercise 9 here.
    none()
  }
}

abstract class DriverUserModeEntry extends Function { }

class MiscDriverUserModeEntry extends DriverUserModeEntry {
  MiscDriverUserModeEntry() {
    // Provide an implementation for the characteristic predicate.
    none()
  }
}

from DriverUserModeEntry driverUserModeEntry
select driverUserModeEntry
