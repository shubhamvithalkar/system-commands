---
layout: default
title: "L3.1 - Combining commands and files"
---

# L3.1 - Combining commands and files

# Shell Command Combination, Subshells, File Descriptors, and Redirection

## 1. Combining Commands in the Shell

The shell allows us to execute multiple commands together.

For example:

```bash
pwd
ls
date
```

These are three separate commands.

Instead of writing them on separate lines, commands can be combined using shell operators.

Important operators include:

```text
;
&&
||
()
```

Each has a different meaning.

---

# 2. `;` — Execute Commands Sequentially

The semicolon:

```bash
;
```

allows multiple commands to be written on one line.

Example:

```bash
pwd; ls; date
```

The shell executes:

```text
pwd
 ↓
ls
 ↓
date
```

The next command executes **regardless of whether the previous command succeeded or failed**.

---

## Example

```bash
echo "First"; echo "Second"; echo "Third"
```

Output:

```text
First
Second
Third
```

---

## Failure Does Not Stop Execution

Consider:

```bash
ls /does/not/exist; echo "Hello"
```

The `ls` command fails, but:

```text
Hello
```

is still printed.

Mental model:

```text
command1
   ↓
regardless of result
   ↓
command2
   ↓
regardless of result
   ↓
command3
```

---

# 3. `&&` — Execute Only if Previous Command Succeeds

The operator:

```bash
&&
```

means:

> Execute the next command only if the previous command succeeds.

Example:

```bash
mkdir test && cd test
```

If:

```bash
mkdir test
```

succeeds, then:

```bash
cd test
```

runs.

If `mkdir` fails, `cd test` is not executed.

---

## Why Is `&&` Useful?

It allows us to create a dependency between commands.

For example:

```bash
mkdir project && cd project
```

Mental model:

```text
command1
   |
   | success?
   ↓
  YES
   |
   ↓
command2
```

---

## Multiple `&&`

You can chain many commands:

```bash
mkdir project && cd project && touch app.py
```

This means:

```text
mkdir project
     ↓ success
cd project
     ↓ success
touch app.py
```

If any command fails, subsequent commands in the chain are skipped.

---

# 4. `||` — Execute if Previous Command Fails

The operator:

```bash
||
```

means:

> Execute the next command only if the previous command fails.

Example:

```bash
mkdir test || echo "Could not create directory"
```

If `mkdir test` succeeds:

```text
echo
```

does not execute.

If `mkdir test` fails:

```text
Could not create directory
```

is printed.

---

## Mental Model

```text
command1
   |
   | failed?
   ↓
  YES
   |
   ↓
command2
```

---

# 5. `&&` vs `||`

This distinction is extremely important.

### `&&`

```bash
command1 && command2
```

means:

> Run `command2` if `command1` succeeds.

### `||`

```bash
command1 || command2
```

means:

> Run `command2` if `command1` fails.

---

## Example

```bash
mkdir data && echo "Created"
```

If creation succeeds:

```text
Created
```

---

```bash
mkdir data || echo "Creation failed"
```

If creation fails:

```text
Creation failed
```

---

# 6. Combining `;`, `&&`, and `||`

You can combine these operators.

Example:

```bash
mkdir project && cd project; echo "Done"
```

Conceptually:

```text
mkdir project
     |
     | success
     ↓
cd project
     |
     ↓
echo "Done"
```

The semicolon separates the next command regardless of the previous command's result.

For complicated expressions, use parentheses to make the intended grouping explicit.

---

# 7. `()` — Execute Commands in a Subshell

Parentheses can be used to group commands:

```bash
(command1; command2; command3)
```

The commands inside the parentheses execute in a **subshell**.

Example:

```bash
(cd /tmp; pwd)
```

The `cd` occurs inside the subshell.

After the subshell exits, the parent shell's working directory is unchanged.

---

# 8. What Is a Subshell?

A subshell is a child shell environment created by the current shell to execute a group of commands.

Think:

```text
Parent Shell
     |
     +------→ Subshell
                |
                +-- command1
                +-- command2
                +-- command3
```

The subshell has its own execution context.

This is particularly important for:

- Variables
- Current directory
- Shell state
- Process execution
- Grouped commands

---

# 9. Subshell Example with `cd`

Suppose you are currently in:

```text
/home/user
```

Run:

```bash
(cd /tmp; pwd)
```

Output:

```text
/tmp
```

Now run:

```bash
pwd
```

You are still in:

```text
/home/user
```

Why?

Because:

```text
cd /tmp
```

happened inside the subshell.

The parent shell was not changed.

---

# 10. Subshell vs Current Shell

Compare:

### Parentheses

```bash
(cd /tmp)
pwd
```

The `cd` occurs in a subshell.

The parent remains in its original directory.

---

### No Parentheses

```bash
cd /tmp
pwd
```

Now `cd` runs in the current shell.

Therefore:

```text
pwd
```

prints:

```text
/tmp
```

---

# 11. `$BASH_SUBSHELL`

Bash provides the special variable:

```bash
$BASH_SUBSHELL
```

It indicates the current subshell nesting level in Bash.

Check it:

```bash
echo $BASH_SUBSHELL
```

At the top-level Bash shell, it normally starts at:

```text
0
```

---

## Example

```bash
echo $BASH_SUBSHELL
(echo $BASH_SUBSHELL)
```

Typical output:

```text
0
1
```

The parentheses created a subshell.

Therefore:

```text
Parent shell
BASH_SUBSHELL=0
      |
      ↓
Subshell
BASH_SUBSHELL=1
```

---

# 12. Subshells Within Subshells

Subshells can be nested.

Example:

```bash
echo $BASH_SUBSHELL
(
    echo $BASH_SUBSHELL
    (
        echo $BASH_SUBSHELL
    )
)
```

Typical output:

```text
0
1
2
```

Mental model:

```text
Level 0
Parent shell
   |
   ↓
Level 1
Subshell
   |
   ↓
Level 2
Nested subshell
```

---

# 13. Why Subshells Matter

Subshells are useful when you want to temporarily change the shell environment.

For example:

```bash
(
    cd /var/log
    ls
)
```

The commands execute in `/var/log`, but your original shell directory remains unchanged.

This is useful in scripts because it lets you create an isolated command group.

---

# 14. `&&` and `||` Demonstration

Consider:

```bash
true && echo "Success"
```

Output:

```text
Success
```

`true` returns exit status:

```text
0
```

which means success.

---

Now:

```bash
false && echo "Success"
```

There is no output.

Why?

Because:

```text
false → failure
```

Therefore the `&&` command is skipped.

---

## `||` Example

```bash
false || echo "Failed"
```

Output:

```text
Failed
```

Because `false` failed.

But:

```bash
true || echo "Failed"
```

produces no output from the `echo`.

---

# 15. `true` and `false`

These commands are useful when learning command combinations.

```bash
true
```

returns success:

```text
exit status = 0
```

while:

```bash
false
```

returns failure:

```text
exit status = non-zero
```

Check:

```bash
true
echo $?
```

Output:

```text
0
```

Then:

```bash
false
echo $?
```

Output:

```text
1
```

This is why they are useful for demonstrating:

```text
&&
||
```

---

# 16. File Descriptors

A Linux process normally has three standard file descriptors.

```text
0 → stdin
1 → stdout
2 → stderr
```

These are extremely important for shell redirection.

---

# 17. Standard Input — `stdin` — File Descriptor 0

```text
stdin = 0
```

Standard input is where a command normally receives input.

Usually:

```text
Keyboard
   ↓
stdin (0)
   ↓
Command
```

Example:

```bash
cat
```

`cat` reads from standard input if no filename is supplied.

Type:

```text
Hello
Linux
```

Then press:

```text
Ctrl-D
```

to signal end-of-input in this context.

---

# 18. Standard Output — `stdout` — File Descriptor 1

```text
stdout = 1
```

Standard output is where normal command output goes.

Normally:

```text
Command
   ↓
stdout (1)
   ↓
Terminal
```

Example:

```bash
echo "Hello"
```

Output appears on the terminal.

---

# 19. Standard Error — `stderr` — File Descriptor 2

```text
stderr = 2
```

Error and diagnostic messages are normally sent to standard error.

Example:

```bash
ls /does-not-exist
```

The error message is sent through:

```text
stderr
```

not normal stdout.

---

# 20. The Three Standard File Descriptors

Memorize:

```text
0 → stdin
1 → stdout
2 → stderr
```

Mental model:

```text
                  ┌─────────────┐
Keyboard ───────→ │ stdin (0)   │
                  │             │
                  │   COMMAND   │
                  │             │
Terminal ←─────── │ stdout (1)  │
                  │             │
Terminal ←─────── │ stderr (2)  │
                  └─────────────┘
```

---

# 21. Output Redirection — `>`

The operator:

```bash
>
```

redirects standard output to a file.

Example:

```bash
ls > files.txt
```

Normally:

```text
ls
 ↓
Terminal
```

After redirection:

```text
ls
 ↓
stdout
 ↓
files.txt
```

The terminal does not receive the normal output.

---

# 22. `command > file`

General syntax:

```bash
command > file
```

means:

> Run the command and write its standard output into `file`.

Example:

```bash
date > date.txt
```

Then:

```bash
cat date.txt
```

might show:

```text
Tue Sep  8 16:24:00 IST 2026
```

---

# 23. Important: `>` Overwrites the File

This is a very important rule.

Suppose:

```bash
echo "Hello" > output.txt
```

Then:

```bash
cat output.txt
```

shows:

```text
Hello
```

Now:

```bash
echo "World" > output.txt
```

The previous contents are replaced.

Now:

```bash
cat output.txt
```

shows:

```text
World
```

Therefore:

```text
> → overwrite/create
```

---

# 24. `cat > file`

The command:

```bash
cat > file
```

can be used to create a file interactively.

Example:

```bash
cat > notes.txt
```

Now type:

```text
Linux is powerful.
I am learning shell commands.
```

When finished, press:

```text
Ctrl-D
```

This signals EOF.

The contents are written to:

```text
notes.txt
```

---

# 25. What Is Happening in `cat > file`?

Break it down:

```text
cat
```

reads standard input.

```text
>
```

redirects standard output to a file.

Therefore:

```text
Keyboard
   ↓
stdin
   ↓
cat
   ↓
stdout
   ↓
notes.txt
```

This is a very important example of how Unix pipelines and redirection work.

---

# 26. `cat`

The basic command:

```bash
cat
```

with no filename reads from standard input and writes to standard output.

Therefore:

```bash
cat
```

behaves approximately like:

```text
stdin → cat → stdout
```

If you type:

```text
Hello
```

it outputs:

```text
Hello
```

This continues until EOF.

---

# 27. `cat file`

When a filename is supplied:

```bash
cat file
```

`cat` reads the file and sends its contents to standard output.

Example:

```bash
cat notes.txt
```

Mental model:

```text
notes.txt
   ↓
 cat
   ↓
stdout
   ↓
Terminal
```

---

# 28. Append Output — `>>`

The operator:

```bash
>>
```

redirects standard output to a file **by appending**.

Example:

```bash
echo "First" > output.txt
echo "Second" >> output.txt
```

Now:

```bash
cat output.txt
```

produces:

```text
First
Second
```

---

# 29. `>` vs `>>`

This is one of the most important exam concepts.

### `>`

```bash
command > file
```

Creates or overwrites the file.

```text
OLD CONTENT
    ↓
  REPLACED
```

### `>>`

```bash
command >> file
```

Creates the file if necessary and appends to the existing contents.

```text
OLD CONTENT
    +
NEW CONTENT
```

---

# 30. Practical Example

Start with:

```bash
echo "Line 1" > output.txt
```

File:

```text
Line 1
```

Append:

```bash
echo "Line 2" >> output.txt
```

File:

```text
Line 1
Line 2
```

Append again:

```bash
echo "Line 3" >> output.txt
```

File:

```text
Line 1
Line 2
Line 3
```

---

# 31. Multiple Commands Appending to the Same File

You can run:

```bash
command1 >> file
command2 >> file
command3 >> file
```

For example:

```bash
date >> system.log
whoami >> system.log
pwd >> system.log
```

All three commands append their standard output to:

```text
system.log
```

---

# 32. Combining Commands and Append Redirection

You can also write:

```bash
command1 >> file; command2 >> file; command3 >> file
```

For example:

```bash
date >> report.txt; whoami >> report.txt; pwd >> report.txt
```

Each command's standard output is appended to the same file.

Conceptually:

```text
date
 ↓
stdout
 ↓
report.txt

whoami
 ↓
stdout
 ↓
report.txt

pwd
 ↓
stdout
 ↓
report.txt
```

---

# 33. `cat >> file`

Just as:

```bash
cat > file
```

creates/overwrites a file from interactive input,

```bash
cat >> file
```

allows you to **append interactive input** to a file.

Example:

```bash
cat >> notes.txt
```

Type:

```text
This is another note.
This line is appended.
```

Press:

```text
Ctrl-D
```

Now those lines are appended to the existing file.

---

# 34. `cat > file` vs `cat >> file`

### `cat > file`

```text
stdin
  ↓
cat
  ↓
overwrite file
```

### `cat >> file`

```text
stdin
  ↓
cat
  ↓
append to file
```

This distinction is extremely important.

---

# 35. Output Redirection Does Not Automatically Redirect Errors

Consider:

```bash
ls /does-not-exist > output.txt
```

The normal standard output goes to:

```text
output.txt
```

But the error message normally still appears on the terminal because it is sent to:

```text
stderr (2)
```

Remember:

```text
stdout → 1
stderr → 2
```

Therefore:

```text
> file
```

normally redirects **stdout**, not stderr.

---

# 36. Redirecting `stderr`

To redirect standard error:

```bash
command 2> errors.txt
```

Example:

```bash
ls /does-not-exist 2> errors.txt
```

Now the error message is stored in:

```text
errors.txt
```

---

# 37. Append `stderr`

Use:

```bash
command 2>> errors.txt
```

This appends error output instead of overwriting.

---

# 38. Redirect Both Standard Output and Standard Error

A common Bash syntax is:

```bash
command > output.txt 2>&1
```

Meaning:

```text
stdout → output.txt
stderr → same destination as stdout
```

Modern Bash also supports:

```bash
command &> output.txt
```

for redirecting both stdout and stderr.

---

# 39. File Descriptor Mental Model

Remember:

```text
0 → stdin
1 → stdout
2 → stderr
```

Therefore:

```bash
command > file
```

is essentially:

```bash
command 1> file
```

because `stdout` is file descriptor `1`.

Similarly:

```bash
command 2> file
```

redirects `stderr`.

---

# 40. `hwinfo`

`hwinfo` is a command-line utility used to display information about hardware.

Example:

```bash
hwinfo
```

Depending on the system and installation, it can display information about hardware such as:

- CPU
- Memory
- Storage
- Network devices
- USB devices
- Graphics hardware
- PCI devices

You may need to install it on systems where it is not already present.

On Debian/Ubuntu-based systems:

```bash
sudo apt install hwinfo
```

Then:

```bash
hwinfo
```

---

## 41. Useful `hwinfo` Examples

Display CPU-related information:

```bash
hwinfo --cpu
```

Display memory:

```bash
hwinfo --memory
```

Display network information:

```bash
hwinfo --network
```

Display USB devices:

```bash
hwinfo --usb
```

The exact output depends on the hardware and operating system.

---

# 42. Redirecting `hwinfo` Output

Because `hwinfo` produces normal output through stdout, you can save it:

```bash
hwinfo > hardware.txt
```

Then inspect it:

```bash
cat hardware.txt
```

You can also append:

```bash
hwinfo --cpu >> hardware.txt
```

---

# 43. Practical Exercise: Command Combination

Try:

```bash
echo "Step 1"; echo "Step 2"; echo "Step 3"
```

Then:

```bash
true && echo "Success"
```

Then:

```bash
false && echo "Success"
```

Then:

```bash
false || echo "Command failed"
```

Finally:

```bash
true || echo "Command failed"
```

Observe which commands execute.

---

# 44. Practical Exercise: Subshell

First:

```bash
pwd
```

Then:

```bash
(cd /tmp; pwd)
```

Then:

```bash
pwd
```

Notice that the final `pwd` returns to your original directory.

Now test:

```bash
echo $BASH_SUBSHELL
(echo $BASH_SUBSHELL)
(echo $BASH_SUBSHELL; (echo $BASH_SUBSHELL))
```

Typical output:

```text
0
1
1
2
```

---

# 45. Practical Exercise: Output Redirection

Run:

```bash
echo "Hello Linux" > test.txt
```

Check:

```bash
cat test.txt
```

Then:

```bash
echo "Second line" >> test.txt
```

Check:

```bash
cat test.txt
```

Expected:

```text
Hello Linux
Second line
```

Now overwrite:

```bash
echo "New content" > test.txt
```

Check:

```bash
cat test.txt
```

Expected:

```text
New content
```

---

# 46. Practical Exercise: `cat >`

Run:

```bash
cat > practice.txt
```

Type:

```text
Linux
Shell
Commands
```

Press:

```text
Ctrl-D
```

Then:

```bash
cat practice.txt
```

You should see:

```text
Linux
Shell
Commands
```

Now append:

```bash
cat >> practice.txt
```

Type:

```text
This was appended.
```

Press:

```text
Ctrl-D
```

Then:

```bash
cat practice.txt
```

Expected:

```text
Linux
Shell
Commands
This was appended.
```

---

# 47. Common Mistakes

## Mistake 1 — Confusing `>` and `>>`

```bash
echo hello > file
```

overwrites.

```bash
echo hello >> file
```

appends.

---

## Mistake 2 — Thinking `&&` Means "And Regardless of Result"

It does not.

```bash
command1 && command2
```

means:

> Run command2 only when command1 succeeds.

---

## Mistake 3 — Thinking `||` Means OR in the Normal Programming Sense

The shell uses exit status.

```bash
command1 || command2
```

means:

> Run command2 if command1 fails.

---

## Mistake 4 — Forgetting `Ctrl-D` with `cat`

When using:

```bash
cat > file
```

or:

```bash
cat >> file
```

you need an EOF signal to finish interactive input.

Usually:

```text
Ctrl-D
```

at an appropriate point.

---

## Mistake 5 — Thinking `>` Redirects Errors

This:

```bash
command > output.txt
```

redirects stdout.

Errors normally go through:

```text
stderr (2)
```

To redirect errors:

```bash
command 2> errors.txt
```

---

## Mistake 6 — Thinking a Subshell Changes the Parent Shell

This:

```bash
(cd /tmp)
```

does not permanently change the parent's directory.

The `cd` happened inside the subshell.

---

# 48. Exam-Oriented Questions

## Question 1

What is the difference between:

```bash
;
```

and:

```bash
&&
```

### Answer

```text
;  → execute the next command regardless of previous status
&& → execute the next command only if previous command succeeds
```

---

## Question 2

What does this do?

```bash
mkdir test && cd test
```

### Answer

It changes into `test` only if creating `test` succeeds.

---

## Question 3

What does this do?

```bash
mkdir test || echo "Failed"
```

### Answer

It prints `Failed` only if `mkdir test` fails.

---

## Question 4

What does:

```bash
(cd /tmp)
```

do?

### Answer

It creates a subshell and changes that subshell's working directory to `/tmp`.

The parent shell's directory is unchanged.

---

## Question 5

What does `$BASH_SUBSHELL` represent?

### Answer

In Bash, it indicates the current subshell nesting level.

Typically:

```text
0 → top-level shell
1 → one subshell
2 → nested subshell
```

---

## Question 6

What are the three standard file descriptors?

### Answer

```text
0 → stdin
1 → stdout
2 → stderr
```

---

## Question 7

What does this do?

```bash
ls > files.txt
```

### Answer

It redirects `ls`'s standard output into `files.txt`, creating or overwriting the file.

---

## Question 8

What does this do?

```bash
ls >> files.txt
```

### Answer

It appends `ls`'s standard output to `files.txt`.

---

## Question 9

What does this do?

```bash
cat > file.txt
```

### Answer

It reads text from standard input and writes it to `file.txt`, replacing the file's previous contents if it already exists.

---

## Question 10

What does:

```bash
cat >> file.txt
```

do?

### Answer

It reads text from standard input and appends it to `file.txt`.

---

## Question 11

What does:

```bash
command 2> error.txt
```

do?

### Answer

It redirects standard error (file descriptor 2) into `error.txt`.

---

## Question 12

What does:

```bash
command > output.txt 2>&1
```

do?

### Answer

It sends both stdout and stderr to `output.txt`.

---

# 49. Master Mental Model

The shell provides several independent mechanisms:

```text
COMMAND COMBINATION
│
├── ;       → always continue
├── &&      → continue on success
└── ||      → continue on failure
```

```text
GROUPING
│
└── ( ... ) → execute group in subshell
```

```text
STANDARD STREAMS
│
├── 0 → stdin
├── 1 → stdout
└── 2 → stderr
```

```text
REDIRECTION
│
├── >       → stdout → file, overwrite
├── >>      → stdout → file, append
├── 2>      → stderr → file, overwrite
├── 2>>     → stderr → file, append
└── 2>&1    → stderr → same destination as stdout
```

---

# 50. Final Quick Reference

```bash
# Command combination

command1; command2
# Run command2 regardless of command1's status

command1 && command2
# Run command2 only if command1 succeeds

command1 || command2
# Run command2 only if command1 fails


# Subshell

(command1; command2)

echo $BASH_SUBSHELL


# File descriptors

0 → stdin
1 → stdout
2 → stderr


# Output redirection

command > file
# stdout → file, overwrite

command >> file
# stdout → file, append

command 2> file
# stderr → file, overwrite

command 2>> file
# stderr → file, append

command > file 2>&1
# stdout + stderr → file


# Interactive file creation

cat > file
# type content, Ctrl-D to finish

cat >> file
# append content, Ctrl-D to finish


# Hardware information

hwinfo
hwinfo --cpu
hwinfo --memory
hwinfo --network
hwinfo --usb
```

## The Most Important Concepts to Remember

```text
;   = do the next command anyway

&&  = do the next command if SUCCESS

||  = do the next command if FAILURE

()  = run grouped commands in a SUBSHELL

0   = stdin
1   = stdout
2   = stderr

>   = overwrite/create

>>  = append

cat > file
    = interactive input → new/overwritten file

cat >> file
    = interactive input → appended to file
```

A powerful way to visualize the shell is:

```text
                    SHELL
                      |
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
    COMMANDS       SUBSHELL      STREAMS
        |             |             |
    ; && ||        ( ... )      0  1  2
                                    |
                              ┌─────┼─────┐
                              ↓     ↓     ↓
                            stdin stdout stderr
                              |     |     |
                              |     |     |
                              ↓     ↓     ↓
                           input    >     2>
                                    >>    2>>
```

Once you understand **exit status + subshells + file descriptors + redirection**, a large part of shell scripting becomes much easier to reason about.
