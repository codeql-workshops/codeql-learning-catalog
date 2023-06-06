struct miscdevice
{
    int minor;
    const char *name;
    const struct file_operations *fops;
};

int misc_register(struct miscdevice *misc) { return 0; };
