---
layout: default
title: "L3.2 - Redirections"
---

# L3.2 - Redirections

# Linux Shell Redirection, Pipes, `/dev/null`, `tee`, and `diff`

## 1. Redirecting Standard Error — `2>`

### What is `2>`?

In Linux, every command normally has three standard file descriptors:

| File Descriptor | Name | Purpose |
|---:|---|---|
| `0` | stdin | Input |
| `1` | stdout | Normal output |
| `2` | stderr | Error output |

The operator:

```bash
2>
```

redirects **standard error (`stderr`)** to a file.

### Syntax

```bash
command 2> file
```

Example:

```bash
ls /does-not-exist 2> error.txt
```

The error message will go into `error.txt` instead of appearing on the terminal.

Check it:

```bash
cat error.txt
```

### Important

`2>` redirects **only stderr**.

Normal output still appears on the terminal.

For example:

```bash
ls /etc /does-not-exist 2> error.txt
```

Possible behavior:

```text
normal /etc listing appears on terminal
```

while the error:

```text
ls: cannot access '/does-not-exist': No such file or directory
```

goes into:

```text
error.txt
```

---

## 2. Redirect stdout and stderr to Different Files

```bash
command > file1 2> file2
```

Here:

- `>` redirects stdout.
- `2>` redirects stderr.

Example:

```bash
ls /etc /does-not-exist > output.txt 2> error.txt
```

Now:

```text
output.txt
```

contains normal output.

And:

```text
error.txt
```

contains error output.

### Mental Model

Think of the command as having two output channels:

```text
                 ┌── stdout (1) ──> output.txt
command ─────────┤
                 └── stderr (2) ──> error.txt
```

This is useful when you want to keep successful output and errors separate.

---

# 3. Redirecting Standard Input — `<`

The operator:

```bash
<
```

redirects a file into **stdin**.

### Syntax

```bash
command < file
```

Instead of the command receiving input from the keyboard, it receives input from the file.

Example:

```bash
cat < students.txt
```

This means:

```text
students.txt
     ↓
   stdin
     ↓
    cat
     ↓
  terminal
```

You could also write:

```bash
cat students.txt
```

For `cat`, these produce similar visible output, but they demonstrate different mechanisms.

---

## Example with `wc`

Suppose:

```text
students.txt
```

contains:

```text
Alice
Bob
Charlie
David
```

Run:

```bash
wc -l < students.txt
```

Output:

```text
4
```

Compare:

```bash
wc -l students.txt
```

Output:

```text
4 students.txt
```

Why the difference?

With:

```bash
wc -l students.txt
```

`wc` knows the filename.

With:

```bash
wc -l < students.txt
```

the file is connected to stdin, so `wc` simply receives input and does not receive the filename as an argument.

---

# 4. Redirect stdout and stderr to the Same File

## `> file 2>&1`

A very important pattern is:

```bash
command > file1 2>&1
```

This sends both:

- stdout
- stderr

to the same file.

Example:

```bash
ls /etc /does-not-exist > result.txt 2>&1
```

Now both normal output and error messages are stored in:

```text
result.txt
```

### How does it work?

Consider:

```bash
command > file1 2>&1
```

First:

```bash
> file1
```

means:

```text
stdout (1) → file1
```

Then:

```bash
2>&1
```

means:

```text
stderr (2) → wherever stdout (1) is currently going
```

Therefore:

```text
stdout ───────┐
              ├──> file1
stderr ───────┘
```

---

## Order Matters

These two commands are **not equivalent**:

```bash
command > file 2>&1
```

and:

```bash
command 2>&1 > file
```

### Correct way for both to go into the file

```bash
command > file 2>&1
```

Why?

Step 1:

```bash
> file
```

sets stdout to `file`.

Step 2:

```bash
2>&1
```

makes stderr point to the current stdout destination.

Therefore both go to `file`.

---

### Important Exam Trap

Do not think:

```bash
2>&1
```

means "send stderr to stdout dynamically forever."

It means:

> Make file descriptor 2 refer to the same current destination as file descriptor 1 at that point in the command.

Therefore order matters.

---

# 5. The Pipe Operator — `|`

The pipe is one of the most important concepts in Linux.

```bash
|
```

connects the **stdout of one command** to the **stdin of another command**.

### Syntax

```bash
command1 | command2
```

Mental model:

```text
command1
   │
   │ stdout
   ↓
  pipe
   │
   │ stdin
   ↓
command2
```

Example:

```bash
ls | wc -l
```

Here:

```text
ls
 ↓
pipe
 ↓
wc -l
```

`ls` produces a list.

`wc -l` counts the lines it receives.

---

## Example

```bash
cat students.txt | grep "Alice"
```

Flow:

```text
students.txt
     ↓
    cat
     ↓
   stdout
     ↓
     |
     ↓
   grep
     ↓
   output
```

However, remember that many commands can read files directly.

Instead of:

```bash
cat students.txt | grep "Alice"
```

prefer:

```bash
grep "Alice" students.txt
```

The first version is useful for learning pipes, but the second is generally simpler.

---

# 6. Pipe + Redirection

Consider:

```bash
command1 | command2 > file
```

This is extremely important.

The pipe connects:

```text
command1 stdout → command2 stdin
```

Then:

```bash
> file
```

redirects the stdout of `command2` into the file.

### Mental Model

```text
command1
   │
   │ stdout
   ↓
   |
   ↓
command2
   │
   │ stdout
   ↓
 file
```

Example:

```bash
ls /etc | grep "^a" > result.txt
```

What happens?

1. `ls /etc` generates output.
2. Its stdout goes through the pipe.
3. `grep "^a"` receives that output as stdin.
4. `grep` keeps matching lines.
5. `>` redirects grep's stdout to `result.txt`.

---

# 7. `/dev/null`

`/dev/null` is a special device file.

Anything written to it is discarded.

Think of it as:

> A black hole for data.

Example:

```bash
command > /dev/null
```

Normal output is discarded.

```text
command
   │
   ↓
stdout
   │
   ↓
/dev/null
   │
   ↓
discarded
```

---

## Discard Errors

```bash
command 2> /dev/null
```

This discards stderr.

Example:

```bash
ls /etc /does-not-exist 2> /dev/null
```

The error is suppressed.

---

## Discard Everything

```bash
command > /dev/null 2>&1
```

This discards both stdout and stderr.

Equivalent Bash shorthand:

```bash
command &> /dev/null
```

Example:

```bash
some_command > /dev/null 2>&1
```

The terminal stays silent.

---

## Why is `/dev/null` Useful?

It is commonly used when you do not care about output.

For example:

```bash
command 2> /dev/null
```

can suppress expected errors.

It is also useful in scripts where unwanted output should not clutter the terminal.

---

# 8. `tee`

The `tee` command is extremely useful when working with pipes.

Normally:

```bash
command1 | command2
```

sends the output of `command1` only into `command2`.

But sometimes you want to:

1. See/save the output.
2. Continue sending the same output through the pipeline.

That's what `tee` does.

### Basic Syntax

```bash
command | tee file
```

Example:

```bash
ls | tee output.txt
```

The output:

- appears on the terminal
- is also written to `output.txt`

### Mental Model

```text
             ┌──> terminal
             │
command ──> tee
             │
             └──> output.txt
```

`tee` splits the stream.

---

# 9. `tee` with Multiple Files

You can write the same output to multiple files:

```bash
command | tee file1 file2
```

Example:

```bash
ls | tee output1.txt output2.txt
```

The same output goes to:

```text
terminal
output1.txt
output2.txt
```

Mental model:

```text
                  ┌──> terminal
                  │
command ──> tee ──┼──> file1
                  │
                  └──> file2
```

---

# 10. `tee` in the Middle of a Pipeline

Consider:

```bash
command1 | tee file | command2
```

This means:

1. `command1` produces output.
2. `tee` receives it.
3. `tee` writes a copy to `file`.
4. `tee` also sends the same output to `command2`.
5. `command2` processes it.

### Mental Model

```text
                  ┌──> file
                  │
command1 ──> tee ─┤
                  │
                  ↓
              command2
```

Example:

```bash
ls | tee listing.txt | wc -l
```

Here:

- `ls` generates the listing.
- `tee` saves it to `listing.txt`.
- `tee` passes it onward.
- `wc -l` counts the lines.
- The count is displayed.

This is useful for **logging intermediate pipeline data**.

---

# 11. `tee` Append Mode

By default:

```bash
tee file
```

overwrites the file.

To append:

```bash
tee -a file
```

Example:

```bash
date | tee -a log.txt
```

Each execution adds the date to the end of `log.txt`.

Compare:

```bash
tee file
```

with:

```bash
tee -a file
```

| Command | Behavior |
|---|---|
| `tee file` | Overwrite file |
| `tee -a file` | Append to file |

---

# 12. `diff`

`diff` compares files and reports their differences.

### Basic Syntax

```bash
diff file1 file2
```

Example:

```bash
diff old.txt new.txt
```

If the files are identical, `diff` normally produces no output.

If they differ, `diff` reports the changes needed to transform one file into the other.

---

## Example

Suppose:

### `file1`

```text
Alice
Bob
Charlie
```

### `file2`

```text
Alice
Bob
David
```

Run:

```bash
diff file1 file2
```

You may see output similar to:

```text
3c3
< Charlie
---
> David
```

Meaning:

- line 3 differs
- `<` shows content from the first file
- `>` shows content from the second file

---

## Useful `diff` Options

### Unified format

```bash
diff -u file1 file2
```

This is commonly easier to read.

Example:

```text
--- file1
+++ file2
@@
 Alice
 Bob
-Charlie
+David
```

Here:

```text
- 
```

means removed/old content.

```text
+
```

means added/new content.

---

# 13. Complex Pipeline with `tee`

Consider:

```bash
command1 | tee file1 file2 | command2
```

Let's break it down.

### Step 1

```bash
command1
```

produces stdout.

### Step 2

Pipe sends that stdout to:

```bash
tee file1 file2
```

### Step 3

`tee` creates/writes:

```text
file1
file2
```

### Step 4

`tee` also sends the same output through its stdout.

### Step 5

The next pipe sends that output to:

```bash
command2
```

### Complete Flow

```text
                     ┌──> file1
                     │
command1 ──> tee ────┼──> file2
                     │
                     ↓
                 command2
```

This is a powerful pattern for:

> Save intermediate output while continuing to process it.

---

# 14. Important Redirection + Pipe Trap

Consider:

```bash
command1 > /dev/null | tee file1 file2 | command2
```

At first glance, you might think:

```text
command1 → /dev/null → tee → command2
```

But that is **not what happens**.

The redirection:

```bash
> /dev/null
```

redirects `command1`'s stdout directly to `/dev/null`.

Therefore there is nothing for the pipe to pass from `command1` to `tee`.

The flow is effectively:

```text
command1 stdout
      │
      ↓
 /dev/null
      │
      X
     no data
      │
      ↓
     tee
      │
      ├──> file1
      └──> file2
      │
      ↓
  command2
```

Since `tee` receives no input, it has no normal data to write to `file1` or `file2`, and it sends no normal data to `command2`.

---

# 15. Correct Interpretation of Redirection Precedence

Consider:

```bash
command1 > /dev/null | tee file1 file2 | command2
```

The important rule is:

> A pipe connects stdout to stdin, but an explicit stdout redirection on the command overrides the pipe connection.

Therefore:

```bash
command1 > /dev/null
```

means:

```text
command1 stdout → /dev/null
```

not:

```text
command1 stdout → tee
```

---

# 16. What About stderr?

This is different:

```bash
command1 2> /dev/null | tee file1 file2 | command2
```

Here only **stderr** is discarded.

The stdout of `command1` still goes into the pipe.

Mental model:

```text
                  stdout
command1 ─────────────────> tee
    │
    │ stderr
    ↓
/dev/null
```

Therefore:

```bash
command1 2> /dev/null | tee file1 file2 | command2
```

means:

- discard errors from `command1`
- preserve normal output
- send normal output to `tee`
- save it in `file1` and `file2`
- continue it to `command2`

This is very different from:

```bash
command1 > /dev/null | tee file1 file2 | command2
```

---

# 17. `>` vs `2>` vs `<` vs `|`

Memorize this table:

| Operator | Meaning |
|---|---|
| `>` | Redirect stdout |
| `1>` | Redirect stdout explicitly |
| `>>` | Append stdout |
| `2>` | Redirect stderr |
| `2>>` | Append stderr |
| `<` | Redirect stdin |
| `2>&1` | Send stderr to stdout's current destination |
| `|` | stdout of left command → stdin of right command |
| `/dev/null` | Discard input |
| `tee` | Copy input to file(s) and stdout |

---

# 18. Combining Everything

Suppose you want:

- normal output saved to `output.txt`
- errors saved to `error.txt`

Use:

```bash
command > output.txt 2> error.txt
```

If you want both in the same file:

```bash
command > output.txt 2>&1
```

If you want errors discarded:

```bash
command 2> /dev/null
```

If you want normal output discarded:

```bash
command > /dev/null
```

If you want everything discarded:

```bash
command > /dev/null 2>&1
```

If you want output passed to another command:

```bash
command1 | command2
```

If you want output saved and passed onward:

```bash
command1 | tee file | command2
```

If you want output saved to two files and passed onward:

```bash
command1 | tee file1 file2 | command2
```

---

# 19. Practical Example

Create test files:

```bash
printf "apple\nbanana\napple\norange\n" > fruits.txt
```

Now:

```bash
cat fruits.txt | grep "apple"
```

Output:

```text
apple
apple
```

Save it while continuing the pipeline:

```bash
cat fruits.txt | grep "apple" | tee apples.txt | wc -l
```

Output:

```text
2
```

And:

```bash
cat apples.txt
```

Output:

```text
apple
apple
```

Flow:

```text
fruits.txt
    ↓
   cat
    ↓
  grep
    ↓
   tee ─────> apples.txt
    ↓
  wc -l
    ↓
    2
```

---

# 20. Practical Error Example

Run:

```bash
ls /etc /does-not-exist
```

You get:

```text
normal listing...
ls: cannot access '/does-not-exist': No such file or directory
```

Separate them:

```bash
ls /etc /does-not-exist > output.txt 2> error.txt
```

Check:

```bash
cat output.txt
```

and:

```bash
cat error.txt
```

Combine them:

```bash
ls /etc /does-not-exist > all.txt 2>&1
```

Discard errors:

```bash
ls /etc /does-not-exist 2> /dev/null
```

---

# 21. Exam-Level Mental Model

Always ask:

### Question 1: What stream is involved?

```text
0 → stdin
1 → stdout
2 → stderr
```

### Question 2: Where is it going?

For example:

```bash
> file
```

means:

```text
stdout → file
```

```bash
2> file
```

means:

```text
stderr → file
```

```bash
< file
```

means:

```text
file → stdin
```

### Question 3: Is there a pipe?

```bash
command1 | command2
```

means:

```text
command1 stdout → command2 stdin
```

### Question 4: Is there an explicit redirection?

If yes, pay attention to which command it belongs to.

---

# 22. Common Mistakes

## Mistake 1

Thinking:

```bash
command > file
```

captures errors.

It does not.

Only stdout is redirected.

Use:

```bash
command > file 2>&1
```

for both.

---

## Mistake 2

Thinking `2>` means redirect stdout.

Wrong.

```bash
2>
```

means:

```text
stderr
```

---

## Mistake 3

Thinking `|` sends both stdout and stderr.

Normally it does not.

```bash
command1 | command2
```

connects stdout of `command1` to stdin of `command2`.

stderr normally remains connected to the terminal.

---

## Mistake 4

Confusing:

```bash
command > /dev/null | command2
```

with:

```bash
command 2> /dev/null | command2
```

They are completely different.

### First

```bash
command > /dev/null | command2
```

stdout is discarded, so `command2` receives no stdout from `command`.

### Second

```bash
command 2> /dev/null | command2
```

stderr is discarded, but stdout still flows into `command2`.

---

# 23. Quick Reference

```bash
# stdout → file
command > file

# stdout append
command >> file

# stderr → file
command 2> file

# stderr append
command 2>> file

# stdin ← file
command < file

# stdout → file, stderr → same file
command > file 2>&1

# discard stdout
command > /dev/null

# discard stderr
command 2> /dev/null

# discard stdout + stderr
command > /dev/null 2>&1

# pipe stdout
command1 | command2

# pipe and save output
command1 | tee file | command2

# save to multiple files and continue pipeline
command1 | tee file1 file2 | command2

# append using tee
command1 | tee -a file

# compare files
diff file1 file2

# easier-to-read diff
diff -u file1 file2
```

---

# 24. Practice Questions

## Q1 — Separate stdout and stderr

Write a command that executes:

```bash
ls /etc /does-not-exist
```

and stores:

- stdout → `out.txt`
- stderr → `err.txt`

### Solution

```bash
ls /etc /does-not-exist > out.txt 2> err.txt
```

---

## Q2 — Save everything in one file

```bash
ls /etc /does-not-exist
```

Save both stdout and stderr into:

```text
result.txt
```

### Solution

```bash
ls /etc /does-not-exist > result.txt 2>&1
```

---

## Q3 — Discard errors

Run:

```bash
ls /etc /does-not-exist
```

but hide the error message.

### Solution

```bash
ls /etc /does-not-exist 2> /dev/null
```

---

## Q4 — Count matching lines

Count how many processes contain the word `bash`:

```bash
ps -ef | grep bash
```

Modify the command so that only the number of matching lines is displayed.

### Solution

```bash
ps -ef | grep bash | wc -l
```

---

## Q5 — Save and continue

Run:

```bash
ps -ef
```

Save its output to:

```text
processes.txt
```

while simultaneously counting the number of lines.

### Solution

```bash
ps -ef | tee processes.txt | wc -l
```

---

## Q6 — Save to two files

Save the output of:

```bash
ps -ef
```

to both:

```text
processes1.txt
processes2.txt
```

while also displaying it on the terminal.

### Solution

```bash
ps -ef | tee processes1.txt processes2.txt
```

---

## Q7 — Save intermediate output

Find all lines containing `root` in `/etc/passwd`, save them to `root.txt`, and count them.

### Solution

```bash
grep "root" /etc/passwd | tee root.txt | wc -l
```

---

## Q8 — Understand this command

Explain:

```bash
command 2> /dev/null | tee file1 file2 | command2
```

### Answer

- `command`'s stderr is discarded.
- `command`'s stdout goes through the pipe.
- `tee` saves the stdout into `file1` and `file2`.
- `tee` also sends the same stdout to `command2`.
- `command2` receives it through stdin.

Flow:

```text
              stderr ─────> /dev/null

command
   │
   │ stdout
   ↓
  tee
  ├────> file1
  ├────> file2
  ↓
command2
```

---

## Q9 — Trick Question

What happens here?

```bash
command > /dev/null | tee file1 file2 | command2
```

### Answer

`command`'s stdout is redirected to `/dev/null`.

Therefore the pipe receives no stdout from `command`.

```text
command
   │
   ↓
/dev/null

tee receives no stdout
```

The important rule is:

> An explicit stdout redirection overrides the normal stdout-to-pipe connection.

---

## Q10 — Compare These

Explain the difference between:

```bash
command > /dev/null | tee file
```

and:

```bash
command 2> /dev/null | tee file
```

### Answer

#### First

```bash
command > /dev/null | tee file
```

stdout is discarded.

Therefore `tee` receives no stdout from `command`.

#### Second

```bash
command 2> /dev/null | tee file
```

stderr is discarded.

stdout is still sent through the pipe to `tee`.

This distinction is extremely important for shell exams.

---

# 25. Master Mental Model

The entire topic can be reduced to this:

```text
                 stdin (0)
                    ↑
                    │
             ┌─────────────┐
             │   command   │
             └─────────────┘
                    │
          ┌─────────┴─────────┐
          │                   │
     stdout (1)          stderr (2)
          │                   │
          ↓                   ↓
        pipe |             2> file
          │
          ↓
     next command
```

And:

```text
> file
```

means:

```text
stdout → file
```

```text
2> file
```

means:

```text
stderr → file
```

```text
< file
```

means:

```text
file → stdin
```

```text
|
```

means:

```text
stdout → stdin
```

```text
2>&1
```

means:

```text
stderr → current stdout destination
```

```text
/dev/null
```

means:

```text
discard the data
```

```text
tee
```

means:

```text
receive data
   │
   ├──> save a copy
   │
   └──> continue sending data
```

Once you understand **file descriptors + redirection + pipes**, almost every complex shell command in this topic becomes a matter of tracing where **stdin, stdout, and stderr** are going.
