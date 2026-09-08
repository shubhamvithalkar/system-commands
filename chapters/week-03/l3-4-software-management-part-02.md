---
layout: default
title: "L3.4: Software Management - Part 02"
---

# L3.4: Software Management - Part 02



# Linux Package Management: APT, `dpkg`, Repositories, and `.deb` Packages

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand what package management is.
- Access and safely understand the `sudoers` configuration.
- Understand the purpose of `/var/log`.
- Understand APT configuration inside `/etc/apt`.
- Understand `sources.list` and `sources.list.d`.
- Use `apt update`.
- Use `apt upgrade`.
- Use `apt autoremove`.
- Install, remove, and reinstall packages.
- Understand the difference between `apt` and `dpkg`.
- Understand `/var/lib/dpkg`.
- Search installed packages using `dpkg -l`.
- Find files belonging to a package using `dpkg -L`.
- View package metadata using `dpkg -s`.
- Find which package owns a file using `dpkg -S`.
- Create custom package listings using `dpkg-query`.
- Combine `dpkg-query` with `less`, `sort`, and `grep`.
- Install local `.deb` packages.

---

# 1. What Is Package Management?

A **package** is a bundle containing software and information needed to install and manage it.

For example, when you install:

```bash
sudo apt install curl
```

you are not manually downloading source code, compiling it, and copying files into system directories.

Instead, the package manager handles the process.

A simplified model is:

```text
Repository
    ↓
Package Manager
    ↓
Download Package
    ↓
Check Dependencies
    ↓
Install Files
    ↓
Configure Software
    ↓
Software Ready
```

On Debian and Ubuntu systems, two important package management components are:

- `apt`
- `dpkg`

---

# 2. `apt` vs `dpkg`

This distinction is extremely important.

## `dpkg`

`dpkg` is the lower-level Debian package management system.

It manages `.deb` packages and keeps track of installed packages.

Example:

```bash
dpkg -l
```

## `apt`

APT is a higher-level package management tool.

It can:

- Search repositories.
- Download packages.
- Resolve dependencies.
- Install packages.
- Upgrade packages.
- Remove packages.

Example:

```bash
sudo apt install nmap
```

## Mental Model

```text
                    User
                      │
                      ▼
                     APT
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   Repositories   Dependencies    Downloads
                      │
                      ▼
                     dpkg
                      │
                      ▼
              Installed Packages
```

Think of it like this:

```text
APT  → Smart package manager
dpkg → Low-level package installer/database manager
```

---

# 3. Accessing the `sudoers` File

The `sudoers` configuration controls who can use `sudo`.

The main configuration file is:

```text
/etc/sudoers
```

You can view it using:

```bash
sudo cat /etc/sudoers
```

However, you should generally **not edit `/etc/sudoers` directly using a normal editor**.

Instead, use:

```bash
sudo visudo
```

## Why Use `visudo`?

The `sudoers` file is sensitive.

A syntax mistake can cause problems with `sudo`.

`visudo` checks the syntax before saving.

### Mental Model

```text
/etc/sudoers
       │
       ▼
Who can use sudo?
       │
       ▼
What commands are allowed?
       │
       ▼
Under what permissions?
```

### Common Mistake

Do not casually do:

```bash
sudo nano /etc/sudoers
```

It may work, but `visudo` is safer because it validates the configuration.

---

# 4. `/var/log`

Linux stores many system and application logs inside:

```text
/var/log
```

Check the directory:

```bash
ls /var/log
```

You may see files or directories such as:

```text
auth.log
syslog
kern.log
apt/
dpkg.log
journal/
```

The exact files depend on your Linux distribution and configuration.

## What Are Logs?

Logs are records of events happening on your system.

For example:

```text
User logs in
      ↓
Authentication event
      ↓
System records event
      ↓
Log file
      ↓
/var/log
```

Logs are useful for:

- Debugging.
- Troubleshooting.
- Security analysis.
- Checking service activity.
- Investigating errors.

### Example

To inspect package management logs:

```bash
less /var/log/dpkg.log
```

To inspect APT-related logs:

```bash
ls /var/log/apt
```

---

# 5. `/etc/apt`

APT configuration is primarily stored in:

```text
/etc/apt
```

Inspect it:

```bash
ls /etc/apt
```

You may see:

```text
apt.conf.d/
sources.list
sources.list.d/
trusted.gpg.d/
```

Some modern Ubuntu systems use repository configuration files such as:

```text
/etc/apt/sources.list.d/ubuntu.sources
```

So the exact layout may differ.

---

# 6. `sources.list`

APT needs to know where packages are located.

Traditionally, repository definitions are stored in:

```text
/etc/apt/sources.list
```

You can view it using:

```bash
cat /etc/apt/sources.list
```

A repository entry may look conceptually like:

```text
deb http://repository-url distribution component
```

For example:

```text
deb http://archive.ubuntu.com/ubuntu noble main universe
```

The exact repository depends on your system version and configuration.

## Mental Model

```text
sources.list
      │
      ▼
Repository Addresses
      │
      ▼
APT knows where to search
      │
      ▼
Packages become available
```

---

# 7. `sources.list.d`

Additional repository configurations can be stored in:

```text
/etc/apt/sources.list.d/
```

Navigate there:

```bash
cd /etc/apt/sources.list.d
```

Then:

```bash
ls
```

You may see files representing additional repositories.

For example:

```text
docker.list
google-chrome.list
some-repository.sources
```

These are examples; your system may contain different files.

## Why Does `sources.list.d` Exist?

Instead of putting every repository into one huge file:

```text
sources.list
```

Linux allows repositories to be separated.

```text
/etc/apt/
│
├── sources.list
│
└── sources.list.d/
    ├── repository1.list
    ├── repository2.list
    └── repository3.sources
```

This makes repository management easier.

---

# 8. `apt update`

Run:

```bash
sudo apt update
```

This command updates your **local package information**.

It checks configured repositories and downloads the latest package metadata.

## Important Rule

`apt update` does **not** normally upgrade all your installed software.

Instead:

```text
Repository
    │
    ▼
Latest package information
    │
    ▼
sudo apt update
    │
    ▼
Local package metadata updated
```

Then APT knows:

- Which packages are available.
- Which versions are available.
- Which updates exist.

### Common Workflow

```bash
sudo apt update
sudo apt upgrade
```

---

# 9. `apt upgrade`

To upgrade installed packages:

```bash
sudo apt upgrade
```

This installs newer versions of installed packages when available.

## Difference Between `update` and `upgrade`

```text
apt update
    │
    └── Refresh information about packages


apt upgrade
    │
    └── Upgrade installed packages
```

A common exam question is:

> Does `apt update` install software updates?

Answer:

**No. It refreshes package metadata.**

---

# 10. `apt autoremove`

Over time, packages may be installed automatically as dependencies.

Later, those dependencies may no longer be needed.

Run:

```bash
sudo apt autoremove
```

APT will remove automatically installed packages that are no longer required.

## Example

Suppose:

```text
Program A
    │
    └── requires Library B
```

APT installs:

```text
Program A
Library B
```

Later:

```text
Program A
```

is removed.

If nothing else needs:

```text
Library B
```

then:

```bash
sudo apt autoremove
```

may remove it.

### Important Rule

Always inspect the list of packages APT wants to remove before confirming.

---

# 11. Removing a Package

Use:

```bash
sudo apt remove package
```

Example:

```bash
sudo apt remove nmap
```

This removes the package.

Some configuration files may remain.

---

# 12. `remove` vs `purge`

Although the lecture focuses on removing packages, it is important to know the related `purge` command.

```bash
sudo apt remove package
```

removes the package but may keep package configuration files.

```bash
sudo apt purge package
```

removes the package and package configuration files managed by the package system.

## Comparison

| Command | Effect |
|---|---|
| `apt remove package` | Removes package |
| `apt purge package` | Removes package and package configuration |

Example:

```bash
sudo apt remove nginx
```

versus:

```bash
sudo apt purge nginx
```

---

# 13. Installing a Package

Use:

```bash
sudo apt install package
```

Example:

```bash
sudo apt install nmap
```

APT will generally:

1. Locate the package.
2. Check dependencies.
3. Download required packages.
4. Install them.
5. Configure them.

## Mental Model

```text
sudo apt install nmap
          │
          ▼
Find package
          │
          ▼
Check dependencies
          │
          ▼
Download packages
          │
          ▼
dpkg installs packages
          │
          ▼
Software installed
```

---

# 14. Reinstalling a Package

Sometimes a package is already installed but you want to install its package files again.

Use:

```bash
sudo apt install --reinstall package
```

Example:

```bash
sudo apt install --reinstall nmap
```

This can be useful when package files may be corrupted or accidentally removed.

---

# 15. Package Management Command Summary

```bash
# Update package metadata
sudo apt update

# Upgrade installed packages
sudo apt upgrade

# Remove unused dependencies
sudo apt autoremove

# Remove package
sudo apt remove package

# Remove package and configuration
sudo apt purge package

# Install package
sudo apt install package

# Reinstall package
sudo apt install --reinstall package
```

---

# 16. `/var/lib/dpkg`

The `dpkg` package management system stores its database under:

```text
/var/lib/dpkg
```

Inspect it:

```bash
ls /var/lib/dpkg
```

This directory contains important information about packages installed on the system.

A key file is:

```text
/var/lib/dpkg/status
```

This stores package status information.

## Mental Model

```text
Package installed
       │
       ▼
dpkg updates package database
       │
       ▼
/var/lib/dpkg/
       │
       ▼
System knows what is installed
```

---

# 17. `dpkg -l pattern`

The command:

```bash
dpkg -l
```

lists package information.

You can also search using a pattern:

```bash
dpkg -l pattern
```

Example:

```bash
dpkg -l 'python*'
```

This searches package names matching the pattern.

Another example:

```bash
dpkg -l '*curl*'
```

## Why Use Quotes?

Without quotes, the shell may expand `*` before passing it to `dpkg`.

Therefore:

```bash
dpkg -l '*python*'
```

is safer than:

```bash
dpkg -l *python*
```

---

# 18. Understanding `dpkg -l` Output

You may see output similar to:

```text
ii  bash        5.x   amd64   GNU Bourne Again SHell
ii  coreutils   9.x   amd64   GNU core utilities
```

The first characters represent package status.

For example:

```text
ii
```

generally indicates:

```text
Desired state: Install
Current state: Installed
```

Therefore:

```text
ii
```

usually means:

> The package is installed.

---

# 19. `dpkg -L package`

The command:

```bash
dpkg -L package
```

lists files belonging to a package.

Example:

```bash
dpkg -L bash
```

You may see paths such as:

```text
/bin/bash
/usr/share/doc/bash/
/usr/share/man/
```

The exact output depends on the package.

## Mental Model

```text
Package
   │
   ▼
dpkg -L
   │
   ▼
Which files belong to this package?
```

---

# 20. `dpkg -s package`

The command:

```bash
dpkg -s package
```

shows package status and metadata.

Example:

```bash
dpkg -s bash
```

You may see:

```text
Package:
Status:
Priority:
Section:
Installed-Size:
Maintainer:
Architecture:
Version:
Depends:
Description:
```

This is useful when you want detailed information about an installed package.

---

# 21. `dpkg -S pattern`

The command:

```bash
dpkg -S pattern
```

searches for which installed package owns a particular file or matching path.

Example:

```bash
dpkg -S /usr/bin/ls
```

Conceptually:

```text
/usr/bin/ls
      │
      ▼
dpkg -S
      │
      ▼
Which package owns this file?
```

Another example:

```bash
dpkg -S /usr/bin/bash
```

---

# 22. `dpkg -L` vs `dpkg -S`

This is an important distinction.

## `dpkg -L package`

```bash
dpkg -L bash
```

Question:

> What files belong to the `bash` package?

## `dpkg -S file`

```bash
dpkg -S /usr/bin/bash
```

Question:

> Which package owns `/usr/bin/bash`?

## Comparison Table

| Command | Meaning |
|---|---|
| `dpkg -L package` | List files belonging to a package |
| `dpkg -S file` | Find package owning a file |

Memory trick:

```text
-L → List files

-S → Search owner
```

---

# 23. `dpkg-query`

`dpkg-query` is used to query the dpkg package database.

One powerful feature is custom formatting.

The lecture command is:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n'
```

Let's break it down.

---

# 24. Understanding `-W`

```bash
-W
```

is used to query packages and display information.

---

# 25. Understanding `-f`

```bash
-f
```

means:

> Use a custom output format.

The format used is:

```text
${Section} ${binary:Package}\n
```

---

# 26. `${Section}`

```text
${Section}
```

prints the package section.

Examples may include:

```text
admin
devel
libs
net
utils
```

The exact values depend on package metadata.

---

# 27. `${binary:Package}`

```text
${binary:Package}
```

prints the binary package name.

For example:

```text
bash
curl
vim
nmap
```

---

# 28. `\n`

The:

```text
\n
```

creates a new line.

Therefore:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n'
```

can produce output conceptually like:

```text
admin adduser
shells bash
net curl
utils coreutils
```

---

# 29. Viewing Output with `less`

The lecture command:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | less
```

uses a pipe.

The output of:

```bash
dpkg-query
```

becomes the input of:

```bash
less
```

## Flow

```text
dpkg-query
     │
     ▼
    pipe
     │
     ▼
    less
```

Inside `less`:

```text
Space → Next page
b     → Previous page
/word → Search
q     → Quit
```

---

# 30. Sorting Package Information

The command:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | sort | less
```

works like this:

```text
dpkg-query
     │
     ▼
Generate package information
     │
     ▼
sort
     │
     ▼
Sort alphabetically
     │
     ▼
less
     │
     ▼
Browse output
```

This is useful when there are many packages.

---

# 31. Filtering Package Information with `grep`

The lecture command:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | grep pattern
```

filters the package output.

Example:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | grep python
```

Only lines containing:

```text
python
```

will be displayed.

Another example:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | grep '^net '
```

This searches for lines beginning with:

```text
net
```

---

# 32. Pipeline Mental Model

Consider:

```bash
command1 | command2 | command3
```

The output flows from left to right.

For the lecture example:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | sort | less
```

the flow is:

```text
Package Database
       │
       ▼
dpkg-query
       │
       ▼
Package Information
       │
       ▼
sort
       │
       ▼
Sorted Information
       │
       ▼
less
       │
       ▼
You
```

---

# 33. Installing a `.deb` Package

Debian and Ubuntu packages commonly use the:

```text
.deb
```

extension.

Example:

```text
program.deb
```

---

# 34. Installing a `.deb` Using `dpkg`

The traditional method is:

```bash
sudo dpkg -i package.deb
```

Example:

```bash
sudo dpkg -i program.deb
```

Here:

```text
-i
```

means:

```text
install
```

---

# 35. Dependency Problems with `dpkg -i`

Suppose:

```text
program.deb
```

requires:

```text
library-A
library-B
```

If those dependencies are missing:

```bash
sudo dpkg -i program.deb
```

may leave dependency problems.

Mental model:

```text
program.deb
     │
     ├── requires library-A
     │
     └── requires library-B

Missing dependencies
     │
     ▼
Installation problem
```

---

# 36. Installing a Local `.deb` Using APT

A convenient modern approach is:

```bash
sudo apt install ./package.deb
```

Example:

```bash
sudo apt install ./program.deb
```

The:

```text
./
```

means:

> The file is located in the current directory.

APT can attempt to resolve required dependencies.

---

# 37. `dpkg -i` vs `apt install ./package.deb`

| Command | Purpose |
|---|---|
| `sudo dpkg -i package.deb` | Install `.deb` directly using dpkg |
| `sudo apt install ./package.deb` | Install local `.deb` using APT and resolve dependencies |

For many users, this is convenient:

```bash
sudo apt install ./package.deb
```

---

# 38. Fixing Broken Dependencies

If a `.deb` installation leaves missing dependencies, you can often run:

```bash
sudo apt --fix-broken install
```

This tells APT to attempt to fix dependency problems.

A common sequence is:

```bash
sudo dpkg -i package.deb
sudo apt --fix-broken install
```

---

# 39. Important Real-World Examples

## Example 1: Update and Upgrade

```bash
sudo apt update
sudo apt upgrade
```

Use this when you want to refresh package information and install available upgrades.

---

## Example 2: Search Installed Packages

```bash
dpkg -l '*python*'
```

Use this to check Python-related packages known to dpkg.

---

## Example 3: Find Files Installed by a Package

```bash
dpkg -L bash
```

Use this when you want to know what files belong to the `bash` package.

---

## Example 4: Find Which Package Owns a File

```bash
dpkg -S /usr/bin/ls
```

Use this when you discover a file and want to know which installed package provided it.

---

## Example 5: Inspect Package Metadata

```bash
dpkg -s curl
```

Use this to inspect the installed version, dependencies, status, architecture, and description.

---

## Example 6: Browse Packages by Section

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | less
```

---

## Example 7: Sort Package Sections

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | sort | less
```

---

## Example 8: Filter Packages

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | grep python
```

---

# 40. Common Mistakes

## Mistake 1: Confusing `update` with `upgrade`

Wrong assumption:

```text
apt update installs updates
```

Correct:

```text
apt update
→ refreshes package metadata

apt upgrade
→ upgrades installed packages
```

---

## Mistake 2: Forgetting `./` for a Local `.deb`

If the package is in the current directory:

```bash
sudo apt install ./package.deb
```

The:

```text
./
```

tells APT that you are referring to a local file.

---

## Mistake 3: Confusing `dpkg -L` and `dpkg -S`

```text
dpkg -L package
```

asks:

> What files belong to this package?

```text
dpkg -S file
```

asks:

> Which package owns this file?

---

## Mistake 4: Running `autoremove` Without Checking

Before confirming removal, read the list of packages APT proposes to remove.

---

## Mistake 5: Editing `/etc/sudoers` Directly

Prefer:

```bash
sudo visudo
```

instead of directly editing the file.

---

# 41. Exam-Focused Command Table

| Command | Purpose |
|---|---|
| `sudo visudo` | Safely edit sudoers configuration |
| `ls /var/log` | View system logs |
| `ls /etc/apt` | View APT configuration |
| `cat /etc/apt/sources.list` | View traditional repository configuration |
| `cd /etc/apt/sources.list.d` | Access additional repository definitions |
| `sudo apt update` | Refresh package metadata |
| `sudo apt upgrade` | Upgrade installed packages |
| `sudo apt autoremove` | Remove unused automatic dependencies |
| `sudo apt remove pkg` | Remove package |
| `sudo apt install pkg` | Install package |
| `sudo apt install --reinstall pkg` | Reinstall package |
| `ls /var/lib/dpkg` | View dpkg database files |
| `dpkg -l pattern` | List/query packages matching pattern |
| `dpkg -L package` | List files belonging to package |
| `dpkg -s package` | Show package status/details |
| `dpkg -S pattern` | Find package owning a file/path |
| `dpkg-query -W -f='...'` | Query package database with custom format |
| `sudo dpkg -i file.deb` | Install `.deb` package |
| `sudo apt install ./file.deb` | Install local `.deb` with APT |
| `sudo apt --fix-broken install` | Attempt to fix broken dependencies |

---

# 42. Practice Questions

## Question 1

What is the difference between:

```bash
sudo apt update
```

and:

```bash
sudo apt upgrade
```

### Answer

```text
apt update
→ Refreshes package information.

apt upgrade
→ Installs available upgrades for installed packages.
```

---

## Question 2

Where is the `dpkg` package database stored?

### Answer

```text
/var/lib/dpkg
```

---

## Question 3

Which command lists files belonging to the `bash` package?

### Answer

```bash
dpkg -L bash
```

---

## Question 4

Which command finds the package that owns:

```text
/usr/bin/ls
```

### Answer

```bash
dpkg -S /usr/bin/ls
```

---

## Question 5

How do you reinstall `curl`?

### Answer

```bash
sudo apt install --reinstall curl
```

---

## Question 6

How do you install a local package named:

```text
app.deb
```

using `dpkg`?

### Answer

```bash
sudo dpkg -i app.deb
```

---

## Question 7

How can you install the same package using APT?

### Answer

```bash
sudo apt install ./app.deb
```

---

## Question 8

What command attempts to fix broken package dependencies?

### Answer

```bash
sudo apt --fix-broken install
```

---

## Question 9

Explain:

```bash
dpkg-query -W -f='${Section} ${binary:Package}\n' | sort | less
```

### Answer

```text
dpkg-query
→ Gets package information.

-f
→ Specifies custom output format.

${Section}
→ Prints package section.

${binary:Package}
→ Prints package name.

\n
→ Prints a new line.

sort
→ Sorts the output.

less
→ Allows interactive viewing.
```

---

# 43. Final Revision Diagram

```text
                         PACKAGE MANAGEMENT
                                  │
                  ┌───────────────┴───────────────┐
                  │                               │
                 APT                             dpkg
                  │                               │
        High-level package tool           Low-level package system
                  │                               │
        ┌─────────┼─────────┐                     │
        │         │         │                     │
     update    install    upgrade              .deb files
        │         │         │                     │
        └─────────┼─────────┘                     │
                  │                               │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                         Installed Packages
                                  │
                                  ▼
                           /var/lib/dpkg
```

Repository configuration:

```text
/etc/apt/
│
├── sources.list
│
└── sources.list.d/
        │
        ▼
    Repositories
        │
        ▼
       APT
```

Package investigation:

```text
dpkg -l
    │
    ▼
List packages

dpkg -L package
    │
    ▼
List files belonging to package

dpkg -s package
    │
    ▼
Show package details

dpkg -S file
    │
    ▼
Find package owning file

dpkg-query
    │
    ▼
Create custom package queries
```

## Final Commands to Memorize

```bash
sudo visudo

ls /var/log

ls /etc/apt
cat /etc/apt/sources.list
cd /etc/apt/sources.list.d

sudo apt update
sudo apt upgrade
sudo apt autoremove
sudo apt remove package
sudo apt install package
sudo apt install --reinstall package

ls /var/lib/dpkg

dpkg -l pattern
dpkg -L package
dpkg -s package
dpkg -S pattern

dpkg-query -W -f='${Section} ${binary:Package}\n'

dpkg-query -W -f='${Section} ${binary:Package}\n' | less

dpkg-query -W -f='${Section} ${binary:Package}\n' | sort | less

dpkg-query -W -f='${Section} ${binary:Package}\n' | grep pattern

sudo dpkg -i package.deb
sudo apt install ./package.deb
sudo apt --fix-broken install
```
