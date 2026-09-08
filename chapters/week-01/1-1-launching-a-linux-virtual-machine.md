---
layout: default
title: "1.1 - Launching a Linux Virtual Machine"
---

# 1.1 - Launching a Linux Virtual Machine



# VirtualBox, WSL, Replit, CoCalc & Termux

These are different ways to get a **Linux/Unix-like environment** for learning programming, Linux commands, data science, development, and experimentation.

## 1. VirtualBox

**VirtualBox** is virtualization software that allows you to run another operating system inside your existing operating system.

```text
Your Computer
│
├── Host OS
│
└── VirtualBox
    │
    └── Guest OS
```

- **Host OS** — the operating system running directly on your computer.
- **Guest OS** — the operating system running inside VirtualBox.

### Why use VirtualBox?

VirtualBox is useful when you want a **complete isolated operating system**.

You can run:

- Ubuntu
- Debian
- Fedora
- Kali Linux
- Windows
- Other supported operating systems

Inside the VM, you can experiment with commands such as:

```bash
sudo apt update
sudo apt install nginx
```

The changes are generally isolated from your main operating system.

### Advantages

- Strong isolation
- Complete operating system
- Useful for Linux experimentation
- Can run different operating systems
- Useful for networking and system-administration labs
- Supports snapshots

### Disadvantages

Virtual machines consume significant:

- RAM
- CPU
- Disk space

Therefore, a VM can make a low-resource computer slower.

---

# 2. WSL

**WSL** stands for **Windows Subsystem for Linux**.

It allows you to run Linux environments inside Windows.

```text
Windows
│
└── WSL
    │
    └── Linux
        ├── Bash
        ├── Ubuntu
        ├── apt
        ├── grep
        ├── sed
        ├── awk
        └── etc.
```

### Why use WSL?

WSL is useful when you want:

```text
Windows desktop
+
Linux development environment
```

You can use Linux commands such as:

```bash
ls
pwd
cd
grep
sed
awk
find
ssh
python
git
```

You can also install packages:

```bash
sudo apt update
sudo apt install nginx
```

## WSL 1 vs WSL 2

### WSL 1

WSL 1 translates Linux system calls so Linux programs can interact with Windows.

### WSL 2

WSL 2 uses a lightweight virtualized Linux kernel.

```text
Windows
   ↓
WSL 2
   ↓
Linux kernel
   ↓
Linux environment
```

WSL 2 generally provides better Linux compatibility.

### When to use WSL?

Use WSL when:

> You use Windows and want Linux development tools without maintaining a traditional virtual machine.

---

# 3. Replit

**Replit** is a cloud-based development environment.

Instead of configuring everything locally, you can write and run code through a browser.

```text
Browser
   ↓
Replit
   ↓
Cloud Environment
   ↓
Your Program
```

### Why use Replit?

Replit is useful for:

- Quick experimentation
- Learning programming
- Sharing projects
- Collaboration
- Prototyping
- Small web applications
- Running code without complicated local setup

For example, you can create a Python project and run:

```python
print("Hello World")
```

The code executes in the cloud environment.

### Basic workflow

```text
Open browser
      ↓
Create project
      ↓
Write code
      ↓
Run
      ↓
See output
```

---

# 4. CoCalc

**CoCalc** is a cloud-based computational environment designed especially for:

- Mathematics
- Scientific computing
- Programming
- Education
- Jupyter notebooks
- SageMath
- LaTeX
- R
- Python

Think of it as:

> **An online computational workspace.**

For example:

```python
import numpy as np

x = np.array([1, 2, 3, 4])

print(x.mean())
```

### CoCalc is particularly useful for

**Mathematics**

- Algebra
- Calculus
- Statistics
- Numerical computation
- Symbolic mathematics

**Data Science**

- Python
- NumPy
- Pandas
- Jupyter

**Education**

- Student projects
- Collaborative computational work
- Teaching and learning

---

# 5. Termux

**Termux** is an Android application that provides a Linux-like terminal environment.

```text
Android Phone
      ↓
    Termux
      ↓
  Terminal
      ↓
Linux utilities
```

You can use commands such as:

```bash
ls
cd
pwd
mkdir
cp
mv
grep
sed
awk
find
```

### Installing packages

Update the package repository:

```bash
pkg update
```

Install Python:

```bash
pkg install python
```

Run Python:

```bash
python
```

Install Git:

```bash
pkg install git
```

Then Git can be used normally:

```bash
git --version
```

### Why use Termux?

Termux is useful for:

- Linux command practice
- Bash scripting
- Python
- Git
- SSH
- Lightweight development
- Learning command-line tools
- Remote server administration

It essentially gives you a Linux-like command-line environment on an Android device.

---

# 6. Comparison

| Tool | Runs where? | Main idea | Best for |
|---|---|---|---|
| **VirtualBox** | Your computer | Full virtual machine | OS experimentation |
| **WSL** | Windows | Linux environment integrated with Windows | Linux development on Windows |
| **Replit** | Cloud | Browser-based coding | Quick coding and projects |
| **CoCalc** | Cloud | Computational workspace | Math, science, notebooks |
| **Termux** | Android | Linux-like terminal | Coding/Linux on phone |

---

# 7. Local vs Cloud

## Local Environments

The environment runs on your own device.

```text
VirtualBox
WSL
Termux
```

Your device's hardware performs the computation.

## Cloud Environments

The environment runs on remote infrastructure.

```text
Replit
CoCalc
```

Your browser connects to the remote environment.

---

# 8. VirtualBox vs WSL

## VirtualBox

You create a complete virtual machine:

```text
Physical Computer
│
├── Host OS
│
└── VirtualBox
     │
     └── Guest OS
          ├── Kernel
          ├── Packages
          ├── Users
          └── Applications
```

## WSL 2

Linux is integrated more closely with Windows:

```text
Physical Computer
│
└── Windows
     │
     └── WSL 2
          │
          └── Linux environment
```

### Simple rule

If you want:

> **A complete separate operating system**

use **VirtualBox**.

If you want:

> **Linux tools while primarily using Windows**

use **WSL**.

---

# 9. What Happens When You Run a Command?

Consider:

```bash
ls
```

### VirtualBox

```text
ls
 ↓
Guest Linux
 ↓
Virtual Machine
 ↓
Your Computer
```

### WSL

```text
ls
 ↓
Linux environment
 ↓
WSL
 ↓
Your Computer
```

### Termux

```text
ls
 ↓
Termux environment
 ↓
Android
 ↓
Phone hardware
```

### Replit

```text
ls
 ↓
Replit environment
 ↓
Cloud server
```

### CoCalc

```text
Code
 ↓
CoCalc project
 ↓
Cloud infrastructure
```

---

# 10. Quick Decision Guide

```text
I need a development environment
│
├── I want a complete separate OS
│       ↓
│    VirtualBox
│
├── I use Windows and want Linux tools
│       ↓
│    WSL
│
├── I want coding without local setup
│       ↓
│    Replit
│
├── I want math/scientific computation online
│       ↓
│    CoCalc
│
└── I want a terminal on Android
        ↓
     Termux
```

---

# 11. Key Takeaways

| Tool | Remember it as |
|---|---|
| **VirtualBox** | A computer inside your computer |
| **WSL** | Linux integrated into Windows |
| **Replit** | A coding environment in the cloud |
| **CoCalc** | A cloud computational workspace |
| **Termux** | A Linux-like terminal on Android |

The important distinction is:

```text
VirtualBox → Virtual machine
WSL        → Windows + Linux environment
Replit     → Cloud coding environment
CoCalc     → Cloud computational environment
Termux     → Android terminal/Linux-like environment
```
