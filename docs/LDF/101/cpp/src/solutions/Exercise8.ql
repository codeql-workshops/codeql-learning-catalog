import cpp

class FileOperationsStruct extends Struct {
  FileOperationsStruct() {
    this.getName() = "file_operations" and
    this.getFile().getAbsolutePath().matches("%/include/linux/fs.h")
  }
}

class FileOperationsDefinition extends Variable {
  FileOperationsDefinition() { this.getType() instanceof FileOperationsStruct }
}

from FileOperationsDefinition fileOperationsDefinition
select fileOperationsDefinition
