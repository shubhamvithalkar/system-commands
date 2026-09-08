---
layout: default
title: "L 5.2 - Shell Variables - Part 1"
---

# L 5.2 - Shell Variables - Part 1



# Bash Variables

Variables are one of the most important building blocks of shell scripting.

A variable allows us to store a value and use that value later.

For example:

```bash
name="Shubham"
echo "$name"
```

Output:

```text
Shubham
```

Bash also provides powerful **parameter expansion** features that allow us to:

- test whether variables exist
- provide default values
- display error messages
- calculate string length
- extract substrings
- remove matching patterns
- replace matching patterns
- change case
- work with arrays
- export variables to child shells
- capture command output

---

# 1. Basic Rules for Variables

## 1.1 Creating a Variable

Basic syntax:

```bash
variable=value
```

Example:

```bash
name=Shubham
age=27
city=Bilaspur
```

Use the variable with `$`:

```bash
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

## 1.2 No Spaces Around `=`

This is correct:

```bash
name=Shubham
```

This is incorrect:

```bash
name = Shubham
```

Why?

Bash interprets:

```bash
name=Shubham
```

as:

```text
variable → name
value    → Shubham
```

But:

```bash
name = Shubham
```

is interpreted as a command named `name` with arguments `=` and `Shubham`.

---

## 1.3 Variable Names

Variable names can contain:

- letters
- numbers
- underscore `_`

But a variable name cannot normally begin with a number.

Valid:

```bash
name="Alice"
student_name="Bob"
age2=20
_value=100
```

Invalid:

```bash
2name="Alice"
student-name="Alice"
```

Hyphen `-` is not valid in normal Bash variable names.

---

# 2. Variables Can Store Strings

Bash variables do not have the same strict type system as Python variables.

For example:

```bash
x=100
y="hello"
z="100"
```

These are shell variables whose values are represented as text.

You can write:

```bash
echo "$x"
echo "$y"
echo "$z"
```

Output:

```text
100
hello
100
```

---

# 3. Quoting Variables

Prefer quoting variable expansions:

```bash
echo "$name"
```

instead of:

```bash
echo $name
```

This becomes especially important when the value contains spaces.

Example:

```bash
name="John Doe"
```

Then:

```bash
echo "$name"
```

correctly treats the value as one argument.

Quoting is especially important in commands such as:

```bash
rm "$file"
cp "$source" "$destination"
```

---

# 4. Exporting a Variable

Normally, a variable belongs to the current shell.

Example:

```bash
name="Shubham"
```

The current shell knows about `name`.

But child processes do not automatically inherit ordinary shell variables.

To make a variable available through the environment:

```bash
export name
```

Or create and export it in one step:

```bash
export name="Shubham"
```

---

# 5. Shell Variable vs Environment Variable

Think of it like this:

```text
Current Shell
│
├── normal shell variables
│
└── exported environment variables
          │
          ↓
      Child Process
```

A normal variable:

```bash
name="Shubham"
```

exists in the current shell.

An exported variable:

```bash
export name="Shubham"
```

is passed through the environment to child processes.

---

# 6. Using a Variable

Create:

```bash
name="Shubham"
```

Use:

```bash
echo "$name"
```

You can use variables inside larger strings:

```bash
echo "Hello $name"
```

Output:

```text
Hello Shubham
```

Variables can also be used in commands:

```bash
directory="$HOME/projects"
cd "$directory"
```

---

# 7. Removing a Variable

Use `unset`:

```bash
unset name
```

After this:

```bash
echo "$name"
```

normally produces an empty string.

You can verify whether it is set using:

```bash
declare -p name
```

If it doesn't exist, Bash reports an error.

---

# 8. Test Whether a Variable Is Set

Bash parameter expansion provides a very useful test.

Consider:

```bash
name="Shubham"
```

To check whether it is set:

```bash
if [[ -v name ]]; then
    echo "name is set"
else
    echo "name is not set"
fi
```

Output:

```text
name is set
```

Now:

```bash
unset name
```

Then:

```bash
if [[ -v name ]]; then
    echo "name is set"
else
    echo "name is not set"
fi
```

Output:

```text
name is not set
```

---

# 9. Set vs Empty Variable

There is an important difference between:

```bash
unset name
```

and:

```bash
name=""
```

In the first case:

```text
name → not set
```

In the second:

```text
name → set, but empty
```

Test:

```bash
unset name
[[ -v name ]] && echo "set"
```

No output.

Now:

```bash
name=""
[[ -v name ]] && echo "set"
```

Output:

```text
set
```

This distinction becomes important with parameter expansion.

---

# 10. Default Value if Variable Is Unset or Empty

One of the most useful Bash parameter expansions is:

```bash
${var:-default}
```

Meaning:

> If `var` is unset OR empty, use `default`.

Example:

```bash
unset name

echo "${name:-Guest}"
```

Output:

```text
Guest
```

Now:

```bash
name="Shubham"

echo "${name:-Guest}"
```

Output:

```text
Shubham
```

---

# 11. `:-` — Substitute a Default Value

Syntax:

```bash
${variable:-word}
```

Meaning:

```text
if variable is unset or empty
        ↓
use word

otherwise
        ↓
use variable's value
```

Example:

```bash
username="${USER:-unknown}"
echo "$username"
```

If `$USER` exists:

```text
shubham
```

If it is unset or empty:

```text
unknown
```

---

# 12. `-` vs `:-`

There is a subtle difference.

### `${var-word}`

Uses `word` only if the variable is **unset**.

### `${var:-word}`

Uses `word` if the variable is **unset OR empty**.

Example:

```bash
name=""
```

Then:

```bash
echo "${name-default}"
```

produces an empty value.

But:

```bash
echo "${name:-default}"
```

produces:

```text
default
```

This distinction is frequently tested in shell questions.

---

# 13. Assign a Default Value If Variable Is Not Set

Use:

```bash
${var:=default}
```

Example:

```bash
unset name

echo "${name:=Guest}"
```

Output:

```text
Guest
```

But this does something different from `:-`.

It **assigns** the value to the variable.

Check:

```bash
echo "$name"
```

Output:

```text
Guest
```

Mental model:

```text
${name:-Guest}
       ↓
temporary substitution

${name:=Guest}
       ↓
substitution + assignment
```

---

# 14. Example of `:=`

Start with:

```bash
unset directory
```

Then:

```bash
echo "${directory:=/tmp}"
```

Output:

```text
/tmp
```

Now:

```bash
echo "$directory"
```

Output:

```text
/tmp
```

The variable was actually assigned.

---

# 15. Reset Variable If Already Set

You can force a variable to be assigned a value using:

```bash
${var:=value}
```

For example:

```bash
name="Alice"

echo "${name:=Bob}"
```

Output:

```text
Alice
```

Because `name` was already set and non-empty.

Therefore:

```bash
echo "$name"
```

still gives:

```text
Alice
```

If you actually want to overwrite an existing variable, use normal assignment:

```bash
name="Bob"
```

Then:

```bash
echo "$name"
```

Output:

```text
Bob
```

---

# 16. `:+` — Use Substitute Value Only If Set and Non-Empty

Another useful form is:

```bash
${var:+word}
```

Meaning:

> If `var` is set and non-empty, use `word`; otherwise use an empty value.

Example:

```bash
name="Shubham"

echo "${name:+User exists}"
```

Output:

```text
User exists
```

Now:

```bash
unset name

echo "${name:+User exists}"
```

Output:

```text
```

This is useful for conditional substitutions.

---

# 17. `+` vs `:+`

Similar to `-` and `:-`:

```bash
${var+word}
```

checks whether the variable is **set**.

```bash
${var:+word}
```

checks whether it is **set and non-empty**.

---

# 18. List of Variables

Bash provides several ways to inspect variables.

### `set`

```bash
set
```

Displays shell variables, functions, and shell state.

Because the output can be large:

```bash
set | less
```

---

### `printenv`

```bash
printenv
```

Displays environment variables.

---

### `env`

```bash
env
```

Also displays environment variables.

---

### `declare`

You can inspect a particular variable:

```bash
declare -p name
```

Example:

```bash
name="Shubham"

declare -p name
```

Possible output:

```text
declare -- name="Shubham"
```

For arrays, `declare -p` is especially useful.

---

# 19. Length of a String

Use:

```bash
${#variable}
```

Example:

```bash
name="Shubham"

echo "${#name}"
```

Output:

```text
7
```

Because:

```text
S h u b h a m
1 2 3 4 5 6 7
```

---

## 19.1 Another Example

```bash
text="Hello World"

echo "${#text}"
```

Output:

```text
11
```

The space is also a character.

```text
Hello → 5
space → 1
World → 5

total → 11
```

---

# 20. Slice a String

Bash can extract part of a string.

Syntax:

```bash
${variable:offset:length}
```

Example:

```bash
text="Hello World"

echo "${text:0:5}"
```

Output:

```text
Hello
```

Indexes start at `0`.

```text
H e l l o   W o r l d
0 1 2 3 4 5 6 7 8 9 10
```

---

# 21. More String Slicing

```bash
text="Hello World"

echo "${text:6:5}"
```

Output:

```text
World
```

Start at index `6` and take `5` characters.

You can omit the length:

```bash
echo "${text:6}"
```

Output:

```text
World
```

This means:

> Start at index 6 and continue to the end.

---

# 22. Negative String Offset

Bash also supports negative offsets.

For example:

```bash
text="Hello World"

echo "${text: -5}"
```

Output:

```text
World
```

Notice the space:

```bash
${text: -5}
```

The space helps Bash distinguish the negative offset from another parameter expansion syntax.

---

# 23. Matching a Pattern

Bash provides pattern-based parameter expansion.

Suppose:

```bash
file="/home/shubham/report.txt"
```

You can remove a matching prefix using:

```bash
echo "${file#*/}"
```

Output:

```text
home/shubham/report.txt
```

`#` removes the **shortest matching prefix**.

---

# 24. Keep/Remove Matching Pattern

There are four very important operators:

```text
${var#pattern}    → remove shortest matching prefix
${var##pattern}   → remove longest matching prefix

${var%pattern}    → remove shortest matching suffix
${var%%pattern}   → remove longest matching suffix
```

Mental model:

```text
#   → from the beginning
%   → from the end

single → shortest match
double → longest match
```

---

# 25. Example: Remove Prefix

```bash
path="/home/shubham/file.txt"

echo "${path#*/}"
```

Output:

```text
home/shubham/file.txt
```

The pattern:

```text
*/
```

matches the shortest possible prefix ending at `/`.

---

# 26. Example: Remove Longest Prefix

```bash
path="/home/shubham/file.txt"

echo "${path##*/}"
```

Output:

```text
file.txt
```

Why?

`##*/` removes everything through the **last `/`**.

This is a very common technique for extracting a filename.

---

# 27. Extract Filename

Instead of:

```bash
basename "$path"
```

you can use:

```bash
filename="${path##*/}"
```

Example:

```bash
path="/home/shubham/documents/report.pdf"

filename="${path##*/}"

echo "$filename"
```

Output:

```text
report.pdf
```

---

# 28. Extract Directory

You can use:

```bash
directory="${path%/*}"
```

Example:

```bash
path="/home/shubham/documents/report.pdf"

directory="${path%/*}"

echo "$directory"
```

Output:

```text
/home/shubham/documents
```

---

# 29. Replace a Matching Pattern

Bash supports pattern replacement.

Syntax:

```bash
${variable/pattern/replacement}
```

Example:

```bash
text="hello world"

echo "${text/world/Bash}"
```

Output:

```text
hello Bash
```

Only the **first matching occurrence** is replaced.

---

# 30. Replace All Matching Patterns

Use `//`:

```bash
${variable//pattern/replacement}
```

Example:

```bash
text="apple apple apple"

echo "${text//apple/orange}"
```

Output:

```text
orange orange orange
```

Mental model:

```text
/    → first match
//   → all matches
```

---

# 31. Replace Matching Pattern by Location

You can also replace patterns at the beginning or end.

### Beginning

```bash
${variable/#pattern/replacement}
```

### End

```bash
${variable/%pattern/replacement}
```

Example:

```bash
file="report.txt"

echo "${file/#report/document}"
```

Output:

```text
document.txt
```

The pattern must match the beginning.

---

## 31.1 Replace at the End

```bash
file="report.txt"

echo "${file/%.txt/.pdf}"
```

Output:

```text
report.pdf
```

Here `%` anchors the pattern to the end.

---

# 32. Changing Case

Bash supports case conversion using parameter expansion.

## Convert first character to uppercase

```bash
name="shubham"

echo "${name^}"
```

Output:

```text
Shubham
```

---

## Convert entire string to uppercase

```bash
echo "${name^^}"
```

Output:

```text
SHUBHAM
```

---

## Convert first character to lowercase

```bash
name="SHUBHAM"

echo "${name,}"
```

Output:

```text
sHUBHAM
```

---

## Convert entire string to lowercase

```bash
echo "${name,,}"
```

Output:

```text
shubham
```

---

# 33. Case Conversion Cheat Sheet

```text
${var^}    → first matching character uppercase
${var^^}   → all characters uppercase

${var,}    → first matching character lowercase
${var,,}   → all characters lowercase
```

Example:

```bash
name="ShUbHaM"

echo "${name^^}"
echo "${name,,}"
```

Output:

```text
SHUBHAM
shubham
```

---

# 34. Restricting Variable Value Types

Bash variables are normally untyped strings.

However, Bash can assign attributes to variables using `declare`.

For example:

```bash
declare -i age
```

The `-i` attribute tells Bash to treat the variable as an integer for arithmetic evaluation.

Example:

```bash
declare -i age

age=20
echo "$age"
```

Output:

```text
20
```

Now:

```bash
age=10+5
echo "$age"
```

Output:

```text
15
```

Because `age` has the integer attribute.

---

# 35. `declare -i`

Example:

```bash
declare -i number=10
```

Then:

```bash
number=number+5
echo "$number"
```

Output:

```text
15
```

Without integer attributes, Bash generally treats ordinary variable values as strings unless used in an arithmetic context.

---

# 36. Other Useful Variable Attributes

Bash's `declare` can assign different attributes.

Common examples:

```bash
declare -i number
declare -r constant="hello"
declare -a array
declare -A dictionary
```

Meaning:

| Option | Meaning |
|---|---|
| `-i` | Integer |
| `-r` | Read-only |
| `-a` | Indexed array |
| `-A` | Associative array |

---

# 37. Removing Variable Restrictions

`declare` attributes can sometimes be removed using:

```bash
declare +i variable
```

Example:

```bash
declare -i number
number=10

declare +i number
```

The integer attribute is removed.

You can inspect attributes with:

```bash
declare -p number
```

---

# 38. Read-Only Variables

Another restriction is read-only:

```bash
declare -r PI=3.14159
```

Now:

```bash
PI=4
```

will produce an error because the variable is read-only.

You cannot remove the read-only attribute from an existing variable with `declare +r`.

A read-only variable remains read-only for the lifetime of that shell.

---

# 39. Indexed Arrays

Bash supports arrays.

An **indexed array** uses numeric indexes.

Example:

```bash
fruits=(apple banana mango)
```

Conceptually:

```text
Index      Value
  0        apple
  1        banana
  2        mango
```

---

# 40. Accessing Indexed Arrays

Access element `0`:

```bash
echo "${fruits[0]}"
```

Output:

```text
apple
```

Access element `1`:

```bash
echo "${fruits[1]}"
```

Output:

```text
banana
```

Access element `2`:

```bash
echo "${fruits[2]}"
```

Output:

```text
mango
```

---

# 41. Important: Use `${}` with Arrays

Use:

```bash
echo "${fruits[1]}"
```

The braces make the intended parameter expansion explicit.

For arrays, braces are especially important because array syntax contains indexes.

---

# 42. Add an Array Element

You can assign individual indexes:

```bash
fruits[3]="orange"
```

Then:

```bash
echo "${fruits[3]}"
```

Output:

```text
orange
```

Arrays do not have to be densely populated.

For example:

```bash
numbers[0]=10
numbers[5]=50
```

Indexes `1` through `4` can remain unset.

---

# 43. Get All Indexed Array Elements

Use:

```bash
echo "${fruits[@]}"
```

Example:

```bash
fruits=(apple banana mango)

echo "${fruits[@]}"
```

Output:

```text
apple banana mango
```

To process each element safely:

```bash
for fruit in "${fruits[@]}"; do
    echo "$fruit"
done
```

Output:

```text
apple
banana
mango
```

---

# 44. Number of Array Elements

Use:

```bash
echo "${#fruits[@]}"
```

Example:

```bash
fruits=(apple banana mango)

echo "${#fruits[@]}"
```

Output:

```text
3
```

This means:

> Number of elements in the array.

---

# 45. Associative Arrays

An associative array stores values using **string keys** instead of numeric indexes.

This is similar to a Python dictionary.

Python:

```python
student = {
    "name": "Shubham",
    "age": 27,
    "city": "Bilaspur"
}
```

Bash:

```bash
declare -A student

student[name]="Shubham"
student[age]=27
student[city]="Bilaspur"
```

---

# 46. Accessing Associative Array Values

```bash
echo "${student[name]}"
```

Output:

```text
Shubham
```

```bash
echo "${student[age]}"
```

Output:

```text
27
```

```bash
echo "${student[city]}"
```

Output:

```text
Bilaspur
```

---

# 47. Why `declare -A` Is Important

You should explicitly declare an associative array:

```bash
declare -A student
```

Then:

```bash
student[name]="Shubham"
```

Without declaring the variable as associative, Bash treats array subscripts differently.

---

# 48. Associative Array Example

```bash
declare -A marks

marks[math]=95
marks[linux]=90
marks[python]=98

echo "${marks[math]}"
echo "${marks[linux]}"
echo "${marks[python]}"
```

Output:

```text
95
90
98
```

---

# 49. Loop Through an Associative Array

To get all keys:

```bash
for key in "${!marks[@]}"; do
    echo "$key"
done
```

To print key-value pairs:

```bash
for key in "${!marks[@]}"; do
    echo "$key = ${marks[$key]}"
done
```

Possible output:

```text
math = 95
linux = 90
python = 98
```

The order of associative-array iteration should not be relied upon.

---

# 50. Number of Associative Array Elements

```bash
echo "${#marks[@]}"
```

If there are three entries:

```text
3
```

---

# 51. Indexed vs Associative Arrays

| Feature | Indexed Array | Associative Array |
|---|---|---|
| Declaration | `declare -a` | `declare -A` |
| Index/key | Integer | String |
| Example | `arr[0]` | `arr[name]` |
| Python equivalent | List | Dictionary |
| Example | `fruits[0]=apple` | `student[name]=Shubham` |

Mental model:

```text
Indexed Array

0 → apple
1 → banana
2 → mango
```

```text
Associative Array

name → Shubham
age  → 27
city → Bilaspur
```

---

# 52. Why Use `{}` Around Variables?

Normally:

```bash
name="Shubham"

echo "$name"
```

works.

But consider:

```bash
name="file"

echo "$name.txt"
```

This is interpreted as:

```text
$name.txt
```

Bash looks for a variable named:

```text
name.txt
```

which is not what we intended.

Use braces:

```bash
echo "${name}.txt"
```

Output:

```text
file.txt
```

---

# 53. `${}` Clearly Separates the Variable Name

Suppose:

```bash
prefix="student"
```

Without braces:

```bash
echo "$prefix123"
```

Bash interprets:

```text
prefix123
```

as the variable name.

Correct:

```bash
echo "${prefix}123"
```

Output:

```text
student123
```

---

# 54. Another Example

```bash
base="report"

echo "${base}_2026.txt"
```

Output:

```text
report_2026.txt
```

Braces tell Bash exactly where the variable name ends.

---

# 55. Variable Availability to Shells and Subshells

This is an important concept.

Start a shell:

```bash
name="Shubham"
```

Then:

```bash
bash
```

Inside the child shell:

```bash
echo "$name"
```

Normally:

```text
```

The child shell does not automatically receive ordinary shell variables.

Exit:

```bash
exit
```

---

# 56. Exporting Makes Variables Available to Child Shells

Create and export:

```bash
export name="Shubham"
```

Now:

```bash
bash
```

Inside the child shell:

```bash
echo "$name"
```

Output:

```text
Shubham
```

Because `name` was exported.

Then:

```bash
exit
```

---

# 57. Parent Shell and Child Shell

Think of it as:

```text
Parent Bash
│
│  export name="Shubham"
│
└── Child Bash
       │
       └── name="Shubham"
```

Without export:

```text
Parent Bash
│
│  name="Shubham"
│
└── Child Bash
       │
       └── name is unavailable
```

---

# 58. Modifying an Exported Variable in a Child Shell

This is a very important concept.

In the parent:

```bash
export name="Shubham"
```

Start child:

```bash
bash
```

Inside child:

```bash
echo "$name"
```

Output:

```text
Shubham
```

Now modify it:

```bash
name="Rahul"
```

Check:

```bash
echo "$name"
```

Output:

```text
Rahul
```

But now exit:

```bash
exit
```

Back in the parent:

```bash
echo "$name"
```

Output:

```text
Shubham
```

---

# 59. Why Didn't the Parent Change?

When the child shell starts, it receives the environment from the parent.

Conceptually:

```text
Parent
name = Shubham
      |
      | export
      ↓
Child
name = Shubham
```

The child has its **own shell variable state**.

Changing:

```bash
name="Rahul"
```

changes the child's copy.

It does not modify the parent's variable.

```text
Parent
name = Shubham
      ↑
      │
      │ independent
      │
Child
name = Rahul
```

When the child exits, its changes disappear.

---

# 60. Important Export Concept

`export` does not mean:

> "This variable is globally shared between shells."

It means:

> "Put this variable in the environment inherited by child processes."

Therefore:

```text
export
   ↓
inheritance
   ↓
child process
```

It does not create shared memory.

---

# 61. Command Output to a Variable

You can store command output in a variable using **command substitution**.

Syntax:

```bash
variable=$(command)
```

Example:

```bash
today=$(date)
```

Then:

```bash
echo "$today"
```

Possible output:

```text
Tue Sep  8 09:30:12 IST 2026
```

---

# 62. Command Substitution with `$(...)`

Example:

```bash
current_dir=$(pwd)
```

Then:

```bash
echo "$current_dir"
```

Output:

```text
/home/shubham/projects
```

Another example:

```bash
files=$(ls)
echo "$files"
```

The output of `ls` is captured into `files`.

---

# 63. Backticks

Older shell syntax also exists:

```bash
today=`date`
```

But modern Bash scripting should prefer:

```bash
today=$(date)
```

because `$(...)` is easier to read and nest.

Prefer:

```bash
result=$(command)
```

over:

```bash
result=`command`
```

---

# 64. Command Substitution and Newlines

Command substitution removes trailing newline characters from command output.

For example:

```bash
output=$(printf "hello\n\n")
```

The trailing newlines are stripped from the resulting value.

This matters when exact output formatting is important.

---

# 65. Variable Not Set — Show an Error

Sometimes a script should stop or report an error if a required variable is missing.

Use:

```bash
${var?message}
```

Example:

```bash
unset name

echo "${name?name is required}"
```

Bash reports an error similar to:

```text
bash: name: name is required
```

---

# 66. `${var?message}`

Mental model:

```text
${var?message}
       ↓
if var is set and non-empty
       ↓
use its value

if var is unset or empty
       ↓
display error message
```

Example:

```bash
unset DATABASE_URL

echo "${DATABASE_URL?DATABASE_URL must be set}"
```

Possible output:

```text
bash: DATABASE_URL: DATABASE_URL must be set
```

---

# 67. `${var:?message}`

There is also:

```bash
${var:?message}
```

This checks for both:

- unset
- empty

Example:

```bash
name=""

echo "${name:?name cannot be empty}"
```

Bash reports an error similar to:

```text
bash: name: name cannot be empty
```

---

# 68. Difference Between `?` and `:?`

```bash
${var?message}
```

checks whether the variable is **unset**.

```bash
${var:?message}
```

checks whether the variable is **unset or empty**.

This follows the same pattern seen earlier:

```text
-   → unset
:-  → unset or empty

?   → unset
:?  → unset or empty

+   → set
:+  → set and non-empty
```

---

# 69. Required Configuration Example

Suppose a deployment script requires:

```bash
DATABASE_URL
```

We can write:

```bash
#!/bin/bash

echo "${DATABASE_URL?DATABASE_URL is required}"

echo "Starting application..."
```

If the variable exists:

```bash
DATABASE_URL="postgresql://localhost/mydb"
./script.sh
```

the script can continue.

If it is missing, Bash reports the error.

---

# 70. Parameter Expansion Master Table

| Syntax | Meaning |
|---|---|
| `${var}` | Value of variable |
| `${#var}` | Length |
| `${var:-word}` | Use `word` if unset/empty |
| `${var-word}` | Use `word` if unset |
| `${var:=word}` | Assign `word` if unset/empty |
| `${var=word}` | Assign `word` if unset |
| `${var:+word}` | Use `word` if set/non-empty |
| `${var+word}` | Use `word` if set |
| `${var:?msg}` | Error if unset/empty |
| `${var?msg}` | Error if unset |
| `${var:offset:length}` | Substring |
| `${var#pattern}` | Remove shortest prefix |
| `${var##pattern}` | Remove longest prefix |
| `${var%pattern}` | Remove shortest suffix |
| `${var%%pattern}` | Remove longest suffix |
| `${var/pat/repl}` | Replace first match |
| `${var//pat/repl}` | Replace all matches |
| `${var/#pat/repl}` | Replace at beginning |
| `${var/%pat/repl}` | Replace at end |
| `${var^}` | Uppercase first character |
| `${var^^}` | Uppercase all |
| `${var,}` | Lowercase first character |
| `${var,,}` | Lowercase all |

---

# 71. Practical Combined Example

Consider:

```bash
#!/bin/bash

name="${1:-Guest}"

echo "Hello, ${name}!"
```

Run:

```bash
./hello.sh
```

Output:

```text
Hello, Guest!
```

Run:

```bash
./hello.sh Shubham
```

Output:

```text
Hello, Shubham!
```

Here:

```bash
${1:-Guest}
```

means:

> Use the first argument if it exists and is non-empty; otherwise use `Guest`.

---

# 72. Practical Filename Example

```bash
path="/home/shubham/documents/report.txt"

filename="${path##*/}"
directory="${path%/*}"

echo "Directory: $directory"
echo "Filename: $filename"
```

Output:

```text
Directory: /home/shubham/documents
Filename: report.txt
```

This demonstrates how parameter expansion can replace some simple uses of `dirname` and `basename`.

---

# 73. Practical String Processing Example

```bash
text="Hello Bash World"

echo "Length: ${#text}"
echo "First 5: ${text:0:5}"
echo "Lowercase: ${text,,}"
echo "Uppercase: ${text^^}"
echo "Replace Bash: ${text/Bash/Linux}"
```

Output:

```text
Length: 16
First 5: Hello
Lowercase: hello bash world
Uppercase: HELLO BASH WORLD
Replace Bash: Hello Linux World
```

---

# 74. Practical Array Example

```bash
fruits=(apple banana mango orange)

echo "First fruit: ${fruits[0]}"
echo "Third fruit: ${fruits[2]}"
echo "Number of fruits: ${#fruits[@]}"

for fruit in "${fruits[@]}"; do
    echo "$fruit"
done
```

Output:

```text
First fruit: apple
Third fruit: mango
Number of fruits: 4
apple
banana
mango
orange
```

---

# 75. Practical Associative Array Example

```bash
declare -A student

student[name]="Shubham"
student[course]="Data Science"
student[status]="active"

echo "Name: ${student[name]}"
echo "Course: ${student[course]}"
echo "Status: ${student[status]}"
```

Output:

```text
Name: Shubham
Course: Data Science
Status: active
```

---

# 76. Practical Export Example

Parent shell:

```bash
export APP_ENV="production"
```

Start child shell:

```bash
bash
```

Child:

```bash
echo "$APP_ENV"
```

Output:

```text
production
```

Modify child:

```bash
APP_ENV="development"
```

Then:

```bash
echo "$APP_ENV"
```

Output:

```text
development
```

Exit:

```bash
exit
```

Back in parent:

```bash
echo "$APP_ENV"
```

Output:

```text
production
```

The child's modification did not change the parent's value.

---

# 77. Practical Command Substitution Example

```bash
username=$(whoami)
hostname=$(hostname)
directory=$(pwd)

echo "User: $username"
echo "Host: $hostname"
echo "Directory: $directory"
```

Possible output:

```text
User: shubham
Host: ubuntu
Directory: /home/shubham
```

---

# 78. Common Mistakes

## Mistake 1: Spaces around `=`

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

Output:

```text
name
```

Correct:

```bash
echo "$name"
```

---

## Mistake 3: Not quoting expansions

Risky:

```bash
rm $file
```

Better:

```bash
rm -- "$file"
```

If the filename contains spaces, quoting prevents unwanted word splitting.

---

## Mistake 4: Confusing `:-` and `:=`

```bash
${var:-default}
```

only substitutes a value.

```bash
${var:=default}
```

substitutes and assigns.

---

## Mistake 5: Confusing `#` and `%`

```text
#  → beginning/prefix
%  → ending/suffix
```

---

## Mistake 6: Confusing `/` and `//`

```text
${var/pattern/replacement}
    → first match

${var//pattern/replacement}
    → all matches
```

---

## Mistake 7: Forgetting to declare associative arrays

Correct:

```bash
declare -A data
data[name]="Shubham"
```

---

# 79. Exam-Oriented Questions

## Q1. What is wrong with this?

```bash
name = "Shubham"
```

### Answer

Bash variable assignments cannot contain spaces around `=`.

Correct:

```bash
name="Shubham"
```

---

## Q2. What does this do?

```bash
unset name
echo "${name:-Guest}"
```

### Answer

It prints:

```text
Guest
```

because `name` is unset.

---

## Q3. What is the difference?

```bash
${name:-Guest}
```

and:

```bash
${name:=Guest}
```

### Answer

```text
:- → substitute Guest
:= → substitute Guest and assign Guest to name
```

---

## Q4. What does this return?

```bash
text="Hello World"
echo "${#text}"
```

### Answer

```text
11
```

---

## Q5. Extract `report.txt` from:

```bash
path="/home/user/docs/report.txt"
```

### Answer

```bash
echo "${path##*/}"
```

Output:

```text
report.txt
```

---

## Q6. Extract `/home/user/docs` from:

```bash
path="/home/user/docs/report.txt"
```

### Answer

```bash
echo "${path%/*}"
```

---

## Q7. Replace all `cat` occurrences with `dog`.

```bash
text="cat cat cat"
```

### Answer

```bash
echo "${text//cat/dog}"
```

Output:

```text
dog dog dog
```

---

## Q8. Convert this to uppercase:

```bash
name="shubham"
```

### Answer

```bash
echo "${name^^}"
```

Output:

```text
SHUBHAM
```

---

## Q9. What does `export` do?

### Answer

It places a shell variable in the environment so that child processes can inherit it.

---

## Q10. Does changing an exported variable in a child shell modify the parent?

### Answer

No.

The child receives its own copy of the variable/environment.

---

## Q11. Create an indexed array.

### Answer

```bash
arr=(apple banana mango)
```

---

## Q12. Create an associative array.

### Answer

```bash
declare -A student
```

---

## Q13. Store the output of `date` in a variable.

### Answer

```bash
today=$(date)
```

---

## Q14. Show an error if `DATABASE_URL` is unset.

### Answer

```bash
echo "${DATABASE_URL?DATABASE_URL is required}"
```

For unset **or empty**:

```bash
echo "${DATABASE_URL:?DATABASE_URL is required}"
```

---

# 80. Final Mental Model

The most important idea in this lesson is that Bash has **parameter expansion**, which is much more powerful than simply writing `$variable`.

Think of it in layers:

```text
Basic variable
      ↓
$name
      ↓
Explicit boundaries
      ↓
${name}
      ↓
Default values
      ↓
${name:-default}
${name:=default}
      ↓
Validation
      ↓
${name:?error}
      ↓
String operations
      ↓
${#name}
${name:start:length}
${name#pattern}
${name##pattern}
${name%pattern}
${name%%pattern}
${name/pattern/replacement}
${name//pattern/replacement}
      ↓
Case conversion
      ↓
${name^^}
${name,,}
      ↓
Arrays
      ↓
${array[index]}
${array[@]}
${#array[@]}
      ↓
Environment
      ↓
export variable
      ↓
Child processes
```

The key distinctions to memorize:

```text
$var
    → simple expansion

${var}
    → explicit variable boundary

${#var}
    → string length

${var:0:5}
    → substring

${var:-default}
    → default if unset/empty

${var:=default}
    → default + assignment

${var:?message}
    → error if unset/empty

${var#pattern}
    → shortest prefix removal

${var##pattern}
    → longest prefix removal

${var%pattern}
    → shortest suffix removal

${var%%pattern}
    → longest suffix removal

${var/pat/repl}
    → first replacement

${var//pat/repl}
    → all replacements

${var^^}
    → uppercase

${var,,}
    → lowercase

export var
    → make variable available to child processes

$(command)
    → capture command output

declare -a
    → indexed array

declare -A
    → associative array
```

Mastering these parameter-expansion forms is extremely important because they allow Bash scripts to perform substantial **string processing, validation, configuration handling, argument handling, and data manipulation without external commands**.
