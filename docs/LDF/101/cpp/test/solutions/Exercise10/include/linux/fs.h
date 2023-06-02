struct file_operations
{
    struct module *owner;
    long (*unlocked_ioctl)(struct file *, unsigned int, unsigned long);
    int (*release)(struct inode *, struct file *);
};