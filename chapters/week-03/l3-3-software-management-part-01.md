---
layout: default
title: "L3.3: Software Management - Part 01"
---

# L3.3: Software Management - Part 01

# Linux Operating System, Kernel, Package Management, and Checksums

## 1. Checking the Type of Operating System

When working on a Linux system, it is useful to know:

- Which operating system/distribution is running.
- Which Linux kernel is running.
- Whether the system is 32-bit or 64-bit.
- Which package manager is available.

There are several ways to identify the operating system.

---

## 2. `/etc/os-release`

The most common modern method is:

```bash
cat /etc/os-release
```

On Ubuntu, you may see something like:

```text
PRETTY_NAME="Ubuntu 24.04.3 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
VERSION="24.04.3 LTS (Noble Numbat)"
ID=ubuntu
ID_LIKE=debian
...
```

The important fields include:

| Field | Meaning |
|---|---|
| `NAME` | Operating system name |
| `PRETTY_NAME` | Human-readable OS name |
| `VERSION_ID` | Version number |
| `ID` | Distribution identifier |
| `ID_LIKE` | Related distribution family |

For example:

```text
ID=ubuntu
ID_LIKE=debian
```

tells us that the system is Ubuntu and belongs to the Debian family.

---

## 3. `lsb_release`

Another command commonly used to identify Linux distributions is:

```bash
lsb_release -a
```

Example:

```text
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.3 LTS
Release:        24.04
Codename:       noble
```

You can also use:

```bash
lsb_release -d
```

to display only the distribution description.

Example:

```text
Description:    Ubuntu 24.04.3 LTS
```

### Important

`lsb_release` may not be installed on every minimal Linux installation.

In that case:

```bash
cat /etc/os-release
```

is generally the more dependable modern approach.

---

# 4. Checking the Kernel Type and Architecture

The operating system and the kernel are related but **not the same thing**.

For example:

```text
Operating System → Ubuntu
Kernel           → Linux
Architecture    → x86_64
```

Ubuntu is a Linux distribution.

Linux itself is the kernel.

---

## 5. `uname`

The `uname` command provides information about the kernel.

Run:

```bash
uname
```

Typical output:

```text
Linux
```

This tells you the kernel name.

---

## 6. `uname -s`

```bash
uname -s
```

Output:

```text
Linux
```

`-s` means:

> Print the kernel name.

---

## 7. `uname -r`

To check the kernel release:

```bash
uname -r
```

Example:

```text
6.8.0-90-generic
```

This tells you the running kernel release.

---

## 8. `uname -m`

To check the machine architecture:

```bash
uname -m
```

Possible output:

```text
x86_64
```

This indicates a 64-bit x86 architecture.

Common values include:

| Output | Meaning |
|---|---|
| `x86_64` | 64-bit x86/AMD64 architecture |
| `aarch64` | 64-bit ARM architecture |
| `armv7l` | 32-bit ARM architecture |
| `i686` | 32-bit x86 architecture |

---

## 9. `uname -a`

For a complete summary:

```bash
uname -a
```

Example:

```text
Linux mycomputer 6.8.0-90-generic #91-Ubuntu SMP ... x86_64 x86_64 x86_64 GNU/Linux
```

This can contain:

```text
Kernel name
Hostname
Kernel release
Kernel version/build information
Machine architecture
Processor information
Hardware platform
Operating system
```

The exact fields can vary between systems.

---

# 10. `arch`

Another simple command for architecture is:

```bash
arch
```

Example:

```text
x86_64
```

This is generally equivalent to:

```bash
uname -m
```

for determining the machine architecture.

---

# 11. OS vs Kernel vs Architecture

Do not confuse these three concepts.

```text
Ubuntu
  ↓
Operating System / Linux Distribution

Linux
  ↓
Kernel

x86_64
  ↓
Machine Architecture
```

For example:

```bash
cat /etc/os-release
```

might tell you:

```text
Ubuntu 24.04
```

while:

```bash
uname -r
```

might tell you:

```text
6.8.0-90-generic
```

and:

```bash
uname -m
```

might tell you:

```text
x86_64
```

---

# 12. `apt`

`apt` is a command-line package management tool commonly used on Debian-based distributions such as:

- Ubuntu
- Debian
- Linux Mint
- Pop!_OS
- and other Debian-based systems

A package is a collection of files and metadata distributed together for installing software.

For example:

```text
nmap
curl
git
vim
python3
```

can be installed as packages.

---

# 13. What Does a Package Manager Do?

Without a package manager, installing software manually might require:

```text
download source/binary
        ↓
resolve dependencies
        ↓
compile/install
        ↓
configure
        ↓
track installed files
        ↓
update software
```

A package manager automates much of this.

Mental model:

```text
                 APT
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
     Search    Install    Update
        │         │         │
        ↓         ↓         ↓
    packages   software   packages
```

---

# 14. Basic `apt` Syntax

General form:

```bash
apt [options] command
```

Examples:

```bash
apt update
apt install package
apt remove package
apt search package
apt show package
```

Some operations require administrator privileges:

```bash
sudo apt install package
```

---

# 15. `apt update`

```bash
sudo apt update
```

This updates the local package information from configured repositories.

It does **not normally upgrade all installed packages**.

Think of it as:

```text
Internet repositories
        ↓
     apt update
        ↓
local package information
```

After updating package information, you can install or upgrade packages using the available metadata.

---

# 16. `apt upgrade`

```bash
sudo apt upgrade
```

This upgrades installed packages when newer versions are available.

Typical workflow:

```bash
sudo apt update
sudo apt upgrade
```

The distinction is important:

```text
apt update
    ↓
refresh package information

apt upgrade
    ↓
actually upgrade installed packages
```

---

# 17. Installing a Package

Syntax:

```bash
sudo apt install package_name
```

Example:

```bash
sudo apt install nmap
```

APT determines dependencies and installs the required packages.

---

# 18. Removing a Package

```bash
sudo apt remove nmap
```

This removes the package while generally leaving configuration files behind.

To remove the package and associated configuration files:

```bash
sudo apt purge nmap
```

---

# 19. `apt-cache`

`apt-cache` is a command used to query and inspect information stored in APT's package cache.

It is particularly useful for:

- Searching packages.
- Listing package names.
- Viewing package information.
- Inspecting package metadata.

---

# 20. Searching Packages — `apt-cache search`

Syntax:

```bash
apt-cache search keyword
```

Example:

```bash
apt-cache search nmap
```

APT searches package information for the specified term.

You might see results such as:

```text
nmap - The Network Mapper
nmap-common - Architecture independent data for nmap
```

The search can match package names and descriptions.

---

# 21. `apt-cache pkgnames`

The command:

```bash
apt-cache pkgnames
```

lists package names known to APT's package cache.

Example:

```bash
apt-cache pkgnames
```

You may see:

```text
accountsservice
acl
adduser
adwaita-icon-theme
...
```

### Important Correction

`apt-cache pkgnames` does **not mean "all packages installed on the system."**

It lists package names known from the configured APT package information/cache, which can include packages that are **not installed**.

To see packages actually installed, use:

```bash
apt list --installed
```

or:

```bash
dpkg -l
```

This distinction is important.

---

# 22. Filtering `apt-cache pkgnames`

Suppose you want package names beginning with:

```text
nm
```

You can use:

```bash
apt-cache pkgnames nm
```

This filters package names using the supplied prefix.

Possible output may include packages such as:

```text
nm-tray
nmap
...
```

The exact output depends on the repositories configured on your system.

Another general technique is:

```bash
apt-cache pkgnames | grep '^nm'
```

Here:

```text
apt-cache pkgnames
        ↓
      grep
        ↓
names beginning with nm
```

---

# 23. `apt-cache show`

To display detailed information about a package:

```bash
apt-cache show nmap
```

You may see information such as:

```text
Package: nmap
Architecture: amd64
Version: ...
Priority: optional
Section: net
Maintainer: ...
Description: The Network Mapper
...
```

The information can include:

- Package name
- Version
- Architecture
- Dependencies
- Maintainer
- Description
- Package size
- Installed size
- Repository information

---

# 24. `apt show`

Modern APT also provides:

```bash
apt show nmap
```

This is often more convenient for human-readable package information.

For example:

```bash
apt show nmap
```

You may see:

```text
Package: nmap
Version: ...
Architecture: amd64
Depends: ...
Description: The Network Mapper
...
```

---

# 25. Installed Packages vs Available Packages

This distinction is extremely important.

### Packages known to APT

```bash
apt-cache pkgnames
```

These are package names available in the package metadata/cache.

### Packages actually installed

```bash
apt list --installed
```

or:

```bash
dpkg -l
```

Mental model:

```text
APT repositories
      ↓
package metadata
      ↓
apt-cache
      ↓
available/known packages


Installed packages
      ↓
dpkg database
      ↓
apt list --installed
```

---

# 26. Package Management Cheat Sheet

```bash
# Refresh package information
sudo apt update

# Upgrade installed packages
sudo apt upgrade

# Install package
sudo apt install package

# Remove package
sudo apt remove package

# Remove package + configuration
sudo apt purge package

# Search packages
apt search keyword

# Search using apt-cache
apt-cache search keyword

# List package names known to APT
apt-cache pkgnames

# Package names beginning with prefix
apt-cache pkgnames nm

# Show package details
apt-cache show nmap

# Modern equivalent for displaying package information
apt show nmap

# List installed packages
apt list --installed

# Query installed package database
dpkg -l
```

---

# 27. Checksums

A checksum is a value calculated from data.

It is used to help determine whether data has changed or been corrupted.

Mental model:

```text
File
 ↓
Checksum algorithm
 ↓
Checksum value
```

If the file changes:

```text
File
 ↓
Checksum algorithm
 ↓
Different checksum
```

Therefore, comparing checksums can help verify file integrity.

---

# 28. Why Are Checksums Useful?

Suppose you download:

```text
ubuntu.iso
```

The downloaded file could potentially be:

- corrupted during transfer
- incomplete
- modified
- different from the expected file

The publisher may provide an expected checksum.

For example:

```text
Expected:
abc123...
```

You calculate the checksum of your downloaded file:

```text
Calculated:
abc123...
```

If they match:

```text
Expected == Calculated
```

the checksum confirms that the file contents match the data represented by that checksum.

---

# 29. `md5sum`

One common checksum command is:

```bash
md5sum file
```

Example:

```bash
md5sum example.txt
```

Output looks like:

```text
d41d8cd98f00b204e9800998ecf8427e  example.txt
```

The long hexadecimal value is the MD5 digest.

---

# 30. `sha1sum`

Another algorithm is SHA-1:

```bash
sha1sum file
```

Example:

```bash
sha1sum example.txt
```

Output:

```text
<40-character hexadecimal digest>  example.txt
```

SHA-1 is historically important, but it is considered cryptographically weak for security-sensitive applications.

---

# 31. `sha256sum`

A commonly preferred checksum algorithm today is SHA-256:

```bash
sha256sum file
```

Example:

```bash
sha256sum example.iso
```

Output:

```text
<64-character hexadecimal digest>  example.iso
```

The digest has:

```text
256 bits
```

which corresponds to:

```text
32 bytes
```

and is normally represented as:

```text
64 hexadecimal characters
```

---

# 32. Comparing Checksums

Suppose a website gives you:

```text
EXPECTED_SHA256
```

Calculate:

```bash
sha256sum example.iso
```

Then compare the two values.

For example:

```text
Expected:
ABC123...

Calculated:
ABC123...
```

If they are exactly the same:

```text
MATCH
```

If they differ:

```text
MISMATCH
```

---

# 33. Why Does a Small Change Matter?

Suppose:

```text
file.txt
```

contains:

```text
hello
```

Calculate:

```bash
sha256sum file.txt
```

Now change it:

```text
hello!
```

Calculate the checksum again:

```bash
sha256sum file.txt
```

The resulting hash will be completely different.

This is known as the **avalanche effect** in cryptographic hash functions: a small input change can produce a drastically different digest.

---

# 34. Checksum Is Not Encryption

This is an important distinction.

A checksum/hash:

```text
file → hash
```

does not mean:

```text
file → encrypted file
```

A hash is designed as a one-way digest, not as a way to recover the original file.

For example:

```text
hello
   ↓
SHA-256
   ↓
digest
```

You do not normally decrypt the digest to obtain:

```text
hello
```

---

# 35. Checksum vs Hash

The terms are sometimes used loosely, but the concepts have different contexts.

A checksum can be used primarily for detecting accidental corruption.

Cryptographic hash functions such as SHA-256 are designed with stronger properties useful for integrity and security applications.

Examples:

```bash
md5sum file
sha1sum file
sha256sum file
```

For modern integrity verification, SHA-256 is generally a better choice than MD5 or SHA-1.

---

# 36. Checksum Files

Sometimes a project provides a checksum file such as:

```text
SHA256SUMS
```

It may contain:

```text
abc123...  ubuntu.iso
def456...  another.iso
```

You can verify files using:

```bash
sha256sum -c SHA256SUMS
```

If the checksum matches, you may see:

```text
ubuntu.iso: OK
```

This is much easier than manually comparing long hash strings.

---

# 37. `sha256sum -c`

The `-c` option means to read checksum information from a file and verify the listed files.

Example:

```bash
sha256sum -c SHA256SUMS
```

Mental model:

```text
SHA256SUMS
    │
    ├── expected hash
    └── filename
          ↓
      sha256sum -c
          ↓
       calculate
          ↓
       compare
          ↓
       OK / FAILED
```

---

# 38. Practical Checksum Exercise

Create a file:

```bash
echo "Hello Linux" > test.txt
```

Calculate its SHA-256:

```bash
sha256sum test.txt
```

Now modify the file:

```bash
echo "Hello Linux!" > test.txt
```

Calculate it again:

```bash
sha256sum test.txt
```

Compare the two values.

They should be different.

---

# 39. Creating a Checksum Verification File

Generate a SHA-256 checksum file:

```bash
sha256sum test.txt > SHA256SUMS
```

View it:

```bash
cat SHA256SUMS
```

You should see something like:

```text
<hash>  test.txt
```

Now verify:

```bash
sha256sum -c SHA256SUMS
```

Expected result:

```text
test.txt: OK
```

---

# 40. What Happens If the File Changes?

Modify the file:

```bash
echo "Modified" > test.txt
```

Then run:

```bash
sha256sum -c SHA256SUMS
```

You should get a failure such as:

```text
test.txt: FAILED
sha256sum: WARNING: 1 computed checksum did NOT match
```

This demonstrates the primary purpose of checksum verification:

```text
Expected file
      ↓
Expected checksum

Actual file
      ↓
Calculated checksum

Compare
      ↓
MATCH / MISMATCH
```

---

# 41. Important Security Note

A matching checksum proves that the file matches the checksum value you were given.

It does **not automatically prove that the file is trustworthy**.

For example, if an attacker changes both:

```text
file
```

and:

```text
checksum
```

then the two could still match.

For stronger authenticity guarantees, projects may publish signed checksum files using digital signatures.

Therefore:

```text
Checksum → integrity comparison
Digital signature → integrity + authenticity
```

---

# 42. Common Exam Traps

## Trap 1: OS vs Kernel

Wrong:

```text
Ubuntu = kernel
```

Correct:

```text
Ubuntu = Linux distribution
Linux = kernel
```

---

## Trap 2: `uname`

```bash
uname
```

typically outputs:

```text
Linux
```

It does not tell you that your distribution is Ubuntu.

For the distribution:

```bash
cat /etc/os-release
```

---

## Trap 3: Architecture

```bash
uname -m
```

checks machine architecture.

Example:

```text
x86_64
```

---

## Trap 4: `apt-cache pkgnames`

Do not say:

> It lists all installed packages.

It lists package names known in APT's package cache.

For installed packages:

```bash
apt list --installed
```

or:

```bash
dpkg -l
```

---

## Trap 5: `apt update`

```bash
sudo apt update
```

does not mean:

> Upgrade all installed software.

It refreshes package metadata.

Upgrade with:

```bash
sudo apt upgrade
```

---

## Trap 6: `apt-cache search`

```bash
apt-cache search pkg
```

searches package information for matching terms.

It does not install anything.

---

## Trap 7: Checksum vs Encryption

A SHA-256 digest is not an encrypted version of the file.

```text
Hash ≠ Encryption
```

---

# 43. Exam Practice Questions

## Q1

Which command displays the Linux distribution information?

### Solution

```bash
cat /etc/os-release
```

---

## Q2

Which command displays the running kernel release?

### Solution

```bash
uname -r
```

---

## Q3

Which command displays the machine architecture?

### Solution

```bash
uname -m
```

or:

```bash
arch
```

---

## Q4

What does:

```bash
uname -a
```

do?

### Solution

It displays a broad summary of kernel and system information, including the kernel name, hostname, kernel release/version, and machine architecture.

---

## Q5

Search the APT package database for packages related to `nmap`.

### Solution

```bash
apt-cache search nmap
```

---

## Q6

Display detailed information about the `nmap` package.

### Solution

```bash
apt-cache show nmap
```

or:

```bash
apt show nmap
```

---

## Q7

List package names known to APT.

### Solution

```bash
apt-cache pkgnames
```

---

## Q8

List installed packages.

### Solution

```bash
apt list --installed
```

or:

```bash
dpkg -l
```

---

## Q9

What is the difference between:

```bash
sudo apt update
```

and:

```bash
sudo apt upgrade
```

### Solution

```text
apt update
    ↓
refresh package information

apt upgrade
    ↓
upgrade installed packages
```

---

## Q10

Calculate the SHA-256 checksum of:

```text
file.txt
```

### Solution

```bash
sha256sum file.txt
```

---

## Q11

Verify checksums listed in `SHA256SUMS`.

### Solution

```bash
sha256sum -c SHA256SUMS
```

---

# 44. Final Quick Reference

## Operating System

```bash
cat /etc/os-release
lsb_release -a
```

## Kernel

```bash
uname
uname -s
uname -r
uname -a
```

## Architecture

```bash
uname -m
arch
```

## APT

```bash
sudo apt update
sudo apt upgrade
sudo apt install package
sudo apt remove package
sudo apt purge package
apt search keyword
apt show package
```

## APT Cache

```bash
apt-cache search keyword
apt-cache pkgnames
apt-cache pkgnames nm
apt-cache show nmap
```

## Installed Packages

```bash
apt list --installed
dpkg -l
```

## Checksums

```bash
md5sum file
sha1sum file
sha256sum file
```

## Verify a checksum file

```bash
sha256sum -c SHA256SUMS
```

---

# 45. Master Mental Model

```text
                 LINUX SYSTEM
                      │
        ┌─────────────┼──────────────┐
        ↓             ↓              ↓
       OS           Kernel       Architecture
        │             │              │
 Ubuntu/Debian      Linux          x86_64
        │             │              │
        └─────────────┴──────────────┘


                 PACKAGE MANAGEMENT
                         │
                        APT
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Search         Install        Upgrade
          │              │              │
    apt-cache       apt install    apt upgrade


                    FILE INTEGRITY
                         │
                        File
                         ↓
                    Hash algorithm
                         ↓
                      Digest
                         ↓
                  Compare with
                  expected digest
                         ↓
                  MATCH / MISMATCH
```

The most important commands to remember from this lesson are:

```bash
cat /etc/os-release
uname -a
uname -r
uname -m
apt-cache search keyword
apt-cache pkgnames
apt-cache show package
sudo apt update
sudo apt upgrade
apt list --installed
sha256sum file
sha256sum -c SHA256SUMS
```
