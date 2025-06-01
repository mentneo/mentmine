#!/bin/bash

echo "Starting cleanup of large files from Git repository..."

# Make sure you have git-filter-repo installed
# You can install it with: pip3 install git-filter-repo
if ! command -v git-filter-repo &> /dev/null
then
    echo "Error: git-filter-repo is required but not installed."
    echo "Install it using pip: pip3 install git-filter-repo"
    exit 1
fi

# Create backup branch
git checkout -b backup-before-cleanup

# Remove the large files using git-filter-repo
echo "Removing large files from Git history..."
git filter-repo --path 'Desktop/quizment/node_modules' --invert-paths --force

# Add improved .gitignore and .gitattributes
echo "Updating .gitignore and adding .gitattributes..."
git add .gitignore .gitattributes
git commit -m "Update .gitignore and add .gitattributes to handle large files"

echo "Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Check that everything looks good with 'git status'"
echo "2. Create a new GitHub repository if needed"
echo "3. Push to your repository with: git push origin BRANCH-NAME --force"
echo ""
echo "Note: --force is necessary because you've rewritten history"
echo "Warning: This will overwrite your remote repository history"
