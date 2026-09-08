---
layout: default
title: "1.2 - Command line environment"
---

# 1.2 - Command line environment

# Linux Fundamentals — Basic Commands, Command Anatomy, File System, and Paths

## 1. Overview

Before learning advanced Linux commands, you need to understand a few fundamental commands and concepts.

In this lesson we will learn:

- `pwd`
- `ls`
- `ps`
- `uname`
- `clear`
- `Ctrl-L`
- `exit`
- `Ctrl-D`
- Anatomy of a Linux command
- `ls -a`
- `ls -l`
- Linux file system
- Paths

The goal is not just to memorize commands, but to understand **where you are, what files exist, what processes are running, what your system is, and how Linux represents locations using paths**.

---

# 2. `pwd`

## 2.1 What is `pwd`?

`pwd` stands for:

> **Print Working Directory**

It tells you the directory in which your shell is currently located.

```bash
pwd
```

Example output:

```text
/home/shubham
```

Your output will depend on your system.

---

## 2.2 Why does `pwd` exist?

A terminal does not always visually show your complete current location.

For example, you might be somewhere deep inside a project:

```text
/home/shubham/projects/linux/exam/scripts
```

Instead of guessing where you are, use:

```bash
pwd
```

---

## 2.3 Mental Model

Think of the terminal as a person standing somewhere inside a huge building.

`pwd` asks:

> "Where am I standing right now?"

```text
Computer
└── home
    └── shubham
        └── projects
            └── linux
                └── scripts   ← You are here

pwd
 ↓
/home/shubham/projects/linux/scripts
```

---

## 2.4 Basic Example

```bash
pwd
```

Possible output:

```text
/home/shubham
```

Now move somewhere else:

```bash
cd /tmp
```

Then:

```bash
pwd
```

Output:

```text
/tmp
```

The value changes because your current working directory changed.

---

## 2.5 Important Rule

`pwd` does not list files.

It tells you **where you currently are**.

Compare:

```bash
pwd
```

```text
Where am I?
```

and:

```bash
ls
```

```text
What is here?
```

This distinction is fundamental.

---

# 3. `ls`

## 3.1 What is `ls`?

`ls` stands for **list**.

It displays files and directories.

Basic syntax:

```bash
ls
```

Example:

```text
Documents
Downloads
Music
Pictures
Projects
```

---

## 3.2 Why is `ls` useful?

After navigating into a directory, you usually want to know what is inside it.

For example:

```bash
cd ~/Documents
ls
```

Possible output:

```text
assignment.pdf
notes.txt
project
```

Mental model:

```text
pwd
 ↓
Where am I?

ls
 ↓
What is here?
```

---

# 4. `ls` Basic Examples

## Example 1

```bash
ls
```

Lists the contents of the current directory.

---

## Example 2 — List Another Directory

You don't have to move into a directory first.

```bash
ls /tmp
```

This lists the contents of `/tmp`.

---

## Example 3 — Multiple Directories

```bash
ls /tmp /var
```

This asks `ls` to list both locations.

---

# 5. `ls -a`

## 5.1 What does `-a` mean?

`-a` means:

> **all**

It tells `ls` to include hidden files.

```bash
ls -a
```

Possible output:

```text
.
..
.bashrc
.profile
Documents
Downloads
notes.txt
```

---

## 5.2 Hidden Files in Linux

Linux commonly treats filenames beginning with `.` as hidden.

For example:

```text
.bashrc
.profile
.git
.config
```

These are not normally displayed by:

```bash
ls
```

But they appear with:

```bash
ls -a
```

---

## 5.3 Why Are Hidden Files Useful?

Hidden files are often used for:

- Configuration
- User preferences
- Shell configuration
- Application settings
- Git metadata

For example:

```text
.bashrc
```

contains Bash configuration for many Linux users.

A Git repository commonly contains:

```text
.git
```

which stores repository metadata.

---

# 6. `.` and `..`

When you run:

```bash
ls -a
```

you commonly see:

```text
.
..
```

These are special directory entries.

### `.`

Represents the **current directory**.

```text
.
↓
Where I am now
```

### `..`

Represents the **parent directory**.

```text
..
↓
One directory above the current directory
```

---

## Example

Suppose:

```text
/home/shubham/projects
```

is your current directory.

Then:

```text
.
```

means:

```text
/home/shubham/projects
```

while:

```text
..
```

means:

```text
/home/shubham
```

---

# 7. `ls -l`

## 7.1 What does `-l` mean?

`-l` means:

> **long listing format**

Run:

```bash
ls -l
```

Possible output:

```text
total 12
-rw-r--r-- 1 shubham shubham  120 Sep  8 10:30 notes.txt
drwxr-xr-x 2 shubham shubham 4096 Sep  8 10:25 projects
```

---

# 8. Understanding `ls -l`

A typical line looks like:

```text
-rw-r--r-- 1 shubham shubham 120 Sep 8 10:30 notes.txt
```

Break it down:

```text
-rw-r--r--  1  shubham  shubham  120  Sep 8 10:30  notes.txt
│            │     │        │      │        │             │
│            │     │        │      │        │             └── Name
│            │     │        │      │        └── Date/time
│            │     │        │      └── Size
│            │     │        └── Group
│            │     └── Owner
│            └── Link count
└── File type + permissions
```

The exact columns can vary somewhat depending on the Linux implementation and options.

---

# 9. File Type in `ls -l`

The first character usually identifies the type.

Common examples:

```text
-    Regular file
d    Directory
l    Symbolic link
```

For example:

```text
-rw-r--r-- notes.txt
```

The first character:

```text
-
```

means it is a regular file.

For:

```text
drwxr-xr-x projects
```

the first character:

```text
d
```

means it is a directory.

---

# 10. Permissions Preview

Consider:

```text
-rwxr-xr--
```

The first character:

```text
-
```

indicates a regular file.

The remaining nine characters are permissions:

```text
rwx r-x r--
│   │   │
│   │   └── Others
│   └────── Group
└────────── Owner
```

The permissions are:

```text
r = read
w = write
x = execute
```

Detailed permissions are a larger Linux topic, but you should recognize this structure when using `ls -l`.

---

# 11. Combining Options

You can combine `ls` options.

For example:

```bash
ls -la
```

means:

```text
-l → long format
-a → include hidden files
```

Therefore:

```bash
ls -la
```

shows hidden files in long format.

You may also encounter:

```bash
ls -al
```

For these two options, the result is generally equivalent.

---

# 12. `ps`

## 12.1 What is `ps`?

`ps` stands for:

> **Process Status**

It displays information about running processes.

A **process** is a running instance of a program.

For example:

```text
bash
firefox
python
terminal
```

can all correspond to processes while they are running.

---

## 12.2 Basic Command

```bash
ps
```

Possible output:

```text
    PID TTY          TIME CMD
   4210 pts/0    00:00:00 bash
   5120 pts/0    00:00:00 ps
```

The exact output depends on your system.

---

## 12.3 Important Columns

| Column | Meaning |
|---|---|
| PID | Process ID |
| TTY | Terminal associated with the process |
| TIME | CPU time used |
| CMD | Command/process name |

The **PID** is particularly important.

PID means:

> **Process ID**

It identifies a process.

---

# 13. Why `ps` Is Useful

You use `ps` to investigate processes.

For example:

```bash
ps
```

can help answer:

> "What processes are currently associated with my terminal?"

Later, options such as:

```bash
ps -e
ps -f
ps -ef
ps --forest
```

allow you to inspect processes in greater detail.

---

# 14. `uname`

## 14.1 What is `uname`?

`uname` provides information about the operating system/kernel.

Run:

```bash
uname
```

Typical output:

```text
Linux
```

---

## 14.2 Why is `uname` useful?

It can help identify characteristics of the operating-system environment.

For example:

```bash
uname
```

usually tells you the kernel name.

You can also use:

```bash
uname -a
```

to request more information.

Example:

```text
Linux hostname 6.x.x-generic #... x86_64 GNU/Linux
```

The exact output depends on your system.

---

## 14.3 Important Distinction

Do not confuse:

```bash
uname
```

with:

```bash
hostname
```

`uname` primarily reports kernel/system information.

`hostname` reports the system's configured host name.

---

# 15. `clear`

## 15.1 What does `clear` do?

```bash
clear
```

clears the visible terminal screen.

It does not normally delete your files or commands.

It simply refreshes the terminal display.

---

## 15.2 Example

Suppose your terminal contains:

```text
$ pwd
/home/shubham

$ ls
Documents
Downloads

$ date
Mon Sep 8 ...
```

Running:

```bash
clear
```

makes the terminal appear clean.

---

# 16. `Ctrl-L`

You can also commonly clear/redraw the terminal display using:

```text
Ctrl + L
```

In an interactive Bash terminal, `Ctrl-L` is normally bound to the readline command that clears/redraws the screen.

Therefore:

```text
clear
```

and:

```text
Ctrl-L
```

are commonly used for the same practical purpose.

---

# 17. `clear` vs `Ctrl-L`

| Method | Purpose |
|---|---|
| `clear` | Command to clear/redraw terminal display |
| `Ctrl-L` | Keyboard shortcut to clear/redraw the terminal |

Neither is a replacement for deleting files or cleaning the filesystem.

---

# 18. `exit`

## 18.1 What does `exit` do?

```bash
exit
```

terminates the current shell/session.

For example, if you opened a Bash shell inside another shell:

```text
Parent shell
    │
    └── Child shell
```

running:

```bash
exit
```

ends the child shell and returns to the parent shell.

If it is your terminal's main shell, it may close the terminal session.

---

# 19. `Ctrl-D`

`Ctrl-D` is another important terminal shortcut.

At an interactive shell prompt, `Ctrl-D` commonly signals **EOF (end-of-file)** on standard input.

If the shell is waiting for input and receives EOF, it may exit.

Therefore:

```text
exit
```

and:

```text
Ctrl-D
```

can commonly be used to leave an interactive shell.

---

# 20. Important Difference: `Ctrl-D` Is Not Literally "Exit"

Do not think of `Ctrl-D` as simply another spelling of `exit`.

More accurately:

```text
Ctrl-D
 ↓
EOF / end-of-input indication
 ↓
Shell may exit when appropriate
```

For example, `Ctrl-D` can have different effects depending on what program is currently reading input.

---

# 21. Anatomy of a Linux Command

Understanding command anatomy is more important than memorizing individual commands.

Consider:

```bash
ls -l /home/shubham
```

Break it into:

```text
ls       -l          /home/shubham
│        │                 │
│        │                 └── Argument
│        └──────────────────── Option
└───────────────────────────── Command
```

---

# 22. Command

The first word is usually the command/program being invoked.

Example:

```bash
ls
```

Here:

```text
ls
```

is the command.

Other examples:

```bash
pwd
date
ps
uname
```

---

# 23. Options

Options modify the behavior of a command.

For example:

```bash
ls -a
```

Here:

```text
-a
```

is an option.

Another:

```bash
ls -l
```

Here:

```text
-l
```

requests long-format output.

---

# 24. Arguments

An **argument** provides data to the command.

Example:

```bash
ls /home
```

Here:

```text
ls
```

is the command.

```text
/home
```

is an argument specifying what location to list.

Another example:

```bash
cat notes.txt
```

Here:

```text
cat
```

is the command.

```text
notes.txt
```

is an argument.

---

# 25. Options vs Arguments

Compare:

```bash
ls -l /home
```

```text
ls
│
├── -l       → option
│
└── /home    → argument
```

The option changes **how** `ls` behaves.

The argument tells it **what** to operate on.

---

# 26. Short Options

Short options often use a single hyphen.

Examples:

```bash
ls -a
ls -l
ps -e
ps -f
```

Some commands allow multiple short options to be combined:

```bash
ls -la
```

which represents:

```text
-l
-a
```

---

# 27. Long Options

Many Linux commands also provide long-form options.

These commonly use two hyphens:

```bash
command --option
```

For example:

```bash
ps --forest
```

Here:

```text
--forest
```

is a long option.

Short and long options depend on the individual command; not every command supports every style.

---

# 28. General Command Anatomy

A useful general model is:

```text
command [options] [arguments]
```

Example:

```bash
ls -l /home
```

```text
command   option   argument
   │        │          │
   ▼        ▼          ▼
  ls       -l        /home
```

However, this is a **general model**, not an absolute grammar for every Unix command.

Some commands have different syntax.

---

# 29. Shell vs Command

This is an important distinction.

When you type:

```bash
ls -l
```

the shell first parses the command line.

Then it performs relevant expansions and command lookup.

Then the selected command executes.

Conceptually:

```text
You type:
ls -l
   ↓
Shell parses command
   ↓
Shell identifies command
   ↓
Shell finds executable
   ↓
Shell starts/executes it
   ↓
ls processes -l
   ↓
Output
```

---

# 30. Linux File System

Linux uses a hierarchical file system.

It can be visualized as a tree:

```text
/
├── bin
├── boot
├── dev
├── etc
├── home
│   ├── alice
│   └── shubham
├── lib
├── media
├── mnt
├── opt
├── proc
├── root
├── run
├── sbin
├── srv
├── sys
├── tmp
├── usr
└── var
```

The exact contents vary between Linux distributions and installations.

---

# 31. Root of the File System

The top of the Linux filesystem hierarchy is:

```text
/
```

This is called the **root directory**.

Do not confuse:

```text
/
```

with:

```text
/root
```

They are different.

```text
/
↓
Root of the entire filesystem

/root
↓
Home directory of the root user
```

---

# 32. Important Linux Directories

You should recognize some common directories.

| Directory | Typical purpose |
|---|---|
| `/` | Root of filesystem |
| `/home` | Home directories of regular users |
| `/root` | Home directory of root user |
| `/etc` | System/application configuration |
| `/tmp` | Temporary files |
| `/usr` | Many user-space programs, libraries, and shared data |
| `/var` | Variable data such as logs and caches |
| `/dev` | Device files |
| `/proc` | Process/kernel information interface |
| `/sys` | Kernel/device information interface |
| `/bin` | Essential user commands on systems where this directory is distinct |
| `/sbin` | System administration commands on systems where this directory is distinct |

Modern distributions may merge directories such as `/bin` into `/usr/bin`, so the exact physical layout can vary.

---

# 33. `/home`

Regular users commonly have directories inside:

```text
/home
```

For example:

```text
/home/shubham
/home/alice
/home/bob
```

If your username is `shubham`, your home directory may be:

```text
/home/shubham
```

This is commonly represented by:

```bash
echo "$HOME"
```

---

# 34. `/etc`

`/etc` contains system-wide configuration files.

Examples may include:

```text
/etc/hosts
/etc/passwd
/etc/ssh/
/etc/systemd/
```

You will encounter `/etc` frequently when learning Linux administration.

---

# 35. `/tmp`

`/tmp` is commonly used for temporary files.

Example:

```bash
cd /tmp
pwd
```

Output:

```text
/tmp
```

You can inspect it with:

```bash
ls /tmp
```

Files in `/tmp` may be removed automatically depending on the operating system's configuration.

Do not assume every file in `/tmp` can safely be deleted manually.

---

# 36. `/var`

`/var` stores data that changes during system operation.

Examples include:

```text
/var/log
/var/cache
/var/lib
```

For example:

```bash
ls /var/log
```

may show system and application log files.

---

# 37. `/usr`

`/usr` contains a large amount of user-space software, libraries, documentation, and other shared data.

Common directories include:

```text
/usr/bin
/usr/sbin
/usr/lib
/usr/share
```

For example:

```bash
/usr/bin/date
```

may be the full path of the `date` executable on a typical Linux system.

---

# 38. `/dev`

`/dev` contains device-related filesystem entries.

For example:

```text
/dev/null
/dev/zero
/dev/random
```

Linux represents many devices and special interfaces through files under `/dev`.

A complete treatment of device files is an advanced topic, but remember:

```text
/dev
 ↓
Device and special file interfaces
```

---

# 39. `/proc`

`/proc` is a virtual filesystem that exposes process and kernel-related information.

For example:

```bash
ls /proc
```

You may see directories with numeric names:

```text
1
2
...
4210
...
```

These can correspond to process IDs.

For example:

```text
/proc/4210
```

can contain information associated with PID `4210`.

---

# 40. `/sys`

`/sys` is another virtual filesystem that exposes information and controls related to the kernel and devices.

For basic Linux learning:

```text
/proc → process/kernel information
/sys  → kernel/device/system information
```

This distinction is useful to remember.

---

# 41. Paths

A **path** specifies the location of a file or directory in the filesystem.

For example:

```text
/home/shubham/notes.txt
```

is a path.

Think of it as an address.

```text
House address
       ↓
Location of something

Filesystem path
       ↓
Location of a file/directory
```

---

# 42. Absolute Path

An **absolute path** starts from the root directory:

```text
/
```

Example:

```text
/home/shubham/notes.txt
```

This gives the complete location from the filesystem root.

---

# 43. Absolute Path Mental Model

Suppose the filesystem is:

```text
/
└── home
    └── shubham
        └── projects
            └── linux
                └── notes.txt
```

The absolute path of `notes.txt` is:

```text
/home/shubham/projects/linux/notes.txt
```

It starts at:

```text
/
```

and describes the complete route.

---

# 44. Relative Path

A **relative path** is interpreted relative to the current working directory.

Suppose:

```bash
pwd
```

outputs:

```text
/home/shubham/projects
```

and the directory contains:

```text
/home/shubham/projects/linux
```

You can refer to it using:

```text
linux
```

instead of:

```text
/home/shubham/projects/linux
```

because `linux` is interpreted relative to the current directory.

---

# 45. Absolute vs Relative Path

| Type | Starts from | Example |
|---|---|---|
| Absolute | `/` | `/home/shubham/file.txt` |
| Relative | Current directory | `file.txt` |
| Relative | Current directory | `projects/file.txt` |
| Relative | Parent directory | `../file.txt` |

Mental model:

```text
Absolute path
↓
Start from /
↓
Follow complete route

Relative path
↓
Start from where I currently am
↓
Follow route from there
```

---

# 46. `.` in Paths

`.` means:

> Current directory

Suppose:

```bash
pwd
```

returns:

```text
/home/shubham/projects
```

Then:

```text
.
```

refers to:

```text
/home/shubham/projects
```

Example:

```bash
ls .
```

is effectively asking:

> List the current directory.

---

# 47. `..` in Paths

`..` means:

> Parent directory

Suppose:

```text
/home/shubham/projects/linux
```

is the current directory.

Then:

```text
..
```

refers to:

```text
/home/shubham/projects
```

You can verify:

```bash
pwd
cd ..
pwd
```

Example:

```text
/home/shubham/projects/linux
/home/shubham/projects
```

---

# 48. Multiple `..`

You can go up multiple levels.

For example:

```text
../../
```

means:

```text
parent
  ↓
parent again
```

Suppose you are here:

```text
/home/shubham/projects/linux/scripts
```

Then:

```text
..
```

means:

```text
/home/shubham/projects/linux
```

while:

```text
../..
```

means:

```text
/home/shubham/projects
```

---

# 49. `~` — Home Directory Shortcut

The shell commonly uses:

```text
~
```

to represent the current user's home directory.

If:

```text
$HOME=/home/shubham
```

then:

```text
~
```

can represent:

```text
/home/shubham
```

For example:

```bash
cd ~
```

takes you to your home directory.

You can also use:

```bash
ls ~/Documents
```

to refer to the `Documents` directory inside your home directory.

---

# 50. Important Difference: `/` vs `~`

These are not the same.

```text
/
```

means:

> Filesystem root.

```text
~
```

means:

> Current user's home directory.

For example:

```text
/
└── home
    └── shubham
```

Here:

```text
/          → filesystem root
/home      → home directory container
/home/shubham → user's home
~          → /home/shubham
```

---

# 51. Path Examples

Suppose:

```bash
pwd
```

outputs:

```text
/home/shubham/projects/linux
```

Then:

```text
.
```

means:

```text
/home/shubham/projects/linux
```

```text
..
```

means:

```text
/home/shubham/projects
```

```text
../..
```

means:

```text
/home/shubham
```

```text
notes.txt
```

means:

```text
/home/shubham/projects/linux/notes.txt
```

```text
/tmp
```

is an absolute path.

```text
~/Documents
```

means the `Documents` directory under the current user's home directory.

---

# 52. Path Separator

Linux uses:

```text
/
```

as the directory separator.

Example:

```text
/home/shubham/projects/file.txt
```

Breakdown:

```text
/
└── home
    └── shubham
        └── projects
            └── file.txt
```

Each `/` separates one filesystem component from another.

---

# 53. Common Path Mistake

Do not confuse:

```text
/home/shubham
```

with:

```text
home/shubham
```

The first is absolute because it starts with `/`.

The second is relative.

```text
/home/shubham
 ↑
starts at root
```

while:

```text
home/shubham
 ↑
starts relative to current directory
```

---

# 54. Using `pwd`, `ls`, and Paths Together

These three concepts work together constantly.

Suppose:

```bash
pwd
```

outputs:

```text
/home/shubham/projects
```

Then:

```bash
ls
```

might show:

```text
linux
python
web
```

You can inspect the Linux directory without entering it:

```bash
ls linux
```

or:

```bash
ls ./linux
```

or using an absolute path:

```bash
ls /home/shubham/projects/linux
```

All three can refer to the same directory from this starting location.

---

# 55. Practical Navigation Mental Model

Imagine:

```text
/
└── home
    └── shubham
        └── projects
            ├── linux
            ├── python
            └── web
```

If you are in:

```text
/home/shubham/projects
```

then:

```bash
pwd
```

answers:

```text
Where am I?
```

```bash
ls
```

answers:

```text
What is here?
```

```bash
ls linux
```

answers:

```text
What is inside linux?
```

```bash
ls ..
```

answers:

```text
What is inside my parent directory?
```

---

# 56. Real-World Workflow

A typical terminal workflow might look like:

```bash
pwd
```

Output:

```text
/home/shubham
```

Then:

```bash
ls
```

Output:

```text
Documents
Downloads
projects
```

Enter a directory:

```bash
cd projects
```

Check location:

```bash
pwd
```

Output:

```text
/home/shubham/projects
```

List everything, including hidden files:

```bash
ls -a
```

Get detailed information:

```bash
ls -l
```

Or combine them:

```bash
ls -la
```

This is a basic but extremely important Linux workflow.

---

# 57. Command Anatomy — Complete Example

Consider:

```bash
ls -la /home/shubham
```

Break it down:

```text
ls
│
└── command

-la
│
├── -l → long listing
└── -a → include hidden files

/home/shubham
│
└── argument/path
```

The shell processes the command line and invokes `ls` with the appropriate arguments/options.

---

# 58. Another Command Anatomy Example

Consider:

```bash
ps -ef
```

Breakdown:

```text
ps
│
└── command

-e
│
└── option → select all processes

-f
│
└── option → full-format listing
```

So:

```text
ps -ef
```

means approximately:

> Run `ps`, select all processes, and display them in full format.

---

# 59. Another Example

Consider:

```bash
ls -a /tmp
```

Breakdown:

```text
ls
│
└── command

-a
│
└── option → include hidden entries

/tmp
│
└── argument → directory to list
```

Notice that `ls` does not necessarily operate only on the current directory.

The path tells it what location to inspect.

---

# 60. Common Mistakes

## Mistake 1 — Thinking `pwd` Lists Files

Incorrect mental model:

```text
pwd → show files
```

Correct:

```text
pwd → show current directory
```

---

## Mistake 2 — Thinking `ls` Changes Directory

```bash
ls
```

does not move you anywhere.

It only lists directory contents.

To change directories, you use:

```bash
cd
```

---

## Mistake 3 — Confusing `/` and `~`

```text
/  → filesystem root
~  → current user's home
```

---

## Mistake 4 — Forgetting Hidden Files

If:

```bash
ls
```

doesn't show a file beginning with `.`:

```text
.config
.git
.bashrc
```

try:

```bash
ls -a
```

---

## Mistake 5 — Thinking `-a` Means "All Files Including `.` Automatically"

`ls -a` includes hidden entries, including the special:

```text
.
..
```

entries.

---

## Mistake 6 — Confusing Absolute and Relative Paths

```text
/home/shubham/file.txt
```

is absolute.

```text
file.txt
```

is relative to the current directory.

---

# 61. Exam Perspective

These topics are basic, but they are frequently used as foundations for harder Linux questions.

## Important Things to Memorize

```text
pwd
→ Print Working Directory

ls
→ List directory contents

ls -a
→ Include hidden entries

ls -l
→ Long listing

ps
→ Process status

uname
→ Kernel/system information

clear
→ Clear/redraw terminal

Ctrl-L
→ Clear/redraw terminal display

exit
→ Exit current shell

Ctrl-D
→ Send EOF; often exits an interactive shell

/
→ Filesystem root

~
→ Current user's home directory

.
→ Current directory

..
→ Parent directory
```

---

# 62. Exam Traps

### Trap 1

What does:

```bash
pwd
```

do?

Answer:

> Prints the current working directory.

Not the username and not the contents of the directory.

---

### Trap 2

What does:

```bash
ls -a
```

do?

Answer:

> Includes hidden directory entries/files in the listing.

---

### Trap 3

What does:

```bash
ls -l
```

do?

Answer:

> Displays a long-format listing containing information such as permissions, ownership, size, timestamps, and names.

---

### Trap 4

What does:

```text
/
```

mean?

Answer:

> Root of the filesystem.

Not the root user's home directory.

---

### Trap 5

What does:

```text
..
```

mean?

Answer:

> Parent directory.

---

### Trap 6

What does:

```text
.
```

mean?

Answer:

> Current directory.

---

### Trap 7

What does:

```text
~
```

usually mean in the shell?

Answer:

> Current user's home directory through tilde expansion.

---

# 63. Practice Questions — Level 1

## Q1

What does `pwd` stand for?

---

## Q2

What does `pwd` display?

---

## Q3

What is the purpose of `ls`?

---

## Q4

What does:

```bash
ls -a
```

do?

---

## Q5

What does:

```bash
ls -l
```

do?

---

## Q6

What is a hidden file in Linux?

---

## Q7

What does `ps` display?

---

## Q8

What does `uname` generally report?

---

## Q9

What does `clear` do?

---

## Q10

What is the purpose of `Ctrl-L` in an interactive terminal?

---

## Q11

What does `exit` do?

---

## Q12

What does `Ctrl-D` commonly signal to an interactive shell?

---

# 64. Practice Questions — Level 2

## Q13

Suppose:

```bash
pwd
```

returns:

```text
/home/student/projects
```

What does:

```text
.
```

represent?

---

## Q14

From:

```text
/home/student/projects
```

what does:

```text
..
```

represent?

---

## Q15

If your current directory is:

```text
/home/student/projects/linux
```

what directory does:

```text
../..
```

represent?

---

## Q16

Explain the difference between:

```text
/home/student/file.txt
```

and:

```text
file.txt
```

---

## Q17

What is the difference between:

```text
/
```

and:

```text
/root
```

---

## Q18

What does the following command mean?

```bash
ls -la /tmp
```

---

## Q19

Break down:

```bash
ps -ef
```

into its command and options.

---

## Q20

Identify the command, option, and argument:

```bash
ls -l /home
```

---

# 65. Practice Questions — Level 3

## Q21 — Path Reasoning

Suppose:

```bash
pwd
```

outputs:

```text
/home/student/projects/linux/scripts
```

Determine the location represented by each:

```text
.
..
../..
../../notes.txt
```

---

## Q22 — Command Anatomy

Break down:

```bash
ls -la /home/student
```

into:

```text
Command:
Options:
Argument:
```

---

## Q23 — Output Prediction

Suppose a directory contains:

```text
notes.txt
script.sh
.config
.git
```

What might:

```bash
ls
```

show?

What might:

```bash
ls -a
```

show?

---

## Q24 — Conceptual

Explain why:

```bash
ls
```

and:

```bash
pwd
```

answer different questions.

---

## Q25 — Filesystem

Explain the relationship between:

```text
/
├── home
│   └── student
└── etc
```

What is:

```text
/home/student
```

relative to `/`?

---

# 66. Practice Questions — Exam Challenge

## Q26

Assume the current directory is:

```text
/home/student/projects/linux
```

and it contains:

```text
notes.txt
script.sh
.config
```

The parent directory contains:

```text
python
web
```

Predict what each command attempts to list:

```bash
ls
ls -a
ls ..
ls .
ls ../python
ls /home/student/projects/linux
```

---

## Q27

Explain the complete execution model for:

```bash
ls -la /tmp
```

starting from the moment you press Enter.

Your answer should include:

```text
shell
↓
command
↓
options
↓
argument
↓
program execution
↓
output
```

---

## Q28

A student says:

> "`/home/student` and `home/student` mean the same thing."

Is this always true?

Explain.

---

## Q29

A student runs:

```bash
cd /tmp
pwd
```

What should `pwd` normally print?

---

## Q30

A student wants to:

1. Know where they are.
2. See all files including hidden files.
3. See detailed file information.
4. See running processes.
5. Identify the Linux kernel name.

Which commands should they use?

---

# 67. Answers

## Answer 1

`pwd` stands for:

> Print Working Directory.

---

## Answer 2

It prints the current working directory.

---

## Answer 3

`ls` lists directory contents.

---

## Answer 4

```bash
ls -a
```

includes hidden entries in the listing.

---

## Answer 5

```bash
ls -l
```

uses long listing format.

---

## Answer 6

A filename beginning with `.` is commonly treated as hidden by normal directory listings.

Examples:

```text
.bashrc
.config
.git
```

---

## Answer 7

`ps` displays process information.

---

## Answer 8

`uname` generally reports information about the operating-system kernel/system.

```bash
uname
```

commonly outputs:

```text
Linux
```

---

## Answer 9

`clear` clears/redraws the visible terminal display.

---

## Answer 10

`Ctrl-L` commonly clears/redraws the terminal display in an interactive shell.

---

## Answer 11

`exit` terminates the current shell.

---

## Answer 12

`Ctrl-D` commonly sends an EOF indication to a program reading standard input; at an interactive shell prompt, this can cause the shell to exit.

---

## Answer 13

`.` represents:

```text
/home/student/projects
```

---

## Answer 14

`..` represents:

```text
/home/student
```

---

## Answer 15

Starting at:

```text
/home/student/projects/linux
```

then:

```text
..
```

takes you to:

```text
/home/student/projects
```

and another:

```text
..
```

takes you to:

```text
/home/student
```

Therefore:

```text
../..
```

represents:

```text
/home/student
```

---

## Answer 16

```text
/home/student/file.txt
```

is an absolute path.

```text
file.txt
```

is a relative path interpreted from the current working directory.

---

## Answer 17

```text
/
```

is the root of the entire filesystem.

```text
/root
```

is a directory named `root` directly under the filesystem root and is commonly the home directory of the root user.

---

## Answer 18

```bash
ls -la /tmp
```

means approximately:

```text
ls
 ↓
list directory contents

-a
 ↓
include hidden entries

-l
 ↓
long format

/tmp
 ↓
directory to list
```

---

## Answer 19

```bash
ps -ef
```

contains:

```text
ps → command
-e → select all processes
-f → full-format listing
```

---

## Answer 20

For:

```bash
ls -l /home
```

```text
Command  → ls
Option   → -l
Argument → /home
```

---

## Answer 21

Current directory:

```text
/home/student/projects/linux/scripts
```

Therefore:

```text
. 
→ /home/student/projects/linux/scripts
```

```text
..
→ /home/student/projects/linux
```

```text
../..
→ /home/student/projects
```

```text
../../notes.txt
→ /home/student/projects/notes.txt
```

assuming that file exists.

---

## Answer 22

For:

```bash
ls -la /home/student
```

```text
Command:
ls

Options:
-l
-a

Argument:
/home/student
```

---

## Answer 23

Normal:

```bash
ls
```

might show:

```text
notes.txt
script.sh
```

because hidden entries beginning with `.` are normally omitted.

While:

```bash
ls -a
```

might show:

```text
.
..
.config
.git
notes.txt
script.sh
```

---

## Answer 24

They answer different questions:

```text
pwd
↓
Where am I?
```

while:

```text
ls
↓
What is in this location?
```

---

## Answer 25

The filesystem root is:

```text
/
```

and:

```text
/home/student
```

is a location underneath `/`.

It is an absolute path because it begins with `/`.

---

## Answer 26

Assuming the stated directory structure:

```bash
ls
```

lists normal visible entries in:

```text
/home/student/projects/linux
```

so:

```text
notes.txt
script.sh
```

may appear.

```bash
ls -a
```

also includes:

```text
.config
.
..
```

as applicable.

```bash
ls ..
```

lists the parent:

```text
/home/student/projects
```

so entries such as:

```text
python
web
linux
```

may appear.

```bash
ls .
```

lists the current directory.

```bash
ls ../python
```

lists the `python` directory relative to the current location.

```bash
ls /home/student/projects/linux
```

lists the same current directory using an absolute path.

---

## Answer 27

For:

```bash
ls -la /tmp
```

the conceptual flow is:

```text
You type command
      ↓
Press Enter
      ↓
Shell parses the command line
      ↓
Shell identifies `ls`
      ↓
`-l` and `-a` are passed as options
      ↓
`/tmp` is passed as the target argument
      ↓
`ls` executes
      ↓
`ls` reads the target directory
      ↓
Hidden entries are included
      ↓
Long-format information is displayed
      ↓
Output appears in the terminal
```

---

## Answer 28

They are not necessarily the same.

```text
/home/student
```

is absolute.

```text
home/student
```

is relative.

The second is interpreted from the current working directory.

---

## Answer 29

Normally:

```text
/tmp
```

---

## Answer 30

Use:

```bash
pwd
```

for the current directory.

```bash
ls -a
```

for all entries including hidden entries.

```bash
ls -l
```

for detailed information.

```bash
ps
```

for process information.

```bash
uname
```

for the kernel name.

---

# 68. Final Cheat Sheet

| Command | Meaning | Example |
|---|---|---|
| `pwd` | Print current working directory | `pwd` |
| `ls` | List directory contents | `ls` |
| `ls -a` | Include hidden entries | `ls -a` |
| `ls -l` | Long listing | `ls -l` |
| `ls -la` | Long listing + hidden entries | `ls -la` |
| `ps` | Process status | `ps` |
| `uname` | Kernel/system information | `uname` |
| `clear` | Clear/redraw terminal | `clear` |
| `Ctrl-L` | Clear/redraw terminal | `Ctrl-L` |
| `exit` | Exit current shell | `exit` |
| `Ctrl-D` | Send EOF; often exits shell at prompt | `Ctrl-D` |

---

# 69. Path Cheat Sheet

```text
/
→ Filesystem root

~
→ Current user's home directory

.
→ Current directory

..
→ Parent directory
```

### Absolute path

```text
/home/student/projects/file.txt
```

Starts from:

```text
/
```

### Relative path

```text
projects/file.txt
```

Starts from:

```text
current directory
```

### Current directory

```text
./file.txt
```

### Parent directory

```text
../file.txt
```

### Two levels upward

```text
../../file.txt
```

---

# 70. The Most Important Mental Model

When working in Linux, constantly think in terms of three questions:

```text
1. WHERE AM I?
        ↓
      pwd

2. WHAT IS HERE?
        ↓
       ls

3. WHAT IS RUNNING?
        ↓
       ps
```

Then understand how locations are represented:

```text
Filesystem
    │
    └── /
         │
         ├── home
         │    └── student
         │         └── projects
         │
         ├── etc
         ├── tmp
         ├── usr
         └── var
```

And remember:

```text
/       → filesystem root
~       → my home
.       → where I am
..      → one level above me
```

Finally, understand command anatomy:

```text
command       options       arguments
   │             │              │
   ▼             ▼              ▼
  ls            -la           /tmp
```

This foundation is essential because almost every later Linux topic builds on these concepts.
