#!/bin/bash

# Make this script executable with: chmod +x clean-repository.sh

echo "Cleaning up large files from git repository..."

# Create a backup branch
git checkout -b backup-original-with-large-files

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "Creating .gitignore file..."
  cat > .gitignore << 'EOF'
# Dependencies
node_modules/
**/node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build files
build/
dist/
.cache/
**/.cache/
*.pack
**/node_modules/.cache/
**/node_modules/.cache/default-development/

# Large files specifically causing issues
Desktop/quizment/
Desktop/quizment/node_modules/
Desktop/quizment/node_modules/.cache/
Desktop/quizment/node_modules/.cache/default-development/

# Environment variables
.env*
.env.local
.env.development.local
.env.test.local
.env.production.local

# Editor files
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Firebase
.firebase/
firebase-debug.log
EOF
fi

# Create .gitattributes for LFS
if [ ! -f .gitattributes ]; then
  echo "Creating .gitattributes file..."
  cat > .gitattributes << 'EOF'
# Binary files to track with Git LFS
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
*.pack filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
EOF
fi

echo "Creating a clean branch without large files..."

# Create a new branch for the clean repository
git checkout --orphan clean-branch

# Add all files except those in .gitignore
git add .

# Commit the changes
git commit -m "Initial commit with clean repository (no large files)"

echo "Clean branch created successfully!"

echo ""
echo "Follow these steps to complete the process:"
echo ""
echo "1. Verify your changes look good:"
echo "   git status"
echo ""
echo "2. Push the new clean branch to GitHub:"
echo "   git push -u origin clean-branch"
echo ""
echo "3. On GitHub, make 'clean-branch' your default branch"
echo "   Go to Settings > Branches > Default branch > switch to 'clean-branch'"
echo ""
echo "4. Then you can delete the original main branch if needed"
echo ""
echo "Optional: Install Git LFS to handle large files in the future:"
echo "   git lfs install"
echo "   git lfs track \"*.pack\""
echo "   git add .gitattributes"
echo "   git commit -m \"Configure Git LFS\""
echo ""
echo "Your repository should now be free of the large files causing issues."
