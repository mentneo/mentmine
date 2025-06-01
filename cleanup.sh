#!/bin/bash

# Ensure the script exits if any command fails
set -e

echo "Starting Git repository cleanup..."

# Add files to .gitignore if they aren't already ignored
echo "Updating .gitignore..."
git add .gitignore
git commit -m "Update .gitignore to exclude large files" || echo "No changes to .gitignore"

# Create a completely new branch without history
echo "Creating a fresh branch..."
git checkout --orphan temp_fresh
git add .
git commit -m "Fresh start: Initial commit"

# Store the current branch name
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Replace main branch with our clean branch
echo "Replacing main branch with clean branch..."
git checkout -B main temp_fresh
git branch -D temp_fresh

# Force push to remote (with appropriate safety checks)
echo "Pushing to remote repository..."
if [ "$CURRENT_BRANCH" = "main" ]; then
  git push -f origin main
else
  echo "Warning: You were not on main branch before running this script."
  echo "Please run: git push -f origin main"
fi

echo "Cleanup complete! Your repository should now be free of large files."
