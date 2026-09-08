---
layout: default
title: "L6.1: Some Command line Utilities"
---

# L6.1: Some Command line Utilities



# find, File Packaging, Compression, and make

## 1. `find`

`find` is a Linux command used to **search for files and directories recursively** inside a directory hierarchy.

Think of `find` as:

> "Start from this directory and inspect everything below it. Show me the things that match my conditions."

### Basic syntax

```bash
find <starting-path> <conditions> <actions>
```

Example:

```bash
find .
```

This searches the current directory and all its subdirectories.

```bash
find $HOME
```

This searches your home directory.

---

# 2. Important `find` Options

Some commonly used `find` tests and actions are:

| Option | Purpose |
|---|---|
| `-name` | Match filename |
| `-type` | Match file type |
| `-atime` | Match based on access time |
| `-ctime` | Match based on inode/status-change time |
| `-mtime` | Match based on modification time |
| `-regex` | Match pathname using a regular expression |
| `-exec` | Execute a command for every match |
| `-print` | Print matching paths |
| `-size` | Match based on file size |

---

# 3. `-name`

`-name` searches for files/directories based on their names.

```bash
find . -name "*.txt"
```

Find all `.txt` files below the current directory.

### Important

Quote wildcards:

```bash
find . -name "*.jpg"
```

not:

```bash
find . -name *.jpg
```

The quotes prevent the shell from expanding `*.jpg` before `find` receives it.

### Case-sensitive

```bash
find . -name "*.JPG"
```

only matches names with uppercase `.JPG`.

For case-insensitive matching:

```bash
find . -iname "*.jpg"
```

---

# 4. `-type`

`-type` lets us specify what kind of filesystem object we want.

Common types:

```text
f   regular file
d   directory
l   symbolic link
```

### Find regular files

```bash
find . -type f
```

### Find directories

```bash
find . -type d
```

### Find symbolic links

```bash
find . -type l
```

### Combine `-type` and `-name`

```bash
find . -type f -name "*.jpg"
```

Meaning:

> Find regular files whose names end in `.jpg`.

---

# 5. `-print`

`-print` prints the pathname of every matching object.

```bash
find . -type f -print
```

Example output:

```text
./file1.txt
./data/file2.txt
./logs/server.log
```

In many common `find` commands, `-print` is the default action when no other explicit action is given.

Therefore:

```bash
find . -type f
```

and:

```bash
find . -type f -print
```

normally produce the same paths.

Explicitly writing `-print` can make the intention clearer.

---

# 6. Counting Files with `find`

You can pipe the output of `find` to another command.

```bash
find $HOME -print | wc -l
```

This counts the number of pathnames printed by `find` under your home directory.

### Mental model

```text
find
  ↓
list paths
  ↓
wc -l
  ↓
count lines
```

So:

```bash
find $HOME -print | wc -l
```

means:

> Search `$HOME`, print every matching pathname, and count the output lines.

### Important limitation

This counts **pathnames**, not necessarily only regular files.

If you specifically want regular files:

```bash
find "$HOME" -type f -print | wc -l
```

---

# 7. Time-Based Searching

`find` can search according to timestamps.

Important options include:

```text
-atime   last access time
-mtime   last modification time
-ctime   last status/inode change time
```

## `mtime`

`mtime` means:

> modification time of the file's contents.

For example:

```bash
find . -mtime -2
```

means approximately:

> Find objects modified within the last 2 × 24-hour periods.

The exact boundary behavior is based on `find`'s age calculation in complete 24-hour units.

### Useful pattern

```text
-mtime -N    less than N complete 24-hour periods old
-mtime N     approximately N complete 24-hour periods old
-mtime +N    more than N complete 24-hour periods old
```

Examples:

```bash
find . -mtime -2
```

Recently modified.

```bash
find . -mtime +30
```

Modified more than 30 complete 24-hour periods ago.

### Important correction

If you see:

```bash
find . -m -2
```

or:

```bash
find . -m +30
```

in lecture shorthand, the standard GNU/Linux `find` option is:

```bash
-mtime
```

So use:

```bash
find . -mtime -2
find . -mtime +30
```

---

# 8. `-atime`

`-atime` searches based on the **last access time**.

Example:

```bash
find . -atime -2
```

Find objects accessed within the relevant recent time range.

Access can occur when a file is read, although exact timestamp behavior depends on filesystem and mount options.

---

# 9. `-ctime`

`-ctime` searches based on the file's **status change time**.

This is often misunderstood.

`ctime` does **not** mean "creation time".

It means the last time filesystem metadata/status changed.

For example, changes to:

- permissions
- ownership
- link count
- some metadata
- file contents in ways that update metadata

can update `ctime`.

Example:

```bash
find . -ctime -2
```

---

# 10. `find` Man-Page Directory Example

Suppose we want directories under `/usr` whose names look like:

```text
man1
man2
man3
...
```

We can use:

```bash
find /usr -type d -name "man?" -print
```

Here:

```text
-type d
```

means directory.

```text
-name "man?"
```

means the name must consist of:

```text
man + exactly one character
```

Examples:

```text
man1
man2
man3
mana
```

could match.

But:

```text
man
manual
man12
```

would not match.

### Important

`?` here is a **filename wildcard**, not necessarily a regular-expression `?`.

`-name` uses shell-style pattern matching.

---

# 11. `-size`

`-size` searches according to file size.

Example:

```bash
find . -size +10M
```

Find files whose size is greater than the specified size threshold.

For regular files specifically:

```bash
find . -type f -size +10M
```

### Common size suffixes

```text
c   bytes
k   KiB
M   MiB
G   GiB
```

For example:

```bash
find . -type f -size +100M
```

Find regular files larger than 100 MiB.

---

# 12. `-exec`

One of the most powerful `find` features is:

```bash
-exec
```

It allows us to execute another command on the matching files.

Basic form:

```bash
find . -type f -exec command {} \;
```

Here:

```text
{}     → replaced by the current matched pathname
\;     → terminates the -exec command
```

Example:

```bash
find . -type f -name "*.jpg" -exec ls -sh {} \;
```

Meaning:

1. Search for regular files.
2. Their names must end in `.jpg`.
3. Run `ls -sh` on each matching file.

For example, if `find` finds:

```text
./a.jpg
./photos/b.jpg
```

it effectively executes commands similar to:

```bash
ls -sh ./a.jpg
ls -sh ./photos/b.jpg
```

---

# 13. Why `{}` Is Important

Consider:

```bash
find . -name "*.jpg" -exec ls -sh {} \;
```

`{}` is a placeholder.

If the match is:

```text
./photo.jpg
```

then:

```text
{}
```

becomes:

```text
./photo.jpg
```

Therefore the executed command becomes:

```bash
ls -sh ./photo.jpg
```

---

# 14. Why `\;` Is Important

This:

```bash
\;
```

tells `find`:

> This `-exec` command is finished.

The backslash prevents the shell from treating `;` as the end of the shell command before `find` receives it.

So:

```bash
-exec ls -l {} \;
```

is correct.

---

# 15. `-exec ... \;` vs `-exec ... +`

There are two important forms.

### One command per match

```bash
find . -type f -exec ls -l {} \;
```

Conceptually:

```bash
ls -l file1
ls -l file2
ls -l file3
```

### Batch multiple matches

```bash
find . -type f -exec ls -l {} +
```

Conceptually:

```bash
ls -l file1 file2 file3
```

The `+` form is generally more efficient because fewer processes need to be started.

---

# 16. Finding Large Files

Lecture example:

```bash
find . -size +10M -exec ls -lsh {} \;
```

This means:

> Search below the current directory for files larger than 10M and run `ls -lsh` on every match.

A more precise version that explicitly restricts the result to regular files is:

```bash
find . -type f -size +10M -exec ls -lsh {} \;
```

Example output:

```text
12K -rw-r--r-- 1 user user 11M ./large.dat
25M -rw-r--r-- 1 user user 24M ./video.mp4
```

---

# 17. Finding All JPG Files

```bash
find . -name '*.jpg' -exec ls -sh {} \;
```

This searches recursively for JPG files and displays their sizes.

A more explicit version:

```bash
find . -type f -name '*.jpg' -exec ls -sh {} \;
```

---

# 18. `-regex`

`find` can also match pathnames using regular expressions.

Example:

```bash
find . -type f -regex '.*\.jpg'
```

This searches for regular files whose path matches the regular expression.

### Understand the difference

`-name`:

```bash
find . -name "*.jpg"
```

uses shell-style wildcard matching.

`-regex`:

```bash
find . -regex '.*\.jpg'
```

uses a regular expression according to the `find` implementation's regex type.

So:

```text
-name
  ↓
shell-style pattern

-regex
  ↓
regular expression
```

---

# 19. `find` Conditions Can Be Combined

Example:

```bash
find . -type f -name "*.log" -mtime -2
```

Meaning:

> Find regular files ending in `.log` that were modified recently.

Another example:

```bash
find . -type f -name "*.jpg" -size +10M
```

Meaning:

> Find JPG regular files larger than 10M.

---

# 20. `du -sh`

`du` means:

> disk usage

It is useful for finding how much disk space a file or directory consumes.

Basic command:

```bash
du -sh directory/
```

Options:

```text
-s   summary
-h   human-readable
```

Example:

```bash
du -sh ~/Downloads
```

Possible output:

```text
4.2G    /home/user/Downloads
```

Meaning:

> The directory consumes approximately 4.2 GiB of disk space.

### Compare `du` and `df`

```text
du
↓
How much space are these files/directories using?

df
↓
How much free/used space is on the filesystem?
```

---

# 21. File Packaging and Compression

There are two different concepts:

## Packaging

Combining multiple files/directories into one archive.

```text
file1
file2
file3
folder
  ↓
archive
```

Example:

```bash
tar -cvf backup.tar folder/
```

## Compression

Reducing the amount of storage required by data.

```text
large data
   ↓
compression
   ↓
smaller data
```

These are related but **not the same thing**.

---

# 22. `tar`

`tar` stands for **Tape Archive**.

Its primary purpose is **packaging multiple files/directories into one archive**.

For example:

```bash
tar -cvf logfiles.tar logfiles/
```

creates:

```text
logfiles.tar
```

### Options

```text
-c   create archive
-v   verbose
-f   specify archive filename
```

So:

```bash
tar -cvf logfiles.tar logfiles/
```

means:

> Create a tar archive named `logfiles.tar` containing `logfiles/`.

---

# 23. What Does `tar` Actually Do?

Suppose we have:

```text
logfiles/
├── app.log
├── error.log
└── access.log
```

Running:

```bash
tar -cvf logfiles.tar logfiles/
```

produces:

```text
logfiles.tar
```

The archive contains all those files.

Conceptually:

```text
app.log
error.log
access.log
    ↓
   tar
    ↓
logfiles.tar
```

### Important

A `.tar` file is an **archive**, not necessarily a compressed file.

---

# 24. Extracting a TAR Archive

To extract:

```bash
tar -xvf logfiles.tar
```

Options:

```text
-x   extract
-v   verbose
-f   archive file
```

So:

```bash
tar -xvf logfiles.tar
```

extracts the contents.

---

# 25. `tar` Common Options

| Option | Meaning |
|---|---|
| `-c` | Create archive |
| `-x` | Extract archive |
| `-t` | List archive contents |
| `-v` | Verbose |
| `-f` | Archive filename |
| `-z` | gzip compression |
| `-j` | bzip2 compression |
| `-J` | xz compression |

Examples:

```bash
tar -cvf backup.tar project/
```

Create.

```bash
tar -tvf backup.tar
```

List contents.

```bash
tar -xvf backup.tar
```

Extract.

---

# 26. `gzip`

`gzip` is a compression utility.

Example:

```bash
gzip logfiles.tar
```

This compresses:

```text
logfiles.tar
```

into:

```text
logfiles.tar.gz
```

The original uncompressed file is normally replaced by the compressed file.

### Important

`gzip` normally compresses a file.

It does not serve as the main tool for packaging an entire directory tree.

That's why we commonly combine:

```text
tar + gzip
```

---

# 27. TAR + GZIP

Suppose:

```text
logfiles/
├── app.log
├── error.log
└── access.log
```

First:

```bash
tar -cvf logfiles.tar logfiles/
```

Then:

```bash
gzip logfiles.tar
```

Result:

```text
logfiles.tar.gz
```

Conceptually:

```text
multiple files/directories
          ↓
         tar
          ↓
    logfiles.tar
          ↓
        gzip
          ↓
    logfiles.tar.gz
```

This is extremely common in Linux.

---

# 28. `gunzip`

To decompress a `.gz` file:

```bash
gunzip logfiles.tar.gz
```

This normally produces:

```text
logfiles.tar
```

You can also use:

```bash
gzip -d logfiles.tar.gz
```

Both perform gzip decompression.

Then extract:

```bash
tar -xvf logfiles.tar
```

---

# 29. One-Step TAR + GZIP Extraction

Because `tar` understands gzip, you can directly extract:

```bash
tar -xzf logfiles.tar.gz
```

Here:

```text
-x   extract
-z   gzip
-f   archive filename
```

Likewise, you can create a gzip-compressed tar archive directly:

```bash
tar -czvf logfiles.tar.gz logfiles/
```

This combines:

```text
tar
+
gzip
```

in one command.

---

# 30. `bzip2`

`bzip2` is another compression utility.

Example:

```bash
bzip2 logfiles.tar
```

produces:

```text
logfiles.tar.bz2
```

Lecture point:

> bzip2 often provides better compression than older gzip/compress approaches, but can be slower.

Actual results depend heavily on the input data.

---

# 31. Decompressing BZIP2

Use:

```bash
bzip2 -d logfiles.tar.bz2
```

or:

```bash
bunzip2 logfiles.tar.bz2
```

This produces:

```text
logfiles.tar
```

Then:

```bash
tar -xvf logfiles.tar
```

---

# 32. `compress`

`compress` is an older Unix compression utility.

Typical output:

```bash
compress logfiles.tar
```

produces:

```text
logfiles.tar.Z
```

It is historically important but much less common on modern Linux systems.

Compared with newer compression utilities, it generally has weaker compression efficiency.

---

# 33. `xz`

`xz` is a modern compression utility known for strong compression.

Example:

```bash
xz logfiles.tar
```

produces:

```text
logfiles.tar.xz
```

Decompress:

```bash
xz -d logfiles.tar.xz
```

or:

```bash
unxz logfiles.tar.xz
```

Create directly with tar:

```bash
tar -cJvf logfiles.tar.xz logfiles/
```

Extract:

```bash
tar -xJvf logfiles.tar.xz
```

---

# 34. `7z`

`7z` is associated with the 7-Zip archive format.

Example:

```bash
7z a archive.7z logfiles/
```

Here:

```text
a
↓
add files to archive
```

Extract:

```bash
7z x archive.7z
```

Unlike the simple `tar` + compressor model, 7z can combine archiving and compression in one archive format.

---

# 35. Compression Utilities Comparison

Common tools include:

```text
compress
gzip
bzip2
xz
7z
```

A rough conceptual comparison:

| Utility | Typical compression | Typical speed | Common extension |
|---|---|---|---|
| `compress` | Lower | Fast/older | `.Z` |
| `gzip` | Good | Fast | `.gz` |
| `bzip2` | Better than gzip in many cases | Slower | `.bz2` |
| `xz` | Very good | Often slower | `.xz` |
| `7z` | Very good/high | Depends on settings | `.7z` |

Do not treat this table as an absolute benchmark.

Compression speed and ratio depend on:

- data type
- compression level
- CPU
- implementation
- memory
- file size

---

# 36. Compression Ratio vs Compression Time

Compression involves a trade-off.

Imagine:

```text
Input = 100 MB
```

One compressor might produce:

```text
70 MB
```

quickly.

Another might produce:

```text
55 MB
```

but take much longer.

So there are two important measurements:

### Compression ratio

How much smaller the data becomes.

A simple ratio can be represented as:

```text
compressed size / original size
```

For example:

```text
50 MB / 100 MB = 0.5
```

The compressed file is 50% of the original size.

### Compression time

How long the compressor takes to produce the compressed data.

---

# 37. Why Compression Ratio Matters

For storage:

```text
smaller file
    ↓
less disk space
```

For network transfer:

```text
smaller file
    ↓
less data transmitted
    ↓
potentially faster transfer
```

But higher compression often requires more CPU time.

Therefore:

```text
fast compression
      ↕
better compression ratio
```

is often a trade-off.

---

# 38. Compression Is Data-Dependent

A very important concept:

> Compression does not always reduce every file by the same amount.

Text often compresses well:

```text
.log
.txt
.csv
.json
```

Already-compressed formats may compress very little:

```text
.jpg
.mp3
.mp4
.zip
.gz
```

For example, running gzip on an already-compressed JPEG may provide little benefit.

---

# 39. `make` Utility

`make` is a build automation utility.

It is commonly used to:

- compile programs
- rebuild changed files
- automate repetitive commands
- manage dependencies
- perform backups or other workflows

The central idea is:

> Don't perform every step manually. Define the rules once, then let `make` determine what needs to be done.

---

# 40. Why `make` Exists

Suppose a project contains:

```text
main.c
math.c
math.h
```

You could manually run:

```bash
gcc -c main.c
gcc -c math.c
gcc main.o math.o -o program
```

But if only `math.c` changes, recompiling everything may be unnecessary.

`make` can understand dependencies and rebuild only what is required.

Mental model:

```text
Source files
     ↓
dependencies
     ↓
make
     ↓
only required commands
     ↓
final output
```

---

# 41. Basic Makefile

A `Makefile` contains rules.

Example:

```make
backup:
	tar -czf backup.tar.gz logfiles/
```

Then run:

```bash
make backup
```

`make` executes the command associated with the `backup` target.

### Important

The command under a target traditionally begins with a **TAB**.

For example:

```make
backup:
	tar -czf backup.tar.gz logfiles/
```

The indentation before `tar` should be a tab.

---

# 42. Makefile Structure

General form:

```make
target: dependencies
	command
```

Example:

```make
backup: logfiles/
	tar -czf backup.tar.gz logfiles/
```

Conceptually:

```text
target
  ↓
backup

dependency
  ↓
logfiles/

command
  ↓
tar ...
```

---

# 43. `make` for Backup

Suppose we want to create a backup of a directory.

Makefile:

```make
backup:
	tar -czf backup.tar.gz logfiles/
```

Run:

```bash
make backup
```

Result:

```text
backup.tar.gz
```

This is why `make` is not limited to compiling C/C++ programs.

It can automate many command-line workflows.

---

# 44. A Better Backup Example

```make
backup:
	tar -czf backup.tar.gz logfiles/

clean:
	rm -f backup.tar.gz
```

Now:

```bash
make backup
```

creates the backup.

And:

```bash
make clean
```

removes it.

---

# 45. `find` + `tar` + `gzip` + `make`

These tools can work together.

For example:

```text
find
 ↓
locate files
 ↓
tar
 ↓
package files
 ↓
gzip
 ↓
compress archive
 ↓
make
 ↓
automate the whole process
```

This is a very common Linux administration pattern.

---

# 46. Practical Example: Backup Workflow

Suppose we have:

```text
project/
├── src/
├── data/
├── logs/
└── README.md
```

Create an archive:

```bash
tar -cvf project.tar project/
```

Compress it:

```bash
gzip project.tar
```

Final file:

```text
project.tar.gz
```

Or directly:

```bash
tar -czvf project.tar.gz project/
```

Extract:

```bash
tar -xzvf project.tar.gz
```

---

# 47. Practical Example: Find Large Files

Find files larger than 10M:

```bash
find . -type f -size +10M -print
```

Show their sizes:

```bash
find . -type f -size +10M -exec ls -lh {} \;
```

Using batched execution:

```bash
find . -type f -size +10M -exec ls -lh {} +
```

---

# 48. Practical Example: Find Old Log Files

Find log files older than 30 days:

```bash
find . -type f -name "*.log" -mtime +30
```

Show detailed information:

```bash
find . -type f -name "*.log" -mtime +30 -exec ls -lh {} +
```

---

# 49. Practical Example: Count Regular Files

```bash
find "$HOME" -type f -print | wc -l
```

Mental model:

```text
$HOME
  ↓
find
  ↓
regular files
  ↓
print paths
  ↓
wc -l
  ↓
count
```

---

# 50. Practical Example: Find JPG Images

```bash
find . -type f -name "*.jpg" -print
```

Display their sizes:

```bash
find . -type f -name "*.jpg" -exec ls -sh {} +
```

---

# 51. Practical Example: Find Recently Modified Files

```bash
find . -type f -mtime -2 -print
```

Find recently modified log files:

```bash
find . -type f -name "*.log" -mtime -2 -print
```

---

# 52. Important Difference: `mtime`, `ctime`, `atime`

| Option | Meaning |
|---|---|
| `-mtime` | Last modification of file contents |
| `-ctime` | Last filesystem status/metadata change |
| `-atime` | Last access |

Remember:

```text
mtime → modify
ctime → change of metadata/status
atime → access
```

And:

```text
ctime ≠ creation time
```

---

# 53. Important Difference: `tar` vs `gzip`

This is an important exam question.

### `tar`

Primarily packages files/directories:

```bash
tar -cvf archive.tar folder/
```

### `gzip`

Compresses data:

```bash
gzip archive.tar
```

Together:

```bash
tar -czvf archive.tar.gz folder/
```

So:

```text
tar  → packaging
gzip → compression
```

---

# 54. Important Difference: `find` vs `du`

`find` answers:

> Which files/directories match my conditions?

Example:

```bash
find . -type f -size +100M
```

`du` answers:

> How much disk space is being used?

Example:

```bash
du -sh .
```

---

# 55. Important Difference: `gzip` vs `zip`

`gzip` is primarily a compression tool.

```bash
gzip file
```

produces:

```text
file.gz
```

`zip` commonly creates an archive that packages multiple files and compresses them.

Example:

```bash
zip backup.zip file1.txt file2.txt
```

For a directory:

```bash
zip -r backup.zip project/
```

Extract:

```bash
unzip backup.zip
```

---

# 56. Common Mistakes

## Mistake 1: Forgetting `-type`

Instead of:

```bash
find . -name "*.log"
```

you can use:

```bash
find . -type f -name "*.log"
```

when you specifically want regular files.

---

## Mistake 2: Not quoting wildcards

Avoid:

```bash
find . -name *.jpg
```

Prefer:

```bash
find . -name "*.jpg"
```

---

## Mistake 3: Confusing `ctime` with creation time

Incorrect:

```text
ctime = creation time
```

Correct:

```text
ctime = status/metadata change time
```

---

## Mistake 4: Forgetting `\;`

Incorrect:

```bash
find . -type f -exec ls -l {}
```

Correct:

```bash
find . -type f -exec ls -l {} \;
```

---

## Mistake 5: Thinking TAR compresses

A plain command:

```bash
tar -cvf archive.tar folder/
```

creates an archive but does not itself imply compression.

Use:

```bash
tar -czvf archive.tar.gz folder/
```

for gzip compression.

---

## Mistake 6: Using `gzip` directly on a directory

This generally does not work:

```bash
gzip project/
```

Instead:

```bash
tar -czvf project.tar.gz project/
```

---

# 57. Exam-Oriented Command Sheet

### Find everything

```bash
find .
```

### Find regular files

```bash
find . -type f
```

### Find directories

```bash
find . -type d
```

### Find JPG files

```bash
find . -type f -name "*.jpg"
```

### Case-insensitive JPG search

```bash
find . -type f -iname "*.jpg"
```

### Find files modified recently

```bash
find . -type f -mtime -2
```

### Find files modified more than 30 days ago

```bash
find . -type f -mtime +30
```

### Find large files

```bash
find . -type f -size +10M
```

### Execute command on matches

```bash
find . -type f -exec ls -lh {} \;
```

### Batch execution

```bash
find . -type f -exec ls -lh {} +
```

### Count regular files

```bash
find "$HOME" -type f -print | wc -l
```

### Disk usage

```bash
du -sh .
```

### Create TAR

```bash
tar -cvf archive.tar folder/
```

### Extract TAR

```bash
tar -xvf archive.tar
```

### Gzip

```bash
gzip archive.tar
```

### Gunzip

```bash
gunzip archive.tar.gz
```

### Create TAR.GZ directly

```bash
tar -czvf archive.tar.gz folder/
```

### Extract TAR.GZ

```bash
tar -xzvf archive.tar.gz
```

### Bzip2

```bash
bzip2 archive.tar
```

### Decompress Bzip2

```bash
bzip2 -d archive.tar.bz2
```

### XZ

```bash
xz archive.tar
```

### Decompress XZ

```bash
xz -d archive.tar.xz
```

### ZIP

```bash
zip -r archive.zip folder/
```

### Unzip

```bash
unzip archive.zip
```

---

# 58. Mental Model

Keep these four tools separate in your mind:

```text
find
│
├── SEARCH
├── name
├── type
├── time
├── size
└── exec


tar
│
└── PACKAGE


gzip / bzip2 / xz
│
└── COMPRESS


make
│
└── AUTOMATE
```

The complete workflow can therefore be:

```text
Find files
    ↓
Package them with tar
    ↓
Compress with gzip/bzip2/xz
    ↓
Automate the workflow with make
```

---

# 59. Practice Questions

## Q1

Find all regular `.log` files under the current directory.

### Solution

```bash
find . -type f -name "*.log"
```

---

## Q2

Find all directories named `man?` under `/usr`.

### Solution

```bash
find /usr -type d -name "man?" -print
```

---

## Q3

Find regular files larger than 10M.

### Solution

```bash
find . -type f -size +10M
```

---

## Q4

Find all JPG files and display their sizes.

### Solution

```bash
find . -type f -name "*.jpg" -exec ls -sh {} \;
```

---

## Q5

Find log files modified more than 30 days ago.

### Solution

```bash
find . -type f -name "*.log" -mtime +30
```

---

## Q6

Count regular files in your home directory.

### Solution

```bash
find "$HOME" -type f -print | wc -l
```

---

## Q7

Create a TAR archive named `logfiles.tar` containing `logfiles/`.

### Solution

```bash
tar -cvf logfiles.tar logfiles/
```

---

## Q8

Compress `logfiles.tar` using gzip.

### Solution

```bash
gzip logfiles.tar
```

Result:

```text
logfiles.tar.gz
```

---

## Q9

Decompress the gzip archive.

### Solution

```bash
gunzip logfiles.tar.gz
```

---

## Q10

Extract `logfiles.tar`.

### Solution

```bash
tar -xvf logfiles.tar
```

---

## Q11

Create a compressed tar archive in one command.

### Solution

```bash
tar -czvf logfiles.tar.gz logfiles/
```

---

## Q12

Find files modified within the last two complete 24-hour periods.

### Solution

```bash
find . -type f -mtime -2
```

---

## Q13

Show the total disk usage of the `logfiles` directory in human-readable form.

### Solution

```bash
du -sh logfiles/
```

---

## Q14

Find every regular file larger than 10M and display detailed information about it.

### Solution

```bash
find . -type f -size +10M -exec ls -lsh {} +
```

---

## Q15 — Exam Level

Find all `.log` files older than 30 days and display their human-readable sizes.

### Solution

```bash
find . -type f -name "*.log" -mtime +30 -exec ls -lh {} +
```

---

## Q16 — Exam Level

Find all JPG files larger than 10M.

### Solution

```bash
find . -type f -name "*.jpg" -size +10M -print
```

---

## Q17 — Exam Level

Create a Makefile target called `backup` that creates `backup.tar.gz` from the `logfiles/` directory.

### Solution

```make
backup:
	tar -czf backup.tar.gz logfiles/
```

Then run:

```bash
make backup
```

---

# 60. Final Cheat Sheet

```text
SEARCH
find .
find . -type f
find . -type d
find . -name "*.txt"
find . -type f -name "*.log"
find . -type f -mtime -2
find . -type f -mtime +30
find . -type f -size +10M
find . -type f -exec ls -lh {} \;
find . -type f -exec ls -lh {} +

COUNT
find "$HOME" -type f -print | wc -l

DISK USAGE
du -sh directory/

PACKAGE
tar -cvf archive.tar folder/

LIST TAR
tar -tvf archive.tar

EXTRACT TAR
tar -xvf archive.tar

GZIP
gzip archive.tar
gunzip archive.tar.gz

BZIP2
bzip2 archive.tar
bzip2 -d archive.tar.bz2

XZ
xz archive.tar
xz -d archive.tar.xz

TAR + GZIP
tar -czvf archive.tar.gz folder/
tar -xzvf archive.tar.gz

ZIP
zip -r archive.zip folder/
unzip archive.zip

MAKE
make target

Makefile:
target:
	command
```

## One-Line Memory Trick

```text
find = SEARCH
tar  = PACKAGE
gzip/bzip2/xz = COMPRESS
du = DISK USAGE
make = AUTOMATE
``` 
```
