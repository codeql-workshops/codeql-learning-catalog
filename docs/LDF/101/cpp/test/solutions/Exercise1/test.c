#define MISC_DYNAMIC_MINOR 256
#define DEVICE_NAME "vulnerable_device"

struct miscdevice
{
    int minor;
    const char *name;
    const struct file_operations *fops;
};

int misc_register(struct miscdevice *misc);

static int vuln_release(struct inode *inode, struct file *filp)
{
    return 0;
}

struct file_operations
{
    struct module *owner;
    long (*unlocked_ioctl)(struct file *, unsigned int, unsigned long);
    int (*release)(struct inode *, struct file *);
};

static long do_ioctl(struct file *filp, unsigned int cmd, unsigned long args)
{
    return 0l;
}

int main()
{
    static struct file_operations vuln_ops = {
        .owner = "hihi",
        .unlocked_ioctl = do_ioctl,
        .release = vuln_release,
    };
    static struct miscdevice vuln_device = {
        MISC_DYNAMIC_MINOR, DEVICE_NAME, &vuln_ops};
    return 0;
}
