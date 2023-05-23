#include "include/linux/miscdevice.h"
#include "include/linux/fs.h"

#define MISC_DYNAMIC_MINOR 256
#define DEVICE_NAME "vulnerable_device"

int printf(const char *formatter, ...);

static int vuln_release(struct inode *inode, struct file *filp)
{
    return 0;
}

static long do_ioctl(struct file *filp, unsigned int cmd, unsigned long args)
{
    return 0l;
}

static struct file_operations vuln_ops = {
    .owner = "hihi",
    .unlocked_ioctl = do_ioctl,
    .release = vuln_release,
};

static struct miscdevice vuln_device = {
    MISC_DYNAMIC_MINOR, DEVICE_NAME, &vuln_ops};

static int vuln_module_init(void)
{
    int ret;

    ret = misc_register(&vuln_device);

    if (ret < 0)
        printf("[-] Error registering device [-]\n");

    printf("[!!!] use_stack_obj @ [!!!]\n");

    return ret;
}

int main() { return 0; }