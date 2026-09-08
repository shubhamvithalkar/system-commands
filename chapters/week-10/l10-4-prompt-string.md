---
layout: default
title: "L10.4 : Prompt String"
---

# L10.4 : Prompt String



# Shell Types and Shell Prompts

A **shell** is a command-line interpreter that allows users to interact with an operating system by entering commands.

Linux and Unix systems provide different types of shells, each with its own syntax, features, and prompt behavior.

---

# 1. Types of Shells

There are several commonly used Unix/Linux shells.

| Shell | Description |
|---|---|
| `sh` | Traditional Unix shell |
| `bash` | Bourne Again Shell; widely used on Linux |
| `zsh` | Feature-rich shell, popular for interactive use |
| `ksh` | Korn Shell |
| `csh` | C Shell |
| `tcsh` | Enhanced version of C Shell |
| `fish` | Friendly Interactive Shell |

### Check the current shell

```bash
echo $SHELL
```

Example:

```text
/bin/bash
```

### List available shells

```bash
cat /etc/shells
```

Example:

```text
/bin/sh
/bin/bash
/usr/bin/zsh
/bin/fish
```

---

# 2. Bash Prompts

Bash provides several special prompt variables.

```text
PS1 → Primary prompt
PS2 → Secondary prompt
PS3 → select-loop prompt
PS4 → Debugging/trace prompt
```

The four prompts have different purposes:

| Variable | Purpose |
|---|---|
| `PS1` | Normal interactive command prompt |
| `PS2` | Continuation prompt |
| `PS3` | Prompt used by `select` |
| `PS4` | Prefix used when tracing commands with `set -x` |

---

# 3. `PS1` — Primary Prompt

`PS1` controls the normal Bash command prompt.

For example:

```text
user@computer:~$
```

The value of `PS1` can be inspected with:

```bash
echo "$PS1"
```

A typical Bash prompt might contain:

```text
\u@\h:\w\$
```

These are **prompt escape sequences** that Bash expands when displaying the prompt.

---

# 4. Escape Sequences in the Bash Prompt

Bash provides special escape sequences that can be placed inside `PS1`.

These sequences begin with a backslash (`\`).

For example:

```bash
PS1="\u@\h:\w\$ "
```

might produce:

```text
shubham@ubuntu:~$
```

### Common prompt escape sequences

| Escape | Meaning |
|---|---|
| `\u` | Current username |
| `\h` | Hostname up to the first `.` |
| `\H` | Full hostname |
| `\w` | Current working directory |
| `\W` | Basename of current working directory |
| `\t` | Current time in 24-hour `HH:MM:SS` format |
| `\d` | Current date |
| `\#` | Command number of the current command |
| `\!` | History number of the current command |
| `\$` | `#` for root, `$` otherwise |
| `\n` | Newline |
| `\[` | Begin non-printing sequence |
| `\]` | End non-printing sequence |

---

# 5. Display Time with `\t`

The `\t` escape sequence displays the current time.

```bash
PS1="\t $ "
```

Example:

```text
14:32:08 $
```

Every time Bash displays the prompt, the time is updated.

---

# 6. Display Date with `\d`

The `\d` escape sequence displays the current date.

```bash
PS1="\d $ "
```

Example:

```text
Tue Sep 08 $ 
```

This is useful when you want the date to be visible directly in your terminal prompt.

---

# 7. Display Command History Number with `\#`

The `\#` escape sequence displays the **command number** of the current command in the current Bash session.

Example:

```bash
PS1="[\#] $ "
```

The prompt may look like:

```text
[1] $
[2] $
[3] $
```

After entering more commands:

```text
[4] $
[5] $
[6] $
```

### Important distinction

Bash has both:

```text
\# → command number in the current shell session
\! → history number
```

They are related but not necessarily identical.

---

# 8. Changing the Bash Prompt

You can temporarily change `PS1`:

```bash
PS1="MyShell> "
```

The prompt becomes:

```text
MyShell>
```

Another example:

```bash
PS1="\u@\h:\w\$ "
```

Example:

```text
shubham@ubuntu:~/Linux_exam$
```

### Important

Changing `PS1` directly affects the **current shell session**.

It does not necessarily make the change permanent.

---

# 9. Resetting the Prompt with `source ~/.bashrc`

Bash commonly loads interactive-shell configuration from:

```text
~/.bashrc
```

If you modify `.bashrc`, you can reload it without opening a new terminal:

```bash
source ~/.bashrc
```

or:

```bash
. ~/.bashrc
```

### Mental model

```text
~/.bashrc
    |
    | source
    ↓
Current Bash shell
    |
    ↓
Configuration applied
```

For example, if `.bashrc` contains:

```bash
PS1="\u@\h:\w\$ "
```

run:

```bash
source ~/.bashrc
```

and the new prompt appears immediately.

---

# 10. `PS2` — Secondary Prompt

`PS2` is used when Bash expects **more input** to complete a command.

Its default value is commonly:

```text
>
```

You can inspect it:

```bash
echo "$PS2"
```

---

# 11. Unclosed Quotes and `PS2`

Suppose you start a quoted string but don't close the quote:

```bash
echo "Hello
```

Bash knows the command is incomplete and displays the secondary prompt:

```text
>
```

You can then complete it:

```text
echo "Hello
> World"
Hello
World
```

The same concept applies to other incomplete shell constructs.

---

# 12. Multiline Commands and `PS2`

`PS2` is also used when a command continues onto another line.

For example:

```bash
echo "This is \
a multiline \
command"
```

Bash may use the secondary prompt when it needs additional input.

Another example is an incomplete command structure:

```bash
if true
then
    echo "Hello"
fi
```

If entered interactively in an incomplete form, Bash can use `PS2` while waiting for the remaining syntax.

### Mental model

```text
PS1
 ↓
"Give me a new command"

PS2
 ↓
"I am waiting for the rest of the current command"
```

---

# 13. Customizing `PS2`

You can change the continuation prompt:

```bash
PS2="continue> "
```

Now, when Bash expects additional input:

```text
continue>
```

For example:

```bash
PS2="more> "
echo "Hello
more> World"
more> "
Hello
World
```

---

# 14. `PS3` — `select` Loop Prompt

`PS3` is used by the Bash `select` construct.

Consider:

```bash
PS3="Choose an option: "

select option in "Linux" "Python" "Git" "Exit"
do
    echo "You selected: $option"
    break
done
```

The user sees something similar to:

```text
1) Linux
2) Python
3) Git
4) Exit
Choose an option:
```

The text:

```text
Choose an option:
```

comes from:

```bash
PS3
```

---

# 15. Understanding `select`

The basic structure is:

```bash
select variable in item1 item2 item3
do
    commands
done
```

Example:

```bash
PS3="Select a language: "

select language in Bash Python Java Exit
do
    echo "Selected: $language"
    break
done
```

Possible output:

```text
1) Bash
2) Python
3) Java
4) Exit
Select a language: 2
Selected: Python
```

### Mental model

```text
PS3
 ↓
Prompt displayed by select
 ↓
User chooses a numbered option
 ↓
Selected value stored in variable
```

---

# 16. `PS4` — Debugging Prompt

`PS4` controls the prefix displayed when Bash traces commands using:

```bash
set -x
```

The default `PS4` is commonly:

```text
+
```

Example:

```bash
set -x

x=10
echo "$x"

set +x
```

The shell prints traced commands with a prefix:

```text
+ x=10
+ echo 10
10
```

The `+` comes from `PS4`.

---

# 17. Customizing `PS4`

You can make debugging output more descriptive:

```bash
PS4="DEBUG: "
```

Then:

```bash
set -x

x=10
echo "$x"

set +x
```

Output:

```text
DEBUG: x=10
DEBUG: echo 10
10
```

This can make shell-script debugging easier.

---

# 18. `set -x` and `PS4`

`set -x` enables **execution tracing**.

```bash
set -x
```

Commands are printed before they are executed.

Disable tracing with:

```bash
set +x
```

### Example

```bash
#!/bin/bash

PS4="TRACE: "

set -x

name="Shubham"
echo "Hello $name"

set +x
```

Possible output:

```text
TRACE: name=Shubham
TRACE: echo 'Hello Shubham'
Hello Shubham
```

---

# 19. Python Interactive Prompts

Python's interactive interpreter also uses prompts.

They are available through the `sys` module:

```python
sys.ps1
sys.ps2
```

Start Python:

```bash
python3
```

The normal Python interactive prompt is:

```text
>>>
```

This corresponds to:

```python
sys.ps1
```

---

# 20. Python `sys.ps1`

Inside Python:

```python
import sys

sys.ps1
```

Output:

```text
'>>> '
```

You can customize it:

```python
sys.ps1 = 'Python> '
```

Now the interactive prompt becomes:

```text
Python>
```

Example:

```text
$ python3
Python 3.x.x ...

Python> print("Hello")
Hello
Python>
```

---

# 21. Python `sys.ps2`

Python uses `sys.ps2` as the **continuation prompt** when a statement requires additional input.

Inspect it:

```python
import sys

sys.ps2
```

Typically:

```text
'... '
```

For example:

```python
if True:
    print("Hello")
```

In interactive mode, Python can display:

```text
>>> if True:
...     print("Hello")
...
Hello
```

Here:

```text
>>> 
```

is `sys.ps1`, while:

```text
...
```

is `sys.ps2`.

---

# 22. Customize Python's `sys.ps2`

You can change the Python continuation prompt:

```python
import sys

sys.ps2 = 'continue> '
```

Then multiline input can display:

```text
Python> if True:
continue>     print("Hello")
continue>
Hello
```

---

# 23. Bash vs Python Prompts

Both Bash and Python use the concept of a **primary prompt** and **continuation prompt**.

| Concept | Bash | Python |
|---|---|---|
| Primary prompt | `PS1` | `sys.ps1` |
| Continuation prompt | `PS2` | `sys.ps2` |
| Menu prompt | `PS3` | — |
| Debugging prompt | `PS4` | — |
| Primary default | `$` or similar | `>>>` |
| Continuation default | `>` | `...` |

---

# 24. Bash Prompt Variables — Quick Reference

```bash
# Primary prompt
echo "$PS1"

# Secondary prompt
echo "$PS2"

# Select prompt
echo "$PS3"

# Debugging prompt
echo "$PS4"
```

### Example custom prompt

```bash
PS1="\u@\h [\t] \w\$ "
```

Possible result:

```text
shubham@ubuntu [14:35:20] ~/Linux_exam$
```

---

# 25. Python Prompt Variables — Quick Reference

Start Python:

```bash
python3
```

Then:

```python
import sys

print(sys.ps1)
print(sys.ps2)
```

Customize:

```python
sys.ps1 = 'Python> '
sys.ps2 = 'more> '
```

---

# 26. Complete Mental Model

```text
                    SHELL / INTERPRETER PROMPTS
                              |
              +---------------+---------------+
              |                               |
            Bash                           Python
              |                               |
       +------+------+                    +----+----+
       |      |      |                    |         |
      PS1    PS2    PS3                  ps1       ps2
       |      |      |                    |         |
     Normal  More   select              Normal     More
       |
      PS4
       |
    set -x
    debugging
```

---

# 27. Practical Examples

## Example 1 — Show time in Bash prompt

```bash
PS1="[\t] $ "
```

---

## Example 2 — Show date and time

```bash
PS1="[\d \t] $ "
```

---

## Example 3 — Show username and directory

```bash
PS1="\u@\h:\w\$ "
```

---

## Example 4 — Show command number

```bash
PS1="[\#] $ "
```

---

## Example 5 — Custom continuation prompt

```bash
PS2="Continue> "
```

---

## Example 6 — Custom `select` prompt

```bash
PS3="Enter your choice: "

select choice in Linux Python Git
do
    echo "You selected $choice"
    break
done
```

---

## Example 7 — Custom debugging prompt

```bash
PS4="DEBUG: "

set -x
echo "Hello"
set +x
```

---

# 28. Important Commands

```bash
# Display current primary prompt
echo "$PS1"

# Display secondary prompt
echo "$PS2"

# Display select prompt
echo "$PS3"

# Display debugging prompt
echo "$PS4"

# Reload Bash configuration
source ~/.bashrc

# Enable tracing
set -x

# Disable tracing
set +x

# Start Python
python3
```

---

# 29. Key Points to Remember

```text
PS1
→ Normal Bash prompt

PS2
→ Bash is waiting for more input

PS3
→ Prompt used by select

PS4
→ Prefix used by set -x tracing
```

```text
\t
→ Time

\d
→ Date

\#
→ Current command number

\u
→ Username

\h
→ Hostname

\w
→ Current working directory

\$
→ $ for normal user, # for root
```

Python:

```text
sys.ps1
→ Primary Python prompt (>>>)

sys.ps2
→ Continuation Python prompt (...)
```

The most important mental model is:

```text
PS1  → Start a command
PS2  → Continue a command
PS3  → Choose from select menu
PS4  → Show commands during debugging
```