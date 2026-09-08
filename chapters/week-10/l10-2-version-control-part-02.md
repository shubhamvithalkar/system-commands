---
layout: default
title: "L10.2 - Version Control - Part 02"
---

# L10.2 - Version Control - Part 02



# GitHub Setup, Branching, Merging, and Git Troubleshooting

## 1. Setting Up a GitHub Account

**GitHub** provides remote hosting for Git repositories and supports collaboration between developers.

A typical setup is:

```text
GitHub Account
      ↓
Security Configuration
      ↓
Create Repository
      ↓
Configure Git Locally
      ↓
Connect Local Repository
      ↓
Push Code
```

Before using GitHub for development, configure your account and enable appropriate security protections.

---

# 2. Two-Factor Authentication

**Two-factor authentication (2FA)** adds an additional authentication step to an account.

Without 2FA:

```text
Username + Password
        ↓
      Account
```

With 2FA:

```text
Username + Password
        ↓
Second Authentication Factor
        ↓
      Account
```

The second factor may involve an authenticator application, security key, or another supported verification method.

2FA helps protect an account even if the password is compromised.

---

# 3. Git Branches

A **branch** is an independent line of development in Git.

The default branch is commonly called:

```text
main
```

A developer can create another branch:

```bash
git branch feature-login
```

Switch to it:

```bash
git switch feature-login
```

Or create and switch in one command:

```bash
git switch -c feature-login
```

---

# 4. Why Branches Are Used

Suppose the main project is:

```text
main
 │
 ├── Commit A
 ├── Commit B
 └── Commit C
```

A developer wants to work on a new feature.

Instead of modifying `main` directly:

```text
main
 │
 ├── A
 ├── B
 └── C
      \
       D
       E
       F
```

The new commits can be made on a separate branch.

This allows developers to work on features or fixes independently.

---

# 5. Typical Branching Workflow

```bash
git switch main
```

Create a feature branch:

```bash
git switch -c feature-login
```

Make changes to the project.

Check the changes:

```bash
git status
```

Stage them:

```bash
git add .
```

Commit them:

```bash
git commit -m "Add login feature"
```

Push the branch:

```bash
git push -u origin feature-login
```

---

# 6. Listing Branches

List local branches:

```bash
git branch
```

Example:

```text
* feature-login
  main
```

The `*` indicates the currently active branch.

To see remote branches as well:

```bash
git branch -a
```

---

# 7. Switching Branches

Switch to `main`:

```bash
git switch main
```

Switch to another branch:

```bash
git switch feature-login
```

Older Git workflows commonly use:

```bash
git checkout main
```

and:

```bash
git checkout feature-login
```

`git switch` is specifically intended for branch switching and is generally clearer for this purpose.

---

# 8. Merging Branches

Suppose we have:

```text
main
 │
 A
 │
 B
 │
 C

feature
 │
 └── D
     └── E
```

The feature branch contains changes that should be incorporated into `main`.

First switch to the branch that should receive the changes:

```bash
git switch main
```

Then merge:

```bash
git merge feature
```

Conceptually:

```text
feature
   │
   D
   │
   E
   │
   └────────┐
            ↓
main ── A ── B ── C ── Merge
```

---

# 9. Important Rule When Merging

When you run:

```bash
git merge feature
```

while on:

```text
main
```

you are saying:

> Merge the changes from `feature` into the current branch, `main`.

Therefore:

```bash
git switch main
git merge feature
```

means:

```text
feature → main
```

---

# 10. Merge Conflicts

A merge conflict can occur when two branches modify the same part of a file in incompatible ways.

Example:

```text
main:
    print("Hello")

feature:
    print("Hi")
```

Git may not know which version should be kept.

A conflict may look like:

```text
<<<<<<< HEAD
print("Hello")
=======
print("Hi")
>>>>>>> feature
```

The developer must manually decide which version should remain.

After resolving the file:

```bash
git add .
```

Then complete the merge:

```bash
git commit
```

---

# 11. Branching Mental Model

Think of branches as different paths from the same project history.

```text
                 feature
                    │
                    ↓
A ─── B ─── C ───── D ─── E
             \
              \
               main
```

More commonly:

```text
A ─── B ─── C ─── F ─── G    main
             \
              D ─── E        feature
```

After merging:

```text
A ─── B ─── C ─── F ─── G ─── M    main
             \              /
              D ─── E ─────
```

---

# 12. Creating a GitHub Repository

When creating a repository, choose a clear and meaningful name.

For example:

```text
student-management-system
```

is easier to work with than:

```text
My Project!!! @2026
```

A practical naming convention is:

```text
lowercase-with-hyphens
```

Examples:

```text
expense-tracker
employee-management
weather-dashboard
data-analysis-project
```

Avoid unnecessary special characters and spaces because they can make command-line usage and automation more complicated.

---

# 13. Local Repository Setup

After creating a GitHub repository, a local project can be initialized with:

```bash
git init
```

Check the repository:

```bash
git status
```

Configure your Git identity:

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

These values are recorded in your Git commits.

---

# 14. Checking Git Configuration

View the current configuration:

```bash
git config --list
```

Check the username:

```bash
git config user.name
```

Check the email:

```bash
git config user.email
```

---

# 15. Global Git Configuration

If you want your identity to apply to all repositories for the current user:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Check the global configuration:

```bash
git config --global --list
```

Conceptually:

```text
Global Git Configuration
        ↓
Default identity
        ↓
Git repositories
```

Repository-specific configuration can override global settings.

---

# 16. Cloning a Repository

To download an existing repository:

```bash
git clone <repository-url>
```

For example:

```bash
git clone https://github.com/user/project.git
```

Git creates a local copy containing the repository history.

```text
GitHub Repository
       ↓
   git clone
       ↓
Local Repository
```

---

# 17. Cloning a Private Repository

A private repository requires appropriate authorization.

Conceptually:

```text
git clone
    ↓
GitHub
    ↓
Authentication
    ↓
Authorization
    ↓
Repository Access
```

For HTTPS-based Git operations, authentication may use a supported credential mechanism such as a Personal Access Token rather than an account password.

Do not put credentials directly into repository URLs or scripts.

---

# 18. Passwords vs Personal Access Tokens

When using GitHub over HTTPS, a GitHub account password is not the normal replacement credential for Git operations.

Instead, GitHub supports token-based authentication for supported HTTPS workflows.

Conceptually:

```text
Git
 ↓
HTTPS
 ↓
GitHub
 ↓
Credential / Token
 ↓
Authentication
```

Treat tokens as secrets.

Never commit them to Git repositories.

---

# 19. Connecting an Existing Local Repository to GitHub

Suppose you already have:

```text
my-project/
├── app.py
├── README.md
└── ...
```

Initialize Git:

```bash
cd my-project
git init
```

Add files:

```bash
git add .
```

Create a commit:

```bash
git commit -m "Initial commit"
```

Add the GitHub repository as a remote:

```bash
git remote add origin <repository-url>
```

Check it:

```bash
git remote -v
```

Push:

```bash
git push -u origin main
```

---

# 20. Checking Repository Status

One of the most important Git commands is:

```bash
git status
```

It tells you things such as:

- Current branch
- Modified files
- Untracked files
- Staged files
- Changes ready to commit

Example:

```text
On branch main

Changes not staged for commit:
  modified: app.py
```

---

# 21. Troubleshooting Before `git push`

Before pushing changes, check:

```bash
git status
```

Check the current branch:

```bash
git branch
```

Check the remote:

```bash
git remote -v
```

Check recent commits:

```bash
git log --oneline
```

Then push:

```bash
git push
```

A useful troubleshooting sequence is:

```text
git status
     ↓
git branch
     ↓
git remote -v
     ↓
git log --oneline
     ↓
git push
```

---

# 22. Network Problems During Git Operations

Git operations involving a remote repository require network connectivity.

For example:

```bash
git push
```

communicates with the remote server.

If there is a network problem, possible causes include:

- Internet connectivity
- DNS problems
- Proxy configuration
- Firewall restrictions
- Remote server availability
- Incorrect remote URL
- Authentication problems

First inspect the repository configuration:

```bash
git remote -v
```

Then check whether the remote is reachable using the appropriate network tools.

---

# 23. Common Git Troubleshooting Commands

Check repository state:

```bash
git status
```

Check remotes:

```bash
git remote -v
```

Check current branch:

```bash
git branch --show-current
```

Check Git version:

```bash
git --version
```

Check Git configuration:

```bash
git config --list
```

Check commit history:

```bash
git log --oneline
```

---

# 24. Preparing Changes for Push

Suppose `app.py` has been modified.

Check:

```bash
git status
```

Stage the file:

```bash
git add app.py
```

Check again:

```bash
git status
```

Commit:

```bash
git commit -m "Update application"
```

Push:

```bash
git push
```

The workflow is:

```text
Modified Files
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

# 25. Complete Branching Example

Start from `main`:

```bash
git switch main
```

Create a feature branch:

```bash
git switch -c feature-report
```

Modify files.

Stage:

```bash
git add .
```

Commit:

```bash
git commit -m "Add report feature"
```

Return to `main`:

```bash
git switch main
```

Merge:

```bash
git merge feature-report
```

Now the changes from:

```text
feature-report
```

have been incorporated into:

```text
main
```

---

# 26. Branching and Merging Workflow

A complete workflow looks like:

```text
                 main
                  │
                  ↓
            Create Branch
                  │
                  ↓
            feature branch
                  │
          ┌───────┴───────┐
          ↓               ↓
       Modify          Modify
          │               │
          └───────┬───────┘
                  ↓
                Commit
                  │
                  ↓
             Switch to main
                  │
                  ↓
                Merge
                  │
                  ↓
             Updated main
```

---

# 27. Local and Remote Branches

A branch can exist locally:

```text
main
feature-login
```

A remote-tracking branch may appear as:

```text
origin/main
origin/feature-login
```

The remote named `origin` commonly refers to the GitHub repository.

For example:

```bash
git push -u origin feature-login
```

This pushes the local branch:

```text
feature-login
```

to the remote repository.

---

# 28. Fetching Remote Changes

`git fetch` downloads information about changes from a remote repository without automatically merging those changes into the current branch.

```bash
git fetch origin
```

Conceptually:

```text
Remote Repository
       ↓
   git fetch
       ↓
Remote-tracking information
```

This gives you an opportunity to inspect changes before integrating them.

---

# 29. Pulling Remote Changes

`git pull` generally performs a fetch followed by integration of the fetched changes into the current branch.

```bash
git pull
```

Conceptually:

```text
Remote
  ↓
fetch
  ↓
integrate
  ↓
Local Branch
```

---

# 30. GitHub Repository Setup — Complete Example

Create a project:

```bash
mkdir my-project
cd my-project
```

Initialize Git:

```bash
git init
```

Configure identity if necessary:

```bash
git config user.name "Your Name"
git config user.email "your-email@example.com"
```

Create project files:

```bash
touch README.md
```

Stage:

```bash
git add README.md
```

Commit:

```bash
git commit -m "Initial commit"
```

Add GitHub remote:

```bash
git remote add origin <repository-url>
```

Check:

```bash
git remote -v
```

Rename the current branch if needed:

```bash
git branch -M main
```

Push:

```bash
git push -u origin main
```

---

# 31. Important Git Commands

| Command | Purpose |
|---|---|
| `git init` | Initialize a repository |
| `git clone` | Copy a remote repository |
| `git status` | Show repository state |
| `git add` | Stage changes |
| `git commit` | Save a snapshot in local history |
| `git push` | Send commits to a remote |
| `git pull` | Fetch and integrate remote changes |
| `git fetch` | Download remote updates without integrating |
| `git branch` | Manage/list branches |
| `git switch` | Switch or create branches |
| `git merge` | Combine branch histories |
| `git remote -v` | Display remote repositories |
| `git log` | View commit history |
| `git config` | Configure Git |

---

# 32. Core Mental Model

Remember the Git workflow:

```text
                 Git

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
                    │
                    │ git fetch/pull
                    ↓
             Local Repository
```

And for collaboration:

```text
                 main
                  │
                  ├──────────────┐
                  │              │
                  ↓              ↓
             feature-A      feature-B
                  │              │
                  ↓              ↓
               commits        commits
                  │              │
                  └──────┬───────┘
                         ↓
                       merge
                         ↓
                        main
```

The essential ideas are:

```text
Git
 ↓
Version control

GitHub
 ↓
Remote repository hosting + collaboration

Branch
 ↓
Independent line of development

Commit
 ↓
Recorded snapshot of changes

Merge
 ↓
Combine branch histories

Push
 ↓
Local → Remote

Pull
 ↓
Remote → Local

2FA
 ↓
Additional account security

PAT / supported credentials
 ↓
Authentication for supported GitHub operations
```
