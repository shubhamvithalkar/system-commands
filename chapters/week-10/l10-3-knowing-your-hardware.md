---
layout: default
title: "L10.3 - Knowing your Hardware"
---

# L10.3 - Knowing your Hardware



# Linux Hardware and System Information Commands

Linux provides several commands and virtual files for inspecting **hardware, memory, storage, CPU, graphics, power, disk performance, and network interfaces**.

These commands are especially useful for:

- System administration
- Hardware troubleshooting
- Performance monitoring
- Identifying installed devices
- Checking disk and memory usage
- Diagnosing network interfaces

---

## 1. `hwinfo`

`hwinfo` is a hardware information utility that provides detailed information about the hardware devices detected by the system.

### Basic usage

```bash
hwinfo
```

Because the output can be very large, it is often useful to combine it with commands such as `less`:

```bash
hwinfo | less
```

### Get information about a particular category

```bash
hwinfo --cpu
hwinfo --memory
hwinfo --disk
hwinfo --network
```

### Use cases

`hwinfo` can help identify:

- CPU
- RAM
- Storage devices
- Graphics hardware
- Network interfaces
- USB devices
- PCI devices

---

# 2. `lshw`

`lshw` means **List Hardware**.

It displays detailed information about the hardware configuration of the system.

### Basic usage

```bash
sudo lshw
```

The output may be very large, so:

```bash
sudo lshw | less
```

### Short format

```bash
sudo lshw -short
```

Example:

```text
H/W path       Device      Class       Description
==================================================
/0                         system      Computer
/0/0                       memory      System Memory
/0/4                       processor   CPU
/0/100                     bridge      Host bridge
/0/100/2        /dev/fb0   display     VGA compatible controller
```

### Why `sudo`?

Some hardware information can only be obtained with elevated privileges.

---

# 3. `lshw -c display`

The `-c` option specifies a **hardware class**.

```bash
sudo lshw -c display
```

This displays information about the system's **display/graphics hardware**.

It can show details such as:

- GPU/device name
- Vendor
- Driver
- PCI address
- Display controller information

### Example

```bash
sudo lshw -c display
```

This is useful when troubleshooting:

- Graphics drivers
- GPU detection
- Display problems
- Hardware acceleration

---

# 4. CPU Information — `/proc/cpuinfo`

Linux exposes detailed information about the CPU through the virtual `/proc` filesystem.

```bash
cat /proc/cpuinfo
```

Example information includes:

```text
processor
vendor_id
cpu family
model
model name
cpu MHz
cache size
flags
```

### Find CPU model

```bash
grep "model name" /proc/cpuinfo
```

### Count logical CPUs

```bash
grep -c "^processor" /proc/cpuinfo
```

### Important concept

`/proc` is a **virtual filesystem**.

It does not represent ordinary files stored permanently on the disk. Instead, Linux exposes information about the running system through it.

Common examples:

```bash
/proc/cpuinfo
/proc/meminfo
/proc/partitions
```

---

# 5. Partitions — `/proc/partitions`

Linux provides information about detected block devices and partitions through:

```bash
cat /proc/partitions
```

Example:

```text
major minor  #blocks  name
   8        0  488386584 sda
   8        1     524288 sda1
   8        2  487861248 sda2
```

The output contains:

- Major device number
- Minor device number
- Number of blocks
- Device/partition name

### Important

`/proc/partitions` provides a kernel-level view of detected partitions, but it is not usually the most convenient command for understanding the complete disk layout.

For that, `lsblk` is generally easier.

---

# 6. `lsblk`

`lsblk` means **list block devices**.

```bash
lsblk
```

It displays storage devices in a tree-like structure.

Example:

```text
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0   477G  0 disk
├─sda1        8:1    0   512M  0 part /boot/efi
└─sda2        8:2    0 476.5G  0 part /
```

### Useful options

Human-readable sizes:

```bash
lsblk -h
```

Show filesystem information:

```bash
lsblk -f
```

Show additional information:

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

### Mental model

```text
Physical Disk
     |
     +---- Partition 1
     |
     +---- Partition 2
             |
             +---- Filesystem
```

`lsblk` is particularly useful for understanding this hierarchy.

---

# 7. `lspci`

`lspci` displays information about devices connected through the **PCI/PCI Express bus**.

```bash
lspci
```

Typical devices include:

- Graphics cards
- Network controllers
- Audio controllers
- USB controllers
- SATA controllers
- PCI bridges

Example:

```text
00:02.0 VGA compatible controller: Intel Corporation ...
00:14.0 USB controller: Intel Corporation ...
00:1f.3 Audio device: Intel Corporation ...
```

### Display only VGA/graphics information

```bash
lspci | grep -i vga
```

### Display network hardware

```bash
lspci | grep -i network
```

### Verbose information

```bash
sudo lspci -v
```

### Very detailed information

```bash
sudo lspci -vv
```

---

# 8. `free`

`free` displays information about **RAM and swap memory**.

```bash
free
```

For human-readable values:

```bash
free -h
```

Example:

```text
               total        used        free      shared  buff/cache   available
Mem:            15Gi        6Gi        2Gi        500Mi        7Gi        8Gi
Swap:            4Gi        0Gi        4Gi
```

### Important columns

| Column | Meaning |
|---|---|
| `total` | Total memory |
| `used` | Memory currently in use |
| `free` | Completely unused memory |
| `shared` | Shared memory |
| `buff/cache` | Memory used for buffers and cache |
| `available` | Estimated memory available for new applications |

### Human-readable output

```bash
free -h
```

### Continuously monitor memory

```bash
watch free -h
```

---

# 9. DIMM Modules — `dmidecode`

A **DIMM** is a memory module used for system RAM.

`dmidecode` can retrieve hardware information from the system's **DMI/SMBIOS tables**.

To inspect memory modules:

```bash
sudo dmidecode --type memory
```

It can provide information such as:

- RAM size
- RAM type
- Speed
- Manufacturer
- Part number
- Memory slot
- Configured speed

Example:

```text
Memory Device
    Size: 8 GB
    Type: DDR4
    Speed: 3200 MT/s
    Manufacturer: Example
    Part Number: Example123
```

### Why is this useful?

It can help determine:

- How much RAM is installed
- How many memory slots exist
- Which slots are populated
- RAM type
- RAM speed
- Manufacturer and part information

---

# 10. `hardinfo`

`hardinfo` is a graphical **hardware information and benchmarking tool**.

It provides a GUI for viewing system information.

Typical categories include:

- Computer
- Operating system
- Display
- Storage
- Network
- Memory
- Devices
- Benchmarks

Start it with:

```bash
hardinfo
```

If it is not installed, it can typically be installed through the distribution's package manager.

For Ubuntu:

```bash
sudo apt install hardinfo
```

### Difference between `lshw` and `hardinfo`

| Command | Interface |
|---|---|
| `lshw` | Command line |
| `hardinfo` | Graphical interface |

`hardinfo` is useful when you want a human-friendly overview of the machine.

---

# 11. `clinfo`

`clinfo` provides information about **OpenCL** platforms and devices.

OpenCL is a framework for performing computation on different processors, including:

- CPUs
- GPUs
- Other accelerators

Run:

```bash
clinfo
```

It can display information such as:

- OpenCL platforms
- OpenCL devices
- Device name
- Vendor
- Driver version
- OpenCL version
- Maximum work-group size
- Available memory

Example:

```text
Platform Name: Intel
Platform Version: OpenCL ...
Device Name: ...
Device Type: GPU
```

### Why use `clinfo`?

It is useful when troubleshooting or verifying:

- OpenCL installation
- GPU compute support
- CPU OpenCL support
- OpenCL drivers
- Compute applications

---

# 12. `upower`

`upower` is used to obtain information about **power devices**.

It is particularly useful for laptops and battery-powered systems.

### Display available devices

```bash
upower -e
```

Example:

```text
/org/freedesktop/UPower/devices/line_power_AC
/org/freedesktop/UPower/devices/battery_BAT0
```

### Get battery information

```bash
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

Information may include:

```text
state
percentage
energy
energy-full
energy-rate
voltage
time to empty
```

### Typical workflow

First find the battery device:

```bash
upower -e
```

Then inspect it:

```bash
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

---

# 13. Hard Disk Statistics — `hdparm`

`hdparm` can be used to inspect and test certain properties of storage devices.

A basic read-performance test is:

```bash
sudo hdparm -Tt /dev/sda
```

Here:

```text
-T    Test cached reads
-t    Test buffered/device reads
```

Example:

```text
Timing cached reads:   ...
Timing buffered disk reads:   ...
```

### Important distinction

`-T`:

```bash
sudo hdparm -T /dev/sda
```

tests reading from the system's cache/buffer.

`-t`:

```bash
sudo hdparm -t /dev/sda
```

tests buffered reads from the device.

Therefore:

```bash
sudo hdparm -Tt /dev/sda
```

performs both tests.

### Caution

`hdparm` has options that can modify disk settings. Performance-testing commands should be used carefully, and destructive or configuration-changing options should not be used casually.

---

# 14. Disk Space — `df -h`

`df` means **disk filesystem**.

It reports the amount of disk space used and available on mounted filesystems.

```bash
df
```

Human-readable output:

```bash
df -h
```

Example:

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       100G   45G   50G  48% /
/dev/sda1       512M   10M  502M   2% /boot/efi
```

### Important columns

| Column | Meaning |
|---|---|
| `Filesystem` | Filesystem/device |
| `Size` | Total size |
| `Used` | Used space |
| `Avail` | Available space |
| `Use%` | Percentage used |
| `Mounted on` | Mount point |

### Check the root filesystem

```bash
df -h /
```

### Check all mounted filesystems

```bash
df -h
```

### Important distinction

`df` tells you about **filesystem disk usage**.

It does not tell you how much space a particular directory consumes.

For directory sizes, use:

```bash
du -sh directory/
```

---

# 15. `iostat`

`iostat` is used for monitoring **CPU and I/O statistics**.

The `-d` option displays device statistics.

The `-x` option displays extended statistics.

```bash
iostat -dx
```

To inspect a specific device:

```bash
iostat -dx /dev/sdb
```

Depending on the version of `iostat`, device naming/filtering behavior may differ; commonly, the command is used as:

```bash
iostat -dx
```

and the desired device is identified in the resulting device table.

### Useful columns

You may see fields such as:

- `r/s` — reads per second
- `w/s` — writes per second
- `rkB/s` — read throughput
- `wkB/s` — write throughput
- `await` — average I/O wait time
- `%util` — device utilization

### Why use `iostat`?

It helps identify storage performance problems such as:

- High disk utilization
- Slow I/O
- Excessive read/write activity
- I/O bottlenecks

### Installation

On Ubuntu, `iostat` is generally provided by the `sysstat` package:

```bash
sudo apt install sysstat
```

Then:

```bash
iostat -dx
```

---

# 16. `ifconfig`

`ifconfig` is a traditional command for displaying and configuring network interfaces.

Basic usage:

```bash
ifconfig
```

It can show:

- Network interfaces
- IP addresses
- MAC addresses
- Network statistics
- Interface status

Example:

```text
eth0
    inet 192.168.1.10
    netmask 255.255.255.0
    ether xx:xx:xx:xx:xx:xx
```

---

# 17. `ip` — Modern Replacement for `ifconfig`

The traditional `ifconfig` command has largely been replaced by the **`ip` command** from the `iproute2` package.

Instead of:

```bash
ifconfig
```

use:

```bash
ip addr
```

or the shorter form:

```bash
ip a
```

### Show network interfaces

```bash
ip link
```

### Show IP addresses

```bash
ip addr
```

### Show routing table

```bash
ip route
```

### Show a particular interface

```bash
ip addr show eth0
```

### Mental model

```text
ifconfig
   |
   +---- Traditional networking command

ip
   |
   +---- Modern Linux networking command
         |
         +---- ip addr
         +---- ip link
         +---- ip route
```

---

# 18. Important Command Summary

| Command | Main Purpose |
|---|---|
| `hwinfo` | Detailed hardware information |
| `lshw` | List hardware |
| `lshw -c display` | Display/GPU hardware |
| `cat /proc/cpuinfo` | CPU information |
| `cat /proc/partitions` | Kernel partition information |
| `lsblk` | Block devices and partitions |
| `lspci` | PCI devices |
| `free -h` | RAM and swap usage |
| `dmidecode --type memory` | DIMM/RAM hardware information |
| `hardinfo` | GUI hardware information |
| `clinfo` | OpenCL platform/device information |
| `upower` | Power and battery information |
| `hdparm -Tt` | Disk read-performance testing |
| `df -h` | Filesystem disk usage |
| `iostat -dx` | Disk I/O statistics |
| `ifconfig` | Traditional network interface information |
| `ip addr` | Modern network interface/IP information |

---

# 19. Hardware Inspection Mental Model

A useful way to remember these commands is to group them by what you want to inspect:

```text
LINUX SYSTEM
│
├── CPU
│   └── /proc/cpuinfo
│
├── RAM
│   ├── free
│   └── dmidecode
│
├── STORAGE
│   ├── /proc/partitions
│   ├── lsblk
│   ├── df
│   ├── hdparm
│   └── iostat
│
├── PCI DEVICES
│   └── lspci
│
├── GRAPHICS
│   ├── lshw -c display
│   └── clinfo
│
├── POWER
│   └── upower
│
├── GENERAL HARDWARE
│   ├── hwinfo
│   ├── lshw
│   └── hardinfo
│
└── NETWORK
    ├── ifconfig
    └── ip
```

---

# 20. Quick Practical Reference

### CPU

```bash
cat /proc/cpuinfo
```

### RAM usage

```bash
free -h
```

### RAM hardware/modules

```bash
sudo dmidecode --type memory
```

### Storage devices

```bash
lsblk
```

### Disk space

```bash
df -h
```

### PCI devices

```bash
lspci
```

### Graphics device

```bash
sudo lshw -c display
```

### Disk performance

```bash
sudo hdparm -Tt /dev/sda
```

### Disk I/O statistics

```bash
iostat -dx
```

### Battery

```bash
upower -e
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

### Network interfaces

```bash
ip addr
```

### Routing table

```bash
ip route
```

### Complete hardware overview

```bash
sudo lshw
```

---

# 21. Key Differences to Remember

### `lsblk` vs `df`

```text
lsblk
  → Shows disks, partitions, and block-device hierarchy

df
  → Shows filesystem space usage
```

### `free` vs `dmidecode`

```text
free
  → How RAM is being used right now

dmidecode
  → Physical/configured RAM module information
```

### `hdparm` vs `iostat`

```text
hdparm
  → Performs disk read-performance tests

iostat
  → Monitors ongoing CPU/device I/O statistics
```

### `lshw` vs `lspci`

```text
lshw
  → Broad hardware inventory

lspci
  → Devices connected through PCI/PCIe
```

### `ifconfig` vs `ip`

```text
ifconfig
  → Older networking utility

ip
  → Modern Linux networking utility
```

---

# 22. Final Cheat Sheet

```bash
# General hardware
hwinfo
sudo lshw

# Graphics
sudo lshw -c display

# CPU
cat /proc/cpuinfo

# Partitions
cat /proc/partitions

# Block devices
lsblk
lsblk -f

# PCI devices
lspci

# Memory usage
free -h

# RAM/DIMM information
sudo dmidecode --type memory

# GUI hardware information
hardinfo

# OpenCL information
clinfo

# Power/battery
upower -e
upower -i /org/freedesktop/UPower/devices/battery_BAT0

# Disk performance
sudo hdparm -Tt /dev/sda

# Filesystem disk usage
df -h

# Disk I/O statistics
iostat -dx

# Traditional network information
ifconfig

# Modern network information
ip addr
ip link
ip route
```