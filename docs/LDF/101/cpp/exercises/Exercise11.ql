import cpp

module Linux {
  class MiscRegisterFunction extends Function {
    MiscRegisterFunction() {
      // Copy the solution from Exercise 3 here.
      none()
    }
  }

  class MiscDeviceStruct extends Struct {
    MiscDeviceStruct() {
      // Copy the solution from Exercise 5 here.
      none()
    }
  }

  class MiscDeviceDefinition extends Variable {
    MiscDeviceDefinition() {
      // Copy the solution from Exercise 6 here.
      none()
    }

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
}

select any(Linux::DriverUserModeEntry driverUserModeEntry)
