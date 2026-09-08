---
layout: default
title: "L4.1: Pattern Matching - Part 01"
---

# L4.1: Pattern Matching - Part 01



# Regular Expressions and `grep`

## 1. What Is Regex?

**Regex** stands for **Regular Expression**.

A regular expression is a pattern used to search, match, validate, or manipulate text.

Instead of searching only for an exact word:

```bash
grep "hello" file.txt
```

you can describe a pattern:

```bash
grep "h.llo" file.txt
```

Here:

```text
. → any single character
```

So:

```text
hello
hallo
hullo
h9llo
```

can all match:

```text
h.llo
```

---

# 2. Why Do We Need Regex?

Suppose a file contains:

```text
cat
car
can
dog
cart
cap
```

If you search:

```bash
grep "ca" file.txt
```

you get many lines containing `ca`.

But perhaps you specifically want:

```text
ca + exactly one character
```

Regex allows you to describe this:

```bash
grep 'ca.' file.txt
```

Regex is useful for:

- Searching text
- Extracting information
- Validating input
- Processing logs
- Finding patterns in files
- Shell scripting
- `grep`
- `sed`
- `awk`
- `vim`
- Programming languages
- Data cleaning

---

# 3. Basic Regex Mental Model

Think of regex as a **pattern language**.

For example:

```text
cat
```

means:

```text
c followed by a followed by t
```

Whereas:

```text
c.t
```

means:

```text
c
+
any one character
+
t
```

Therefore:

```text
cat
cot
cut
c9t
```

can match:

```text
c.t
```

---

# 4. Regex Special Characters

Some characters have special meanings in regex.

Important metacharacters include:

```text
.  ^  $  *  [ ]  \  { }  ( )  |
```

Their meanings depend partly on whether you are using:

- Basic Regular Expressions (BRE)
- Extended Regular Expressions (ERE)

For example:

```text
grep
```

normally uses BRE.

```bash
egrep
```

is equivalent to:

```bash
grep -E
```

and uses ERE.

---

# 5. Literal Characters vs Special Characters

Normal characters usually match themselves.

Example:

```bash
grep 'cat' file.txt
```

matches:

```text
cat
```

Regex metacharacters have special meanings.

For example:

```text
.
```

means:

```text
Any single character
```

If you want to search for a literal dot:

```text
.
```

you need to escape it:

```text
\.
```

---

# 6. Important Regex Operators

| Regex | Meaning |
|---|---|
| `.` | Any single character |
| `^` | Beginning of line |
| `$` | End of line |
| `*` | Zero or more repetitions |
| `[abc]` | One character from `a`, `b`, `c` |
| `[^abc]` | One character not in `a`, `b`, `c` |
| `[a-z]` | One character from `a` through `z` |
| `\{m,n\}` | Between `m` and `n` repetitions in BRE |
| `\(` `\)` | Capture group in BRE |
| `\1` | Backreference to first captured group |
| `+` | One or more in ERE |
| `?` | Zero or one in ERE |
| `()` | Grouping in ERE |
| `|` | OR in ERE |
| `\b` | Word boundary in GNU `grep` |

---

# 7. Character Classes

A character class is written using square brackets:

```text
[...]
```

It matches **one character** from the specified set.

Example:

```text
[abc]
```

matches:

```text
a
b
c
```

It does not match:

```text
abc
```

as a three-character sequence.

It matches one character.

---

# 8. Character Class Example

Suppose:

```text
cat
bat
rat
mat
sat
```

Regex:

```text
[cb]at
```

matches:

```text
cat
bat
```

because the first character must be either:

```text
c
```

or:

```text
b
```

---

# 9. Ranges in Character Classes

You can specify a range.

Example:

```text
[1-5]
```

matches one of:

```text
1
2
3
4
5
```

Example:

```bash
grep 'pat[1-5]tern' file
```

matches:

```text
pat1tern
pat2tern
pat3tern
pat4tern
pat5tern
```

but not:

```text
pat6tern
```

---

# 10. Negated Character Classes

Place `^` immediately after `[`:

```text
[^1-5]
```

This means:

> Match one character that is NOT in the range `1` through `5`.

Example:

```bash
grep 'pat[^1-5]tern' file
```

matches:

```text
pat6tern
pat7tern
patAtern
patxtern
```

but does not match:

```text
pat1tern
pat2tern
pat3tern
pat4tern
pat5tern
```

### Important

The `^` has a special meaning as negation only when it appears immediately after `[`.

Compare:

```text
^pattern
```

with:

```text
[^1-5]
```

They mean completely different things.

---

# 11. Anchors: `^` and `$`

Two extremely important regex operators are:

```text
^
$
```

## `^`

Matches the beginning of a line.

Example:

```bash
grep '^pattern' file
```

matches lines beginning with:

```text
pattern
```

For example:

```text
pattern123
pattern abc
pattern
```

But not:

```text
hello pattern
abcpattern
```

---

## `$`

Matches the end of a line.

Example:

```bash
grep 'pattern$' file
```

matches:

```text
hello pattern
pattern
abcpattern
```

but not:

```text
pattern hello
pattern123
```

---

# 12. Beginning and End Together

You can combine both:

```text
^pattern$
```

This means:

> The entire line must be exactly `pattern`.

Example:

```bash
grep '^pattern$' file
```

matches:

```text
pattern
```

but not:

```text
pattern123
hello pattern
pattern hello
```

This is useful for exact-line matching.

---

# 13. The Dot `.`

The dot means:

> Match any single character except newline.

Example:

```bash
grep 'pattern.pattern' file
```

The pattern:

```text
pattern.pattern
```

means:

```text
pattern
+
any one character
+
pattern
```

It can match:

```text
patternXpattern
pattern1pattern
pattern-pattern
pattern_pattern
```

---

# 14. Dot Does Not Mean Literal Dot

This:

```bash
grep 'file.txt' file
```

does not necessarily mean a literal dot.

The `.` is a regex metacharacter.

It can match:

```text
fileXtxt
file1txt
file-txt
```

If you want a literal dot:

```bash
grep 'file\.txt' file
```

Now the dot is treated literally.

---

# 15. Escaping Special Characters

The backslash:

```text
\
```

can change the meaning of a character.

For example:

```text
\.
```

means:

```text
literal .
```

So:

```bash
grep '\.' file
```

searches for a literal dot.

Example matching lines:

```text
hello.world
192.168.1.1
file.txt
```

---

# 16. `\b` — Word Boundary

GNU `grep` supports:

```text
\b
```

as a word boundary.

Example:

```bash
grep 'pattern\b' file
```

This matches `pattern` when it ends at a word boundary.

For example:

```text
pattern
pattern123
pattern-test
```

The exact behavior depends on what characters follow and how GNU `grep` defines word characters.

A useful example is:

```bash
grep '\bpattern\b' file
```

which searches for `pattern` as a complete word.

It avoids matching:

```text
patterns
mypattern
pattern123
```

---

# 17. `grep`

The basic syntax is:

```bash
grep PATTERN FILE
```

Example:

```bash
grep 'hello' file.txt
```

This searches `file.txt` for lines matching:

```text
hello
```

---

# 18. `grep` Pattern File

General form:

```bash
grep 'pattern' file
```

Example:

```bash
grep 'error' log.txt
```

This prints lines containing a match for:

```text
error
```

Regex makes the pattern much more powerful.

---

# 19. `cat file | grep pattern`

You can also write:

```bash
cat file | grep 'pattern'
```

This sends the output of `cat` into `grep`.

Conceptually:

```text
file
 ↓
cat
 ↓
stdout
 ↓
pipe
 ↓
grep
 ↓
matching lines
```

However, when `grep` can read the file directly, this is usually simpler:

```bash
grep 'pattern' file
```

instead of:

```bash
cat file | grep 'pattern'
```

This is sometimes called a **useless use of `cat`**, although the pipeline can still be useful when the input is coming from another command.

---

# 20. `grep 'pattern.pattern'`

Example:

```bash
cat file | grep 'pattern.pattern'
```

Here:

```text
pattern.pattern
```

means:

```text
pattern
+
any one character
+
pattern
```

Matches include:

```text
patternXpattern
pattern1pattern
pattern-pattern
```

---

# 21. `grep 'pattern$'`

Example:

```bash
cat file | grep 'pattern$'
```

The `$` anchors the pattern to the end of the line.

Matches:

```text
pattern
hello pattern
abcpattern
```

Does not match:

```text
pattern hello
pattern123
```

---

# 22. `grep '\.'`

Example:

```bash
cat file | grep '\.'
```

The pattern:

```text
\.
```

means:

> Literal dot.

It matches lines containing:

```text
.
```

For example:

```text
hello.world
example.com
192.168.1.1
```

---

# 23. `grep '^pattern'`

Example:

```bash
cat file | grep '^pattern'
```

The `^` means:

> Start of line.

Matches:

```text
pattern
pattern123
pattern hello
```

Does not match:

```text
hello pattern
abcpattern
```

---

# 24. `grep 'pattern\b'`

Example:

```bash
cat file | grep 'pattern\b'
```

This searches for `pattern` followed by a word boundary.

A more useful complete-word search is:

```bash
grep '\bpattern\b' file
```

This means:

```text
word boundary
+
pattern
+
word boundary
```

---

# 25. `grep 'patt[ern]'`

Example:

```bash
cat file | grep 'patt[ern]'
```

The character class:

```text
[ern]
```

matches exactly one character:

```text
e
r
n
```

Therefore the pattern matches:

```text
patte
pattr
pattn
```

as substrings.

It does **not** mean:

```text
pattern
```

or:

```text
patter
```

as a whole.

### Important Character-Class Rule

```text
[abc]
```

means:

```text
one character: a OR b OR c
```

It does not mean:

```text
abc
```

---

# 26. `grep 'pat.*tern'`

A very important regex combination is:

```text
.*
```

`.*` means:

```text
zero or more characters
```

because:

```text
.
```

means one arbitrary character, and:

```text
*
```

means zero or more repetitions of the preceding expression.

Therefore:

```text
pat.*tern
```

can match:

```text
pattern
patXtern
pat123tern
pat anything here tern
```

The middle part can contain zero or more characters.

---

# 27. Why Does `.*` Match So Much?

Consider:

```text
pat.*tern
```

Break it down:

```text
pat
```

must appear first.

Then:

```text
.*
```

can consume zero or more characters.

Then:

```text
tern
```

must appear.

Therefore:

```text
pattern
```

matches because:

```text
pat
+
""
+
tern
```

There are zero characters between `pat` and `tern`.

And:

```text
patABCtern
```

matches because:

```text
pat
+
ABC
+
tern
```

---

# 28. `grep '\bpat.*tern'`

Example:

```bash
cat file | grep '\bpat.*tern'
```

Breakdown:

```text
\b
```

→ word boundary

```text
pat
```

→ literal `pat`

```text
.*
```

→ zero or more characters

```text
tern
```

→ literal `tern`

So the pattern starts at a word boundary, then finds `pat`, allows arbitrary characters, and finally finds `tern`.

---

# 29. Repetition with `\{m,n\}` in BRE

Basic `grep` uses Basic Regular Expressions.

In BRE, interval repetition is commonly written as:

```text
\{m,n\}
```

Meaning:

> Repeat the previous atom between `m` and `n` times.

Example:

```bash
grep 'pattern\{2,4\}' file
```

means:

```text
p a t t e r n
```

repeated 2 to 4 times.

It can match:

```text
patternpattern
patternpatternpattern
patternpatternpatternpattern
```

---

# 30. `\{2,4\}` Breakdown

Consider:

```text
pattern\{2,4\}
```

Breakdown:

```text
pattern
```

is the atom being repeated.

```text
\{2,4\}
```

means:

```text
repeat previous atom 2 through 4 times
```

Therefore:

```text
patternpattern
```

matches.

So does:

```text
patternpatternpattern
```

and:

```text
patternpatternpatternpattern
```

---

# 31. Exact Repetition

You can specify exactly how many times.

In BRE:

```text
pattern\{3\}
```

means:

```text
pattern
```

repeated exactly 3 times.

Example:

```bash
grep 'pattern\{3\}' file
```

matches:

```text
patternpatternpattern
```

---

# 32. Minimum Repetition

You can also specify a minimum.

For example:

```text
pattern\{2,\}
```

means:

> At least two repetitions.

So it can match:

```text
patternpattern
patternpatternpattern
patternpatternpatternpattern
...
```

---

# 33. Backreferences

A **backreference** allows a regex to refer back to text captured earlier.

This is a powerful concept.

Suppose we want to find repeated text:

```text
hellohello
```

We can capture:

```text
hello
```

and then require the same text again.

---

# 34. Capturing Groups in Basic `grep`

Basic `grep` uses escaped parentheses for grouping:

```text
\(...\)
```

For example:

```text
\(pattern\)
```

captures:

```text
pattern
```

The first captured group can then be referenced with:

```text
\1
```

---

# 35. Backreference Example

Consider:

```bash
grep '\(pattern\)\1' file
```

Breakdown:

```text
\(pattern\)
```

captures:

```text
pattern
```

Then:

```text
\1
```

means:

> Match exactly the same text captured by group 1.

Therefore the complete pattern means:

```text
patternpattern
```

---

# 36. Why Backreferences Are Useful

Without a backreference:

```text
patternpattern
```

could be matched literally.

But the power of a backreference is that the captured text can be variable.

For example:

```text
\(foo\)\1
```

matches:

```text
foofoo
```

but also:

```text
\(bar\)\1
```

would match:

```text
barbar
```

The same concept can be used with a general character pattern.

---

# 37. Capture Any Word and Match It Again

A simplified example:

```bash
grep '\b\([[:alnum:]_]\+\)\b.*\b\1\b' file
```

This attempts to find a word that occurs again later in the line.

The important concept is:

```text
\( ... \)
    ↓
capture

\1
    ↓
reuse captured text
```

Backreferences are especially useful for detecting repeated words or duplicated structures.

---

# 38. Backreference Example with a Character

Consider:

```bash
grep '\([a-z]\)\1' file
```

This captures one lowercase letter and requires the same letter immediately afterward.

It can match:

```text
book
coffee
letter
```

because they contain repeated characters such as:

```text
oo
ff
tt
```

### Breakdown

```text
\([a-z]\)
```

captures one letter.

Then:

```text
\1
```

requires that same letter again.

So:

```text
\(o\)\1
```

matches:

```text
oo
```

---

# 39. Operator Precedence

Regex operators do not all have the same priority.

A useful conceptual order is:

```text
1. Grouping
2. Repetition
3. Concatenation
4. Alternation
```

For example:

```text
(ab)*
```

means:

```text
repeat the group "ab"
```

while:

```text
a(b*)
```

means:

```text
a followed by zero or more b's
```

These are different.

---

# 40. Why Precedence Matters

Compare:

```text
ab*
```

and:

```text
(ab)*
```

### `ab*`

Means:

```text
a
+
zero or more b's
```

Matches:

```text
a
ab
abb
abbb
```

### `(ab)*`

Means:

```text
zero or more repetitions of "ab"
```

Matches:

```text
""
ab
abab
ababab
```

The grouping changes what `*` applies to.

---

# 41. `egrep`

Historically:

```bash
egrep
```

means Extended `grep`.

The modern equivalent is:

```bash
grep -E
```

So:

```bash
egrep 'M+' file
```

is equivalent to:

```bash
grep -E 'M+' file
```

For new scripts, `grep -E` is generally preferred because `egrep` is considered a legacy name.

---

# 42. `M+`

In Extended Regular Expressions:

```text
+
```

means:

> One or more repetitions of the previous atom.

Therefore:

```text
M+
```

matches:

```text
M
MM
MMM
MMMM
...
```

Example:

```bash
cat file | egrep 'M+'
```

matches lines containing one or more consecutive `M` characters.

---

# 43. `^M+`

Example:

```bash
cat file | egrep '^M+'
```

Breakdown:

```text
^
```

→ beginning of line

```text
M+
```

→ one or more `M` characters

Therefore:

```text
^M+
```

matches lines that begin with:

```text
M
```

or:

```text
MM
```

or:

```text
MMM
```

and so on.

Examples:

```text
Mhello
MMhello
MMMabc
```

match.

```text
helloM
abcMM
```

do not match.

---

# 44. `^M*`

Example:

```bash
cat file | egrep '^M*'
```

Breakdown:

```text
^
```

→ beginning of line

```text
M*
```

→ zero or more `M` characters

This is an important difference from:

```text
^M+
```

because `*` allows **zero** occurrences.

Therefore, `^M*` technically matches the beginning of **every line**, because zero `M`s is allowed.

### Compare

```text
^M+
```

→ line must begin with at least one `M`

```text
^M*
```

→ line may begin with zero or more `M`s

---

# 45. `M*` vs `M.*`

This is a very important regex distinction.

Compare:

```text
M*
```

and:

```text
M.*
```

## `M*`

Means:

```text
zero or more M characters
```

Matches:

```text
""
M
MM
MMM
```

The repeated thing is only:

```text
M
```

---

## `M.*`

Means:

```text
M
+
zero or more arbitrary characters
```

So it requires an `M` first.

Examples:

```text
Ma
Mabc
M123xyz
Mhello world
```

can match.

---

# 46. `M*a` vs `M.*a`

This distinction is often asked in exams.

## Pattern 1

```text
M*a
```

Meaning:

```text
zero or more M's
+
a
```

Matches:

```text
a
Ma
MMa
MMMa
```

It does not match:

```text
M123a
```

because the middle characters must all be `M`.

---

## Pattern 2

```text
M.*a
```

Meaning:

```text
M
+
zero or more arbitrary characters
+
a
```

Matches:

```text
Ma
M123a
Mhelloa
MabcXYZa
```

### Key Difference

```text
M*a
```

allows only:

```text
M M M M ...
```

before `a`.

```text
M.*a
```

allows:

```text
anything
```

between the initial `M` and final `a`.

---

# 47. Grouping with `()`

Extended regex supports grouping using:

```text
(...)
```

For example:

```text
(ma)+
```

means:

> Repeat the group `ma` one or more times.

This is different from:

```text
ma+
```

---

# 48. `(ma)+`

Example:

```bash
cat file | egrep '(ma)+'
```

The group is:

```text
(ma)
```

and:

```text
+
```

means one or more repetitions.

So it matches:

```text
ma
mama
mamama
mamamama
```

because:

```text
ma
ma ma
ma ma ma
...
```

---

# 49. `(ma)*`

Example:

```bash
cat file | egrep '(ma)*'
```

Here:

```text
*
```

means zero or more repetitions of the entire group:

```text
(ma)
```

Therefore it can match:

```text
""
ma
mama
mamama
...
```

Because zero repetitions are allowed, this pattern can match at an empty position in essentially every line.

---

# 50. `(ma)+` vs `(ma)*`

| Pattern | Meaning |
|---|---|
| `(ma)+` | One or more `ma` groups |
| `(ma)*` | Zero or more `ma` groups |

Examples:

```text
(ma)+
```

matches:

```text
ma
mama
mamama
```

while:

```text
(ma)*
```

also permits zero repetitions.

---

# 51. Alternation `|`

Extended regex provides:

```text
|
```

which means:

> OR

Example:

```bash
cat file | egrep '(ED|ME)'
```

means:

```text
ED
OR
ME
```

So it matches lines containing either:

```text
ED
```

or:

```text
ME
```

---

# 52. `(ED|ME)`

Breakdown:

```text
(
    ED
    |
    ME
)
```

The parentheses group the alternatives.

The `|` means:

```text
ED OR ME
```

Therefore:

```text
ED
```

matches.

```text
ME
```

matches.

```text
EDME
```

also contains a match, because `grep` searches for matching substrings.

---

# 53. Why Parentheses Matter with `|`

Compare:

```text
ED|ME
```

and:

```text
(ED|ME)
```

When used as part of a larger regex, grouping determines what the alternation applies to.

For example:

```text
^(ED|ME)
```

means:

> The line must begin with either `ED` or `ME`.

But:

```text
^ED|ME
```

is interpreted as:

```text
(^ED) | (ME)
```

So it can match either a line beginning with `ED` or `ME` anywhere in the line.

This is a classic precedence issue.

---

# 54. Character Class vs Alternation

These can sometimes look similar:

```text
[EM]
```

and:

```text
(E|M)
```

But they work at different levels.

```text
[EM]
```

means:

> One character: `E` or `M`.

```text
(E|M)
```

means:

> One alternative: `E` or `M`.

For multiple-character alternatives:

```text
(ED|ME)
```

is required.

A character class cannot represent multi-character alternatives.

---

# 55. BRE vs ERE

This is extremely important for `grep`.

## Basic Regular Expressions

Default:

```bash
grep 'pattern' file
```

Some operators require backslashes:

```text
\(
\)
\{
\}
```

For example:

```bash
grep '\(ab\)\{2,4\}' file
```

---

## Extended Regular Expressions

Use:

```bash
grep -E 'pattern' file
```

or historically:

```bash
egrep 'pattern' file
```

Operators become easier to write:

```text
()
+
?
{}
|
```

For example:

```bash
grep -E '(ab){2,4}' file
```

---

# 56. Comparison Table

| Meaning | BRE (`grep`) | ERE (`grep -E`) |
|---|---|---|
| Grouping | `\(...\)` | `(...)` |
| Alternation | `\|` in GNU BRE | `\|`/`|` behavior differs; use `|` in ERE |
| One or more | `\+` in GNU BRE | `+` |
| Zero or one | `\?` in GNU BRE | `?` |
| Interval | `\{m,n\}` | `{m,n}` |
| Backreference | `\1` | `\1` |
| Character class | `[abc]` | `[abc]` |
| Any character | `.` | `.` |
| Start | `^` | `^` |
| End | `$` | `$` |

For portability and clarity, remember that `grep -E` uses the familiar extended forms.

---

# 57. Correcting Common Lecture Typing Issues

When writing regex, pay close attention to these characters.

### Beginning-of-line anchor

Correct:

```text
^pattern
```

Not:

```text
ˆpattern
```

The second character can be a different Unicode character (`ˆ`) rather than the ASCII regex anchor `^`.

---

### Literal dot

Correct:

```text
\.
```

---

### Zero or more characters

Correct:

```text
.*
```

---

### Backreference

Correct:

```text
\1
```

---

### BRE grouping

Correct:

```text
\(pattern\)
```

---

### BRE repetition

Correct:

```text
\{2,4\}
```

---

# 58. Regex Atoms

An **atom** is a basic unit that can be repeated or combined.

Examples:

```text
a
.
[abc]
\(abc\)
```

Then quantifiers can operate on an atom.

For example:

```text
a*
```

Here:

```text
a
```

is the atom.

```text
*
```

repeats it.

For:

```text
(ab)*
```

the atom is the entire group:

```text
(ab)
```

---

# 59. Quantifiers

Quantifiers describe how many times something can occur.

Common ones in ERE:

```text
*
+
?
{m}
{m,n}
{m,}
```

Meaning:

| Quantifier | Meaning |
|---|---|
| `*` | Zero or more |
| `+` | One or more |
| `?` | Zero or one |
| `{m}` | Exactly `m` |
| `{m,n}` | Between `m` and `n` |
| `{m,}` | At least `m` |

---

# 60. Important Difference: `*` vs `+`

```text
M*
```

means:

```text
zero or more M
```

So zero `M`s are allowed.

```text
M+
```

means:

```text
one or more M
```

At least one `M` is required.

Therefore:

```text
M*
```

can match:

```text
""
M
MM
MMM
```

while:

```text
M+
```

matches:

```text
M
MM
MMM
```

but not zero `M`s.

---

# 61. Practical Regex Breakdown Technique

Whenever you see a complicated regex, break it into pieces.

Example:

```text
\bpat.*tern
```

Break it:

```text
\b
```

Word boundary

```text
pat
```

Literal characters

```text
.*
```

Zero or more arbitrary characters

```text
tern
```

Literal characters

Then combine:

```text
word boundary
     +
pat
     +
anything
     +
tern
```

This is much easier than trying to understand the entire regex at once.

---

# 62. Another Breakdown Example

Consider:

```text
^(M+)
```

Breakdown:

```text
^
```

Beginning of line

```text
(M+)
```

Group containing:

```text
M+
```

which means one or more `M`s.

Therefore:

```text
^(M+)
```

matches one or more `M`s at the beginning of the line.

---

# 63. Advanced Example: Repeated Group

Regex:

```text
(ma)+
```

Breakdown:

```text
(ma)
```

Group.

```text
+
```

One or more repetitions.

Possible matches:

```text
ma
mama
mamama
mamamama
```

---

# 64. Advanced Example: Alternatives

Regex:

```text
(ED|ME)
```

Breakdown:

```text
ED
```

OR:

```text
ME
```

Therefore:

```text
ED
```

and:

```text
ME
```

are both valid matches.

---

# 65. Advanced Example: Repeated Captured Text

Regex:

```text
\(pattern\)\1
```

Breakdown:

```text
\(pattern\)
```

Capture:

```text
pattern
```

Then:

```text
\1
```

requires the same captured text again.

So:

```text
patternpattern
```

matches.

---

# 66. Common Regex Mistakes

## Mistake 1: Thinking `.` means literal dot

Wrong understanding:

```text
.
```

means a literal period.

Correct:

```text
.
```

means any single character.

For a literal period:

```text
\.
```

---

## Mistake 2: Confusing `*` with `+`

```text
*
```

allows zero occurrences.

```text
+
```

requires at least one occurrence.

---

## Mistake 3: Confusing `[abc]` with `(abc)`

```text
[abc]
```

means one character:

```text
a OR b OR c
```

Whereas:

```text
(abc)
```

groups the complete sequence:

```text
abc
```

---

## Mistake 4: Forgetting `^` position in a character class

```text
[^0-9]
```

means:

> Not a digit.

But:

```text
[0-9^]
```

means:

> A digit or literal `^`.

The position of `^` matters.

---

## Mistake 5: Using BRE syntax with ERE

Default:

```bash
grep 'a\{2,4\}' file
```

uses BRE interval syntax.

With:

```bash
grep -E 'a{2,4}' file
```

the braces do not need the BRE escaping.

---

# 67. Regex Practice Dataset

Create a file:

```bash
cat > regex.txt
```

Enter:

```text
pattern
pattern123
hello pattern
pattern hello
patternXpattern
pattern1pattern
pattern-pattern
hello.world
192.168.1.1
mypattern
patterns
pat1tern
pat2tern
pat3tern
pat5tern
pat6tern
M
MM
MMM
MMMM
Ma
M123a
Mhelloa
a
Ma
MMa
MMMa
ma
mama
mamama
ED
ME
employee
MED
EDUCATION
```

Press:

```text
Ctrl-D
```

to finish.

---

# 68. Practice 1 — Beginning of Line

Find lines beginning with:

```text
pattern
```

### Solution

```bash
grep '^pattern' regex.txt
```

---

# 69. Practice 2 — End of Line

Find lines ending with:

```text
pattern
```

### Solution

```bash
grep 'pattern$' regex.txt
```

---

# 70. Practice 3 — Literal Dot

Find lines containing a literal dot.

### Solution

```bash
grep '\.' regex.txt
```

---

# 71. Practice 4 — One Arbitrary Character

Find occurrences of:

```text
pattern
+
one character
+
pattern
```

### Solution

```bash
grep 'pattern.pattern' regex.txt
```

---

# 72. Practice 5 — Character Class

Find:

```text
pat1tern
pat2tern
pat3tern
pat4tern
pat5tern
```

### Solution

```bash
grep 'pat[1-5]tern' regex.txt
```

---

# 73. Practice 6 — Negated Character Class

Find:

```text
pat
+
one character other than 1-5
+
tern
```

### Solution

```bash
grep 'pat[^1-5]tern' regex.txt
```

---

# 74. Practice 7 — One or More `M`

Find lines containing one or more consecutive `M`s.

### Solution

Using ERE:

```bash
grep -E 'M+' regex.txt
```

or:

```bash
egrep 'M+' regex.txt
```

---

# 75. Practice 8 — `M` at Beginning

Find lines beginning with one or more `M`s.

### Solution

```bash
grep -E '^M+' regex.txt
```

---

# 76. Practice 9 — `M*`

Find lines using:

```text
^M*
```

### Solution

```bash
grep -E '^M*' regex.txt
```

### Important Observation

This will match essentially every line because:

```text
M*
```

allows zero `M`s.

This is a common exam trick.

---

# 77. Practice 10 — `M*a`

Find strings consisting of zero or more `M`s followed by `a`.

### Solution

```bash
grep -E 'M*a' regex.txt
```

Matches examples such as:

```text
a
Ma
MMa
MMMa
```

---

# 78. Practice 11 — `M.*a`

Find a line containing:

```text
M
+
anything
+
a
```

### Solution

```bash
grep -E 'M.*a' regex.txt
```

This can match:

```text
Ma
M123a
Mhelloa
```

---

# 79. Practice 12 — Repeated `ma`

Find one or more repetitions of:

```text
ma
```

### Solution

```bash
grep -E '(ma)+' regex.txt
```

Matches:

```text
ma
mama
mamama
```

---

# 80. Practice 13 — Zero or More `ma`

Find zero or more repetitions of the group `ma`.

### Solution

```bash
grep -E '(ma)*' regex.txt
```

Remember:

```text
*
```

allows zero repetitions.

Therefore this pattern can match at an empty position.

---

# 81. Practice 14 — `ED` or `ME`

Find lines containing either:

```text
ED
```

or:

```text
ME
```

### Solution

```bash
grep -E '(ED|ME)' regex.txt
```

---

# 82. Practice 15 — Repeated `pattern`

Find `pattern` repeated two to four times.

Using basic `grep`:

```bash
grep 'pattern\{2,4\}' regex.txt
```

Using extended `grep`:

```bash
grep -E 'pattern{2,4}' regex.txt
```

---

# 83. Practice 16 — Backreference

Find a repeated copy of the same word:

```text
wordword
```

A simplified example for `pattern` specifically:

```bash
grep '\(pattern\)\1' regex.txt
```

This means:

```text
capture pattern
+
match the captured pattern again
```

---

# 84. Practice 17 — Repeated Character Using Backreference

Find consecutive duplicate lowercase characters.

### Solution

```bash
grep -E '([a-z])\1' regex.txt
```

Examples that can match:

```text
book
coffee
letter
```

because they contain:

```text
oo
ff
tt
```

---

# 85. Practice 18 — Complete Word

Find `pattern` as a complete word rather than part of another word.

### Solution

```bash
grep '\bpattern\b' regex.txt
```

This avoids matches such as:

```text
mypattern
patterns
```

---

# 86. Practice 19 — `pat.*tern`

Find lines containing:

```text
pat
```

followed later by:

```text
tern
```

with any number of characters in between.

### Solution

```bash
grep 'pat.*tern' regex.txt
```

---

# 87. Practice 20 — Beginning + Repetition

Find lines that begin with at least two `M`s.

### Solution

```bash
grep -E '^MM+' regex.txt
```

Breakdown:

```text
^
```

→ beginning

```text
M
```

→ first M

```text
M+
```

→ one or more additional M's

Therefore the total is at least two `M`s.

---

# 88. Exam-Level Comparison Questions

## Question 1

What is the difference between:

```text
M*a
```

and:

```text
M.*a
```

### Answer

```text
M*a
```

means:

```text
zero or more M characters
followed by a
```

Examples:

```text
a
Ma
MMa
```

Whereas:

```text
M.*a
```

means:

```text
M
followed by zero or more arbitrary characters
followed by a
```

Examples:

```text
Ma
M123a
Mhelloa
```

---

# 89. Exam-Level Comparison: `*` vs `+`

```text
M*
```

means:

```text
zero or more M
```

while:

```text
M+
```

means:

```text
one or more M
```

Therefore:

```text
M*
```

allows zero occurrences.

```text
M+
```

does not.

---

# 90. Exam-Level Comparison: `[]` vs `()`

```text
[abc]
```

means:

```text
one character: a, b, or c
```

while:

```text
(abc)
```

means:

```text
the sequence abc as a group
```

And:

```text
(ab|cd)
```

means:

```text
ab OR cd
```

---

# 91. Exam-Level Comparison: `^M+` vs `^M*`

```text
^M+
```

means:

```text
start of line
+
at least one M
```

while:

```text
^M*
```

means:

```text
start of line
+
zero or more M
```

Because zero M is allowed by `*`, `^M*` can match the beginning of every line.

---

# 92. Exam-Level Comparison: `.` vs `\.`

```text
.
```

means:

```text
any single character
```

while:

```text
\.
```

means:

```text
literal dot
```

Example:

```bash
grep 'a.b' file
```

can match:

```text
aXb
a1b
a-b
```

while:

```bash
grep 'a\.b' file
```

matches:

```text
a.b
```

---

# 93. Exam-Level Comparison: `grep` vs `grep -E`

```bash
grep 'a\{2,4\}' file
```

uses Basic Regular Expression syntax.

```bash
grep -E 'a{2,4}' file
```

uses Extended Regular Expression syntax.

Likewise:

```bash
grep -E '(ab)+'
```

uses ordinary parentheses and `+`.

With GNU BRE, equivalent concepts can require escaping:

```bash
grep '\(ab\)\+' file
```

---

# 94. Regex Operator Cheat Sheet

```text
.          any single character

^          beginning of line

$          end of line

*          zero or more of previous atom

+          one or more of previous atom (ERE)

?          zero or one of previous atom (ERE)

[abc]      one character: a/b/c

[a-z]      one character in a-z

[0-9]      one digit

[^0-9]     one character that is not a digit

\{m,n\}    m through n repetitions in BRE

{m,n}      m through n repetitions in ERE

\( ... \)  capture group in BRE

(...)      capture/group in ERE

\1         first captured group

|          OR in ERE

\b         word boundary in GNU grep

.*         zero or more arbitrary characters
```

---

# 95. The Most Important Regex Mental Models

## `.`

```text
.
↓
ONE arbitrary character
```

## `*`

```text
X*
↓
ZERO or more X
```

## `+`

```text
X+
↓
ONE or more X
```

## `^`

```text
^pattern
↓
pattern must begin the line
```

## `$`

```text
pattern$
↓
pattern must end the line
```

## `[abc]`

```text
[abc]
↓
ONE character: a OR b OR c
```

## `[^abc]`

```text
[^abc]
↓
ONE character that is NOT a/b/c
```

## `.*`

```text
.*
↓
ZERO or more arbitrary characters
```

## `(ab)+`

```text
(ab)+
↓
one or more copies of "ab"
```

## `(ED|ME)`

```text
ED OR ME
```

## `\1`

```text
\1
↓
same text captured by group 1
```

---

# 96. Final Regex Strategy

When you encounter a complicated regex in an exam or script, do not try to understand it all at once.

Use this procedure:

```text
Step 1 → Identify anchors
          ^  $

Step 2 → Identify character classes
          [abc]
          [0-9]
          [^...]

Step 3 → Identify special atoms
          .
          \.

Step 4 → Identify quantifiers
          *
          +
          ?
          {m,n}

Step 5 → Identify groups
          (...)
          \(...\)

Step 6 → Identify alternation
          |

Step 7 → Identify backreferences
          \1
          \2

Step 8 → Combine everything
```

For example:

```text
\bpat.*tern
```

becomes:

```text
\b     → word boundary
pat    → literal pat
.*     → zero or more arbitrary characters
tern   → literal tern
```

So the complete meaning is:

```text
At a word boundary,
find "pat",
allow any number of characters,
then find "tern".
```

The key to mastering regex is **not memorizing giant patterns**. It is learning to break every regex into small atoms, anchors, character classes, quantifiers, groups, and operators, then rebuild its meaning step by step.