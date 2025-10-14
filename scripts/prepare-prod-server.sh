#!/usr/bin/env bash
set -euo pipefail

# This script prepares the production server for SSH access from the development environment.
# Run this script on the production server (10.10.10.21) as the 'docker' user.

echo "Setting up SSH access..."

# Create .ssh directory if it doesn't exist and set permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "Ensured ~/.ssh directory exists with correct permissions."

# Add the public key to authorized_keys
# This key is for the development environment to connect.
KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDo5lj18FbE5Trx6iyRrfh/sGM3m/t+PR1/8JOo3Y+VDyX/GYMRrgXIK7ro5kmWKCaeoe2Otoj4I5H4lmCnuA7mkMr59jy8n4YTr7ZGFIkoTQMcQu28tRmkM9LxTXIZ3eYBgURyYNjSRxUqX6WxhM2Txm5nRy4SvIIMGuMnLv0pkQ9F4/3YQ4QEggG2O3XrWg3gh4FTBTF3E+m9D41ZH+yZzS2nw9dtjTl74fX4wLeVlT7FeiEtHiE+juUnt13FRCc0otnWuRsuGIx649MHYQTODykz4yyOLtqcek9Qk2YyRrMzxr8SKKds74mdtESnRkOfFDjqKBEUNVzqeACYmLM7Pk3bc4pEYuU3xzv43TmMIngVMQOu/cDLuUp8NZ8WDJHWNzXoKQ2GStDMYb8hz0AcFpu12MSQwdG0aHVt8Pm6WVuh0JT5CMa0ecHVu6c84e7lQyK19ZK+nlMkU3Qd3CQ7MrCEv58YEOExgK3sh2TRvn84EQqSjADy7gyekkknnmJg4JX6zVkelco0EaOgZOFiWhchIR8a/ROfrA5b93uKc7YtnXFRTAnS/y5nu742Kh0XHOn3UN0QiOKJKchicOiaoZD0qfdGkny7uQv2AMmkRF8R51g1ihAHGtn8zdg9EGt9xSpdxGKpaP1wu/1qAJ/koxqiZMhvzhYDjYpE1dGFAQ== wallyk@gmail.com"
echo "$KEY" >> ~/.ssh/authorized_keys
echo "Added public key to ~/.ssh/authorized_keys."

# Set correct permissions for the authorized_keys file
chmod 600 ~/.ssh/authorized_keys
echo "Set permissions for ~/.ssh/authorized_keys."

# Verify the key was added
echo "Verifying key was added (showing last line of authorized_keys):"
tail -1 ~/.ssh/authorized_keys

echo "Production server setup complete."