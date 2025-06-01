#!/bin/bash

# Check if we have a Git repository
if [ ! -d .git ]; then
  echo "Initializing new Git repository..."
  git init
fi

# Create default branch (main)
echo "Setting up main branch..."
git checkout -b main 2>/dev/null || git checkout main

# Add all files
echo "Adding files to repository..."
git add .

# Commit changes
echo "Creating initial commit..."
git commit -m "Initial commit: Clean repository"

# Set the remote (if not already set)
if ! git remote | grep -q "origin"; then
  echo "Adding remote origin..."
  git remote add origin https://github.com/mentneo/mentmine.git
fi

# Force push to GitHub
echo "Pushing to GitHub..."
git push -f origin main

echo "Done! Repository should be pushed to GitHub now."
