---
layout: default
title: "9.1 - AWK Programming Part 1"
---

# 9.1 - AWK Programming Part 1


# AWK Command Fundamentals

## 1. What is AWK?

`awk` is a powerful Unix/Linux text-processing language used to **read, process, and generate output from structured text**.

The name **AWK** comes from the surnames of its creators:

- **A** — Alfred Aho
- **W** — Peter Weinberger
- **K** — Brian Kernighan

AWK is especially useful for:

- Processing text files
- Working with columns and fields
- Filtering records
- Pattern matching
- Calculations
- Generating reports
- Processing CSV-like data
- Log analysis

---

# 2. AWK Execution Model

The basic AWK execution model is:

> **Read → Process → Write**

AWK normally processes the input one record at a time.

```text
Input
  ↓
Read a record
  ↓
Process the record
  ↓
Produce output
  ↓
Read next record
```

For normal text files:

- A **record** is usually one line.
- Records are separated by `\n`.
- Each record is divided into **fields**.
- Fields are normally separated by spaces or tabs.

For example:

```text
Alice 25 50000
Bob 30 60000
Charlie 28 55000
```

AWK sees:

```text
Record 1 → Alice 25 50000
Record 2 → Bob 30 60000
Record 3 → Charlie 28 55000
```

And the first record contains:

```text
$1 = Alice
$2 = 25
$3 = 50000
```

---

# 3. Running AWK from the Command Line

The general syntax is:

```bash
awk 'program' file
```

For example:

```bash
awk '{print $1}' file.txt
```

This prints the first field of every record.

You can also pipe input into AWK:

```bash
cat file.txt | awk '{print $1}'
```

However, when possible, directly passing the file is usually simpler:

```bash
awk '{print $1}' file.txt
```

---

# 4. AWK Blocks

AWK programs are commonly divided into three types of blocks:

```text
BEGIN
pattern { action }
END
```

## BEGIN Block

The `BEGIN` block executes **before AWK starts reading input**.

```awk
BEGIN {
    print "Starting AWK"
}
```

Example:

```bash
awk 'BEGIN {print "Starting"} {print $1}' file.txt
```

Execution:

```text
Starting
Alice
Bob
Charlie
```

---

## Pattern-Action Block

The normal action block runs once for each input record.

```awk
{
    print $1
}
```

This is equivalent to:

```awk
$0 {
    print $1
}
```

For each input line, AWK executes the action.

---

## END Block

The `END` block executes **after all input has been processed**.

```awk
END {
    print "Finished"
}
```

Example:

```bash
awk '{print $1} END {print "Finished"}' file.txt
```

---

# 5. Complete AWK Structure

A typical AWK program can look like:

```awk
BEGIN {
    # Initialization
}

pattern {
    # Process records
}

END {
    # Final processing
}
```

Example:

```bash
awk '
BEGIN {
    print "Employee List"
}
{
    print $1
}
END {
    print "End of List"
}
' employees.txt
```

---

# 6. awk and gawk

On many Linux systems, the `awk` command is provided by **GNU awk**, commonly called `gawk`.

You can check which executable is being used with:

```bash
realpath "$(which awk)"
```

You can also check:

```bash
awk --version
```

On a system using GNU awk, the output will identify it as GNU Awk.

---

# 7. AWK Script Files

Instead of writing an AWK program directly on the command line, you can store it in a script file.

For example:

```text
script.awk
```

Contents:

```awk
{
    print $1
}
```

Run it using:

```bash
awk -f script.awk file.txt
```

The `-f` option tells AWK to read the program from a file.

---

# 8. AWK Shebang

An AWK script can also have a shebang:

```awk
#!/usr/bin/awk -f

{
    print $1
}
```

Make it executable:

```bash
chmod +x script.awk
```

Then execute it:

```bash
./script.awk file.txt
```

The shebang tells Linux which interpreter should execute the script.

---

# 9. Multiple BEGIN and END Blocks

AWK allows multiple `BEGIN` and `END` blocks.

Example:

```awk
BEGIN {
    print "BEGIN 1"
}

BEGIN {
    print "BEGIN 2"
}

{
    print $1
}

END {
    print "END 1"
}

END {
    print "END 2"
}
```

The blocks execute in the order in which they appear.

Output:

```text
BEGIN 1
BEGIN 2
...
END 1
END 2
```

Therefore, **order matters** when using multiple `BEGIN` or `END` blocks.

---

# 10. AWK Fields

AWK provides special variables for accessing fields.

Consider:

```text
Alice 25 50000
```

AWK represents this as:

```text
$0 → Alice 25 50000
$1 → Alice
$2 → 25
$3 → 50000
```

## `$0` — Entire Record

`$0` represents the entire current record.

```bash
awk '{print $0}' file.txt
```

This prints the complete input record.

---

## `$1` — First Field

```bash
awk '{print $1}' file.txt
```

---

## `$2` — Second Field

```bash
awk '{print $2}' file.txt
```

---

## `$NF` — Last Field

`NF` contains the number of fields.

Therefore:

```text
$NF
```

means:

> The value of the last field.

Example:

```text
Alice 25 50000
Bob 30 60000
```

Command:

```bash
awk '{print $NF}' file.txt
```

Output:

```text
50000
60000
```

---

# 11. Built-in Variables in AWK

AWK provides many built-in variables that make text processing easier.

---

## ARGC

`ARGC` contains the number of command-line arguments passed to the AWK program.

Example:

```bash
echo "hello world" | awk 'END {print ARGC}'
```

Output:

```text
1
```

Note that AWK's argument handling includes the arguments in `ARGV`, and the exact count depends on how the command is invoked.

---

## ARGV

`ARGV` is an array containing the command-line arguments passed to AWK.

Example:

```bash
awk 'BEGIN {
    for (i in ARGV)
        print ARGV[i]
}' file1 file2
```

Possible output:

```text
awk
file1
file2
```

`ARGV` is indexed starting from `0`.

---

## ENVIRON

`ENVIRON` is an array containing environment variables.

Example:

```bash
awk 'BEGIN {
    print ENVIRON["HOME"]
}'
```

This prints the value of the `HOME` environment variable.

For example:

```text
/home/user
```

---

## FILENAME

`FILENAME` contains the name of the current input file.

Example:

```bash
awk '{print FILENAME}' file1 file2
```

Possible output:

```text
file1
file1
file2
file2
```

This is useful when processing multiple files.

---

## FNR

`FNR` is the current record number **within the current input file**.

Example:

```bash
awk '{print FNR, $0}' file1 file2
```

If each file contains:

```text
Alice
Bob
```

The output is:

```text
1 Alice
2 Bob
1 Alice
2 Bob
```

The numbering resets when AWK moves to the next file.

---

## NR

`NR` is the current record number across **all input files**.

Example:

```bash
awk '{print NR, $0}' file1 file2
```

Output:

```text
1 Alice
2 Bob
3 Charlie
4 David
```

Unlike `FNR`, `NR` does not reset between files.

### FNR vs NR

| Variable | Meaning |
|---|---|
| `FNR` | Record number within the current file |
| `NR` | Record number across all input files |

---

## FS

`FS` stands for **Field Separator**.

It tells AWK how to divide each record into fields.

The default field separator is whitespace.

For comma-separated data:

```bash
awk 'BEGIN {FS=","} {print $1}' file.csv
```

For example:

```text
Alice,25,50000
Bob,30,60000
```

Output:

```text
Alice
Bob
```

---

## NF

`NF` stands for **Number of Fields**.

Example:

```bash
awk '{print NF}' file.txt
```

Input:

```text
Alice 25 50000
Bob 30 60000
```

Output:

```text
3
3
```

`NF` is also useful for accessing the last field:

```awk
$NF
```

---

## OFMT

`OFMT` stands for **Output Format**.

It controls the formatting of numbers when AWK converts them to strings for output.

Example:

```bash
awk 'BEGIN {
    OFMT="%.3f"
    print 10/3
}'
```

Output:

```text
3.333
```

---

## OFS

`OFS` stands for **Output Field Separator**.

The default value is a space.

Example:

```bash
awk 'BEGIN {
    OFS=","
}
{
    print $1, $2
}' file.txt
```

If the input is:

```text
Alice 25
Bob 30
```

Output:

```text
Alice,25
Bob,30
```

Important:

```awk
print $1, $2
```

uses `OFS` between the fields.

---

## ORS

`ORS` stands for **Output Record Separator**.

The default is:

```text
\n
```

Example:

```bash
awk 'BEGIN {
    ORS="\n\n"
}
{
    print $0
}' file.txt
```

This inserts an additional blank line between output records.

---

## RS

`RS` stands for **Record Separator**.

The default record separator is:

```text
\n
```

Example:

```bash
awk 'BEGIN {
    RS=","
}
{
    print $0
}' file.txt
```

This tells AWK to treat commas as record separators.

---

## RSTART

`RSTART` contains the starting position of the most recent successful `match()`.

Example:

```bash
awk 'BEGIN {
    match("hello world", /world/)
    print RSTART
}'
```

Output:

```text
7
```

Because `world` starts at character position `7`.

---

## RLENGTH

`RLENGTH` contains the length of the string matched by `match()`.

Example:

```bash
awk 'BEGIN {
    match("hello world", /world/)
    print RLENGTH
}'
```

Output:

```text
5
```

Because:

```text
world
```

contains five characters.

### RSTART and RLENGTH

For:

```awk
match("hello world", /world/)
```

we get:

```text
RSTART  = 7
RLENGTH = 5
```

---

## SUBSEP

`SUBSEP` is used internally by AWK when multiple array subscripts are combined.

Example:

```bash
awk 'BEGIN {
    a["hello","world"] = 1
    print a["hello","world"]
}'
```

Output:

```text
1
```

AWK internally represents a multidimensional-style index using `SUBSEP`.

---

# 12. Important AWK Variables — Quick Reference

| Variable | Meaning |
|---|---|
| `ARGC` | Number of command-line arguments |
| `ARGV` | Array of command-line arguments |
| `ENVIRON` | Environment variables |
| `FILENAME` | Current input filename |
| `FNR` | Current record number in current file |
| `FS` | Input field separator |
| `NF` | Number of fields |
| `NR` | Current record number across files |
| `OFMT` | Numeric output format |
| `OFS` | Output field separator |
| `ORS` | Output record separator |
| `RS` | Input record separator |
| `RSTART` | Starting position of last `match()` |
| `RLENGTH` | Length of last `match()` |
| `SUBSEP` | Array subscript separator |
| `$0` | Entire current record |
| `$1`, `$2`, ... | Individual fields |
| `$NF` | Last field |

---

# 13. Pattern Matching in AWK

AWK can select records based on patterns.

Basic structure:

```awk
pattern {
    action
}
```

Example:

```bash
awk '$3 > 50000 {print $1, $3}' employees.txt
```

This prints employees whose third field is greater than `50000`.

---

## String Pattern

```bash
awk '$1 == "Alice" {print $0}' employees.txt
```

---

## Regular Expression Pattern

```bash
awk '$1 ~ /Alice/ {print $0}' employees.txt
```

The `~` operator means:

> Matches the regular expression.

---

## Negative Regular Expression Match

The `!~` operator means:

> Does not match the regular expression.

Example:

```bash
awk '$1 !~ /Alice/ {print $0}' employees.txt
```

---

# 14. Types of AWK Blocks

AWK programs commonly use:

### BEGIN

Runs once before input processing.

```awk
BEGIN {
    print "Start"
}
```

### Pattern-Action

Runs for matching input records.

```awk
$3 > 50000 {
    print $1
}
```

### END

Runs once after input processing.

```awk
END {
    print "Finished"
}
```

---

# 15. AWK Operators

AWK supports several categories of operators.

## Arithmetic Operators

```text
+     Addition
-     Subtraction
*     Multiplication
/     Division
%     Modulus
^     Exponentiation
```

Example:

```bash
awk 'BEGIN {
    print 10 + 5
    print 10 - 5
    print 10 * 5
    print 10 / 5
    print 10 % 3
    print 2 ^ 3
}'
```

---

## Comparison Operators

```text
==    Equal
!=    Not equal
>     Greater than
<     Less than
>=    Greater than or equal
<=    Less than or equal
```

Example:

```bash
awk '$3 >= 50000 {print $1}' employees.txt
```

---

## Logical Operators

```text
&&    AND
||    OR
!     NOT
```

Example:

```bash
awk '$2 > 25 && $3 > 50000 {print $1}' employees.txt
```

---

# 16. Ternary Operator

AWK supports the ternary operator:

```text
condition ? value_if_true : value_if_false
```

Example:

```bash
awk '{
    result = ($3 >= 50000) ? "High" : "Low"
    print $1, result
}' employees.txt
```

If salary is at least `50000`:

```text
Alice High
```

Otherwise:

```text
Bob Low
```

---

# 17. Array Membership Operator

AWK uses the `in` operator to check whether an index exists in an array.

Example:

```awk
if ("Alice" in employees)
    print "Alice exists"
```

Complete example:

```bash
awk 'BEGIN {
    employees["Alice"] = 50000
    employees["Bob"] = 60000

    if ("Alice" in employees)
        print "Alice exists"
}'
```

Output:

```text
Alice exists
```

---

# 18. Regular Expression Operators

AWK provides:

```text
~     Matches regular expression
!~    Does not match regular expression
```

Example:

```bash
awk '$1 ~ /^A/ {print $1}' employees.txt
```

This prints fields beginning with `A`.

Another example:

```bash
awk '$1 !~ /^A/ {print $1}' employees.txt
```

This prints fields that do not begin with `A`.

---

# 19. Built-in AWK Functions

AWK includes many built-in functions for:

- String manipulation
- Searching
- Replacement
- Case conversion
- Mathematical operations
- Splitting strings

Common functions include:

```text
length()
substr()
index()
tolower()
toupper()
split()
gsub()
sub()
match()
```

---

# 20. Regular Expressions in an AWK Action

Regular expressions can be used directly inside an action.

Example:

```bash
awk '{
    if ($1 ~ /^[A-Z]/)
        print $1
}' employees.txt
```

This checks whether the first field begins with an uppercase letter.

Another example:

```bash
awk '{
    if ($2 ~ /^[0-9]+$/)
        print "Numeric:", $2
}' file.txt
```

---

# 21. Matching a Particular Field

A regular expression can be applied to a specific field.

For example:

```bash
awk '$2 ~ /^[0-9]+$/ {print $0}' file.txt
```

This selects records where the second field contains only digits.

Example input:

```text
Alice 25
Bob 30
Charlie abc
```

Command:

```bash
awk '$2 ~ /^[0-9]+$/ {print $0}' file.txt
```

Output:

```text
Alice 25
Bob 30
```

---

# 22. Matching Multiple Conditions

AWK allows multiple conditions.

Example:

```bash
awk '$2 >= 25 && $3 >= 50000 {
    print $1, $2, $3
}' employees.txt
```

This selects records where:

- Field 2 is at least `25`
- AND field 3 is at least `50000`

Using OR:

```bash
awk '$2 >= 30 || $3 >= 100000 {
    print $0
}' employees.txt
```

This selects records satisfying either condition.

---

# 23. Practical Example

Suppose `employees.txt` contains:

```text
Alice 25 50000
Bob 30 60000
Charlie 28 45000
David 35 90000
```

Print names:

```bash
awk '{print $1}' employees.txt
```

Output:

```text
Alice
Bob
Charlie
David
```

Print names and salaries:

```bash
awk '{print $1, $3}' employees.txt
```

Print employees earning at least `50000`:

```bash
awk '$3 >= 50000 {print $1, $3}' employees.txt
```

Print the number of fields:

```bash
awk '{print NF}' employees.txt
```

Print record number and name:

```bash
awk '{print NR, $1}' employees.txt
```

Print the last field:

```bash
awk '{print $NF}' employees.txt
```

---

# 24. AWK Mental Model

The most important mental model is:

```text
                    AWK
                     │
             ┌───────┴───────┐
             │               │
           BEGIN          Input Records
             │               │
             │        ┌──────┴──────┐
             │        │             │
             │      Pattern       Action
             │        │             │
             │        └──────┬──────┘
             │               │
             │          Process each
             │            record
             │               │
             └───────────────┤
                             ↓
                            END
```

Remember:

```text
BEGIN  → Before reading input
$0     → Entire record
$1     → First field
$NF    → Last field
NF     → Number of fields
NR     → Record number across files
FNR    → Record number within current file
FS     → Input field separator
OFS    → Output field separator
RS     → Input record separator
ORS    → Output record separator
END    → After reading all input
```

The core AWK pattern is:

```awk
pattern {
    action
}
```

And the complete structure is:

```awk
BEGIN {
    initialization
}

pattern {
    processing
}

END {
    finalization
}
```
