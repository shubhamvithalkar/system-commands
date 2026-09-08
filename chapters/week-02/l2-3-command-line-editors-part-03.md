---
layout: default
title: "L2.3 - Command line editors - Part 03"
---

# L2.3 - Command line editors - Part 03
# Linux File Transfer, DOS Line Endings, and Advanced `vi`/`vim`

## 1. `scp` — Securely Copy Files Between Systems

### What is `scp`?

`scp` stands for **Secure Copy**.

It is used to transfer files and directories between systems over an SSH connection.

Mental model:

```text
Computer A
    |
    | SSH / SCP
    ↓
Computer B
```

It is useful when working with:

- Remote Linux servers
- Cloud machines
- Virtual machines
- Lab systems
- Development servers

---

## 2. Copy a Local File to a Remote System

General syntax:

```bash
scp source_file username@remote_host:destination
```

Example:

```bash
scp report.txt user@192.168.1.20:/home/user/
```

This means:

```text
report.txt
     ↓
remote machine
/home/user/
```

The remote system will normally ask for authentication unless SSH keys are configured.

---

## 3. Copy a Remote File to the Local System

Reverse the source and destination:

```bash
scp username@remote_host:/path/to/file destination
```

Example:

```bash
scp user@192.168.1.20:/home/user/report.txt .
```

Here:

```text
. 
```

means the current directory.

---

## 4. Copy a Directory

Use:

```bash
scp -r directory username@remote_host:/destination/
```

Example:

```bash
scp -r project user@192.168.1.20:/home/user/
```

The `-r` option means **recursive**.

It is required when copying directories.

---

## 5. Important `scp` Mental Model

Think of the command as:

```text
scp SOURCE DESTINATION
```

For local → remote:

```bash
scp file.txt user@server:/path/
```

For remote → local:

```bash
scp user@server:/path/file.txt .
```

The important syntax is:

```text
username@hostname:path
```

---

# 6. `tar` — Untarring an Archive

## What is `tar`?

`tar` stands for **Tape Archive**.

It is commonly used to package multiple files and directories into one archive.

A `.tar` file is an **archive**, not necessarily a compressed file.

For example:

```text
project/
├── app.py
├── config.txt
└── data/
```

can be packaged as:

```text
project.tar
```

---

## 7. Extracting a `.tar` File

Use:

```bash
tar -xf archive.tar
```

Example:

```bash
tar -xf project.tar
```

This extracts the archive into the current directory.

### Options

```text
-x → extract
-f → file/archive follows
```

Therefore:

```bash
tar -xf project.tar
```

means:

> Extract from the specified tar file.

---

# 8. Extracting `.tar.gz`

A very common archive format is:

```text
.tar.gz
```

This means:

```text
tar archive + gzip compression
```

Extract it using:

```bash
tar -xzf archive.tar.gz
```

Options:

```text
-x → extract
-z → gzip
-f → archive file
```

Example:

```bash
tar -xzf project.tar.gz
```

---

## 9. Extracting `.tar.bz2`

Use:

```bash
tar -xjf archive.tar.bz2
```

where:

```text
-j → bzip2
```

---

## 10. Extracting `.tar.xz`

Use:

```bash
tar -xJf archive.tar.xz
```

where:

```text
-J → xz
```

---

## 11. List Contents Without Extracting

Use:

```bash
tar -tf archive.tar
```

where:

```text
-t → list
-f → archive file
```

Example:

```bash
tar -tf project.tar
```

This lets you inspect the archive before extracting it.

---

# 12. DOS Format and Unix/Linux Line Endings

Different operating systems historically use different conventions for ending lines in text files.

### Unix/Linux

Uses:

```text
LF
```

which is represented as:

```text
\n
```

### DOS/Windows

Traditionally uses:

```text
CRLF
```

which consists of:

```text
CR + LF
```

or:

```text
\r\n
```

---

## 13. CR and LF

Two important characters are:

```text
CR → Carriage Return
LF → Line Feed
```

ASCII names:

```text
CR = \r
LF = \n
```

Therefore:

```text
Linux:
Hello\n

DOS/Windows:
Hello\r\n
```

---

# 14. Why DOS Files Can Cause Problems in Linux

Suppose a file created on Windows contains:

```text
hello\r\n
world\r\n
```

Linux programs may display the hidden carriage return as:

```text
hello^M
world^M
```

The `^M` represents the carriage return character.

This can cause problems with:

- Shell scripts
- `grep`
- `sed`
- `awk`
- Configuration files
- Text processing
- Comparisons
- Scripts copied from Windows

---

# 15. Opening a File in Binary Mode — `vi -b`

Use:

```bash
vi -b file
```

The `-b` option opens the file in **binary mode**.

Example:

```bash
vi -b demo.txt
```

This is particularly useful when investigating files containing unusual characters such as:

```text
CR
LF
NUL
```

With a DOS-format file, you may see:

```text
^M
```

at the ends of lines.

### Why use `-b`?

It helps make differences involving binary/non-text characters more visible in Vim/vi.

---

# 16. Removing `^M` from the Entire File

A common Vim/vi command for removing carriage returns is:

```text
:%s/^M//g
```

### Important: `^M` Is a Carriage Return Character

The `^M` shown in the command is **not normally typed as the two literal characters**:

```text
^
M
```

Instead, in Vim you can insert the actual carriage-return character using:

```text
Ctrl + V
Ctrl + M
```

So the command is effectively:

```text
:%s/<CR>//g
```

where `<CR>` here represents the carriage-return character `\r`, not the Enter key used to execute the command.

---

## 17. Breaking Down the Command

```text
:%s/^M//g
```

Conceptually:

```text
%
```

→ entire buffer

```text
s
```

→ substitute

```text
^M
```

→ carriage return

```text
//
```

→ replace it with nothing

```text
g
```

→ replace all matches on each line

Therefore:

> Remove every carriage-return character from the entire file.

---

## 18. Another Common Way to Remove DOS Carriage Returns

In Vim, you can also use:

```text
:%s/\r//g
```

This searches for carriage returns and removes them.

Another practical approach is to convert the file's format using appropriate tools such as:

```bash
dos2unix filename
```

if `dos2unix` is installed.

---

# 19. `Ctrl-F`, `Ctrl-D`, and `Ctrl-U` in `vi`/Vim

These commands are useful for moving through a file.

### `Ctrl-F`

```text
Ctrl-F
```

moves the screen **forward** approximately one screenful.

Think:

```text
F → Forward
```

---

### `Ctrl-D`

```text
Ctrl-D
```

moves the screen approximately **half a screen downward**.

Think:

```text
D → Down
```

---

### `Ctrl-U`

```text
Ctrl-U
```

moves the screen approximately **half a screen upward**.

Think:

```text
U → Up
```

---

## 20. Comparison

| Command | Purpose |
|---|---|
| `Ctrl-F` | Forward approximately one screen |
| `Ctrl-D` | Down approximately half screen |
| `Ctrl-U` | Up approximately half screen |

These are **navigation commands**, not text-editing commands.

---

# 21. Go to a Specific Line — `:n`

In Command mode:

```text
:n
```

moves to line number `n`.

For example:

```text
:25
```

moves to line 25.

Another common method is:

```text
25G
```

Both are useful.

---

## Example

Go to line 100:

```text
:100
```

or:

```text
100G
```

---

# 22. Replace One Character — `r`

In Command mode:

```text
r
```

replaces the character under the cursor.

Example:

```text
cat
```

Suppose the cursor is on:

```text
a
```

Press:

```text
rx
```

Result:

```text
cxt
```

The `r` command waits for the replacement character.

### Important

`r` normally replaces **one character** and returns to Command mode.

---

# 23. Search for a Word — `/word`

In Command mode:

```text
/word
```

then press:

```text
Enter
```

Example:

```text
/hello
```

Vim searches forward for:

```text
hello
```

---

## Move Through Matches

After searching:

```text
/hello
```

press:

```text
Enter
```

Then:

```text
n
```

moves to the **next occurrence**.

```text
N
```

moves to the **previous occurrence**.

### Mental Model

```text
/hello Enter
      ↓
   first match
      ↓
      n
      ↓
   next match
      ↓
      n
      ↓
   next match
```

---

# 24. Search and Replace in the Entire File

A standard Vim substitution command is:

```text
:%s/word/new_word/g
```

This means:

> Replace every occurrence of `word` with `new_word` throughout the entire file.

Example:

```text
:%s/hello/hola/g
```

---

## 25. Breaking Down `:%s/word/new_word/g`

```text
:
```

Enter an Ex command.

```text
%
```

All lines in the buffer.

```text
s
```

Substitute.

```text
word
```

Search pattern.

```text
new_word
```

Replacement text.

```text
g
```

Replace all matches on each line.

Therefore:

```text
:%s/word/new_word/g
```

means:

```text
ENTIRE FILE
     ↓
SEARCH word
     ↓
REPLACE WITH new_word
     ↓
REPLACE ALL OCCURRENCES
```

---

# 26. `A` — Append at the End of the Line

In Command mode:

```text
A
```

moves the cursor to the **end of the current line** and enters Insert mode.

This is equivalent conceptually to:

```text
$
a
```

but `A` does both in one command.

Example:

```text
Hello world
```

Place the cursor anywhere on the line.

Press:

```text
A
```

Now you are at:

```text
Hello world|
```

and can type:

```text
!
```

Result:

```text
Hello world!
```

Press:

```text
Esc
```

to return to Command mode.

---

# 27. `R` — Replace Mode

Uppercase:

```text
R
```

enters **Replace mode**.

In Replace mode, typed characters replace existing characters as you move forward.

Example:

```text
hello world
```

Press:

```text
R
```

Then type:

```text
HELLO
```

Existing characters are replaced.

Press:

```text
Esc
```

to stop Replace mode and return to Command mode.

---

## `r` vs `R`

This distinction is important.

```text
r
```

→ replace **one character**

```text
R
```

→ enter Replace mode and continue replacing characters until `Esc`

### Mental Model

```text
r → one replacement
R → replacement mode
```

---

# 28. `cw` — Change a Word

In Command mode:

```text
cw
```

means **change word**.

It deletes/changing the word region and enters Insert mode so that you can type replacement text.

Example:

```text
I like Linux
```

Place the cursor at the beginning of:

```text
Linux
```

Press:

```text
cw
```

Then type:

```text
Ubuntu
```

Press:

```text
Esc
```

Result:

```text
I like Ubuntu
```

---

## Mental Model of `cw`

Think:

```text
c → change
w → word
```

So:

```text
cw
```

means:

> Change this word.

---

# 29. `cw` vs `dw`

These commands are closely related.

```text
dw
```

means:

```text
delete word
```

```text
cw
```

means:

```text
change word
```

The practical difference is:

```text
dw → delete and remain in Command mode
cw → delete/change and enter Insert mode
```

Example:

```text
Linux is powerful
```

With:

```text
dw
```

you delete the word.

With:

```text
cw
```

you can immediately type its replacement.

---

# 30. Repeating Commands Using a Number

One of the powerful features of `vi` is the ability to specify a **count** before a command.

General pattern:

```text
[count][command]
```

For example:

```text
3dd
```

means:

> Delete three lines.

---

## 31. Repeating `x`

```text
5x
```

means:

> Delete five characters.

Instead of pressing:

```text
x
x
x
x
x
```

you can use:

```text
5x
```

---

# 32. Repeating `dw`

```text
3dw
```

means:

> Perform the `dw` operation three times.

---

# 33. Repeating `yy`

```text
4yy
```

copies four lines.

Then:

```text
p
```

can paste them.

---

# 34. Repeating Movement

Counts can also be used with movement commands.

For example:

```text
5j
```

moves down five lines.

```text
10l
```

moves right ten characters.

```text
3k
```

moves up three lines.

```text
4h
```

moves left four characters.

---

# 35. The General Count Mental Model

Think:

```text
NUMBER + COMMAND
```

Examples:

```text
5j
```

→ move down 5 lines

```text
3dd
```

→ delete 3 lines

```text
4yy
```

→ copy 4 lines

```text
5x
```

→ delete 5 characters

```text
2dw
```

→ delete 2 word operations

Counts make `vi` extremely efficient.

---

# 36. Important `vi` Movement and Editing Summary

```text
h        → left
j        → down
k        → up
l        → right

0        → beginning of line
^        → first non-blank character
$        → end of line
gg       → first line
G        → last line
:n       → go to line n
nG       → go to line n

Ctrl-F   → forward one screen
Ctrl-D   → down half screen
Ctrl-U   → up half screen

i        → insert before cursor
a        → insert after cursor
A        → append at end of line

r        → replace one character
R        → replace until Esc
cw       → change word

x        → delete character
dw       → delete word
dd       → delete line

yy       → copy line
p        → paste after
P        → paste before
u        → undo

:w       → save
:wq      → save and quit
:q       → quit
:q!      → quit without saving
```

---

# 37. Search and Replace Summary

### Search

```text
/word
```

Press:

```text
Enter
```

Then:

```text
n
```

→ next occurrence

```text
N
```

→ previous occurrence

---

### Replace First Match on Each Selected Line

```text
:1,5s/old/new/
```

---

### Replace All Matches on Each Selected Line

```text
:1,5s/old/new/g
```

---

### Replace Throughout Entire File

```text
:%s/old/new/g
```

---

# 38. `emacs`

## What is Emacs?

**Emacs** is another powerful text editor commonly associated with Unix/Linux systems.

Like `vi`/Vim, Emacs is designed for keyboard-driven editing and can be extended extensively.

Start Emacs with:

```bash
emacs filename
```

If the graphical version is unavailable or you want to work entirely inside the terminal:

```bash
emacs -nw filename
```

The `-nw` option means:

```text
no window
```

so Emacs runs inside the terminal.

---

# 39. Emacs and Vi Mental Model

The two editors have different philosophies.

### `vi`/Vim

Primarily based around:

```text
MODES + COMMANDS
```

For example:

```text
Esc
dd
yy
p
cw
:%s/old/new/g
```

### Emacs

Primarily based around:

```text
KEYBOARD SHORTCUTS + COMMANDS
```

Many Emacs commands use:

```text
Ctrl
Meta/Alt
```

combinations.

---

# 40. Basic Emacs Shortcuts

Some commonly encountered shortcuts are:

| Shortcut | Meaning |
|---|---|
| `Ctrl-x Ctrl-s` | Save |
| `Ctrl-x Ctrl-c` | Exit Emacs |
| `Ctrl-x Ctrl-f` | Open/find a file |
| `Ctrl-s` | Search forward |
| `Ctrl-g` | Cancel current command |
| `Ctrl-a` | Beginning of line |
| `Ctrl-e` | End of line |
| `Ctrl-f` | Forward one character |
| `Ctrl-b` | Backward one character |
| `Ctrl-n` | Next line |
| `Ctrl-p` | Previous line |

Emacs has a very large command ecosystem and can be extended far beyond basic text editing.

---

# 41. Nano vs Vi vs Emacs

| Feature | Nano | vi/Vim | Emacs |
|---|---|---|---|
| Beginner-friendly | Very easy | Steeper learning curve | Steeper learning curve |
| Modal | No | Yes | No in the vi sense |
| Terminal usage | Excellent | Excellent | Excellent |
| Keyboard-driven | Basic | Very strong | Extremely strong |
| Extensibility | Limited | Very high | Extremely high |
| Complex editing | Good | Excellent | Excellent |
| Common server editor | Yes | Very common | Less common |
| Learning curve | Low | Medium/High | High |

---

# 42. Important Exam Traps

## Trap 1 — `r` vs `R`

```text
r
```

replaces one character.

```text
R
```

enters Replace mode.

---

## Trap 2 — `a` vs `A`

```text
a
```

insert after the cursor.

```text
A
```

append at the end of the current line.

---

## Trap 3 — `i` vs `a`

```text
i
```

insert before cursor.

```text
a
```

insert after cursor.

---

## Trap 4 — `dw` vs `cw`

```text
dw
```

delete a word.

```text
cw
```

change a word and enter Insert mode.

---

## Trap 5 — `p` vs `P`

```text
p
```

paste after.

```text
P
```

paste before.

---

## Trap 6 — `:n` vs `n`

These are different.

```text
:n
```

is an Ex command used to go to line `n`.

```text
n
```

after a search moves to the next search match.

---

## Trap 7 — `^M`

The visible:

```text
^M
```

represents a carriage return character.

It is commonly associated with DOS/Windows-style:

```text
CRLF
```

line endings.

---

# 43. Complete Practical Exercise

Create a DOS-style-looking practice file:

```bash
printf 'hello world\r\nhello linux\r\nhello world\r\nthis is a test\r\n' > dos.txt
```

Inspect it:

```bash
cat -v dos.txt
```

You may see:

```text
hello world^M
hello linux^M
hello world^M
this is a test^M
```

Open it:

```bash
vi -b dos.txt
```

Then remove carriage returns with:

```text
:%s/\r//g
```

Show line numbers:

```text
:set number
```

Go to line 3:

```text
:3
```

Search for:

```text
hello
```

using:

```text
/hello
```

Press:

```text
n
```

to move through matches.

Replace all `hello` with `hola`:

```text
:%s/hello/hola/g
```

Save and exit:

```text
:wq
```

---

# 44. High-Value Commands to Memorize

If preparing specifically for a Linux/System Commands exam, memorize this set:

```text
scp file user@host:/path/
scp user@host:/path/file .

tar -xf archive.tar
tar -xzf archive.tar.gz
tar -tf archive.tar

vi -b file

:%s/\r//g

Ctrl-F
Ctrl-D
Ctrl-U

:n

r
A
R
cw

/word
n
N

:%s/old/new/g

dd
yy
p
x
dw

[count][command]

3dd
5x
4yy
5j
```

The most important mental model is:

```text
vi/vim
│
├── Movement
│   ├── h j k l
│   ├── 0 ^
│   ├── $
│   ├── gg / G
│   └── :n
│
├── Insert / Change
│   ├── i
│   ├── a
│   ├── A
│   ├── cw
│   ├── r
│   └── R
│
├── Delete / Copy / Paste
│   ├── x
│   ├── dw
│   ├── dd
│   ├── yy
│   └── p / P
│
├── Search
│   ├── /word
│   ├── n
│   └── N
│
└── Ex Commands
    ├── :w
    ├── :q
    ├── :wq
    ├── :q!
    ├── :n
    ├── :set number
    └── :%s/old/new/g
```