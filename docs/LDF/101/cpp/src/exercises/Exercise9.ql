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
    /* TODO Delete `none()` below and complete this predicate's definition */
    none()
  }
}

from FileOperationsDefinition fileOperationsDefinition
select fileOperationsDefinition.getUnlockedIoctl()
