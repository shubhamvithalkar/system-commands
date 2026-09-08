---
layout: default
title: "1.4 - Simple Commands in Linux - 2"
---

# 1.4 - Simple Commands in Linux - 2

# Linux System Commands — Files, Help, Links, Filesystems, and Processes

## 1. Multiple `/` in a Path

In Linux, multiple consecutive `/` characters in a path generally have the same effect as a single `/`.

For example:

```bash
cd /home/shubham
```

and:

```bash
cd //home//shubham
```

normally refer to the same location.

You can verify:

```bash
cd /home/shubham
pwd

cd //home//shubham
pwd
```

The resulting directory is normally the same.

### Important

Do not confuse:

```text
/
```

with:

```text
//
```

The root directory is:

```text
/
```

Although multiple slashes are generally treated equivalently in ordinary Linux paths, there are special pathname semantics in some contexts and standards, so **do not use multiple slashes as a style convention**.

Prefer:

```bash
/home/shubham/project/file.txt
```

instead of:

```bash
//home//shubham//project//file.txt
```

---

# 2. `ls -l dir` — List the Contents of a Directory

Suppose you have:

```text
project/
├── file1.txt
├── file2.txt
└── script.sh
```

Run:

```bash
ls -l project
```

This displays the **contents of `project`** in long format.

Example:

```text
-rw-r--r-- 1 shubham shubham 100 Sep 8 10:00 file1.txt
-rw-r--r-- 1 shubham shubham 200 Sep 8 10:01 file2.txt
-rwxr-xr-x 1 shubham shubham 500 Sep 8 10:02 script.sh
```

Notice that the directory itself is not what is being described.

The command means:

```text
ls       → list
-l       → long format
project  → target directory
```

---

# 3. `ls -ld` — List the Directory Itself

This is a very important distinction.

Compare:

```bash
ls -l project
```

with:

```bash
ls -ld project
```

### `ls -l project`

Shows the **contents** of `project`.

```text
file1.txt
file2.txt
script.sh
```

### `ls -ld project`

Shows information about the **directory itself**.

Example:

```text
drwxr-xr-x 3 shubham shubham 4096 Sep 8 10:00 project
```

### Mental Model

```text
ls -l directory
      ↓
"What is inside this directory?"

ls -ld directory
       ↓
"Tell me about this directory itself."
```

This is especially useful when inspecting directory permissions.

---

# 4. Multiple Options in One Hyphen

Many Unix/Linux commands allow short options to be combined.

For example:

```bash
ls -l -a
```

can usually be written as:

```bash
ls -la
```

or:

```bash
ls -al
```

Here:

```text
-l → long format
-a → include hidden files
```

Therefore:

```bash
ls -la
```

means:

> Show all files, including hidden files, in long format.

Another example:

```bash
ls -l -h
```

can be written:

```bash
ls -lh
```

### Important

Short-option combination is a feature of many commands, but **not every command or every option syntax behaves identically**. Always check the command's documentation when unsure.

---

# 5. Long Options

Linux commands often provide long-form options.

Short option:

```bash
ls -a
```

Long option:

```bash
ls --all
```

Both mean approximately:

> Include hidden entries.

Another example:

```bash
ls -h
```

and:

```bash
ls --human-readable
```

### Short vs Long

```text
-a
 ↓
short option

--all
 ↓
long option
```

Short options are convenient for frequent interactive use.

Long options are often easier to understand when reading commands.

---

# 6. `less` — View Files Page by Page

`less` is a terminal pager used to read large amounts of text without printing the entire file at once.

```bash
less filename
```

Example:

```bash
less /var/log/syslog
```

Instead of dumping the whole file onto the terminal, `less` opens an interactive viewer.

### Important Keys

Inside `less`:

```text
Space      → next page
b          → previous page
↑ / ↓      → move one line
g          → beginning
G          → end
/word      → search
n          → next search result
N          → previous search result
q          → quit
```

### Why is `less` useful?

Suppose a file contains:

```text
100,000 lines
```

Using:

```bash
cat hugefile.txt
```

could flood your terminal.

Instead:

```bash
less hugefile.txt
```

lets you navigate through it.

---

# 7. `cat` — Display File Contents

`cat` means **concatenate**, but it is commonly used to display text files.

```bash
cat file.txt
```

Example:

```bash
cat notes.txt
```

Output:

```text
Linux
Shell
AWK
Sed
Grep
```

### Concatenating files

You can also combine files:

```bash
cat file1.txt file2.txt
```

This prints the contents of both files.

You can redirect the result:

```bash
cat file1.txt file2.txt > combined.txt
```

Now `combined.txt` contains both files.

---

# 8. `more` — Another Pager

`more` is another command for viewing text one screen at a time.

```bash
more file.txt
```

Historically, `more` was designed primarily for forward navigation through text.

`less` provides more functionality and is commonly preferred.

---

# 9. "Less Is More"

This is a common Unix joke/reference:

> `less` is more.

It is based on the relationship between the commands:

```text
more
```

and:

```text
less
```

`less` was designed as a more capable pager than the older `more`.

A useful practical rule:

```bash
cat small_file.txt
```

for small files.

```bash
less large_file.txt
```

for large files.

---

# 10. `head` — Display the Beginning of a File

`head` displays the beginning of a file.

```bash
head file.txt
```

By default, it displays the first **10 lines**.

Example:

```bash
head employees.txt
```

---

# 11. `head -n 5`

To display exactly five lines:

```bash
head -n 5 file.txt
```

Meaning:

```text
head
 ↓
beginning

-n 5
 ↓
five lines
```

You can use any number:

```bash
head -n 20 file.txt
```

→ first 20 lines.

---

# 12. `tail` — Display the End of a File

`tail` displays the end of a file.

```bash
tail file.txt
```

By default, it displays the last **10 lines**.

Example:

```bash
tail application.log
```

This is particularly useful for logs.

---

# 13. `tail -n 5`

To display the last five lines:

```bash
tail -n 5 file.txt
```

Example:

```bash
tail -n 5 /var/log/syslog
```

This gives the final five lines of the file.

---

# 14. `head` vs `tail`

Remember:

```text
head → beginning
tail → end
```

Example:

```bash
head -n 5 file.txt
```

→ first 5 lines.

```bash
tail -n 5 file.txt
```

→ last 5 lines.

---

# 15. `wc` — Count Lines, Words, and Bytes

`wc` means **word count**.

Without options:

```bash
wc file.txt
```

Example:

```text
10 25 150 file.txt
```

These numbers represent:

```text
10  → lines
25  → words
150 → bytes
```

So the general output is:

```text
lines  words  bytes  filename
```

---

# 16. `wc -l` — Count Lines

The `-l` option counts lines.

```bash
wc -l file.txt
```

Example:

```text
100 file.txt
```

This means:

```text
file.txt contains 100 newline characters/lines as counted by wc.
```

### Useful in scripting

```bash
count=$(wc -l < file.txt)
echo "$count"
```

Using input redirection:

```bash
wc -l < file.txt
```

returns only the count:

```text
100
```

instead of:

```text
100 file.txt
```

---

# 17. `which`

`which` searches for an executable in the directories listed in `$PATH`.

Example:

```bash
which python
```

Possible output:

```text
/usr/bin/python
```

Another:

```bash
which ls
```

Possible output:

```text
/usr/bin/ls
```

### Important Modern Practice

For shell command resolution, especially in Bash, these are often more informative:

```bash
type ls
```

or:

```bash
command -v ls
```

Why?

Because `which` mainly focuses on executables in `$PATH`, while shell commands can also be:

```text
aliases
functions
builtins
keywords
external executables
```

---

# 18. `whatis`

`whatis` provides a short description of a command from the manual-page database.

Example:

```bash
whatis ls
```

Possible output:

```text
ls (1) - list directory contents
```

Another:

```bash
whatis chmod
```

This is useful when you only need a quick description rather than the complete manual.

---

# 19. `apropos`

`apropos` searches manual-page descriptions for a keyword.

Suppose you don't know the command name but want to find commands related to calendars.

```bash
apropos calendar
```

It searches descriptions and displays matching manual pages.

### Mental Model

```text
whatis command
     ↓
"What does this command do?"

apropos keyword
     ↓
"Which commands are related to this topic?"
```

---

# 20. `man -k`

`man -k` performs a keyword search through manual-page descriptions.

For example:

```bash
man -k calendar
```

This is essentially the manual-page keyword search functionality associated with `apropos`.

You can think of:

```bash
apropos calendar
```

as:

```bash
man -k calendar
```

---

# 21. `help`

`help` is a Bash builtin that provides help for Bash builtins.

Example:

```bash
help cd
```

Example:

```bash
help echo
```

You can also search Bash help:

```bash
help
```

This lists available Bash builtins and help topics.

### Important

`help` is especially useful for shell builtins such as:

```bash
cd
echo
read
export
set
unset
alias
type
```

---

# 22. `man`

The `man` command displays manual pages.

Example:

```bash
man ls
```

You enter an interactive manual viewer.

Search inside the manual:

```text
/keyword
```

Move through results:

```text
n
```

Quit:

```text
q
```

### Example

```bash
man chmod
```

This provides detailed documentation for `chmod`.

---

# 23. `info`

`info` is another documentation system used on many GNU/Linux systems.

Example:

```bash
info coreutils
```

or:

```bash
info ls
```

GNU Info documentation can contain more structured, interconnected documentation than traditional man pages.

### General distinction

```text
man
 ↓
Manual pages

info
 ↓
GNU Info documentation
```

Both are useful documentation systems.

---

# 24. `type`

`type` tells you how the shell interprets a command.

Example:

```bash
type cd
```

Possible output:

```text
cd is a shell builtin
```

Try:

```bash
type ls
```

You may get:

```text
ls is aliased to `ls --color=auto'
```

if an alias exists.

Or it may report the executable location.

### Why `type` is powerful

A command name does not necessarily mean an external executable.

It might be:

```text
alias
function
builtin
keyword
external command
```

`type` helps identify which one you are dealing with.

---

# 25. `file`

The `file` command attempts to identify the type of a file.

```bash
file filename
```

Example:

```bash
file notes.txt
```

Possible output:

```text
notes.txt: ASCII text
```

For an image:

```bash
file photo.jpg
```

Possible output:

```text
photo.jpg: JPEG image data
```

For a script:

```bash
file script.sh
```

Possible output:

```text
script.sh: Bourne-Again shell script, ASCII text executable
```

The exact output depends on the file and installed `file` database.

---

# 26. `alias`

An alias creates a shortcut for a command.

```bash
alias ll='ls -l'
```

Now:

```bash
ll
```

runs:

```bash
ls -l
```

### Display aliases

```bash
alias
```

### Check one alias

```bash
alias ll
```

### Important

Aliases are normally shell-specific and commonly exist only for the current shell unless placed in a shell startup file such as:

```bash
~/.bashrc
```

---

# 27. `unalias`

`unalias` removes an alias.

Example:

```bash
alias ll='ls -l'
```

Remove it:

```bash
unalias ll
```

Now:

```bash
ll
```

will no longer be expanded as that alias.

### Remove all aliases

```bash
unalias -a
```

Use this carefully because it removes all aliases in the current shell.

---

# 28. `touch`

`touch` is commonly used to create an empty file.

```bash
touch file.txt
```

If `file.txt` does not exist:

```text
file.txt
```

is created.

If it already exists, `touch` normally updates its timestamps rather than replacing its contents.

### Important

```bash
touch existing.txt
```

does **not** erase the file.

This is a common exam question.

---

# 29. `mkdir`

`mkdir` means **make directory**.

```bash
mkdir project
```

creates:

```text
project/
```

### Create multiple directories

```bash
mkdir dir1 dir2 dir3
```

### Create nested directories

Use:

```bash
mkdir -p project/src/components
```

The `-p` option creates missing parent directories as necessary.

---

# 30. `cp`

`cp` copies files.

```bash
cp source.txt destination.txt
```

Example:

```bash
cp file.txt backup.txt
```

The original remains:

```text
file.txt
```

and a new copy exists:

```text
backup.txt
```

### Copy into a directory

```bash
cp file.txt backup/
```

---

# 31. `rm`

`rm` removes files.

```bash
rm file.txt
```

After successful execution, the directory entry is removed.

### Important

Linux normally does not provide a recycle bin when using `rm` directly.

Therefore:

```bash
rm file.txt
```

should be treated as a potentially destructive command.

---

# 32. `rmdir`

`rmdir` removes **empty directories**.

```bash
rmdir emptydir
```

If the directory contains files, `rmdir` normally fails.

Example:

```text
emptydir/
```

can be removed.

But:

```text
project/
├── file.txt
└── script.sh
```

cannot normally be removed using:

```bash
rmdir project
```

because it is not empty.

---

# 33. `rm -r`

The `-r` option means **recursive**.

It allows `rm` to remove directories and their contents.

```bash
rm -r project
```

If:

```text
project/
├── file1.txt
├── file2.txt
└── src/
    └── main.py
```

then:

```bash
rm -r project
```

removes the directory and its contents recursively.

### WARNING

Be extremely careful with:

```bash
rm -r
```

because it can remove large directory trees.

---

# 34. `rm -i`

The `-i` option means **interactive confirmation**.

```bash
rm -i file.txt
```

The command asks for confirmation before removing the file.

For example:

```text
rm: remove regular file 'file.txt'? 
```

You can respond:

```text
y
```

or:

```text
n
```

### Safer habit

When you are unsure:

```bash
rm -i file.txt
```

is safer than blindly using:

```bash
rm file.txt
```

---

# 35. `mv` and Recursive Behavior

A common point of confusion is:

```text
mv
```

versus:

```text
cp
```

When moving a directory:

```bash
mv directory destination/
```

`mv` moves the directory and its contents without requiring a separate `-r` option.

For example:

```text
project/
├── a.txt
└── b.txt
```

Run:

```bash
mv project backup/
```

The entire directory tree moves.

---

# 36. Why `cp` Needs `-r` for Directories

By default:

```bash
cp project backup/
```

does not recursively copy the contents of a directory.

For directories, use:

```bash
cp -r project backup/
```

This means:

```text
-r
 ↓
recursive
```

It tells `cp` to descend into the directory and copy its contents.

---

# 37. `cp -r`

Example:

```bash
cp -r project project_backup
```

Before:

```text
project/
├── main.py
├── README.md
└── src/
    └── app.py
```

After:

```text
project/
├── main.py
├── README.md
└── src/
    └── app.py

project_backup/
├── main.py
├── README.md
└── src/
    └── app.py
```

You now have two separate directory trees.

---

# 38. Links in Linux

Linux supports different types of links.

The two important types are:

```text
Symbolic link
Hard link
```

---

# 39. Symbolic Link — `ln -s`

A symbolic link, or **soft link**, is a special file that contains a reference/path to another file or directory.

Create one using:

```bash
ln -s target linkname
```

Example:

```bash
ln -s original.txt shortcut.txt
```

Conceptually:

```text
shortcut.txt
      │
      └────→ original.txt
```

### Check it

```bash
ls -l
```

You may see:

```text
lrwxrwxrwx 1 shubham shubham 12 Sep 8 12:00 shortcut.txt -> original.txt
```

The initial:

```text
l
```

indicates a symbolic link.

---

# 40. Symbolic Links to Directories

Symbolic links can point to directories.

```bash
ln -s /home/shubham/project project_link
```

Now:

```bash
cd project_link
```

takes you into the target directory.

This is one reason symbolic links are extremely useful.

---

# 41. Broken Symbolic Links

A symbolic link can point to something that no longer exists.

Create:

```bash
ln -s original.txt link.txt
```

Delete the target:

```bash
rm original.txt
```

Now:

```text
link.txt → original.txt
```

but:

```text
original.txt
```

does not exist.

The symbolic link is now **broken** or **dangling**.

---

# 42. Hard Link — `ln`

Without `-s`, `ln` creates a hard link.

```bash
ln original.txt hardlink.txt
```

Conceptually:

```text
original.txt ──┐
               ├──→ inode
hardlink.txt ──┘
```

Both names refer to the same inode.

Check:

```bash
ls -i original.txt hardlink.txt
```

If both show the same inode number, they refer to the same underlying inode.

---

# 43. Soft Link vs Hard Link

| Feature | Symbolic Link | Hard Link |
|---|---|---|
| Command | `ln -s` | `ln` |
| Has separate inode? | Yes | No, points to same inode |
| Can point to directory? | Yes | Normally no for ordinary users |
| Can cross filesystems? | Yes | No |
| Can become broken? | Yes | No in the same sense |
| Stores target path? | Yes | No |
| Same inode as target? | No | Yes |

### Mental Model

Soft link:

```text
link
 ↓
target path
 ↓
target
 ↓
inode
```

Hard link:

```text
filename A ──┐
             ├──→ same inode
filename B ──┘
```

---

# 44. `stat`

`stat` displays detailed information about a file or filesystem object.

```bash
stat file.txt
```

Example information may include:

```text
File: file.txt
Size: 100
Blocks: 8
IO Block: 4096
regular file
Device: ...
Inode: 12345
Links: 2
Access: ...
Uid: ...
Gid: ...
Access: ...
Modify: ...
Change: ...
Birth: ...
```

The exact output depends on the filesystem and system.

### Important Information

`stat` can show:

```text
inode number
file size
permissions
owner
group
link count
timestamps
file type
```

---

# 45. File Timestamps

`stat` can expose several timestamps.

Common Linux filesystem timestamps include:

```text
Access  → atime
Modify  → mtime
Change  → ctime
```

### Access time

Generally relates to the last access/read.

### Modification time

Generally relates to the last modification of file contents.

### Change time

Represents the last change to inode metadata, such as permissions, ownership, link count, etc.

### Important

`ctime` does **not** mean "creation time" on Linux.

This is a common exam trap.

---

# 46. `du` — Disk Usage

`du` means **disk usage**.

```bash
du
```

It shows the disk space used by files/directories.

For a directory:

```bash
du project
```

### Human-readable

```bash
du -h project
```

Example:

```text
4.0K    project/src
8.0K    project
```

### Summary

A very useful option is:

```bash
du -sh project
```

Meaning:

```text
-s → summary
-h → human-readable
```

Example:

```text
120M    project
```

---

# 47. `du` vs `df`

Do not confuse:

```bash
du
```

with:

```bash
df
```

### `du`

Asks:

> How much space are these files/directories using?

```bash
du -sh project
```

### `df`

Asks:

> How much filesystem space is used/free?

```bash
df -h
```

Mental model:

```text
du → files/directories
df → filesystems
```

---

# 48. `/proc` and `/sys`

Linux provides special virtual filesystems containing information about the running system.

Two important ones are:

```text
/proc
/sys
```

They are not ordinary directories containing normal files stored permanently on disk.

They provide interfaces to kernel/system information.

---

# 49. `/proc`

`/proc` is a virtual filesystem commonly called the **proc filesystem**.

It exposes information about:

```text
processes
CPU
memory
kernel
system configuration
```

You can inspect it using ordinary commands.

For example:

```bash
ls /proc
```

You may see directories such as:

```text
1
2
...
self
sys
cpuinfo
meminfo
version
partitions
```

Some entries correspond to processes.

---

# 50. Process IDs in `/proc`

Many numeric directories under `/proc` represent processes.

For example:

```text
/proc/1
/proc/100
/proc/2500
```

Each number can represent a **PID**.

PID means:

> Process ID

For example:

```text
/proc/1234
```

contains information associated with process ID `1234`.

---

# 51. `/proc/cpuinfo`

The file:

```bash
/proc/cpuinfo
```

contains information about CPUs/processors visible to the kernel.

View it:

```bash
cat /proc/cpuinfo
```

You may see information such as:

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

For example:

```bash
grep "model name" /proc/cpuinfo
```

can show CPU model information.

---

# 52. `/proc/version`

View kernel/compiler version information using:

```bash
cat /proc/version
```

It can contain information about:

```text
Linux kernel version
compiler
build information
```

Example structure:

```text
Linux version 6.x.x ...
```

The exact version depends on your system.

---

# 53. `uname -a`

`uname` provides system information.

```bash
uname -a
```

The `-a` option means to display available system information.

Example:

```text
Linux hostname 6.x.x-generic #... x86_64 GNU/Linux
```

It can provide information such as:

```text
kernel name
hostname
kernel release
kernel version
machine architecture
operating system
```

### Compare

```bash
uname -a
```

and:

```bash
cat /proc/version
```

They both provide kernel-related information, but through different interfaces and with different details.

---

# 54. `/proc/meminfo`

The file:

```bash
/proc/meminfo
```

provides detailed memory statistics.

View it:

```bash
cat /proc/meminfo
```

You may see entries such as:

```text
MemTotal
MemFree
MemAvailable
Buffers
Cached
SwapCached
SwapTotal
SwapFree
```

You can search for a particular field:

```bash
grep MemTotal /proc/meminfo
```

---

# 55. `free` and `/proc/meminfo`

The `free` command provides a convenient summary of memory usage.

```bash
free
```

while:

```bash
cat /proc/meminfo
```

provides much more detailed kernel memory information.

Mental model:

```text
/proc/meminfo
      ↓
detailed memory statistics

free
      ↓
human-friendly memory summary
```

---

# 56. `/proc/partitions`

The file:

```bash
/proc/partitions
```

provides information about recognized block-device partitions.

View it:

```bash
cat /proc/partitions
```

You may see columns resembling:

```text
major minor  #blocks  name
```

and entries such as:

```text
sda
sda1
sda2
```

The exact devices depend on your system.

---

# 57. `df`

`df` means **disk free**.

It reports filesystem disk-space usage.

```bash
df
```

For human-readable output:

```bash
df -h
```

Example:

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda2       100G   40G   55G  43% /
```

### Important Columns

```text
Filesystem
Size
Used
Avail
Use%
Mounted on
```

---

# 58. `df` vs `du` — Exam Question

### Question

Which command shows how much space a directory's contents are using?

```bash
du
```

### Question

Which command shows filesystem capacity and available space?

```bash
df
```

### Remember

```text
du = disk usage
df = disk free
```

---

# 59. Process IDs (PIDs)

A **process** is a running instance of a program.

Every process normally has a unique **Process ID (PID)** at a given time.

You can inspect processes using:

```bash
ps
```

or:

```bash
ps -ef
```

Example:

```text
UID      PID   PPID  C STIME TTY      TIME CMD
root       1     0   0 ...   ?        ...  /sbin/init
shubham  2500  2000  0 ...   pts/0    ...  bash
```

Important fields:

```text
PID  → process ID
PPID → parent process ID
```

---

# 60. PIDs and `/proc`

Suppose:

```bash
ps
```

shows:

```text
PID
2500
```

Then Linux may expose information about that process under:

```bash
/proc/2500
```

You can inspect:

```bash
ls /proc/2500
```

This creates a connection between:

```text
ps
 ↓
PID
 ↓
/proc/PID
```

For example:

```text
ps
 ↓
2500
 ↓
/proc/2500
```

---

# 61. `/sys`

`/sys` is another virtual filesystem, commonly called **sysfs**.

It exposes information about devices, drivers, buses, kernel objects, and other hardware-related structures.

Explore it:

```bash
ls /sys
```

You may see:

```text
block
bus
class
dev
devices
firmware
fs
kernel
module
power
```

---

# 62. `/proc` vs `/sys`

A useful conceptual distinction:

```text
/proc
 ↓
processes + kernel/system information

/sys
 ↓
devices + drivers + kernel object model
```

Both are virtual filesystems provided by the Linux kernel.

They provide information through filesystem-like interfaces.

---

# 63. `/sys/bus/usb/devices`

USB devices are represented through the sysfs hierarchy.

Explore:

```bash
ls /sys/bus/usb/devices
```

You may see entries such as:

```text
1-0:1.0
1-1
1-1:1.0
usb1
```

The exact entries depend on your machine and currently connected devices.

You can inspect a particular entry, for example:

```bash
ls -l /sys/bus/usb/devices/
```

You may find symbolic links connecting different parts of the sysfs hierarchy.

---

# 64. Why `/sys` Uses Links

Sysfs organizes hardware objects into relationships such as:

```text
device
   ↓
bus
   ↓
driver
   ↓
class
```

Symbolic links help represent these relationships without duplicating the underlying kernel objects.

Therefore, when exploring:

```bash
ls -l /sys/bus/usb/devices
```

you may encounter symbolic links.

---

# 65. Important Commands at a Glance

| Command | Purpose |
|---|---|
| `ls -l dir` | List directory contents in long format |
| `ls -ld dir` | Show information about the directory itself |
| `ls -la` | Long listing including hidden entries |
| `ls --all` | Long-form equivalent of `-a` |
| `less file` | Interactive file pager |
| `cat file` | Display/concatenate file contents |
| `more file` | Page through text |
| `head file` | First 10 lines |
| `head -n 5 file` | First 5 lines |
| `tail file` | Last 10 lines |
| `tail -n 5 file` | Last 5 lines |
| `wc file` | Count lines, words, bytes |
| `wc -l file` | Count lines |
| `which command` | Locate executable in `$PATH` |
| `whatis command` | Short manual description |
| `apropos keyword` | Search manual descriptions |
| `man -k keyword` | Keyword-search manual database |
| `help command` | Bash builtin help |
| `man command` | Manual page |
| `info command` | GNU Info documentation |
| `type command` | Show how shell resolves command |
| `file file` | Identify file type |
| `alias` | Display/create aliases |
| `unalias` | Remove aliases |
| `touch file` | Create file/update timestamps |
| `mkdir dir` | Create directory |
| `cp file dest` | Copy |
| `cp -r dir dest` | Recursively copy directory |
| `rm file` | Remove file |
| `rmdir dir` | Remove empty directory |
| `rm -r dir` | Recursively remove directory |
| `rm -i file` | Ask before removing |
| `mv source dest` | Move/rename |
| `ln -s target link` | Create symbolic link |
| `ln target link` | Create hard link |
| `stat file` | Detailed file metadata |
| `du` | Disk usage of files/directories |
| `df` | Filesystem free/used space |
| `uname -a` | System/kernel information |
| `cat /proc/cpuinfo` | CPU information |
| `cat /proc/version` | Kernel/compiler information |
| `cat /proc/meminfo` | Detailed memory information |
| `cat /proc/partitions` | Partition/block-device information |

---

# 66. Critical Differences to Memorize

## `ls -l` vs `ls -ld`

```bash
ls -l dir
```

→ contents of `dir`

```bash
ls -ld dir
```

→ `dir` itself

---

## `cat` vs `less` vs `more`

```text
cat
 ↓
dump/display contents

less
 ↓
interactive pager

more
 ↓
pager, generally simpler/older
```

For large files:

```bash
less file
```

is usually preferable to:

```bash
cat file
```

---

## `head` vs `tail`

```text
head → beginning
tail → end
```

---

## `wc` vs `wc -l`

```bash
wc file
```

→ lines + words + bytes

```bash
wc -l file
```

→ lines only

---

## `whatis` vs `apropos`

```text
whatis ls
```

asks:

> What is `ls`?

while:

```text
apropos search
```

asks:

> Which commands are related to "search"?

---

## `help` vs `man`

```text
help
 ↓
Bash builtin help

man
 ↓
manual pages
```

For example:

```bash
help cd
man ls
```

---

## `du` vs `df`

```text
du → directory/file disk usage
df → filesystem capacity/free space
```

---

## `cp` vs `mv`

```text
cp → copy
mv → move/rename
```

For directories:

```bash
cp -r directory destination
```

but:

```bash
mv directory destination
```

does not require `-r`.

---

## `rmdir` vs `rm -r`

```bash
rmdir directory
```

→ only removes an empty directory.

```bash
rm -r directory
```

→ removes the directory recursively with its contents.

---

## Soft Link vs Hard Link

```bash
ln -s target link
```

→ symbolic/soft link.

```bash
ln target link
```

→ hard link.

---

# 67. Practice Questions

## Q1

What is the difference between:

```bash
ls -l project
```

and:

```bash
ls -ld project
```

### Answer

```text
ls -l project
→ contents of project

ls -ld project
→ project directory itself
```

---

## Q2

What does this command do?

```bash
head -n 5 file.txt
```

### Answer

Displays the first five lines.

---

## Q3

What does this command do?

```bash
tail -n 5 file.txt
```

### Answer

Displays the last five lines.

---

## Q4

What does:

```bash
wc file.txt
```

normally display?

### Answer

```text
lines
words
bytes
```

---

## Q5

What does:

```bash
wc -l file.txt
```

do?

### Answer

Counts lines.

---

## Q6

Which command gives a short description of `chmod`?

```bash
whatis chmod
```

---

## Q7

Which command searches for commands related to a keyword?

```bash
apropos keyword
```

or:

```bash
man -k keyword
```

---

## Q8

What is the purpose of:

```bash
type cd
```

### Answer

It tells you how the shell interprets `cd`, such as identifying it as a shell builtin.

---

## Q9

What does:

```bash
touch file.txt
```

do if the file does not exist?

### Answer

Creates an empty file.

---

## Q10

What happens if the file already exists?

```bash
touch file.txt
```

### Answer

Its contents are not normally changed; its timestamps are updated.

---

## Q11

Which command removes an empty directory?

```bash
rmdir directory
```

---

## Q12

Which command recursively copies a directory?

```bash
cp -r directory destination
```

---

## Q13

Which command recursively removes a directory?

```bash
rm -r directory
```

---

## Q14

What does:

```bash
rm -i file.txt
```

do?

### Answer

Asks for confirmation before removing the file.

---

## Q15

What is created by:

```bash
ln -s original.txt link.txt
```

### Answer

A symbolic/soft link.

---

## Q16

What is created by:

```bash
ln original.txt link.txt
```

### Answer

A hard link.

---

## Q17

How can you verify that two files are hard links to the same inode?

```bash
ls -i file1 file2
```

If they have the same inode number, they refer to the same inode.

---

## Q18

Which command displays detailed file metadata?

```bash
stat file
```

---

## Q19

Which command tells you how much space a directory is using?

```bash
du -sh directory
```

---

## Q20

Which command tells you filesystem capacity and available space?

```bash
df -h
```

---

## Q21

Where can you find detailed CPU information?

```bash
/proc/cpuinfo
```

---

## Q22

Where can you find detailed memory information?

```bash
/proc/meminfo
```

---

## Q23

If `ps` shows PID `1234`, where can you look for information associated with that process?

```bash
/proc/1234
```

---

## Q24

What is `/sys`?

### Answer

A virtual filesystem, sysfs, that exposes kernel/device/driver and related system-object information.

---

## Q25

What does this path relate to?

```bash
/sys/bus/usb/devices
```

### Answer

It is part of sysfs and represents USB devices and their relationships within the kernel's device model.

---

# 68. Mini Practical Lab

Create a practice environment:

```bash
mkdir -p linux_lab/project/src
cd linux_lab
```

Create files:

```bash
touch project/file1.txt
touch project/file2.txt
touch project/src/main.py
```

Put some content into them:

```bash
echo "Linux" > project/file1.txt
echo "System Commands" > project/file2.txt
echo "print('Hello')" > project/src/main.py
```

Inspect the directory:

```bash
ls -l project
```

Inspect the directory itself:

```bash
ls -ld project
```

Inspect file types:

```bash
file project/file1.txt
file project/src/main.py
```

View the files:

```bash
cat project/file1.txt
less project/file2.txt
```

Check first lines:

```bash
head -n 5 project/file1.txt
```

Check last lines:

```bash
tail -n 5 project/file2.txt
```

Count lines:

```bash
wc -l project/file1.txt
```

Check metadata:

```bash
stat project/file1.txt
```

Check disk usage:

```bash
du -sh project
```

Check filesystem usage:

```bash
df -h .
```

---

# 69. Link Practice

Create a hard link:

```bash
ln project/file1.txt hardlink.txt
```

Create a symbolic link:

```bash
ln -s project/file1.txt softlink.txt
```

Compare:

```bash
ls -li project/file1.txt hardlink.txt softlink.txt
```

You should conceptually see:

```text
project/file1.txt  → inode A
hardlink.txt       → inode A
softlink.txt       → inode B
```

The symbolic link has its own inode, while the hard link shares the target's inode.

Check the symbolic link:

```bash
ls -l softlink.txt
```

You should see something similar to:

```text
softlink.txt -> project/file1.txt
```

---

# 70. System Information Practice

Check kernel information:

```bash
uname -a
```

Check CPU:

```bash
cat /proc/cpuinfo
```

Check kernel version information:

```bash
cat /proc/version
```

Check memory:

```bash
free -h
```

Detailed memory:

```bash
cat /proc/meminfo
```

Check partitions:

```bash
cat /proc/partitions
```

Check filesystem space:

```bash
df -h
```

Explore sysfs:

```bash
ls /sys
```

Explore USB devices:

```bash
ls -l /sys/bus/usb/devices
```

---

# 71. Final Mental Model

The commands in this lesson can be grouped into several major areas:

```text
                    Linux System Commands
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
   File Viewing          Filesystem           System Info
       │                    │                    │
   cat                  touch                  /proc
   less                 mkdir                  /sys
   more                 cp                     uname
   head                 mv                     free
   tail                 rm                     df
   wc                   rmdir
                        du
       │                    │
       └────────────┬───────┘
                    │
                  Links
                    │
              ┌─────┴─────┐
              │           │
           ln -s          ln
          soft link    hard link
              │           │
              └─────┬─────┘
                    │
                  Inode
                    │
                 stat
```

The most important distinctions to remember are:

```text
ls -l dir       → contents of directory
ls -ld dir      → directory itself

cat             → display everything
less            → interactive pager
more            → pager

head            → beginning
tail            → end

wc              → lines + words + bytes
wc -l           → lines

whatis          → short description
apropos/man -k  → search by keyword
help            → Bash builtin help
man             → manual page
info            → GNU Info documentation
type            → how shell resolves command

touch           → create/update timestamps
mkdir           → create directory
cp              → copy
mv              → move/rename
rm              → remove
rmdir           → remove empty directory
rm -r           → recursive removal
rm -i           → interactive removal

ln -s           → symbolic link
ln              → hard link

stat            → detailed metadata
du              → disk usage
df              → filesystem usage

/proc           → processes/kernel information
/sys            → devices/drivers/kernel objects
```

## High-Value Exam Memory

```text
/proc/PID
    ↓
process information

/proc/cpuinfo
    ↓
CPU information

/proc/meminfo
    ↓
memory information

/proc/version
    ↓
kernel/compiler information

/proc/partitions
    ↓
partition/block-device information

/sys
    ↓
device/kernel object information

/sys/bus/usb/devices
    ↓
USB device hierarchy
```

And the central filesystem/link concept is:

```text
                     Directory Entry
                           │
             ┌─────────────┴─────────────┐
             │                           │
        Hard Link                  Symbolic Link
             │                           │
             ↓                           ↓
          Inode                    Link's own inode
             │                           │
             ↓                           ↓
         File data                 Target path
```

Understanding these relationships makes commands such as `ls -i`, `ls -l`, `stat`, `ln`, `ln -s`, `cp`, `mv`, `du`, `df`, `/proc`, and `/sys` much easier to reason about rather than memorizing them individually.
