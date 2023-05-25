import cpp

class MiscDeviceStruct extends Struct {
  MiscDeviceStruct() {
    this.getName() = "miscdevice" and
    this.getFile().getAbsolutePath().matches("%/include/linux/miscdevice.h")
  }
}

class MiscDeviceDefinition extends Variable {
  MiscDeviceDefinition() { this.getType() instanceof MiscDeviceStruct }

  FileOperationsDefinition getFileOperations() {
    /* TODO Delete `none()` below and complete this predicate's definition */
    none()
  }
}

class FileOperationsStruct extends Struct {
  FileOperationsStruct() {
    this.getName() = "file_operations" and
    this.getFile().getAbsolutePath().matches("%/include/linux/fs.h")
  }
}

class FileOperationsDefinition extends Variable {
  FileOperationsDefinition() { this.getType() instanceof FileOperationsStruct }

  Function getUnlockedIoctl() {
    exists(Field unlockedIoctl | unlockedIoctl.hasName("unlocked_ioctl") |
      this.getAnAssignedValue().(ClassAggregateLiteral).getFieldExpr(unlockedIoctl) =
        result.getAnAccess()
    )
  }
}

from MiscDeviceDefinition miscDeviceDefinition
select miscDeviceDefinition.getFileOperations()
