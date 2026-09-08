---
layout: default
title: "L10.5: Managing Storage"
---

# L10.5: Managing Storage


# Linux Logical Volume Management and RAID

Linux provides technologies such as **Logical Volume Management (LVM)** and **RAID** to make storage easier to manage, expand, optimize, and protect against disk failures.

These technologies solve different but related problems:

```text
LVM
→ Flexible disk-space management

RAID
→ Data availability, performance, and fault tolerance
```

---

# 1. Logical Volume Management (LVM)

**Logical Volume Management (LVM)** is a storage-management system that allows physical disks or partitions to be combined into flexible storage pools and then divided into logical volumes.

Traditional partitioning creates relatively fixed partitions:

```text
Disk
│
├── Partition 1
├── Partition 2
└── Partition 3
```

LVM introduces an additional abstraction layer:

```text
Physical Disks
      ↓
Physical Volumes (PV)
      ↓
Volume Group (VG)
      ↓
Logical Volumes (LV)
      ↓
Filesystem
      ↓
Mount Point
```

This makes it easier to resize and reorganize storage.

---

# 2. LVM Components

## Physical Volume — PV

A **Physical Volume** is a disk or partition prepared for use by LVM.

Examples:

```text
/dev/sda2
/dev/sdb1
```

Create a physical volume:

```bash
sudo pvcreate /dev/sdb1
```

View physical volumes:

```bash
sudo pvs
```

or:

```bash
sudo pvdisplay
```

---

## Volume Group — VG

A **Volume Group** combines one or more physical volumes into a single storage pool.

Example:

```text
/dev/sda2 ──┐
            ├── Volume Group
/dev/sdb1 ──┘
```

Create a volume group:

```bash
sudo vgcreate vgdata /dev/sdb1 /dev/sdc1
```

View volume groups:

```bash
sudo vgs
```

---

## Logical Volume — LV

A **Logical Volume** is created from free space inside a volume group.

Example:

```text
Volume Group
     |
     +── Logical Volume 1
     |
     +── Logical Volume 2
     |
     +── Logical Volume 3
```

Create a logical volume:

```bash
sudo lvcreate -L 20G -n lvdata vgdata
```

View logical volumes:

```bash
sudo lvs
```

---

# 3. LVM Storage Model

Consider two disks:

```text
/dev/sdb1 → 500 GB
/dev/sdc1 → 500 GB
```

Create physical volumes:

```text
PV1 = 500 GB
PV2 = 500 GB
```

Combine them:

```text
PV1 ──┐
      ├── VG = 1 TB
PV2 ──┘
```

Logical volumes can then be created from the pool:

```text
VG = 1 TB

├── lv-data    400 GB
├── lv-backup  300 GB
└── free       300 GB
```

This is much more flexible than permanently assigning every byte to traditional partitions.

---

# 4. Why Use LVM?

LVM provides flexibility in disk-space allocation.

### Traditional partitioning

```text
Disk
├── /       100 GB
├── /home   300 GB
└── /data   100 GB
```

If `/data` becomes full while `/home` has lots of free space, reallocating space can be difficult.

### LVM

```text
Volume Group
├── /        Logical Volume
├── /home    Logical Volume
└── /data    Logical Volume
```

Logical volumes can often be resized more conveniently.

---

# 5. RAID

**RAID** stands for:

> **Redundant Array of Independent Disks**

RAID combines multiple physical disks into a storage system.

Depending on the RAID level, it can provide:

- Data redundancy
- Fault tolerance
- Improved performance
- Better storage utilization
- Protection against disk failures

---

# 6. Why RAID Is Needed

A single disk can fail.

Without redundancy:

```text
Disk
 ↓
Failure
 ↓
Data unavailable
```

With a suitable RAID configuration:

```text
Multiple Disks
      ↓
RAID
      ↓
Disk failure
      ↓
Data remains accessible
```

The exact protection depends on the RAID level.

---

# 7. RAID Controllers

A **RAID controller** manages how data is distributed across multiple disks.

It can be implemented as:

### Hardware RAID

A dedicated RAID controller handles RAID operations.

```text
Operating System
       ↓
RAID Controller
       ↓
+-----+-----+-----+
| Disk| Disk| Disk|
+-----+-----+-----+
```

### Software RAID

The operating system manages RAID.

Linux provides software RAID functionality through technologies such as:

```bash
mdadm
```

The general idea is:

```text
Operating System
       ↓
Software RAID
       ↓
Multiple Disks
```

---

# 8. RAID Levels

Different RAID levels use different strategies for distributing and protecting data.

Common RAID configurations include:

```text
RAID 0
RAID 1
RAID 5
RAID 6
RAID 10
```

They provide different combinations of:

- Performance
- Capacity
- Redundancy
- Fault tolerance

---

# 9. RAID 0 — Striping

RAID 0 distributes data across multiple disks.

This technique is called **striping**.

Example:

```text
Data: A B C D

Disk 1: A   C
Disk 2:   B   D
```

### Advantages

- High performance
- Full combined capacity

### Disadvantage

There is **no redundancy**.

If one disk fails:

```text
Disk 1 → FAILED
       ↓
RAID 0 data becomes unavailable
```

Therefore:

```text
RAID 0
→ Performance
→ No fault tolerance
```

---

# 10. RAID 1 — Mirroring

RAID 1 duplicates data across disks.

Example:

```text
Data: A B C D

Disk 1: A B C D
Disk 2: A B C D
```

Disk 2 is a mirror of Disk 1.

### Advantages

- Excellent redundancy
- One disk can fail without losing the mirrored data

### Disadvantage

Approximately half of the raw capacity is available when using two equal-sized disks.

```text
2 × 1 TB disks

Raw capacity = 2 TB
Usable capacity ≈ 1 TB
```

---

# 11. RAID 5 — Distributed Parity

RAID 5 uses:

- Striping
- Distributed parity

Parity information is distributed across the disks rather than being stored on only one dedicated parity disk.

Conceptually:

```text
Disk 1     Disk 2     Disk 3
--------   --------   --------
Data       Data       Parity
Data       Parity     Data
Parity     Data       Data
```

RAID 5 can generally tolerate:

```text
1 disk failure
```

### Minimum disks

RAID 5 requires at least:

```text
3 disks
```

### Usable capacity

For `N` disks of equal capacity:

```text
Usable capacity ≈ (N - 1) × disk capacity
```

Example:

```text
4 × 2 TB disks

Usable ≈ (4 - 1) × 2 TB
       ≈ 6 TB
```

---

# 12. Distributed Parity

**Parity** is additional information that allows missing data to be reconstructed after a disk failure.

Instead of keeping all parity on one disk, RAID 5 and RAID 6 distribute parity across the array.

Conceptually:

```text
Disk 1    Disk 2    Disk 3    Disk 4
--------  --------  --------  --------
Data      Data      Data      Parity
Data      Data      Parity    Data
Data      Parity    Data      Data
Parity    Data      Data      Data
```

This distribution helps balance parity storage and avoids having one dedicated parity disk.

---

# 13. RAID 6

RAID 6 extends the RAID 5 concept by using **dual distributed parity**.

Conceptually:

```text
Disk 1    Disk 2    Disk 3    Disk 4
--------  --------  --------  --------
Data      Data      P1        P2
Data      P1        P2        Data
P1        P2        Data      Data
```

RAID 6 can generally tolerate:

```text
2 simultaneous disk failures
```

### Minimum disks

RAID 6 requires at least:

```text
4 disks
```

### Usable capacity

For `N` equal-sized disks:

```text
Usable capacity ≈ (N - 2) × disk capacity
```

Example:

```text
6 × 2 TB disks

Usable ≈ (6 - 2) × 2 TB
       ≈ 8 TB
```

The remaining capacity is used for dual parity.

---

# 14. RAID 5 vs RAID 6

| Feature | RAID 5 | RAID 6 |
|---|---|---|
| Striping | Yes | Yes |
| Distributed parity | Yes | Yes |
| Parity blocks | One set | Two sets |
| Disk failures tolerated | 1 | 2 |
| Minimum disks | 3 | 4 |
| Storage efficiency | Higher | Lower |
| Fault tolerance | Good | Better |

### Mental model

```text
RAID 5
→ Survive 1 disk failure

RAID 6
→ Survive 2 disk failures
```

RAID 6 is particularly useful when large storage arrays need stronger protection against multiple disk failures.

---

# 15. RAID 10

RAID 10 combines:

```text
RAID 1 → Mirroring
RAID 0 → Striping
```

It is often represented as:

```text
RAID 10
  ↓
Mirroring + Striping
```

Example:

```text
        RAID 0
     /          \
 RAID 1        RAID 1
 /   \          /   \
D1   D2        D3   D4
```

RAID 10 can provide:

- High performance
- Disk redundancy
- Good read/write performance

It requires at least:

```text
4 disks
```

---

# 16. RAID Configuration Overview

| RAID | Technique | Fault Tolerance | Main Benefit |
|---|---|---:|---|
| RAID 0 | Striping | None | Performance |
| RAID 1 | Mirroring | 1 disk in a 2-disk mirror | Redundancy |
| RAID 5 | Striping + distributed parity | 1 disk | Capacity + protection |
| RAID 6 | Striping + dual distributed parity | 2 disks | Stronger protection |
| RAID 10 | Mirroring + striping | Depends on failure pattern | Performance + redundancy |

---

# 17. Combining Multiple Hard Disks into One Large Volume

One important goal of storage technologies is to make multiple physical disks appear as a larger logical storage system.

For example:

```text
Disk 1 → 2 TB
Disk 2 → 2 TB
Disk 3 → 2 TB
Disk 4 → 2 TB
```

Instead of managing each disk separately:

```text
/dev/sdb
/dev/sdc
/dev/sdd
/dev/sde
```

a storage layer can combine them into a logical storage system.

Conceptually:

```text
+--------+  +--------+  +--------+  +--------+
| Disk 1 |  | Disk 2 |  | Disk 3 |  | Disk 4 |
|  2 TB  |  |  2 TB  |  |  2 TB  |  |  2 TB  |
+--------+  +--------+  +--------+  +--------+
      \          |          |          /
       \         |          |         /
        +---------------------------+
        |       Storage Layer       |
        +---------------------------+
                    |
                    ↓
             Logical Storage
```

The exact usable capacity depends on the technology and RAID level.

---

# 18. LVM vs RAID

LVM and RAID are **not the same thing**.

### RAID

Primarily addresses:

```text
Disk redundancy
Performance
Fault tolerance
```

### LVM

Primarily addresses:

```text
Flexible storage allocation
Logical volumes
Resizing
Storage pooling
```

They can also be used together.

Example:

```text
Physical Disks
      ↓
     RAID
      ↓
 RAID virtual device
      ↓
     LVM
      ↓
Volume Group
      ↓
Logical Volumes
      ↓
Filesystem
```

This provides both:

- RAID-level disk protection
- LVM-level storage flexibility

---

# 19. Example Storage Architecture

Suppose a server has four disks:

```text
/dev/sdb → 2 TB
/dev/sdc → 2 TB
/dev/sdd → 2 TB
/dev/sde → 2 TB
```

A RAID 6 array could be created conceptually:

```text
4 × 2 TB disks
       ↓
     RAID 6
       ↓
Approximately 4 TB usable
       ↓
      LVM
       ↓
  Volume Group
       ↓
+-------------+
| Logical Vol |
+-------------+
       ↓
   Filesystem
       ↓
   /data
```

This provides a single logical `/data` storage area while RAID handles disk-level redundancy.

---

# 20. Important Terminology

### Striping

Splitting data across multiple disks.

```text
Data
 ↓
A B C D

Disk 1 → A C
Disk 2 → B D
```

Used by:

```text
RAID 0
RAID 5
RAID 6
RAID 10
```

---

### Mirroring

Keeping duplicate copies of data.

```text
Disk 1 → A B C D
Disk 2 → A B C D
```

Used by:

```text
RAID 1
RAID 10
```

---

### Parity

Additional information used to reconstruct missing data after disk failure.

Used by:

```text
RAID 5 → Single parity
RAID 6 → Dual parity
```

---

### Fault Tolerance

The ability of a storage system to continue operating despite one or more component failures.

```text
Disk failure
     ↓
Redundant data/parity
     ↓
System continues operating
```

---

# 21. Key Mental Model

Remember the technologies using this simple model:

```text
RAID
 │
 ├── RAID 0 → Speed
 │
 ├── RAID 1 → Mirror
 │
 ├── RAID 5 → 1-disk protection + parity
 │
 ├── RAID 6 → 2-disk protection + dual parity
 │
 └── RAID 10 → Speed + mirroring


LVM
 │
 ├── PV → Physical storage
 │
 ├── VG → Storage pool
 │
 └── LV → Logical storage
```

---

# 22. Final Cheat Sheet

```text
LVM
→ Logical Volume Management
→ Flexible disk-space allocation
→ PV → VG → LV

RAID
→ Redundant Array of Independent Disks
→ Combines multiple disks
→ Can provide redundancy and/or performance

RAID 0
→ Striping
→ Fast
→ No redundancy

RAID 1
→ Mirroring
→ Redundancy
→ Lower usable capacity

RAID 5
→ Striping + distributed parity
→ Survives 1 disk failure

RAID 6
→ Striping + dual distributed parity
→ Survives 2 disk failures

RAID 10
→ Mirroring + striping
→ Performance + redundancy
```

The central distinction is:

```text
RAID
→ "How should data be distributed and protected across disks?"

LVM
→ "How should available storage be organized and allocated logically?"
```
```
