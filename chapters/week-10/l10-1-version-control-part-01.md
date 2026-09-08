---
layout: default
title: "L10.1 - Version Control - Part 01"
---

# L10.1 - Version Control - Part 01


# Git, Version Control, RAID, and GitHub Authentication

## 1. Introduction to Version Control

When developing software, code changes continuously.

A developer may:

- Add new features
- Fix bugs
- Modify existing code
- Remove files
- Experiment with new ideas
- Work with other developers

Without a proper system for tracking these changes, managing a project becomes difficult.

**Version Control Systems (VCS)** solve this problem by keeping track of changes made to files over time.

Version control allows developers to:

- Track changes
- Restore previous versions
- Compare changes
- Collaborate with other developers
- Maintain different versions of a project
- Synchronize code between different machines

---

# 2. Why Version Control Is Important

Consider a project without version control.

A developer might create:

```text
project-final
project-final-new
project-final-new-2
project-final-latest
project-final-latest-fixed
project-final-latest-fixed-really-final
```

This quickly becomes difficult to manage.

With Git, the history is stored systematically:

```text
Commit 1
   ↓
Commit 2
   ↓
Commit 3
   ↓
Commit 4
   ↓
Current Version
```

Each commit represents a point in the project's history.

---

# 3. Version Control Systems

A **Version Control System (VCS)** is software that manages different versions of files.

There are several approaches to version control.

### Local Version Control

The history is stored locally on one machine.

```text
Computer
   │
   └── Version History
```

### Centralized Version Control

A central server stores the project history.

```text
Developer 1 ──┐
Developer 2 ──┼── Central Server
Developer 3 ──┘
```

### Distributed Version Control

Each developer can have a complete repository and its history.

```text
Developer 1
     │
Developer 2 ─── Remote Repository
     │
Developer 3
```

**Git** is a distributed version control system.

---

# 4. Hardware Failures and Data Storage

Software is not the only source of risk.

Hardware can fail.

For example:

```text
Hard Disk
    ↓
Mechanical failure
    ↓
Data unavailable
```

A storage device may fail because of:

- Mechanical problems
- Electrical failure
- Physical damage
- Manufacturing defects
- Wear and tear

If important data exists on only one disk, disk failure can result in data loss.

Therefore, reliable systems need mechanisms for **redundancy and fault tolerance**.

---

# 5. RAID

**RAID** stands for:

> **Redundant Array of Independent Disks**

RAID combines multiple physical disks into a storage system.

Depending on the RAID level, it can provide:

- Improved performance
- Redundancy
- Fault tolerance
- Increased availability

The basic idea is:

```text
             RAID System
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
     Disk 1    Disk 2    Disk 3
```

Instead of relying on a single physical disk, data can be distributed or replicated across multiple disks.

---

# 6. Disk Mirroring

One approach to redundancy is **disk mirroring**.

For example:

```text
Original Data
     │
     ├──────────────┐
     ↓              ↓
  Disk 1          Disk 2
```

The same data is maintained on multiple disks.

If one disk fails:

```text
Disk 1 → FAILED

Disk 2 → Still contains data
```

This improves availability.

A common RAID configuration that uses mirroring is **RAID 1**.

---

# 7. Data Distribution Across Multiple Disks

RAID configurations can also distribute data across multiple disks.

Conceptually:

```text
Data
 │
 ├── Block A ──→ Disk 1
 ├── Block B ──→ Disk 2
 ├── Block C ──→ Disk 3
 └── Block D ──→ Disk 4
```

Some RAID levels combine data distribution with redundancy.

The exact behavior depends on the RAID level being used.

---

# 8. RAID and Version Control Solve Different Problems

RAID and Git are sometimes discussed together because both help protect data, but they solve different problems.

### RAID

Primarily addresses:

```text
Hardware / storage failures
```

### Git

Primarily addresses:

```text
Code changes
Version history
Collaboration
Synchronization
```

For example:

```text
RAID
 ↓
Protects against certain disk failures

Git
 ↓
Protects and manages code history
```

Git should not be considered a replacement for a proper backup strategy.

---

# 9. Introduction to Git

**Git** is a distributed version control system.

It tracks changes in files and allows developers to maintain a history of their work.

A Git repository contains information about the project's history.

The basic workflow is:

```text
Working Directory
       ↓
      git add
       ↓
Staging Area
       ↓
    git commit
       ↓
Local Repository
       ↓
     git push
       ↓
Remote Repository
```

---

# 10. Git Repository

A Git repository is a directory containing a project and Git's metadata.

Initialize a repository with:

```bash
git init
```

This creates a hidden:

```text
.git/
```

directory.

Conceptually:

```text
project/
├── file1
├── file2
└── .git/
```

The `.git` directory stores information required for Git to manage the repository.

---

# 11. Git Protocol and Remote Synchronization

Git can synchronize repositories between different locations.

For example:

```text
Local Repository
       │
       │ git push
       ↓
Remote Repository
```

And:

```text
Remote Repository
       │
       │ git pull
       ↓
Local Repository
```

Common operations include:

```bash
git clone
git fetch
git pull
git push
```

These operations allow developers to work with remote repositories.

---

# 12. Local and Remote Repositories

A typical development setup may look like:

```text
Developer's Computer
        │
        │
   Local Git Repo
        │
        │ git push
        ↓
   Remote Git Repo
        │
        │
   GitHub Server
```

The local repository contains the developer's local history.

The remote repository provides a shared location for collaboration and backup.

---

# 13. GitHub

**GitHub** is a platform for hosting and collaborating on Git repositories.

A typical workflow is:

```text
Write Code
    ↓
git add
    ↓
git commit
    ↓
git push
    ↓
GitHub Repository
```

Other developers can then access the remote repository according to its permissions.

---

# 14. Creating a Repository

A repository can be created on GitHub and then connected to a local project.

For example:

```bash
git init
```

Add files:

```bash
git add .
```

Create the first commit:

```bash
git commit -m "Initial commit"
```

Connect the local repository to a remote repository:

```bash
git remote add origin <repository-url>
```

Then push:

```bash
git push -u origin main
```

The exact default branch name may vary depending on the repository configuration.

---

# 15. Remote Repository

A remote is a reference to another Git repository.

View configured remotes:

```bash
git remote -v
```

Example:

```text
origin  <repository-url> (fetch)
origin  <repository-url> (push)
```

The conventional name:

```text
origin
```

usually refers to the main remote repository.

---

# 16. Authentication

When Git communicates with a remote repository, the server needs to verify the user's identity.

This is called **authentication**.

Conceptually:

```text
Developer
    │
    │ "I want to access this repository"
    ↓
GitHub
    │
    │ "Prove your identity"
    ↓
Authentication
    │
    ↓
Access Granted / Denied
```

Authentication and authorization are related but different concepts.

### Authentication

> Who are you?

### Authorization

> What are you allowed to access or modify?

---

# 17. Account Verification

Online platforms may use additional verification mechanisms to protect accounts.

For example, phone-number verification can help establish account ownership and provide an additional security mechanism.

Security measures may help protect against:

- Unauthorized account access
- Automated abuse
- Account takeover
- Identity-related attacks

Account security should be treated separately from Git's actual version-control functionality.

---

# 18. Personal Access Tokens

A **Personal Access Token (PAT)** is a credential that can be used to authenticate certain GitHub operations.

Instead of using a traditional account password for Git operations over HTTPS, GitHub supports token-based authentication.

Conceptually:

```text
Git
 │
 │ HTTPS request
 ↓
GitHub
 │
 │ Authentication
 ↓
Personal Access Token
 │
 ↓
Access granted according to permissions
```

A PAT should be treated like a password.

**Never share it publicly.**

---

# 19. Why Personal Access Tokens Are Important

When interacting with a remote repository through HTTPS, GitHub needs a secure way to authenticate the operation.

A PAT can provide this authentication.

The token can be associated with specific permissions depending on the token type and configuration.

The principle is:

```text
Token
  ↓
Identity / Authentication
  ↓
Permissions
  ↓
Repository Operation
```

Always follow GitHub's current authentication and token-scope recommendations.

---

# 20. Creating and Managing Access Tokens

A typical process is:

```text
GitHub Account
      ↓
Settings
      ↓
Developer Settings
      ↓
Personal Access Tokens
      ↓
Create Token
      ↓
Configure Permissions
      ↓
Generate Token
```

The exact GitHub interface and available token options can change over time.

---

# 21. Token Security

A Personal Access Token is sensitive.

Do not put it directly into source code:

```text
BAD:

token = "my-secret-token"
```

Do not commit tokens to Git:

```bash
git add .
git commit -m "Add token"
```

Do not publish tokens in:

- GitHub repositories
- Screenshots
- Documentation
- Public chat messages
- Shell scripts committed to repositories

Instead, use secure credential-management approaches such as environment variables or Git credential helpers where appropriate.

---

# 22. If a Token Is Exposed

If a token is accidentally exposed:

```text
Exposed Token
     ↓
Revoke / rotate token
     ↓
Create replacement credential
     ↓
Update affected systems
```

Do not assume that deleting the token from the latest version of a file makes it safe.

If the secret was committed previously, it may still exist in Git history.

---

# 23. Git and Remote Servers

A remote Git repository can be hosted on a server.

Conceptually:

```text
Local Computer
      │
      │ Git
      │
      ↓
Remote Server
      │
      └── Git Repository
```

A hosted platform such as GitHub provides infrastructure around Git repositories, including collaboration, permissions, and repository management.

---

# 24. Typical Git Collaboration Workflow

A developer may follow this workflow:

```text
1. Clone repository
        ↓
2. Create or switch to branch
        ↓
3. Modify code
        ↓
4. Check changes
        ↓
5. Stage changes
        ↓
6. Commit changes
        ↓
7. Push to remote
        ↓
8. Collaborate / review
        ↓
9. Merge changes
```

Common commands include:

```bash
git clone <repository-url>
git status
git add .
git commit -m "Add feature"
git push
git pull
```

---

# 25. Git Mental Model

The most important Git concept is understanding the different stages of code.

```text
              Git Workflow

        Working Directory
                │
                │ git add
                ↓
          Staging Area
                │
                │ git commit
                ↓
         Local Repository
                │
                │ git push
                ↓
        Remote Repository
```

And changes can come in the opposite direction:

```text
Remote Repository
       │
       │ git fetch / git pull
       ↓
Local Repository
       ↓
Working Directory
```

---

# 26. Version Control vs Storage Redundancy

It is important to distinguish these concepts:

| Technology | Primary Purpose |
|---|---|
| RAID | Storage redundancy and fault tolerance |
| Git | Version control |
| GitHub | Git repository hosting and collaboration |
| Personal Access Token | Authentication credential |

A robust development environment can use several of these technologies together:

```text
Developer
   │
   ├── Git → Version history
   │
   ├── GitHub → Remote collaboration
   │
   └── RAID / Backups → Storage protection
```

---

# 27. Key Takeaways

```text
Version Control
    ↓
Tracks changes to files

Git
    ↓
Distributed version control system

Repository
    ↓
Contains project + Git history

GitHub
    ↓
Hosts Git repositories and enables collaboration

RAID
    ↓
Provides storage redundancy / fault tolerance

Authentication
    ↓
Verifies identity

Authorization
    ↓
Determines permitted actions

Personal Access Token
    ↓
Credential used for supported GitHub authentication

git push
    ↓
Local → Remote

git pull
    ↓
Remote → Local
```

The central development workflow is:

```text
Write Code
    ↓
Track Changes with Git
    ↓
Commit Changes
    ↓
Authenticate
    ↓
Push to Remote Repository
    ↓
Collaborate Through GitHub
```
