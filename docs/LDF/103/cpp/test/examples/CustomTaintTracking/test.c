int scanf(const char *format, ...);
int fscanf(void *stream, const char *format, ...);
int fread(void *buffer, int size, int count,
          void *stream);
char *fgets(char *str, int count, void *stream);
char *fgetws(char *str, int count, void *stream);
char *gets(char *str);
int printf(const char *format, ...);
int fprintf(void *stream, const char *format, ...);

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

    /* Safe uses of printf and fprintf that contains static format strings */

    printf("%s", argv1);
    printf("%s", buf1);
    printf("%s", buf2);
    printf("%s", buf3);
    printf("%s", buf4);
    printf("%s", buf5);
    printf("%s", buf6);

    fprintf("some_stream", "%s", argv1);
    fprintf("some_stream", "%s", buf1);
    fprintf("some_stream", "%s", buf2);
    fprintf("some_stream", "%s", buf3);
    fprintf("some_stream", "%s", buf4);
    fprintf("some_stream", "%s", buf5);
    fprintf("some_stream", "%s", buf6);

    /* Unsafe uses of printf and fprintf that contains supplied format strings */

    printf(argv1);
    printf(buf1);
    printf(buf2);
    printf(buf3);
    printf(buf4);
    printf(buf5);
    printf(buf6);

    fprintf("some_stream", argv1);
    fprintf("some_stream", buf1);
    fprintf("some_stream", buf2);
    fprintf("some_stream", buf3);
    fprintf("some_stream", buf4);
    fprintf("some_stream", buf5);
    fprintf("some_stream", buf6);

    return 0;
}

