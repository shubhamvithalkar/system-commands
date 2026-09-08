---
layout: default
title: "L8.1: Automating Scripts"
---

# L8.1: Automating Scripts



# Cron, `at` and Scheduled Jobs

## 1. Introduction to Scheduled Jobs

Linux allows us to execute commands automatically at a specified time.

For example:

- Run a backup every night at 2 AM.
- Run a script every 10 minutes.
- Run a report every Monday.
- Execute a command once at 6 PM.
- Run initialization commands when the system starts.

Two important scheduling mechanisms are:

| Tool | Purpose |
|---|---|
| `cron` | Repeated/recurring jobs |
| `at` | One-time jobs |

The easiest mental model is:

```text
cron → "Run this repeatedly according to a schedule."

at → "Run this once at a specified time."
```

---

# 2. `cron`

`cron` is a Linux scheduling system that automatically executes commands or scripts at specified times.

A background service called the **cron daemon** continuously checks for scheduled jobs.

On Ubuntu, the service is generally called:

```text
cron
```

On some Unix/Linux systems, it may be called:

```text
crond
```

Check the cron service:

```bash
systemctl status cron
```

Example:

```text
● cron.service - Regular background program processing daemon
     Loaded: loaded
     Active: active (running)
```

Start the service if necessary:

```bash
sudo systemctl start cron
```

Enable it to start automatically at boot:

```bash
sudo systemctl enable cron
```

---

# 3. What Is a Cron Job?

A **cron job** is a command or script that cron executes automatically according to a schedule.

Example:

```cron
0 2 * * * /home/user/backup.sh
```

This means:

```text
At 02:00 every day
        ↓
execute
        ↓
/home/user/backup.sh
```

The first five fields define **when** the command should run.

---

# 4. Cron Job Definition

A normal user crontab entry has five time fields followed by the command:

```text
* * * * * command
│ │ │ │ │
│ │ │ │ └── Day of week
│ │ │ └──── Month
│ │ └────── Day of month
│ └──────── Hour
└────────── Minute
```

The five fields are:

```text
MINUTE HOUR DAY-OF-MONTH MONTH DAY-OF-WEEK
```

Remember:

```text
M H DOM MON DOW
```

---

# 5. The Five Cron Fields

## 5.1 Minute

Range:

```text
0-59
```

Example:

```text
30
```

means minute 30.

---

## 5.2 Hour

Range:

```text
0-23
```

Cron normally uses the 24-hour clock.

Examples:

```text
0  = 12 AM
1  = 1 AM
12 = 12 PM
13 = 1 PM
14 = 2 PM
18 = 6 PM
23 = 11 PM
```

---

## 5.3 Day of Month

Range:

```text
1-31
```

Example:

```text
15
```

means the 15th day of the month.

---

## 5.4 Month

Range:

```text
1-12
```

Examples:

```text
1  = January
6  = June
12 = December
```

---

## 5.5 Day of Week

Common numbering:

```text
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

On many cron implementations, `7` can also represent Sunday.

---

# 6. The `*` Wildcard

The `*` means:

> Every possible value for this field.

For example:

```cron
* * * * * command
```

means:

```text
every minute
```

Why?

```text
* minute       → every minute
* hour         → every hour
* day           → every day
* month         → every month
* weekday       → every weekday
```

---

# 7. Cron Operators

Cron supports several useful operators.

## 7.1 `*` — Every Value

```cron
* * * * * command
```

Runs every minute.

---

## 7.2 `,` — Multiple Values

```cron
0 9,18 * * * command
```

Runs at:

```text
09:00
18:00
```

every day.

---

## 7.3 `-` — Range

```cron
0 9 * * 1-5 command
```

Runs at 9 AM from:

```text
Monday
Tuesday
Wednesday
Thursday
Friday
```

---

## 7.4 `/` — Step

```cron
*/5 * * * * command
```

Runs every 5 minutes.

Approximately:

```text
00
05
10
15
20
25
30
35
40
45
50
55
```

Another example:

```cron
0 */2 * * * command
```

Runs every 2 hours.

---

# 8. Common Cron Examples

## Every minute

```cron
* * * * * /home/user/script.sh
```

---

## Every hour

```cron
0 * * * * /home/user/script.sh
```

Runs at:

```text
01:00
02:00
03:00
04:00
...
```

---

## Every day at 2 AM

```cron
0 2 * * * /home/user/backup.sh
```

---

## Every day at 6:30 PM

```cron
30 18 * * * /home/user/report.sh
```

---

## Every Monday at 9 AM

```cron
0 9 * * 1 /home/user/weekly.sh
```

---

## Monday to Friday at 9 AM

```cron
0 9 * * 1-5 /home/user/work.sh
```

---

## Every 10 minutes

```cron
*/10 * * * * /home/user/check.sh
```

---

## Every Sunday at midnight

```cron
0 0 * * 0 /home/user/weekly-backup.sh
```

---

# 9. `crontab`

`crontab` stands for **cron table**.

It is the interface used to manage a user's cron jobs.

The most important command is:

```bash
crontab -e
```

The `-e` means:

```text
edit
```

---

# 10. `crontab -e`

Use:

```bash
crontab -e
```

to edit the current user's cron jobs.

For example:

```bash
crontab -e
```

The system opens the crontab in an editor.

Add:

```cron
*/5 * * * * echo "Hello" >> /tmp/cron-test.txt
```

Save and exit.

The cron daemon will then execute this command every five minutes.

---

# 11. Viewing Cron Jobs

Use:

```bash
crontab -l
```

The `-l` means:

```text
list
```

Example:

```bash
crontab -l
```

Output:

```text
*/5 * * * * echo "Hello" >> /tmp/cron-test.txt
```

---

# 12. Removing Cron Jobs

The following command removes the current user's entire crontab:

```bash
crontab -r
```

Be careful with this command.

It can remove all cron jobs belonging to that user.

Some systems support:

```bash
crontab -i
```

which asks for confirmation before removal.

---

# 13. Practical Cron Test

Create a cron job that records the current date every minute.

Open the crontab:

```bash
crontab -e
```

Add:

```cron
* * * * * date >> /tmp/cron-test.txt
```

Wait a few minutes.

Then:

```bash
cat /tmp/cron-test.txt
```

You should see multiple timestamps:

```text
Tue Sep  8 09:10:01 IST 2026
Tue Sep  8 09:11:01 IST 2026
Tue Sep  8 09:12:01 IST 2026
```

The exact output depends on the current date and time.

---

# 14. Absolute Paths in Cron Jobs

A common mistake is:

```cron
* * * * * backup.sh
```

Cron may not find `backup.sh` because cron's environment is different from your interactive shell.

Prefer an absolute path:

```cron
* * * * * /home/user/backup.sh
```

Similarly, if you need Python, avoid relying unnecessarily on the interactive shell's `PATH`.

For example:

```cron
0 2 * * * /usr/bin/python3 /home/user/project/main.py
```

---

# 15. Cron Environment

Cron jobs normally run with a more limited environment than your interactive terminal.

A command that works in your terminal may fail under cron because of differences in:

- `PATH`
- working directory
- environment variables
- shell configuration

Therefore, scripts used by cron should generally use explicit paths and explicitly configure anything they depend on.

For example:

```cron
0 2 * * * /home/user/backup.sh >> /home/user/backup.log 2>&1
```

---

# 16. Logging Cron Output

Cron jobs often need logging.

Example:

```cron
0 2 * * * /home/user/backup.sh >> /home/user/backup.log 2>&1
```

Break it down:

```text
>> /home/user/backup.log
```

Append standard output to the log.

```text
2>&1
```

Redirect standard error to the same location as standard output.

Therefore:

```text
stdout → backup.log
stderr → backup.log
```

---

# 17. Startup Scripts

A **startup script** is a script or service that runs automatically when the system or a particular environment starts.

The basic idea is:

```text
System starts
     ↓
Startup mechanism
     ↓
Commands/services start
```

Startup tasks might include:

- Starting a service.
- Mounting a filesystem.
- Setting environment variables.
- Starting a background application.
- Performing system initialization.

---

# 18. Startup vs Cron

Do not confuse startup execution with time-based scheduling.

### Startup

```text
System starts
      ↓
Run something
```

### Cron

```text
Clock reaches scheduled time
      ↓
Run something
```

For example:

```text
Start a web server when Linux boots
        → startup/service mechanism
```

Whereas:

```text
Run a backup every day at 2 AM
        → cron
```

Modern Linux systems commonly use **systemd** to manage system services and boot-time startup.

For example:

```bash
systemctl status cron
```

checks the cron service.

A systemd service can also be configured to start automatically during boot.

---

# 19. `at` Command

The `at` command schedules a command to run **once in the future**.

Mental model:

```text
cron
 ↓
recurring

at
 ↓
one-time
```

For example:

```bash
at 18:00
```

allows you to schedule commands for 6 PM.

---

# 20. Basic `at` Syntax

```bash
at TIME
```

Example:

```bash
at 18:00
```

The shell then waits for commands.

Enter:

```bash
echo "Backup started" >> /tmp/backup.log
```

Finish the input by pressing:

```text
Ctrl-D
```

The job is now scheduled.

---

# 21. Practical `at` Example

Suppose you want to run a command once at 6 PM.

Start:

```bash
at 18:00
```

Enter:

```bash
echo "Meeting reminder" >> /tmp/reminder.txt
```

Then press:

```text
Ctrl-D
```

Unlike a cron job, this job is intended to execute only once.

---

# 22. Sending a Command Directly to `at`

You can also pipe a command into `at`:

```bash
echo 'date >> /tmp/test.txt' | at 18:00
```

Conceptually:

```text
echo command
     ↓
    at
     ↓
scheduled one-time execution
```

---

# 23. Viewing `at` Jobs

Use:

```bash
atq
```

`atq` displays pending jobs in the `at` queue.

Example:

```text
3       Tue Sep  8 18:00:00 2026 a user
```

The first value:

```text
3
```

is the job ID.

---

# 24. Removing an `at` Job

First list the jobs:

```bash
atq
```

Suppose you see:

```text
3       Tue Sep  8 18:00:00 2026 a user
```

Remove job `3`:

```bash
atrm 3
```

Therefore:

```text
atq
 ↓
find job ID
 ↓
atrm JOB_ID
```

---

# 25. `cron` vs `at`

| Feature | `cron` | `at` |
|---|---|---|
| Purpose | Recurring jobs | One-time jobs |
| Configuration | Crontab | `at` queue |
| Create | `crontab -e` | `at TIME` |
| List | `crontab -l` | `atq` |
| Remove | `crontab -r` | `atrm JOB_ID` |
| Example | Every day at 2 AM | Today at 6 PM |

---

# 26. Important Commands

## Cron

```bash
crontab -e
```

Edit cron jobs.

```bash
crontab -l
```

List cron jobs.

```bash
crontab -r
```

Remove the user's crontab.

```bash
systemctl status cron
```

Check the cron service.

---

## `at`

```bash
at TIME
```

Create a one-time scheduled job.

```bash
atq
```

List pending jobs.

```bash
atrm JOB_ID
```

Remove a pending job.

---

# 27. Exam-Oriented Questions

## Question 1

Run `/home/user/backup.sh` every day at 2 AM.

### Solution

```cron
0 2 * * * /home/user/backup.sh
```

---

## Question 2

Run a script every 5 minutes.

### Solution

```cron
*/5 * * * * /home/user/script.sh
```

---

## Question 3

Run a script every Monday at 8 AM.

### Solution

```cron
0 8 * * 1 /home/user/script.sh
```

---

## Question 4

Which command edits the current user's cron jobs?

### Solution

```bash
crontab -e
```

---

## Question 5

Which command lists the current user's cron jobs?

### Solution

```bash
crontab -l
```

---

## Question 6

Which command is used for a one-time scheduled job?

### Solution

```bash
at
```

---

## Question 7

Which command lists pending `at` jobs?

### Solution

```bash
atq
```

---

## Question 8

How do you remove `at` job number 5?

### Solution

```bash
atrm 5
```

---

## Question 9

What does this mean?

```cron
30 18 * * 1-5 /home/user/report.sh
```

### Solution

```text
30   → minute 30
18   → 6 PM
*    → every day of month
*    → every month
1-5  → Monday-Friday
```

Therefore:

```text
Run report.sh at 6:30 PM,
Monday through Friday.
```

---

## Question 10

What does this mean?

```cron
*/10 * * * * /home/user/check.sh
```

### Solution

It runs:

```text
Every 10 minutes
```

---

# 28. Common Mistakes

## Mistake 1 — Wrong Cron Field Order

Incorrect mental model:

```text
hour minute day month weekday
```

Correct:

```text
minute hour day-of-month month day-of-week
```

Remember:

```text
M H DOM MON DOW
```

---

## Mistake 2 — Forgetting 24-Hour Time

6 PM is:

```text
18
```

Therefore:

```cron
0 18 * * * command
```

means 6 PM every day.

---

## Mistake 3 — Thinking Cron Runs Once

This:

```cron
0 2 * * * command
```

does not mean:

```text
Run once tomorrow at 2 AM.
```

It means:

```text
Run every day at 2 AM.
```

---

## Mistake 4 — Confusing `at` and `cron`

Remember:

```text
cron = recurring
at   = one-time
```

---

## Mistake 5 — Using Relative Paths

Avoid:

```cron
0 2 * * * ./backup.sh
```

Prefer:

```cron
0 2 * * * /home/user/backup.sh
```

---

# 29. Complete Mental Model

```text
                    JOB SCHEDULING
                          │
              ┌───────────┴───────────┐
              │                       │
            cron                     at
              │                       │
         recurring                 one-time
              │                       │
         crontab -e               at TIME
              │                       │
         crontab -l                  atq
         crontab -r                 atrm
```

Startup execution is a related but different concept:

```text
                    SYSTEM STARTUP
                          │
                          ↓
                    systemd/services
                          │
                          ↓
                    Run at boot
```

---

# 30. Final Cheat Sheet

## Cron Format

```text
* * * * * command
│ │ │ │ │
│ │ │ │ └── Day of week
│ │ │ └──── Month
│ │ └────── Day of month
│ └──────── Hour
└────────── Minute
```

Remember:

```text
MINUTE HOUR DAY-OF-MONTH MONTH DAY-OF-WEEK
```

---

## Common Cron Schedules

```cron
* * * * * command
```

Every minute.

```cron
*/5 * * * * command
```

Every 5 minutes.

```cron
0 * * * * command
```

Every hour.

```cron
0 2 * * * command
```

Every day at 2 AM.

```cron
30 18 * * * command
```

Every day at 6:30 PM.

```cron
0 9 * * 1 command
```

Every Monday at 9 AM.

```cron
0 9 * * 1-5 command
```

Monday through Friday at 9 AM.

---

## Cron Commands

```bash
crontab -e
```

Edit.

```bash
crontab -l
```

List.

```bash
crontab -r
```

Remove.

```bash
systemctl status cron
```

Check cron service.

---

## `at` Commands

```bash
at TIME
```

Schedule a one-time job.

```bash
atq
```

List pending jobs.

```bash
atrm JOB_ID
```

Remove a pending job.

---

# 31. Key Takeaways

```text
cron
→ recurring scheduled jobs

at
→ one-time scheduled jobs

crontab -e
→ edit cron jobs

crontab -l
→ list cron jobs

crontab -r
→ remove user's crontab

atq
→ list at jobs

atrm
→ remove at job

cron format
→ minute hour day-of-month month day-of-week
```

The most important distinction to remember for the exam is:

```text
"Every day at 2 AM"
        ↓
      cron

"Run once at 6 PM"
        ↓
       at
```
