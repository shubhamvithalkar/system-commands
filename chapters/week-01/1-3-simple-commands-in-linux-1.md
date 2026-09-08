---
layout: default
title: "1.3 - Simple Commands in Linux - 1"
---

# 1.3 - Simple Commands in Linux - 1
# Linux Commands, Permissions, Links, and File Types

## 1. `cd ..` — Move to the Parent Directory

### What is `cd`?

`cd` means **change directory**. It changes your current working directory.

```bash
cd directory_name
```

### `cd ..`

`..` represents the **parent directory** of the current directory.

```bash
cd ..
```

Example:

```text
/home/shubham/projects/app
```

Running:

```bash
cd ..
```

moves you to:

```text
/home/shubham/projects
```

### Mental Model

```text
/home
  └── shubham
       └── projects
            └── app  ← current directory
```

`cd ..` moves one level upward:

```text
app → projects
```

### Verify

```bash
pwd
cd ..
pwd
```

---

# 2. `cd` — Go to the Home Directory

If you run `cd` without an argument:

```bash
cd
```

the shell takes you to your **home directory**.

For example:

```bash
/home/shubham
```

This is equivalent to:

```bash
cd ~
```

and usually equivalent to:

```bash
cd "$HOME"
```

### Example

```bash
pwd
cd
pwd
```

You should now be inside your home directory.

### Important

```bash
cd
```

and

```bash
cd ~
```

both mean:

> Go to my home directory.

---

# 3. `cd -` — Go to the Previous Directory

`cd -` switches to the **previous working directory**.

Example:

```bash
cd /tmp
cd /home
cd -
```

The last command takes you back to:

```text
/tmp
```

Run it again:

```bash
cd -
```

and you return to:

```text
/home
```

So you can think of it as a **directory toggle**.

```text
Directory A
    ↓
Directory B
    ↓
cd -
    ↓
Directory A
    ↓
cd -
    ↓
Directory B
```

### Useful Example

Suppose you frequently switch between:

```text
~/project
```

and

```text
/etc
```

You can do:

```bash
cd ~/project
cd /etc
cd -
```

You are back in:

```text
~/project
```

---

# 4. `cd ~` — Go to Home Directory

The `~` character represents the current user's home directory.

```bash
cd ~
```

For user `shubham`, this may expand to:

```bash
cd /home/shubham
```

You can verify:

```bash
echo ~
```

Output:

```text
/home/shubham
```

### `~` vs `/`

These are completely different:

```text
~      → your home directory
/      → root of the entire filesystem
```

For example:

```bash
cd ~
```

might take you to:

```text
/home/shubham
```

while:

```bash
cd /
```

takes you to the filesystem root.

---

# 5. `date -R` — Display Date in RFC Format

The `date` command displays the current date and time.

```bash
date
```

Example:

```text
Tue Sep 8 12:30:45 IST 2026
```

The `-R` option displays the date in **RFC-style format**.

```bash
date -R
```

Example:

```text
Tue, 08 Sep 2026 12:30:45 +0530
```

The exact output depends on your system date, time, and timezone.

### Useful distinction

```bash
date
```

→ normal date/time format

```bash
date -R
```

→ RFC-formatted date

---

# 6. `cal` — Display a Calendar

`cal` displays a calendar.

```bash
cal
```

Example:

```text
   September 2026
Su Mo Tu We Th Fr Sa
       1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30
```

The exact appearance can vary depending on the version installed.

### Display a specific month

```bash
cal 9 2026
```

This displays September 2026.

### Display a complete year

```bash
cal 2026
```

---

# 7. `ncal` — Alternative Calendar Display

`ncal` is another calendar utility.

```bash
ncal
```

It generally displays the calendar in a different orientation from `cal`.

Example:

```bash
ncal
```

The exact formatting depends on the system.

### `cal` vs `ncal`

```text
cal
 ↓
Traditional calendar layout

ncal
 ↓
Alternative/transposed calendar layout
```

Both are useful for quickly viewing dates from the terminal.

---

# 8. `free` — Display Memory Usage

The `free` command displays information about system memory.

```bash
free
```

Example:

```text
               total        used        free      shared  buff/cache   available
Mem:         8000000     3000000     1000000      200000      5000000     4500000
Swap:        2000000      100000      1900000
```

The actual numbers depend on your machine.

## Important Columns

### `total`

Total available memory.

### `used`

Memory currently being used.

### `free`

Memory that is completely unused.

### `shared`

Memory used primarily for shared memory.

### `buff/cache`

Memory used by the kernel for buffers and filesystem cache.

### `available`

An estimate of memory available for starting new applications without swapping.

---

# 9. `free -h` — Human-Readable Memory

The normal `free` command often displays memory in bytes or large numbers.

```bash
free
```

The `-h` option means **human-readable**.

```bash
free -h
```

Example:

```text
               total   used   free  shared  buff/cache  available
Mem:            7.7Gi  3.1Gi  1.2Gi  300Mi       3.4Gi       4.0Gi
Swap:           2.0Gi  100Mi  1.9Gi
```

Instead of:

```text
8000000
```

you might see:

```text
7.7Gi
```

### Remember

```bash
free
```

→ raw/less human-friendly units

```bash
free -h
```

→ human-readable units

---

# 10. `groups` — Display User Groups

The `groups` command shows the groups that a user belongs to.

```bash
groups
```

Example:

```text
shubham adm cdrom sudo dip plugdev lpadmin
```

The first name is normally the username, followed by groups.

### Why are groups important?

Linux uses groups to manage permissions.

For example, a file could belong to:

```text
owner: shubham
group: developers
```

Users who belong to the `developers` group may receive permissions assigned to the group.

### Check another user

```bash
groups username
```

---

# 11. `ls -l` — Long Listing

The `-l` option gives detailed information about files and directories.

```bash
ls -l
```

Example:

```text
-rw-r--r-- 1 shubham developers 1200 Sep  8 10:30 notes.txt
drwxr-xr-x 2 shubham developers 4096 Sep  8 10:35 project
```

Understanding this output is extremely important for Linux exams and administration.

---

# 12. Anatomy of `ls -l` Output

Consider:

```text
-rwxr-xr-- 2 shubham developers 2048 Sep 8 10:30 script.sh
```

Break it into fields:

```text
-rwxr-xr--  2  shubham  developers  2048  Sep 8 10:30  script.sh
     │       │      │         │        │         │             │
     │       │      │         │        │         │             └─ Name
     │       │      │         │        │         └────────────── Date/time
     │       │      │         │        └──────────────────────── Size
     │       │      │         └───────────────────────────────── Group
     │       │      └──────────────────────────────────────────── Owner
     │       └─────────────────────────────────────────────────── Hard-link count
     └──────────────────────────────────────────────────────────── Type + permissions
```

---

# 13. File Type in `ls -l`

The **first character** indicates the file type.

Common values:

| Symbol | Meaning |
|---|---|
| `-` | Regular file |
| `d` | Directory |
| `l` | Symbolic link |
| `c` | Character device |
| `b` | Block device |
| `p` | Named pipe (FIFO) |
| `s` | Socket |

Examples:

```text
-rw-r--r-- notes.txt
```

The first character is:

```text
-
```

Therefore it is a regular file.

Example:

```text
drwxr-xr-x project
```

The first character is:

```text
d
```

Therefore it is a directory.

---

# 14. Permission Section

After the file-type character, there are **nine permission characters**.

Example:

```text
-rwxr-xr--
```

Break it into:

```text
- rwx r-x r--
  │   │   │
  │   │   └── Others
  │   └────── Group
  └────────── Owner
```

So:

```text
Owner   → rwx
Group   → r-x
Others  → r--
```

There are three permission categories:

```text
u = user/owner
g = group
o = others
```

And three basic permissions:

```text
r = read
w = write
x = execute
```

---

# 15. Meaning of `r`, `w`, and `x`

## Read (`r`)

For a regular file:

```text
r
```

means the contents of the file can be read.

Example:

```bash
cat file.txt
```

requires read permission on the file.

---

## Write (`w`)

Allows modification of a file.

For example:

```bash
echo "hello" >> file.txt
```

requires appropriate write access.

---

## Execute (`x`)

For a regular file, execute permission allows the file to be executed as a program/script when otherwise appropriate.

Example:

```bash
./script.sh
```

For directories, permissions have somewhat different meanings:

```text
r → list directory contents
w → create/delete/rename entries
x → enter/traverse the directory
```

This distinction is extremely important.

---

# 16. Numeric Permission Values

Linux permissions can also be represented numerically.

```text
r = 4
w = 2
x = 1
```

Therefore:

```text
rwx = 4 + 2 + 1 = 7
rw- = 4 + 2     = 6
r-x = 4 + 1     = 5
r-- = 4         = 4
-wx = 2 + 1     = 3
-w- = 2
--x = 1
--- = 0
```

Example:

```text
rwxr-xr--
```

becomes:

```text
rwx = 7
r-x = 5
r-- = 4
```

Therefore:

```text
754
```

---

# 17. `chmod` — Change File Permissions

`chmod` means:

> change mode

It is used to change permissions.

General syntax:

```bash
chmod [options] mode file
```

Example:

```bash
chmod 700 script.sh
```

---

# 18. Symbolic `chmod`

Instead of numbers, you can modify permissions using:

```text
u = user/owner
g = group
o = others
a = all
```

Operations:

```text
+  add permission
-  remove permission
=  set exact permission
```

Example:

```bash
chmod g-w file
```

means:

> Remove write permission from the group.

---

# 19. `chmod g-w file/folder`

Consider:

```text
-rw-rw-r-- file.txt
```

Permissions:

```text
owner  → rw-
group  → rw-
others → r--
```

Run:

```bash
chmod g-w file.txt
```

Now:

```text
-rw-r--r--
```

The group's `w` permission was removed.

### Important

```bash
chmod g-w file
```

does **not** modify the owner or others.

Only:

```text
g
```

is affected.

---

# 20. `chmod o-x file/folder`

The `o` means **others**.

```bash
chmod o-x file
```

means:

> Remove execute permission from others.

For example:

```text
-rwxr-xr-x
```

After:

```bash
chmod o-x file
```

becomes:

```text
-rwxr-xr--
```

Only the `x` permission belonging to **others** is removed.

### Breakdown

```text
chmod o-x file
      │ │
      │ └── remove execute
      └──── others
```

---

# 21. `chmod 700 file/folder`

Numeric permissions provide an exact permission configuration.

```bash
chmod 700 file
```

means:

```text
Owner  → 7 → rwx
Group  → 0 → ---
Others → 0 → ---
```

Therefore:

```text
-rwx------
```

for a regular file.

For a directory:

```text
drwx------
```

### Mental Model

```text
700
│││
││└── Others = 0
│└─── Group  = 0
└──── Owner  = 7
```

So only the owner has permissions.

### Why use `700`?

It is commonly useful for private directories/scripts where group and other users should have no permissions.

---

# 22. Symbolic vs Numeric `chmod`

### Symbolic

```bash
chmod g-w file
chmod o-x file
chmod u+x script.sh
```

Good when you want to make a specific change.

### Numeric

```bash
chmod 700 file
chmod 755 script.sh
chmod 644 file.txt
```

Good when you want to specify the complete permission set.

---

# 23. `cp` — Copy Files

`cp` means **copy**.

General syntax:

```bash
cp source destination
```

Example:

```bash
cp file file_new
```

This creates a copy of:

```text
file
```

named:

```text
file_new
```

The original remains unchanged.

```text
file
  │
  └──────→ file_new
```

---

# 24. Copying to Another Directory

```bash
cp file ~/Documents/
```

This copies `file` into:

```text
~/Documents/
```

### Copy multiple files

```bash
cp file1 file2 file3 ~/Documents/
```

All three files are copied into `~/Documents/`.

### Copy a directory

Normally, use:

```bash
cp -r directory destination
```

The `-r` option means recursive copying.

Example:

```bash
cp -r project project_backup
```

---

# 25. `mv` — Move a File

`mv` means **move**.

Example:

```bash
mv file ..
```

This moves `file` into the parent directory.

Suppose you are currently in:

```text
/home/shubham/project
```

and run:

```bash
mv file ..
```

The file moves to:

```text
/home/shubham/file
```

### Mental Model

```text
Before:

project/
└── file


After:

project/

file
```

The original location no longer contains the file.

---

# 26. `mv` Can Rename Files

One of the most important facts about `mv`:

> `mv` is also used to rename files and directories.

Example:

```bash
mv old.txt new.txt
```

This effectively renames:

```text
old.txt
```

to:

```text
new.txt
```

The file contents remain the same.

### Why does this work?

`mv` changes the directory entry/name when the source and destination are on the same filesystem.

```text
old.txt
   ↓
new.txt
```

---

# 27. Moving and Renaming Directories

You can also rename a directory:

```bash
mv old_project new_project
```

Or move it:

```bash
mv project ~/Documents/
```

The same command handles both operations.

---

# 28. `alias`

An alias creates a shortcut for a command.

General syntax:

```bash
alias name='command'
```

Example:

```bash
alias ll='ls -l'
```

Now:

```bash
ll
```

behaves like:

```bash
ls -l
```

### View aliases

```bash
alias
```

This displays currently defined aliases.

### View one alias

```bash
alias ll
```

Example:

```text
alias ll='ls -l'
```

---

# 29. Removing an Alias

Use:

```bash
unalias ll
```

Now:

```bash
ll
```

will no longer refer to the alias.

### Remove all aliases

```bash
unalias -a
```

Be careful with this because it removes all aliases in the current shell.

---

# 30. Alias and Command Bypassing

Suppose someone creates:

```bash
alias ls='ls -l'
```

Now typing:

```bash
ls
```

actually invokes the alias.

You can inspect what a command means using:

```bash
type ls
```

or:

```bash
command -v ls
```

To bypass an alias:

```bash
\ls
```

The backslash tells the shell not to perform alias expansion for that command name.

You can also use:

```bash
command ls
```

or an absolute path such as:

```bash
/bin/ls
```

when appropriate.

---

# 31. Hard Links

A **hard link** is another directory entry that refers to the same underlying file/inode.

This is one of the most important concepts in Linux filesystem internals.

Suppose:

```text
file.txt
```

has inode:

```text
12345
```

A hard link can be created:

```bash
ln file.txt hardlink.txt
```

Now:

```text
file.txt       ─┐
                ├──→ inode 12345
hardlink.txt   ─┘
```

Both names point to the same inode.

---

# 32. What Is an Inode?

An inode is a filesystem data structure that stores information about a file.

It contains metadata such as:

- file type
- permissions
- owner
- group
- file size
- timestamps
- link count
- references to the file's data blocks

The filename itself is associated through a directory entry.

A useful simplified model is:

```text
Filename
   ↓
Directory Entry
   ↓
Inode
   ↓
File Data
```

---

# 33. Viewing an Inode Number with `ls -i`

Use:

```bash
ls -i filename
```

Example:

```bash
ls -i file.txt
```

Output:

```text
12345 file.txt
```

Here:

```text
12345
```

is the inode number.

---

# 34. Demonstrating Hard Links with Inodes

Create a file:

```bash
echo "Hello" > file.txt
```

Create a hard link:

```bash
ln file.txt hardlink.txt
```

Check inode numbers:

```bash
ls -i file.txt hardlink.txt
```

You may see:

```text
12345 file.txt
12345 hardlink.txt
```

The inode numbers are identical.

This proves both directory entries refer to the same inode.

---

# 35. Hard-Link Count

Run:

```bash
ls -li file.txt
```

You may see:

```text
12345 -rw-r--r-- 2 shubham shubham 6 Sep 8 12:00 file.txt
```

The number:

```text
2
```

is the **hard-link count**.

Initially:

```text
file.txt → inode 12345
```

Link count:

```text
1
```

After:

```bash
ln file.txt hardlink.txt
```

there are two directory entries:

```text
file.txt
hardlink.txt
      ↓
   inode 12345
```

Therefore:

```text
link count = 2
```

---

# 36. What Happens If the Original Name Is Deleted?

Suppose:

```text
file.txt ─────┐
              ├──→ inode 12345
hardlink.txt ─┘
```

Run:

```bash
rm file.txt
```

The inode and data do **not** immediately disappear because:

```text
hardlink.txt
      ↓
inode 12345
```

still exists.

You can still access the content:

```bash
cat hardlink.txt
```

The file data remains accessible through the remaining hard link.

---

# 37. Hard Links Share the Same Data

Suppose:

```bash
echo "Hello" > file.txt
ln file.txt hardlink.txt
```

Now modify:

```bash
echo "World" >> hardlink.txt
```

Then:

```bash
cat file.txt
```

will also show:

```text
Hello
World
```

Why?

Because both names refer to the same inode and underlying file data.

```text
file.txt
    │
    └──────┐
           ↓
       same inode
           ↑
    ┌──────┘
hardlink.txt
```

---

# 38. Hard Link vs Copy

This distinction is extremely important.

## Copy

```bash
cp file.txt copy.txt
```

creates a separate file.

Conceptually:

```text
file.txt  → inode A → data A

copy.txt  → inode B → data B
```

Different inode.

## Hard link

```bash
ln file.txt link.txt
```

creates another name for the same file.

```text
file.txt ──┐
            ├──→ inode A → data
link.txt ──┘
```

Same inode.

### Verify

```bash
ls -i file.txt copy.txt link.txt
```

You should find:

```text
file.txt  → inode A
copy.txt  → inode B
link.txt  → inode A
```

---

# 39. Important Hard-Link Restrictions

Hard links generally cannot:

- span different filesystems
- normally be created for directories by ordinary users

Example:

```bash
ln file.txt /another/filesystem/link.txt
```

may fail if the destination is on a different filesystem.

### Why?

An inode belongs to a particular filesystem.

A hard link must refer to an inode within the same filesystem.

---

# 40. Text Files vs Binary Files

Files can broadly be thought of as **text** or **binary**.

## Text File

A text file stores data that can be interpreted as characters according to an encoding.

Examples:

```text
.txt
.csv
.log
.html
.css
.js
.py
.sh
.md
```

Example:

```text
Hello World
Linux
Shell Scripting
```

You can inspect it using:

```bash
cat file.txt
```

---

# 41. Binary Files

Binary files contain data that is not intended to be interpreted simply as readable text.

Examples include:

```text
images
audio
video
compiled programs
compressed archives
PDFs
database files
```

Examples:

```text
image.jpg
program
archive.gz
video.mp4
```

Trying:

```bash
cat image.jpg
```

may produce unreadable characters.

---

# 42. Text vs Binary — Important Mental Model

The distinction is not simply:

```text
text = readable
binary = unreadable
```

Instead:

> A text file is data intended to be interpreted as text using a character encoding, while a binary file generally uses a format where arbitrary byte values have structured meanings.

Almost all files ultimately consist of bytes.

For example:

```text
File
 ↓
bytes
 ↓
interpret according to format
```

A text file might interpret those bytes as UTF-8 characters.

A JPEG interprets bytes according to the JPEG format.

An executable interprets bytes according to its executable format.

---

# 43. `file` — Identify File Type

The `file` command examines a file and attempts to determine its type.

Syntax:

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

Another example:

```bash
file image.jpg
```

Possible output:

```text
image.jpg: JPEG image data
```

Another:

```bash
file script.sh
```

Possible output:

```text
script.sh: Bourne-Again shell script, ASCII text executable
```

The exact wording depends on the system and file.

---

# 44. Why `file` Is Better Than Just the Extension

Linux does not fundamentally determine a file's type from its extension.

For example, you could have:

```text
photo.txt
```

containing JPEG data.

The name says:

```text
.txt
```

but the actual content may be JPEG.

Run:

```bash
file photo.txt
```

and it may identify:

```text
photo.txt: JPEG image data
```

Therefore:

> File extensions are mainly naming conventions; `file` examines the contents and metadata/signatures to identify the format.

---

# 45. `file` Uses File Signatures

Many file formats begin with characteristic byte patterns called **magic numbers** or file signatures.

For example, some formats have recognizable starting bytes.

The `file` utility uses such information, along with other tests, to identify file types.

Therefore:

```bash
file unknown_file
```

can often tell you what a file actually contains even if the filename has no useful extension.

---

# 46. Practical Command Sequence

Create a workspace:

```bash
mkdir linux_practice
cd linux_practice
```

Create a text file:

```bash
echo "Hello Linux" > file.txt
```

Check it:

```bash
file file.txt
```

Check inode:

```bash
ls -i file.txt
```

Create a hard link:

```bash
ln file.txt hardlink.txt
```

Compare inode numbers:

```bash
ls -i file.txt hardlink.txt
```

Check detailed information:

```bash
ls -li file.txt hardlink.txt
```

Create a copy:

```bash
cp file.txt copy.txt
```

Compare all three:

```bash
ls -li file.txt hardlink.txt copy.txt
```

You should observe:

```text
file.txt       → same inode
hardlink.txt   → same inode
copy.txt       → different inode
```

---

# 47. Practical Permissions Exercise

Create a file:

```bash
touch permissions.txt
```

Check permissions:

```bash
ls -l permissions.txt
```

Remove group write permission:

```bash
chmod g-w permissions.txt
```

Remove execute permission from others:

```bash
chmod o-x permissions.txt
```

Set owner-only permissions:

```bash
chmod 700 permissions.txt
```

Verify:

```bash
ls -l permissions.txt
```

For a regular file, you should see permissions equivalent to:

```text
-rwx------
```

---

# 48. Practical Navigation Exercise

Start somewhere inside your home directory:

```bash
cd ~
```

Create directories:

```bash
mkdir -p practice/a/b
```

Enter the deepest directory:

```bash
cd practice/a/b
```

Check:

```bash
pwd
```

Move one level up:

```bash
cd ..
pwd
```

Move to home:

```bash
cd ~
pwd
```

Return to the previous directory:

```bash
cd -
pwd
```

This gives you practice with:

```bash
cd
cd ..
cd ~
cd -
pwd
```

---

# 49. Practical `mv` Exercise

Create a file:

```bash
touch old.txt
```

Rename it:

```bash
mv old.txt new.txt
```

Check:

```bash
ls
```

You should see:

```text
new.txt
```

The name `old.txt` should no longer exist.

Now create a directory:

```bash
mkdir destination
```

Move the file:

```bash
mv new.txt destination/
```

Check:

```bash
ls destination/
```

You should see:

```text
new.txt
```

---

# 50. Practical `cp` Exercise

Create a file:

```bash
echo "Linux" > original.txt
```

Copy it:

```bash
cp original.txt copy.txt
```

Check:

```bash
ls -l
```

Read both:

```bash
cat original.txt
cat copy.txt
```

Now compare inode numbers:

```bash
ls -i original.txt copy.txt
```

The inode numbers should normally be different because `cp` created a separate file.

---

# 51. Practical `free` Exercise

Run:

```bash
free
```

Then:

```bash
free -h
```

Compare the output.

Question:

> Which version is easier for humans to read?

Answer:

```bash
free -h
```

because it uses human-readable units such as MiB/GiB.

---

# 52. Practical `groups` Exercise

Run:

```bash
groups
```

Then:

```bash
id
```

Compare the information.

`groups` focuses on group membership, while `id` provides additional identity information such as UID, GID, and groups.

---

# 53. Practical `alias` Exercise

Create an alias:

```bash
alias ll='ls -l'
```

Run:

```bash
ll
```

Check it:

```bash
alias ll
```

Remove it:

```bash
unalias ll
```

Now:

```bash
alias ll
```

should report that the alias does not exist.

---

# 54. Important Command Summary

| Command | Purpose |
|---|---|
| `cd ..` | Move to parent directory |
| `cd` | Go to home directory |
| `cd -` | Go to previous directory |
| `cd ~` | Go to home directory |
| `date -R` | Display date in RFC format |
| `cal` | Display calendar |
| `ncal` | Display alternative calendar |
| `free` | Display memory usage |
| `free -h` | Display memory in human-readable form |
| `groups` | Display user's groups |
| `ls -l` | Detailed file listing |
| `ls -i` | Display inode number |
| `chmod` | Change permissions |
| `chmod g-w file` | Remove group write permission |
| `chmod o-x file` | Remove execute permission from others |
| `chmod 700 file` | Owner gets `rwx`, group/others get none |
| `cp` | Copy files/directories |
| `mv` | Move files/directories |
| `mv old new` | Rename a file/directory |
| `alias` | Create/display command shortcuts |
| `ln` | Create links |
| `file` | Identify file type |

---

# 55. Key Concepts to Memorize

## Navigation

```bash
cd ..
```

means:

> parent directory

```bash
cd
```

means:

> home directory

```bash
cd ~
```

means:

> home directory

```bash
cd -
```

means:

> previous directory

---

## Permissions

```text
r = 4
w = 2
x = 1
```

Therefore:

```text
7 = rwx
6 = rw-
5 = r-x
4 = r--
3 = -wx
2 = -w-
1 = --x
0 = ---
```

And:

```text
700
```

means:

```text
owner  → rwx
group  → ---
others → ---
```

---

## Hard Links

```bash
ln file.txt link.txt
```

means:

```text
file.txt ──┐
            ├──→ same inode
link.txt ──┘
```

Check:

```bash
ls -i file.txt link.txt
```

Same inode number → same underlying file.

---

## Copy

```bash
cp file.txt copy.txt
```

means:

```text
file.txt → inode A
copy.txt → inode B
```

Different inode numbers.

---

# 56. Exam-Tricky Questions

### Q1. What does `cd ..` do?

**Answer:** Moves to the parent directory.

---

### Q2. What does `cd -` do?

**Answer:** Switches to the previous working directory.

---

### Q3. What does `cd` without an argument do?

**Answer:** Changes to the current user's home directory.

---

### Q4. What does `~` represent?

**Answer:** The current user's home directory.

---

### Q5. What does `free -h` do?

**Answer:** Displays memory usage using human-readable units.

---

### Q6. In `ls -l`, what does the first character `d` mean?

**Answer:** Directory.

---

### Q7. What does `-` as the first character mean?

**Answer:** Regular file.

---

### Q8. What does `l` as the first character mean?

**Answer:** Symbolic link.

---

### Q9. What does this mean?

```text
-rwxr-xr--
```

**Answer:**

```text
Owner  → rwx
Group  → r-x
Others → r--
```

Numeric form:

```text
754
```

---

### Q10. What does this command do?

```bash
chmod g-w file
```

**Answer:** Removes write permission from the group.

---

### Q11. What does this command do?

```bash
chmod o-x file
```

**Answer:** Removes execute permission from others.

---

### Q12. What permissions does `chmod 700 file` produce?

**Answer:**

```text
Owner  → rwx
Group  → ---
Others → ---
```

---

### Q13. What is the difference between `cp` and `mv`?

**Answer:**

```text
cp → creates a copy; original remains
mv → moves/renames; source name/location changes
```

---

### Q14. How can `mv` rename a file?

```bash
mv old.txt new.txt
```

The destination name becomes the new filename.

---

### Q15. What does `ls -i` show?

**Answer:** The inode number of a file.

---

### Q16. What proves two filenames are hard links to the same inode?

Run:

```bash
ls -i file1 file2
```

If both show the same inode number, they refer to the same inode.

---

### Q17. What is the difference between a hard link and a copy?

```text
Hard link → same inode
Copy      → different inode
```

---

### Q18. If the original filename of a hard link is deleted, does the data necessarily disappear?

**Answer:** No. If another hard link still points to the inode, the data remains accessible.

---

### Q19. Does Linux determine a file type only from its extension?

**Answer:** No. Extensions are naming conventions. Tools such as `file` examine the file to identify its actual type.

---

### Q20. Which command identifies a file's type?

```bash
file filename
```

---

# 57. Final Mental Model

The major concepts in this lesson connect together:

```text
                 Linux Filesystem
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       Paths         Inodes       Permissions
          │             │             │
     cd, ~, ..      ls -i        chmod
          │             │             │
          └─────────────┼─────────────┘
                        │
                    File names
                        │
              ┌─────────┴─────────┐
              │                   │
             cp                  mv
              │                   │
          copy data          move/rename
              │
              └──────────┐
                         │
                    File type
                         │
                       file
```

The most important commands to be comfortable with are:

```bash
cd
cd ..
cd -
cd ~
date -R
cal
ncal
free
free -h
groups
ls -l
ls -i
chmod
cp
mv
alias
ln
file
```

If you understand **paths + `ls -l` + permissions + inodes + hard links + `cp` vs `mv` + `file`**, you have the core filesystem concepts needed for many Linux System Command questions.
