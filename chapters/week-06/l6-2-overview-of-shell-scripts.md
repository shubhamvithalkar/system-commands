---
layout: default
title: "L6.2 - Overview of Shell Scripts"
---

# L6.2 - Overview of Shell Scripts


# Bash Shell Scripting

Shell scripting is the process of writing a sequence of shell commands into a file so that the commands can be executed automatically.

Instead of typing:

```bash
mkdir backup
cp file.txt backup/
echo "Backup completed"
```

every time, we can put these commands into a script:

```bash
#!/bin/bash

mkdir backup
cp file.txt backup/
echo "Backup completed"
```

and execute the script.

The main idea is:

```text
Commands
   ↓
Script file
   ↓
Shell interprets the commands
   ↓
Task is automated
```

---

# 1. What Is a Script?

A script is a text file containing commands that a shell can execute.

For example:

```bash
#!/bin/bash

echo "Hello"
date
pwd
ls
```

Save it as:

```text
hello.sh
```

Then execute it.

A shell script can contain:

- commands
- variables
- input
- arguments
- conditions
- loops
- functions
- command substitution
- file operations

This allows us to build useful automation programs using the shell.

---

# 2. Types of Scripts

There are several ways to classify scripts.

## 2.1 Shell Scripts

A shell script is interpreted by a shell such as:

```text
bash
sh
zsh
```

Example:

```bash
#!/bin/bash

echo "Hello from Bash"
```

---

## 2.2 Executed Scripts

A script can be executed as a separate process.

Example:

```bash
./script.sh
```

The shell starts a process to interpret the script.

---

## 2.3 Sourced Scripts

A script can also be sourced into the current shell:

```bash
source script.sh
```

or:

```bash
. script.sh
```

The commands execute inside the **current shell environment**.

This distinction is extremely important.

---

# 3. Shebang

A shebang is the first line of an executable script that specifies which interpreter should run it.

Example:

```bash
#!/bin/bash
```

The first two characters are:

```text
#!
```

followed by the interpreter path.

For Bash:

```bash
#!/bin/bash
```

Another common form is:

```bash
#!/usr/bin/env bash
```

This asks `env` to locate `bash` using the environment's `PATH`.

---

# 4. Why Do We Need a Shebang?

Suppose a script contains:

```bash
#!/bin/bash

echo "Hello"
```

When you execute:

```bash
./script.sh
```

the operating system uses the interpreter specified by the shebang.

Conceptually:

```text
./script.sh
     ↓
#!/bin/bash
     ↓
/bin/bash
     ↓
execute script
```

Without a shebang, the behavior depends on how the script is invoked.

For example:

```bash
bash script.sh
```

explicitly tells Bash to interpret it, so the shebang is not required for that invocation.

---

# 5. Making a Script Executable

Create:

```bash
nano hello.sh
```

Put:

```bash
#!/bin/bash

echo "Hello World"
```

Save it.

Initially, the file may not have execute permission.

Check:

```bash
ls -l hello.sh
```

Give it execute permission:

```bash
chmod +x hello.sh
```

Then:

```bash
./hello.sh
```

Output:

```text
Hello World
```

---

# 6. Sourcing vs Executing

This is one of the most important shell scripting concepts.

There are two different ways to run a script.

## Execute

```bash
./script.sh
```

or:

```bash
bash script.sh
```

## Source

```bash
source script.sh
```

or:

```bash
. script.sh
```

The major difference is the shell environment in which the commands execute.

---

# 7. Executing a Script

Suppose `script.sh` contains:

```bash
#!/bin/bash

name="Shubham"
echo "$name"
```

Run:

```bash
./script.sh
```

The script runs in a separate shell process.

After it finishes:

```bash
echo "$name"
```

in your original shell will generally produce nothing because the variable was created in the script's shell.

Mental model:

```text
Parent shell
     │
     └── starts script shell
              │
              ├── name="Shubham"
              └── exits
```

The variable disappears with that child shell.

---

# 8. Sourcing a Script

Suppose the same script contains:

```bash
name="Shubham"
```

Run:

```bash
source script.sh
```

Now:

```bash
echo "$name"
```

will output:

```text
Shubham
```

Why?

Because the script was executed inside the current shell.

Mental model:

```text
Current shell
     │
     ├── name="Shubham"
     ├── echo
     └── continues
```

No separate shell is created just to interpret the sourced script.

---

# 9. Practical Difference

Create:

```bash
nano variables.sh
```

Contents:

```bash
#!/bin/bash

course="Linux"
```

Execute:

```bash
./variables.sh
echo "$course"
```

The variable is not normally available in the parent shell.

Now source:

```bash
source variables.sh
echo "$course"
```

Output:

```text
Linux
```

### Remember

```text
./script.sh
    ↓
separate execution environment

source script.sh
    ↓
current shell environment
```

Sourcing is commonly used for:

- shell configuration
- environment variables
- functions
- aliases
- activation scripts

For example:

```bash
source ~/.bashrc
```

---

# 10. Script Location

When you execute:

```bash
./script.sh
```

the `./` means:

> Look for `script.sh` in the current directory.

For example:

```bash
pwd
```

might show:

```text
/home/user/scripts
```

Then:

```bash
./backup.sh
```

means:

```text
/home/user/scripts/backup.sh
```

---

# 11. Running a Script from Another Directory

Suppose:

```text
/home/user/scripts/backup.sh
```

You are currently in:

```text
/home/user
```

You can execute:

```bash
./scripts/backup.sh
```

or:

```bash
/home/user/scripts/backup.sh
```

if it is executable.

You can also invoke it through Bash:

```bash
bash /home/user/scripts/backup.sh
```

---

# 12. Bash Environment

Every running shell has an environment containing variables and other shell state.

Common variables include:

```bash
$USER
$HOME
$PATH
$PWD
$HOSTNAME
```

Example:

```bash
echo "$USER"
```

```bash
echo "$HOME"
```

```bash
echo "$PATH"
```

```bash
echo "$PWD"
```

---

# 13. Environment Variables vs Shell Variables

A shell variable:

```bash
name="Shubham"
```

exists in the current shell.

To export it:

```bash
export name
```

Now child processes can inherit it.

Example:

```bash
export course="Linux"
bash -c 'echo "$course"'
```

Output:

```text
Linux
```

The child shell receives a copy of the exported variable.

---

# 14. `echo`

`echo` prints text or variable values.

Basic example:

```bash
echo "hello world"
```

Output:

```text
hello world
```

Multiple arguments:

```bash
echo Hello World
```

Output:

```text
Hello World
```

Another example:

```bash
echo "Linux" "Bash" "Scripting"
```

Output:

```text
Linux Bash Scripting
```

---

# 15. Quotes with `echo`

## Single Quotes

```bash
name="Shubham"

echo '$name'
```

Output:

```text
$name
```

Single quotes prevent variable expansion.

---

## Double Quotes

```bash
name="Shubham"

echo "$name"
```

Output:

```text
Shubham
```

Double quotes allow variable expansion.

---

## No Quotes

```bash
echo $name
```

This may work for simple values, but quoting variables is generally safer:

```bash
echo "$name"
```

---

# 16. `printf`

`printf` is a more predictable and flexible way to produce formatted output.

Example:

```bash
printf "Hello World\n"
```

Output:

```text
Hello World
```

The `\n` means newline.

Variables:

```bash
name="Shubham"

printf "Hello, %s\n" "$name"
```

Output:

```text
Hello, Shubham
```

Here:

```text
%s
```

means:

> format the argument as a string.

---

# 17. `printf` vs `echo`

For simple output:

```bash
echo "Hello"
```

is convenient.

For reliable formatting:

```bash
printf "Hello, %s\n" "$name"
```

is generally preferred in scripts.

Example:

```bash
printf "Name: %s\nAge: %d\n" "Shubham" 27
```

Output:

```text
Name: Shubham
Age: 27
```

---

# 18. Reading Input with `read`

The `read` command reads input from the user.

Example:

```bash
#!/bin/bash

echo "Enter your name:"
read name

echo "Hello $name"
```

Run:

```bash
./script.sh
```

Interaction:

```text
Enter your name:
Shubham
Hello Shubham
```

The basic model is:

```text
User types input
       ↓
      read
       ↓
variable receives value
```

---

# 19. `read -p`

Instead of using a separate `echo`:

```bash
read -p "Enter your name: " name
```

Example:

```bash
#!/bin/bash

read -p "Enter your name: " name
printf "Hello, %s\n" "$name"
```

---

# 20. Reading Multiple Values

```bash
read -p "Enter your first and last name: " first last
```

If the user enters:

```text
Shubham Vithalkar
```

then:

```text
first = Shubham
last  = Vithalkar
```

The splitting behavior is affected by `IFS`.

---

# 21. Script Arguments

A script can receive values from the command line.

Suppose:

```bash
#!/bin/bash

echo "$0"
echo "$1"
echo "$2"
```

Run:

```bash
./script.sh hello world
```

Possible output:

```text
./script.sh
hello
world
```

Here:

```text
$0 → script name
$1 → first argument
$2 → second argument
```

---

# 22. Positional Parameters

Important positional parameters:

```text
$0
$1
$2
$3
...
$9
```

Example:

```bash
#!/bin/bash

echo "Script: $0"
echo "First: $1"
echo "Second: $2"
```

Run:

```bash
./script.sh Linux Bash
```

Output:

```text
Script: ./script.sh
First: Linux
Second: Bash
```

---

# 23. `$#`

`$#` contains the number of positional arguments.

Script:

```bash
#!/bin/bash

echo "Number of arguments: $#"
```

Run:

```bash
./script.sh one two three
```

Output:

```text
Number of arguments: 3
```

---

# 24. `$@`

`$@` represents all positional arguments.

Example:

```bash
#!/bin/bash

echo "$@"
```

Run:

```bash
./script.sh one two three
```

Output:

```text
one two three
```

In scripts, prefer:

```bash
"$@"
```

when you want to preserve each argument as a separate word.

---

# 25. `$*`

`$*` also represents positional arguments, but its behavior differs from `"$@"` when quoted.

The important distinction is:

```bash
"$@"
```

expands positional parameters as separate words.

```bash
"$*"
```

typically joins them into a single word using the first character of `IFS`.

For example, with:

```text
one
two words
three
```

`"$@"` preserves these as three separate arguments.

This makes `"$@"` the usual choice when forwarding arguments:

```bash
some_command "$@"
```

---

# 26. `$@` vs `$*`

Remember:

```text
"$@"
 ↓
each argument remains separate

"$*"
 ↓
arguments are combined into one word
```

This distinction becomes important when arguments contain spaces.

---

# 27. Command Substitution

Command substitution allows us to capture the output of a command and use it as a value.

Modern syntax:

```bash
$(command)
```

Example:

```bash
today=$(date)
echo "$today"
```

The `date` command executes first.

Its output is stored in:

```text
today
```

Then:

```bash
echo "$today"
```

prints it.

---

# 28. Another Command Substitution Example

```bash
current_dir=$(pwd)

echo "You are in: $current_dir"
```

Possible output:

```text
You are in: /home/user/project
```

Another example:

```bash
files=$(ls)

echo "$files"
```

### Mental model

```text
command
   ↓
output
   ↓
$(...)
   ↓
variable
```

---

# 29. Command Substitution vs Quotes

Use:

```bash
today=$(date)
```

not the old-style:

```bash
today=`date`
```

Backticks work, but `$(...)` is preferred because it is easier to read and nest.

For example:

```bash
result=$(dirname "$(pwd)")
```

---

# 30. `for` Loop

A `for` loop repeats commands for multiple values.

Basic syntax:

```bash
for item in one two three
do
    echo "$item"
done
```

Output:

```text
one
two
three
```

The loop works like:

```text
item = one
  ↓
execute body

item = two
  ↓
execute body

item = three
  ↓
execute body
```

---

# 31. `for` Loop with Files

Example:

```bash
for file in *.txt
do
    echo "$file"
done
```

This processes each matching `.txt` pathname.

Example output:

```text
a.txt
b.txt
notes.txt
```

Be careful when filenames contain spaces; quote the variable:

```bash
echo "$file"
```

---

# 32. C-Style `for` Loop

Bash also supports:

```bash
for ((i=1; i<=5; i++))
do
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

This is useful when you need numeric iteration.

---

# 33. IFS — Internal Field Separator

`IFS` stands for:

> Internal Field Separator

It controls how Bash performs word splitting in contexts where word splitting occurs.

The default value generally contains:

```text
space
tab
newline
```

You can inspect it with:

```bash
printf '%q\n' "$IFS"
```

---

# 34. Why Is IFS Important?

Suppose:

```bash
text="Linux Bash Shell"
```

and:

```bash
for word in $text
do
    echo "$word"
done
```

Because the default `IFS` contains spaces, Bash splits the value into words:

```text
Linux
Bash
Shell
```

Conceptually:

```text
"Linux Bash Shell"
       ↓
     IFS
       ↓
Linux | Bash | Shell
```

---

# 35. Changing IFS

You can temporarily set `IFS`.

For example:

```bash
IFS=:
```

Now colon can be used as a field separator.

This is useful when processing colon-separated data such as:

```text
name:age:city
```

Example:

```bash
IFS=: read name age city <<< "Shubham:27:Bilaspur"

echo "$name"
echo "$age"
echo "$city"
```

Output:

```text
Shubham
27
Bilaspur
```

---

# 36. `case` Statement

Bash's `case` statement is similar to a switch statement in many programming languages.

Basic syntax:

```bash
case "$value" in
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

The statement ends with:

```bash
esac
```

which is `case` spelled backwards.

---

# 37. `case` Example

```bash
read -p "Enter a number: " number

case "$number" in
    1)
        echo "One"
        ;;
    2)
        echo "Two"
        ;;
    3)
        echo "Three"
        ;;
    *)
        echo "Something else"
        ;;
esac
```

If the user enters:

```text
2
```

output:

```text
Two
```

---

# 38. `case` with Patterns

`case` patterns use shell pattern matching.

Example:

```bash
case "$1" in
    *.txt)
        echo "Text file"
        ;;
    *.jpg|*.png)
        echo "Image file"
        ;;
    *)
        echo "Unknown file type"
        ;;
esac
```

Run:

```bash
./check.sh photo.jpg
```

Output:

```text
Image file
```

---

# 39. `if` Statement

The `if` statement performs conditional execution.

Basic syntax:

```bash
if condition
then
    commands
fi
```

The statement ends with:

```bash
fi
```

which is `if` backwards.

---

# 40. Basic `if` Example

```bash
if [ "$1" = "hello" ]
then
    echo "You said hello"
fi
```

Run:

```bash
./script.sh hello
```

Output:

```text
You said hello
```

---

# 41. `if`, `elif`, `else`

Full structure:

```bash
if condition
then
    commands
elif another_condition
then
    commands
else
    commands
fi
```

Example:

```bash
read -p "Enter your age: " age

if [ "$age" -ge 18 ]
then
    echo "Adult"
else
    echo "Minor"
fi
```

---

# 42. Conditions

Bash conditions can test:

- strings
- numbers
- files
- command exit status
- logical combinations

For example:

```bash
if [ "$name" = "Shubham" ]
then
    echo "Name matched"
fi
```

---

# 43. String Comparisons

Common string operators:

```text
=       equal
!=      not equal
-z      string is empty
-n      string is not empty
```

Example:

```bash
name="Shubham"

if [ "$name" = "Shubham" ]
then
    echo "Matched"
fi
```

Not equal:

```bash
if [ "$name" != "Rahul" ]
then
    echo "Different"
fi
```

Empty:

```bash
if [ -z "$name" ]
then
    echo "Empty"
fi
```

Non-empty:

```bash
if [ -n "$name" ]
then
    echo "Not empty"
fi
```

---

# 44. Numeric Comparisons

For integer comparisons, use:

```text
-eq    equal
-ne    not equal
-lt    less than
-le    less than or equal
-gt    greater than
-ge    greater than or equal
```

Example:

```bash
age=27

if [ "$age" -ge 18 ]
then
    echo "Adult"
fi
```

### Important

Do not confuse:

```bash
[ "$a" = "$b" ]
```

with:

```bash
[ "$a" -eq "$b" ]
```

The first is string comparison.

The second is integer comparison.

---

# 45. Modern `[[ ... ]]`

Bash also provides:

```bash
[[ ... ]]
```

Example:

```bash
if [[ "$name" == "Shubham" ]]
then
    echo "Matched"
fi
```

For Bash scripts, `[[ ... ]]` is often safer and more expressive than the traditional `[ ... ]`.

Example:

```bash
if [[ "$name" == S* ]]
then
    echo "Starts with S"
fi
```

Here `S*` is a shell pattern.

---

# 46. File Comparisons

Bash provides file-test operators.

Common ones:

```text
-e file    exists
-f file    regular file
-d file    directory
-r file    readable
-w file    writable
-x file    executable
-s file    exists and has non-zero size
```

Example:

```bash
if [ -f "data.txt" ]
then
    echo "Regular file exists"
fi
```

---

# 47. Directory Test

```bash
if [ -d "backup" ]
then
    echo "Backup directory exists"
fi
```

---

# 48. Executable Test

```bash
if [ -x "script.sh" ]
then
    echo "Script is executable"
fi
```

---

# 49. File Size Test

```bash
if [ -s "data.txt" ]
then
    echo "File is not empty"
fi
```

---

# 50. File Comparison by Modification Time

Bash also provides operators such as:

```text
-nt    newer than
-ot    older than
```

Example:

```bash
if [ "new.txt" -nt "old.txt" ]
then
    echo "new.txt is newer"
fi
```

Another:

```bash
if [ "old.txt" -ot "new.txt" ]
then
    echo "old.txt is older"
fi
```

---

# 51. Combining Conditions

Logical AND:

```bash
if [[ "$age" -ge 18 && "$age" -le 60 ]]
then
    echo "Working-age range"
fi
```

Logical OR:

```bash
if [[ "$name" == "Shubham" || "$name" == "Rahul" ]]
then
    echo "Known name"
fi
```

Negation:

```bash
if [[ ! -f "data.txt" ]]
then
    echo "File does not exist"
fi
```

---

# 52. Command Exit Status in Conditions

Linux commands return an exit status.

Generally:

```text
0       success
nonzero failure/other condition
```

Example:

```bash
if grep -q "ERROR" server.log
then
    echo "ERROR found"
else
    echo "No ERROR found"
fi
```

The `if` statement checks the exit status of `grep`.

This is one of the most important Bash concepts:

```text
command
   ↓
exit status
   ↓
if
   ↓
decision
```

---

# 53. `while` Loop

A `while` loop repeatedly executes commands while its condition succeeds.

Basic syntax:

```bash
while condition
do
    commands
done
```

Example:

```bash
count=1

while [ "$count" -le 5 ]
do
    echo "$count"
    count=$((count + 1))
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

# 54. How the `while` Loop Works

```text
Check condition
      ↓
  condition true?
    /       \
  yes        no
   ↓          ↓
execute      stop
body
   ↓
check again
```

For:

```bash
while [ "$count" -le 5 ]
```

the loop continues while `count` is less than or equal to 5.

---

# 55. Reading a File with `while`

A common Bash pattern is:

```bash
while IFS= read -r line
do
    echo "$line"
done < input.txt
```

This reads the file line by line.

Important:

```bash
IFS=
```

prevents leading/trailing whitespace from being stripped by `read`.

```bash
-r
```

prevents backslashes from being interpreted as escape characters.

This is a robust pattern for reading text files line by line.

---

# 56. Functions

A function is a reusable group of commands.

Instead of writing:

```bash
echo "Starting"
date
echo "Finished"
```

multiple times, put the logic into a function.

Basic syntax:

```bash
function_name() {
    commands
}
```

Example:

```bash
hello() {
    echo "Hello World"
}
```

Call it:

```bash
hello
```

Output:

```text
Hello World
```

---

# 57. Function Arguments

Functions can receive arguments using positional parameters.

Example:

```bash
greet() {
    echo "Hello, $1"
}

greet "Shubham"
```

Output:

```text
Hello, Shubham
```

Inside the function:

```text
$1
```

means the first argument passed to the function.

---

# 58. Multiple Function Arguments

```bash
add() {
    echo $(( $1 + $2 ))
}

add 10 20
```

Output:

```text
30
```

The function receives:

```text
$1 = 10
$2 = 20
```

---

# 59. Function Return Status

A Bash function can return an exit status.

Example:

```bash
check_file() {
    if [ -f "$1" ]
    then
        return 0
    else
        return 1
    fi
}
```

Use it:

```bash
if check_file "data.txt"
then
    echo "File exists"
else
    echo "File does not exist"
fi
```

Remember:

```text
return 0
    ↓
success

return non-zero
    ↓
failure/false condition
```

---

# 60. Function Output

Functions can also produce output with `echo` or `printf`.

Example:

```bash
get_date() {
    date
}

result=$(get_date)

echo "$result"
```

This combines:

```text
function
   ↓
command output
   ↓
command substitution
```

---

# 61. Complete Example

Here is a small Bash script combining several concepts:

```bash
#!/bin/bash

read -p "Enter your name: " name

if [[ -z "$name" ]]
then
    echo "Name cannot be empty"
    exit 1
fi

greet() {
    printf "Hello, %s!\n" "$1"
}

today=$(date "+%Y-%m-%d")

greet "$name"

echo "Today is: $today"

for item in Linux Bash Scripting
do
    echo "Learning: $item"
done
```

Possible execution:

```text
Enter your name: Shubham
Hello, Shubham!
Today is: 2026-09-08
Learning: Linux
Learning: Bash
Learning: Scripting
```

This one script demonstrates:

```text
shebang
read
if
[[ ]]
function
printf
command substitution
for loop
variables
arguments
```

---

# 62. Script Arguments + Conditions

A practical script can use command-line arguments:

```bash
#!/bin/bash

if [ "$#" -lt 1 ]
then
    echo "Usage: $0 filename"
    exit 1
fi

if [ -f "$1" ]
then
    echo "$1 is a regular file"
else
    echo "$1 is not a regular file"
fi
```

Run:

```bash
./check.sh data.txt
```

Possible output:

```text
data.txt is a regular file
```

Run without arguments:

```bash
./check.sh
```

Output:

```text
Usage: ./check.sh filename
```

---

# 63. Practical Script: File Backup

```bash
#!/bin/bash

if [ "$#" -ne 1 ]
then
    echo "Usage: $0 directory"
    exit 1
fi

if [ ! -d "$1" ]
then
    echo "Directory does not exist"
    exit 1
fi

backup="backup-$(date +%Y%m%d-%H%M%S).tar.gz"

tar -czf "$backup" "$1"

echo "Backup created: $backup"
```

Run:

```bash
./backup.sh logfiles
```

The script:

```text
$#
 ↓
checks number of arguments

$1
 ↓
gets directory

-d
 ↓
checks directory

$(date ...)
 ↓
generates timestamp

tar
 ↓
creates backup
```

---

# 64. Important Bash Syntax to Remember

## Variable

```bash
name="Shubham"
```

## Use variable

```bash
echo "$name"
```

## Command substitution

```bash
result=$(command)
```

## Read input

```bash
read name
```

## Script argument

```bash
$1
```

## Number of arguments

```bash
$#
```

## All arguments

```bash
"$@"
```

## If

```bash
if condition
then
    commands
fi
```

## Case

```bash
case "$x" in
    pattern)
        commands
        ;;
esac
```

## For

```bash
for x in a b c
do
    commands
done
```

## While

```bash
while condition
do
    commands
done
```

## Function

```bash
name() {
    commands
}
```

---

# 65. Common Mistakes

## Mistake 1: Spaces around variable assignment

Wrong:

```bash
name = "Shubham"
```

Correct:

```bash
name="Shubham"
```

---

## Mistake 2: Forgetting `$`

Wrong:

```bash
echo "name"
```

This prints:

```text
name
```

Correct:

```bash
echo "$name"
```

---

## Mistake 3: Not quoting variables

Prefer:

```bash
echo "$name"
```

instead of:

```bash
echo $name
```

Especially important for filenames and values containing spaces.

---

## Mistake 4: Confusing `$#` and `$@`

```text
$#
 ↓
number of arguments

$@
 ↓
arguments themselves
```

---

## Mistake 5: Using `$*` when you need separate arguments

When forwarding arguments, prefer:

```bash
command "$@"
```

rather than:

```bash
command "$*"
```

---

## Mistake 6: Forgetting `fi`

Wrong:

```bash
if [ "$x" = "yes" ]
then
    echo "Yes"
```

Correct:

```bash
if [ "$x" = "yes" ]
then
    echo "Yes"
fi
```

---

## Mistake 7: Forgetting `esac`

Correct:

```bash
case "$x" in
    yes)
        echo "Yes"
        ;;
    no)
        echo "No"
        ;;
esac
```

---

## Mistake 8: Infinite `while` loop

This can run forever:

```bash
count=1

while [ "$count" -le 5 ]
do
    echo "$count"
done
```

`count` never changes.

Correct:

```bash
count=1

while [ "$count" -le 5 ]
do
    echo "$count"
    count=$((count + 1))
done
```

---

# 66. Exam Perspective

You should be able to explain the difference between:

```text
./script.sh
```

and:

```bash
source script.sh
```

You should know:

```text
$0   script name
$1   first argument
$2   second argument
$#   argument count
$@   all arguments
$*   all arguments, different quoting behavior
```

You should know:

```text
if    → fi
case  → esac
for   → done
while → done
```

You should know:

```bash
$(command)
```

means command substitution.

You should know:

```bash
IFS
```

controls word splitting in relevant shell operations.

You should know the difference between:

```text
=      string comparison
-eq    integer comparison
-f     regular file
-d     directory
-e     exists
-r     readable
-w     writable
-x     executable
```

You should know:

```bash
return 0
```

means successful function status, while a non-zero status generally indicates failure or another condition.

---

# 67. Practice Questions

## Q1

Create a Bash script that prints:

```text
Hello World
```

### Solution

```bash
#!/bin/bash

echo "Hello World"
```

---

## Q2

Write a script that accepts a name as its first argument and prints:

```text
Hello, <name>
```

### Solution

```bash
#!/bin/bash

echo "Hello, $1"
```

Run:

```bash
./hello.sh Shubham
```

---

## Q3

Write a script that prints the number of arguments.

### Solution

```bash
#!/bin/bash

echo "Arguments: $#"
```

---

## Q4

Write a script that prints every argument separately.

### Solution

```bash
#!/bin/bash

for arg in "$@"
do
    echo "$arg"
done
```

---

## Q5

Write a script that asks the user for their name using `read`.

### Solution

```bash
#!/bin/bash

read -p "Enter your name: " name
echo "Hello, $name"
```

---

## Q6

Write a script that stores the output of `date` in a variable.

### Solution

```bash
#!/bin/bash

today=$(date)

echo "$today"
```

---

## Q7

Write a script that checks whether the first argument is a regular file.

### Solution

```bash
#!/bin/bash

if [ -f "$1" ]
then
    echo "Regular file"
else
    echo "Not a regular file"
fi
```

---

## Q8

Write a script that checks whether the first argument is a directory.

### Solution

```bash
#!/bin/bash

if [ -d "$1" ]
then
    echo "Directory"
else
    echo "Not a directory"
fi
```

---

## Q9

Write a `for` loop that prints numbers from 1 to 5.

### Solution

```bash
#!/bin/bash

for ((i=1; i<=5; i++))
do
    echo "$i"
done
```

---

## Q10

Write a `while` loop that prints numbers from 1 to 5.

### Solution

```bash
#!/bin/bash

i=1

while [ "$i" -le 5 ]
do
    echo "$i"
    i=$((i + 1))
done
```

---

## Q11

Write a `case` statement that prints:

```text
start → Starting
stop  → Stopping
*     → Unknown command
```

### Solution

```bash
#!/bin/bash

case "$1" in
    start)
        echo "Starting"
        ;;
    stop)
        echo "Stopping"
        ;;
    *)
        echo "Unknown command"
        ;;
esac
```

---

## Q12

Write a function called `greet` that accepts a name.

### Solution

```bash
#!/bin/bash

greet() {
    echo "Hello, $1"
}

greet "Shubham"
```

---

## Q13 — Exam Level

Write a script that:

1. Requires exactly one argument.
2. Checks whether it is a regular file.
3. Prints its size using `du -h`.
4. Prints an error if the argument is not a file.

### Solution

```bash
#!/bin/bash

if [ "$#" -ne 1 ]
then
    echo "Usage: $0 filename"
    exit 1
fi

if [ -f "$1" ]
then
    du -h "$1"
else
    echo "Not a regular file"
    exit 1
fi
```

---

## Q14 — Exam Level

Write a script that accepts any number of filenames and prints only the files that exist.

### Solution

```bash
#!/bin/bash

for file in "$@"
do
    if [ -e "$file" ]
    then
        echo "$file"
    fi
done
```

---

## Q15 — Exam Level

Write a script that asks for a directory and then prints all `.log` files inside it.

### Solution

```bash
#!/bin/bash

read -p "Enter directory: " dir

if [ ! -d "$dir" ]
then
    echo "Directory does not exist"
    exit 1
fi

for file in "$dir"/*.log
do
    if [ -f "$file" ]
    then
        echo "$file"
    fi
done
```

---

# 68. Final Mental Model

```text
BASH SCRIPT
│
├── Shebang
│     └── #!/bin/bash
│
├── Input
│     ├── read
│     └── arguments: $1, $2, ...
│
├── Variables
│     ├── $USER
│     ├── $HOME
│     └── custom variables
│
├── Output
│     ├── echo
│     └── printf
│
├── Command substitution
│     └── $(command)
│
├── Decisions
│     ├── if
│     └── case
│
├── Loops
│     ├── for
│     └── while
│
├── Data splitting
│     └── IFS
│
└── Reusable logic
      └── functions
```

## Core Bash Script Pattern

```bash
#!/bin/bash

# Input
read -p "Enter something: " value

# Decision
if [[ -n "$value" ]]
then
    echo "You entered: $value"
else
    echo "Nothing entered"
fi

# Loop
for item in one two three
do
    echo "$item"
done

# Function
greet() {
    echo "Hello, $1"
}

greet "$value"
```

The key progression to remember is:

```text
Commands
   ↓
Variables
   ↓
Input / Arguments
   ↓
Command Substitution
   ↓
Conditions
   ↓
Loops
   ↓
Functions
   ↓
Complete Automation Scripts
```
