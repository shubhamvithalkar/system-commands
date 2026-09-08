---
layout: default
title: "L2.2 - Command line editors - Part 02"
---

# L2.2 - Command line editors - Part 02

# Linux Text Editors, `readlink`, Nano, and Vi/Vim

## 1. `readlink -f` — Find the Final Target of a Symbolic Link

### What is `readlink`?

`readlink` is used to read the target of a symbolic (soft) link.

Basic syntax:

```bash
readlink link_name
```

Example:

```bash
ln -s /home/user/project project_link

readlink project_link
```

Output:

```text
/home/user/project
```

---

### `readlink -f`

The `-f` option means **follow the entire chain of symbolic links and print the final resolved path**.

```bash
readlink -f dir
```

Suppose:

```text
link1 → link2 → link3 → /home/user/project
```

Then:

```bash
readlink -f link1
```

produces:

```text
/home/user/project
```

So `readlink -f` is useful when there are **multiple levels of soft links**.

### Mental Model

Think of symbolic links as arrows:

```text
link1
  ↓
link2
  ↓
link3
  ↓
real_directory
```

`readlink` can tell you where an arrow points.

`readlink -f` follows all the arrows until it reaches the **final destination**.

### Useful command

```bash
readlink -f .
```

This can also be used to obtain the absolute, canonical path of the current directory.

---

# 2. Nano Editor

## What is Nano?

`nano` is a simple, beginner-friendly terminal text editor.

It is useful for:

- Creating files
- Editing configuration files
- Writing shell scripts
- Quickly modifying text files
- Editing files directly from the terminal

Start Nano with:

```bash
nano filename
```

For example:

```bash
nano demo.txt
```

If `demo.txt` does not exist, Nano creates it when you save it.

---

## Nano Interface

At the bottom of Nano you commonly see commands such as:

```text
^G Help
^O Write Out
^W Where Is
^K Cut
^U Paste
^X Exit
```

The `^` symbol means **Ctrl**.

Therefore:

```text
^O
```

means:

```text
Ctrl + O
```

and:

```text
^X
```

means:

```text
Ctrl + X
```

---

## Important Nano Commands

| Shortcut | Meaning |
|---|---|
| `Ctrl + O` | Save/write file |
| `Ctrl + X` | Exit |
| `Ctrl + W` | Search |
| `Ctrl + K` | Cut current line |
| `Ctrl + U` | Paste previously cut text |
| `Ctrl + G` | Help |
| `Ctrl + C` | Show cursor position |
| `Ctrl + _` | Go to a specific line/column |

---

## Saving a Nano File

Suppose:

```bash
nano demo.txt
```

After editing:

```text
Ctrl + O
```

Nano asks for the filename.

Press:

```text
Enter
```

Then exit:

```text
Ctrl + X
```

---

## Nano Mental Model

Nano is designed to be **modeless**.

You generally type text immediately.

There is no separate:

```text
COMMAND MODE
INSERT MODE
```

like in `vi`.

This is one reason Nano is easier for beginners.

---

# 3. `vi` Editor

## What is `vi`?

`vi` is a powerful terminal-based text editor.

It is one of the traditional Unix/Linux editors and is available on many systems.

Modern systems often provide **Vim (Vi Improved)**, which is compatible with many `vi` commands.

Start it with:

```bash
vi filename
```

For example:

```bash
vi demo.txt
```

---

# 4. The Most Important Concept in `vi`: Modes

Unlike Nano, `vi` is **modal**.

This means the same keyboard key can perform different actions depending on the current mode.

The most important modes are:

```text
COMMAND MODE
     |
     | i / a
     ↓
INSERT MODE
     |
     | Esc
     ↓
COMMAND MODE
```

### Command Mode

Used for:

- Moving around
- Deleting
- Copying
- Pasting
- Searching
- Running editor commands

### Insert Mode

Used for:

- Typing text
- Inserting text
- Editing text normally

### Returning to Command Mode

Press:

```text
Esc
```

This is one of the most important `vi` habits.

If you are unsure what mode you are in:

```text
Press Esc
```

Then you are normally back in Command mode.

---

# 5. Movement in `vi`

When `vi` starts, it normally opens in **Command mode**.

You can move the cursor using:

```text
h    left
j    down
k    up
l    right
```

### Mental Model

Remember:

```text
      k
      ↑
h ←       → l
      ↓
      j
```

So:

- `h` → left
- `j` → down
- `k` → up
- `l` → right

These are extremely important `vi` movement keys.

---

## Arrow Keys

Modern Vim usually supports arrow keys:

```text
↑
↓
←
→
```

However, learning:

```text
h j k l
```

is valuable because these are fundamental `vi`/Vim movement keys.

---

# 6. Moving to Specific Positions

`vi` provides commands for quickly moving the cursor.

### Beginning of Current Line

```text
0
```

Moves to the beginning of the current line.

---

### First Non-Blank Character

```text
^
```

Moves to the first non-whitespace character of the current line.

---

### End of Current Line

```text
$
```

Moves to the end of the current line.

---

### Beginning of File

```text
gg
```

Moves to the first line.

---

### End of File

```text
G
```

Moves to the last line.

---

### Specific Line

You can use:

```text
:n
```

where `n` is the line number.

For example:

```text
:10
```

moves to line 10.

Another common form is:

```text
10G
```

which also moves to line 10.

---

# 7. Insert Mode — `i`

Press:

```text
i
```

in Command mode.

This enters **Insert mode**.

```text
COMMAND MODE
     |
     | i
     ↓
INSERT MODE
```

Now you can type text normally.

Example:

```text
hello world
```

After pressing `i`, you can insert text at the cursor position.

---

# 8. Returning to Command Mode — `Esc`

While in Insert mode:

```text
Esc
```

returns to Command mode.

Example:

```text
i
```

→ Insert mode

Type:

```text
Hello
```

Then:

```text
Esc
```

→ Command mode

### Important Rule

If you want to use commands such as:

```text
dd
dw
x
p
yyyy
```

you should be in **Command mode**.

---

# 9. Insert After Cursor — `a`

The command:

```text
a
```

means **append**.

It enters Insert mode **after the current cursor position**.

Example:

```text
hello
```

Suppose the cursor is on:

```text
h
```

Press:

```text
a
```

Now typing:

```text
X
```

places `X` after the cursor.

Result:

```text
hXello
```

Compare:

```text
i
```

Insert **before** the cursor.

```text
a
```

Insert **after** the cursor.

---

# 10. Delete a Line — `dd`

In Command mode:

```text
dd
```

deletes the current line.

Example:

```text
one
two
three
```

Place the cursor on:

```text
two
```

Press:

```text
dd
```

Result:

```text
one
three
```

---

## `dd` Is Also a Cut Operation

In `vi`, deleting text usually places it into a register.

Therefore, you can delete a line and then paste it somewhere else.

This makes:

```text
dd
```

behave somewhat like:

```text
cut line
```

---

# 11. Paste — `p`

After deleting a line with:

```text
dd
```

you can paste it using:

```text
p
```

### Example

Original:

```text
A
B
C
```

Place cursor on `B`:

```text
dd
```

Now:

```text
A
C
```

Move to `C` and press:

```text
p
```

Result:

```text
A
C
B
```

The deleted line has been pasted after the current line.

---

## `P` vs `p`

Two useful commands are:

```text
p
P
```

Generally:

```text
p
```

pastes **after** the cursor.

```text
P
```

pastes **before** the cursor.

---

# 12. Save and Quit — `:wq`

In Command mode:

```text
:wq
```

means:

```text
w → write/save
q → quit
```

So:

```text
:wq
```

means:

> Save the file and exit `vi`.

Example:

```bash
vi demo.txt
```

Edit the file.

Then:

```text
Esc
:wq
Enter
```

---

## Save Without Quitting

```text
:w
```

means:

```text
write/save
```

---

## Quit Without Saving

```text
:q!
```

means:

```text
quit and discard changes
```

### Important

```text
:q
```

works only when there are no unsaved changes.

If changes exist, `vi` may show an error.

Use:

```text
:q!
```

to discard changes.

---

# 13. Delete a Word — `dw`

In Command mode:

```text
dw
```

means:

```text
delete word
```

It deletes text starting from the cursor through the word movement.

Example:

```text
Linux is powerful
```

Place the cursor at the beginning of:

```text
is
```

Then:

```text
dw
```

removes the word region.

---

## `2dw` — Delete Two Words

Commands in `vi` can often be preceded by a **count**.

For example:

```text
2dw
```

means:

```text
2 × dw
```

Therefore, it deletes two word movements.

Similarly:

```text
3dw
```

performs the operation three times.

### General Pattern

```text
[count][command]
```

Examples:

```text
2dd
3x
5dw
```

---

# 14. Delete a Character — `x`

In Command mode:

```text
x
```

deletes the character under the cursor.

Example:

```text
hello
```

Cursor on:

```text
e
```

Press:

```text
x
```

Result:

```text
hllo
```

---

## Multiple Characters

Because `vi` supports counts:

```text
3x
```

deletes three characters.

So:

```text
x
```

→ delete one character

```text
3x
```

→ delete three characters

---

# 15. Moving Right Character by Character

In Command mode:

```text
l
```

moves the cursor one character to the right.

You can repeatedly press:

```text
l
```

to move right.

The spacebar can also move right in traditional `vi` behavior, but **`l` is the standard movement command and should be preferred**.

Remember:

```text
h → left
j → down
k → up
l → right
```

---

# 16. Show Current File Name — `:f`

In Command mode:

```text
:f
```

displays information about the current file.

For example:

```text
"demo.txt" line 5 of 20 --25%--
```

The exact output depends on the `vi`/Vim implementation.

It can show information such as:

- Current filename
- Current line
- Total number of lines
- Position in the file

---

# 17. Show Line Numbers — `:se nu`

In `vi`, you can enable line numbers with:

```text
:se nu
```

or:

```text
:set number
```

Example:

```text
1  Hello
2  Linux
3  World
4  Unix
```

---

## Hide Line Numbers

Use:

```text
:se nonu
```

or:

```text
:set nonumber
```

So:

```text
:set number
```

→ show line numbers

```text
:set nonumber
```

→ hide line numbers

---

# 18. Copy Lines — `yy`

In Command mode:

```text
yy
```

copies the current line.

Example:

```text
one
two
three
```

Place the cursor on:

```text
two
```

Press:

```text
yy
```

The line is copied.

Then move somewhere else and press:

```text
p
```

Result:

```text
one
two
two
three
```

---

## `yyyy`

The lecture notation:

```text
yyyy
```

is commonly understood as repeated `yy` operations, but the important standard command is:

```text
yy
```

to copy one line.

For multiple lines, use a count:

```text
3yy
```

This copies three lines.

Then:

```text
p
```

pastes them.

---

# 19. Search and Replace

One of the most powerful features of `vi` is substitution.

General syntax:

```text
:[range]s/old/new/[flags]
```

Where:

```text
range
```

specifies which lines are affected.

```text
s
```

means substitute.

```text
old
```

is the text to search for.

```text
new
```

is the replacement.

```text
flags
```

modify the behavior.

---

# 20. Replace First Occurrence on Every Selected Line

Consider:

```text
line one line
line two line
line three line
line four
line five line
line six line
```

Suppose we execute:

```text
:1,5s/line/LINE/
```

Break it down:

```text
:1,5
```

Select lines 1 through 5.

```text
s
```

Substitute.

```text
/line/
```

Search for `line`.

```text
/LINE/
```

Replace it with `LINE`.

Because there is **no `g` flag**, only the **first matching occurrence on each selected line** is replaced.

So:

```text
line one line
```

becomes:

```text
LINE one line
```

not:

```text
LINE one LINE
```

---

# 21. Replace All Occurrences on Every Selected Line

Use:

```text
:1,5s/line/LINE/g
```

The important difference is:

```text
g
```

The `g` flag means replace **all matching occurrences on each selected line**.

For example:

```text
line one line
```

becomes:

```text
LINE one LINE
```

---

## Compare

Without `g`:

```text
:1,5s/line/LINE/
```

Only the first occurrence on each selected line is replaced.

With `g`:

```text
:1,5s/line/LINE/g
```

Every occurrence on each selected line is replaced.

---

# 22. Replace Throughout the Entire File — `%`

The `%` address means:

```text
all lines
```

Therefore:

```text
:%s/hello/hola/g
```

means:

> In the entire buffer, replace every occurrence of `hello` with `hola`.

Example:

```text
hello world
hello Linux
say hello
hello again
```

Run:

```text
:%s/hello/hola/g
```

Result:

```text
hola world
hola Linux
say hola
hola again
```

---

# 23. Understanding `:1,5s/line/LINE/g`

This command is extremely important for exams.

```text
:1,5s/line/LINE/g
```

Break it into pieces:

```text
:
```

Enter an Ex command.

```text
1,5
```

Line range: lines 1 through 5.

```text
s
```

Substitute.

```text
/line/
```

Search pattern.

```text
/LINE/
```

Replacement.

```text
g
```

Replace all matches on each selected line.

### Mental Model

Think:

```text
:[WHERE]s/[SEARCH]/[REPLACE]/[HOW]
```

So:

```text
:1,5s/line/LINE/g
```

becomes:

```text
WHERE   = lines 1–5
SEARCH  = line
REPLACE = LINE
HOW     = all occurrences
```

---

# 24. Important `vi` Commands Cheat Sheet

## Modes

| Command | Meaning |
|---|---|
| `i` | Insert before cursor |
| `a` | Insert after cursor |
| `Esc` | Return to Command mode |

---

## Movement

| Command | Meaning |
|---|---|
| `h` | Left |
| `j` | Down |
| `k` | Up |
| `l` | Right |
| `0` | Beginning of line |
| `^` | First non-blank character |
| `$` | End of line |
| `gg` | First line |
| `G` | Last line |
| `nG` | Go to line `n` |
| `:n` | Go to line `n` |

---

## Editing

| Command | Meaning |
|---|---|
| `x` | Delete character |
| `dw` | Delete word |
| `2dw` | Delete two word operations |
| `dd` | Delete current line |
| `2dd` | Delete two lines |
| `yy` | Copy current line |
| `3yy` | Copy three lines |
| `p` | Paste after |
| `P` | Paste before |
| `u` | Undo |

---

## File Commands

| Command | Meaning |
|---|---|
| `:w` | Save |
| `:q` | Quit |
| `:wq` | Save and quit |
| `:q!` | Quit without saving |
| `:f` | Show file information |

---

## Display

| Command | Meaning |
|---|---|
| `:set number` | Show line numbers |
| `:set nonumber` | Hide line numbers |
| `:se nu` | Short form of `:set number` |
| `:se nonu` | Short form of `:set nonumber` |

---

## Substitution

| Command | Meaning |
|---|---|
| `:1,5s/a/b/` | First `a` → `b` on each line 1–5 |
| `:1,5s/a/b/g` | All `a` → `b` on lines 1–5 |
| `:%s/a/b/g` | All `a` → `b` throughout file |

---

# 25. `vi` vs Nano

| Feature | Nano | vi |
|---|---|---|
| Beginner-friendly | Very high | Lower initially |
| Modal | No | Yes |
| Insert mode | Not separate | Yes |
| Command mode | No | Yes |
| Keyboard-driven editing | Basic | Extremely powerful |
| Search/replace | Available | Very powerful |
| Server usage | Common | Extremely common |
| Complex editing | Limited compared with Vim | Very powerful |
| Learning curve | Easy | Steeper |

### Mental Model

Think of:

```text
Nano
```

as:

> Open the file and start typing.

While:

```text
vi
```

is:

> Enter a mode, use commands to navigate/edit, then return to insert mode when you need to type.

---

# 26. Practical Workflow

Create a practice file:

```bash
cat > practice.txt <<'EOF'
hello world
hello linux
this is line three
this is line four
hello world again
line six
EOF
```

Open it:

```bash
vi practice.txt
```

You start in Command mode.

### Task 1 — Move

Practice:

```text
h
j
k
l
```

Then:

```text
0
$
gg
G
```

---

### Task 2 — Insert

Press:

```text
i
```

Type some text.

Then:

```text
Esc
```

---

### Task 3 — Append

Move to a character and press:

```text
a
```

Type something.

Then:

```text
Esc
```

---

### Task 4 — Delete a Line

Move to a line and:

```text
dd
```

---

### Task 5 — Paste

After deleting:

```text
dd
```

move elsewhere and:

```text
p
```

---

### Task 6 — Copy

Move to a line:

```text
yy
```

Move somewhere else:

```text
p
```

---

### Task 7 — Delete Words

Practice:

```text
dw
```

and:

```text
2dw
```

---

### Task 8 — Delete Characters

Practice:

```text
x
```

and:

```text
3x
```

---

### Task 9 — Line Numbers

Show:

```text
:set number
```

Hide:

```text
:set nonumber
```

---

### Task 10 — Search and Replace

Replace the first occurrence of `hello` on lines 1–5:

```text
:1,5s/hello/HELLO/
```

Replace all occurrences of `hello` on lines 1–5:

```text
:1,5s/hello/HELLO/g
```

Replace all occurrences throughout the file:

```text
:%s/hello/HELLO/g
```

---

# 27. Exam-Oriented Questions

## Question 1

What does this command do?

```text
:1,5s/line/LINE/
```

### Answer

It searches lines 1 through 5 and replaces the **first occurrence** of `line` on each line with `LINE`.

---

## Question 2

What is the difference between:

```text
:1,5s/line/LINE/
```

and:

```text
:1,5s/line/LINE/g
```

### Answer

Without `g`:

```text
:1,5s/line/LINE/
```

replaces only the first occurrence on each selected line.

With `g`:

```text
:1,5s/line/LINE/g
```

replaces every occurrence on each selected line.

---

## Question 3

What does this command do?

```text
:%s/hello/hola/g
```

### Answer

It replaces every occurrence of `hello` with `hola` throughout the entire file.

---

## Question 4

How do you save and exit `vi`?

### Answer

```text
:wq
```

---

## Question 5

How do you exit without saving changes?

### Answer

```text
:q!
```

---

## Question 6

What does:

```text
dd
```

do?

### Answer

Deletes the current line.

---

## Question 7

What does:

```text
yy
```

do?

### Answer

Copies the current line.

---

## Question 8

What does:

```text
p
```

do?

### Answer

Pastes the previously deleted/copied text after the current position.

---

## Question 9

What is the difference between `i` and `a`?

### Answer

```text
i
```

enters Insert mode before the cursor.

```text
a
```

enters Insert mode after the cursor.

---

## Question 10

How do you show line numbers?

### Answer

```text
:set number
```

or:

```text
:se nu
```

---

## Question 11

How do you hide line numbers?

### Answer

```text
:set nonumber
```

or:

```text
:se nonu
```

---

## Question 12

What does:

```text
readlink -f link
```

do?

### Answer

It follows symbolic links and resolves the path to its final canonical destination.

---

# 28. Common Beginner Mistakes

### Mistake 1: Typing commands in Insert mode

Suppose you want:

```text
dd
```

but you are still in Insert mode.

You may accidentally type:

```text
dd
```

into the file.

### Fix

Press:

```text
Esc
```

Then:

```text
dd
```

---

### Mistake 2: Forgetting `Enter`

After:

```text
:wq
```

press:

```text
Enter
```

The `:` commands are entered on the command line.

---

### Mistake 3: Confusing `p` and `P`

Remember:

```text
p → paste after
P → paste before
```

---

### Mistake 4: Assuming `s` replaces every occurrence

This:

```text
:s/old/new/
```

does **not** replace every occurrence on the line.

Use:

```text
:s/old/new/g
```

for all occurrences on that line.

---

### Mistake 5: Confusing `%` with `$`

In substitution:

```text
%
```

means the **entire file/all lines**.

But:

```text
$
```

usually refers to the **end of a line** in an address/pattern context.

For example:

```text
:%s/hello/hola/g
```

means the entire buffer.

---

# 29. Core Mental Model

The most important thing to remember about `vi` is:

```text
                 ┌───────────────┐
                 │ COMMAND MODE  │
                 └───────┬───────┘
                         │
                    i / a│
                         ↓
                 ┌───────────────┐
                 │  INSERT MODE  │
                 └───────┬───────┘
                         │
                        Esc
                         │
                         ↓
                 ┌───────────────┐
                 │ COMMAND MODE  │
                 └───────────────┘
```

### Command Mode

Think:

```text
MOVE
DELETE
COPY
PASTE
SEARCH
SAVE
QUIT
```

### Insert Mode

Think:

```text
TYPE TEXT
```

### Ex/Colon Commands

Commands beginning with `:` are used for things such as:

```text
:w
:q
:wq
:set number
:f
:%s/old/new/g
```

---

# 30. Final Quick Reference

```text
readlink -f link       → resolve final symbolic-link destination

nano file              → open file in Nano

vi file                → open file in vi

i                      → Insert before cursor
a                      → Insert after cursor
Esc                    → Command mode

h                      → left
j                      → down
k                      → up
l                      → right

0                      → beginning of line
^                      → first non-blank character
$                      → end of line
gg                     → first line
G                      → last line
:n                     → go to line n

x                      → delete character
dw                     → delete word
2dw                    → delete two word operations
dd                     → delete line
2dd                    → delete two lines

yy                     → copy line
3yy                    → copy three lines
p                      → paste after
P                      → paste before
u                      → undo

:f                     → show file information

:set number            → show line numbers
:set nonumber          → hide line numbers

:w                     → save
:q                     → quit
:wq                    → save and quit
:q!                    → quit without saving

:1,5s/line/LINE/       → first match on lines 1–5
:1,5s/line/LINE/g      → all matches on lines 1–5
:%s/hello/hola/g       → all matches in entire file
```

## The Three Things to Master First

If you are preparing for a Linux/System Commands exam, memorize these three areas first:

### 1. Modes

```text
i / a → Insert mode
Esc   → Command mode
```

### 2. Editing

```text
dd → delete
yy → copy
p  → paste
x  → character delete
dw → word delete
```

### 3. Substitution

```text
:s/old/new/
```

→ first occurrence on current line

```text
:s/old/new/g
```

→ all occurrences on current line

```text
:1,5s/old/new/g
```

→ all occurrences on lines 1–5

```text
:%s/old/new/g
```

→ all occurrences in the entire file

