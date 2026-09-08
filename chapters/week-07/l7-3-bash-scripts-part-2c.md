---
layout: default
title: "L7..3 - Bash scripts - Part 2C"
---

# L7..3 - Bash scripts - Part 2C

# Advanced Bash: `eval`, `getopts` and `select`

This lesson covers three useful Bash features:

- `eval` — evaluate a command constructed as a string
- `getopts` — parse command-line options such as `-v`, `-f file`
- `select` — create simple interactive menus

---

# 1. `eval`

`eval` tells the shell:

> Take its arguments, combine them into a command, and evaluate that command again.

Basic syntax:

```bash
eval command
```

The important idea is that `eval` causes an additional round of shell parsing.

---

# 2. Simple `eval` Example

```bash
cmd="echo Hello"

eval "$cmd"
```

Output:

```text
Hello
```

Without `eval`:

```bash
cmd="echo Hello"

"$cmd"
```

Bash would try to find a command literally named:

```text
echo Hello
```

which does not exist.

With:

```bash
eval "$cmd"
```

the contents of `cmd` are interpreted as shell code:

```bash
echo Hello
```

---

# 3. Mental Model of `eval`

Suppose:

```bash
cmd="echo Hello"
```

The variable contains:

```text
echo Hello
```

Then:

```bash
eval "$cmd"
```

conceptually performs:

```text
String
  ↓
"echo Hello"
  ↓
eval
  ↓
Shell parses it as a command
  ↓
echo Hello
  ↓
Hello
```

So:

```text
eval = evaluate the resulting command again
```

---

# 4. Why Does `eval` Exist?

Sometimes a script dynamically constructs shell commands.

For example:

```bash
command="ls"
options="-l"

eval "$command $options"
```

The resulting command is:

```bash
ls -l
```

and the output is the same as running:

```bash
ls -l
```

However, `eval` should be used carefully because its second parsing stage can introduce unexpected command execution.

---

# 5. `eval` with Variables

Example:

```bash
name="Shubham"
cmd="echo Hello $name"

eval "$cmd"
```

Output:

```text
Hello Shubham
```

The command stored in `cmd` is evaluated.

---

# 6. `eval` and Shell Expansion

Consider:

```bash
x=10
cmd='echo $x'

echo "$cmd"
```

Output:

```text
echo $x
```

But:

```bash
eval "$cmd"
```

Output:

```text
10
```

Why?

The first parsing stores:

```text
echo $x
```

Then `eval` causes another parsing/evaluation pass, during which:

```bash
$x
```

is expanded.

---

# 7. `eval` Example with Arithmetic

```bash
x=10
y=20

cmd='echo $((x + y))'

eval "$cmd"
```

Output:

```text
30
```

The second evaluation interprets:

```bash
echo $((x + y))
```

---

# 8. `eval` and Positional Arguments

Suppose:

```bash
cmd="echo"
arg="Hello"

eval "$cmd '$arg'"
```

Output:

```text
Hello
```

But this illustrates why quoting becomes complicated with `eval`.

Every additional parsing stage means shell metacharacters can acquire new meaning.

---

# 9. Security Warning — `eval`

Never blindly use untrusted input with `eval`.

For example:

```bash
user_input="$1"

eval "$user_input"
```

If the user supplies shell commands, `eval` can execute them.

For example, an input containing:

```bash
rm -rf ...
```

could become actual shell code.

Therefore:

```text
eval + untrusted input = dangerous
```

---

# 10. Prefer Arrays for Dynamic Commands

Instead of:

```bash
cmd="ls -l"
eval "$cmd"
```

Bash arrays are often safer.

Example:

```bash
cmd=(ls -l)

"${cmd[@]}"
```

Output is equivalent to:

```bash
ls -l
```

For arguments:

```bash
cmd=(grep -i "hello" file.txt)

"${cmd[@]}"
```

This avoids another shell parsing pass.

---

# 11. When `eval` Is Actually Useful

`eval` appears in situations involving:

- dynamically generated shell code
- dynamically generated variable names
- old shell scripts
- advanced metaprogramming
- certain shell wrappers

But in modern Bash, ask first:

> Can I use arrays, parameter expansion, functions, or indirect expansion instead?

Often the answer is yes.

---

# 12. `getopts`

`getopts` is a Bash built-in used to parse command-line options.

For example, suppose we want our script to support:

```bash
./script.sh -v
```

or:

```bash
./script.sh -f file.txt
```

Instead of manually examining `$1`, `$2`, etc., we can use:

```bash
getopts
```

---

# 13. Why `getopts` Is Useful

Suppose the user runs:

```bash
./backup.sh -v -f data.txt
```

We want:

```text
-v → verbose mode
-f → filename
```

`getopts` handles this option parsing.

Mental model:

```text
Command line
     |
     v
  getopts
     |
     +---- -v → option
     |
     +---- -f → option
              |
              v
          data.txt
```

---

# 14. Basic `getopts` Syntax

Basic structure:

```bash
while getopts "options" opt; do
    case "$opt" in
        option1)
            ...
            ;;
        option2)
            ...
            ;;
    esac
done
```

For example:

```bash
while getopts "v" opt; do
    case "$opt" in
        v)
            echo "Verbose mode"
            ;;
    esac
done
```

Run:

```bash
./script.sh -v
```

Output:

```text
Verbose mode
```

---

# 15. The Option String

Consider:

```bash
getopts "vf:" opt
```

The option string contains:

```text
v
f:
```

Meaning:

```text
v   → option does not require an argument
f:  → option requires an argument
```

The colon is important.

---

# 16. Option Without an Argument

Example:

```bash
getopts "v" opt
```

The command:

```bash
./script.sh -v
```

sets:

```bash
$opt
```

to:

```text
v
```

---

# 17. Option Requiring an Argument

Example:

```bash
getopts "f:" opt
```

The `:` after `f` means:

> `-f` requires a value.

Run:

```bash
./script.sh -f data.txt
```

Then:

```bash
$opt
```

contains:

```text
f
```

and:

```bash
$OPTARG
```

contains:

```text
data.txt
```

---

# 18. `OPTARG`

`OPTARG` contains the argument associated with the current option.

Example:

```bash
#!/bin/bash

while getopts "f:" opt; do
    case "$opt" in
        f)
            echo "File: $OPTARG"
            ;;
    esac
done
```

Run:

```bash
./script.sh -f data.txt
```

Output:

```text
File: data.txt
```

---

# 19. Complete `getopts` Example

```bash
#!/bin/bash

verbose=false
file=""

while getopts "vf:" opt; do
    case "$opt" in
        v)
            verbose=true
            ;;
        f)
            file="$OPTARG"
            ;;
        *)
            echo "Usage: $0 [-v] [-f file]"
            exit 1
            ;;
    esac
done

echo "Verbose: $verbose"
echo "File: $file"
```

Run:

```bash
./script.sh -v -f data.txt
```

Output:

```text
Verbose: true
File: data.txt
```

---

# 20. Multiple Options

`getopts` can process several options.

```bash
./script.sh -v -f data.txt
```

The loop processes:

```text
-v
-f data.txt
```

one option at a time.

Example:

```bash
while getopts "vf:" opt; do
    case "$opt" in
        v)
            echo "Verbose enabled"
            ;;
        f)
            echo "File = $OPTARG"
            ;;
    esac
done
```

Output:

```text
Verbose enabled
File = data.txt
```

---

# 21. Combined Short Options

Short options can often be combined.

For example:

```bash
./script.sh -v
```

is straightforward.

If several options do not require arguments, they can be combined:

```bash
./script.sh -abc
```

with:

```bash
getopts "abc" opt
```

The loop can process:

```text
a
b
c
```

individually.

---

# 22. Option Argument

Consider:

```bash
getopts "ab:f:" opt
```

This means:

```text
a → no argument
b → requires argument
f → requires argument
```

For:

```bash
./script.sh -a -b hello -f data.txt
```

the loop receives:

```text
a
b → OPTARG=hello
f → OPTARG=data.txt
```

---

# 23. Handling Invalid Options

A robust script should handle invalid options.

Example:

```bash
#!/bin/bash

while getopts "vf:" opt; do
    case "$opt" in
        v)
            echo "Verbose"
            ;;
        f)
            echo "File: $OPTARG"
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            exit 1
            ;;
    esac
done
```

Run:

```bash
./script.sh -x
```

Since `x` is not defined in:

```bash
"vf:"
```

the invalid-option branch is triggered.

---

# 24. Handling Missing Option Arguments

Suppose:

```bash
getopts "f:" opt
```

and the user runs:

```bash
./script.sh -f
```

`-f` requires an argument.

A robust parser can detect this.

Example:

```bash
#!/bin/bash

while getopts ":f:" opt; do
    case "$opt" in
        f)
            echo "File: $OPTARG"
            ;;
        :)
            echo "Option -$OPTARG requires an argument"
            exit 1
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            exit 1
            ;;
    esac
done
```

Notice the leading colon:

```bash
":f:"
```

---

# 25. Why the Leading `:` Matters

Compare:

```bash
getopts "f:" opt
```

with:

```bash
getopts ":f:" opt
```

The leading colon enables more controlled error handling.

With:

```bash
":f:"
```

you can handle:

```bash
:)
```

for a missing argument and:

```bash
\?)
```

for an invalid option.

This is a useful exam detail.

---

# 26. `OPTIND`

`getopts` maintains an index called:

```bash
OPTIND
```

It indicates the position of the next argument to be processed.

Initially, it is normally:

```text
1
```

After parsing options, `OPTIND` points beyond the processed options.

This becomes useful when positional arguments follow the options.

---

# 27. `OPTIND` and `shift`

After parsing options, a common pattern is:

```bash
shift $((OPTIND - 1))
```

Example:

```bash
#!/bin/bash

while getopts "vf:" opt; do
    case "$opt" in
        v)
            echo "Verbose"
            ;;
        f)
            echo "File: $OPTARG"
            ;;
    esac
done

shift $((OPTIND - 1))

echo "Remaining arguments:"

for arg in "$@"; do
    echo "$arg"
done
```

Run:

```bash
./script.sh -v -f data.txt file1 file2
```

After option processing, the remaining arguments are:

```text
file1
file2
```

---

# 28. Why `shift $((OPTIND - 1))`?

Suppose:

```text
$1 = -v
$2 = -f
$3 = data.txt
$4 = file1
$5 = file2
```

After `getopts`, `OPTIND` points after the options.

Then:

```bash
shift $((OPTIND - 1))
```

removes the already-processed option arguments.

The remaining `$@` contains:

```text
file1
file2
```

---

# 29. `getopts` Complete Practical Example

```bash
#!/bin/bash

verbose=false
file=""

while getopts ":vf:" opt; do
    case "$opt" in
        v)
            verbose=true
            ;;
        f)
            file="$OPTARG"
            ;;
        :)
            echo "Option -$OPTARG requires an argument"
            exit 1
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            exit 1
            ;;
    esac
done

shift $((OPTIND - 1))

echo "Verbose: $verbose"
echo "File: $file"

echo "Remaining arguments:"
for arg in "$@"; do
    echo "$arg"
done
```

Run:

```bash
./script.sh -v -f data.txt one two three
```

Output:

```text
Verbose: true
File: data.txt
Remaining arguments:
one
two
three
```

---

# 30. `select` Loop

Bash provides:

```bash
select
```

for creating simple interactive menus.

Basic syntax:

```bash
select variable in item1 item2 item3; do
    commands
done
```

Bash automatically displays numbered choices.

---

# 31. Basic `select` Example

```bash
select color in Red Green Blue; do
    echo "You selected $color"
done
```

Bash displays something similar to:

```text
1) Red
2) Green
3) Blue
#?
```

If the user enters:

```text
2
```

then:

```bash
$color
```

becomes:

```text
Green
```

---

# 32. Understanding `select`

The syntax:

```bash
select color in Red Green Blue
```

creates:

```text
1) Red
2) Green
3) Blue
```

The user enters a number.

Bash stores the selected item in:

```bash
$color
```

The user's actual input number is stored in:

```bash
$REPLY
```

---

# 33. `$REPLY`

This is important.

Example:

```bash
select color in Red Green Blue; do
    echo "REPLY=$REPLY"
    echo "color=$color"
    break
done
```

If the user selects:

```text
2
```

output:

```text
REPLY=2
color=Green
```

So:

```text
$REPLY → user's selection
$color → selected item
```

---

# 34. `select` Usually Needs `break`

A `select` loop is still a loop.

Therefore:

```bash
select color in Red Green Blue; do
    echo "You selected $color"
done
```

continues displaying the menu.

To exit after one selection:

```bash
select color in Red Green Blue; do
    echo "You selected $color"
    break
done
```

---

# 35. `select` with `case`

`select` and `case` work very well together.

Example:

```bash
select choice in Start Stop Restart Exit; do

    case "$choice" in
        Start)
            echo "Starting"
            ;;
        Stop)
            echo "Stopping"
            ;;
        Restart)
            echo "Restarting"
            ;;
        Exit)
            echo "Goodbye"
            break
            ;;
        *)
            echo "Invalid choice"
            ;;
    esac

done
```

This creates a simple interactive menu.

---

# 36. Example Menu

The script may display:

```text
1) Start
2) Stop
3) Restart
4) Exit
#?
```

If the user enters:

```text
3
```

the result is:

```text
Restarting
```

If the user enters:

```text
4
```

the script prints:

```text
Goodbye
```

and exits the loop.

---

# 37. Handling Invalid `select` Input

Suppose:

```bash
select choice in Start Stop Exit; do
    case "$choice" in
        Start)
            echo "Starting"
            ;;
        Stop)
            echo "Stopping"
            ;;
        Exit)
            break
            ;;
        *)
            echo "Invalid selection"
            ;;
    esac
done
```

If the user enters:

```text
99
```

there is no corresponding menu item.

Then:

```bash
$choice
```

is empty.

The `*` case handles the invalid selection.

---

# 38. Checking `$REPLY`

Sometimes it is useful to inspect the actual number.

```bash
select choice in Start Stop Exit; do

    if [[ -z $choice ]]; then
        echo "Invalid choice: $REPLY"
        continue
    fi

    echo "Selected: $choice"
    break
done
```

For example:

```text
1) Start
2) Stop
3) Exit
#? 9
Invalid choice: 9
```

---

# 39. Customizing the Menu Prompt

By default, Bash uses:

```text
#?
```

You can change the prompt using:

```bash
PS3
```

Example:

```bash
PS3="Choose an option: "

select choice in Start Stop Exit; do
    echo "You chose: $choice"

    [[ $choice == Exit ]] && break
done
```

The prompt becomes:

```text
1) Start
2) Stop
3) Exit
Choose an option:
```

---

# 40. Complete Interactive Menu

```bash
#!/bin/bash

PS3="Choose an action: "

select action in Start Stop Restart Exit; do

    case "$action" in
        Start)
            echo "Starting service..."
            ;;
        Stop)
            echo "Stopping service..."
            ;;
        Restart)
            echo "Restarting service..."
            ;;
        Exit)
            echo "Exiting..."
            break
            ;;
        *)
            echo "Invalid selection: $REPLY"
            ;;
    esac

done
```

This is a practical Bash menu.

---

# 41. `select` with Functions

You can combine menus with functions.

```bash
start_service() {
    echo "Starting..."
}

stop_service() {
    echo "Stopping..."
}

PS3="Choose: "

select action in Start Stop Exit; do
    case "$action" in
        Start)
            start_service
            ;;
        Stop)
            stop_service
            ;;
        Exit)
            break
            ;;
        *)
            echo "Invalid"
            ;;
    esac
done
```

This is a cleaner design for larger scripts.

---

# 42. `eval` vs `getopts` vs `select`

These three commands solve completely different problems.

| Feature | Purpose |
|---|---|
| `eval` | Evaluate constructed shell code |
| `getopts` | Parse command-line options |
| `select` | Create interactive numbered menus |

Mental model:

```text
eval
 ↓
"Treat this string as shell code"

getopts
 ↓
"Understand -v, -f file, etc."

select
 ↓
"Show the user a numbered menu"
```

---

# 43. Combining `getopts` and `select`

A real script can use both.

For example:

```bash
#!/bin/bash

verbose=false

while getopts "v" opt; do
    case "$opt" in
        v)
            verbose=true
            ;;
    esac
done

PS3="Choose: "

select action in Start Stop Exit; do
    case "$action" in
        Start)
            echo "Starting"
            ;;
        Stop)
            echo "Stopping"
            ;;
        Exit)
            break
            ;;
        *)
            echo "Invalid"
            ;;
    esac
done
```

Run:

```bash
./script.sh -v
```

First:

```text
-v
```

is processed by `getopts`.

Then the interactive menu is displayed using `select`.

---

# 44. Important Exam Points

## `eval`

```bash
eval "$cmd"
```

causes another round of shell evaluation.

Be careful with untrusted input.

---

## `getopts`

```bash
while getopts ":vf:" opt; do
```

means:

```text
v → no argument
f → requires argument
```

Current option:

```bash
$opt
```

Argument of current option:

```bash
$OPTARG
```

Index:

```bash
$OPTIND
```

After parsing:

```bash
shift $((OPTIND - 1))
```

---

## `select`

```bash
select choice in A B C; do
    ...
done
```

Selected value:

```bash
$choice
```

User's numeric input:

```bash
$REPLY
```

Menu prompt:

```bash
PS3
```

Exit menu:

```bash
break
```

---

# 45. Common Mistakes

## Mistake 1 — Unsafe `eval`

Avoid:

```bash
eval "$user_input"
```

when the input is untrusted.

---

## Mistake 2 — Forgetting `:` in `getopts`

If:

```bash
-f
```

requires an argument, write:

```bash
getopts "f:" opt
```

not:

```bash
getopts "f" opt
```

---

## Mistake 3 — Confusing `OPTARG` and `OPTIND`

```text
OPTARG → argument belonging to current option
OPTIND → position/index used by getopts
```

---

## Mistake 4 — Forgetting `shift`

After processing options:

```bash
shift $((OPTIND - 1))
```

is commonly used to remove the parsed options from `$@`.

---

## Mistake 5 — Forgetting `break` in `select`

This:

```bash
select choice in A B C; do
    echo "$choice"
done
```

continues displaying the menu.

Use:

```bash
break
```

when you want to exit.

---

## Mistake 6 — Confusing `$REPLY` and the selected variable

If:

```bash
select color in Red Green Blue
```

and the user enters:

```text
2
```

then:

```text
REPLY = 2
color = Green
```

---

# 46. Practice Questions

## Q1 — `eval`

Create:

```bash
cmd="echo Hello World"
```

and use `eval` to execute the command stored in the variable.

---

## Q2 — `eval`

Create:

```bash
x=10
cmd='echo $x'
```

Use `eval` so that the output is:

```text
10
```

---

## Q3 — `getopts`

Write a script supporting:

```text
-v
```

for verbose mode.

Example:

```bash
./script.sh -v
```

should print:

```text
Verbose mode enabled
```

---

## Q4 — `getopts`

Write a script supporting:

```text
-f filename
```

and print the filename using:

```bash
$OPTARG
```

---

## Q5 — Multiple Options

Write a script supporting:

```text
-v
-f filename
```

Example:

```bash
./script.sh -v -f data.txt
```

Expected:

```text
Verbose: true
File: data.txt
```

---

## Q6 — Remaining Arguments

Write a script that accepts:

```bash
./script.sh -v -f data.txt file1 file2 file3
```

and prints:

```text
file1
file2
file3
```

after parsing the options.

---

## Q7 — `select`

Create a menu:

```text
1) Python
2) Bash
3) JavaScript
4) Exit
```

Print the selected language.

---

## Q8 — `select` + `case`

Create a menu:

```text
1) Start
2) Stop
3) Restart
4) Exit
```

Use `case` to perform the appropriate action.

---

## Q9 — `REPLY`

Create a `select` menu that prints both:

```text
Selected number:
Selected item:
```

using:

```bash
$REPLY
$choice
```

---

## Q10 — Advanced

Create a script supporting:

```text
-v
-f filename
```

using `getopts`, then display a `select` menu:

```text
1) Show file
2) Show current directory
3) Exit
```

---

# 47. Solutions

## Solution 1

```bash
cmd="echo Hello World"

eval "$cmd"
```

Output:

```text
Hello World
```

---

## Solution 2

```bash
x=10
cmd='echo $x'

eval "$cmd"
```

Output:

```text
10
```

---

## Solution 3

```bash
#!/bin/bash

while getopts "v" opt; do
    case "$opt" in
        v)
            echo "Verbose mode enabled"
            ;;
    esac
done
```

---

## Solution 4

```bash
#!/bin/bash

while getopts "f:" opt; do
    case "$opt" in
        f)
            echo "File: $OPTARG"
            ;;
    esac
done
```

Run:

```bash
./script.sh -f data.txt
```

Output:

```text
File: data.txt
```

---

## Solution 5

```bash
#!/bin/bash

verbose=false
file=""

while getopts "vf:" opt; do
    case "$opt" in
        v)
            verbose=true
            ;;
        f)
            file="$OPTARG"
            ;;
    esac
done

echo "Verbose: $verbose"
echo "File: $file"
```

---

## Solution 6

```bash
#!/bin/bash

while getopts "vf:" opt; do
    case "$opt" in
        v)
            ;;
        f)
            ;;
    esac
done

shift $((OPTIND - 1))

for arg in "$@"; do
    echo "$arg"
done
```

---

## Solution 7

```bash
#!/bin/bash

PS3="Choose a language: "

select language in Python Bash JavaScript Exit; do

    if [[ $language == "Exit" ]]; then
        break
    fi

    if [[ -z $language ]]; then
        echo "Invalid choice"
        continue
    fi

    echo "You selected: $language"
    break

done
```

---

## Solution 8

```bash
#!/bin/bash

PS3="Choose an action: "

select action in Start Stop Restart Exit; do

    case "$action" in
        Start)
            echo "Starting..."
            ;;
        Stop)
            echo "Stopping..."
            ;;
        Restart)
            echo "Restarting..."
            ;;
        Exit)
            echo "Goodbye"
            break
            ;;
        *)
            echo "Invalid choice: $REPLY"
            ;;
    esac

done
```

---

## Solution 9

```bash
#!/bin/bash

select choice in Red Green Blue; do
    echo "Selected number: $REPLY"
    echo "Selected item: $choice"
    break
done
```

If the user enters:

```text
2
```

output:

```text
Selected number: 2
Selected item: Green
```

---

## Solution 10

```bash
#!/bin/bash

verbose=false
file=""

while getopts ":vf:" opt; do
    case "$opt" in
        v)
            verbose=true
            ;;
        f)
            file="$OPTARG"
            ;;
        :)
            echo "Option -$OPTARG requires an argument"
            exit 1
            ;;
        \?)
            echo "Invalid option: -$OPTARG"
            exit 1
            ;;
    esac
done

shift $((OPTIND - 1))

PS3="Choose an action: "

select action in "Show file" "Show current directory" Exit; do

    case "$action" in
        "Show file")
            if [[ -n $file ]]; then
                cat "$file"
            else
                echo "No file specified"
            fi
            ;;
        "Show current directory")
            pwd
            ;;
        Exit)
            echo "Goodbye"
            break
            ;;
        *)
            echo "Invalid choice: $REPLY"
            ;;
    esac

done
```

---

# 48. Final Cheat Sheet

```text
eval
────────────────────────────────────────
Evaluate a command again.

cmd="echo Hello"
eval "$cmd"
```

```text
getopts
────────────────────────────────────────
Parse command-line options.

while getopts ":vf:" opt; do
    case "$opt" in
        v) ... ;;
        f) echo "$OPTARG" ;;
        :) ... ;;
        \?) ... ;;
    esac
done

shift $((OPTIND - 1))
```

Important variables:

```text
$opt       → current option
$OPTARG    → argument of current option
$OPTIND    → option index
```

```text
select
────────────────────────────────────────
Create a numbered interactive menu.

PS3="Choose: "

select choice in A B C Exit; do
    ...
done
```

Important variables:

```text
$choice    → selected item
$REPLY     → user's numeric input
$PS3       → menu prompt
```

---

# 49. Final Mental Model

```text
eval
  ↓
STRING → SHELL CODE
```

```text
getopts
  ↓
-v
-f file
-h
  ↓
OPTIONS → PROGRAM VARIABLES
```

```text
select
  ↓
1) Option A
2) Option B
3) Option C
  ↓
USER CHOICE → PROGRAM ACTION
```

The three concepts should not be confused:

```text
eval    → execute dynamically constructed shell code
getopts → parse command-line options
select  → build an interactive menu
```
```
