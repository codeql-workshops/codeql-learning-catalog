int scanf(const char *format, ...);
int fscanf(void *stream, const char *format, ...);
int fread(void *buffer, int size, int count,
          void *stream);
char *fgets(char *str, int count, void *stream);
char *fgetws(char *str, int count, void *stream);
char *gets(char *str);

int main(int argc, char *argv[])
{
    char *argv1 = argv[1];

    char buf1[3];
    scanf("Enter: %s", buf1);

    char buf2[3];
    fscanf("some_file_pointer", "%s", buf2);

    char buf3[3];
    fread(buf3, 3, 1, "some_file_pointer");

    char buf4[3];
    fgets(buf4, 3, "some_file_pointer");

    char buf5[3];
    fgetws(buf5, 3, "some_file_pointer");

    char buf6[3];
    gets(buf6);

    return 0;
}
