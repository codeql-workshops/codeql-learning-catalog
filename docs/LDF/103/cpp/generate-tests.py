import os.path

# Adjust these paths before running
solutions_dir = "/workspaces/codeql-learning-catalog/docs/LDF/103/cpp/src/solutions"
tests_dir = "/workspaces/codeql-learning-catalog/docs/LDF/103/cpp/test/solutions"

# Creating directories per exercise
for exercise_file in sorted(os.listdir(solutions_dir)):
    exercise_name = os.path.splitext(exercise_file)[0]
    os.mkdir(os.path.join(tests_dir, exercise_name))

# Creating qlrefs
for exercise_file in sorted(os.listdir(solutions_dir)):
    exercise_file_name_without_extension = os.path.splitext(exercise_file)[0]
    exercise_file_qlref_name = os.path.splitext(exercise_file)[0] + ".qlref"
    with open(
        os.path.join(
            tests_dir, exercise_file_name_without_extension, exercise_file_qlref_name
        ),
        "w+",
    ) as f:
        f.write(exercise_file)
        f.write("\n")
