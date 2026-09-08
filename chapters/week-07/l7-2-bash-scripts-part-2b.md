---
layout: default
title: "L5.4 - Bash scripts - Part 2B"
---

# L5.4 - Bash scripts - Part 2B



# Advanced Bash Control Flow

This lesson covers:

- `if`
- `if-else`
- `if-elif-else`
- `case`
- C-style `for` loops
- Redirecting loop output to files
- Measuring execution time with `time`
- `break`
- `break 2`
- `continue`
- `shift`
- `exec`

These are important for writing real Bash programs and are also common in System Commands exams.

---

# 1. `if` Statement

The `if` statement allows a script to make decisions.

Basic syntax:

```bash
if condition; then
    commands
fi
```

Example:

```bash
age=20

if (( age >= 18 )); then
    echo "Adult"
fi
```

Output:

```text
Adult
```

The condition is evaluated first.

If the condition succeeds, the commands inside the `if` block execute.

---

# 2. `if-else`

Sometimes we want one action when the condition is true and another when it is false.

Syntax:

```bash
if condition; then
    commands
else
    commands
fi
```

Example:

```bash
age=15

if (( age >= 18 )); then
    echo "Adult"
else
    echo "Minor"
fi
```

Output:

```text
Minor
```

Mental model:

```text
             condition
                 |
          +------+------+
          |             |
        true          false
          |             |
       if block      else block
```

---

# 3. `if-elif-else`

When there are multiple conditions, use:

```bash
if condition1; then
    commands
elif condition2; then
    commands
elif condition3; then
    commands
else
    commands
fi
```

Example:

```bash
marks=75

if (( marks >= 90 )); then
    echo "A"
elif (( marks >= 75 )); then
    echo "B"
elif (( marks >= 60 )); then
    echo "C"
else
    echo "D"
fi
```

Output:

```text
B
```

---

# 4. How `if-elif-else` Works

Bash checks conditions from top to bottom.

For:

```bash
if condition1; then
    ...
elif condition2; then
    ...
elif condition3; then
    ...
else
    ...
fi
```

The first true condition wins.

For example:

```bash
marks=95

if (( marks >= 90 )); then
    echo "A"
elif (( marks >= 75 )); then
    echo "B"
fi
```

Output:

```text
A
```

Bash does not continue checking the later `elif` conditions after finding a true condition.

---

# 5. Multiple Conditions

Using `[[ ]]`:

```bash
if [[ $age -ge 18 && $age -le 60 ]]; then
    echo "Working age"
fi
```

This means:

```text
age >= 18 AND age <= 60
```

Using `||`:

```bash
if [[ $day == "Saturday" || $day == "Sunday" ]]; then
    echo "Weekend"
fi
```

This means:

```text
Saturday OR Sunday
```

---

# 6. `case` Statement

`case` is useful when one value needs to be compared against several possible patterns.

Basic syntax:

```bash
case "$variable" in
    pattern1)
        commands
        ;;
    pattern2)
        commands
        ;;
    *)
        default commands
        ;;
esac
```

Important keywords:

```text
case
in
)
;;
esac
```

---

# 7. Simple `case` Example

```bash
choice="y"

case "$choice" in
    y)
        echo "Yes"
        ;;
    n)
        echo "No"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac
```

Output:

```text
Yes
```

---

# 8. Why Use `case`?

Suppose we write:

```bash
if [[ $choice == "start" ]]; then
    ...
elif [[ $choice == "stop" ]]; then
    ...
elif [[ $choice == "restart" ]]; then
    ...
else
    ...
fi
```

This works.

But `case` is often cleaner:

```bash
case "$choice" in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
    restart)
        echo "Restarting"
        ;;
    *)
        echo "Unknown command"
        ;;
esac
```

---

# 9. Multiple Patterns in `case`

You can combine patterns using:

```text
|
```

Example:

```bash
case "$answer" in
    y|Y|yes|YES)
        echo "Accepted"
        ;;
    n|N|no|NO)
        echo "Rejected"
        ;;
    *)
        echo "Invalid"
        ;;
esac
```

So:

```text
y
Y
yes
YES
```

all select the first branch.

---

# 10. Wildcards in `case`

`case` patterns can use shell pattern matching.

Example:

```bash
filename="test.txt"

case "$filename" in
    *.txt)
        echo "Text file"
        ;;
    *.jpg|*.png)
        echo "Image file"
        ;;
    *)
        echo "Other file"
        ;;
esac
```

Output:

```text
Text file
```

---

# 11. `case` vs `if`

Use `if` when evaluating conditions such as:

```bash
if (( age >= 18 )); then
```

Use `case` when matching one value against multiple patterns:

```bash
case "$command" in
    start)
        ...
        ;;
    stop)
        ...
        ;;
esac
```

A useful mental model:

```text
if       → evaluate conditions
case     → match a value against patterns
```

---

# 12. C-Style `for` Loop

Bash supports a C-style `for` loop:

```bash
for (( initialization; condition; increment ))
do
    commands
done
```

A common example:

```bash
for ((i=0; i<10; i++))
do
    echo "$i"
done
```

Output:

```text
0
1
2
3
4
5
6
7
8
9
```

---

# 13. Understanding `for ((i=0;i<10;i++))`

Break it into three parts:

```bash
for ((i=0; i<10; i++))
```

### Part 1 — Initialization

```bash
i=0
```

Runs once at the beginning.

### Part 2 — Condition

```bash
i<10
```

Checked before every iteration.

### Part 3 — Increment

```bash
i++
```

Runs after each iteration.

Mental model:

```text
i=0
 |
 v
check i<10
 |
 +---- false ---> stop
 |
 true
 |
 v
run body
 |
 v
i++
 |
 +----> check again
```

---

# 14. C-Style Loop Example

```bash
for ((i=1; i<=5; i++)); do
    echo "i = $i"
done
```

Output:

```text
i = 1
i = 2
i = 3
i = 4
i = 5
```

---

# 15. Decrementing

The increment expression does not have to be `++`.

Example:

```bash
for ((i=10; i>=1; i--)); do
    echo "$i"
done
```

Output:

```text
10
9
8
7
6
5
4
3
2
1
```

---

# 16. Incrementing by More Than One

Example:

```bash
for ((i=0; i<=20; i+=2)); do
    echo "$i"
done
```

Output:

```text
0
2
4
6
8
10
12
14
16
18
20
```

Another example:

```bash
for ((i=0; i<20; i+=5)); do
    echo "$i"
done
```

Output:

```text
0
5
10
15
```

---

# 17. Nested C-Style Loops

Loops can be nested.

Example:

```bash
for ((i=1; i<=3; i++)); do
    for ((j=1; j<=3; j++)); do
        echo "i=$i j=$j"
    done
done
```

Output:

```text
i=1 j=1
i=1 j=2
i=1 j=3
i=2 j=1
i=2 j=2
i=2 j=3
i=3 j=1
i=3 j=2
i=3 j=3
```

The inner loop completes for each iteration of the outer loop.

---

# 18. Redirecting Loop Output to a File

A loop's output can be redirected just like the output of any other command.

Example:

```bash
for ((i=1; i<=5; i++)); do
    echo "$i"
done > numbers.txt
```

Now:

```bash
cat numbers.txt
```

Output:

```text
1
2
3
4
5
```

The important point is that:

```bash
> numbers.txt
```

is applied to the entire loop.

---

# 19. Redirecting a Loop with `{ }`

Another form is:

```bash
{
    echo "Hello"
    echo "World"
} > output.txt
```

Similarly:

```bash
for ((i=1; i<=5; i++)); do
    echo "$i"
done > output.txt
```

The output of all iterations goes into the same file.

---

# 20. Append Instead of Overwrite

Use:

```bash
>>
```

instead of:

```bash
>
```

Example:

```bash
for ((i=1; i<=5; i++)); do
    echo "$i"
done >> numbers.txt
```

This appends the output to the existing file.

Remember:

```text
>   → overwrite/create
>>  → append/create
```

---

# 21. Redirecting Both Output and Errors

You can also redirect standard output and standard error.

For example:

```bash
for ((i=1; i<=5; i++)); do
    echo "Processing $i"
done > output.txt 2> errors.txt
```

Or combine them:

```bash
for ((i=1; i<=5; i++)); do
    echo "Processing $i"
done > output.txt 2>&1
```

Modern Bash also supports:

```bash
for ((i=1; i<=5; i++)); do
    echo "Processing $i"
done &> output.txt
```

---

# 22. `time` — Measure Execution Time

The `time` command measures how long a command takes to execute.

Syntax:

```bash
time command
```

Example:

```bash
time sleep 2
```

The command waits approximately two seconds.

Then `time` reports timing information.

Typical output resembles:

```text
real    0m2.00s
user    0m0.00s
sys     0m0.00s
```

Exact formatting can vary by shell.

---

# 23. Meaning of `real`, `user`, and `sys`

### `real`

The actual elapsed wall-clock time.

Think:

> How much time did I wait?

### `user`

CPU time spent executing user-space code.

### `sys`

CPU time spent in kernel/system calls on behalf of the process.

So:

```text
real
```

is usually the most intuitive value when asking:

> How long did this command take?

---

# 24. Timing a Loop

Example:

```bash
time for ((i=0; i<5; i++)); do
    sleep 1
done
```

The loop sleeps for approximately:

```text
5 seconds
```

Therefore the `real` time should be around five seconds.

---

# 25. Timing a Script

You can also time an entire script:

```bash
time ./script.sh
```

Or:

```bash
time bash script.sh
```

This is useful for performance testing.

---

# 26. `break`

`break` immediately terminates the current loop.

Example:

```bash
for ((i=1; i<=10; i++)); do
    if (( i == 5 )); then
        break
    fi

    echo "$i"
done
```

Output:

```text
1
2
3
4
```

When:

```bash
i == 5
```

becomes true:

```bash
break
```

terminates the loop.

---

# 27. Mental Model of `break`

Without `break`:

```text
1 → 2 → 3 → 4 → 5 → 6 → ...
```

With:

```bash
if (( i == 5 )); then
    break
fi
```

execution becomes:

```text
1 → 2 → 3 → 4 → 5
                  |
                break
                  |
                  v
               exit loop
```

---

# 28. `break` in a `while` Loop

`break` works with different loop types.

```bash
i=1

while (( i <= 10 )); do
    if (( i == 6 )); then
        break
    fi

    echo "$i"
    ((i++))
done
```

Output:

```text
1
2
3
4
5
```

---

# 29. `break` in Nested Loops

Suppose:

```bash
for ((i=1; i<=3; i++)); do
    for ((j=1; j<=3; j++)); do
        if (( j == 2 )); then
            break
        fi

        echo "i=$i j=$j"
    done
done
```

Output:

```text
i=1 j=1
i=2 j=1
i=3 j=1
```

Why?

Because ordinary:

```bash
break
```

breaks only the **innermost loop**.

---

# 30. `break 2`

To break out of two nested loops:

```bash
break 2
```

Example:

```bash
for ((i=1; i<=3; i++)); do
    for ((j=1; j<=3; j++)); do

        if (( i == 2 && j == 2 )); then
            break 2
        fi

        echo "i=$i j=$j"
    done
done
```

Output:

```text
i=1 j=1
i=1 j=2
i=1 j=3
i=2 j=1
```

When:

```text
i=2
j=2
```

is reached:

```bash
break 2
```

terminates:

1. inner loop
2. outer loop

---

# 31. General Form of `break`

Bash allows:

```bash
break
```

or:

```bash
break n
```

where `n` specifies how many enclosing loops to exit.

Examples:

```bash
break
break 2
break 3
```

`break 2` means:

> Exit two levels of loops.

---

# 32. `continue`

`continue` is different from `break`.

`continue` does **not** terminate the loop.

Instead, it skips the rest of the current iteration and moves to the next iteration.

Example:

```bash
for ((i=1; i<=5; i++)); do

    if (( i == 3 )); then
        continue
    fi

    echo "$i"
done
```

Output:

```text
1
2
4
5
```

The iteration where:

```text
i=3
```

is skipped.

---

# 33. `break` vs `continue`

This distinction is extremely important.

### `break`

```text
Stop the loop completely.
```

### `continue`

```text
Skip the current iteration.
Continue with the next iteration.
```

Visual:

```text
break:

iteration
   |
 break
   |
 exit loop
```

```text
continue:

iteration
   |
continue
   |
next iteration
```

---

# 34. `continue` Example

Print only odd numbers:

```bash
for ((i=1; i<=10; i++)); do
    if (( i % 2 == 0 )); then
        continue
    fi

    echo "$i"
done
```

Output:

```text
1
3
5
7
9
```

When `i` is even, `continue` skips the `echo`.

---

# 35. `continue` in Nested Loops

Like `break`, `continue` normally affects the innermost loop.

Example:

```bash
for ((i=1; i<=2; i++)); do
    for ((j=1; j<=3; j++)); do
        if (( j == 2 )); then
            continue
        fi

        echo "i=$i j=$j"
    done
done
```

Output:

```text
i=1 j=1
i=1 j=3
i=2 j=1
i=2 j=3
```

Only the current inner-loop iteration is skipped.

---

# 36. `shift`

`shift` is used for processing positional arguments in Bash scripts.

Recall:

```text
$0 → script name
$1 → first argument
$2 → second argument
$3 → third argument
...
```

Suppose:

```bash
./script.sh apple banana orange
```

Initially:

```text
$1 = apple
$2 = banana
$3 = orange
```

After:

```bash
shift
```

the arguments move left:

```text
$1 = banana
$2 = orange
```

---

# 37. Mental Model of `shift`

Before:

```text
$1       $2       $3       $4
apple    banana   orange   mango
```

Run:

```bash
shift
```

After:

```text
$1       $2       $3
banana   orange   mango
```

The original `$1` is removed from the positional parameter list.

---

# 38. Basic `shift` Example

Script:

```bash
#!/bin/bash

echo "First: $1"

shift

echo "Now first: $1"
echo "Now second: $2"
```

Run:

```bash
./script.sh apple banana
```

Output:

```text
First: apple
Now first: banana
Now second:
```

There was initially only:

```text
$1 = apple
$2 = banana
```

After shifting:

```text
$1 = banana
```

and there is no `$2`.

---

# 39. `shift n`

You can specify how many positions to shift.

Syntax:

```bash
shift [n]
```

For example:

```bash
shift 2
```

moves arguments two positions to the left.

Suppose:

```text
$1 = apple
$2 = banana
$3 = orange
$4 = mango
```

After:

```bash
shift 2
```

we get:

```text
$1 = orange
$2 = mango
```

---

# 40. `shift` Example

```bash
#!/bin/bash

echo "Before:"
echo "1 = $1"
echo "2 = $2"
echo "3 = $3"

shift 2

echo "After:"
echo "1 = $1"
echo "2 = $2"
```

Run:

```bash
./script.sh A B C D
```

Initially:

```text
$1 = A
$2 = B
$3 = C
$4 = D
```

After:

```bash
shift 2
```

we get:

```text
$1 = C
$2 = D
```

---

# 41. Why `shift` Is Useful

`shift` is extremely useful when processing an unknown number of arguments.

Example:

```bash
while (( $# > 0 )); do
    echo "Argument: $1"
    shift
done
```

Run:

```bash
./script.sh apple banana orange
```

Output:

```text
Argument: apple
Argument: banana
Argument: orange
```

---

# 42. How the Argument Loop Works

Initially:

```text
$# = 3

$1 = apple
$2 = banana
$3 = orange
```

Iteration 1:

```bash
echo "$1"
shift
```

Now:

```text
$# = 2
$1 = banana
$2 = orange
```

Iteration 2:

```bash
echo "$1"
shift
```

Now:

```text
$# = 1
$1 = orange
```

Iteration 3:

```bash
echo "$1"
shift
```

Now:

```text
$# = 0
```

Loop ends.

---

# 43. `shift` and `$@`

A very common argument-processing pattern is:

```bash
while (( $# > 0 )); do
    case "$1" in
        -v)
            echo "Verbose mode"
            ;;
        -q)
            echo "Quiet mode"
            ;;
        *)
            echo "Unknown option: $1"
            ;;
    esac

    shift
done
```

Here:

```bash
$1
```

is processed and then:

```bash
shift
```

moves to the next argument.

This is the basic idea behind many command-line option parsers.

---

# 44. `shift` Does Not Change `$0`

`shift` operates on positional parameters beginning with:

```text
$1
```

It does not shift:

```text
$0
```

So the script name remains:

```bash
$0
```

---

# 45. `exec`

`exec` is a very important shell command.

It replaces the **current shell/process** with another command.

Basic syntax:

```bash
exec command
```

After successful `exec`, the original shell does not continue running the following commands.

---

# 46. Basic `exec` Example

Create:

```bash
#!/bin/bash

echo "Before exec"

exec ls

echo "After exec"
```

Run it.

Output will contain:

```text
Before exec
```

followed by the output of:

```bash
ls
```

But:

```text
After exec
```

will not be printed.

Why?

Because:

```bash
exec ls
```

replaces the current shell process with `ls`.

There is no longer a shell process available to execute the next `echo`.

---

# 47. Mental Model of `exec`

Without `exec`:

```text
Shell
  |
  +-- runs command
  |
  +-- returns to shell
  |
  +-- runs next command
```

With:

```bash
exec command
```

the model is:

```text
Shell
  |
  | exec
  v
Command replaces shell
  |
  v
Command finishes
```

The shell itself is replaced.

---

# 48. `exec` Does Not Create a Child Process

This is a crucial distinction.

Normally:

```bash
command
```

means the shell runs the command, generally using a child process when appropriate, then the shell continues.

With:

```bash
exec command
```

the current process image is replaced by the command.

Conceptually:

```text
command
    ↓
shell remains

exec command
    ↓
shell replaced
```

---

# 49. `exec` Example with `bash`

Consider:

```bash
#!/bin/bash

echo "Shell PID: $$"

exec bash

echo "This will never execute"
```

The new Bash process takes over the current process slot.

The important idea is:

```text
exec → replace current process
```

rather than:

```text
exec → create another independent process and return
```

---

# 50. `exec` in Shell Scripts

A common use is to turn a wrapper script into the real application.

Example:

```bash
#!/bin/bash

echo "Starting application"

exec ./application
```

The wrapper shell is replaced by:

```text
./application
```

This can be useful when you want the application to receive signals directly and appear as the main process.

---

# 51. `exec` with Redirection

`exec` can also permanently change file descriptors for the current shell.

Example:

```bash
exec > output.log
```

After this point, standard output from the current shell and subsequently executed commands is redirected to:

```text
output.log
```

For example:

```bash
exec > output.log

echo "Hello"
echo "World"
```

The messages go into:

```text
output.log
```

This is a different use of `exec`: modifying file descriptors without replacing the shell with an external command.

---

# 52. `exec` and File Descriptors

For example:

```bash
exec 3> output.txt
```

opens:

```text
output.txt
```

for writing on file descriptor:

```text
3
```

Then:

```bash
echo "Hello" >&3
```

writes to that file descriptor.

Finally:

```bash
exec 3>&-
```

closes file descriptor 3.

This is an advanced use of `exec`.

---

# 53. `exec` vs Normal Command

Compare:

```bash
ls
echo "Done"
```

with:

```bash
exec ls
echo "Done"
```

First:

```bash
ls
```

finishes and the shell continues:

```bash
echo "Done"
```

Second:

```bash
exec ls
```

replaces the shell.

Therefore:

```bash
echo "Done"
```

is never reached.

---

# 54. Complete Practical Example

This example combines several concepts:

```bash
#!/bin/bash

if (( $# == 0 )); then
    echo "Usage: $0 number..."
    exit 1
fi

while (( $# > 0 )); do

    if [[ $1 =~ ^[0-9]+$ ]]; then
        echo "Processing: $1"
    else
        echo "Skipping: $1"
    fi

    shift
done
```

Run:

```bash
./script.sh 10 abc 20 xyz 30
```

Output:

```text
Processing: 10
Skipping: abc
Processing: 20
Skipping: xyz
Processing: 30
```

This uses:

```text
$#
$1
[[ =~ ]]
regex
shift
while
```

---

# 55. Complete Example with `break` and `continue`

```bash
for ((i=1; i<=10; i++)); do

    if (( i == 3 )); then
        continue
    fi

    if (( i == 8 )); then
        break
    fi

    echo "$i"
done
```

Output:

```text
1
2
4
5
6
7
```

Explanation:

```text
i=1 → print
i=2 → print
i=3 → continue
i=4 → print
i=5 → print
i=6 → print
i=7 → print
i=8 → break
```

---

# 56. Complete Example with `case` and `shift`

A simple command-line parser:

```bash
#!/bin/bash

while (( $# > 0 )); do

    case "$1" in
        -v)
            echo "Verbose mode"
            ;;
        -q)
            echo "Quiet mode"
            ;;
        -h)
            echo "Help"
            ;;
        *)
            echo "Unknown argument: $1"
            ;;
    esac

    shift
done
```

Run:

```bash
./script.sh -v -h -q
```

Output:

```text
Verbose mode
Help
Quiet mode
```

The process is:

```text
read $1
   ↓
case matches it
   ↓
perform action
   ↓
shift
   ↓
read next $1
   ↓
repeat
```

---

# 57. Common Mistakes

## Mistake 1 — Forgetting `fi`

Incorrect:

```bash
if (( x > 10 )); then
    echo "Large"
```

Correct:

```bash
if (( x > 10 )); then
    echo "Large"
fi
```

---

## Mistake 2 — Forgetting `;;` in `case`

Incorrect:

```bash
case "$x" in
    a)
        echo "A"
    b)
        echo "B"
esac
```

Correct:

```bash
case "$x" in
    a)
        echo "A"
        ;;
    b)
        echo "B"
        ;;
esac
```

---

## Mistake 3 — Confusing `break` and `continue`

```bash
break
```

terminates the loop.

```bash
continue
```

skips only the current iteration.

---

## Mistake 4 — Forgetting that `break` affects the innermost loop

In nested loops:

```bash
break
```

normally exits only the inner loop.

Use:

```bash
break 2
```

to exit two loop levels.

---

## Mistake 5 — Forgetting `shift`

This can create an infinite loop:

```bash
while (( $# > 0 )); do
    echo "$1"
done
```

`$#` never decreases.

Correct:

```bash
while (( $# > 0 )); do
    echo "$1"
    shift
done
```

---

## Mistake 6 — Expecting commands after `exec` to run

This:

```bash
exec ls
echo "Done"
```

does not print:

```text
Done
```

because `exec` replaced the current shell with `ls`.

---

# 58. Exam-Oriented Questions

## Q1

Write a Bash program using:

```bash
if-elif-else
```

that prints:

```text
A
B
C
D
F
```

according to marks:

```text
90+ → A
75–89 → B
60–74 → C
40–59 → D
<40 → F
```

---

## Q2

Write a `case` statement that accepts:

```text
start
stop
restart
```

and prints the corresponding action.

---

## Q3

Write a C-style loop:

```bash
for ((i=0;i<10;i++))
```

that prints all numbers from `0` to `9`.

---

## Q4

Write a loop that prints:

```text
2
4
6
8
10
```

using `(( ))`.

---

## Q5

Redirect the output of a loop printing numbers `1` to `100` into:

```text
numbers.txt
```

---

## Q6

Use:

```bash
time
```

to measure how long a command:

```bash
sleep 3
```

takes.

---

## Q7

Write a loop from `1` to `10` that stops completely when it reaches `6`.

---

## Q8

Create two nested loops and use:

```bash
break 2
```

to terminate both loops when:

```text
i=3
j=3
```

---

## Q9

Print numbers from `1` to `10`, but skip all even numbers using:

```bash
continue
```

---

## Q10

Write a script that accepts an arbitrary number of arguments and prints every argument using:

```bash
while
shift
```

---

## Q11

What will happen?

```bash
#!/bin/bash

echo "A"
exec echo "B"
echo "C"
```

---

# 59. Solutions

## Solution 1

```bash
read -r -p "Enter marks: " marks

if (( marks >= 90 )); then
    echo "A"
elif (( marks >= 75 )); then
    echo "B"
elif (( marks >= 60 )); then
    echo "C"
elif (( marks >= 40 )); then
    echo "D"
else
    echo "F"
fi
```

---

## Solution 2

```bash
read -r -p "Enter command: " command

case "$command" in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
    restart)
        echo "Restarting"
        ;;
    *)
        echo "Unknown command"
        ;;
esac
```

---

## Solution 3

```bash
for ((i=0; i<10; i++)); do
    echo "$i"
done
```

Output:

```text
0
1
2
3
4
5
6
7
8
9
```

---

## Solution 4

```bash
for ((i=2; i<=10; i+=2)); do
    echo "$i"
done
```

---

## Solution 5

```bash
for ((i=1; i<=100; i++)); do
    echo "$i"
done > numbers.txt
```

---

## Solution 6

```bash
time sleep 3
```

The `real` time should be approximately three seconds.

---

## Solution 7

```bash
for ((i=1; i<=10; i++)); do

    if (( i == 6 )); then
        break
    fi

    echo "$i"
done
```

Output:

```text
1
2
3
4
5
```

---

## Solution 8

```bash
for ((i=1; i<=5; i++)); do
    for ((j=1; j<=5; j++)); do

        if (( i == 3 && j == 3 )); then
            break 2
        fi

        echo "i=$i j=$j"
    done
done
```

---

## Solution 9

```bash
for ((i=1; i<=10; i++)); do

    if (( i % 2 == 0 )); then
        continue
    fi

    echo "$i"
done
```

Output:

```text
1
3
5
7
9
```

---

## Solution 10

```bash
while (( $# > 0 )); do
    echo "$1"
    shift
done
```

Run:

```bash
./script.sh apple banana orange
```

Output:

```text
apple
banana
orange
```

---

## Solution 11

```bash
#!/bin/bash

echo "A"
exec echo "B"
echo "C"
```

Output:

```text
A
B
```

`C` is never printed because:

```bash
exec echo "B"
```

replaces the current shell with `echo`.

---

# 60. Final Cheat Sheet

## Conditions

```bash
if condition; then
    ...
fi
```

```bash
if condition; then
    ...
else
    ...
fi
```

```bash
if condition1; then
    ...
elif condition2; then
    ...
else
    ...
fi
```

---

## Case

```bash
case "$x" in
    pattern1)
        ...
        ;;
    pattern2)
        ...
        ;;
    *)
        ...
        ;;
esac
```

Multiple patterns:

```bash
case "$x" in
    a|A)
        ...
        ;;
esac
```

---

## C-Style For

```bash
for ((i=0; i<10; i++)); do
    echo "$i"
done
```

Increment by 2:

```bash
for ((i=0; i<=10; i+=2)); do
    echo "$i"
done
```

---

## Redirect Loop Output

```bash
for ((i=1; i<=10; i++)); do
    echo "$i"
done > numbers.txt
```

Append:

```bash
done >> numbers.txt
```

---

## Measure Time

```bash
time command
```

Example:

```bash
time sleep 3
```

---

## Break

```bash
break
```

Exit current loop.

```bash
break 2
```

Exit two nested loop levels.

---

## Continue

```bash
continue
```

Skip the current iteration and continue with the next iteration.

---

## Shift

```bash
shift
```

Equivalent to:

```text
$2 → $1
$3 → $2
$4 → $3
...
```

Shift by multiple positions:

```bash
shift 3
```

Process all arguments:

```bash
while (( $# > 0 )); do
    echo "$1"
    shift
done
```

---

## Exec

Replace current process:

```bash
exec command
```

Example:

```bash
exec bash
```

or:

```bash
exec ./application
```

After successful `exec`, commands following it in the original shell script do not execute.

---

# 61. Most Important Exam Differences

```text
if
↓
condition-based decision
```

```text
case
↓
pattern-based selection
```

```text
for ((...))
↓
C-style numeric loop
```

```text
break
↓
exit current loop
```

```text
break 2
↓
exit two loop levels
```

```text
continue
↓
skip current iteration
```

```text
shift
↓
move positional arguments left
```

```text
time command
↓
measure command execution time
```

```text
exec command
↓
replace current shell/process with command
```

The three distinctions worth memorizing especially well are:

```text
break     → stop loop
continue  → skip iteration
shift     → move command-line arguments
```

and:

```text
command   → shell normally continues afterward
exec command → current shell is replaced
```
```
