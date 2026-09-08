---
layout: default
title: "L6.3 - Bash Scripts - Part 01"
---

# L6.3 - Bash Scripts - Part 01



# Bash Script Execution, Shell Environment, Arguments, Loops, and grep

This lesson focuses on an important practical Bash topic:

- creating a script with `vi`
- executing a script
- sourcing a script
- understanding process IDs
- understanding parent and child shells
- understanding variable availability
- detecting how a script was invoked
- passing arguments
- using `if`
- using `for`
- using `grep` inside a `for` loop

The most important concept is the difference between:

```bash
source s1.sh
```

and:

```bash
./s1.sh
```

---

# 1. Creating a Script with `vi`

Create a script:

```bash
vi s1.sh
```

This opens `s1.sh` in the `vi` editor.

Enter Insert mode:

```text
i
```

Then type:

```bash
#!/bin/bash

echo "Hello World"
```

Press:

```text
Esc
```

Save and exit:

```vim
:wq
```

Now the file exists:

```bash
ls -l s1.sh
```

---

# 2. Running a Script with `source`

A script can be executed using:

```bash
source s1.sh
```

or:

```bash
. s1.sh
```

The `.` command is the short form of `source`.

These two are equivalent:

```bash
source s1.sh
```

```bash
. s1.sh
```

The important point is:

> The script is executed in the current shell.

---

# 3. Why Does `source` Matter?

Suppose your current shell has PID:

```bash
echo $$
```

Output might be:

```text
1234
```

Now source the script:

```bash
source s1.sh
```

Inside the script:

```bash
echo $$
```

will normally show:

```text
1234
```

because the script is executing in the same shell.

Mental model:

```text
Current Bash
PID = 1234
    │
    └── source s1.sh
             │
             └── executes inside PID 1234
```

No new Bash process is required simply to interpret the sourced script.

---

# 4. `echo $$`

The special Bash variable:

```bash
$$
```

represents the process ID (PID) associated with the current shell.

Example:

```bash
echo $$
```

Possible output:

```text
1234
```

This means the shell's PID is `1234`.

You can also write:

```bash
echo "Shell PID: $$"
```

Output:

```text
Shell PID: 1234
```

---

# 5. Executing a Script Using Its Path

Suppose we have:

```bash
s1.sh
```

To execute it using its relative path:

```bash
./s1.sh
```

However, the script needs execute permission.

Check:

```bash
ls -l s1.sh
```

You may see:

```text
-rw-r--r-- 1 user user ... s1.sh
```

There is no `x` permission.

---

# 6. Making the Script Executable

Use:

```bash
chmod +x s1.sh
```

Check again:

```bash
ls -l s1.sh
```

You may now see:

```text
-rwxr-xr-x 1 user user ... s1.sh
```

The `x` means execute permission.

Now:

```bash
./s1.sh
```

can execute the script directly.

---

# 7. `./s1.sh` vs `source s1.sh`

This is one of the most important concepts in this lesson.

## Source

```bash
source s1.sh
```

The script runs in the current shell.

## Execute

```bash
./s1.sh
```

The script is executed as a separate process, normally using the interpreter specified by the shebang.

Mental model:

```text
source s1.sh

Current Shell
     │
     └── s1.sh
         same shell environment
```

Whereas:

```text
./s1.sh

Current Shell
     │
     └── Script Process
             │
             └── Bash interprets script
```

---

# 8. PID Difference

Suppose your current shell has:

```bash
echo $$
```

Output:

```text
1000
```

Inside `s1.sh`:

```bash
echo $$
```

### If sourced

```bash
source s1.sh
```

The script will normally show:

```text
1000
```

### If executed

```bash
./s1.sh
```

The script normally runs as another process, so the shell-related PID value shown by `$$` will differ from the parent shell.

For example:

```text
Parent shell → 1000
Script shell → 1050
```

The exact numbers will vary.

---

# 9. Parent and Child Shell

When a script is executed as a separate process, the process hierarchy can look like:

```text
Terminal
  │
  └── Bash
       PID 1000
          │
          └── s1.sh
              PID 1050
```

The script process is a child of the shell that launched it.

You can inspect process relationships with:

```bash
ps --forest
```

---

# 10. `ps --forest`

`ps` displays process information.

The:

```bash
--forest
```

option displays processes in a tree-like hierarchy.

Example:

```bash
ps --forest
```

Possible conceptual output:

```text
PID   TTY      TIME     CMD
1000  pts/0    00:00    bash
1050  pts/0    00:00     \_ bash ./s1.sh
```

The exact output depends on your system.

The important idea is:

```text
bash
└── script process
```

---

# 11. Put `ps --forest` Inside the Script

Suppose `s1.sh` contains:

```bash
#!/bin/bash

echo "Script PID: $$"

ps --forest
```

Run:

```bash
./s1.sh
```

You may see a hierarchy similar to:

```text
bash
└── bash ./s1.sh
    └── ps --forest
```

This allows you to visually inspect the process relationship.

---

# 12. Shell Variables and Script Execution

This is another extremely important concept.

Suppose we have:

```bash
#!/bin/bash

course="Linux"
echo "Inside script: $course"
```

If we execute:

```bash
./s1.sh
```

the variable is created in the script's process/environment.

After the script finishes:

```bash
echo "$course"
```

in the parent shell will generally show nothing.

Why?

Because the child process cannot modify the parent's shell variables.

Mental model:

```text
Parent shell
course=""

       │
       └── ./s1.sh
              │
              └── course="Linux"
                    │
                    └── script exits
                           │
                           └── variable disappears
```

---

# 13. Sourcing and Variable Availability

Now consider:

```bash
#!/bin/bash

course="Linux"
```

Run:

```bash
source s1.sh
```

Then:

```bash
echo "$course"
```

Output:

```text
Linux
```

Why?

Because the assignment happened in the current shell.

Mental model:

```text
Current shell
     │
     ├── source s1.sh
     │
     ├── course="Linux"
     │
     └── continues running
```

The variable remains available.

---

# 14. Important Rule

Remember:

```text
./script.sh
     ↓
separate process
     ↓
changes normally do not affect parent shell
```

Whereas:

```text
source script.sh
     ↓
current shell
     ↓
changes affect current shell
```

This applies not only to variables but also to things such as:

- current directory
- shell options
- functions
- aliases
- shell state

For example, if a script contains:

```bash
cd /tmp
```

then:

```bash
source script.sh
```

can change your current directory.

But:

```bash
./script.sh
```

does not change the parent shell's working directory after the script exits.

---

# 15. Detecting How a Script Was Invoked

Inside a script, you can inspect:

```bash
echo "$0"
```

`$0` contains the name/path used for the shell or script invocation.

For example, if executed as:

```bash
./s1.sh
```

you may see:

```text
./s1.sh
```

If invoked with:

```bash
bash s1.sh
```

you may see:

```text
s1.sh
```

The exact representation depends on how the script was invoked.

---

# 16. `$0` Is Not a Reliable "Source Detector"

A useful distinction:

```bash
echo "$0"
```

tells you the shell/script invocation name, but `$0` alone is **not a reliable universal test** for whether the script was sourced.

For example, when a script is sourced:

```bash
source s1.sh
```

`$0` commonly remains the name of the current shell, such as:

```text
bash
```

rather than becoming `s1.sh`.

So:

```text
$0
 ↓
invocation name

not necessarily
 ↓
"Was I sourced?"
```

---

# 17. A Better Way to Detect Sourcing in Bash

Bash provides:

```bash
BASH_SOURCE
```

A commonly used test is:

```bash
if [[ "${BASH_SOURCE[0]}" != "$0" ]]
then
    echo "Script was sourced"
else
    echo "Script was executed"
fi
```

Conceptually:

```text
BASH_SOURCE[0]
     ↓
current script source filename

$0
     ↓
top-level invocation name
```

When the script is sourced, these can differ.

---

# 18. Script Arguments

Scripts can receive arguments from the command line.

Suppose:

```bash
#!/bin/bash

echo "Script: $0"
echo "First argument: $1"
echo "Second argument: $2"
```

Run:

```bash
./s1.sh Linux Bash
```

Output:

```text
Script: ./s1.sh
First argument: Linux
Second argument: Bash
```

---

# 19. Positional Parameters

Important Bash positional parameters:

```text
$0
$1
$2
$3
...
$9
```

Meaning:

```text
$0 → script/invocation name
$1 → first argument
$2 → second argument
$3 → third argument
```

Example:

```bash
./s1.sh one two three
```

gives:

```text
$0 = ./s1.sh
$1 = one
$2 = two
$3 = three
```

---

# 20. `$#`

`$#` tells you how many positional arguments were supplied.

Example:

```bash
#!/bin/bash

echo "Number of arguments: $#"
```

Run:

```bash
./s1.sh one two three
```

Output:

```text
Number of arguments: 3
```

---

# 21. `$@`

`$@` represents all positional arguments.

Example:

```bash
#!/bin/bash

echo "$@"
```

Run:

```bash
./s1.sh Linux Bash Shell
```

Output:

```text
Linux Bash Shell
```

For scripting, the quoted form:

```bash
"$@"
```

is especially important because it preserves each original argument as a separate word.

Example:

```bash
for arg in "$@"
do
    echo "Argument: $arg"
done
```

---

# 22. `for` Loop

A `for` loop allows us to repeatedly execute commands.

Basic syntax:

```bash
for variable in values
do
    commands
done
```

Example:

```bash
for name in Alice Bob Charlie
do
    echo "$name"
done
```

Output:

```text
Alice
Bob
Charlie
```

---

# 23. Using Arguments with a `for` Loop

A very common pattern is:

```bash
for arg in "$@"
do
    echo "$arg"
done
```

Run:

```bash
./s1.sh one two "three four"
```

Output:

```text
one
two
three four
```

Because `"$@"` preserves the arguments separately.

---

# 24. `for` Loop with Files

Suppose the directory contains:

```text
a.txt
b.txt
c.txt
```

You can write:

```bash
for file in *.txt
do
    echo "$file"
done
```

Output:

```text
a.txt
b.txt
c.txt
```

Here `*.txt` is expanded by the shell before the loop body executes.

---

# 25. `grep` Inside a `for` Loop

One powerful pattern is to iterate through files and use `grep` on each one.

Suppose:

```text
logs/
├── app.log
├── server.log
└── database.log
```

We want to check each log file for:

```text
ERROR
```

Script:

```bash
#!/bin/bash

for file in logs/*.log
do
    echo "Checking: $file"

    grep "ERROR" "$file"
done
```

This means:

```text
for each .log file
        ↓
run grep
        ↓
search for ERROR
```

---

# 26. `grep -q` Inside a Loop

If we only want to know whether `ERROR` exists:

```bash
#!/bin/bash

for file in logs/*.log
do
    if grep -q "ERROR" "$file"
    then
        echo "ERROR found in $file"
    else
        echo "No ERROR in $file"
    fi
done
```

The `-q` option means:

> quiet mode

`grep` does not print matching lines.

Instead, we use its exit status.

```text
grep finds match
     ↓
exit status 0
     ↓
if condition succeeds
```

No match:

```text
grep
 ↓
non-zero status
 ↓
else
```

---

# 27. Why `grep` Works with `if`

Bash `if` does not require the condition to be only `[ ... ]`.

A command itself can be the condition.

Example:

```bash
if grep -q "ERROR" "$file"
then
    echo "Found"
else
    echo "Not found"
fi
```

The `if` statement checks the command's exit status.

Remember:

```text
0
↓
success

non-zero
↓
failure / false condition
```

---

# 28. `grep` + `for` Practical Script

```bash
#!/bin/bash

for file in *.log
do
    if grep -q "ERROR" "$file"
    then
        echo "$file: ERROR found"
    else
        echo "$file: no ERROR"
    fi
done
```

Example output:

```text
app.log: ERROR found
server.log: no ERROR
database.log: ERROR found
```

---

# 29. Searching for Multiple Patterns

You can use `grep -E`:

```bash
for file in *.log
do
    if grep -Eq "ERROR|FATAL" "$file"
    then
        echo "$file contains a serious error"
    fi
done
```

Here:

```text
-E
 ↓
Extended Regular Expressions

-q
 ↓
quiet
```

So:

```bash
grep -Eq "ERROR|FATAL" "$file"
```

means:

> Quietly search the file for either `ERROR` or `FATAL`.

---

# 30. Complete Example

Let's combine:

- shebang
- PID
- `$0`
- arguments
- `$#`
- `for`
- `if`
- `grep`
- `ps`

Create:

```bash
vi s1.sh
```

Enter:

```bash
#!/bin/bash

echo "Script name: $0"
echo "PID: $$"
echo "Arguments: $#"

ps --forest

for file in "$@"
do
    if [ -f "$file" ]
    then
        if grep -q "ERROR" "$file"
        then
            echo "$file: ERROR found"
        else
            echo "$file: no ERROR found"
        fi
    else
        echo "$file: not a regular file"
    fi
done
```

Make executable:

```bash
chmod +x s1.sh
```

Run:

```bash
./s1.sh app.log server.log database.log
```

The script:

```text
$0
 ↓
knows script name

$$
 ↓
knows script PID

$#
 ↓
knows argument count

"$@"
 ↓
iterates over arguments

-f
 ↓
checks regular file

grep -q
 ↓
checks for ERROR

ps --forest
 ↓
shows process hierarchy
```

---

# 31. Source the Same Script

You can also run:

```bash
source s1.sh app.log server.log
```

or:

```bash
. s1.sh app.log server.log
```

The positional arguments are supplied to the sourced script for that invocation.

Because it is sourced, commands execute in the current shell.

This is why scripts that are intended to be sourced should be written carefully: commands such as:

```bash
cd
unset
export
alias
exit
```

can affect the shell from which they are sourced.

---

# 32. `exit` vs `return` in Sourced Scripts

This is an important practical warning.

If an executable script contains:

```bash
exit 1
```

that exits the script's process.

But if a sourced script contains:

```bash
exit 1
```

it can exit the **current interactive shell**.

Therefore, scripts intended to be sourced should generally use:

```bash
return 1
```

where appropriate instead of `exit`.

This is an important distinction when writing reusable Bash configuration files.

---

# 33. Process Tree Mental Model

### Executing

```bash
./s1.sh
```

Conceptually:

```text
Terminal
   │
   └── Bash
       PID 1000
          │
          └── s1.sh
              PID 1050
```

The script is a separate process.

### Sourcing

```bash
source s1.sh
```

Conceptually:

```text
Terminal
   │
   └── Bash
       PID 1000
          │
          └── executes commands from s1.sh
              in the same shell
```

No separate script shell is required merely because the file is being sourced.

---

# 34. Important PID Detail: `$$` and Subshells

For basic shell scripting, remember:

```bash
$$
```

identifies the shell's PID.

However, in Bash, `$$` is not always the best way to identify the PID of the currently executing Bash process in every subshell situation.

For example, Bash provides:

```bash
$BASHPID
```

which identifies the PID of the current Bash process.

This distinction matters in advanced process/subshell debugging.

For the basic `source` vs executable-script lesson, the important idea is:

```text
source
 ↓
same shell

./script.sh
 ↓
separate script process
```

---

# 35. Common Mistakes

## Mistake 1: Trying `./s1.sh` without execute permission

You may get:

```text
Permission denied
```

Fix:

```bash
chmod +x s1.sh
```

Then:

```bash
./s1.sh
```

---

## Mistake 2: Confusing `source` with execution

These are not equivalent:

```bash
source s1.sh
```

```bash
./s1.sh
```

The first modifies the current shell's state.

The second normally runs separately.

---

## Mistake 3: Forgetting to quote `"$@"`

Prefer:

```bash
for arg in "$@"
do
    echo "$arg"
done
```

rather than:

```bash
for arg in $@
```

because the quoted version preserves argument boundaries.

---

## Mistake 4: Forgetting to quote filenames

Prefer:

```bash
grep "ERROR" "$file"
```

rather than:

```bash
grep "ERROR" $file
```

This is especially important when filenames contain spaces.

---

## Mistake 5: Using `grep` output as the condition

Instead of:

```bash
if grep "ERROR" "$file"
```

you can use:

```bash
if grep -q "ERROR" "$file"
```

when you only need to know whether a match exists.

`-q` avoids unnecessary output.

---

# 36. Exam Questions

## Q1

How do you create a Bash script using `vi`?

### Answer

```bash
vi s1.sh
```

Then press:

```text
i
```

to enter Insert mode, write the script, press:

```text
Esc
```

and save:

```vim
:wq
```

---

## Q2

How do you make a script executable?

### Answer

```bash
chmod +x s1.sh
```

---

## Q3

What is the difference between:

```bash
source s1.sh
```

and:

```bash
./s1.sh
```

### Answer

```text
source s1.sh
→ runs in the current shell

./s1.sh
→ executes the script as a separate process
```

---

## Q4

What does `$$` represent?

### Answer

```bash
$$
```

represents the PID associated with the current shell.

---

## Q5

What does `$0` represent?

### Answer

It contains the shell/script invocation name.

For a script invoked as:

```bash
./s1.sh
```

it commonly contains:

```text
./s1.sh
```

---

## Q6

What does `$#` represent?

### Answer

The number of positional arguments.

---

## Q7

What does `$@` represent?

### Answer

All positional arguments.

In scripts, the quoted form:

```bash
"$@"
```

preserves each argument as a separate word.

---

## Q8

What is the purpose of:

```bash
ps --forest
```

### Answer

It displays processes in a tree-like hierarchy, making parent-child process relationships easier to understand.

---

## Q9

Why can a variable created by `./s1.sh` disappear after the script finishes?

### Answer

Because the script normally runs in a separate process. Its shell variables belong to that process and do not modify the parent shell.

---

## Q10

Why does a variable remain available after:

```bash
source s1.sh
```

### Answer

Because the commands execute in the current shell.

---

## Q11

Write a loop that processes every command-line argument.

### Answer

```bash
for arg in "$@"
do
    echo "$arg"
done
```

---

## Q12

Write a script that checks every `.log` file for `ERROR`.

### Answer

```bash
#!/bin/bash

for file in *.log
do
    if grep -q "ERROR" "$file"
    then
        echo "$file: ERROR found"
    fi
done
```

---

# 37. Final Cheat Sheet

```text
CREATE SCRIPT
vi s1.sh

SAVE AND EXIT VI
Esc
:wq

MAKE EXECUTABLE
chmod +x s1.sh

EXECUTE
./s1.sh

SOURCE
source s1.sh
. s1.sh

CURRENT SHELL PID
echo $$

PROCESS TREE
ps --forest

SCRIPT/INVOCATION NAME
echo "$0"

FIRST ARGUMENT
echo "$1"

SECOND ARGUMENT
echo "$2"

NUMBER OF ARGUMENTS
echo "$#"

ALL ARGUMENTS
echo "$@"

PREFERRED ARGUMENT ITERATION
for arg in "$@"
do
    echo "$arg"
done

COMMAND SUBSTITUTION
result=$(command)

IF
if condition
then
    commands
fi

FOR
for item in values
do
    commands
done

GREP
grep "ERROR" file

QUIET GREP
grep -q "ERROR" file

GREP AS IF CONDITION
if grep -q "ERROR" "$file"
then
    echo "Found"
fi
```

# 38. The Most Important Concept

Memorize this diagram:

```text
                 BASH SHELL
                    │
          ┌─────────┴─────────┐
          │                   │
    source s1.sh          ./s1.sh
          │                   │
          ↓                   ↓
   SAME SHELL            NEW PROCESS
          │                   │
          ↓                   ↓
   Variables remain      Variables disappear
   in current shell      when process exits
          │                   │
          ↓                   ↓
      same shell PID       different process
```

And for processing files:

```text
"$@"
  ↓
for loop
  ↓
each file
  ↓
if
  ↓
grep -q
  ↓
exit status
  ↓
found / not found
```

This combination is the foundation for writing practical Bash automation scripts.
