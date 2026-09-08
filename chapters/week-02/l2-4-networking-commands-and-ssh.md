---
layout: default
title: "L2.4: Networking Commands and SSH"
---

# L2.4: Networking Commands and SSH

# Remote Access, Networking, IP Addresses, Ports, SSH, and SELinux

## 1. Overview of Remote Machine Access

Modern Linux systems frequently need to communicate with other computers.

For example:

```text
Your Computer
     |
     | Network
     ↓
Remote Linux Server
```

You may want to:

- Log in to another machine
- Copy files
- Run commands remotely
- Access a web server
- Access a database
- Connect to cloud servers
- Manage virtual machines
- Connect machines inside a private network
- Connect to the Internet

The foundation of remote access is **networking**.

---

# 2. Private Networks and the Internet

A machine can communicate with:

```text
Private Network
```

or:

```text
Public Internet
```

### Private Network

A private network is a network whose addresses are intended for internal communication.

Common private IPv4 ranges are:

```text
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
```

Examples:

```text
192.168.1.10
192.168.1.20
192.168.1.50
```

These addresses are commonly used inside homes, offices, labs, and cloud/private networks.

---

## 3. Public IP Address

A machine that needs to be directly reachable from the Internet may have a **public IP address**.

Example:

```text
203.0.113.10
```

This is an example/documentation address.

Mental model:

```text
                    Internet
                       |
                Public IP
                       |
                 Router/Firewall
                       |
             ---------------------
             |        |          |
          PC       Server      VM
       192.168.1.10  .20       .30
```

The private addresses are used internally, while the router/firewall controls communication between the private network and the Internet.

---

# 4. Hierarchical Addressing

IP addressing is hierarchical.

Instead of every computer on Earth needing to know the location of every other computer directly, addresses are organized into networks and subnets.

For example:

```text
192.168.1.0/24
```

represents a network containing addresses in the range:

```text
192.168.1.0
192.168.1.1
...
192.168.1.255
```

The `/24` is the **prefix length**.

It indicates how many bits identify the network portion.

---

# 5. Network Prefix and Host Portion

Consider:

```text
192.168.1.25/24
```

Conceptually:

```text
Network portion     Host portion
192.168.1           25
```

The `/24` means:

```text
24 bits → network
8 bits  → host
```

because IPv4 contains:

```text
32 bits
```

Therefore:

```text
32 - 24 = 8
```

host bits.

---

# 6. Why Hierarchical Addressing Is Useful

Without hierarchical addressing, routers would have to maintain enormous amounts of information about individual machines.

With hierarchical addressing:

```text
Internet
   |
   +-- Network A
   |      |
   |      +-- Host 1
   |      +-- Host 2
   |
   +-- Network B
          |
          +-- Host 1
          +-- Host 2
```

Routers can make decisions based on network prefixes.

This makes routing more scalable.

---

# 7. Routing

A **router** decides where network packets should go.

Mental model:

```text
Source
  |
  | packet
  ↓
Router
  |
  +----→ Network A
  |
  +----→ Network B
  |
  +----→ Internet
```

A Linux machine also has a routing table.

You can inspect it using:

```bash
ip route
```

Example:

```text
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10
```

This tells the machine how to reach different networks.

---

# 8. Default Route

A particularly important routing rule is:

```text
default
```

Example:

```text
default via 192.168.1.1 dev eth0
```

This means:

> If there is no more specific route for the destination, send the packet through `192.168.1.1`.

Usually this is the local router/gateway.

Mental model:

```text
Unknown destination
       ↓
Default Gateway
       ↓
      Router
       ↓
    Internet
```

---

# 9. Standard Port Numbers

An IP address identifies a **machine/interface**.

A port identifies a **network service/application endpoint** on that machine.

Think:

```text
IP address → Which machine?
Port       → Which service?
```

For example:

```text
192.168.1.20:22
```

means:

```text
Machine = 192.168.1.20
Port    = 22
```

Port 22 commonly corresponds to:

```text
SSH
```

---

# 10. Common Network Ports

Some important standard ports:

| Port | Common Service | Purpose |
|---:|---|---|
| `20` | FTP data | FTP data channel |
| `21` | FTP | File Transfer Protocol |
| `22` | SSH | Secure remote login |
| `23` | Telnet | Remote login, insecure |
| `25` | SMTP | Mail transfer |
| `53` | DNS | Domain Name System |
| `67` | DHCP | DHCP server |
| `68` | DHCP | DHCP client |
| `80` | HTTP | Web traffic |
| `110` | POP3 | Email retrieval |
| `143` | IMAP | Email retrieval |
| `443` | HTTPS | Secure web traffic |
| `3306` | MySQL | Database service |
| `5432` | PostgreSQL | PostgreSQL |
| `6379` | Redis | Redis |

These are conventional/default ports. A service can often be configured to listen on a different port.

---

# 11. IP Address + Port

Suppose a server has:

```text
IP = 192.168.1.50
```

and SSH listens on:

```text
22
```

Then:

```text
192.168.1.50:22
```

identifies the SSH endpoint.

A web server may be:

```text
192.168.1.50:80
```

or:

```text
192.168.1.50:443
```

Therefore the same machine can provide multiple services:

```text
192.168.1.50:22   → SSH
192.168.1.50:80   → HTTP
192.168.1.50:443  → HTTPS
192.168.1.50:5432 → PostgreSQL
```

---

# 12. Server Security — Multiple Layers

A secure server should not depend on only one security mechanism.

Think of security as layers:

```text
                 Internet
                    ↓
              ┌───────────┐
              │ Firewall  │
              └─────┬─────┘
                    ↓
              ┌───────────┐
              │   SSH     │
              │ Security  │
              └─────┬─────┘
                    ↓
              ┌───────────┐
              │ File      │
              │ Permissions│
              └─────┬─────┘
                    ↓
              ┌───────────┐
              │ SELinux   │
              └─────┬─────┘
                    ↓
                Resources
```

Different layers protect against different types of mistakes and attacks.

---

# 13. Traditional Linux Permissions

Linux files have permissions for:

```text
User
Group
Other
```

For example:

```text
-rwxr-x---
```

means:

```text
User  → rwx
Group → r-x
Other → ---
```

These permissions provide a basic access-control mechanism.

However, traditional Unix permissions are not the only security layer.

---

# 14. SELinux

## What is SELinux?

SELinux stands for:

> Security-Enhanced Linux

It provides an additional access-control mechanism.

SELinux was developed to provide **Mandatory Access Control (MAC)** capabilities.

Traditional Unix permissions are generally **Discretionary Access Control (DAC)**.

---

# 15. DAC vs MAC

### DAC

Traditional permissions such as:

```text
rwx
```

are discretionary.

The owner generally controls permissions for their files.

### MAC

Mandatory Access Control introduces additional security policies that can restrict what a process is allowed to access.

Mental model:

```text
Normal permissions:
"Does this user have permission?"

SELinux:
"Is this process allowed to perform this action under the security policy?"
```

This provides an additional security layer.

---

# 16. SELinux Modes

SELinux commonly has three modes:

```text
Enforcing
Permissive
Disabled
```

### Enforcing

SELinux policy is actively enforced.

Violations can be blocked.

```text
Policy violation
      ↓
     DENY
```

### Permissive

Policy violations are logged, but access is generally not blocked by SELinux.

```text
Policy violation
      ↓
     LOG
      ↓
  operation continues
```

### Disabled

SELinux is not active.

---

# 17. Checking SELinux Status

On systems using SELinux, a common command is:

```bash
getenforce
```

Possible output:

```text
Enforcing
```

or:

```text
Permissive
```

or:

```text
Disabled
```

Another useful command is:

```bash
sestatus
```

which provides more detailed SELinux information.

---

# 18. Essential Networking Commands

Linux provides several commands for inspecting network configuration and activity.

---

## `ip`

The modern general-purpose networking command is:

```bash
ip
```

For addresses:

```bash
ip addr
```

or:

```bash
ip a
```

This shows network interfaces and their IP addresses.

---

## `ip route`

Display routing information:

```bash
ip route
```

Example:

```text
default via 192.168.1.1 dev enp3s0
192.168.1.0/24 dev enp3s0 proto kernel scope link src 192.168.1.20
```

---

## `ip link`

Show network interfaces:

```bash
ip link
```

It provides information such as:

- Interface names
- Interface state
- MAC addresses
- Link status

---

# 19. `ping`

`ping` tests network reachability using ICMP.

Example:

```bash
ping 8.8.8.8
```

You may see:

```text
64 bytes from 8.8.8.8: icmp_seq=1 ttl=... time=...
```

This can help determine whether a host is reachable.

However, failure to respond to `ping` does **not necessarily mean the host is down**. Firewalls may block ICMP.

---

# 20. `ss`

`ss` displays socket/network connection information.

For example:

```bash
ss -tuln
```

Common options:

```text
-t → TCP
-u → UDP
-l → listening sockets
-n → don't resolve names; show numeric values
```

This is useful for finding services listening on ports.

Example:

```text
LISTEN 0 128 0.0.0.0:22 0.0.0.0:*
```

This indicates something is listening on TCP port 22.

---

# 21. `curl`

`curl` can communicate with network services, especially HTTP/HTTPS servers.

Example:

```bash
curl http://example.com
```

It can be useful for checking whether a web server responds.

For headers:

```bash
curl -I https://example.com
```

---

# 22. `hostname`

Display the machine's hostname:

```bash
hostname
```

Example:

```text
ubuntu-server
```

---

# 23. `hostname -I`

Display the machine's assigned IP addresses:

```bash
hostname -I
```

Example:

```text
192.168.1.20 10.0.0.5
```

A machine can have multiple addresses.

---

# 24. Public IP Address

Your local/private address is not necessarily your public Internet address.

For example:

```text
Private IP:
192.168.1.20
```

The router may have:

```text
Public IP:
203.0.113.50
```

Conceptually:

```text
Laptop
192.168.1.20
      |
      ↓
Router
Public IP 203.0.113.50
      |
      ↓
Internet
```

Network Address Translation (NAT) is commonly used to allow many private machines to share a public IPv4 address.

---

# 25. Multiple IP Addresses on One Machine

A remote machine can have multiple IP addresses.

This is completely normal.

For example:

```text
Machine
├── 192.168.1.10
├── 10.0.0.5
└── 172.17.0.1
```

These may correspond to different interfaces or network environments.

---

# 26. Why Virtual Machines Have Multiple IP Addresses

Suppose you have:

```text
Physical Host
     |
     +-- Virtual Machine
```

The host may have:

```text
192.168.1.10
```

while the VM has:

```text
192.168.122.50
```

The VM may communicate through a virtual network interface.

Mental model:

```text
Physical Network
       |
    Host OS
       |
 Virtual Network
       |
      VM
```

---

# 27. Containers and IP Addresses

Containers commonly create additional network interfaces and private networks.

For example:

```text
Host
 |
 +-- Container A → 172.17.0.2
 |
 +-- Container B → 172.17.0.3
```

Docker commonly creates a bridge network such as:

```text
docker0
```

with addresses in a private subnet.

Therefore a machine running containers may have several networking layers:

```text
Internet
   ↓
Host network
   ↓
Container network
   ↓
Container
```

---

# 28. Private Network Setup

A common private-network arrangement is:

```text
                    Internet
                       |
                    Router
                       |
              192.168.1.1
                       |
        -----------------------------
        |             |             |
      Host A        Host B        Host C
   192.168.1.10  192.168.1.20  192.168.1.30
```

Machines within the same private network can communicate directly if:

- They have appropriate IP configuration.
- Routing exists.
- Firewalls allow the traffic.
- The required service is listening.

---

# 29. IP Address Aliases

An interface can have multiple IP addresses.

For example:

```text
eth0
 ├── 192.168.1.10
 └── 192.168.1.11
```

The additional address can be considered an **IP alias** or secondary address.

Modern Linux generally manages this using the `ip` command.

View addresses:

```bash
ip addr show
```

---

## Adding an Additional IP Address

For example:

```bash
sudo ip addr add 192.168.1.11/24 dev eth0
```

This adds another address to `eth0`.

Check:

```bash
ip addr show dev eth0
```

### Important

Changes made directly with:

```bash
ip addr add
```

are typically runtime configuration and may not survive a reboot.

Persistent network configuration depends on the Linux distribution and networking system in use.

---

# 30. Reverse DNS Lookup

Normally:

```text
hostname → IP address
```

is called a forward lookup.

Example:

```text
server.example.com
        ↓
192.168.1.20
```

A reverse lookup goes in the opposite direction:

```text
IP address
    ↓
hostname
```

Example:

```text
192.168.1.20
      ↓
server.example.com
```

---

## Reverse Lookup with `dig`

If `dig` is installed:

```bash
dig -x 8.8.8.8
```

The `-x` option performs a reverse lookup.

Another command is:

```bash
host 8.8.8.8
```

---

# 31. Important Distinction: Reverse DNS Is Not Guaranteed

Not every IP address has a useful reverse DNS record.

Therefore:

```text
IP → hostname
```

may:

- Return a hostname
- Return multiple names
- Return no useful hostname

Reverse DNS is controlled through DNS records and does not automatically exist for every IP address.

---

# 32. SSH — Secure Remote Login

## What is SSH?

SSH stands for:

> Secure Shell

It is commonly used to securely connect to remote Linux machines.

Basic syntax:

```bash
ssh username@hostname
```

Example:

```bash
ssh user@192.168.1.20
```

The connection normally uses TCP port:

```text
22
```

---

# 33. SSH with a Specific Port

If SSH is listening on a non-standard port:

```bash
ssh -p 2222 user@server
```

Here:

```text
-p 2222
```

specifies port 2222.

---

# 34. Connecting to Multiple Machines

Suppose you have:

```text
server1
server2
server3
```

You can connect individually:

```bash
ssh user@server1
```

Then:

```bash
ssh user@server2
```

Then:

```bash
ssh user@server3
```

Each SSH session establishes a connection to a remote machine.

---

# 35. SSH Mental Model

Think of SSH as:

```text
Your Terminal
     |
     | encrypted SSH connection
     ↓
Remote SSH Server
     |
     ↓
Remote Shell
```

Once connected, commands such as:

```bash
pwd
ls
cd
ps
ip addr
```

execute on the remote machine.

---

# 36. SSH and Authentication

SSH can authenticate users using methods such as:

- Password authentication
- SSH public/private keys
- Other configured authentication mechanisms

SSH keys are commonly preferred for automated and administrative access.

The basic idea is:

```text
Private Key → stays with you
Public Key  → installed/authorized on server
```

Never share your private key.

---

# 37. Free Ubuntu Linux Machines

Ubuntu Linux itself is available as free/open-source software.

You can run Ubuntu:

- On your own computer
- Inside a virtual machine
- In containers
- On various cloud platforms
- On remote servers that provide free tiers or temporary environments

The exact availability and terms of remote free machines depend on the provider.

The important networking concept is the same:

```text
Your computer
      |
      | SSH
      ↓
Remote Ubuntu machine
```

---

# 38. Web Server Access

A web server usually listens on:

```text
80 → HTTP
443 → HTTPS
```

Suppose a remote machine has:

```text
192.168.1.20
```

and a web server is listening on port 80.

You can access:

```text
http://192.168.1.20
```

or test it with:

```bash
curl http://192.168.1.20
```

---

# 39. Checking Whether a Web Server Is Listening

Use:

```bash
ss -tuln
```

Look for:

```text
:80
```

or:

```text
:443
```

For example:

```text
LISTEN 0 128 0.0.0.0:80 0.0.0.0:*
```

This indicates a service is listening on TCP port 80.

---

# 40. Listening Address Matters

A service can listen on:

```text
127.0.0.1:80
```

or:

```text
0.0.0.0:80
```

These are very different.

### `127.0.0.1`

The service is reachable only through the local loopback interface.

```text
Remote machine
     X
     |
127.0.0.1
```

Other machines generally cannot directly access it.

### `0.0.0.0`

For an IPv4 listening socket, this generally means the service is listening on all available IPv4 interfaces.

```text
eth0
  \
   +---- Service :80
  /
other interface
```

Firewall rules can still prevent remote access.

---

# 41. File System Protection and SELinux

SELinux can protect resources even when traditional Unix permissions appear to allow access.

For example:

```text
Web Server Process
       |
       | tries to access
       ↓
     File
```

Traditional permissions may say:

```text
ALLOW
```

but SELinux policy may say:

```text
DENY
```

The result can be:

```text
Access blocked
```

This is an important concept in server security.

---

# 42. SELinux Security Contexts

SELinux associates security information with objects and processes.

For example:

```bash
ls -Z
```

can display SELinux security contexts on systems where SELinux is enabled.

You may see information resembling:

```text
system_u:object_r:httpd_sys_content_t:s0
```

The exact context depends on the system.

A web server may be allowed to access files with an appropriate SELinux type, while access to other files may be denied.

---

# 43. Why SELinux Is Useful for Web Servers

Suppose an attacker compromises a web application.

Without additional restrictions, the compromised process might attempt to access sensitive files.

SELinux can restrict what that web-server process is allowed to access.

Mental model:

```text
Web Server
     |
     | compromised process
     ↓
SELinux Policy
     |
     +---- allowed resource
     |
     +---- DENIED resource
```

This follows the principle of **least privilege**.

---

# 44. Checking SELinux During Troubleshooting

If an application cannot access a file, do not immediately assume ordinary permissions are the only problem.

Check:

```bash
ls -l filename
```

Then, on an SELinux system:

```bash
ls -Z filename
```

Check SELinux status:

```bash
getenforce
```

For detailed status:

```bash
sestatus
```

This helps determine whether SELinux is involved.

---

# 45. Useful Networking Command Cheat Sheet

```bash
ip addr
```

→ Show IP addresses/interfaces.

```bash
ip link
```

→ Show network interfaces.

```bash
ip route
```

→ Show routing table.

```bash
hostname
```

→ Show hostname.

```bash
hostname -I
```

→ Show assigned IP addresses.

```bash
ping HOST
```

→ Test ICMP reachability.

```bash
ss -tuln
```

→ Show listening TCP/UDP sockets numerically.

```bash
curl URL
```

→ Make an HTTP/HTTPS request.

```bash
dig -x IP
```

→ Reverse DNS lookup.

```bash
host IP
```

→ Perform DNS lookup/reverse lookup.

```bash
ssh user@host
```

→ Connect to remote machine.

```bash
ssh -p PORT user@host
```

→ SSH using a specified port.

---

# 46. Network Troubleshooting Mental Model

When a remote service does not work, troubleshoot layer by layer.

```text
1. Does the machine have an IP?
          ↓
      ip addr

2. Is routing configured?
          ↓
      ip route

3. Is the destination reachable?
          ↓
      ping

4. Is the service listening?
          ↓
      ss -tuln

5. Is the correct port reachable?
          ↓
      Test the service

6. Is a firewall blocking it?
          ↓
      Check firewall rules

7. Is SELinux blocking access?
          ↓
      getenforce
      ls -Z
```

This approach is much better than randomly changing configurations.

---

# 47. Important Networking Relationships

Remember these distinctions:

```text
IP Address
    ↓
Identifies a network endpoint/interface
```

```text
Port
    ↓
Identifies a service endpoint
```

```text
Routing
    ↓
Determines where packets should go
```

```text
DNS
    ↓
Maps names and addresses
```

```text
SSH
    ↓
Secure remote shell access
```

```text
Firewall
    ↓
Controls network traffic
```

```text
SELinux
    ↓
Controls access according to security policy
```

---

# 48. Example: Complete Remote Server Scenario

Suppose you have:

```text
Your Laptop
192.168.1.10
       |
       |
       ↓
Router
192.168.1.1
       |
       ↓
Ubuntu Server
192.168.1.20
```

The Ubuntu server runs:

```text
SSH  → 22
HTTP → 80
```

You can connect using:

```bash
ssh user@192.168.1.20
```

You can test the web server:

```bash
curl http://192.168.1.20
```

Check server addresses:

```bash
ip addr
```

Check routing:

```bash
ip route
```

Check listening services:

```bash
ss -tuln
```

Check SELinux if applicable:

```bash
getenforce
```

---

# 49. Example: Server With VM and Containers

Consider:

```text
                    Internet
                       |
                    Router
                       |
                Physical Host
                192.168.1.10
                       |
              -----------------
              |               |
             VM            Containers
        192.168.122.10    172.17.0.2
                           172.17.0.3
```

The physical host can therefore have multiple network addresses/interfaces.

This is normal because:

```text
Physical network
+
Virtual network
+
Container network
```

can coexist on the same machine.

---

# 50. Exam-Oriented Questions

## Question 1

What is the difference between an IP address and a port?

### Answer

An IP address identifies the network endpoint/machine interface, while a port identifies a particular service/application endpoint on that machine.

Example:

```text
192.168.1.20:22
```

means:

```text
IP   → 192.168.1.20
Port → 22 (SSH)
```

---

## Question 2

What is the default SSH port?

### Answer

```text
22
```

---

## Question 3

What are the common HTTP and HTTPS ports?

### Answer

```text
HTTP  → 80
HTTPS → 443
```

---

## Question 4

What command shows the routing table?

### Answer

```bash
ip route
```

---

## Question 5

What command shows network interfaces and addresses?

### Answer

```bash
ip addr
```

or:

```bash
ip a
```

---

## Question 6

What does this command do?

```bash
ssh user@192.168.1.20
```

### Answer

It attempts to establish an SSH session to the machine at `192.168.1.20` as user `user`.

---

## Question 7

What does this command do?

```bash
ssh -p 2222 user@server
```

### Answer

It connects to `server` using SSH on TCP port `2222`.

---

## Question 8

What does `ss -tuln` show?

### Answer

It displays listening TCP/UDP sockets using numeric addresses and port numbers.

---

## Question 9

What does `getenforce` tell you?

### Answer

It reports the current SELinux mode:

```text
Enforcing
Permissive
Disabled
```

---

## Question 10

What is SELinux?

### Answer

SELinux is **Security-Enhanced Linux**, a mandatory access-control system that provides an additional security policy layer beyond traditional Unix file permissions.

---

## Question 11

What is the difference between Enforcing and Permissive SELinux modes?

### Answer

```text
Enforcing  → policy is enforced; violations can be blocked
Permissive → violations are logged but generally not blocked by SELinux
```

---

## Question 12

Why can one machine have multiple IP addresses?

### Answer

A machine can have multiple physical or virtual network interfaces and can participate in multiple networks. Virtual machines and containers can add additional virtual networking.

---

## Question 13

What is reverse DNS?

### Answer

Reverse DNS maps an IP address to a hostname.

```text
IP → hostname
```

For example:

```bash
dig -x 8.8.8.8
```

---

## Question 14

What is the difference between:

```text
127.0.0.1:80
```

and:

```text
0.0.0.0:80
```

### Answer

`127.0.0.1:80` generally means the service is listening only on the local loopback interface.

`0.0.0.0:80` for IPv4 generally means the service is listening on all IPv4 interfaces.

---

# 51. Final Master Summary

```text
PRIVATE NETWORK
    ↓
Private IP addresses
    ↓
Routing
    ↓
Gateway
    ↓
Internet

IP ADDRESS
    ↓
Identifies network endpoint

PORT
    ↓
Identifies service

22  → SSH
80  → HTTP
443 → HTTPS
53  → DNS

NETWORK COMMANDS
    ↓
ip addr     → addresses
ip link     → interfaces
ip route    → routing
ping        → reachability
ss          → sockets/listening ports
curl        → web requests
hostname    → hostname
hostname -I → IP addresses
dig -x      → reverse DNS
ssh         → remote login

REMOTE ACCESS
    ↓
ssh user@host

SECURITY
    ↓
Firewall
    ↓
Linux permissions
    ↓
SELinux
    ↓
Mandatory Access Control

SELINUX
    ↓
getenforce
    ↓
Enforcing
Permissive
Disabled

VIRTUALIZATION
    ↓
Physical host
    ↓
Virtual machines
    ↓
Containers
    ↓
Multiple networks/IP addresses
```

## Commands to Memorize

```bash
ip addr
ip link
ip route

hostname
hostname -I

ping HOST

ss -tuln

curl http://HOST

ssh user@HOST
ssh -p PORT user@HOST

dig -x IP
host IP

getenforce
sestatus
ls -Z
```

The key mental model is:

```text
WHO?
  ↓
IP address

WHICH SERVICE?
  ↓
Port

HOW DOES THE PACKET GET THERE?
  ↓
Routing

IS THE SERVICE LISTENING?
  ↓
ss

CAN I REACH THE MACHINE?
  ↓
ping / actual service test

IS TRAFFIC BLOCKED?
  ↓
Firewall

IS ACCESS BLOCKED AFTER NETWORKING SUCCEEDS?
  ↓
File permissions / SELinux
```
