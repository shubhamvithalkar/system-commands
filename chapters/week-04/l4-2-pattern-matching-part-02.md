---
layout: default
title: "L4.2: Pattern Matching - Part 02"
---

# L4.2: Pattern Matching - Part 02



# Regex POSIX Character Classes, `grep`, `egrep`, `cut` and Pipelines

## 1. `dpkg-query | grep`

`dpkg-query` can display information about installed Debian packages. We can pipe its output to `grep` to search for packages matching a pattern.

### Basic idea

```bash
dpkg-query -W | grep python
```

Meaning:

```text
dpkg-query -W
      ↓
list installed packages
      ↓
grep python
      ↓
keep only lines containing "python"
```

Example:

```bash
dpkg-query -W | grep openssh
```

This searches the package list for package names containing `openssh`.

### Important

The `|` operator sends the **stdout of the left command** to the **stdin of the right command**.

```bash
command1 | command2
```

---

# 2. POSIX Character Classes

Regular expressions provide predefined character classes called **POSIX character classes**.

General syntax:

```regex
[[:class:]]
```

Examples:

```regex
[[:alpha:]]
[[:digit:]]
[[:alnum:]]
```

These are useful because they provide readable and standardized ways to match categories of characters.

---

# 3. `[[:alpha:]]` — Alphabetic Characters

```bash
cat file | grep '[[:alpha:]]'
```

Preferably:

```bash
grep '[[:alpha:]]' file
```

`[[:alpha:]]` matches an alphabetic character.

Conceptually:

```text
A B C ... Z
a b c ... z
```

Example:

```text
hello
12345
abc123
456
```

Command:

```bash
grep '[[:alpha:]]' file
```

Matches:

```text
hello
abc123
```

Why?

Because those lines contain at least one alphabetic character.

### Important

This does **not** mean that the entire line contains only letters.

```regex
[[:alpha:]]
```

means:

> Find at least one alphabetic character somewhere in the line.

---

# 4. `[[:alnum:]]` — Alphabetic or Numeric

```bash
grep '[[:alnum:]]' file
```

`[[:alnum:]]` means:

```text
alphabetic OR numeric
```

Conceptually:

```text
A-Z
a-z
0-9
```

Example:

```text
hello
12345
abc123
!!!
```

Output:

```text
hello
12345
abc123
```

`!!!` does not match because it contains neither letters nor digits.

---

# 5. `[[:digit:]]` — Digits

```bash
grep '[[:digit:]]' file
```

Matches a digit:

```text
0 1 2 3 4 5 6 7 8 9
```

Example:

```text
hello
abc123
hello42
test
```

Output:

```text
abc123
hello42
```

The line only needs to contain **at least one digit**.

---

# 6. `[[:cntrl:]]` — Control Characters

```bash
grep '[[:cntrl:]]' file
```

`[[:cntrl:]]` matches control characters.

Control characters are non-printing characters used to control text streams or terminals.

Examples include:

```text
NUL
TAB
NEWLINE
CARRIAGE RETURN
ESC
```

This can be useful when diagnosing files containing strange or invisible characters.

For example:

```bash
cat -v file
```

or:

```bash
grep -n '[[:cntrl:]]' file
```

can help investigate hidden characters.

---

# 7. `grep -v '[[:cntrl:]]'`

```bash
grep -v '[[:cntrl:]]' file
```

`-v` means:

> invert the match

Normally:

```bash
grep pattern file
```

keeps matching lines.

With:

```bash
grep -v pattern file
```

it keeps **non-matching lines**.

Therefore:

```bash
grep -v '[[:cntrl:]]' file
```

means:

> Print lines that do NOT contain control characters.

### Mental model

```text
grep pattern
    ↓
MATCH → keep

grep -v pattern
    ↓
MATCH → reject
NOT MATCH → keep
```

---

# 8. `[[:punct:]]` — Punctuation

```bash
grep '[[:punct:]]' file
```

Matches punctuation characters.

Examples include:

```text
! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ ] ^ _ ` { | } ~
```

Example:

```text
hello
hello!
hello-world
12345
```

Output:

```text
hello!
hello-world
```

because `!` and `-` are punctuation characters.

---

# 9. `[[:lower:]]` — Lowercase

```bash
grep '[[:lower:]]' file
```

Matches lowercase alphabetic characters.

Example:

```text
HELLO
hello
Hello
123
```

Output:

```text
hello
Hello
```

because both lines contain lowercase letters.

---

# 10. `[[:upper:]]` — Uppercase

```bash
grep '[[:upper:]]' file
```

Matches uppercase alphabetic characters.

Example:

```text
hello
HELLO
Hello
123
```

Output:

```text
HELLO
Hello
```

---

# 11. `[[:print:]]` — Printable Characters

```bash
grep '[[:print:]]' file
```

`[[:print:]]` matches printable characters.

These include characters that can normally be displayed, such as:

```text
letters
digits
punctuation
spaces
```

It excludes control characters.

This is useful when investigating whether text contains non-printing characters.

---

# 12. `[[:blank:]]` — Space and TAB

```bash
grep '[[:blank:]]' file
```

`[[:blank:]]` matches horizontal whitespace:

```text
space
TAB
```

Example:

```text
hello world
helloworld
hello<TAB>world
```

The first and third lines contain blank characters.

### Important distinction

`blank` is mainly horizontal whitespace.

---

# 13. `[[:space:]]` — Whitespace

```bash
grep '[[:space:]]' file
```

`[[:space:]]` is broader than `[[:blank:]]`.

It can match whitespace characters such as:

```text
space
TAB
newline
carriage return
vertical tab
form feed
```

Conceptually:

```text
blank ⊂ space
```

So:

```regex
[[:blank:]]
```

is narrower than:

```regex
[[:space:]]
```

---

# 14. `[[:graph:]]` — Visible Non-Space Characters

```bash
grep '[[:graph:]]' file
```

`[[:graph:]]` matches printable characters **except whitespace**.

Think:

```text
graph = print - whitespace
```

For example:

```text
hello
123
hello!
```

contain graph characters.

A line containing only spaces does not contain a graph character.

---

# 15. POSIX Character Class Cheat Sheet

| Class | Meaning |
|---|---|
| `[[:alpha:]]` | Alphabetic characters |
| `[[:alnum:]]` | Alphabetic + numeric |
| `[[:digit:]]` | Digits |
| `[[:lower:]]` | Lowercase |
| `[[:upper:]]` | Uppercase |
| `[[:cntrl:]]` | Control characters |
| `[[:punct:]]` | Punctuation |
| `[[:print:]]` | Printable characters including spaces |
| `[[:blank:]]` | Space and TAB |
| `[[:space:]]` | Whitespace |
| `[[:graph:]]` | Printable characters excluding whitespace |

### Easy Memory Trick

```text
alpha  → letters
alnum  → letters + numbers
digit  → numbers
lower  → lowercase
upper  → uppercase
punct  → punctuation
blank  → space/TAB
space  → whitespace
print  → printable
graph  → printable but not whitespace
cntrl  → control characters
```

---

# 16. Skipping All Empty Lines

Suppose:

```text
apple

banana


orange
```

We want:

```text
apple
banana
orange
```

Use:

```bash
grep -v '^$' file
```

### Understanding `^$`

```regex
^
```

means:

> beginning of line

and:

```regex
$
```

means:

> end of line

Together:

```regex
^$
```

means:

> beginning immediately followed by end

Therefore, the line contains nothing.

So:

```bash
grep -v '^$' file
```

means:

> Print everything except empty lines.

---

# 17. Skipping Empty and Whitespace-Only Lines

Sometimes a line isn't technically empty:

```text
   
```

It contains spaces.

Use:

```bash
grep -v '^[[:space:]]*$' file
```

This removes:

- completely empty lines
- lines containing only spaces
- lines containing only TABs
- lines containing other whitespace

Breakdown:

```regex
^
```

start of line

```regex
[[:space:]]*
```

zero or more whitespace characters

```regex
$
```

end of line

Therefore:

```regex
^[[:space:]]*$
```

matches a line containing only whitespace.

Using `-v` removes those lines.

---

# 18. Matching 12 Digits

Lecture command:

```bash
egrep '[[:digit:]]{12}' file
```

Modern equivalent:

```bash
grep -E '[[:digit:]]{12}' file
```

The pattern:

```regex
[[:digit:]]{12}
```

means:

> 12 consecutive digits

Example:

```text
987654321012
```

matches.

But:

```text
12345
```

doesn't contain 12 consecutive digits.

### Important

This does **not necessarily mean the entire line contains exactly 12 digits**.

For example:

```text
abc987654321012xyz
```

contains 12 consecutive digits, so it can match.

If you want the entire line to contain exactly 12 digits:

```bash
grep -E '^[[:digit:]]{12}$' file
```

---

# 19. Exactly 6 Digits as a Word

Lecture command:

```bash
egrep '\b[[:digit:]]{6}\b' file
```

Modern:

```bash
grep -E '\b[[:digit:]]{6}\b' file
```

Break it down:

```regex
\b
```

word boundary

```regex
[[:digit:]]{6}
```

exactly six digits

```regex
\b
```

another word boundary

Therefore:

```text
123456
```

matches.

But:

```text
1234567
```

does not match as a standalone six-digit word.

### Example

```text
Roll 123456
Roll 1234567
ID: 123456
```

Command:

```bash
grep -E '\b[[:digit:]]{6}\b' file
```

matches:

```text
Roll 123456
ID: 123456
```

---

# 20. Matching a Roll Number Pattern

Lecture pattern:

```bash
egrep '\b[[:alpha:]]{2}[[:digit:]]{2}[[:alpha:]][[:digit:]]{2}\b' file
```

Modern:

```bash
grep -E '\b[[:alpha:]]{2}[[:digit:]]{2}[[:alpha:]][[:digit:]]{2}\b' file
```

Pattern structure:

```text
\b
│
├── [[:alpha:]]{2}   → 2 letters
├── [[:digit:]]{2}   → 2 digits
├── [[:alpha:]]      → 1 letter
├── [[:digit:]]{2}   → 2 digits
│
\b
```

Therefore the format is:

```text
LLDDLD
```

where:

```text
L = letter
D = digit
```

Examples:

```text
AB12C34
CS01A25
ME23X91
```

can match.

But:

```text
A12B34
```

doesn't match because two letters are required at the beginning.

---

# 21. Why `\b` Is Useful

Without:

```regex
\b
```

this pattern:

```regex
[[:alpha:]]{2}[[:digit:]]{2}[[:alpha:]][[:digit:]]{2}
```

could match the required pattern inside a larger word.

Adding:

```regex
\b ... \b
```

helps require a word boundary around the complete pattern.

---

# 22. URLs

Regex can be used to identify URL-like strings.

Example:

```text
https://google.com
https://github.com/user
http://example.com
hello world
```

A simple URL pattern is:

```regex
https?://[^[:space:]]+
```

Using grep:

```bash
grep -E 'https?://[^[:space:]]+' file
```

### Breakdown

```regex
http
```

matches the literal text `http`.

```regex
s?
```

means:

> zero or one `s`

Therefore both work:

```text
http
https
```

Then:

```regex
://
```

matches the literal characters.

Then:

```regex
[^[:space:]]+
```

means:

> one or more characters that are not whitespace.

So it can consume:

```text
google.com
github.com/user
example.com/page?id=10
```

### Important

This is a **simple URL detector**, not a complete URL validator.

Fully validating URLs with regex can become extremely complicated.

---

# 23. `cut`

`cut` is used to extract portions of text.

Two major modes are:

```bash
cut -c
```

for characters, and:

```bash
cut -d ... -f ...
```

for delimiter-separated fields.

---

# 24. `cut -c 1-4 file`

```bash
cut -c 1-4 file
```

`-c` means:

> characters

`1-4` means:

> characters 1 through 4

Suppose:

```text
ABCDEFGHIJ
1234567890
LinuxShell
```

Command:

```bash
cut -c 1-4 file
```

Output:

```text
ABCD
1234
Linu
```

---

# 25. `cut -c -4 file`

```bash
cut -c -4 file
```

means:

> characters from the beginning through character 4

Equivalent conceptually to:

```text
1-4
```

Example:

```text
ABCDEFGHIJ
```

Output:

```text
ABCD
```

### Useful Forms

Characters 1 through 4:

```bash
cut -c 1-4 file
```

Characters 5 through 10:

```bash
cut -c 5-10 file
```

Character 5 through the end:

```bash
cut -c 5- file
```

Beginning through character 4:

```bash
cut -c -4 file
```

---

# 26. Extracting Fields with `cut -d`

Suppose:

```text
Shubham 27 DataScience
Rahul 25 Engineering
Aman 22 Physics
```

We can use space as the delimiter:

```bash
cut -d " " -f 1 file
```

### Breakdown

```text
-d " "
```

sets the delimiter to a space.

```text
-f 1
```

selects field 1.

Output:

```text
Shubham
Rahul
Aman
```

---

# 27. `cat file | cut -d " " -f 1`

Lecture form:

```bash
cat file | cut -d " " -f 1
```

This works, but is unnecessarily long.

Prefer:

```bash
cut -d " " -f 1 file
```

because `cut` can directly read the file.

### When is a pipe useful?

When the input comes from another command:

```bash
some_command | cut -d " " -f 1
```

For example:

```bash
dpkg-query -W | cut -d " " -f 1
```

Here `cut` is processing output generated by another command.

---

# 28. Multiple `cut` Commands

Suppose:

```text
101;Shubham,DataScience
102;Rahul,Engineering
103;Aman,Physics
```

We want:

```text
Shubham
Rahul
Aman
```

First:

```bash
cut -d ";" -f 2 file
```

produces:

```text
Shubham,DataScience
Rahul,Engineering
Aman,Physics
```

Then extract the first comma-separated field:

```bash
cut -d ";" -f 2 file | cut -d "," -f 1
```

Output:

```text
Shubham
Rahul
Aman
```

### Pipeline Mental Model

```text
original file
     ↓
cut by ;
     ↓
field 2
     ↓
Shubham,DataScience
     ↓
cut by ,
     ↓
field 1
     ↓
Shubham
```

---

# 29. Grep Version of the Above Command

Suppose:

```text
101;Shubham,DataScience
102;Rahul,Engineering
103;Aman,Physics
```

We want to extract the names.

One GNU grep solution is:

```bash
grep -oP '(?<=;)[^,]+' file
```

### Breakdown

```regex
(?<=;)
```

is a positive lookbehind.

It means:

> The match must immediately follow `;`.

Then:

```regex
[^,]+
```

means:

> one or more characters that are not comma.

For:

```text
101;Shubham,DataScience
```

it extracts:

```text
Shubham
```

### Why `-o`?

```bash
-o
```

means:

> print only the matched portion.

### Why `-P`?

```bash
-P
```

enables PCRE-style regular expressions in GNU grep.

Therefore:

```bash
grep -oP '(?<=;)[^,]+' file
```

prints only the names.

---

# 30. `cut` vs `grep`

These tools solve different problems.

### `grep`

Used primarily for:

```text
searching
filtering
regex matching
```

Example:

```bash
grep 'ERROR' log.txt
```

Question answered:

> Which lines contain this pattern?

### `cut`

Used primarily for:

```text
extracting characters
extracting fields
```

Example:

```bash
cut -d "," -f 2 data.csv
```

Question answered:

> Which part of each line do I want?

### Easy Mental Model

```text
grep → FIND/FILTER
cut  → EXTRACT
```

---

# 31. Complex Pipeline

Lecture command:

```bash
cat file | cut -d "/" -f 3 | cut -d " " -f 1 | head -n 19 | tail -n 1
```

Let's understand it step by step.

Suppose the input contains:

```text
https://google.com Google
https://github.com GitHub
https://example.com Example
```

---

## Step 1 — Split Using `/`

```bash
cut -d "/" -f 3
```

For:

```text
https://google.com Google
```

splitting by `/` gives approximately:

```text
field 1 → https:
field 2 → 
field 3 → google.com Google
```

Therefore field 3 is:

```text
google.com Google
```

---

## Step 2 — Extract First Space-Separated Field

```bash
cut -d " " -f 1
```

Now:

```text
google.com Google
```

becomes:

```text
google.com
```

Therefore:

```bash
cut -d "/" -f 3 | cut -d " " -f 1
```

extracts the hostname/domain portion from this particular URL format.

---

# 32. `head -n 19`

```bash
head -n 19
```

means:

> Keep the first 19 lines.

Example:

```text
1
2
3
...
19
20
21
```

becomes:

```text
1
2
3
...
19
```

---

# 33. `tail -n 1`

```bash
tail -n 1
```

means:

> Keep only the last line of the input.

Therefore:

```bash
head -n 19 | tail -n 1
```

means:

> Take the first 19 lines, then select the last one.

The result is:

```text
line 19
```

---

# 34. Understanding the Complete Pipeline

```bash
cat file |
cut -d "/" -f 3 |
cut -d " " -f 1 |
head -n 19 |
tail -n 1
```

Pipeline:

```text
file
 ↓
extract field 3 using /
 ↓
extract field 1 using space
 ↓
keep first 19 lines
 ↓
keep last of those 19 lines
 ↓
RESULT = line 19 after transformations
```

The key concept is:

```bash
head -n 19 | tail -n 1
```

selects the **19th line**.

---

# 35. A Better Way to Select Line 19

Instead of:

```bash
head -n 19 | tail -n 1
```

you can often use:

```bash
sed -n '19p' file
```

or:

```bash
awk 'NR==19' file
```

For example:

```bash
cut -d "/" -f 3 file |
cut -d " " -f 1 |
sed -n '19p'
```

Or:

```bash
cut -d "/" -f 3 file |
cut -d " " -f 1 |
awk 'NR==19'
```

---

# 36. Important `cut` Limitation

`cut -d " " -f 1` treats **each individual space** as the delimiter.

For example:

```text
hello    world
```

contains multiple spaces.

Using:

```bash
cut -d " " -f 1
```

may produce unexpected empty fields because every space is treated as a delimiter.

For arbitrary whitespace-separated data, `awk` is often better:

```bash
awk '{print $1}' file
```

`awk` treats runs of whitespace as a separator by default.

---

# 37. `cat file | command` — Useless Use of Cat

This:

```bash
cat file | grep pattern
```

works.

But:

```bash
grep pattern file
```

is normally better.

Likewise:

```bash
cat file | cut -c 1-4
```

can usually be:

```bash
cut -c 1-4 file
```

The pipe becomes useful when the previous command generates the data:

```bash
dpkg-query -W | grep python
```

Here:

```text
dpkg-query
    ↓
generates package list
    ↓
grep
    ↓
filters package list
```

So the pipe is meaningful.

---

# 38. Important Exam Patterns

## Find lines containing letters

```bash
grep '[[:alpha:]]' file
```

## Find lines containing numbers

```bash
grep '[[:digit:]]' file
```

## Find lines containing letters or numbers

```bash
grep '[[:alnum:]]' file
```

## Find lines containing punctuation

```bash
grep '[[:punct:]]' file
```

## Find lines containing lowercase letters

```bash
grep '[[:lower:]]' file
```

## Find lines containing uppercase letters

```bash
grep '[[:upper:]]' file
```

## Find lines containing whitespace

```bash
grep '[[:space:]]' file
```

## Find lines containing spaces/TABs

```bash
grep '[[:blank:]]' file
```

## Remove empty lines

```bash
grep -v '^$' file
```

## Remove empty and whitespace-only lines

```bash
grep -v '^[[:space:]]*$' file
```

## Find 12 consecutive digits

```bash
grep -E '[[:digit:]]{12}' file
```

## Find exactly 12 digits as the complete line

```bash
grep -E '^[[:digit:]]{12}$' file
```

## Find exactly six digits as a word

```bash
grep -E '\b[[:digit:]]{6}\b' file
```

## Match roll number format

```bash
grep -E '\b[[:alpha:]]{2}[[:digit:]]{2}[[:alpha:]][[:digit:]]{2}\b' file
```

## Find URLs

```bash
grep -E 'https?://[^[:space:]]+' file
```

## First four characters

```bash
cut -c 1-4 file
```

## First four characters using shorthand

```bash
cut -c -4 file
```

## First field separated by space

```bash
cut -d " " -f 1 file
```

## Second field separated by `;`

```bash
cut -d ";" -f 2 file
```

## First field after splitting the second `;` field by comma

```bash
cut -d ";" -f 2 file | cut -d "," -f 1
```

## 19th line

```bash
head -n 19 file | tail -n 1
```

or:

```bash
sed -n '19p' file
```

or:

```bash
awk 'NR==19' file
```

---

# 39. Practice Dataset

Create a file:

```bash
cat > data.txt
```

Enter:

```text
Hello World
123456
ABC123
hello123!
HELLO
abc
Hello123World
AB12C34
XY99Z88
1234567
https://google.com Google
https://github.com GitHub

hello    world
!!!
```

Press:

```text
Ctrl-D
```

to finish.

---

# 40. Practice Questions

## Q1. Find lines containing at least one digit.

```bash
grep '[[:digit:]]' data.txt
```

---

## Q2. Find lines containing at least one uppercase letter.

```bash
grep '[[:upper:]]' data.txt
```

---

## Q3. Find lines containing punctuation.

```bash
grep '[[:punct:]]' data.txt
```

---

## Q4. Print lines that do not contain control characters.

```bash
grep -v '[[:cntrl:]]' data.txt
```

---

## Q5. Remove all empty lines.

```bash
grep -v '^$' data.txt
```

---

## Q6. Find a standalone six-digit number.

```bash
grep -E '\b[[:digit:]]{6}\b' data.txt
```

---

## Q7. Find valid roll-number-shaped strings.

```bash
grep -E '\b[[:alpha:]]{2}[[:digit:]]{2}[[:alpha:]][[:digit:]]{2}\b' data.txt
```

---

## Q8. Print the first four characters of every line.

```bash
cut -c 1-4 data.txt
```

---

## Q9. Extract the domain from URLs of the form:

```text
https://domain.com Name
```

Solution:

```bash
cut -d "/" -f 3 data.txt | cut -d " " -f 1
```

---

## Q10. Extract only URLs.

```bash
grep -E 'https?://[^[:space:]]+' data.txt
```

---

# 41. Key Mental Model

Think of these commands as different tools:

```text
grep
 │
 ├── search/filter lines
 └── regex matching

cut
 │
 ├── extract characters
 └── extract delimiter-separated fields

head
 │
 └── take beginning of input

tail
 │
 └── take end of input

|
 │
 └── connect commands
```

The most important pipeline idea is:

```bash
command1 | command2 | command3
```

The output of one command becomes the input of the next.

For example:

```bash
cut -d ";" -f 2 file |
cut -d "," -f 1 |
head -n 10
```

means:

```text
file
 ↓
extract field 2 using ;
 ↓
extract field 1 using ,
 ↓
take first 10 lines
```

Once you can mentally trace data through each stage, complex Linux command pipelines become much easier to solve in exams and real-world shell scripting.

---

# 42. Final Cheat Sheet

| Command | Purpose |
|---|---|
| `dpkg-query -W \| grep pattern` | Search installed packages |
| `grep '[[:alpha:]]' file` | Lines containing letters |
| `grep '[[:alnum:]]' file` | Lines containing letters/digits |
| `grep '[[:digit:]]' file` | Lines containing digits |
| `grep '[[:cntrl:]]' file` | Lines containing control characters |
| `grep -v '[[:cntrl:]]' file` | Lines without control characters |
| `grep '[[:punct:]]' file` | Lines containing punctuation |
| `grep '[[:lower:]]' file` | Lines containing lowercase |
| `grep '[[:upper:]]' file` | Lines containing uppercase |
| `grep '[[:print:]]' file` | Lines containing printable characters |
| `grep '[[:blank:]]' file` | Lines containing space/TAB |
| `grep '[[:space:]]' file` | Lines containing whitespace |
| `grep '[[:graph:]]' file` | Lines containing non-space printable chars |
| `grep -v '^$' file` | Remove empty lines |
| `grep -v '^[[:space:]]*$' file` | Remove empty/whitespace-only lines |
| `grep -E '[[:digit:]]{12}' file` | Find 12 consecutive digits |
| `grep -E '\b[[:digit:]]{6}\b' file` | Find standalone six-digit numbers |
| `grep -E 'https?://[^[:space:]]+' file` | Find URL-like strings |
| `cut -c 1-4 file` | First 4 characters |
| `cut -c -4 file` | First 4 characters |
| `cut -d " " -f 1 file` | First space-separated field |
| `cut -d ";" -f 2 file` | Second `;`-separated field |
| `head -n 19 file` | First 19 lines |
| `tail -n 1` | Last line |
| `head -n 19 \| tail -n 1` | Select line 19 |
| `sed -n '19p' file` | Select line 19 |
| `awk 'NR==19' file` | Select line 19 |

## Most Important Exam Distinctions

```text
grep
→ FIND/FILTER

cut
→ EXTRACT

head
→ TAKE FROM BEGINNING

tail
→ TAKE FROM END

|
→ SEND OUTPUT TO NEXT COMMAND

-v
→ INVERT MATCH

-c
→ CHARACTER MODE

-d
→ DELIMITER

-f
→ FIELD

-E
→ Extended Regular Expressions

-P
→ PCRE in GNU grep

\b
→ WORD BOUNDARY

^
→ BEGINNING OF LINE

$
→ END OF LINE
```
