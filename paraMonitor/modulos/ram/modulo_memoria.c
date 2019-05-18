#include <linux/fs.h>
#include <linux/init.h>
#include <linux/kernel.h>
#include <linux/sched.h>
#include <linux/module.h>
#include <linux/seq_file.h>
#include <linux/proc_fs.h>
#include <linux/mm.h>
#include <linux/hugetlb.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/quicklist.h>
#include <linux/swap.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>
#include <linux/vmalloc.h>
#ifdef CONFIG_CMA
#include <linux/cma.h>
#endif
#include <asm/page.h>
#include <asm/pgtable.h>
#include "internal.h"

void __attribute__((weak)) arch_report_meminfo(struct seq_file *m)
{
}

static int meminfo_proc_show(struct seq_file *m, void *v)
{    
	struct sysinfo i;
    long ramusada;
    long p_ramusada;
    si_meminfo(&i);
    /*
    ramusada = (i.totalram)-(i.freeram);
    p_ramusada = (ramusada*100)/i.totalram;

    seq_printf(m,     
        "{\"RAM_USADA\":%8lu,"
        "\"pRAM_USADA\":%8lu,"
        "\"RAM_TOTAL\":%8lu}\n"
        ,
        ramusada,
        p_ramusada,
        i.totalram);
        */
    int32_t total_ram, used_ram, used_ram_percentage = 0;
    total_ram = ((uint64_t) i.totalram * i.mem_unit)/1024;
    used_ram = total_ram - (((uint64_t) i.freeram * i.mem_unit)/1024);
    used_ram_percentage = ((uint64_t) used_ram/total_ram)*100;

    seq_printf(m,     
        "{\"RAM_USADA\":%d,"
        "\"pRAM_USADA\":%d,"
        "\"RAM_TOTAL\":%d}\n"
        ,
        used_ram,
        used_ram_percentage,
        total_ram);

    return 0;
}

static void __exit final(void) //Salida de modulo
{   
    printk(KERN_INFO "Cleaning Up.\n");
}

static int meminfo_proc_open(struct inode *inode, struct file *file)
{
    return single_open(file, meminfo_proc_show, NULL);
}

static const struct file_operations meminfo_proc_fops = {
    .open       = meminfo_proc_open,
    .read       = seq_read,
    .llseek     = seq_lseek,
    .release    = single_release,
};

static int __init inicio(void) //Escribe archivo en /proc
{
    proc_create("modulo_memoria", 0, NULL, &meminfo_proc_fops);
    return 0;
}


module_init(inicio);
module_exit(final);

MODULE_LICENSE("GPL");