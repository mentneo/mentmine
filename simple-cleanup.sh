#!/bin/bash

echo "Starting simple cleanup of repository..."

# Create a temporary directory
mkdir -p temp_repo

# Copy all project files except node_modules and large files
echo "Copying files to temporary directory..."
rsync -av --progress . temp_repo/ --exclude node_modules --exclude .git --exclude Desktop --exclude "*.pack"

# Initialize a new Git repository in the temp directory
echo "Creating new Git repository..."
cd temp_repo
git init
git add .
git commit -m "Initial import of cleaned repository"

# Add new remote (replace with your GitHub repo)
echo "Enter your GitHub repository URL (like https://github.com/username/repo.git):"
read repo_url
git remote add origin $repo_url

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main --force

echo "Done! Your cleaned repository is now in the temp_repo directory"
echo "You can continue working from that directory."
