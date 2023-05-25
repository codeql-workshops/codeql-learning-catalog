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
    exists(Field fileOperations | fileOperations.hasName("fops") |
      this.getAnAssignedValue()
          .(ClassAggregateLiteral)
          .getFieldExpr(fileOperations)
          .(AddressOfExpr)
          .getOperand() = result.getAnAccess()
    )
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
  /*
   * Commented out since it's unused here
   * Function getUnlockedIoctl() {
   *      exists(Field unlockedIoctl | unlockedIoctl.hasName("unlocked_ioctl") |
   *        this.getAnAssignedValue().(ClassAggregateLiteral).getFieldExpr(unlockedIoctl) =
   *          result.getAnAccess()
   *      )
   *    }
   */

  }

from MiscDeviceDefinition miscDeviceDefinition
select miscDeviceDefinition.getFileOperations()
