---
layout: default
title: "L 5.1 - $hell variables"
---

# L 5.1 - $hell variables


# Shell Variables, Special Variables, `echo`, Environment, `PATH`, and `ps`

## 1. Introduction

A **shell variable** is a variable maintained by the shell that stores information which can be used by commands and shell scripts.

For example:

```bash
echo $USER
```

may produce:

```text
shubham
```

Here:

- `USER` is the variable name.
- `$USER` means "expand the value stored in `USER`".
- `echo` prints that value.

Shell variables are extremely important in Bash scripting because they allow scripts to work with:

- usernames
- home directories
- paths
- process IDs
- command-line arguments
- exit statuses
- shell options
- environment configuration

---

# 2. Frequently Used Shell Variables

Some variables are already provided by the shell/environment.

The most commonly encountered ones are:

| Variable | Meaning |
|---|---|
| `$USER` | Current username |
| `$HOME` | Current user's home directory |
| `$PATH` | Directories searched for executable commands |
| `$PWD` | Current working directory |
| `$HOSTNAME` | System hostname |

---

## 2.1 `$USER`

`$USER` usually contains the current username.

```bash
echo $USER
```

Example output:

```text
shubham
```

You can also write:

```bash
echo "Current user: $USER"
```

Output:

```text
Current user: shubham
```

---

## 2.2 `$HOME`

`$HOME` contains the path of the current user's home directory.

```bash
echo $HOME
```

Example:

```text
/home/shubham
```

Instead of hardcoding:

```bash
cd /home/shubham
```

you can write:

```bash
cd "$HOME"
```

This is better because the script works for different users.

For example:

```bash
echo "My home directory is $HOME"
```

---

## 2.3 `$PWD`

`$PWD` contains the current working directory.

```bash
echo $PWD
```

Example:

```text
/home/shubham/projects
```

You can compare it with:

```bash
pwd
```

Both normally show the current working directory.

Example:

```bash
pwd
echo $PWD
```

Possible output:

```text
/home/shubham/projects
/home/shubham/projects
```

---

## 2.4 `$HOSTNAME`

`$HOSTNAME` usually contains the hostname of the machine.

```bash
echo $HOSTNAME
```

Example:

```text
ubuntu
```

You can also use:

```bash
hostname
```

---

# 3. `$PATH`

`$PATH` is one of the most important shell variables.

It tells the shell **where to search for executable commands**.

Check it:

```bash
echo $PATH
```

Example:

```text
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

The directories are separated by `:`.

Conceptually:

```text
$PATH

/usr/local/sbin
        ↓
/usr/local/bin
        ↓
/usr/sbin
        ↓
/usr/bin
        ↓
/sbin
        ↓
/bin
```

When you type:

```bash
date
```

the shell searches directories listed in `$PATH` until it finds an executable named `date`.

For example:

```text
/usr/local/bin/date     ← maybe
/usr/bin/date           ← found
```

Then the shell executes it.

---

## 3.1 Why `$PATH` Is Useful

Without `$PATH`, you would often need to specify the complete path of commands.

Instead of:

```bash
/usr/bin/date
```

you can normally type:

```bash
date
```

because `/usr/bin` is usually present in `$PATH`.

Check where a command comes from:

```bash
which date
```

Example:

```text
/usr/bin/date
```

You can also use:

```bash
type date
```

Example:

```text
date is /usr/bin/date
```

---

# 4. Special Shell Variables

Shell provides several variables with special meanings.

Some important ones are:

| Variable | Meaning |
|---|---|
| `$0` | Name/path used to invoke the script or shell context |
| `$1` ... `$9` | First through ninth positional arguments |
| `$#` | Number of positional arguments |
| `$-` | Current shell flags/options |
| `$@` | All positional arguments |
| `$?` | Exit status of previous command |
| `$$` | PID of the current shell |

These are particularly important in shell scripting.

---

# 5. `$$` — PID of the Current Shell

`$$` contains the process ID (**PID**) of the current shell.

```bash
echo $$
```

Example:

```text
24531
```

The exact number will be different on every system.

You can verify it with:

```bash
ps
```

or:

```bash
echo $$
```

The shell itself is a process, so it has a PID.

---

## 5.1 What Is a PID?

PID means:

> Process ID

Every running process is normally assigned a unique process ID by the operating system.

For example:

```text
bash       → PID 24531
firefox    → PID 5321
sleep      → PID 8124
```

`$$` lets the shell tell you its own PID.

---

## 5.2 Example

```bash
echo "My shell PID is $$"
```

Output:

```text
My shell PID is 24531
```

This is useful in shell scripts for:

- identifying the current shell
- creating unique temporary filenames
- debugging processes
- understanding parent/child processes

For example:

```bash
echo "log-$$.txt"
```

could produce:

```text
log-24531.txt
```

---

# 6. `$?` — Exit Status of the Last Command

`$?` contains the exit status of the **most recently executed command**.

This is extremely important in shell scripting.

Run:

```bash
true
echo $?
```

Output:

```text
0
```

`0` normally means:

> Success

Now:

```bash
false
echo $?
```

Output:

```text
1
```

A non-zero value normally indicates:

> Failure or another non-success condition

---

# 7. Exit Status Examples

Consider:

```bash
echo "Hello"
echo $?
```

Output:

```text
Hello
0
```

`echo` succeeded, so its exit status is `0`.

Now:

```bash
ls /does-not-exist
echo $?
```

Possible output:

```text
ls: cannot access '/does-not-exist': No such file or directory
2
```

The exact non-zero status depends on the command.

---

## 7.1 Important Rule

`$?` changes after every command.

For example:

```bash
false
echo "Hello"
echo $?
```

The final `$?` is the status of:

```bash
echo "Hello"
```

not `false`.

Therefore, if you want to save an exit status:

```bash
false
status=$?

echo "Status was: $status"
```

Output:

```text
Status was: 1
```

---

# 8. Using `$?` in Scripts

Exit statuses are heavily used in conditional logic.

For example:

```bash
mkdir test
if [ $? -eq 0 ]; then
    echo "Directory created"
else
    echo "Failed"
fi
```

A more common and cleaner approach is:

```bash
if mkdir test; then
    echo "Directory created"
else
    echo "Failed"
fi
```

The shell automatically checks the command's exit status.

---

# 9. `$-` — Shell Flags

`$-` contains the current shell's option/flag characters.

Run:

```bash
echo $-
```

Example:

```text
himBH
```

The exact characters depend on the shell and its configuration.

Common Bash flags include:

| Flag | Meaning |
|---|---|
| `i` | Interactive shell |
| `h` | Hashall |
| `m` | Monitor mode |
| `B` | Brace expansion |
| `H` | History expansion |

---

## 9.1 Checking Whether Shell Is Interactive

You may see:

```bash
echo $-
```

If the output contains:

```text
i
```

the shell is interactive.

For example:

```text
himBH
```

contains `i`, so this is an interactive shell.

---

# 10. `$0`, `$1` to `$9`, `$#`, `$@`

These variables are particularly important when writing shell scripts.

Suppose we create:

```bash
script.sh
```

and run:

```bash
./script.sh apple banana cherry
```

Then:

```text
$0       → ./script.sh
$1       → apple
$2       → banana
$3       → cherry
$#       → 3
$@       → apple banana cherry
```

---

## 10.1 `$0`

`$0` represents how the script or shell was invoked.

Example:

```bash
#!/bin/bash

echo "Script name: $0"
```

Run:

```bash
./script.sh
```

Output may be:

```text
Script name: ./script.sh
```

---

## 10.2 `$1` to `$9`

These represent positional arguments.

Example:

```bash
#!/bin/bash

echo "First: $1"
echo "Second: $2"
echo "Third: $3"
```

Run:

```bash
./script.sh apple banana cherry
```

Output:

```text
First: apple
Second: banana
Third: cherry
```

---

## 10.3 `$#`

`$#` tells you how many positional arguments were supplied.

Script:

```bash
echo "Number of arguments: $#"
```

Run:

```bash
./script.sh apple banana cherry
```

Output:

```text
Number of arguments: 3
```

---

## 10.4 `$@`

`$@` represents all positional arguments.

Example:

```bash
echo "$@"
```

Run:

```bash
./script.sh apple banana cherry
```

Output:

```text
apple banana cherry
```

A very important practical form is:

```bash
for arg in "$@"; do
    echo "$arg"
done
```

This processes each argument separately.

---

# 11. `echo` Command

`echo` prints text or expanded variable values to standard output.

Basic syntax:

```bash
echo [options] [arguments]
```

Example:

```bash
echo Hello
```

Output:

```text
Hello
```

---

# 12. `echo` with Multiple Arguments

You can provide multiple arguments:

```bash
echo Hello World
```

Output:

```text
Hello World
```

Another example:

```bash
echo Linux Shell Programming
```

Output:

```text
Linux Shell Programming
```

The shell passes multiple arguments to `echo`, and `echo` normally separates them with spaces in its output.

---

# 13. `echo` with Quotes

Quotes control how the shell interprets text.

## Double quotes

```bash
echo "Hello World"
```

Output:

```text
Hello World
```

Double quotes allow variable expansion:

```bash
echo "User: $USER"
```

Output:

```text
User: shubham
```

---

## Single quotes

```bash
echo 'Hello World'
```

Output:

```text
Hello World
```

Single quotes preserve the text literally.

For example:

```bash
echo '$USER'
```

Output:

```text
$USER
```

The variable is **not expanded**.

---

# 14. Single Quotes vs Double Quotes

This distinction is extremely important.

```bash
echo "$USER"
```

Example output:

```text
shubham
```

But:

```bash
echo '$USER'
```

Output:

```text
$USER
```

Mental model:

```text
"$USER"
   ↓
expand variable
   ↓
shubham
```

Whereas:

```text
'$USER'
   ↓
treat everything literally
   ↓
$USER
```

---

# 15. Escaping `$` with `\$`

A backslash can prevent `$` from being interpreted as variable expansion.

Example:

```bash
echo \$USER
```

Output:

```text
$USER
```

You can also use:

```bash
echo "The variable is \$USER"
```

Output:

```text
The variable is $USER
```

Normally:

```bash
echo "The variable is $USER"
```

might produce:

```text
The variable is shubham
```

But:

```bash
echo "The variable is \$USER"
```

produces:

```text
The variable is $USER
```

---

# 16. Nested Quotes and `echo`

Quotes can become confusing when different types are combined.

For example:

```bash
echo 'hello "world"'
```

Output:

```text
hello "world"
```

The double quotes are literal characters because the entire string is inside single quotes.

Similarly:

```bash
echo "hello 'world'"
```

Output:

```text
hello 'world'
```

The single quotes are literal characters because the string is inside double quotes.

---

## 16.1 Example

```bash
echo 'hello "world"'
```

The shell sees:

```text
'hello "world"'
```

The outer single quotes define the shell string.

Therefore the inner double quotes are simply characters.

---

# 17. Multi-line `echo`

A shell command can contain escaped newline characters.

For example:

```bash
echo -e "Hello\nWorld"
```

Output:

```text
Hello
World
```

`-e` tells some implementations of `echo` to interpret escape sequences such as `\n`.

However, `echo` behavior for options and escape sequences can vary between shells.

For portable scripting, `printf` is generally preferred.

Example:

```bash
printf "Hello\nWorld\n"
```

Output:

```text
Hello
World
```

---

# 18. Expanding Variables with `echo`

You can use `echo` to inspect variables.

```bash
echo $USER
```

```bash
echo $HOME
```

```bash
echo $PATH
```

```bash
echo $PWD
```

```bash
echo $HOSTNAME
```

Example:

```bash
echo "User: $USER"
echo "Home: $HOME"
echo "Directory: $PWD"
echo "Host: $HOSTNAME"
```

Possible output:

```text
User: shubham
Home: /home/shubham
Directory: /home/shubham/projects
Host: ubuntu
```

---

# 19. `printenv`

`printenv` displays environment variables.

Run:

```bash
printenv
```

You may see:

```text
USER=shubham
HOME=/home/shubham
PATH=/usr/local/bin:/usr/bin:/bin
PWD=/home/shubham
HOSTNAME=ubuntu
...
```

You can request a specific variable:

```bash
printenv USER
```

Output:

```text
shubham
```

Or:

```bash
printenv HOME
```

Output:

```text
/home/shubham
```

---

# 20. `env`

`env` can display the current environment.

```bash
env
```

Example:

```text
USER=shubham
HOME=/home/shubham
PATH=/usr/local/bin:/usr/bin:/bin
...
```

It can also be used to run a command with a modified environment.

For example:

```bash
env VAR=hello bash
```

This starts a shell with `VAR` set in its environment.

Inside that shell:

```bash
echo $VAR
```

Output:

```text
hello
```

---

# 21. `set`

`set` is different from `printenv`.

In Bash:

```bash
set
```

displays shell variables, functions, and other shell state.

Because the output can be very large:

```bash
set | less
```

is often easier to inspect.

---

## 21.1 Important Difference

Think of these commands like this:

```text
printenv
   ↓
environment variables

env
   ↓
environment variables / run command with modified environment

set
   ↓
shell variables + functions + shell state
```

A shell variable does not automatically become an environment variable.

---

# 22. Shell Variables vs Environment Variables

Suppose:

```bash
MYVAR="hello"
```

This creates a shell variable.

Check:

```bash
echo "$MYVAR"
```

Output:

```text
hello
```

But to export it to child processes:

```bash
export MYVAR
```

Now `MYVAR` is part of the environment inherited by child processes.

You can combine creation and export:

```bash
export MYVAR="hello"
```

Then:

```bash
printenv MYVAR
```

Output:

```text
hello
```

Mental model:

```text
Shell
  |
  |-- shell variables
  |
  |-- environment variables
          |
          ↓
     inherited by child processes
```

---

# 23. `date`

The `date` command displays the current date and time.

```bash
date
```

Example:

```text
Tue Sep  8 09:30:12 IST 2026
```

The exact output depends on your system's timezone and configuration.

---

# 24. `date -R`

`-R` displays the date in RFC-style format.

```bash
date -R
```

Example:

```text
Tue, 08 Sep 2026 09:30:12 +0530
```

This format includes:

- day of week
- day
- month
- year
- time
- timezone offset

---

# 25. Running an Unaliased Command

Sometimes a command has been aliased.

For example, someone may create:

```bash
alias date='date --iso-8601=seconds'
```

Now:

```bash
date
```

runs through the alias.

To bypass an alias, you can use:

```bash
\date
```

Example:

```bash
\date
```

The backslash tells the shell not to use the alias for that command name.

---

## 25.1 Using the Full Path

Another way is to specify the executable's full path:

```bash
/usr/bin/date
```

This directly invokes that executable.

So if:

```bash
alias date='something'
```

exists:

```bash
date
```

may use the alias.

But:

```bash
\date
```

bypasses the alias.

And:

```bash
/usr/bin/date
```

directly invokes `/usr/bin/date`.

---

## 25.2 Finding the Full Path

Use:

```bash
which date
```

Example:

```text
/usr/bin/date
```

Or:

```bash
type date
```

If an alias exists, `type` can reveal it:

```text
date is aliased to `date --iso-8601=seconds`
```

---

# 26. Understanding `$PATH` in Detail

Suppose:

```bash
echo $PATH
```

returns:

```text
/usr/local/bin:/usr/bin:/bin
```

When you execute:

```bash
date
```

the shell effectively searches:

```text
/usr/local/bin/date
        ↓
/usr/bin/date
        ↓
/bin/date
```

It stops when it finds a suitable executable.

This is why commands can normally be executed without typing their full paths.

---

# 27. Special Variables Quick Table

| Variable | Meaning |
|---|---|
| `$0` | Script/command invocation name |
| `$1` | First argument |
| `$2` | Second argument |
| `$3` | Third argument |
| `$1 ... $9` | Positional arguments 1–9 |
| `$#` | Number of positional arguments |
| `$@` | All positional arguments |
| `$?` | Previous command's exit status |
| `$$` | Current shell PID |
| `$-` | Current shell flags |

---

# 28. `ps` — Process Status

`ps` is used to display information about running processes.

Basic command:

```bash
ps
```

Example:

```text
    PID TTY          TIME CMD
  24531 pts/0    00:00:00 bash
  24710 pts/0    00:00:00 ps
```

Here:

| Column | Meaning |
|---|---|
| PID | Process ID |
| TTY | Terminal associated with process |
| TIME | CPU time used |
| CMD | Command |

Notice something interesting:

```bash
ps
```

itself becomes a process while it runs.

Therefore, you may see:

```text
bash
ps
```

---

# 29. `ps --forest`

`ps --forest` displays processes in a tree-like hierarchy.

```bash
ps --forest
```

Example:

```text
PID TTY          TIME CMD
24531 pts/0  00:00:00 bash
24720 pts/0  00:00:00  \_ ps
```

The tree helps visualize parent-child relationships.

Mental model:

```text
bash
 ├── command
 ├── command
 └── ps
```

A process can create child processes.

---

# 30. `ps -f`

`-f` means **full-format listing**.

Run:

```bash
ps -f
```

Example:

```text
UID        PID  PPID  C STIME TTY          TIME CMD
shubham  24531 24500  0 09:20 pts/0    00:00:00 bash
shubham  24800 24531  0 09:30 pts/0    00:00:00 ps -f
```

Important columns include:

| Column | Meaning |
|---|---|
| UID | User running process |
| PID | Process ID |
| PPID | Parent Process ID |
| C | CPU utilization indicator |
| STIME | Start time |
| TTY | Terminal |
| TIME | CPU time |
| CMD | Command |

---

# 31. PID vs PPID

Suppose:

```text
PID     PPID
24531   24000
24800   24531
```

This means:

```text
Process 24000
      |
      └── Process 24531
                |
                └── Process 24800
```

`PPID` means:

> Parent Process ID

This is useful for understanding process hierarchy.

---

# 32. `ps -e`

`ps -e` displays processes from all sessions.

```bash
ps -e
```

Example:

```text
    PID TTY          TIME CMD
      1 ?        00:00:03 systemd
      2 ?        00:00:00 kthreadd
    500 ?        00:00:01 NetworkManager
  24531 pts/0    00:00:00 bash
  24900 pts/0    00:00:00 ps
```

Unlike plain:

```bash
ps
```

which normally focuses on processes associated with the current terminal/session, `ps -e` shows a much broader process list.

---

# 33. `ps -ef`

`ps -ef` combines:

```text
-e
+
-f
```

Therefore:

```bash
ps -ef
```

means:

> Show processes broadly/all processes using full-format information.

Example:

```text
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 09:00 ?        00:00:03 /sbin/init
root         500       1  0 09:01 ?        00:00:01 /usr/sbin/NetworkManager
shubham    24531   24000  0 09:20 pts/0    00:00:00 bash
shubham    24910   24531  0 09:30 pts/0    00:00:00 ps -ef
```

This is one of the most commonly used `ps` forms.

---

# 34. Comparing `ps`, `ps -f`, `ps -e`, and `ps -ef`

| Command | Purpose |
|---|---|
| `ps` | Processes associated with current session/terminal |
| `ps -f` | Same basic scope, more detailed format |
| `ps -e` | Processes from all sessions |
| `ps -ef` | All processes + full-format information |
| `ps --forest` | Process hierarchy/tree view |

A useful mental model:

```text
ps
 ↓
basic process information

ps -f
 ↓
more details

ps -e
 ↓
all processes

ps -ef
 ↓
all processes + details

ps --forest
 ↓
process hierarchy
```

---

# 35. Connecting `$$` with `ps`

Now we can connect two concepts.

Run:

```bash
echo $$
```

Suppose:

```text
24531
```

Then:

```bash
ps -f
```

may show:

```text
UID       PID    PPID  C STIME TTY      TIME CMD
shubham   24531  24000 0 09:20 pts/0 00:00:00 bash
```

Notice:

```text
$$
 ↓
24531
 ↓
PID of current shell
```

This demonstrates that the shell itself is a process.

---

# 36. Practical Experiment

Run these commands one by one:

```bash
echo "USER = $USER"
echo "HOME = $HOME"
echo "PATH = $PATH"
echo "PWD = $PWD"
echo "HOSTNAME = $HOSTNAME"
echo "PID = $$"
echo "FLAGS = $-"
```

Then:

```bash
ps -f
```

Find the row corresponding to your shell.

The PID shown by:

```bash
echo $$
```

should correspond to your shell process.

---

# 37. Practical Experiment: Exit Status

Run:

```bash
true
echo "Exit status = $?"
```

Then:

```bash
false
echo "Exit status = $?"
```

Then:

```bash
ls /
echo "Exit status = $?"
```

Then:

```bash
ls /does-not-exist
echo "Exit status = $?"
```

Observe:

```text
0     → success
nonzero → failure/other non-success condition
```

---

# 38. Practical Experiment: Quotes

Run:

```bash
echo "$USER"
```

Then:

```bash
echo '$USER'
```

Then:

```bash
echo "\$USER"
```

You should understand the difference:

```text
"$USER"    → variable expands
'$USER'    → literal $USER
"\$USER"   → literal $USER
```

---

# 39. Practical Experiment: PATH

Run:

```bash
echo "$PATH"
```

Then:

```bash
which date
```

Then:

```bash
type date
```

Then:

```bash
/usr/bin/date
```

Finally:

```bash
\date
```

This demonstrates the relationship between:

```text
alias
   ↓
command lookup
   ↓
PATH
   ↓
executable
```

---

# 40. Common Mistakes

## Mistake 1: Forgetting `$`

Incorrect:

```bash
echo USER
```

Output:

```text
USER
```

Correct:

```bash
echo $USER
```

---

## Mistake 2: Expecting expansion inside single quotes

```bash
echo '$HOME'
```

Output:

```text
$HOME
```

Correct when expansion is wanted:

```bash
echo "$HOME"
```

---

## Mistake 3: Using `$?` too late

Incorrect:

```bash
false
echo "Something"
echo $?
```

The final `$?` belongs to:

```bash
echo "Something"
```

not `false`.

Correct:

```bash
false
status=$?
echo "Status = $status"
```

---

## Mistake 4: Confusing PID and PPID

```text
PID  → this process
PPID → parent process
```

---

## Mistake 5: Confusing `$HOME` and `$PWD`

```text
$HOME
 ↓
your home directory

$PWD
 ↓
your current working directory
```

For example:

```text
HOME = /home/shubham
PWD  = /home/shubham/projects
```

---

# 41. Exam-Oriented Questions

## Question 1

What does this print?

```bash
echo '$USER'
```

### Answer

```text
$USER
```

Because variables are not expanded inside single quotes.

---

## Question 2

What does this normally print?

```bash
true
echo $?
```

### Answer

```text
0
```

---

## Question 3

What does this represent?

```bash
echo $$
```

### Answer

The PID of the current shell.

---

## Question 4

What does `$#` represent inside a shell script?

### Answer

The number of positional arguments supplied to the script.

---

## Question 5

If a script is executed as:

```bash
./test.sh apple banana
```

what are `$1` and `$2`?

### Answer

```text
$1 = apple
$2 = banana
```

---

## Question 6

What does `$-` contain?

### Answer

The current shell's option/flag characters.

---

## Question 7

What does `$PATH` contain?

### Answer

A colon-separated list of directories where the shell searches for executable commands.

---

## Question 8

What is the difference between:

```bash
echo "$USER"
```

and:

```bash
echo '$USER'
```

### Answer

```text
"$USER"  → expands USER
'$USER'  → prints literal $USER
```

---

## Question 9

What is the difference between:

```bash
ps
```

and:

```bash
ps -ef
```

### Answer

`ps` normally shows processes associated with the current session/terminal.

`ps -ef` shows a broad/all-process listing in full format.

---

## Question 10

What does `PPID` mean?

### Answer

Parent Process ID.

---

# 42. Important Cheat Sheet

```text
Frequently Used Variables
────────────────────────────────────────────
$USER       → current username
$HOME       → home directory
$PATH       → executable search path
$PWD        → current working directory
$HOSTNAME   → system hostname


Special Variables
────────────────────────────────────────────
$0          → script/command invocation name
$1-$9       → positional arguments
$#          → number of positional arguments
$@          → all positional arguments
$-          → shell flags
$?          → previous command exit status
$$          → current shell PID


Commands
────────────────────────────────────────────
echo        → print text/values
printenv    → display environment variables
env         → display/use environment
set         → display shell variables/functions/state
date        → current date/time
date -R     → RFC-style date/time
ps          → process information
ps -f       → full format
ps -e       → all processes
ps -ef      → all processes + full format
ps --forest → process hierarchy


Quoting
────────────────────────────────────────────
"$USER"     → variable expansion
'$USER'     → literal $USER
"\$USER"    → literal $USER


Exit Status
────────────────────────────────────────────
0           → success
non-zero    → failure/other non-success condition


Process
────────────────────────────────────────────
PID         → Process ID
PPID        → Parent Process ID
$$          → PID of current shell
```

# 43. Final Mental Model

Think of the shell as a running program that has its own information:

```text
                    SHELL
                      |
        ┌─────────────┼──────────────┐
        ↓             ↓              ↓
    Variables      Processes      Commands
        |             |              |
        ↓             ↓              ↓
 USER HOME PATH     PID/PPID      echo/date/ps
 PWD HOSTNAME
        |
        ↓
 Special Variables
        |
 ┌──────┼───────────────────────┐
 ↓      ↓       ↓       ↓       ↓
$0    $1-$9     $#      $?      $$
                         ↓       ↓
                    exit status  PID
```

The most important concepts to remember are:

```text
$USER       → Who am I?
$HOME       → Where is my home?
$PWD        → Where am I?
$PATH       → Where should the shell search for commands?
$HOSTNAME   → Which machine am I on?

$$          → What is my shell's PID?
$?          → Did the previous command succeed?
$-          → What shell flags are active?

$0          → How was the script invoked?
$1-$9       → What arguments were supplied?
$#          → How many arguments?
$@          → What are all the arguments?

ps          → What processes are running?
ps -f       → Give me more process details.
ps -e       → Show all processes.
ps -ef      → Show all processes with full details.
ps --forest → Show the process hierarchy.
```

These variables and commands form the foundation for understanding **Bash scripting, process management, command execution, debugging, and automation**.