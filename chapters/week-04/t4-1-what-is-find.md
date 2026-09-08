---
layout: default
title: "T4.1 What is find?"
---

# T4.1 What is find?



# Introduction to the `find` Command

The `find` command is a powerful Unix/Linux utility used to **search for files and directories** inside a directory tree based on specified criteria.

It can do much more than simply search. After finding matching files, `find` can also perform actions such as:

- Printing matched paths
- Deleting files
- Executing commands
- Searching by file type
- Searching by filename
- Limiting search depth
- Searching using timestamps
- Searching by file size
- Searching using regular expressions
- Combining multiple conditions

---

# 1. Basic Syntax

The general syntax is:

```bash
find <path> <conditions> <actions>
```

For example:

```bash
find . -type f -name "*.txt"
```

Breakdown:

```text
.                  → Start searching from current directory
-type f            → Look for regular files
-name "*.txt"      → Filename must end in .txt
```

---

# 2. What Does `find` Actually Do?

Suppose we have:

```text
project/
├── README.md
├── notes.txt
├── src/
│   ├── main.py
│   └── test.py
└── docs/
    ├── guide.md
    └── notes.txt
```

If we run:

```bash
find project
```

`find` recursively walks through the directory tree.

Conceptually:

```text
project
  ↓
README.md
notes.txt
src
  ↓
main.py
test.py
docs
  ↓
guide.md
notes.txt
```

Output:

```text
project
project/README.md
project/notes.txt
project/src
project/src/main.py
project/src/test.py
project/docs
project/docs/guide.md
project/docs/notes.txt
```

The important idea is:

> `find` searches recursively by default.

---

# 3. If No Path Is Provided

If the starting path is omitted, `find` normally searches the current directory.

For example:

```bash
find
```

is effectively:

```bash
find .
```

`.` means:

> current directory

Therefore:

```bash
find .
```

starts searching from the current directory.

---

# 4. `-type`

The `-type` condition filters results according to their filesystem type.

Common values are:

| Option | Meaning |
|---|---|
| `-type f` | Regular file |
| `-type d` | Directory |
| `-type l` | Symbolic link |

---

## 4.1 Find Regular Files

```bash
find . -type f
```

This finds all regular files below the current directory.

Example output:

```text
./README.md
./notes.txt
./src/main.py
./src/test.py
```

---

## 4.2 Find Directories

```bash
find . -type d
```

This finds directories.

Example:

```text
.
./src
./docs
./images
```

---

## 4.3 Find Symbolic Links

```bash
find . -type l
```

This finds symbolic links.

Example:

```text
./latest
./config
```

---

# 5. `-name`

`-name` matches filenames using a **case-sensitive shell-style pattern**.

Example:

```bash
find . -type f -name "*.txt"
```

Meaning:

```text
.           → search from current directory
-type f     → only regular files
-name       → filename condition
"*.txt"     → filename ending with .txt
```

Example directory:

```text
project/
├── notes.txt
├── README.md
├── data.txt
└── src/
    └── test.txt
```

Command:

```bash
find project -type f -name "*.txt"
```

Output:

```text
project/notes.txt
project/data.txt
project/src/test.txt
```

---

# 6. Why Do We Quote `"*.txt"`?

Use:

```bash
find . -name "*.txt"
```

rather than:

```bash
find . -name *.txt
```

The quotes prevent the **shell** from expanding `*.txt` before `find` receives it.

Without quotes, if the current directory contains:

```text
a.txt
b.txt
```

the shell might transform:

```bash
*.txt
```

into:

```bash
a.txt b.txt
```

before `find` runs.

With quotes:

```bash
"*.txt"
```

the pattern is passed directly to `find`.

### Rule

When using wildcard patterns with `find`:

```bash
find . -name "*.txt"
```

Prefer quoting the pattern.

---

# 7. `-iname`

`-iname` works like `-name`, but matching is **case-insensitive**.

Example:

```bash
find . -type f -iname "readme*"
```

This can match:

```text
README
README.md
readme
readme.txt
ReadMe.md
README.MD
```

depending on the filename.

### Difference

```bash
-name
```

is case-sensitive.

```bash
-iname
```

is case-insensitive.

Example:

```bash
find . -name "README.md"
```

does not normally match:

```text
README.MD
```

But:

```bash
find . -iname "README.md"
```

can match both:

```text
README.md
README.MD
```

---

# 8. `-mindepth`

`-mindepth` specifies the minimum search depth.

Example:

```bash
find . -mindepth 1 -type f
```

This prevents the starting point itself from being considered.

For example:

```bash
find . -mindepth 1 -maxdepth 1 -type f
```

means:

> Search only one level below the current directory and find regular files.

---

# 9. Understanding Search Depth

Suppose:

```text
project/
├── file1.txt
├── src/
│   └── file2.txt
└── src/
    └── tests/
        └── file3.txt
```

Think of depth like this:

```text
.                         depth 0
├── file1.txt             depth 1
├── src                    depth 1
│   └── file2.txt         depth 2
└── src/tests              depth 2
    └── file3.txt         depth 3
```

The exact displayed paths may vary, but the important mental model is:

```text
Starting directory → depth 0
Its contents       → depth 1
Their contents     → depth 2
and so on...
```

---

# 10. `-maxdepth`

`-maxdepth` limits how deep `find` is allowed to search.

Example:

```bash
find . -maxdepth 2 -type f
```

means:

> Search only up to depth 2.

It will not descend further into depth 3, 4, etc.

---

# 11. Combining `-mindepth` and `-maxdepth`

Example:

```bash
find . -mindepth 1 -maxdepth 1 -type f
```

This means:

```text
minimum depth = 1
maximum depth = 1
```

Therefore only direct children of the current directory are considered.

Suppose:

```text
project/
├── a.txt
├── b.txt
└── src/
    └── c.txt
```

Command:

```bash
find project -mindepth 1 -maxdepth 1 -type f
```

Output:

```text
project/a.txt
project/b.txt
```

It does not find:

```text
project/src/c.txt
```

because that file is deeper.

---

# 12. `-print`

`-print` prints the path of every matched item.

Example:

```bash
find . -type f -name "*.md" -print
```

Output might be:

```text
./README.md
./docs/guide.md
./notes/lesson.md
```

In most normal `find` implementations, when there is no explicit action such as `-print` or `-exec`, `-print` is the default action.

Therefore:

```bash
find . -type f -name "*.md"
```

and:

```bash
find . -type f -name "*.md" -print
```

normally produce the same visible results.

---

# 13. `-exec`

`-exec` allows us to execute another command for every matched item.

General syntax:

```bash
find <path> <conditions> -exec <command> {} \;
```

Here:

```text
{}    → replaced by the current matched pathname
\;    → marks the end of the -exec command
```

---

# 14. Basic `-exec` Example

Suppose we want to display information about every `.txt` file:

```bash
find . -type f -name "*.txt" -exec ls -l {} \;
```

For each matching file, `find` effectively runs something similar to:

```bash
ls -l ./file1.txt
ls -l ./file2.txt
ls -l ./docs/file3.txt
```

The `{}` is replaced by the matching pathname.

---

# 15. Understanding `{}`

Consider:

```bash
find . -type f -name "*.txt" -exec wc -l {} \;
```

Suppose matches are:

```text
./a.txt
./b.txt
./docs/c.txt
```

Conceptually, `find` executes:

```bash
wc -l ./a.txt
wc -l ./b.txt
wc -l ./docs/c.txt
```

So:

```text
{}
```

means:

> The current file found by `find`.

---

# 16. `\;`

This:

```bash
\;
```

terminates the `-exec` expression.

Example:

```bash
find . -type f -exec echo {} \;
```

The backslash prevents the shell from interpreting `;` as the end of the entire shell command.

Without the backslash:

```bash
find . -type f -exec echo {} ;
```

the shell would interpret `;` itself before `find` receives it.

---

# 17. `-exec ... {} \;` vs `-exec ... {} +`

There are two important forms:

```bash
-exec command {} \;
```

and:

```bash
-exec command {} +
```

### `\;`

Runs the command separately for each match.

Conceptually:

```bash
command file1
command file2
command file3
```

### `+`

Batches multiple matched files into fewer command executions.

Conceptually:

```bash
command file1 file2 file3
```

The exact batch size is chosen by `find` based on command-line limits.

---

# 18. Example of `\;`

```bash
find . -type f -name "*.log" -exec gzip {} \;
```

Conceptually:

```bash
gzip ./a.log
gzip ./b.log
gzip ./server.log
```

One command execution per file.

---

# 19. Example of `+`

```bash
find . -type f -name "*.log" -exec gzip {} +
```

Conceptually:

```bash
gzip ./a.log ./b.log ./server.log
```

or multiple batches if there are many files.

### General rule

Use:

```bash
-exec command {} \;
```

when you specifically need one execution per file.

Use:

```bash
-exec command {} +
```

when the command can accept multiple files and batching is appropriate.

`+` is often more efficient.

---

# 20. Finding and Deleting `.tmp` Files

Lecture example:

```bash
find . -type f -name "*.tmp" -exec rm -i {} \;
```

This means:

```text
.             → search from current directory
-type f       → regular files only
-name "*.tmp" → filenames ending in .tmp
-exec         → execute a command
rm -i         → interactively remove
{}            → current matched file
\;            → end -exec
```

The `-i` option asks for confirmation before deletion.

This is safer than immediately deleting everything.

---

# 21. Example

Suppose:

```text
project/
├── a.tmp
├── b.txt
└── logs/
    └── old.tmp
```

Command:

```bash
find project -type f -name "*.tmp" -exec rm -i {} \;
```

`find` identifies:

```text
project/a.tmp
project/logs/old.tmp
```

Then `rm -i` asks for confirmation for each matched file.

---

# 22. Finding and Compressing `.log` Files

Example:

```bash
find /tmp -type f -name "*.log" -exec gzip {} +
```

This finds regular files ending in `.log` and passes them to `gzip`.

Conceptually:

```text
find
 ↓
find *.log
 ↓
collect matching files
 ↓
gzip them
```

Because `+` is used, multiple files can be passed to `gzip` in batches.

---

# 23. Combining Multiple Conditions

`find` allows multiple conditions.

Example:

```bash
find . -type f -name "*.py"
```

means:

```text
regular file
AND
filename matches *.py
```

This is essentially an AND relationship.

Another example:

```bash
find . -type f -iname "*.jpg"
```

means:

```text
regular file
AND
case-insensitive filename match
```

---

# 24. Example Directory Tree

Create a practice structure:

```bash
mkdir -p find-demo/src/tests find-demo/docs find-demo/images
touch find-demo/README.md
touch find-demo/notes.txt
touch find-demo/src/main.py
touch find-demo/src/test.py
touch find-demo/src/tests/test_main.py
touch find-demo/docs/guide.md
touch find-demo/images/photo.jpg
touch find-demo/temp.tmp
```

Now the structure is:

```text
find-demo/
├── README.md
├── notes.txt
├── temp.tmp
├── src/
│   ├── main.py
│   ├── test.py
│   └── tests/
│       └── test_main.py
├── docs/
│   └── guide.md
└── images/
    └── photo.jpg
```

---

# 25. Practice `find` Commands

## Find everything

```bash
find find-demo
```

---

## Find regular files

```bash
find find-demo -type f
```

---

## Find directories

```bash
find find-demo -type d
```

---

## Find all `.txt` files

```bash
find find-demo -type f -name "*.txt"
```

---

## Find all Markdown files

```bash
find find-demo -type f -name "*.md"
```

---

## Find Python files

```bash
find find-demo -type f -name "*.py"
```

---

## Find files case-insensitively

```bash
find find-demo -type f -iname "*.PY"
```

This can find:

```text
main.py
test.py
test_main.py
```

---

## Find only direct files inside `find-demo`

```bash
find find-demo -mindepth 1 -maxdepth 1 -type f
```

Expected:

```text
find-demo/README.md
find-demo/notes.txt
find-demo/temp.tmp
```

---

## Search only up to depth 2

```bash
find find-demo -maxdepth 2 -type f
```

This does not descend into files/directories deeper than the specified maximum depth.

---

## Find and print Markdown files

```bash
find find-demo -type f -name "*.md" -print
```

---

## Find `.tmp` files interactively

```bash
find find-demo -type f -name "*.tmp" -exec rm -i {} \;
```

---

# 26. `find` Search Mental Model

Think about `find` as:

```text
START
  ↓
Where should I search?
  ↓
PATH
  ↓
What should I match?
  ↓
CONDITIONS
  ↓
What should I do with matches?
  ↓
ACTION
```

For example:

```bash
find /var/log -type f -name "*.log" -print
```

Mental parsing:

```text
START
 ↓
/var/log

FILTER
 ↓
-type f
 ↓
-name "*.log"

ACTION
 ↓
-print
```

---

# 27. `find` Syntax Patterns to Memorize

### Search everything from current directory

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

### Find symbolic links

```bash
find . -type l
```

### Find `.txt` files

```bash
find . -type f -name "*.txt"
```

### Case-insensitive filename search

```bash
find . -type f -iname "readme*"
```

### Search only direct children

```bash
find . -mindepth 1 -maxdepth 1 -type f
```

### Search up to depth 2

```bash
find . -maxdepth 2 -type f
```

### Explicitly print matches

```bash
find . -type f -name "*.md" -print
```

### Execute once per match

```bash
find . -type f -name "*.log" -exec gzip {} \;
```

### Execute in batches

```bash
find . -type f -name "*.log" -exec gzip {} +
```

### Find and interactively delete

```bash
find . -type f -name "*.tmp" -exec rm -i {} \;
```

---

# 28. Common Mistakes

## Mistake 1 — Forgetting quotes around wildcards

Avoid:

```bash
find . -name *.txt
```

Prefer:

```bash
find . -name "*.txt"
```

---

## Mistake 2 — Forgetting `-type`

This:

```bash
find . -name "*.txt"
```

can find matching directories as well as files.

If you specifically want regular files:

```bash
find . -type f -name "*.txt"
```

---

## Mistake 3 — Confusing `-name` and `-iname`

```bash
-name
```

is case-sensitive.

```bash
-iname
```

is case-insensitive.

---

## Mistake 4 — Forgetting `{}`

Incorrect:

```bash
find . -type f -exec rm \;
```

Correct:

```bash
find . -type f -exec rm {} \;
```

`{}` represents the current matched pathname.

---

## Mistake 5 — Forgetting `\;`

Incorrect:

```bash
find . -type f -exec echo {}
```

Correct:

```bash
find . -type f -exec echo {} \;
```

---

## Mistake 6 — Accidentally deleting files

Be careful with:

```bash
find . -type f -exec rm {} \;
```

It can delete every regular file under the starting path.

A safer approach for testing is:

```bash
find . -type f -exec echo rm {} \;
```

This only prints what would conceptually be executed.

Even safer for interactive deletion:

```bash
find . -type f -exec rm -i {} \;
```

---

# 29. `find` vs `grep`

These commands are often confused.

### `find`

Primarily searches the **filesystem structure**.

```bash
find . -type f -name "*.txt"
```

Question:

> Which files exist that satisfy these filesystem conditions?

### `grep`

Primarily searches **content**.

```bash
grep "ERROR" logfile.txt
```

Question:

> Which lines contain `ERROR`?

### Combining them

You can use:

```bash
find . -type f -name "*.log" -exec grep -l "ERROR" {} +
```

This means:

```text
find
 ↓
find all .log files
 ↓
grep their contents
 ↓
-l → print filenames containing ERROR
```

This is a very useful real-world pattern.

---

# 30. `find` vs `locate`

`find` searches the filesystem tree directly.

```bash
find /path -name "*.txt"
```

`locate` normally searches a prebuilt database.

```bash
locate notes.txt
```

General distinction:

```text
find
→ flexible
→ real-time filesystem traversal
→ many conditions/actions

locate
→ often much faster
→ database-based
→ may not immediately know about newly created files
```

For learning `find`, focus on its ability to combine:

```text
path
+
conditions
+
actions
```

---

# 31. Exam-Oriented Examples

## Question 1

Find all regular `.txt` files from the current directory.

```bash
find . -type f -name "*.txt"
```

---

## Question 2

Find all directories named `assets`.

```bash
find /var/www -type d -name "assets"
```

---

## Question 3

Find files named `README` regardless of case.

```bash
find . -type f -iname "readme"
```

---

## Question 4

Search only one level below the current directory.

```bash
find . -mindepth 1 -maxdepth 1 -type f
```

---

## Question 5

Find Python files up to depth 2.

```bash
find /project -maxdepth 2 -type f -name "*.py"
```

---

## Question 6

Find `.md` files and explicitly print them.

```bash
find . -type f -name "*.md" -print
```

---

## Question 7

Find `.tmp` files and interactively delete them.

```bash
find . -type f -name "*.tmp" -exec rm -i {} \;
```

---

## Question 8

Find `.log` files and compress them.

```bash
find . -type f -name "*.log" -exec gzip {} +
```

---

# 32. Advanced Mental Model

A useful way to read a `find` command is:

```text
find
 │
 ├── WHERE?
 │      └── starting path
 │
 ├── WHAT?
 │      ├── -type
 │      ├── -name
 │      ├── -iname
 │      ├── -mindepth
 │      └── -maxdepth
 │
 └── THEN WHAT?
        ├── -print
        └── -exec
```

For example:

```bash
find /tmp -type f -name "*.log" -exec gzip {} +
```

Read it naturally:

> Starting at `/tmp`, find regular files whose names end in `.log`, then execute `gzip` on the matched files in batches.

---

# 33. One-Line Summary of Every Important Option

```text
-type f
→ regular files

-type d
→ directories

-type l
→ symbolic links

-name
→ case-sensitive filename pattern

-iname
→ case-insensitive filename pattern

-mindepth N
→ don't consider anything shallower than N

-maxdepth N
→ don't search deeper than N

-print
→ print matched paths

-exec command {} \;
→ execute once per match

-exec command {} +
→ execute using batches of matches
```

---

# 34. Final Cheat Sheet

| Command | Meaning |
|---|---|
| `find .` | Search from current directory |
| `find /path` | Search from `/path` |
| `find . -type f` | Find regular files |
| `find . -type d` | Find directories |
| `find . -type l` | Find symbolic links |
| `find . -name "*.txt"` | Find `.txt` files |
| `find . -iname "readme*"` | Case-insensitive filename search |
| `find . -mindepth 1` | Minimum search depth 1 |
| `find . -maxdepth 2` | Maximum search depth 2 |
| `find . -type f -name "*.md" -print` | Find and print Markdown files |
| `find . -type f -exec ls -l {} \;` | Run `ls -l` for each match |
| `find . -type f -exec ls -l {} +` | Run `ls -l` in batches |
| `find . -type f -name "*.tmp" -exec rm -i {} \;` | Interactively delete `.tmp` files |
| `find . -type f -name "*.log" -exec gzip {} +` | Compress `.log` files |

---

# 35. The Most Important Pattern to Remember

```bash
find <WHERE> <WHAT_TO_FIND> <WHAT_TO_DO>
```

For example:

```bash
find . -type f -name "*.txt" -print
```

```text
WHERE
↓
.

WHAT
↓
-type f
-name "*.txt"

ACTION
↓
-print
```

And:

```bash
find . -type f -name "*.tmp" -exec rm -i {} \;
```

```text
WHERE
↓
.

WHAT
↓
regular files
whose names end in .tmp

ACTION
↓
rm -i each matched file
```

Once you understand this three-part model:

```text
PATH → CONDITIONS → ACTION
```

you can build and understand most `find` commands.