---
layout: default
title: "L2.1 - Command line editors - Part 01"
---

# L2.1 - Command line editors - Part 01

# `ed` — The Unix Line Editor

## 1. Different Text Editors

Linux provides many text editors. They can be broadly divided into:

```text
Terminal editors
├── ed
├── vi / vim
├── nano
└── emacs

Graphical editors
├── gedit
├── Kate
└── VS Code
```

The `ed` editor is historically important because it is one of the earliest Unix text editors.

Unlike modern editors such as `nano` or `vim`, `ed` is **line-oriented**.

Instead of displaying the entire document as a screen-based interface, you work with individual lines using commands.

---

# 2. What Is `ed`?

`ed` is a **line-oriented text editor**.

Run:

```bash
ed
```

You will enter the `ed` environment.

Unlike `nano`, you will not see a normal full-screen editor.

The basic mental model is:

```text
File
 ↓
Buffer
 ↓
Lines
 ↓
ed commands operate on lines
```

For example:

```text
1: Hello
2: Linux
3: Shell
4: Commands
```

You can select specific lines and perform operations on them.

---

# 3. `ed` Documentation

You can read the manual page:

```bash
man ed
```

You can also use GNU Info:

```bash
info ed
```

### `man` vs `info`

```text
man ed
   ↓
manual-page documentation

info ed
   ↓
GNU Info documentation
```

Both are useful for understanding the complete command syntax.

---

# 4. Creating a File with `ed`

You can start `ed` with a filename:

```bash
ed notes.txt
```

If the file does not exist, `ed` can create it when you write the buffer.

A typical workflow is:

```bash
ed notes.txt
```

Then use `a` to append text:

```text
a
Hello
Linux
Shell
.
```

Then write:

```text
w
```

Then quit:

```text
q
```

The resulting file contains:

```text
Hello
Linux
Shell
```

---

# 5. The `q` Command — Quit

To quit `ed`:

```text
q
```

Example:

```text
q
```

### Important

If you have modified the buffer but have not saved it, `ed` may refuse to quit normally and warn you about unsaved changes.

The general workflow is:

```text
edit
 ↓
w
 ↓
save
 ↓
q
 ↓
quit
```

---

# 6. `P` — Enable the Prompt

By default, `ed` may not display a prompt.

You can enable its prompt using:

```text
P
```

You may then see:

```text
?
```

or another configured prompt depending on the implementation/options.

On many GNU `ed` installations, the prompt is:

```text
*
```

The important idea is:

```text
P
↓
toggle prompt display
```

This makes interactive work easier because you can see when `ed` is waiting for your next command.

---

# 7. Line Addresses in `ed`

One of the most important concepts in `ed` is the **line address**.

Commands can operate on:

```text
a specific line
a range of lines
the current line
the last line
the entire buffer
```

Common addresses include:

```text
1       → first line
$       → last line
.       → current line
n       → line n
+n      → relative forward movement
-n      → relative backward movement
```

---

# 8. `1` — Go to Line 1

Entering:

```text
1
```

makes line 1 the current line.

Example buffer:

```text
1  Hello
2  Linux
3  Shell
4  Commands
```

Run:

```text
1
```

The current line becomes:

```text
Hello
```

In `ed`, entering a line address by itself selects that line.

---

# 9. `$` — Go to the Last Line

The special address:

```text
$
```

means:

> the last line of the buffer.

Example:

```text
1  Hello
2  Linux
3  Shell
4  Commands
```

Run:

```text
$
```

The current line becomes:

```text
Commands
```

### Important Address Symbols

```text
1 → first line
$ → last line
. → current line
```

---

# 10. `,p` — Print the Entire Buffer

The comma:

```text
,
```

represents:

```text
1,$
```

which means:

```text
first line through last line
```

Therefore:

```text
,p
```

prints the entire buffer.

Example:

```text
,p
```

Output:

```text
Hello
Linux
Shell
Commands
```

### Equivalent

```text
1,$p
```

and:

```text
,p
```

both print the complete buffer.

---

# 11. `2,3p` — Print Lines 2 and 3

The syntax:

```text
2,3p
```

means:

```text
line 2 through line 3
```

where:

```text
p = print
```

Example:

```text
1  Hello
2  Linux
3  Shell
4  Commands
```

Run:

```text
2,3p
```

Output:

```text
Linux
Shell
```

### General Syntax

```text
start,endcommand
```

For example:

```text
2,5p
```

prints lines 2 through 5.

---

# 12. `/hello/` — Search for Text

The search address:

```text
/hello/
```

searches forward for the next line containing:

```text
hello
```

Example:

```text
1  Linux
2  Hello World
3  Shell
4  hello again
```

Run:

```text
/hello/
```

`ed` searches for the next matching line and makes it the current line.

### Case Sensitivity

Searches are normally case-sensitive.

Therefore:

```text
/hello/
```

does not necessarily match:

```text
Hello
```

because:

```text
hello ≠ Hello
```

---

# 13. Searching and Printing

You can combine searching with commands.

For example:

```text
/hello/p
```

means:

> Find the next line containing `hello` and print it.

This is an important `ed` pattern:

```text
/address/command
```

---

# 14. `+` and `-` — Relative Line Movement

The `+` address moves forward relative to the current line.

For example:

```text
+
```

means approximately:

> move to the next line.

Similarly:

```text
-
```

means:

> move to the previous line.

Example:

```text
1  Apple
2  Banana
3  Cherry
```

If line 2 is current:

```text
+
```

moves to line 3.

Then:

```text
-
```

moves back to line 2.

### Numeric Relative Movement

You can also use:

```text
+2
```

to move two lines forward.

And:

```text
-2
```

to move two lines backward.

---

# 15. `;p` — Print from Current Line to End

The semicolon:

```text
;
```

is a special address separator.

It represents:

```text
current line through last line
```

Therefore:

```text
;p
```

prints from the current line to the end of the buffer.

Suppose:

```text
1  A
2  B
3  C
4  D
5  E
```

and the current line is line 3.

Then:

```text
;p
```

prints:

```text
C
D
E
```

### Compare

```text
,p
```

→ entire buffer

```text
;p
```

→ current line through last line

---

# 16. `%p` — Print the Entire Buffer

The address:

```text
%
```

is another convenient way of referring to the entire buffer.

Therefore:

```text
%p
```

prints all lines.

Example:

```text
%p
```

Output:

```text
Hello
Linux
Shell
Commands
```

### Equivalent Concepts

These are commonly used to print the whole buffer:

```text
,p
%p
1,$p
```

---

# 17. `.` — Current Line

The dot:

```text
.
```

represents the **current line**.

For example:

```text
1  Hello
2  Linux
3  Shell
```

If line 2 is current:

```text
.
```

refers to:

```text
Linux
```

You can print it with:

```text
.p
```

This prints only the current line.

---

# 18. `!` — Execute a Shell Command

The `!` command allows you to execute a shell command from inside `ed`.

Example:

```text
!date
```

This runs:

```bash
date
```

using the shell.

You can run other commands too:

```text
!pwd
```

or:

```text
!ls
```

### Mental Model

```text
ed
 │
 └── ! command
          ↓
       shell
          ↓
       command
```

After the command finishes, you return to `ed`.

---

# 19. `r !date` — Insert Command Output

The `r` command normally reads a file into the buffer.

When used with:

```text
r !command
```

it can read the output of a shell command into the buffer.

Example:

```text
r !date
```

This executes:

```bash
date
```

and inserts its output into the `ed` buffer.

Suppose:

```text
Hello
Linux
```

Then:

```text
r !date
```

might produce:

```text
Hello
Linux
Tue Sep 8 14:00:00 IST 2026
```

The exact date/time depends on the system.

### Important

The command:

```text
!date
```

only **executes** `date`.

The command:

```text
r !date
```

**reads the output of `date` into the buffer**.

---

# 20. `w` — Write the Buffer to a File

The `w` command writes the current buffer to the associated file.

```text
w
```

Example:

```text
w
```

After successful writing, the contents of the buffer are saved.

### Write to another filename

You can also specify a filename:

```text
w newfile.txt
```

This writes the buffer to:

```text
newfile.txt
```

---

# 21. `q` — Quit After Saving

A common workflow is:

```text
w
q
```

Meaning:

```text
w → save
q → quit
```

This is one of the most important `ed` sequences to remember.

---

# 22. `.d` — Delete the Current Line

The `d` command deletes lines.

Therefore:

```text
.d
```

means:

> Delete the current line.

Suppose:

```text
1  Hello
2  Linux
3  Shell
```

If line 2 is current:

```text
.d
```

produces:

```text
1  Hello
2  Shell
```

The old line 3 becomes the new line 2.

---

# 23. Delete a Range of Lines

The same concept works with ranges.

For example:

```text
2,4d
```

means:

> Delete lines 2 through 4.

General form:

```text
start,endd
```

Examples:

```text
1d
```

→ delete line 1.

```text
$ d
```

→ delete the last line.

```text
1,$d
```

→ delete the entire buffer.

---

# 24. `a` — Append Text

The `a` command means **append**.

It starts inserting text **after the current line**.

Example:

```text
a
Hello
Linux
.
```

The final:

```text
.
```

is **not inserted as text**.

It tells `ed`:

> Stop appending.

### Example

Suppose the buffer contains:

```text
Line 1
Line 2
```

and line 1 is current.

Run:

```text
a
New line
Another line
.
```

Result:

```text
Line 1
New line
Another line
Line 2
```

---

# 25. The `.` Terminator After `a`

When using:

```text
a
```

`ed` enters input mode.

You finish the input by entering:

```text
.
```

on a line by itself.

Example:

```text
a
Hello
World
.
```

means:

```text
append:
Hello
World

stop appending
```

### Important

This is different from:

```text
.p
```

where `.` is an address.

In:

```text
a
Hello
.
```

the `.` terminates text input.

---

# 26. `s/a/b/` — Substitute Text

The `s` command performs substitution.

Basic syntax:

```text
s/old/new/
```

Example:

```text
s/a/b/
```

means:

> Replace the first matching `a` with `b` on the current line.

Suppose the current line is:

```text
cat
```

Run:

```text
s/a/b/
```

Result:

```text
cbt
```

---

# 27. Substitution on the Current Line

By default:

```text
s/old/new/
```

operates on the current line.

Example:

```text
Hello Linux Linux
```

Run:

```text
s/Linux/Unix/
```

Result:

```text
Hello Unix Linux
```

Only the first matching occurrence is replaced.

---

# 28. Replacing All Occurrences on a Line

Use the `g` flag:

```text
s/Linux/Unix/g
```

For:

```text
Linux Linux Linux
```

the result is:

```text
Unix Unix Unix
```

So:

```text
s/old/new/
```

→ first occurrence

```text
s/old/new/g
```

→ all occurrences on the addressed line

---

# 29. `f` — Show the Current Filename

The `f` command displays the current filename associated with the buffer.

```text
f
```

Example:

```text
f
```

might output:

```text
notes.txt
```

This is useful when you are unsure which file the current buffer belongs to.

---

# 30. `5,6j` — Join Lines

The `j` command means **join**.

Example:

```text
5,6j
```

means:

> Join lines 5 and 6.

Suppose:

```text
5  Hello
6  World
```

After:

```text
5,6j
```

they become one line:

```text
Hello World
```

The exact spacing behavior follows `ed`'s join operation.

### General Form

```text
start,endj
```

Example:

```text
2,5j
```

joins lines 2 through 5 into one line.

---

# 31. `m1` — Move the Current Line

The `m` command moves addressed lines.

Example:

```text
m1
```

means:

> Move the current line to after line 1.

Suppose:

```text
1  Apple
2  Banana
3  Cherry
```

Current line:

```text
3  Cherry
```

Run:

```text
m1
```

Result:

```text
1  Apple
2  Cherry
3  Banana
```

The current line was moved to after line 1.

---

# 32. Moving a Range

You can move multiple lines.

General syntax:

```text
start,endmdestination
```

For example:

```text
2,4m1
```

moves lines 2 through 4 to after line 1.

The exact resulting line numbering changes because the lines have been physically reordered.

---

# 33. `u` — Undo

The `u` command undoes the most recent change.

```text
u
```

For example:

```text
s/old/new/
```

changes a line.

Then:

```text
u
```

can undo that change.

### Important

`u` is useful when you make a mistake during editing.

However, do not assume it behaves exactly like the multi-level undo history of modern editors. Traditional `ed` has a much simpler undo model.

---

# 34. Global Substitution

A very important `ed` feature is performing substitutions across the entire buffer.

The basic form is:

```text
%s/old/new/g
```

The `%` address means:

```text
entire buffer
```

The `s` means:

```text
substitute
```

Therefore:

```text
%s/old/new/g
```

means:

> In every line, replace every occurrence of `old` with `new`.

---

# 35. Adding a Prefix to Every Line

Suppose the buffer contains:

```text
apple
banana
cherry
```

We want:

```text
PREFIX apple
PREFIX banana
PREFIX cherry
```

A simple command is:

```text
%s/^/PREFIX /
```

Explanation:

```text
%
 ↓
all lines

s
 ↓
substitute

^
 ↓
beginning of each line

PREFIX 
 ↓
insert this text
```

Result:

```text
PREFIX apple
PREFIX banana
PREFIX cherry
```

This is usually the cleanest way to add a prefix to every line.

---

# 36. Using Capture Groups in `ed`

`ed` uses **Basic Regular Expressions (BRE)**.

In BRE, a capture group is normally written using:

```text
\(...\)
```

and referenced using:

```text
\1
```

For example:

```text
s/^\(.*\)$/PREFIX \1/
```

means:

```text
^
 ↓
start of line

\(.*\)
 ↓
capture the entire line

$
 ↓
end of line

PREFIX \1
 ↓
put PREFIX before the captured line
```

For a line:

```text
hello
```

the result becomes:

```text
PREFIX hello
```

---

# 37. Important Correction: `.*` Alone Does Not Create `\1`

A common mistake is writing:

```text
%s/.* /PREFIX \1/
```

and expecting `\1` to contain the matched text.

That is incorrect.

A backreference such as:

```text
\1
```

requires a capturing group.

In `ed` BRE syntax, use:

```text
\(.*\)
```

not simply:

```text
.*
```

Therefore, a capture-group version for adding a prefix is:

```text
%s/^\(.*\)$/PREFIX \1/
```

However, because the goal is only to add text at the beginning, the simpler and more direct command is:

```text
%s/^/PREFIX /
```

---

# 38. Understanding `%s/^\(.*\)$/PREFIX \1/`

Break the command into pieces:

```text
%s/^\(.*\)$/PREFIX \1/
```

### `%`

Address the entire buffer:

```text
%
```

### `s`

Substitute:

```text
s
```

### `/`

Delimiter:

```text
/
```

### `^`

Beginning of line:

```text
^
```

### `\(.*\)`

Capture the complete line:

```text
\(.*\)
```

### `$`

End of line:

```text
$
```

### `PREFIX \1`

Replacement text:

```text
PREFIX 
```

followed by:

```text
\1
```

which means:

> Insert the text captured by the first group.

---

# 39. Example of Capture Groups

Suppose:

```text
John 25
Alice 30
Bob 22
```

We want:

```text
Name: John 25
Name: Alice 30
Name: Bob 22
```

Use:

```text
%s/^\(.*\)$/Name: \1/
```

Result:

```text
Name: John 25
Name: Alice 30
Name: Bob 22
```

Again, the simpler solution is:

```text
%s/^/Name: /
```

The capture-group version is useful mainly for learning how `ed` regular expressions and backreferences work.

---

# 40. Important `ed` Address Reference

Memorize these:

| Address | Meaning |
|---|---|
| `.` | Current line |
| `$` | Last line |
| `1` | First line |
| `n` | Line number `n` |
| `+` | Next line |
| `-` | Previous line |
| `,` | Entire buffer (`1,$`) |
| `;` | Current line through last line |
| `%` | Entire buffer |
| `/regex/` | Search forward |
| `?regex?` | Search backward |

---

# 41. Important `ed` Command Reference

| Command | Meaning |
|---|---|
| `p` | Print |
| `d` | Delete |
| `a` | Append after current line |
| `i` | Insert before current line |
| `c` | Change/replace addressed lines |
| `s` | Substitute |
| `j` | Join |
| `m` | Move |
| `u` | Undo |
| `r` | Read file/command output into buffer |
| `w` | Write buffer to file |
| `q` | Quit |
| `f` | Show/set filename |
| `!` | Execute shell command |
| `P` | Toggle prompt |

---

# 42. Important `ed` Examples

## Print current line

```text
.p
```

## Print entire buffer

```text
,p
```

or:

```text
%p
```

## Print lines 2–5

```text
2,5p
```

## Delete current line

```text
.d
```

## Delete lines 2–4

```text
2,4d
```

## Append after current line

```text
a
New line
.
```

## Substitute on current line

```text
s/old/new/
```

## Substitute all occurrences on current line

```text
s/old/new/g
```

## Substitute throughout the file

```text
%s/old/new/g
```

## Join lines

```text
5,6j
```

## Move current line after line 1

```text
m1
```

## Undo

```text
u
```

## Execute shell command

```text
!date
```

## Insert shell command output

```text
r !date
```

## Save

```text
w
```

## Quit

```text
q
```

---

# 43. Complete `ed` Practice Session

Create a file:

```bash
ed practice.txt
```

Append some lines:

```text
a
Linux
Shell
AWK
Sed
Grep
.
```

Print everything:

```text
,p
```

Output:

```text
Linux
Shell
AWK
Sed
Grep
```

Go to line 1:

```text
1
```

Move to next line:

```text
+
```

Print current line:

```text
.p
```

Move to last line:

```text
$
```

Print it:

```text
.p
```

---

# 44. Search Practice

Search for `AWK`:

```text
/AWK/
```

Print the matching line:

```text
/AWK/p
```

Search for `Shell`:

```text
/Shell/p
```

This makes the matching line current and prints it.

---

# 45. Delete Practice

Delete the current line:

```text
.d
```

Print the entire buffer:

```text
%p
```

Delete lines 2 and 3:

```text
2,3d
```

Print again:

```text
%p
```

---

# 46. Append Practice

Move to line 1:

```text
1
```

Append:

```text
a
New Line
Another Line
.
```

Print:

```text
%p
```

You should see the new lines after line 1.

---

# 47. Substitution Practice

Suppose the buffer contains:

```text
Linux is powerful
Linux is portable
Linux is free
```

Go to the first line:

```text
1
```

Replace:

```text
s/Linux/Unix/
```

Now the first line becomes:

```text
Unix is powerful
```

To replace Linux with Unix throughout the buffer:

```text
%s/Linux/Unix/g
```

Result:

```text
Unix is powerful
Unix is portable
Unix is free
```

---

# 48. Prefix Practice

Suppose the buffer contains:

```text
Linux
Shell
AWK
Sed
```

Add `Topic: ` to every line:

```text
%s/^/Topic: /
```

Result:

```text
Topic: Linux
Topic: Shell
Topic: AWK
Topic: Sed
```

---

# 49. Shell Command Practice

Inside `ed`, run:

```text
!pwd
```

Then:

```text
!ls
```

Then:

```text
!date
```

These execute shell commands without leaving the editor.

Now insert the current date into the buffer:

```text
r !date
```

Print the buffer:

```text
%p
```

---

# 50. Save and Exit

Once finished:

```text
w
```

Then:

```text
q
```

The standard sequence is:

```text
w
q
```

meaning:

```text
write
 ↓
quit
```

---

# 51. `ed` Workflow Mental Model

Think of `ed` as manipulating a buffer:

```text
                   ed buffer
                       │
              ┌────────┼────────┐
              │        │        │
           Address   Command   Text
              │        │        │
           1, $, .    p,d,s    a/i
              │        │        │
              └────────┼────────┘
                       │
                    Result
                       │
                       ↓
                       w
                       │
                    File
```

Most `ed` commands can be understood as:

```text
[address]command
```

For example:

```text
2,5p
```

means:

```text
address → lines 2 through 5
command → print
```

And:

```text
%s/Linux/Unix/g
```

means:

```text
address → entire buffer
command → substitute
pattern → Linux
replacement → Unix
flag → all occurrences
```

---

# 52. High-Value Exam Questions

## Q1. What type of editor is `ed`?

**Answer:** A line-oriented text editor.

---

## Q2. How do you open the manual for `ed`?

```bash
man ed
```

---

## Q3. How do you open GNU Info documentation?

```bash
info ed
```

---

## Q4. What does `q` do?

```text
q
```

Quits `ed`.

---

## Q5. What does `P` do?

**Answer:** Toggles the display of the `ed` prompt.

---

## Q6. What does address `1` mean?

**Answer:** First line.

---

## Q7. What does `$` mean?

**Answer:** Last line.

---

## Q8. What does `.` mean?

**Answer:** Current line.

---

## Q9. What does `,` represent?

**Answer:** The entire buffer, equivalent to `1,$`.

---

## Q10. What does `%` represent?

**Answer:** The entire buffer.

---

## Q11. What does this command do?

```text
2,3p
```

**Answer:** Prints lines 2 and 3.

---

## Q12. What does this do?

```text
/hello/
```

**Answer:** Searches forward for the next line containing `hello` and makes that line current.

---

## Q13. What does `+` do?

**Answer:** Moves to the next line relative to the current line.

---

## Q14. What does `-` do?

**Answer:** Moves to the previous line.

---

## Q15. What does this do?

```text
;p
```

**Answer:** Prints from the current line through the end of the buffer.

---

## Q16. What does this do?

```text
!date
```

**Answer:** Executes `date` through the shell.

---

## Q17. What does this do?

```text
r !date
```

**Answer:** Executes `date` and reads its output into the current `ed` buffer.

---

## Q18. What does `w` do?

**Answer:** Writes the buffer to the associated file.

---

## Q19. What does `.d` do?

**Answer:** Deletes the current line.

---

## Q20. How do you append text after the current line?

```text
a
text
.
```

---

## Q21. What does this do?

```text
s/a/b/
```

**Answer:** Replaces the first matching `a` with `b` on the current line.

---

## Q22. What does `f` do?

**Answer:** Displays the current filename.

---

## Q23. What does this do?

```text
5,6j
```

**Answer:** Joins lines 5 and 6.

---

## Q24. What does `m1` do?

**Answer:** Moves the current line to after line 1.

---

## Q25. What does `u` do?

**Answer:** Undoes the most recent change.

---

## Q26. How do you substitute text throughout the entire buffer?

```text
%s/old/new/g
```

---

# 53. Important Exam Traps

### Trap 1

```text
ls
```

and:

```text
ed
```

are completely different commands.

`ed` is an editor.

---

### Trap 2

In:

```text
2,3p
```

the comma separates the starting and ending addresses.

```text
2 → starting line
3 → ending line
p → print
```

---

### Trap 3

```text
%
```

means the entire buffer.

So:

```text
%p
```

prints everything.

---

### Trap 4

```text
.
```

has multiple meanings depending on context.

As an address:

```text
.p
```

means:

> print current line

After `a`:

```text
a
Hello
.
```

the dot means:

> stop entering text

---

### Trap 5

```text
!date
```

does not insert the date into the buffer.

It only executes the command.

To insert the output:

```text
r !date
```

---

### Trap 6

```text
s/a/b/
```

normally replaces only the first match on the addressed line.

To replace all matches on that line:

```text
s/a/b/g
```

To replace all matches across the entire buffer:

```text
%s/a/b/g
```

---

### Trap 7

`ed` uses **BRE-style regular expressions**.

A capturing group is:

```text
\( ... \)
```

and the first backreference is:

```text
\1
```

Therefore:

```text
%s/^\(.*\)$/PREFIX \1/
```

uses a real capture group.

Simply writing:

```text
.*
```

does not create `\1`.

---

# 54. Final Cheat Sheet

```text
EDITOR
ed
→ line-oriented text editor

DOCUMENTATION
man ed
info ed

QUIT
q

PROMPT
P

ADDRESSES
.       current line
1       first line
$       last line
,       entire buffer
%       entire buffer
+       next line
-       previous line
/regex/ search forward
?regex? search backward

PRINT
.p
2,3p
,p
%p
;p

SHELL
!date
!pwd
!ls

READ COMMAND OUTPUT
r !date

WRITE
w

DELETE
.d
2,4d

APPEND
a
text
.

SUBSTITUTE
s/old/new/
s/old/new/g
%s/old/new/g

FILENAME
f

JOIN
5,6j

MOVE
m1

UNDO
u
```

# 55. The Core `ed` Mental Model

The entire lesson can be reduced to this pattern:

```text
                    ed
                     │
             ┌───────┴───────┐
             │               │
          ADDRESS          COMMAND
             │               │
       ┌─────┼─────┐     ┌───┼────────┐
       │     │     │     │   │        │
       .     $     %     p   d        s
     current last  all  print delete substitute
       │
       └──────────────────────────────┐
                                      │
                                  Buffer
                                      │
                         ┌────────────┼───────────┐
                         │            │           │
                         a            r           !
                       append       read        shell
                         │            │           │
                         └────────────┼───────────┘
                                      │
                                      ↓
                                      w
                                      │
                                   File
                                      │
                                      ↓
                                      q
```

The most important commands for an exam are:

```text
1       → first line
$       → last line
.       → current line
,       → entire buffer
%       → entire buffer
+       → next line
-       → previous line

p       → print
d       → delete
a       → append
s       → substitute
j       → join
m       → move
u       → undo
r       → read
w       → write
q       → quit
f       → filename
!       → shell command
```

The most important substitution patterns are:

```text
s/old/new/
```

→ replace first match on current line

```text
s/old/new/g
```

→ replace all matches on current line

```text
%s/old/new/g
```

→ replace all matches throughout the entire buffer

```text
%s/^/PREFIX /
```

→ add `PREFIX ` to every line

```text
%s/^\(.*\)$/PREFIX \1/
```

→ capture each complete line and put `PREFIX ` before the captured text

Finally, remember the fundamental `ed` workflow:

```text
OPEN
 ↓
ed file.txt

SELECT
 ↓
1
.
$
/pattern/

MODIFY
 ↓
a
d
s
j
m
u

INSPECT
 ↓
p

SHELL
 ↓
!

SAVE
 ↓
w

EXIT
 ↓
q
```
