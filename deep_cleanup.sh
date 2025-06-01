#!/bin/bash

set -e

echo "Starting deep repository cleanup..."

# First, let's remove those specific large files
echo "Removing node_modules directory from repository..."
rm -rf "Desktop/quizment/node_modules"

# Update .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/
**/node_modules/
**/.cache/
*.pack

# Build files
/build/
/dist/
/.next/

# Cache and logs
.cache/
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS files
.DS_Store
Thumbs.db
EOF

echo "Creating fresh repository..."

# Save only the current files we want
mkdir -p /tmp/mentneo-backup
cp -r $(ls -A | grep -v ".git") /tmp/mentneo-backup/

# Remove the Git repository
rm -rf .git

# Initialize a new repository
git init
git config user.name "$(git config --get user.name)"
git config user.email "$(git config --get user.email)"

# Add files and create first commit
git add .
git commit -m "Initial commit: Clean repository"

# Add GitHub remote (you'll need to replace with your actual remote URL)
git remote add origin https://github.com/mentneo/mentmine.git

echo "Clean repository created! Now push with:"
echo "git push -f origin main"
echo ""
echo "Note: This creates a completely new repository history. All collaborators will need to re-clone."
