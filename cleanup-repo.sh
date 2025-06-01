#!/bin/bash

# Cleanup Repository Script
# This script removes large files from your repository and creates a clean one

echo "Repository Cleanup Tool"
echo "======================"

# Configuration (edit these variables)
REPO_URL="https://github.com/mentneo/mentmine.git"
BRANCH_NAME="clean-main"
ROOT_DIR=$(pwd)
TEMP_DIR="${ROOT_DIR}/clean_repo_temp"

# Create improved .gitignore
echo "Creating improved .gitignore file..."
cat > "${ROOT_DIR}/.gitignore" << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Build artifacts
build/
dist/
.cache/
**/.cache/
*.pack
**/node_modules/.cache/
**/node_modules/.cache/default-development/
**/node_modules/.cache/babel-loader/

# Desktop folder artifacts
Desktop/
Desktop/quizment/node_modules/
Desktop/quizment/node_modules/.cache/
Desktop/quizment/node_modules/.cache/default-development/
Desktop/quizment/node_modules/.cache/default-development/*.pack

# Testing
coverage/
.nyc_output/

# Editor specific files
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Firebase
.firebase/
firebase-debug.log*
EOF
echo "✓ .gitignore file created"

# Create .gitattributes file
echo "Creating .gitattributes file for Git LFS..."
cat > "${ROOT_DIR}/.gitattributes" << 'EOF'
# Use Git LFS for large files
*.pack filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
EOF
echo "✓ .gitattributes file created"

# Create a clean repository
echo "Creating a clean repository..."

# Create temporary directory
if [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi
mkdir -p "$TEMP_DIR"

# Copy all files except node_modules, Desktop folder, and .git
echo "Copying files to temporary directory (this may take a while)..."
rsync -av --progress "${ROOT_DIR}/" "${TEMP_DIR}/" --exclude="node_modules" --exclude=".git" --exclude="Desktop" --exclude=".cache"

# Initialize new git repository
echo "Initializing new Git repository..."
cd "$TEMP_DIR" || exit 1
git init
git add .
git commit -m "Initial clean commit"

# Add remote and push to branch
echo "Adding remote and pushing to ${BRANCH_NAME}..."
git remote add origin "$REPO_URL"
git push -u origin "$BRANCH_NAME" --force

echo ""
echo "✅ Success!"
echo "Your clean repository is now in: ${TEMP_DIR}"
echo "It has been pushed to branch: ${BRANCH_NAME}"
echo ""
echo "Next steps:"
echo "1. cd ${TEMP_DIR}"
echo "2. Continue working from this clean repository"
echo "3. Your files are preserved but the Git history has been reset"

node cleanup-repo.js
chmod +x cleanup-repo.sh
./cleanup-repo.sh
