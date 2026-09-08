---
layout: default
title: "L3.5 - Linux process management"
---

# L3.5 - Linux process management



# Linux Process Management, Job Control, Bash History, Brace Expansion, and Exit Codes

## 1. `sleep`

The `sleep` command pauses execution for a specified amount of time.

### Syntax

```bash
sleep NUMBER
```

Example:

```bash
sleep 5
```

The command waits for 5 seconds and then exits.

You can also specify units:

```bash
sleep 10s
sleep 2m
sleep 1h
sleep 1d
```

Where:

- `s` = seconds
- `m` = minutes
- `h` = hours
- `d` = days

### Example

```bash
echo "Start"
sleep 5
echo "End"
```

Output:

```text
Start
```

After approximately 5 seconds:

```text
End
```

### Why is `sleep` useful?

`sleep` is especially useful when learning process management because it creates a process that stays alive for a predictable amount of time.

For example:

```bash
sleep 100
```

Now you can practice:

```text
Ctrl-C
Ctrl-Z
fg
bg
jobs
kill
```

---

# 2. `coproc`

`coproc` is a Bash feature used to start a command asynchronously as a **coprocess**.

A coprocess runs independently while the current shell continues.

### Basic Syntax

```bash
coproc command
```

Example:

```bash
coproc sleep 10
```

The shell does not wait 10 seconds. It immediately gives you the prompt.

You can then continue executing commands.

---

## 2.1 Why Does `coproc` Exist?

Normally:

```bash
sleep 10
echo "Done"
```

works synchronously:

```text
sleep 10
   ↓
wait
   ↓
echo "Done"
```

With:

```bash
coproc sleep 10
echo "Done"
```

the coprocess runs asynchronously:

```text
             ┌──→ coprocess: sleep 10
Shell ───────┤
             └──→ echo "Done"
```

The important feature of `coproc` is that Bash also provides communication channels between the shell and the coprocess.

---

## 2.2 Named Coprocess

Example:

```bash
coproc myproc { sleep 3; echo "done"; }
```

Bash provides information about the coprocess.

For example:

```bash
echo "$myproc_PID"
```

gives the PID of the coprocess.

A named coprocess also has file descriptors that can be used to communicate with it.

For basic process-management purposes, remember:

```text
coproc
  ↓
Asynchronous Bash process
  +
Communication pipes/file descriptors
```

---

# 3. `kill`

The `kill` command sends a **signal** to a process.

### Syntax

```bash
kill PID
```

Example:

```bash
kill 12345
```

By default:

```bash
kill PID
```

sends:

```text
SIGTERM
```

---

## 3.1 Important Meaning of `kill`

The name `kill` can be misleading.

It does not necessarily mean:

> Immediately destroy the process.

It actually means:

> Send a signal to the specified process.

For example:

```bash
kill -STOP 12345
```

does not terminate the process. It stops it.

And:

```bash
kill -CONT 12345
```

can continue a stopped process.

---

# 4. Signals

A signal is a notification sent to a process.

Conceptually:

```text
Process
   ▲
   │
   │ signal
   │
Kernel / Shell / Another Process
```

Common signals include:

| Signal | Number | Typical purpose |
|---|---:|---|
| `SIGINT` | 2 | Interrupt |
| `SIGTERM` | 15 | Request termination |
| `SIGKILL` | 9 | Force termination |
| `SIGSTOP` | 19 | Stop process |
| `SIGCONT` | 18 | Continue stopped process |
| `SIGTSTP` | 20 | Terminal stop request |

Signal numbers can vary on some systems, but these are the standard values on Linux.

---

# 5. `SIGTERM`

The default signal from:

```bash
kill PID
```

is:

```text
SIGTERM
```

You can explicitly specify it:

```bash
kill -TERM PID
```

or:

```bash
kill -15 PID
```

`SIGTERM` politely asks the process to terminate.

A program can catch `SIGTERM` and perform cleanup before exiting.

For example, a server might:

```text
Receive SIGTERM
      ↓
Stop accepting requests
      ↓
Finish current work
      ↓
Close files/connections
      ↓
Exit
```

---

# 6. `SIGKILL`

You can forcefully terminate a process using:

```bash
kill -9 PID
```

This sends:

```text
SIGKILL
```

Equivalent form:

```bash
kill -KILL PID
```

Unlike `SIGTERM`, `SIGKILL` cannot be caught or ignored by the process.

### Recommended approach

Usually try:

```bash
kill PID
```

first.

If the process refuses to terminate:

```bash
kill -9 PID
```

may be necessary.

### Remember

```text
kill PID
   ↓
SIGTERM
   ↓
Graceful termination request


kill -9 PID
   ↓
SIGKILL
   ↓
Force termination
```

---

# 7. Running a Process in the Background Using `&`

Normally:

```bash
sleep 100
```

runs in the foreground.

The shell waits for it to finish.

```text
Shell
  │
  ▼
sleep 100
  │
  │
  ▼
Shell waits
```

To run it in the background:

```bash
sleep 100 &
```

The `&` tells Bash to start the command as a background job.

The shell immediately gives you the prompt again.

Example:

```bash
sleep 100 &
```

You may see:

```text
[1] 12345
```

Here:

```text
1     → Job number
12345 → PID
```

---

# 8. Job Number vs PID

This distinction is extremely important.

Suppose:

```bash
sleep 100 &
```

produces:

```text
[1] 12345
```

Then:

```text
Job number = 1
PID        = 12345
```

The **job number** is used by the shell's job-control system.

Example:

```bash
fg %1
```

The **PID** is used by the operating system to identify the process.

Example:

```bash
kill 12345
```

### Mental Model

```text
Job number
    ↓
Shell's identifier

PID
    ↓
Operating system's process identifier
```

---

# 9. `fg`

`fg` means:

> Foreground

It brings a background or stopped job into the foreground.

Suppose:

```bash
sleep 100 &
```

is running.

Run:

```bash
fg
```

The job becomes the foreground job.

You can specify a particular job:

```bash
fg %1
```

where:

```text
%1
```

means job number 1.

### Flow

```text
Background
    │
    │ fg
    ▼
Foreground
```

---

# 10. `Ctrl-C`

When a process is running in the foreground, pressing:

```text
Ctrl-C
```

normally causes the terminal to send:

```text
SIGINT
```

to the foreground process group.

Example:

```bash
sleep 100
```

Press:

```text
Ctrl-C
```

The `sleep` command normally terminates.

### Mental Model

```text
Ctrl-C
   ↓
Terminal
   ↓
SIGINT
   ↓
Foreground process group
   ↓
Process normally terminates
```

### Important

`Ctrl-C` does not literally mean:

```text
"kill PID"
```

It is a keyboard-generated interrupt that causes a signal to be sent to the foreground process group.

A program can handle `SIGINT`, so `Ctrl-C` does not guarantee immediate termination.

---

# 11. Two Ways of Killing/Terminating a Process

There are two common situations.

## Method 1: `Ctrl-C`

For a foreground process:

```bash
sleep 100
```

Press:

```text
Ctrl-C
```

This normally sends:

```text
SIGINT
```

---

## Method 2: `kill PID`

For a process identified by PID:

```bash
kill 12345
```

This normally sends:

```text
SIGTERM
```

### Comparison

```text
Ctrl-C
   ↓
SIGINT
   ↓
Foreground process group


kill PID
   ↓
SIGTERM
   ↓
Specified process
```

---

# 12. `jobs`

The `jobs` command displays jobs managed by the current shell.

Example:

```bash
sleep 100 &
sleep 200 &
jobs
```

Possible output:

```text
[1]-  Running    sleep 100 &
[2]+  Running    sleep 200 &
```

The exact `+` and `-` markers depend on which jobs are the current and previous jobs.

---

## 12.1 `jobs -l`

For more information:

```bash
jobs -l
```

Example:

```text
[1]- 12345 Running    sleep 100 &
[2]+ 12346 Running    sleep 200 &
```

Now you can see both:

```text
Job number
PID
State
Command
```

---

# 13. `top`

`top` is an interactive process-monitoring utility.

Run:

```bash
top
```

It displays information about processes and system activity.

Typical information includes:

- PID
- User
- CPU usage
- Memory usage
- Process state
- Runtime
- Command

A simplified representation:

```text
PID     USER      CPU%    MEM%    COMMAND
1234    user      25.0     2.1    python
2345    user       5.0     1.0    bash
3456    user       0.0     0.1    sleep
```

The exact display depends on the system.

---

## 13.1 Exiting `top`

Press:

```text
q
```

to quit `top`.

---

# 14. `Ctrl-Z`

`Ctrl-Z` normally suspends the foreground process.

For example:

```bash
sleep 100
```

Press:

```text
Ctrl-Z
```

The terminal normally sends:

```text
SIGTSTP
```

to the foreground process group.

You may see:

```text
[1]+  Stopped    sleep 100
```

### Important

`Ctrl-Z` does **not** normally kill the process.

It suspends it.

```text
Running
   │
 Ctrl-Z
   ▼
Stopped
```

---

# 15. `fg` and `bg` After `Ctrl-Z`

After:

```text
Ctrl-Z
```

the job is stopped.

You can bring it back to the foreground:

```bash
fg
```

Or continue it in the background:

```bash
bg
```

### Complete Flow

```text
              Running
                 │
          ┌──────┴──────┐
          │             │
       Ctrl-C         Ctrl-Z
          │             │
          ▼             ▼
     Terminated       Stopped
                        │
                  ┌─────┴─────┐
                  │           │
                 fg           bg
                  │           │
                  ▼           ▼
             Foreground   Background
```

---

# 16. Process State

A process can move through different states.

A simplified model:

```text
                 ┌──────────────┐
                 │   Running    │
                 └──────┬───────┘
                        │
                     Ctrl-Z
                        │
                        ▼
                 ┌──────────────┐
                 │    Stopped   │
                 └──────┬───────┘
                    ┌───┴───┐
                   fg      bg
                    │       │
                    ▼       ▼
                 Running  Running
```

And:

```text
Running
   │
 Ctrl-C / kill
   ▼
Terminated
```

---

# 17. `echo $-`

Run:

```bash
echo $-
```

This displays the current Bash shell's option flags.

Example:

```text
himBHs
```

The exact characters depend on your shell configuration.

One particularly important flag is:

```text
i
```

which indicates that the shell is interactive.

Therefore:

```bash
echo $-
```

can help determine the current shell's mode/options.

---

# 18. Child Shell

A shell can create another shell.

For example:

```bash
bash
```

starts a new Bash shell.

Conceptually:

```text
Parent Bash
     │
     │ bash
     ▼
Child Bash
```

The child shell is a separate process.

---

# 19. Checking the Shell PID

The special Bash variable:

```bash
$$
```

contains the PID of the current shell.

Run:

```bash
echo $$
```

Suppose:

```text
1000
```

Now start another Bash:

```bash
bash
```

Then:

```bash
echo $$
```

You may get:

```text
1050
```

This demonstrates that you are now inside another shell process.

---

# 20. Exiting a Child Shell

Run:

```bash
exit
```

The current shell exits.

If it was a child shell:

```text
Parent Shell
     │
     │ bash
     ▼
Child Shell
     │
     │ exit
     ▼
Parent Shell
```

---

# 21. Parent and Child Processes

The relationship can be represented as:

```text
Parent Process
      │
      ├── Child Process
      │
      ├── Child Process
      │
      └── Child Process
```

A process can therefore create another process.

For example:

```bash
bash
```

causes the current shell to create/start another Bash process.

---

# 22. Environment Inheritance

A child process inherits the environment of its parent.

For example:

```bash
export NAME="Shubham"
bash
echo "$NAME"
```

Output:

```text
Shubham
```

because `NAME` was exported.

But:

```bash
NAME="Shubham"
bash
echo "$NAME"
```

does not make `NAME` part of the child's environment merely because it was a normal shell variable.

### Mental Model

```text
Parent shell
     │
     ├── normal shell variable
     │       ↓
     │    not automatically inherited
     │
     └── exported variable
             ↓
         inherited by child
```

---

# 23. Bash History

Bash remembers previously executed commands.

Run:

```bash
history
```

Example:

```text
  101  pwd
  102  ls
  103  date
  104  whoami
```

Each command has a history number.

---

# 24. `!n`

You can execute a specific history entry using:

```bash
!n
```

Suppose:

```text
101  pwd
102  ls
103  date
```

Then:

```bash
!102
```

executes:

```bash
ls
```

### Mental Model

```text
History
   │
   ├── 101 → pwd
   ├── 102 → ls
   └── 103 → date

!102
  ↓
ls
```

---

# 25. `!!`

The command:

```bash
!!
```

means:

> Execute the previous command again.

Example:

```bash
date
!!
```

The second command executes `date` again.

---

## 25.1 Practical Use of `!!`

Suppose you run:

```bash
apt update
```

and discover that root privileges are required.

Instead of typing the entire command again:

```bash
sudo apt update
```

you can use:

```bash
sudo !!
```

Bash expands the history reference to the previous command.

Conceptually:

```bash
sudo !!
```

becomes:

```bash
sudo apt update
```

---

# 26. Brace Expansion

Bash supports **brace expansion**.

Example:

```bash
echo {1..5}
```

Output:

```text
1 2 3 4 5
```

Brace expansion is performed by Bash before the command is executed.

---

# 27. Numeric Brace Expansion

```bash
echo {1..10}
```

Output:

```text
1 2 3 4 5 6 7 8 9 10
```

You can specify a step:

```bash
echo {1..10..2}
```

Output:

```text
1 3 5 7 9
```

Reverse order:

```bash
echo {5..1}
```

Output:

```text
5 4 3 2 1
```

---

# 28. Alphabetic Brace Expansion

You can use letters:

```bash
echo {a..e}
```

Output:

```text
a b c d e
```

Reverse:

```bash
echo {e..a}
```

Output:

```text
e d c b a
```

---

# 29. Comma-Based Brace Expansion

You can specify alternatives:

```bash
echo {red,green,blue}
```

Output:

```text
red green blue
```

Another example:

```bash
echo file{1,2,3}.txt
```

Output:

```text
file1.txt file2.txt file3.txt
```

---

# 30. Creating Multiple Files

Instead of:

```bash
touch file1.txt
touch file2.txt
touch file3.txt
```

you can use:

```bash
touch file{1,2,3}.txt
```

The shell expands it to:

```bash
touch file1.txt file2.txt file3.txt
```

---

# 31. Creating Multiple Directories

Example:

```bash
mkdir -p project/{src,tests,docs}
```

The shell expands it approximately to:

```bash
mkdir -p project/src project/tests project/docs
```

Result:

```text
project/
├── src/
├── tests/
└── docs/
```

---

# 32. Brace Expansion Is Not a Loop

Consider:

```bash
echo {1..5}
```

This is not a loop.

The shell expands the expression before executing `echo`.

Conceptually:

```text
echo {1..5}
     │
     ▼
Brace expansion
     │
     ▼
echo 1 2 3 4 5
     │
     ▼
Command executes
```

For repeated execution, you would use a loop such as:

```bash
for i in {1..5}; do
    echo "$i"
done
```

---

# 33. Multiple Commands on One Line

Bash allows multiple commands on a single line.

The simplest separator is:

```text
;
```

Example:

```bash
pwd; ls; date
```

Execution:

```text
pwd
 ↓
ls
 ↓
date
```

---

# 34. `;`

The semicolon means:

> Execute the next command regardless of whether the previous command succeeded or failed.

Example:

```bash
false; echo "Hello"
```

Output:

```text
Hello
```

Even though:

```bash
false
```

returns a nonzero exit status, `echo` still runs.

---

# 35. `&&`

The `&&` operator runs the next command only when the previous command succeeds.

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

If it fails, the second command does not run.

### Mental Model

```text
command1
   │
   ├── success → command2
   │
   └── failure → stop
```

---

# 36. `||`

The `||` operator runs the next command when the previous command fails.

Example:

```bash
mkdir test || echo "Could not create directory"
```

If `mkdir` fails:

```text
Could not create directory
```

is printed.

### Mental Model

```text
command1
   │
   ├── success → skip command2
   │
   └── failure → run command2
```

---

# 37. Comparing `;`, `&&`, and `||`

| Operator | Next command runs when |
|---|---|
| `;` | Always |
| `&&` | Previous command succeeds |
| `||` | Previous command fails |

Examples:

```bash
command1; command2
```

```bash
command1 && command2
```

```bash
command1 || command2
```

These operators are closely connected to **exit codes**.

---

# 38. Exit Codes

Every command normally finishes with an exit status.

In Bash:

```bash
$?
```

contains the exit status of the immediately preceding command.

By convention:

```text
0
```

means:

> Success

A nonzero value generally means:

> Failure, error, or another exceptional condition.

---

# 39. Checking an Exit Code

Run:

```bash
true
echo $?
```

Output:

```text
0
```

Now:

```bash
false
echo $?
```

Output:

```text
1
```

Remember:

```text
0     → success
non-0 → unsuccessful/exceptional result
```

Do not assume that every failure returns exactly `1`.

Different programs can use different nonzero values for different conditions.

---

# 40. Why Is Success `0`?

This can initially feel strange.

You might think:

```text
0 = nothing
1 = something
```

But in Unix/Linux command status conventions:

```text
0 = success
nonzero = failure/exceptional condition
```

This makes sense because there can be many different types of failure:

```text
0 → success

1 → general failure
2 → incorrect usage
3 → another condition
...
```

The exact meanings depend on the command/program.

---

# 41. `$?` Changes After Every Command

Consider:

```bash
false
echo $?
```

Output:

```text
1
```

But:

```bash
false
echo "Hello"
echo $?
```

The final:

```bash
echo $?
```

reports the exit status of:

```bash
echo "Hello"
```

not `false`.

### Mental Model

```text
Command A
   ↓
$? = status of A

Command B
   ↓
$? = status of B

Command C
   ↓
$? = status of C
```

Therefore, if you need to preserve an exit code:

```bash
command
status=$?

echo "$status"
```

---

# 42. Exit Codes and `&&`

Consider:

```bash
command1 && command2
```

Bash checks the exit status of `command1`.

If:

```text
command1 → 0
```

then:

```text
command2 runs
```

If:

```text
command1 → nonzero
```

then:

```text
command2 does not run
```

Example:

```bash
true && echo "Success"
```

Output:

```text
Success
```

But:

```bash
false && echo "Success"
```

produces no `Success`.

---

# 43. Exit Codes and `||`

Similarly:

```bash
command1 || command2
```

runs `command2` if `command1` returns nonzero.

Example:

```bash
false || echo "Command failed"
```

Output:

```text
Command failed
```

---

# 44. Killing a Process Running in a Separate Shell

A process can be started in one terminal and killed from another terminal.

Suppose you have two terminals.

## Terminal 1

Run:

```bash
sleep 1000
```

The process is running in Terminal 1.

Find its PID:

```bash
ps -e
```

Suppose the process is:

```text
12345   ...   sleep 1000
```

Its PID is:

```text
12345
```

---

## Terminal 2

Run:

```bash
kill 12345
```

The process receives the signal.

Conceptually:

```text
Terminal 1
    │
    └── sleep 1000
            │
            └── PID 12345


Terminal 2
    │
    └── kill 12345
            │
            ▼
       Process 12345
```

The important point is:

> A process is identified by its PID, not by the terminal from which you send the signal.

You must have sufficient permission to signal a process owned by another user.

---

# 45. `ps -e`

The command:

```bash
ps -e
```

lists processes on the system.

Example:

```text
PID     TTY      TIME     CMD
1       ?        00:00:02 systemd
1000    pts/0    00:00:00 bash
12345   pts/1    00:00:00 sleep
```

The exact output varies between systems.

The most important field for process control is:

```text
PID
```

---

# 46. `ps` vs `ps -e`

Running:

```bash
ps
```

normally shows processes associated with the current terminal/session in the default view.

Running:

```bash
ps -e
```

requests a view of all processes.

Therefore:

```text
ps
 ↓
Default/current process view

ps -e
 ↓
All processes
```

---

# 47. Useful `ps` Variations

You can get more information using:

```bash
ps -ef
```

This provides a more detailed listing.

You can also choose your own columns:

```bash
ps -e -o pid,ppid,stat,cmd
```

Example:

```text
PID   PPID  STAT  CMD
1     0     Ss    /sbin/init
1000  900   Ss    bash
1234  1000  S     sleep 1000
```

Important columns:

```text
PID  → Process ID
PPID → Parent Process ID
STAT → Process state
CMD  → Command
```

---

# 48. Exit Code for Child Processes

A child process can finish with an exit status.

The parent process can obtain that status.

For example:

```bash
bash -c 'exit 42'
echo $?
```

Output:

```text
42
```

Conceptually:

```text
Child process
      │
      │ exit 42
      ▼
Exit status = 42
      │
      ▼
Parent shell receives status
      │
      ▼
$? = 42
```

---

# 49. Explicit Exit Code Example

Run:

```bash
bash -c 'exit 7'
echo $?
```

Output:

```text
7
```

Another:

```bash
bash -c 'exit 0'
echo $?
```

Output:

```text
0
```

Therefore, a child process can communicate information to its parent using its exit status.

---

# 50. Background Child Process and `wait`

Suppose you start a command in the background:

```bash
(exit 7) &
```

The shell immediately continues.

The special variable:

```bash
$!
```

contains the PID of the most recently started background process.

Example:

```bash
(exit 7) &
pid=$!
```

Now:

```bash
echo "$pid"
```

prints the background process's PID.

---

# 51. `wait`

The `wait` command waits for a background process to finish.

Example:

```bash
(exit 7) &
pid=$!

wait "$pid"

echo $?
```

Output:

```text
7
```

Here is what happened:

```text
(exit 7) &
     │
     ▼
Background child
     │
     └── PID stored in $!
              │
              ▼
         wait "$pid"
              │
              ▼
      Child finishes with 7
              │
              ▼
            $?
             ↓
             7
```

This is an important example of a parent receiving the exit status of a child process.

---

# 52. `$!`

The special Bash variable:

```bash
$!
```

contains the PID of the most recently started background process.

Example:

```bash
sleep 100 &
echo $!
```

Possible output:

```text
12345
```

So:

```text
$!
 ↓
PID of latest background process
```

Compare:

```text
$$
 ↓
PID of current shell

$!
 ↓
PID of most recent background process

$?
 ↓
Exit status of previous command
```

---

# 53. Exit Status When a Process Is Terminated by a Signal

When a process is terminated by a signal, shells commonly represent the resulting command status as:

```text
128 + signal number
```

For example:

```text
SIGINT  = 2
128 + 2 = 130
```

So a command interrupted by `SIGINT` commonly results in:

```text
130
```

Similarly:

```text
SIGTERM = 15
128 + 15 = 143
```

So termination by `SIGTERM` commonly results in:

```text
143
```

This is a common Unix shell convention, not a universal requirement for every program or environment.

---

# 54. `bc` — Basic Calculator

`bc` is a command-line calculator language.

Run:

```bash
bc
```

Then type:

```text
10 + 20
```

Output:

```text
30
```

Another example:

```text
100 * 5
```

Output:

```text
500
```

---

# 55. Decimal Calculations with `bc`

Integer division:

```text
5 / 2
```

may produce:

```text
2
```

You can use `scale`:

```text
scale=2
5/2
```

Output:

```text
2.50
```

You can also use:

```bash
bc -l
```

The `-l` option loads the standard math library and sets a useful default scale for many calculations.

Example:

```bash
echo "10 / 3" | bc -l
```

Output similar to:

```text
3.33333333333333333333
```

The exact number of decimal places depends on the `bc` configuration/version.

---

# 56. `bc` as a Pipeline

You can provide an expression to `bc` through standard input.

Example:

```bash
echo "10 + 20" | bc
```

Output:

```text
30
```

Another example:

```bash
echo "scale=2; 10/3" | bc
```

Output:

```text
3.33
```

This is useful in shell scripts.

---

# 57. `bc` and Bash Arithmetic

For simple integer arithmetic, Bash itself can calculate:

```bash
echo $((10 + 20))
```

Output:

```text
30
```

But `bc` is useful for:

- Decimal calculations
- Arbitrary precision
- More advanced mathematical expressions
- Mathematical functions

---

# 58. `Ctrl-D`

`Ctrl-D` is fundamentally different from `Ctrl-C` and `Ctrl-Z`.

`Ctrl-D` indicates an **EOF condition** when the terminal is providing input to a program.

EOF means:

```text
End Of File
```

It is not a signal like:

```text
SIGINT
```

or:

```text
SIGTSTP
```

---

# 59. `Ctrl-D` in an Interactive Shell

At an empty Bash prompt:

```text
$
```

press:

```text
Ctrl-D
```

Bash receives EOF and normally exits.

If you are inside a child shell:

```text
Parent Shell
     │
     │ bash
     ▼
Child Shell
     │
   Ctrl-D
     │
     ▼
Parent Shell
```

---

# 60. `Ctrl-D` with `cat`

Run:

```bash
cat > file.txt
```

Now type:

```text
Hello
World
```

The terminal sends that input to `cat`.

Press:

```text
Ctrl-D
```

This signals EOF to `cat`.

`cat` then finishes.

The file contains:

```text
Hello
World
```

---

# 61. `Ctrl-D` with `bc`

Run:

```bash
bc
```

Type:

```text
10 + 20
```

You get:

```text
30
```

Then press:

```text
Ctrl-D
```

The input ends and `bc` exits.

---

# 62. `Ctrl-C` vs `Ctrl-Z` vs `Ctrl-D`

This distinction is extremely important.

| Key | Typical effect |
|---|---|
| `Ctrl-C` | Sends `SIGINT` to foreground process group |
| `Ctrl-Z` | Sends `SIGTSTP` to foreground process group |
| `Ctrl-D` | Provides EOF to a program reading terminal input |

Remember:

```text
Ctrl-C → Interrupt
Ctrl-Z → Suspend
Ctrl-D → EOF
```

---

# 63. Why Learn Exit Codes?

Exit codes are one of the most important concepts in Linux shell scripting.

They allow commands and programs to communicate their result.

For example:

```bash
mkdir backup
echo $?
```

If:

```text
0
```

the operation was successful.

If nonzero:

```text
1
```

or another value, something went wrong or another exceptional condition occurred.

---

# 64. Exit Codes Enable Decision Making

Suppose:

```bash
mkdir backup
```

returns success.

You can use:

```bash
mkdir backup && echo "Directory created"
```

The shell checks the exit status.

```text
mkdir
  │
  ├── 0 → echo runs
  │
  └── nonzero → echo does not run
```

---

# 65. Exit Codes in Shell Scripts

Example:

```bash
#!/bin/bash

if mkdir backup; then
    echo "Directory created successfully"
else
    echo "Failed to create directory"
fi
```

The `if` statement directly checks the command's exit status.

This is cleaner than unnecessarily doing:

```bash
mkdir backup
if [ $? -eq 0 ]; then
    ...
fi
```

---

# 66. Exit Codes in Automation

Exit codes are essential for:

- Shell scripts
- Cron jobs
- CI/CD
- Deployment
- System administration
- Monitoring
- Backup scripts
- Automation

For example:

```text
Backup script
     │
     ▼
Create archive
     │
     ├── success → continue
     │
     └── failure → report error
```

Without exit codes, automation would have difficulty determining whether a command succeeded.

---

# 67. Example: Backup Automation

Consider:

```bash
tar -czf backup.tar.gz project/
```

Then:

```bash
if tar -czf backup.tar.gz project/; then
    echo "Backup successful"
else
    echo "Backup failed"
fi
```

The exit status controls the decision.

```text
tar
 │
 ├── 0
 │    ↓
 │  Success
 │
 └── nonzero
      ↓
    Failure
```

---

# 68. Exit Codes and `&&` / `||`

This is why these operators are so powerful.

```bash
backup && echo "Backup successful"
```

means:

```text
If backup succeeds
        ↓
Print success
```

And:

```bash
backup || echo "Backup failed"
```

means:

```text
If backup fails
        ↓
Print failure
```

You can combine them:

```bash
backup && echo "Backup successful" || echo "Backup failed"
```

For simple commands, this is useful, but for complex scripts an explicit `if` statement is often clearer and avoids ambiguity.

---

# 69. Process Control: Complete Mental Model

```text
                         PROCESS
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
            PID            State        Exit status
             │              │              │
             │              │              │
        identifies       Running/       How it
        process          Stopped/...    finished
             │
             ▼
       Process control
             │
      ┌──────┼────────┐
      │      │        │
    kill   Ctrl-C   Ctrl-Z
      │      │        │
      ▼      ▼        ▼
   signal   SIGINT   SIGTSTP
```

---

# 70. Important Bash Special Variables

| Variable | Meaning |
|---|---|
| `$$` | PID of the current shell |
| `$!` | PID of the most recent background process |
| `$?` | Exit status of the immediately preceding command |
| `$-` | Current shell option flags |

Example:

```bash
echo "Shell PID: $$"

sleep 100 &
echo "Background PID: $!"

echo "Previous status: $?"
```

Be careful: `$?` changes after commands execute.

---

# 71. Complete Job-Control Example

Run:

```bash
sleep 100
```

The process is in the foreground.

Press:

```text
Ctrl-Z
```

Now it is stopped.

Check:

```bash
jobs
```

You may see:

```text
[1]+  Stopped    sleep 100
```

Resume in the background:

```bash
bg %1
```

Check:

```bash
jobs
```

Now it should show:

```text
[1]+  Running    sleep 100 &
```

Bring it back:

```bash
fg %1
```

Now `sleep` is in the foreground.

Finally:

```text
Ctrl-C
```

The process normally terminates.

### Complete Flow

```text
sleep 100
    │
    ▼
Foreground
    │
 Ctrl-Z
    ▼
Stopped
    │
   bg
    ▼
Background
    │
   fg
    ▼
Foreground
    │
 Ctrl-C
    ▼
Terminated
```

---

# 72. Finding and Killing a Process

Suppose:

```bash
sleep 1000 &
```

You can get its PID:

```bash
echo $!
```

Suppose:

```text
12345
```

Then:

```bash
kill 12345
```

Check:

```bash
jobs
```

The job should eventually disappear or be reported as terminated.

You can also use:

```bash
ps -e
```

to inspect processes.

---

# 73. Separate-Terminal Process Management

### Terminal 1

```bash
sleep 1000
```

### Terminal 2

Find the process:

```bash
ps -e | grep sleep
```

You might see:

```text
12345 pts/0 00:00:00 sleep
```

Then:

```bash
kill 12345
```

Return to Terminal 1.

The `sleep` process has been terminated.

This demonstrates that process control is independent of which terminal executes the `kill` command.

---

# 74. Practice Questions

## Q1. Run `sleep` for 30 seconds in the background.

### Solution

```bash
sleep 30 &
```

---

## Q2. Show all jobs managed by the current shell.

### Solution

```bash
jobs
```

---

## Q3. Show jobs together with their PIDs.

### Solution

```bash
jobs -l
```

---

## Q4. Bring job number 2 to the foreground.

### Solution

```bash
fg %2
```

---

## Q5. Suspend a foreground process.

### Solution

Press:

```text
Ctrl-Z
```

---

## Q6. Resume a stopped job in the background.

### Solution

```bash
bg %1
```

---

## Q7. Send the normal termination request to PID `5000`.

### Solution

```bash
kill 5000
```

---

## Q8. Forcefully terminate PID `5000`.

### Solution

```bash
kill -9 5000
```

---

## Q9. What signal does `Ctrl-C` normally generate?

### Solution

```text
SIGINT
```

---

## Q10. What signal does `Ctrl-Z` normally generate?

### Solution

```text
SIGTSTP
```

---

## Q11. What is the default signal sent by `kill PID`?

### Solution

```text
SIGTERM
```

---

## Q12. Display all processes.

### Solution

```bash
ps -e
```

---

## Q13. Start another Bash shell.

### Solution

```bash
bash
```

---

## Q14. Exit the current shell.

### Solution

```bash
exit
```

or, at an empty interactive prompt:

```text
Ctrl-D
```

---

## Q15. Display the current shell's PID.

### Solution

```bash
echo $$
```

---

## Q16. Display the PID of the most recently started background process.

### Solution

```bash
echo $!
```

---

## Q17. Display the exit status of the previous command.

### Solution

```bash
echo $?
```

---

## Q18. Execute history entry number 50.

### Solution

```bash
!50
```

---

## Q19. Execute the previous command again.

### Solution

```bash
!!
```

---

## Q20. Create five files named `file1.txt` through `file5.txt`.

### Solution

```bash
touch file{1..5}.txt
```

---

## Q21. Create `src`, `tests`, and `docs` under `project`.

### Solution

```bash
mkdir -p project/{src,tests,docs}
```

---

## Q22. Print numbers from 1 to 10 with a step of 2.

### Solution

```bash
echo {1..10..2}
```

Output:

```text
1 3 5 7 9
```

---

## Q23. Run `echo "Success"` only if `mkdir test` succeeds.

### Solution

```bash
mkdir test && echo "Success"
```

---

## Q24. Print an error message if `mkdir test` fails.

### Solution

```bash
mkdir test || echo "Failed"
```

---

## Q25. Run three commands sequentially regardless of previous exit status.

### Solution

```bash
command1; command2; command3
```

---

## Q26. What does this print?

```bash
true
echo $?
```

### Solution

```text
0
```

---

## Q27. What does this print?

```bash
false
echo $?
```

### Solution

```text
1
```

---

## Q28. What is wrong with this approach?

```bash
false
echo "Hello"
echo $?
```

### Solution

The final `$?` is the status of:

```bash
echo "Hello"
```

not:

```bash
false
```

To preserve the status:

```bash
false
status=$?

echo "Hello"
echo "$status"
```

---

## Q29. What does this produce?

```bash
bash -c 'exit 7'
echo $?
```

### Solution

```text
7
```

---

## Q30. Capture the PID of a background process.

### Solution

```bash
sleep 100 &
pid=$!

echo "$pid"
```

---

## Q31. Wait for a background process and obtain its exit status.

### Solution

```bash
(exit 7) &
pid=$!

wait "$pid"
echo $?
```

Output:

```text
7
```

---

## Q32. Calculate `10 / 3` using `bc` with decimals.

### Solution

```bash
echo "scale=2; 10/3" | bc
```

Output:

```text
3.33
```

---

## Q33. What does `Ctrl-D` represent?

### Solution

```text
EOF — End Of File
```

It is not a kill signal.

---

# 75. Advanced Practice

## Q34. Start `sleep` in the background, save its PID, wait for it, and print its exit code.

### Solution

```bash
sleep 2 &
pid=$!

wait "$pid"
echo $?
```

Expected output:

```text
0
```

---

## Q35. Start a child process that exits with status `42`, wait for it, and print its status.

### Solution

```bash
bash -c 'exit 42' &
pid=$!

wait "$pid"
echo $?
```

Expected output:

```text
42
```

---

## Q36. Create this directory structure using one command:

```text
app/
├── src/
├── tests/
├── docs/
└── config/
```

### Solution

```bash
mkdir -p app/{src,tests,docs,config}
```

---

## Q37. Run `command2` only if `command1` succeeds, otherwise print an error.

### Solution

```bash
command1 && command2 || echo "command1 failed"
```

For more complex logic, prefer:

```bash
if command1; then
    command2
else
    echo "command1 failed"
fi
```

---

## Q38. Start a process in one terminal and terminate it from another.

### Solution

### Terminal 1

```bash
sleep 1000
```

### Terminal 2

```bash
ps -e
```

Find the PID of `sleep`, then:

```bash
kill PID
```

---

# 76. Final Cheat Sheet

## Process Creation

```bash
sleep 100
command &
coproc command
```

## Job Control

```bash
jobs
jobs -l
fg
fg %1
bg
bg %1
```

Keyboard:

```text
Ctrl-C → SIGINT → interrupt foreground process
Ctrl-Z → SIGTSTP → suspend foreground process
```

## Signals

```bash
kill PID
kill -TERM PID
kill -KILL PID
kill -9 PID
```

Remember:

```text
kill PID
   ↓
SIGTERM

kill -9 PID
   ↓
SIGKILL
```

## Process Inspection

```bash
ps
ps -e
ps -ef
ps -e -o pid,ppid,stat,cmd
top
```

## Shell Information

```bash
echo $-
echo $$
echo $!
echo $?
```

```text
$- → shell flags
$$  → current shell PID
$!  → latest background PID
$?  → previous command's exit status
```

## Child Shell

```bash
bash
echo $$
exit
```

## History

```bash
history
!n
!!
```

## Brace Expansion

```bash
echo {1..5}
echo {1..10..2}
echo {a..e}
echo {red,green,blue}

touch file{1..5}.txt

mkdir -p project/{src,tests,docs}
```

## Multiple Commands

```bash
command1; command2
command1 && command2
command1 || command2
```

```text
;  → always continue
&& → continue on success
|| → continue on failure
```

## Exit Codes

```bash
true
echo $?

false
echo $?
```

```text
0     → success
nonzero → failure/exceptional condition
```

## Background Exit Status

```bash
command &
pid=$!

wait "$pid"
echo $?
```

## Calculator

```bash
bc
bc -l

echo "10 + 20" | bc
echo "scale=2; 10/3" | bc
```

## EOF

```text
Ctrl-D → EOF
```

---

# 77. One-Page Mental Model

```text
                         BASH / LINUX
                              │
         ┌────────────────────┼─────────────────────┐
         │                    │                     │
         ▼                    ▼                     ▼
      PROCESS              JOB CONTROL           SHELL
         │                    │                     │
         │                    │                     ├── history
         │                    │                     ├── !n
         │                    │                     ├── !!
         │                    │                     ├── brace expansion
         │                    │                     └── child shell
         │                    │
         ├── PID              ├── jobs
         ├── PPID             ├── fg
         ├── state            ├── bg
         └── exit status      ├── &
                              ├── Ctrl-Z
                              └── Ctrl-C
         │
         ▼
      SIGNALS
         │
   ┌─────┼────────────┐
   │     │            │
 SIGINT SIGTERM     SIGKILL
   │     │            │
Ctrl-C kill PID    kill -9 PID
```

And the most important relationship:

```text
                     COMMAND
                        │
                        ▼
                   Process runs
                        │
             ┌──────────┴──────────┐
             │                     │
          Foreground            Background
             │                     │
          Ctrl-C                jobs / fg / bg
          Ctrl-Z
             │
             ▼
          Signal
             │
             ▼
       Process terminates
             │
             ▼
         Exit status
             │
             ▼
            $?
             │
       ┌─────┼─────┐
       │     │     │
       0    nonzero
       │      │
    success  failure/
             condition
       │
       ▼
    && / || / if
       │
       ▼
    Automation
```

The core ideas to remember are:

```text
PID          → identifies a process
PPID         → identifies its parent
&            → background job
jobs         → show shell jobs
fg           → foreground job
bg           → resume job in background
Ctrl-C       → SIGINT
Ctrl-Z       → SIGTSTP
kill PID     → SIGTERM by default
kill -9 PID  → SIGKILL
ps -e        → inspect all processes
top          → monitor processes
$$           → current shell PID
$!           → latest background PID
$?           → previous command's exit status
!n           → execute history entry n
!!           → execute previous command
{...}        → brace expansion
;            → unconditional sequencing
&&           → success-dependent execution
||           → failure-dependent execution
bc           → command-line calculator
Ctrl-D       → EOF
0            → conventional success status
nonzero      → failure/exceptional status
```
