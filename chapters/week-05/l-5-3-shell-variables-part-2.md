---
layout: default
title: "L 5.3 - Shell Variables - Part 2"
---

# L 5.3 - Shell Variables - Part 2


# Bash Parameter Expansion, `declare`, Arrays, and Command Output

Bash provides a powerful feature called **parameter expansion**.

Instead of only doing:

```bash
echo "$USER"
```

we can manipulate variables directly:

```bash
echo "${#USER}"
echo "${USER:2:2}"
echo "${USER##*/}"
echo "${USER//a/b}"
echo "${USER^^}"
```

Parameter expansion can perform many operations without needing external commands.

This lesson covers:

- listing variables using `${!prefix*}`
- string length
- substring/slicing
- negative indexes
- pattern removal using `#`, `##`, `%`, `%%`
- combining prefix and suffix removal
- string replacement
- anchored replacement
- case conversion
- `declare`
- integer, lowercase, uppercase, and readonly variables
- indexed arrays
- array length
- array elements
- array indices
- deleting array elements
- appending elements
- populating arrays
- associative arrays
- storing command output in arrays

---

# 1. `${!H*}` — List Variables Starting with a Prefix

Bash supports indirect/prefix-based parameter expansion.

Example:

```bash
echo ${!H*}
```

This asks Bash to find shell variables whose names begin with:

```text
H
```

For example, your shell may contain variables such as:

```text
HOME
HOSTNAME
HISTFILE
HISTSIZE
```

Then:

```bash
echo ${!H*}
```

could produce:

```text
HOME HOSTNAME HISTFILE HISTSIZE
```

The exact list depends on your shell environment.

---

## 1.1 Mental Model

Think of:

```bash
${!H*}
```

as:

```text
Find variable names
       ↓
whose names start with H
       ↓
print those variable names
```

It is different from:

```bash
echo $HOME
```

which prints the **value** of `HOME`.

Compare:

```bash
echo $HOME
```

with:

```bash
echo ${!H*}
```

The first gives a value:

```text
/home/shubham
```

The second gives matching variable names:

```text
HOME HOSTNAME ...
```

---

# 2. `${!prefix*}` vs `${!prefix@}`

You may encounter both:

```bash
${!H*}
```

and:

```bash
${!H@}
```

For many simple uses, they produce the same list of matching variable names.

For example:

```bash
echo "${!H*}"
```

may output:

```text
HOME HOSTNAME HISTFILE HISTSIZE
```

The `@` and `*` forms have more important differences when used inside double quotes, especially when dealing with positional parameters and arrays.

For basic prefix listing, remember:

```bash
${!prefix*}
```

means:

> List variable names beginning with `prefix`.

---

# 3. `${#USER}` — Length of a Variable

The syntax:

```bash
${#variable}
```

returns the length of the variable's value.

Example:

```bash
echo "${#USER}"
```

If:

```text
USER=shubham
```

then:

```text
shubham
```

contains 7 characters.

Therefore:

```bash
echo "${#USER}"
```

outputs:

```text
7
```

---

# 4. String Length Example

```bash
name="Shubham"

echo "${#name}"
```

Output:

```text
7
```

Another example:

```bash
text="Hello World"

echo "${#text}"
```

Output:

```text
11
```

Remember:

```text
Hello → 5
space → 1
World → 5

Total → 11
```

---

# 5. `${USER:2:2}` — String Slicing

Bash can extract a substring using:

```bash
${variable:offset:length}
```

Example:

```bash
echo "${USER:2:2}"
```

Suppose:

```text
USER=shubham
```

Indexes are:

```text
s h u b h a m
0 1 2 3 4 5 6
```

Starting at index `2`:

```text
u b
```

Taking 2 characters:

```text
ub
```

Therefore:

```bash
echo "${USER:2:2}"
```

outputs:

```text
ub
```

---

# 6. Understanding String Indexes

Bash string indexes start from `0`.

For:

```bash
text="abcdef"
```

the indexes are:

```text
Character:  a b c d e f
Index:      0 1 2 3 4 5
```

Therefore:

```bash
echo "${text:0:2}"
```

outputs:

```text
ab
```

And:

```bash
echo "${text:2:3}"
```

outputs:

```text
cde
```

---

# 7. `${USER: -3:2}` — Negative Offset

Bash also supports negative offsets.

Example:

```bash
echo "${USER: -3:2}"
```

The space after `:` is important:

```bash
${USER: -3:2}
```

Suppose:

```text
USER=shubham
```

The string is:

```text
s h u b h a m
```

Counting from the right:

```text
s  h  u  b  h  a  m
-7 -6 -5 -4 -3 -2 -1
```

Start at:

```text
-3
```

which points to:

```text
h
```

Take 2 characters:

```text
ha
```

Therefore:

```bash
echo "${USER: -3:2}"
```

outputs:

```text
ha
```

---

# 8. Negative Index Mental Model

Positive indexing:

```text
s h u b h a m
0 1 2 3 4 5 6
```

Negative indexing:

```text
s  h  u  b  h  a  m
-7 -6 -5 -4 -3 -2 -1
```

Therefore:

```bash
${USER: -1}
```

gets the last character.

```bash
${USER: -2}
```

gets the last two characters.

Example:

```bash
echo "${USER: -1}"
```

Output:

```text
m
```

And:

```bash
echo "${USER: -3}"
```

Output:

```text
ham
```

---

# 9. Why the Space in Negative Offsets?

Use:

```bash
${USER: -3:2}
```

rather than:

```bash
${USER:-3:2}
```

because:

```text
:- 
```

already has a special meaning in Bash parameter expansion.

Remember:

```bash
${var:-default}
```

means:

> use a default value if `var` is unset or empty.

Therefore Bash needs the space to recognize the negative substring offset.

---

# 10. `date` Command Options

The `date` command displays or formats the current date and time.

Basic:

```bash
date
```

Example:

```text
Tue Sep  8 09:30:00 IST 2026
```

---

## 10.1 RFC Format

```bash
date -R
```

Example:

```text
Tue, 08 Sep 2026 09:30:00 +0530
```

---

## 10.2 Custom Format

The most useful option for scripting is often:

```bash
date "+%Y-%m-%d"
```

Output:

```text
2026-09-08
```

Common format specifiers:

| Format | Meaning |
|---|---|
| `%Y` | Four-digit year |
| `%m` | Month `01-12` |
| `%d` | Day `01-31` |
| `%H` | Hour `00-23` |
| `%M` | Minute |
| `%S` | Second |
| `%A` | Full weekday name |
| `%a` | Short weekday name |
| `%B` | Full month name |
| `%b` | Short month name |

Example:

```bash
date "+%Y-%m-%d %H:%M:%S"
```

Output:

```text
2026-09-08 09:30:00
```

---

# 11. Pattern Matching with `#`

The syntax:

```bash
${variable#pattern}
```

removes the **shortest matching pattern from the beginning** of the value.

Example:

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

matches from the beginning through the first `/`.

---

# 12. `#` Means Remove from the Start

Remember:

```text
# → start
```

So:

```bash
${var#pattern}
```

means:

> Starting from the beginning, remove the shortest matching pattern.

Example:

```bash
path="abc/def/ghi"

echo "${path#*/}"
```

Output:

```text
def/ghi
```

Only the shortest prefix:

```text
abc/
```

was removed.

---

# 13. Pattern Matching with `##`

The syntax:

```bash
${variable##pattern}
```

removes the **longest matching pattern from the beginning**.

Example:

```bash
path="/home/shubham/file.txt"

echo "${path##*/}"
```

Output:

```text
file.txt
```

Why?

The pattern:

```text
*/
```

can match up to different `/` characters.

`##` chooses the longest match.

Therefore everything through the last `/` is removed.

---

# 14. `#` vs `##`

```text
${var#pattern}
       ↓
shortest match from beginning

${var##pattern}
       ↓
longest match from beginning
```

Example:

```bash
path="a/b/c.txt"
```

Using:

```bash
echo "${path#*/}"
```

Output:

```text
b/c.txt
```

Using:

```bash
echo "${path##*/}"
```

Output:

```text
c.txt
```

---

# 15. Extracting a Filename with `##`

This is one of the most useful applications.

```bash
path="/home/shubham/documents/report.pdf"

filename="${path##*/}"

echo "$filename"
```

Output:

```text
report.pdf
```

Mental model:

```text
/home/shubham/documents/report.pdf
                     ↑
               last slash

##*/ removes everything
through the last slash
                     ↓

report.pdf
```

---

# 16. Pattern Matching with `%`

`%` works from the **end** of the variable.

Syntax:

```bash
${variable%pattern}
```

It removes the **shortest matching suffix**.

Example:

```bash
file="report.txt"

echo "${file%.txt}"
```

Output:

```text
report
```

The suffix:

```text
.txt
```

was removed.

---

# 17. `%%` — Longest Suffix Removal

Syntax:

```bash
${variable%%pattern}
```

This removes the **longest matching suffix**.

Example:

```bash
path="abc/def/ghi"

echo "${path%%/*}"
```

Output:

```text
abc
```

The pattern:

```text
/*
```

matches from the first `/` to the end.

`%%` chooses the longest matching suffix.

---

# 18. `%` vs `%%`

```text
${var%pattern}
       ↓
shortest match from end

${var%%pattern}
       ↓
longest match from end
```

Example:

```bash
path="a/b/c"
```

```bash
echo "${path%/*}"
```

Output:

```text
a/b
```

```bash
echo "${path%%/*}"
```

Output:

```text
a
```

---

# 19. Extract Directory with `%`

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

This removes the shortest suffix beginning with the final `/`.

---

# 20. Mixing `##` and `%%`

The real power comes from combining prefix and suffix removal.

Suppose:

```bash
path="/home/shubham/documents/report.pdf"
```

Extract filename:

```bash
filename="${path##*/}"
```

Result:

```text
report.pdf
```

Now remove extension:

```bash
name="${filename%.*}"
```

Result:

```text
report
```

So:

```bash
path="/home/shubham/documents/report.pdf"

filename="${path##*/}"
name="${filename%.*}"

echo "$name"
```

Output:

```text
report
```

---

# 21. Extract Filename Without Extension

You can combine both operations:

```bash
path="/home/shubham/documents/report.pdf"

name="${path##*/}"
name="${name%.*}"

echo "$name"
```

Output:

```text
report
```

Mental model:

```text
/home/shubham/documents/report.pdf
                    ↓
                 ##*/
                    ↓
                report.pdf
                    ↓
                  %.*
                    ↓
                  report
```

---

# 22. Another `##` and `%%` Example

Consider:

```bash
url="https://example.com/path/file.txt"
```

Remove everything before the final `/`:

```bash
echo "${url##*/}"
```

Output:

```text
file.txt
```

Remove the extension:

```bash
file="${url##*/}"
echo "${file%.*}"
```

Output:

```text
file
```

---

# 23. Replacing a Substring with `/`

Bash supports replacement:

```bash
${variable/pattern/replacement}
```

It replaces the **first matching occurrence**.

Example:

```bash
text="apple apple apple"

echo "${text/apple/orange}"
```

Output:

```text
orange apple apple
```

Only the first `apple` was replaced.

---

# 24. Replacing All Matches with `//`

Use:

```bash
${variable//pattern/replacement}
```

This replaces all matching occurrences.

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

# 25. `/` vs `//`

```bash
text="hello hello hello"
```

First occurrence:

```bash
echo "${text/hello/hi}"
```

Output:

```text
hi hello hello
```

All occurrences:

```bash
echo "${text//hello/hi}"
```

Output:

```text
hi hi hi
```

---

# 26. `/#` — Replace Only at the Beginning

Bash also supports:

```bash
${variable/#pattern/replacement}
```

The `#` anchors the replacement to the **beginning**.

Example:

```bash
text="hello world"

echo "${text/#hello/hi}"
```

Output:

```text
hi world
```

The pattern must occur at the beginning.

---

# 27. `/%` — Replace Only at the End

The syntax:

```bash
${variable/%pattern/replacement}
```

anchors the replacement to the **end**.

Example:

```bash
file="report.txt"

echo "${file/%.txt/.pdf}"
```

Output:

```text
report.pdf
```

This is useful when changing file extensions.

---

# 28. `/#` vs `/%`

Remember:

```text
/# → beginning
/% → end
```

Example:

```bash
text="hello world"

echo "${text/#hello/HI}"
```

Output:

```text
HI world
```

And:

```bash
text="hello world"

echo "${text/%world/EVERYONE}"
```

Output:

```text
hello EVERYONE
```

---

# 29. Changing Case with `,` and `,,`

Bash provides case conversion using:

```text
^   → uppercase
,   → lowercase
```

For lowercase:

```bash
${variable,}
```

converts the first matching character to lowercase.

```bash
${variable,,}
```

converts all matching characters to lowercase.

---

# 30. Uppercase with `^` and `^^`

Similarly:

```bash
${variable^}
```

converts the first matching character to uppercase.

```bash
${variable^^}
```

converts all matching characters to uppercase.

Example:

```bash
name="shubham"

echo "${name^}"
echo "${name^^}"
```

Output:

```text
Shubham
SHUBHAM
```

---

# 31. Lowercase Example

```bash
name="SHUBHAM"

echo "${name,}"
echo "${name,,}"
```

Output:

```text
sHUBHAM
shubham
```

---

# 32. Case Conversion Cheat Sheet

```text
${var^}    → first character uppercase
${var^^}   → all characters uppercase

${var,}    → first character lowercase
${var,,}   → all characters lowercase
```

Example:

```bash
text="Hello Bash"

echo "${text^^}"
```

Output:

```text
HELLO BASH
```

---

# 33. `declare`

`declare` is a Bash builtin used to:

- create variables with attributes
- inspect variables
- create arrays
- create associative arrays
- make variables readonly
- specify integer/lowercase/uppercase behavior

Basic syntax:

```bash
declare [options] variable
```

---

# 34. `declare -i` — Integer Variable

Use:

```bash
declare -i var
```

This gives the variable an integer attribute.

Example:

```bash
declare -i number

number=10+5

echo "$number"
```

Output:

```text
15
```

Bash evaluates the value arithmetically.

---

# 35. `declare -i` Example

```bash
declare -i a=10
declare -i b=20

sum=a+b

echo "$sum"
```

Output:

```text
30
```

Without an integer attribute, Bash generally treats ordinary variable assignments as strings unless explicitly used in an arithmetic context.

---

# 36. `declare -l` — Lowercase Variable

Use:

```bash
declare -l name
```

This gives the variable a lowercase attribute.

Example:

```bash
declare -l name

name="SHUBHAM"

echo "$name"
```

Output:

```text
shubham
```

The value is automatically converted to lowercase during assignment.

---

# 37. `declare -l` Example

```bash
declare -l username

username="ShUbHaM"

echo "$username"
```

Output:

```text
shubham
```

This is useful when you always want a variable stored in lowercase.

---

# 38. `declare -u` — Uppercase Variable

Use:

```bash
declare -u name
```

This gives the variable an uppercase attribute.

Example:

```bash
declare -u name

name="shubham"

echo "$name"
```

Output:

```text
SHUBHAM
```

---

# 39. `declare -u` Example

```bash
declare -u code

code="abc123"

echo "$code"
```

Output:

```text
ABC123
```

Letters are converted to uppercase.

---

# 40. `declare +u` — Remove Uppercase Attribute

If a variable has the uppercase attribute:

```bash
declare -u name
```

you can remove that attribute with:

```bash
declare +u name
```

Example:

```bash
declare -u name

name="shubham"

echo "$name"
```

Output:

```text
SHUBHAM
```

Remove the attribute:

```bash
declare +u name

name="rahul"

echo "$name"
```

Output:

```text
rahul
```

The variable no longer automatically converts assigned values to uppercase.

---

# 41. `declare -r` — Read-Only Variable

Use:

```bash
declare -r variable=value
```

Example:

```bash
declare -r PI=3.14159
```

Now:

```bash
echo "$PI"
```

Output:

```text
3.14159
```

Attempting:

```bash
PI=4
```

produces an error because `PI` is readonly.

---

# 42. Read-Only Variables

Read-only variables are useful for values that should not be modified accidentally.

Example:

```bash
declare -r APP_NAME="MyApp"
```

Then:

```bash
echo "$APP_NAME"
```

works.

But:

```bash
APP_NAME="OtherApp"
```

fails.

A readonly attribute cannot simply be removed with:

```bash
declare +r
```

Once a variable is readonly in a shell, it remains readonly for that shell's lifetime.

---

# 43. Inspecting `declare` Attributes

Use:

```bash
declare -p variable
```

Example:

```bash
declare -u name="SHUBHAM"

declare -p name
```

Possible output:

```text
declare -u name="SHUBHAM"
```

For an integer:

```bash
declare -i number=10
declare -p number
```

Possible output:

```text
declare -i number="10"
```

This is very useful for debugging.

---

# 44. Indexed Arrays

An indexed array stores multiple values using numeric indexes.

Create one:

```bash
declare -a arr
```

Then:

```bash
arr[0]="apple"
arr[1]="banana"
arr[2]="mango"
```

Conceptually:

```text
Index     Value
  0       apple
  1       banana
  2       mango
```

---

# 45. Accessing an Array Element

Use:

```bash
echo "${arr[0]}"
```

Output:

```text
apple
```

And:

```bash
echo "${arr[1]}"
```

Output:

```text
banana
```

Remember:

```text
array index starts at 0
```

---

# 46. `${#arr[@]}` — Number of Array Elements

To find the number of elements:

```bash
echo "${#arr[@]}"
```

Example:

```bash
declare -a arr

arr[0]="apple"
arr[1]="banana"
arr[2]="mango"

echo "${#arr[@]}"
```

Output:

```text
3
```

It means:

> Number of elements currently present in the array.

---

# 47. `${arr[@]}` — Elements of an Array

Use:

```bash
echo "${arr[@]}"
```

Example:

```bash
arr=(apple banana mango)

echo "${arr[@]}"
```

Output:

```text
apple banana mango
```

For safe iteration, prefer:

```bash
for item in "${arr[@]}"; do
    echo "$item"
done
```

Output:

```text
apple
banana
mango
```

---

# 48. `${!arr[@]}` — Array Indices

The `!` gives the indexes of the array.

Example:

```bash
arr=(apple banana mango)

echo "${!arr[@]}"
```

Output:

```text
0 1 2
```

Mental model:

```text
${arr[@]}
      ↓
values

${!arr[@]}
      ↓
indices
```

---

# 49. Sparse Arrays

Bash arrays do not have to contain every index.

Example:

```bash
arr[0]="apple"
arr[3]="orange"
arr[7]="mango"
```

Now:

```bash
echo "${!arr[@]}"
```

might output:

```text
0 3 7
```

And:

```bash
echo "${#arr[@]}"
```

outputs:

```text
3
```

Notice:

```text
highest index = 7
number of elements = 3
```

These are not the same thing.

---

# 50. Delete an Array Element

Use:

```bash
unset 'arr[index]'
```

Example:

```bash
arr=(apple banana mango orange)

unset 'arr[1]'
```

Now:

```bash
echo "${!arr[@]}"
```

may output:

```text
0 2 3
```

The element at index `1` has been removed.

---

# 51. Why Quote `unset 'arr[index]'`?

Prefer:

```bash
unset 'arr[1]'
```

The quotes prevent unwanted shell pattern expansion and make it clear that the argument is an array element reference.

Then:

```bash
echo "${arr[0]}"
echo "${arr[2]}"
```

still work.

---

# 52. Array After Deletion

Suppose:

```bash
arr=(apple banana mango orange)
```

Initially:

```text
0 → apple
1 → banana
2 → mango
3 → orange
```

Run:

```bash
unset 'arr[1]'
```

Now:

```text
0 → apple
1 → deleted
2 → mango
3 → orange
```

Bash does **not** automatically shift the remaining elements.

Therefore:

```bash
echo "${#arr[@]}"
```

returns:

```text
3
```

and:

```bash
echo "${!arr[@]}"
```

returns:

```text
0 2 3
```

---

# 53. Append an Element with `+=`

Use:

```bash
arr+=(element)
```

Example:

```bash
arr=(apple banana mango)

arr+=(orange)

echo "${arr[@]}"
```

Output:

```text
apple banana mango orange
```

---

# 54. Append Multiple Elements

You can append multiple values:

```bash
arr+=(orange grape)
```

Example:

```bash
arr=(apple banana)

arr+=(mango orange)

echo "${arr[@]}"
```

Output:

```text
apple banana mango orange
```

---

# 55. Populate an Array in One Go

You can create an indexed array directly:

```bash
arr=(apple banana mango orange)
```

This is equivalent to:

```bash
arr[0]=apple
arr[1]=banana
arr[2]=mango
arr[3]=orange
```

Then:

```bash
echo "${arr[@]}"
```

Output:

```text
apple banana mango orange
```

---

# 56. Array Values Containing Spaces

Always be careful when array elements contain spaces.

Correct:

```bash
arr=("Apple Juice" "Orange Juice" "Mango Juice")
```

Then:

```bash
for item in "${arr[@]}"; do
    echo "$item"
done
```

Output:

```text
Apple Juice
Orange Juice
Mango Juice
```

The quotes preserve each item as one array element.

---

# 57. Associative Arrays

Bash also supports **associative arrays**.

They work similarly to dictionaries in Python.

Declare:

```bash
declare -A dict
```

Then assign string keys:

```bash
dict[name]="Shubham"
dict[age]=27
dict[city]="Bilaspur"
```

---

# 58. Associative Array Mental Model

Python dictionary:

```python
student = {
    "name": "Shubham",
    "age": 27,
    "city": "Bilaspur"
}
```

Bash associative array:

```bash
declare -A student

student[name]="Shubham"
student[age]=27
student[city]="Bilaspur"
```

Conceptually:

```text
name → Shubham
age  → 27
city → Bilaspur
```

---

# 59. Access Associative Array Values

Use:

```bash
echo "${dict[name]}"
```

Output:

```text
Shubham
```

Then:

```bash
echo "${dict[age]}"
```

Output:

```text
27
```

And:

```bash
echo "${dict[city]}"
```

Output:

```text
Bilaspur
```

---

# 60. Get Associative Array Keys

Use:

```bash
echo "${!dict[@]}"
```

This gives the keys.

Example:

```bash
declare -A dict

dict[name]="Shubham"
dict[age]=27
dict[city]="Bilaspur"

echo "${!dict[@]}"
```

Possible output:

```text
city age name
```

The order is not guaranteed.

---

# 61. Get Associative Array Values

Use:

```bash
echo "${dict[@]}"
```

Possible output:

```text
Bilaspur 27 Shubham
```

Again, do not rely on associative-array ordering.

---

# 62. Loop Through an Associative Array

Use:

```bash
for key in "${!dict[@]}"; do
    echo "$key = ${dict[$key]}"
done
```

Possible output:

```text
city = Bilaspur
age = 27
name = Shubham
```

The order can differ.

---

# 63. Command Output into an Array

Sometimes you want the output of a command stored as separate array elements.

A common method is:

```bash
mapfile -t arr < <(command)
```

For example:

```bash
mapfile -t files < <(find . -maxdepth 1 -type f)
```

Now each output line becomes an array element.

Inspect:

```bash
printf '%s\n' "${files[@]}"
```

---

# 64. `mapfile` Example with `printf`

Suppose:

```bash
printf '%s\n' apple banana mango > fruits.txt
```

Then:

```bash
mapfile -t fruits < fruits.txt
```

Now:

```bash
echo "${fruits[0]}"
```

Output:

```text
apple
```

And:

```bash
echo "${fruits[1]}"
```

Output:

```text
banana
```

And:

```bash
echo "${fruits[2]}"
```

Output:

```text
mango
```

---

# 65. Command Output Directly into an Array

For commands producing one item per line:

```bash
mapfile -t files < <(find . -maxdepth 1 -type f)
```

The process is:

```text
find
 ↓
produces lines
 ↓
process substitution
 ↓
mapfile
 ↓
Bash array
```

Then:

```bash
for file in "${files[@]}"; do
    echo "$file"
done
```

---

# 66. Another Method: `read -ra`

If command output is whitespace-separated rather than line-oriented:

```bash
read -ra arr <<< "$(command)"
```

Example:

```bash
read -ra arr <<< "$(printf '%s\n' apple banana mango)"
```

Then:

```bash
echo "${arr[@]}"
```

Output:

```text
apple banana mango
```

However, this method splits according to shell `IFS` whitespace rules, so it is not appropriate when individual values can contain spaces.

For line-oriented command output, `mapfile -t` is usually safer.

---

# 67. `$(command)` vs Array Command Capture

A normal variable:

```bash
output=$(command)
```

stores command output in one string.

An array:

```bash
mapfile -t arr < <(command)
```

stores each output line as a separate element.

Compare:

```text
output=$(command)
       ↓
one string
```

versus:

```text
mapfile -t arr < <(command)
       ↓
multiple array elements
```

---

# 68. Complete Array Example

```bash
#!/bin/bash

declare -a fruits

fruits=(apple banana mango)

echo "Number of fruits: ${#fruits[@]}"
echo "Indices: ${!fruits[@]}"
echo "Values: ${fruits[@]}"

fruits+=(orange)

echo "After append: ${fruits[@]}"

unset 'fruits[1]'

echo "After deletion:"
echo "Indices: ${!fruits[@]}"
echo "Values: ${fruits[@]}"
```

Possible output:

```text
Number of fruits: 3
Indices: 0 1 2
Values: apple banana mango
After append: apple banana mango orange
After deletion:
Indices: 0 2 3
Values: apple mango orange
```

---

# 69. Complete Parameter Expansion Example

```bash
text="Hello Bash World"

echo "Original: $text"
echo "Length: ${#text}"
echo "Slice: ${text:6:4}"
echo "Uppercase: ${text^^}"
echo "Lowercase: ${text,,}"
echo "Replace first: ${text/Bash/Linux}"
echo "Replace all: ${text//o/O}"
```

Possible output:

```text
Original: Hello Bash World
Length: 16
Slice: Bash
Uppercase: HELLO BASH WORLD
Lowercase: hello bash world
Replace first: Hello Linux World
Replace all: HellO Bash WOrld
```

---

# 70. Parameter Expansion Mental Model

Think about the operators based on where they operate:

```text
                 VARIABLE
                    |
        ┌───────────┼───────────┐
        ↓           ↓           ↓
      START        MIDDLE       END
        |            |           |
      # / ##       :offset      % / %%
        |            |           |
   remove prefix   substring  remove suffix
```

For replacement:

```text
${var/pat/repl}
        ↓
first match

${var//pat/repl}
        ↓
all matches

${var/#pat/repl}
        ↓
beginning

${var/%pat/repl}
        ↓
end
```

For case:

```text
${var^}     → first uppercase
${var^^}    → all uppercase

${var,}     → first lowercase
${var,,}    → all lowercase
```

---

# 71. Array Mental Model

For indexed arrays:

```text
arr
│
├── 0 → apple
├── 1 → banana
├── 2 → mango
└── 3 → orange
```

```bash
${arr[0]}
```

means:

```text
value at index 0
```

```bash
${arr[@]}
```

means:

```text
all values
```

```bash
${!arr[@]}
```

means:

```text
all existing indices
```

```bash
${#arr[@]}
```

means:

```text
number of elements
```

---

# 72. Important Array Distinction

Do not confuse:

```bash
${#arr[@]}
```

with:

```bash
${!arr[@]}
```

The first:

```bash
${#arr[@]}
```

means:

> How many elements?

The second:

```bash
${!arr[@]}
```

means:

> What are the indexes?

Example:

```bash
arr[0]="apple"
arr[3]="orange"
arr[7]="mango"
```

Then:

```bash
echo "${#arr[@]}"
```

outputs:

```text
3
```

while:

```bash
echo "${!arr[@]}"
```

outputs:

```text
0 3 7
```

---

# 73. `declare` Cheat Sheet

```text
declare -i var
    → integer attribute

declare -l var
    → lowercase attribute

declare -u var
    → uppercase attribute

declare -r var
    → readonly attribute

declare +u var
    → remove uppercase attribute

declare -a arr
    → indexed array

declare -A dict
    → associative array

declare -p var
    → display variable attributes/value
```

---

# 74. Parameter Expansion Cheat Sheet

```text
${var}
    → value

${!H*}
    → variable names beginning with H

${#var}
    → string length

${var:2:2}
    → substring

${var: -3:2}
    → substring using negative offset

${var#pattern}
    → remove shortest prefix

${var##pattern}
    → remove longest prefix

${var%pattern}
    → remove shortest suffix

${var%%pattern}
    → remove longest suffix

${var/pattern/replacement}
    → replace first match

${var//pattern/replacement}
    → replace all matches

${var/#pattern/replacement}
    → replace beginning

${var/%pattern/replacement}
    → replace ending

${var^}
    → first character uppercase

${var^^}
    → all uppercase

${var,}
    → first character lowercase

${var,,}
    → all lowercase
```

---

# 75. Array Cheat Sheet

```text
arr=(a b c)
    → create indexed array

declare -a arr
    → declare indexed array

${arr[0]}
    → element at index 0

${arr[@]}
    → all elements

${!arr[@]}
    → all existing indices

${#arr[@]}
    → number of elements

unset 'arr[1]'
    → delete element at index 1

arr+=(d)
    → append element

declare -A dict
    → associative array

dict[name]="Shubham"
    → key/value assignment

${dict[name]}
    → value for key name

${!dict[@]}
    → all keys

${dict[@]}
    → all values
```

---

# 76. Exam-Oriented Questions

## Q1. What does this do?

```bash
echo ${!H*}
```

### Answer

It expands to the names of shell variables whose names begin with `H`.

---

## Q2. What does this return if `USER=shubham`?

```bash
echo "${#USER}"
```

### Answer

```text
7
```

---

## Q3. What does this do?

```bash
echo "${USER:2:2}"
```

### Answer

It starts at index `2` and extracts `2` characters.

For:

```text
shubham
```

the result is:

```text
ub
```

---

## Q4. What does this do?

```bash
echo "${USER: -3:2}"
```

### Answer

It starts 3 characters from the right and extracts 2 characters.

For:

```text
shubham
```

the result is:

```text
ha
```

---

## Q5. What is the difference between `#` and `##`?

### Answer

```text
#  → shortest matching prefix
## → longest matching prefix
```

---

## Q6. What is the difference between `%` and `%%`?

### Answer

```text
%  → shortest matching suffix
%% → longest matching suffix
```

---

## Q7. Extract the filename from:

```bash
path="/home/user/docs/report.pdf"
```

### Answer

```bash
echo "${path##*/}"
```

Output:

```text
report.pdf
```

---

## Q8. Remove the extension from:

```bash
file="report.pdf"
```

### Answer

```bash
echo "${file%.*}"
```

Output:

```text
report
```

---

## Q9. Replace every `cat` with `dog`.

```bash
text="cat cat cat"
```

### Answer

```bash
echo "${text//cat/dog}"
```

---

## Q10. Replace only the first `cat`.

### Answer

```bash
echo "${text/cat/dog}"
```

---

## Q11. Convert a variable to uppercase.

### Answer

```bash
echo "${var^^}"
```

---

## Q12. What does this do?

```bash
declare -i number
```

### Answer

It gives `number` the integer attribute.

---

## Q13. What does this do?

```bash
declare -l name
```

### Answer

It makes assigned values automatically lowercase.

---

## Q14. What does this do?

```bash
declare -u name
```

### Answer

It makes assigned values automatically uppercase.

---

## Q15. How do you remove the uppercase attribute?

### Answer

```bash
declare +u name
```

---

## Q16. How do you create an indexed array?

### Answer

```bash
declare -a arr
```

or:

```bash
arr=(apple banana mango)
```

---

## Q17. How do you find the number of array elements?

### Answer

```bash
echo "${#arr[@]}"
```

---

## Q18. How do you find the indexes?

### Answer

```bash
echo "${!arr[@]}"
```

---

## Q19. How do you delete element 2?

### Answer

```bash
unset 'arr[2]'
```

---

## Q20. How do you append an element?

### Answer

```bash
arr+=(new_element)
```

---

## Q21. How do you create an associative array?

### Answer

```bash
declare -A dict
```

---

## Q22. How do you capture command output as separate array elements?

### Answer

For line-oriented output:

```bash
mapfile -t arr < <(command)
```

---

# 77. Final Master Mental Model

```text
                 BASH VARIABLE
                       |
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
    Inspect        Manipulate       Restrict
        |              |              |
     ${!H*}        ${#var}        declare -i
                    ${var:...}     declare -l
                    ${var#...}     declare -u
                    ${var%...}     declare -r
                    ${var/...}
                    ${var^^}
                    ${var,,}
                       |
                       ↓
                    ARRAYS
                       |
          ┌────────────┴────────────┐
          ↓                         ↓
    Indexed Array             Associative Array
          |                         |
      declare -a                 declare -A
          |                         |
      arr[0]=value              dict[key]=value
          |                         |
      ${arr[@]}                  ${dict[@]}
      ${!arr[@]}                 ${!dict[@]}
      ${#arr[@]}
          |
          ↓
      Command Output
          |
    ┌─────┴──────┐
    ↓            ↓
  String       Array
$(command)   mapfile -t
```

The most important patterns to memorize are:

```text
${#var}
    → length

${var:start:length}
    → slice

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

${var/#pat/repl}
    → replacement at beginning

${var/%pat/repl}
    → replacement at end

${var^}
    → first uppercase

${var^^}
    → all uppercase

${var,}
    → first lowercase

${var,,}
    → all lowercase

${arr[@]}
    → array values

${!arr[@]}
    → array indices

${#arr[@]}
    → number of array elements

unset 'arr[index]'
    → delete array element

arr+=(value)
    → append

declare -A dict
    → associative array

mapfile -t arr < <(command)
    → command output → array
```

The central idea is:

```text
Bash parameter expansion
        ↓
manipulate data directly
        ↓
without necessarily calling external commands
        ↓
strings + paths + filenames + arrays + configuration
```

This is one of the most powerful parts of Bash and is heavily useful in **shell scripting, Linux administration, automation, DevOps**.
