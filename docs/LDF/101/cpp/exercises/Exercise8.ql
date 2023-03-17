import cpp

module Linux {
  class FileOperationsStruct extends Struct {
    FileOperationsStruct() {
      // Provide an implementation for the characteristic predicate.
      none()
    }
  }

  class FileOperationsDefinition extends Variable {
    FileOperationsDefinition() {
      // Provide an implementation for the characteristic predicate.
      none()
    }
  }
}

select any(Linux::FileOperationsDefinition fileOperationsDefinition)
