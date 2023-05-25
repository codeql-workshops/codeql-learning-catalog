import cpp

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

from FileOperationsDefinition fileOperationsDefinition
select fileOperationsDefinition.getUnlockedIoctl()
