---
layout: default
title: "9.2 - AWK Programming Part 2"
---

# 9.2 - AWK Programming Part 2


# AWK Arrays, Loops, Functions, Formatting, and Advanced File Processing

## 1. Arrays in AWK

AWK supports **associative arrays**.

Unlike arrays in languages such as C or Java, AWK arrays:

- Use keys instead of requiring integer indexes.
- Can use strings as indexes.
- Are **sparse**, meaning unused indexes do not need to exist.
- Store values using key-value pairs.

The basic syntax is:

```awk
arr[index] = value
```

Example:

```awk
BEGIN {
    salary["Alice"] = 50000
    salary["Bob"] = 60000
    salary["Charlie"] = 55000

    print salary["Alice"]
}
```

Output:

```text
50000
```

Here:

```text
Key       Value
----------------
Alice     50000
Bob       60000
Charlie   55000
```

---

# 2. Creating an Array Element

The basic syntax is:

```awk
arr[index] = value
```

Example:

```awk
BEGIN {
    arr["name"] = "Alice"
    arr["age"] = 25
    arr["city"] = "Delhi"

    print arr["name"]
    print arr["age"]
    print arr["city"]
}
```

Output:

```text
Alice
25
Delhi
```

The index does not have to be an integer.

For example:

```awk
arr[1] = "one"
arr[1000] = "thousand"
arr["hello"] = "world"
arr["employee"] = "Alice"
```

All of these are valid.

---

# 3. Iterating Through an AWK Array

AWK provides:

```awk
for (var in arr)
```

to iterate over array elements.

Example:

```bash
awk 'BEGIN {
    salary["Alice"] = 50000
    salary["Bob"] = 60000
    salary["Charlie"] = 55000

    for (name in salary)
        print name, salary[name]
}'
```

Possible output:

```text
Bob 60000
Alice 50000
Charlie 55000
```

> The order of iteration of an associative array should not be assumed to be sorted.

---

# 4. Checking Array Membership

Use the `in` operator:

```awk
if (index in arr)
    print "Exists"
```

Example:

```bash
awk 'BEGIN {
    salary["Alice"] = 50000

    if ("Alice" in salary)
        print "Alice exists"

    if ("Bob" in salary)
        print "Bob exists"
}'
```

Output:

```text
Alice exists
```

---

# 5. Deleting an Array Element

Use:

```awk
delete arr[index]
```

Example:

```bash
awk 'BEGIN {
    salary["Alice"] = 50000
    salary["Bob"] = 60000

    delete salary["Alice"]

    for (name in salary)
        print name, salary[name]
}'
```

Output:

```text
Bob 60000
```

`delete` removes the specified array element.

---

# 6. Types of Loops in AWK

AWK supports several programming constructs for repetition and decision-making.

Common constructs include:

```text
for
while
do-while
C-style for
if
if-else
if-else-if
switch
```

---

# 7. `for` Loop

The general form is:

```awk
for (var in array) {
    statements
}
```

Example:

```awk
BEGIN {
    names["a"] = "Alice"
    names["b"] = "Bob"

    for (i in names)
        print names[i]
}
```

This form is especially useful for associative arrays.

---

# 8. C-style `for` Loop

AWK also supports the familiar C-style loop:

```awk
for (initialization; condition; increment) {
    statements
}
```

Example:

```bash
awk 'BEGIN {
    for (i = 1; i <= 5; i++)
        print i
}'
```

Output:

```text
1
2
3
4
5
```

Another example:

```bash
awk 'BEGIN {
    for (i = 10; i >= 1; i--)
        print i
}'
```

---

# 9. `while` Loop

Syntax:

```awk
while (condition) {
    statements
}
```

Example:

```bash
awk 'BEGIN {
    i = 1

    while (i <= 5) {
        print i
        i++
    }
}'
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

# 10. `do-while` Loop

Syntax:

```awk
do {
    statements
} while (condition)
```

The body executes **at least once**.

Example:

```bash
awk 'BEGIN {
    i = 1

    do {
        print i
        i++
    } while (i <= 5)
}'
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

# 11. `if` Statement

Syntax:

```awk
if (condition) {
    statements
}
```

Example:

```bash
awk '{
    if ($3 >= 50000)
        print $1, "High Salary"
}' employees.txt
```

---

# 12. `if-else`

Syntax:

```awk
if (condition) {
    statements
}
else {
    statements
}
```

Example:

```bash
awk '{
    if ($3 >= 50000)
        print $1, "High"
    else
        print $1, "Low"
}' employees.txt
```

---

# 13. `if-else-if`

Multiple conditions can be checked using:

```awk
if (condition1) {
    ...
}
else if (condition2) {
    ...
}
else {
    ...
}
```

Example:

```bash
awk '{
    if ($3 >= 80000)
        print $1, "Excellent"
    else if ($3 >= 50000)
        print $1, "Good"
    else
        print $1, "Low"
}' employees.txt
```

---

# 14. `switch` Statement

Modern AWK implementations such as GNU awk support `switch`.

Syntax:

```awk
switch (expression) {
    case value:
        statements
        break

    case value:
        statements
        break

    default:
        statements
}
```

Example:

```bash
awk 'BEGIN {
    day = "Monday"

    switch (day) {
        case "Monday":
            print "Start of week"
            break

        case "Friday":
            print "Almost weekend"
            break

        default:
            print "Regular day"
    }
}'
```

Output:

```text
Start of week
```

---

# 15. Payroll Management System Using AWK

AWK can be used to build small text-file-based management systems.

Suppose `employees.txt` contains:

```text
101 Alice 30000
102 Bob 45000
103 Charlie 55000
104 David 70000
```

Fields:

```text
$1 → Employee ID
$2 → Name
$3 → Basic Salary
```

We can calculate a payroll amount.

Example:

```awk
{
    basic = $3
    hra = basic * 0.20
    da = basic * 0.10
    gross = basic + hra + da

    printf "%-5s %-10s %10.2f %10.2f %10.2f\n",
           $1, $2, basic, hra, gross
}
```

Run it:

```bash
awk -f payroll.awk employees.txt
```

A more complete script:

```awk
#!/usr/bin/awk -f

BEGIN {
    printf "%-5s %-10s %10s %10s %10s\n",
           "ID", "Name", "Basic", "HRA", "Gross"
    print "---------------------------------------------"
}

{
    basic = $3
    hra = basic * 0.20
    da = basic * 0.10
    gross = basic + hra + da

    printf "%-5s %-10s %10.2f %10.2f %10.2f\n",
           $1, $2, basic, hra, gross
}

END {
    print "---------------------------------------------"
}
```

This demonstrates that AWK is more than a simple column-extraction tool. It can perform calculations and generate reports.

---

# 16. User-Defined Functions

AWK allows you to define your own functions.

Syntax:

```awk
function function_name(parameters) {
    statements
}
```

Example:

```awk
function square(x) {
    return x * x
}

BEGIN {
    print square(5)
}
```

Output:

```text
25
```

---

# 17. Function Libraries

Functions can be stored in a separate file.

For example:

```text
lib.awk
```

```awk
function square(x) {
    return x * x
}

function cube(x) {
    return x * x * x
}
```

Then create:

```text
script.awk
```

```awk
BEGIN {
    print square(5)
    print cube(3)
}
```

Run both files:

```bash
awk -f lib.awk -f script.awk
```

Output:

```text
25
27
```

This allows reusable AWK functions to be separated from the main program.

---

# 18. `printf` in AWK

`printf` provides formatted output.

Unlike `print`, `printf` does not automatically add a newline.

Example:

```bash
awk 'BEGIN {
    printf "Hello\n"
}'
```

---

## Formatting Strings

```bash
awk 'BEGIN {
    printf "%s\n", "Hello"
}'
```

`%s` is used for strings.

---

## Formatting Integers

```bash
awk 'BEGIN {
    printf "%d\n", 25
}'
```

`%d` is used for integers.

---

## Formatting Floating-Point Numbers

```bash
awk 'BEGIN {
    printf "%.2f\n", 10 / 3
}'
```

Output:

```text
3.33
```

---

# 19. Width and Alignment with `printf`

Example:

```bash
awk 'BEGIN {
    printf "%-10s %10s\n", "Name", "Salary"
    printf "%-10s %10.2f\n", "Alice", 50000
    printf "%-10s %10.2f\n", "Bob", 60000
}'
```

Possible output:

```text
Name           Salary
Alice        50000.00
Bob          60000.00
```

Common format specifiers:

```text
%s       String
%d       Integer
%f       Floating-point number
%.2f     Floating-point with 2 decimal places
%-10s    Left-aligned string of width 10
%10s     Right-aligned string of width 10
```

---

# 20. AWK as a Programming Language

AWK is not limited to text filtering.

It supports:

- Variables
- Arrays
- Loops
- Conditions
- Functions
- Regular expressions
- Arithmetic
- String manipulation
- File processing
- Command execution

Therefore, AWK can be used as a small programming language for system administration and data processing.

---

# 21. Generating Random Numbers

AWK provides the `rand()` function.

Example:

```bash
awk 'BEGIN {
    print rand()
}'
```

It produces a pseudo-random floating-point number between `0` and `1`.

To generate a number between `1` and `100`:

```bash
awk 'BEGIN {
    print int(rand() * 100) + 1
}'
```

Possible output:

```text
73
```

---

# 22. Seeding Random Numbers

AWK provides `srand()` to seed the random-number generator.

Example:

```bash
awk 'BEGIN {
    srand()
    print int(rand() * 100) + 1
}'
```

Calling `srand()` without an argument typically uses a time-dependent seed.

You can provide a specific seed:

```bash
awk 'BEGIN {
    srand(42)
    print rand()
}'
```

Using the same seed can produce a reproducible sequence.

---

# 23. Comments in AWK

AWK uses `#` for comments.

Example:

```awk
# This is an AWK comment

BEGIN {
    # Initialize the counter
    count = 0
}

{
    # Process every record
    count++
}

END {
    print count
}
```

Comments are ignored by AWK.

---

# 24. Processing Million-Line Files

AWK is designed for efficient sequential text processing.

For a very large file:

```bash
awk '{print $1}' huge.log
```

AWK processes records sequentially instead of requiring the entire file to be loaded into memory.

Conceptually:

```text
Huge File
    ↓
Record 1 → Process
Record 2 → Process
Record 3 → Process
...
Record 1,000,000 → Process
```

This makes AWK useful for:

- Large log files
- Server logs
- Data exports
- CSV-like files
- System administration
- ETL-style processing

---

# 25. AWK vs Spreadsheet Applications

Spreadsheet applications are convenient for interactive analysis, but they are not designed to be the ideal tool for every extremely large text-processing task.

AWK can process very large text files using streaming, record-by-record processing.

For example:

```bash
awk '$3 > 50000 {print $1, $3}' huge_file.txt
```

This can filter records without opening the complete file in a spreadsheet.

The key advantage is:

```text
Large Text File
      ↓
   AWK reads
 one record at a time
      ↓
 Process
      ↓
 Output
```

---

# 26. Processing Web Server Logs

AWK is particularly useful for analyzing web server logs.

Suppose a log contains:

```text
192.168.1.10 - - [08/Sep/2026:10:15:20 +0530] "GET /index.html HTTP/1.1" 200 1024
192.168.1.20 - - [08/Sep/2026:10:16:10 +0530] "GET /login HTTP/1.1" 200 2048
192.168.1.10 - - [08/Sep/2026:10:17:05 +0530] "GET /about HTTP/1.1" 404 512
```

The first field is the IP address.

Extract IP addresses:

```bash
awk '{print $1}' access.log
```

Count requests:

```bash
awk '{count[$1]++} END {
    for (ip in count)
        print ip, count[ip]
}' access.log
```

This creates an associative array where:

```text
count[IP] = number of requests
```

---

# 27. Get the First Field of Each Line

The simplest form is:

```bash
awk '{print $1}' file.txt
```

Example:

```text
Alice 25 50000
Bob 30 60000
Charlie 28 55000
```

Command:

```bash
awk '{print $1}' file.txt
```

Output:

```text
Alice
Bob
Charlie
```

---

# 28. `substr()` Function

`substr()` extracts part of a string.

Syntax:

```awk
substr(string, start, length)
```

Example:

```bash
awk 'BEGIN {
    print substr("HelloWorld", 1, 5)
}'
```

Output:

```text
Hello
```

Another example:

```bash
awk 'BEGIN {
    text = "ABCDEFGHIJ"
    print substr(text, 3, 4)
}'
```

Output:

```text
CDEF
```

The first character has position `1`.

---

# 29. `substr()` Without Length

The length argument can be omitted.

Syntax:

```awk
substr(string, start)
```

Example:

```bash
awk 'BEGIN {
    print substr("HelloWorld", 6)
}'
```

Output:

```text
World
```

---

# 30. Getting a Date from the Shell

The Linux `date` command can calculate relative dates.

For example:

```bash
date --date="5 days ago" +%d/%m/%Y
```

Possible output:

```text
03/09/2026
```

The exact result depends on the current date.

The format:

```text
%d/%m/%Y
```

means:

```text
%d → Day
%m → Month
%Y → Four-digit year
```

---

# 31. `sprintf()` Function

`sprintf()` formats a value and **returns the formatted string**.

Unlike `printf`, it does not directly print the result.

Syntax:

```awk
variable = sprintf(format, values)
```

Example:

```bash
awk 'BEGIN {
    salary = 50000
    result = sprintf("%.2f", salary)
    print result
}'
```

Output:

```text
50000.00
```

---

# 32. `sprintf()` vs `printf`

### `printf`

Prints formatted output:

```awk
printf "%.2f\n", 10 / 3
```

### `sprintf`

Creates a formatted string:

```awk
x = sprintf("%.2f", 10 / 3)
```

Then:

```awk
print x
```

So:

```text
printf  → format and print
sprintf → format and store
```

---

# 33. `getline`

AWK can execute an external command and read its output.

The basic form is:

```awk
cmd | getline var
```

Example:

```bash
awk 'BEGIN {
    cmd = "date"
    cmd | getline current_date
    close(cmd)

    print current_date
}'
```

Here:

```text
cmd
 ↓
External command
 ↓
getline
 ↓
current_date
```

The command output is stored in:

```text
current_date
```

---

# 34. Why `close()` Matters

When using:

```awk
cmd | getline var
```

it is good practice to close the command when finished:

```awk
close(cmd)
```

Example:

```bash
awk 'BEGIN {
    cmd = "date"
    cmd | getline result
    close(cmd)

    print result
}'
```

This is especially important when repeatedly opening external commands.

---

# 35. `match()` Function

The `match()` function searches a string using a regular expression.

Syntax:

```awk
match(string, regexp)
```

Example:

```bash
awk 'BEGIN {
    position = match("hello world", /world/)
    print position
}'
```

Output:

```text
7
```

`match()` also sets:

```text
RSTART
RLENGTH
```

For example:

```bash
awk 'BEGIN {
    text = "hello world"

    match(text, /world/)

    print "Start:", RSTART
    print "Length:", RLENGTH
}'
```

Output:

```text
Start: 7
Length: 5
```

---

# 36. Using `match()` to Extract Information

Example:

```bash
awk 'BEGIN {
    text = "ID=12345"

    if (match(text, /[0-9]+/)) {
        print substr(text, RSTART, RLENGTH)
    }
}'
```

Output:

```text
12345
```

The process is:

```text
match()
   ↓
RSTART + RLENGTH
   ↓
substr()
   ↓
Extract matched text
```

---

# 37. `sort` Command

The Linux `sort` command sorts lines of text.

Basic usage:

```bash
sort file.txt
```

For numeric sorting, use:

```bash
sort -n file.txt
```

Example:

```text
50
10
30
20
```

Command:

```bash
sort -n numbers.txt
```

Output:

```text
10
20
30
50
```

---

# 38. Reverse Sorting

Use:

```bash
sort -r file.txt
```

For numeric reverse sorting:

```bash
sort -nr file.txt
```

Example:

```text
50
10
30
20
```

Command:

```bash
sort -nr numbers.txt
```

Output:

```text
50
30
20
10
```

---

# 39. AWK + Sort

AWK and `sort` can be combined.

Suppose:

```text
Alice 50000
Bob 70000
Charlie 45000
David 90000
```

Sort by salary numerically:

```bash
awk '{print $2, $1}' employees.txt | sort -n
```

Output:

```text
45000 Charlie
50000 Alice
70000 Bob
90000 David
```

Reverse:

```bash
awk '{print $2, $1}' employees.txt | sort -nr
```

Output:

```text
90000 David
70000 Bob
50000 Alice
45000 Charlie
```

---

# 40. `dig` Command

`dig` is a DNS lookup utility.

It can be used to find the IP address associated with a domain.

Example:

```bash
dig example.com
```

A shorter answer can be obtained with:

```bash
dig +short example.com
```

Possible output:

```text
93.184.216.34
```

---

# 41. Reverse DNS Lookup with `dig -x`

The `-x` option performs a reverse DNS lookup.

It attempts to find the domain name associated with an IP address.

Example:

```bash
dig -x 8.8.8.8
```

---

# 42. `dig +noall +answer`

DNS output can contain a lot of information.

To display only the answer section:

```bash
dig +noall +answer example.com
```

For reverse lookup:

```bash
dig +noall +answer -x 8.8.8.8
```

This produces a concise answer containing the relevant DNS record.

---

# 43. Useful AWK + Linux Tool Combination

AWK becomes particularly powerful when combined with standard Unix utilities.

Examples:

```bash
awk '{print $1}' access.log | sort | uniq
```

```bash
awk '{print $1}' access.log | sort | uniq -c
```

```bash
awk '{print $1}' access.log | sort | uniq -c | sort -nr
```

The last pipeline can be used to identify the most frequent IP addresses.

Conceptually:

```text
access.log
    ↓
awk
Extract IP
    ↓
sort
Group identical values
    ↓
uniq -c
Count values
    ↓
sort -nr
Rank by frequency
```

---

# 44. Important Concepts to Remember

```text
AWK Arrays
    arr[index] = value
    for (var in arr)
    delete arr[index]
    index in arr

Loops
    for
    while
    do-while
    C-style for

Conditions
    if
    if-else
    if-else-if
    switch

Functions
    function name(args) { ... }
    return value

Formatting
    printf
    sprintf

Random Numbers
    rand()
    srand()

String Processing
    substr()
    match()

External Commands
    command | getline variable
    close(command)

Large Files
    Process records sequentially

Linux Integration
    awk + sort
    awk + uniq
    awk + date
    awk + dig
```

---

# 45. AWK Programming Mental Model

AWK can be viewed as a small programming language sitting between shell commands and larger programming languages.

```text
                 AWK
                  │
       ┌──────────┼──────────┐
       │          │          │
    Records     Fields     Patterns
       │          │          │
       └──────────┼──────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
     Variables           Arrays
        │                   │
        ├───────┐     ┌─────┤
        │       │     │     │
      Loops    If    Add   Delete
        │       │     │
        └───────┴─────┘
                │
             Functions
                │
        ┌───────┴────────┐
        │                │
     printf           sprintf
        │                │
        └───────┬────────┘
                │
          External Commands
                │
             getline
```

The key idea is:

> **AWK can treat text as structured data and combine fields, patterns, arrays, loops, functions, and external commands to perform sophisticated processing directly from the command line or from scripts.**
