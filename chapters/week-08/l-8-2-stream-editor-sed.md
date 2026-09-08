---
layout: default
title: "L 8.2 - Stream editor sed"
---

# L 8.2 - Stream editor sed



# sed — Addressing, Printing, Deleting, Substitution, Ranges, Scripts and Debugging

## 1. Introduction

`sed` stands for **stream editor**.

It reads input line by line, applies editing commands, and writes the resulting text.

Basic syntax:

```bash
sed [options] 'command' file
```

Example:

```bash
sed 'p' file.txt
```

A very important idea in `sed` is:

```text
INPUT
  ↓
sed reads one line
  ↓
address decides whether command applies
  ↓
command executes
  ↓
sed prints pattern space by default
  ↓
next line
```

To understand `sed` properly, you need to understand three concepts:

1. **Pattern space** — the current line being processed.
2. **Address** — tells `sed` which line(s) a command should operate on.
3. **Command** — tells `sed` what to do: print, delete, substitute, insert, append, change, etc.

---

# 2. `sed -e "" file`

The `-e` option specifies a `sed` editing command.

```bash
sed -e '' file.txt
```

The empty command does nothing.

However, `sed` still performs its normal default behavior:

```text
read line
↓
do nothing
↓
print line
```

Therefore:

```bash
sed -e '' file.txt
```

essentially displays the file unchanged.

You can also write:

```bash
sed '' file.txt
```

For a single expression, `-e` is usually unnecessary.

---

# 3. `sed -n -e "" file`

Now consider:

```bash
sed -n -e '' file.txt
```

The important option is:

```text
-n
```

`-n` means:

> Suppress automatic printing of the pattern space.

Normally:

```text
sed
 ↓
automatically prints each processed line
```

With `-n`:

```text
sed -n
 ↓
does NOT automatically print
```

Therefore:

```bash
sed -n -e '' file.txt
```

produces no output.

This is extremely important because many `sed` commands become useful only when combined with `-n`.

---

# 4. Default Printing vs `-n`

Suppose:

```text
file.txt
```

contains:

```text
apple
banana
cherry
date
```

Run:

```bash
sed '' file.txt
```

Output:

```text
apple
banana
cherry
date
```

Why?

Because `sed` automatically prints each line.

Now:

```bash
sed -n '' file.txt
```

Output:

```text
```

Nothing is printed.

Why?

Because automatic printing was disabled.

Therefore:

```text
Without -n:
command executes
+
pattern space automatically printed

With -n:
command executes
+
nothing automatically printed
```

---

# 5. `sed -e "=" file`

The `=` command prints the current line number.

Example:

```bash
sed -e '=' file.txt
```

Suppose the file is:

```text
apple
banana
cherry
```

Output:

```text
1
apple
2
banana
3
cherry
```

Notice that both are printed:

```text
line number
actual line
```

Why?

Because:

```text
=     → explicitly prints line number
sed   → automatically prints pattern space
```

Therefore each input line produces two output lines.

---

# 6. Using `-n` with `=`

Now run:

```bash
sed -n -e '=' file.txt
```

Output:

```text
1
2
3
```

This is because:

```text
=  → explicitly prints line number
-n → suppresses automatic printing of actual line
```

Therefore:

```bash
sed -n '=' file.txt
```

is a convenient way to print line numbers only.

---

# 7. Printing a Particular Line

One of the most common `sed` tasks is printing a particular line.

Suppose:

```text
file.txt
```

contains:

```text
one
two
three
four
five
```

To print line 3:

```bash
sed -n '3p' file.txt
```

Output:

```text
three
```

Break it down:

```text
3
```

is the address.

```text
p
```

means print.

Therefore:

```text
3p
││
│└── print
└─── line 3
```

---

# 8. Why `-n` Is Important for `p`

Consider:

```bash
sed '3p' file.txt
```

Output:

```text
one
two
three
three
four
five
```

Why is `three` printed twice?

Because two things happen:

```text
3p
 ↓
explicitly print line 3

sed default behavior
 ↓
automatically print line 3 again
```

Therefore:

```bash
sed -n '3p' file.txt
```

is normally what you want.

Output:

```text
three
```

The combination:

```text
-n + p
```

is one of the most important patterns in `sed`.

---

# 9. `p` vs `!p` vs `$p`

These three expressions are very different.

---

## 9.1 `p`

```bash
sed -n 'p' file.txt
```

With `-n`, this prints every line.

Example:

```text
apple
banana
cherry
```

Output:

```text
apple
banana
cherry
```

---

## 9.2 `!p`

The `!` means:

> Apply the command to everything that does NOT match the address.

Example:

```bash
sed -n '3!p' file.txt
```

This means:

```text
not line 3 → print
```

If the file is:

```text
one
two
three
four
five
```

output:

```text
one
two
four
five
```

Line 3 is excluded.

---

## 9.3 `$p`

`$` represents the **last line**.

Therefore:

```bash
sed -n '$p' file.txt
```

prints the last line.

Example:

```text
one
two
three
four
five
```

Output:

```text
five
```

---

# 10. Important Difference

Remember:

```text
p
→ print selected lines

!p
→ print lines NOT selected by the address

$p
→ print the last line
```

These are not variations of the same concept.

---

# 11. Address Range

A `sed` command can operate on a range of lines.

Syntax:

```text
start,endcommand
```

Example:

```bash
sed -n '2,4p' file.txt
```

This means:

```text
start at line 2
continue through line 4
print
```

For:

```text
one
two
three
four
five
```

output:

```text
two
three
four
```

The range is inclusive.

---

# 12. Combining Commands

Multiple `sed` commands can be combined.

For example:

```bash
sed -n -e '2p' -e '4p' file.txt
```

This prints lines 2 and 4.

You can also separate commands using semicolons:

```bash
sed -n '2p;4p' file.txt
```

Both commands operate on the input.

Another example:

```bash
sed -n '
2p
4p
' file.txt
```

This is useful when commands become longer.

---

# 13. Printing Every nth Line

Suppose you want every 2nd line.

A useful GNU `sed` address form is:

```bash
sed -n '0~2p' file.txt
```

This prints:

```text
2
4
6
8
...
```

The general form is:

```text
first~step
```

For example:

```bash
sed -n '0~3p' file.txt
```

prints:

```text
3
6
9
12
...
```

Another example:

```bash
sed -n '1~3p' file.txt
```

prints:

```text
1
4
7
10
...
```

This is a GNU `sed` extension and is commonly available on Linux.

---

# 14. Regex Address

An address does not have to be a line number.

It can be a regular expression.

Syntax:

```text
/regex/command
```

Example:

```bash
sed -n '/ERROR/p' logfile.txt
```

This prints every line containing:

```text
ERROR
```

Example input:

```text
INFO Server started
ERROR Connection failed
INFO Retrying
ERROR Timeout
```

Output:

```text
ERROR Connection failed
ERROR Timeout
```

---

# 15. Regex Address Mental Model

For:

```bash
sed -n '/ERROR/p' logfile.txt
```

think:

```text
read line
   ↓
does line match /ERROR/?
   ↓
 ┌─┴─┐
yes  no
 ↓    ↓
 p    nothing
```

Because `-n` suppresses automatic printing.

---

# 16. `/regex/,+n`

GNU `sed` supports:

```text
/regex/,+n
```

This selects:

```text
the line matching regex
+
the next n lines
```

Example:

```bash
sed -n '/ERROR/,+2p' logfile.txt
```

Suppose:

```text
1 INFO Start
2 INFO Connection
3 ERROR Failure
4 INFO Retrying
5 INFO Reconnecting
6 INFO Success
```

Output:

```text
3 ERROR Failure
4 INFO Retrying
5 INFO Reconnecting
```

The regex matches line 3, and `+2` includes two additional lines.

---

# 17. Deleting a Particular Line

The `d` command deletes the current pattern space.

To delete line 3:

```bash
sed '3d' file.txt
```

Input:

```text
one
two
three
four
five
```

Output:

```text
one
two
four
five
```

The original file is not modified.

`sed` normally writes the transformed result to standard output.

---

# 18. Deleting a Range of Lines

Syntax:

```text
start,endd
```

Example:

```bash
sed '2,4d' file.txt
```

Input:

```text
one
two
three
four
five
```

Output:

```text
one
five
```

Lines 2 through 4 were deleted.

---

# 19. `/regex/d`

You can delete lines matching a regex.

Example:

```bash
sed '/ERROR/d' logfile.txt
```

This removes every line containing `ERROR`.

Input:

```text
INFO Start
ERROR Failure
INFO Retrying
ERROR Timeout
INFO Success
```

Output:

```text
INFO Start
INFO Retrying
INFO Success
```

---

# 20. Printing vs Deleting

Printing:

```bash
sed -n '/ERROR/p' logfile.txt
```

means:

```text
Keep only matching lines in the output.
```

Deleting:

```bash
sed '/ERROR/d' logfile.txt
```

means:

```text
Remove matching lines from the output.
```

A useful mental model:

```text
p → explicitly output selected lines

d → remove selected lines from processing/output
```

---

# 21. Search and Replace

The `s` command performs substitution.

Syntax:

```text
s/old/new/
```

Example:

```bash
sed 's/apple/orange/' file.txt
```

This replaces the first occurrence of `apple` on each line.

Input:

```text
apple pie
apple juice
banana
```

Output:

```text
orange pie
orange juice
banana
```

---

# 22. Replacing All Occurrences on a Line

By default:

```bash
sed 's/apple/orange/' file.txt
```

replaces only the first occurrence per line.

Use `g`:

```bash
sed 's/apple/orange/g' file.txt
```

Input:

```text
apple apple apple
```

Output:

```text
orange orange orange
```

Here:

```text
g = global
```

within each line.

---

# 23. Replacing Only at a Specific Address

You can combine an address with substitution.

Example:

```bash
sed '3s/apple/orange/' file.txt
```

Only line 3 is affected.

You can also use a regex address:

```bash
sed '/ERROR/s/server/client/' logfile.txt
```

This means:

```text
Find lines matching ERROR
        ↓
On those lines only
        ↓
replace server with client
```

---

# 24. Extended Regular Expressions

Basic `sed` uses **BRE** by default.

For extended regular expressions, use:

```bash
sed -E '...'
```

or:

```bash
sed -r '...'
```

On GNU/Linux, `-E` is the preferred portable spelling for enabling ERE.

Example:

```bash
sed -E 's/(cat|dog)/animal/g' file.txt
```

Without extended regex, grouping and alternation require additional escaping in traditional BRE syntax.

---

# 25. BRE vs ERE

Basic Regular Expression:

```text
BRE
```

Extended Regular Expression:

```text
ERE
```

In `sed`:

```bash
sed '...'
```

uses BRE.

```bash
sed -E '...'
```

uses ERE.

For example:

```bash
sed -E 's/(cat|dog)/animal/g' file.txt
```

Here:

```text
(cat|dog)
```

means:

```text
cat OR dog
```

---

# 26. Range Ending With a Regex

A range can begin with one address and end with a regex.

Syntax:

```text
start,/regex/command
```

Example:

```bash
sed -n '2,/END/p' file.txt
```

This starts at line 2 and continues until a line matching:

```text
END
```

is encountered.

Example:

```text
1 HEADER
2 START
3 apple
4 banana
5 END
6 another
```

Command:

```bash
sed -n '2,/END/p' file.txt
```

Output:

```text
2 START
3 apple
4 banana
5 END
```

The ending regex line is included.

---

# 27. Regex-to-Regex Range

You can use a regex as both the beginning and ending address.

Syntax:

```text
/START/,/END/command
```

Example:

```bash
sed -n '/START/,/END/p' file.txt
```

Input:

```text
HEADER
START
one
two
END
FOOTER
```

Output:

```text
START
one
two
END
```

This is extremely useful for extracting sections of text.

---

# 28. Important Range Behavior

For:

```bash
sed -n '/START/,/END/p' file.txt
```

the range includes both boundary lines:

```text
START
 ↓
content
 ↓
END
```

Therefore:

```text
START → included
END   → included
```

---

# 29. Insert a Header and Footer

The `i` command inserts text **before** the current line.

The `a` command appends text **after** the current line.

For a header:

```bash
sed '1i HEADER' file.txt
```

For a footer:

```bash
sed '$a FOOTER' file.txt
```

Example input:

```text
one
two
three
```

Header:

```bash
sed '1i HEADER' file.txt
```

Output:

```text
HEADER
one
two
three
```

Footer:

```bash
sed '$a FOOTER' file.txt
```

Output:

```text
one
two
three
FOOTER
```

---

# 30. Insert or Append at Any Line

Insert before line 3:

```bash
sed '3i INSERTED' file.txt
```

Input:

```text
one
two
three
four
```

Output:

```text
one
two
INSERTED
three
four
```

Append after line 3:

```bash
sed '3a APPENDED' file.txt
```

Output:

```text
one
two
three
APPENDED
four
```

Remember:

```text
i → insert before
a → append after
```

---

# 31. Insert or Append at a Regex Address

You can use a regex as the address.

Insert before a line containing `ERROR`:

```bash
sed '/ERROR/i WARNING' logfile.txt
```

Append after a line containing `ERROR`:

```bash
sed '/ERROR/a CHECK THIS' logfile.txt
```

Example:

```text
INFO Start
ERROR Failure
INFO End
```

Using:

```bash
sed '/ERROR/i WARNING' logfile.txt
```

produces:

```text
INFO Start
WARNING
ERROR Failure
INFO End
```

Using:

```bash
sed '/ERROR/a CHECK THIS' logfile.txt
```

produces:

```text
INFO Start
ERROR Failure
CHECK THIS
INFO End
```

---

# 32. Change a Line

The `c` command replaces the addressed line with new text.

Example:

```bash
sed '3c REPLACED LINE' file.txt
```

Input:

```text
one
two
three
four
```

Output:

```text
one
two
REPLACED LINE
four
```

You can also use a regex:

```bash
sed '/ERROR/c ERROR WAS HANDLED' logfile.txt
```

Every matching line is replaced.

---

# 33. `i`, `a`, and `c`

These commands are easy to confuse.

```text
i → insert before the addressed line

a → append after the addressed line

c → change/replace the addressed line
```

Example:

```bash
sed '3i BEFORE' file.txt
```

```text
BEFORE
line 3
```

Example:

```bash
sed '3a AFTER' file.txt
```

```text
line 3
AFTER
```

Example:

```bash
sed '3c REPLACED' file.txt
```

```text
REPLACED
```

---

# 34. sed Script File

Instead of writing all commands on the command line, you can store them in a file.

Suppose:

```text
commands.sed
```

contains:

```sed
1i HEADER
/ERROR/d
s/foo/bar/g
$a FOOTER
```

Run:

```bash
sed -f commands.sed input.txt
```

The `-f` option means:

```text
read sed commands from a file
```

This is useful when the editing logic becomes large.

---

# 35. Example sed Script

Create:

```bash
vi commands.sed
```

Put:

```sed
1i HEADER
/ERROR/d
s/apple/orange/g
$a FOOTER
```

Then execute:

```bash
sed -f commands.sed file.txt
```

Processing happens in order.

Conceptually:

```text
input
 ↓
insert HEADER
 ↓
delete ERROR lines
 ↓
replace apple → orange
 ↓
append FOOTER
 ↓
output
```

---

# 36. Joining Lines

By default, `sed` processes one input line at a time.

Sometimes we want to read one additional line.

The `N` command reads the next input line and appends it to the current pattern space.

Example:

```bash
sed 'N' file.txt
```

Suppose:

```text
one
two
three
four
```

The first cycle reads:

```text
one
```

Then:

```text
N
```

reads the next line and pattern space becomes conceptually:

```text
one
two
```

Then `sed` prints it.

Output can look like:

```text
one
two
three
four
```

but the important difference is that internally lines have been joined in the pattern space with a newline.

---

# 37. Demonstrating `N`

Consider:

```bash
printf '%s\n' one two three four | sed 'N;s/\n/ /'
```

Output:

```text
one two
three four
```

Step-by-step:

```text
read one
   ↓
N reads two
   ↓
pattern space:
one
two
   ↓
s/\n/ /
   ↓
one two
```

Then the next cycle reads:

```text
three
four
```

and produces:

```text
three four
```

---

# 38. Why `N` Is Important

`N` demonstrates an important `sed` concept:

> The pattern space does not always have to contain exactly one input line.

Normally:

```text
pattern space
      ↓
current line
```

After:

```sed
N
```

it can contain:

```text
current line
next line
```

separated by a newline.

This becomes important for:

- Joining lines.
- Multi-line pattern matching.
- Processing records spanning multiple lines.
- Advanced `sed` scripts.

---

# 39. Useful Multi-Line Commands

The three important commands to know are:

```text
N → read next line into pattern space

D → delete through first newline and restart cycle

P → print through first newline
```

For basic joining tasks, `N` is the key command.

---

# 40. Debugging `sed`

Debugging becomes important when a `sed` command contains:

- Multiple addresses.
- Several commands.
- Regexes.
- Ranges.
- Loops.
- Multi-line processing.
- Script files.

Start with a small input file.

Example:

```bash
printf '%s\n' \
'one' \
'ERROR problem' \
'two' \
'three' \
'END' \
'four' > test.txt
```

Then test the command separately.

---

# 41. Debugging Strategy

When a complex `sed` command does not work:

### Step 1 — Check the input

```bash
cat -n test.txt
```

This makes line numbers visible.

### Step 2 — Test the address

For example:

```bash
sed -n '/ERROR/p' test.txt
```

Check whether the regex actually matches.

### Step 3 — Test the command separately

For example:

```bash
sed 's/ERROR/WARNING/' test.txt
```

### Step 4 — Combine them

```bash
sed '/ERROR/s/ERROR/WARNING/' test.txt
```

### Step 5 — Add `-n` when debugging printing

```bash
sed -n '/ERROR/p' test.txt
```

This avoids confusion caused by automatic printing.

---

# 42. Use `cat -n` While Debugging

A very useful command is:

```bash
cat -n file.txt
```

Example:

```text
     1  one
     2  two
     3  ERROR
     4  four
```

This helps verify whether:

```text
3p
```

or:

```text
2,4d
```

is actually targeting the lines you expect.

---

# 43. Common `sed` Mistakes

## Mistake 1 — Forgetting `-n`

Instead of:

```bash
sed '3p' file.txt
```

usually use:

```bash
sed -n '3p' file.txt
```

Otherwise line 3 is printed twice.

---

## Mistake 2 — Thinking `d` means delete from the original file

This:

```bash
sed '3d' file.txt
```

does not modify `file.txt`.

It only produces modified output.

To save the result:

```bash
sed '3d' file.txt > newfile.txt
```

For in-place editing with GNU `sed`:

```bash
sed -i '3d' file.txt
```

Use `-i` carefully.

---

## Mistake 3 — Confusing `i` and `a`

Remember:

```text
i → before
a → after
```

---

## Mistake 4 — Forgetting that regex addresses are not regex substitutions

These are different:

```bash
sed -n '/ERROR/p' file.txt
```

and:

```bash
sed 's/ERROR/WARNING/' file.txt
```

The first uses a regex as an **address**.

The second uses a regex as the **pattern being replaced**.

---

# 44. Important Address Types

A `sed` address can be:

### Line number

```bash
sed -n '5p' file.txt
```

### Last line

```bash
sed -n '$p' file.txt
```

### Regex

```bash
sed -n '/ERROR/p' file.txt
```

### Range

```bash
sed -n '2,5p' file.txt
```

### Regex-to-regex range

```bash
sed -n '/START/,/END/p' file.txt
```

### Regex plus number

```bash
sed -n '/ERROR/,+2p' file.txt
```

---

# 45. Important `sed` Command Summary

| Command | Meaning |
|---|---|
| `p` | Print pattern space |
| `d` | Delete pattern space and start next cycle |
| `s` | Substitute |
| `i` | Insert before |
| `a` | Append after |
| `c` | Change/replace |
| `=` | Print line number |
| `N` | Read next line into pattern space |
| `P` | Print through first newline |
| `D` | Delete through first newline and restart cycle |

---

# 46. Address + Command Structure

A powerful way to understand `sed` is:

```text
ADDRESS COMMAND
```

Examples:

```bash
sed -n '3p' file.txt
```

```text
3 → address
p → command
```

Example:

```bash
sed '/ERROR/d' file.txt
```

```text
/ERROR/ → address
d       → command
```

Example:

```bash
sed '2,5d' file.txt
```

```text
2,5 → address range
d   → command
```

Example:

```bash
sed '/START/,/END/p' file.txt
```

```text
/START/,/END/ → address range
p             → command
```

This model is fundamental:

```text
              sed expression
                    │
             ┌──────┴──────┐
             │             │
          ADDRESS        COMMAND
             │             │
       "WHERE?"         "WHAT?"
```

---

# 47. Practical Examples

## Print line 10

```bash
sed -n '10p' file.txt
```

## Print last line

```bash
sed -n '$p' file.txt
```

## Print lines 5–10

```bash
sed -n '5,10p' file.txt
```

## Print lines containing ERROR

```bash
sed -n '/ERROR/p' file.txt
```

## Delete line 5

```bash
sed '5d' file.txt
```

## Delete lines 5–10

```bash
sed '5,10d' file.txt
```

## Delete ERROR lines

```bash
sed '/ERROR/d' file.txt
```

## Replace first `foo` with `bar`

```bash
sed 's/foo/bar/' file.txt
```

## Replace all `foo` with `bar`

```bash
sed 's/foo/bar/g' file.txt
```

## Replace only on line 5

```bash
sed '5s/foo/bar/' file.txt
```

## Insert before line 3

```bash
sed '3i INSERTED' file.txt
```

## Append after line 3

```bash
sed '3a APPENDED' file.txt
```

## Replace line 3

```bash
sed '3c REPLACED' file.txt
```

## Print lines from START to END

```bash
sed -n '/START/,/END/p' file.txt
```

## Delete lines from START to END

```bash
sed '/START/,/END/d' file.txt
```

---

# 48. Advanced Combined Examples

## Print ERROR and the next two lines

```bash
sed -n '/ERROR/,+2p' logfile.txt
```

---

## Delete ERROR and the next two lines

```bash
sed '/ERROR/,+2d' logfile.txt
```

---

## Replace text only inside a START–END section

```bash
sed '/START/,/END/s/foo/bar/g' file.txt
```

This means:

```text
Find START
   ↓
until END
   ↓
inside that range
   ↓
replace foo → bar
```

---

## Delete all ERROR lines and add a footer

```bash
sed '/ERROR/d;$a FOOTER' logfile.txt
```

---

## Print only lines 5 and 10

```bash
sed -n '5p;10p' file.txt
```

---

# 49. Practice Questions

## Q1. Print only line 7

```text
Input:
one
two
three
four
five
six
seven
eight
```

### Solution

```bash
sed -n '7p' file.txt
```

---

## Q2. Print only the last line

### Solution

```bash
sed -n '$p' file.txt
```

---

## Q3. Delete lines 3 through 6

### Solution

```bash
sed '3,6d' file.txt
```

---

## Q4. Print every line containing `ERROR`

### Solution

```bash
sed -n '/ERROR/p' logfile.txt
```

---

## Q5. Delete every line containing `DEBUG`

### Solution

```bash
sed '/DEBUG/d' logfile.txt
```

---

## Q6. Replace every `cat` with `dog`

### Solution

```bash
sed 's/cat/dog/g' file.txt
```

---

## Q7. Print lines from `START` through `END`

### Solution

```bash
sed -n '/START/,/END/p' file.txt
```

---

## Q8. Delete everything from `START` through `END`

### Solution

```bash
sed '/START/,/END/d' file.txt
```

---

## Q9. Print the line containing `ERROR` and the next three lines

### Solution

```bash
sed -n '/ERROR/,+3p' logfile.txt
```

---

## Q10. Insert `HEADER` before the first line

### Solution

```bash
sed '1i HEADER' file.txt
```

---

## Q11. Append `FOOTER` after the last line

### Solution

```bash
sed '$a FOOTER' file.txt
```

---

## Q12. Replace line 5 with `HELLO`

### Solution

```bash
sed '5c HELLO' file.txt
```

---

## Q13. Replace `foo` with `bar` only between `START` and `END`

### Solution

```bash
sed '/START/,/END/s/foo/bar/g' file.txt
```

---

## Q14. Print only odd-numbered lines

A GNU `sed` solution is:

```bash
sed -n '1~2p' file.txt
```

---

## Q15. Print only even-numbered lines

A GNU `sed` solution is:

```bash
sed -n '0~2p' file.txt
```

---

# 50. Exam Traps

### Trap 1

What happens?

```bash
sed '5p' file.txt
```

Answer:

Line 5 is printed **twice** because automatic printing is still enabled.

Usually use:

```bash
sed -n '5p' file.txt
```

---

### Trap 2

What does this mean?

```bash
sed -n '5!p' file.txt
```

Answer:

Print every line except line 5.

---

### Trap 3

What does this mean?

```bash
sed -n '$p' file.txt
```

Answer:

Print the last line.

---

### Trap 4

What does this mean?

```bash
sed '/ERROR/d' file.txt
```

Answer:

Delete matching lines from the output.

It does not modify the original file unless `-i` is used.

---

### Trap 5

What does this mean?

```bash
sed -n '/START/,/END/p' file.txt
```

Answer:

Print the range beginning at `START` and ending at `END`, including both matching boundary lines.

---

### Trap 6

What is the difference?

```bash
sed '3i HELLO' file.txt
```

vs

```bash
sed '3a HELLO' file.txt
```

Answer:

```text
3i → HELLO before line 3
3a → HELLO after line 3
```

---

# 51. Final Mental Model

The most important thing to understand is that `sed` expressions are generally:

```text
ADDRESS + COMMAND
```

Examples:

```text
3p
```

means:

```text
line 3
  ↓
print
```

```text
5d
```

means:

```text
line 5
  ↓
delete
```

```text
/ERROR/p
```

means:

```text
lines matching ERROR
        ↓
      print
```

```text
/ERROR/d
```

means:

```text
lines matching ERROR
        ↓
      delete
```

```text
2,5p
```

means:

```text
lines 2 through 5
        ↓
      print
```

```text
/START/,/END/p
```

means:

```text
START
  ↓
everything in between
  ↓
END
  ↓
print
```

---

# 52. Final Cheat Sheet

```text
sed
│
├── Printing
│   ├── p
│   ├── -n '3p'
│   ├── -n '$p'
│   └── -n '/regex/p'
│
├── Addresses
│   ├── 3
│   ├── $
│   ├── /regex/
│   ├── 2,5
│   ├── /START/,/END/
│   └── /ERROR/,+2
│
├── Deletion
│   ├── 3d
│   ├── 2,5d
│   └── /ERROR/d
│
├── Substitution
│   ├── s/old/new/
│   ├── s/old/new/g
│   └── /regex/s/old/new/
│
├── Insert / Append
│   ├── 3i TEXT
│   ├── 3a TEXT
│   ├── /regex/i TEXT
│   └── /regex/a TEXT
│
├── Change
│   ├── 3c TEXT
│   └── /regex/c TEXT
│
├── Line number
│   └── =
│
├── Multi-line processing
│   └── N
│
└── Script file
    └── sed -f script.sed file
```

The most important options:

```text
-n
→ suppress automatic printing

-e
→ specify a sed expression

-E
→ enable extended regular expressions

-f
→ read commands from a sed script file

-i
→ edit the input file in place
```

The most important commands:

```text
p → print
d → delete
s → substitute
i → insert before
a → append after
c → change
= → print line number
N → read next line
```

The most important distinction:

```text
sed '3p'
```

```text
→ print line 3 explicitly
→ BUT automatic printing is also active
→ line 3 appears twice
```

Whereas:

```text
sed -n '3p'
```

```text
→ automatic printing disabled
→ p explicitly prints line 3
→ line 3 appears once
```

Therefore, one of the most important `sed` patterns to remember is:

```bash
sed -n 'ADDRESSp' file
```

which means:

```text
select the address
      ↓
explicitly print it
      ↓
do not automatically print anything else
```
