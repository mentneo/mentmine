#!/bin/bash

echo "Creating a clean copy of your repository..."

# Create a new directory for the clean repository
CLEAN_DIR="../mentneo-clean"
mkdir -p "$CLEAN_DIR"

# Copy all files except problematic ones
echo "Copying files (this may take a moment)..."
rsync -av --progress ./ "$CLEAN_DIR/" --exclude node_modules --exclude .git --exclude "Desktop" --exclude "*.pack"

# Create appropriate .gitignore and .gitattributes
echo "Setting up Git configuration files..."

cat > "$CLEAN_DIR/.gitignore" << 'EOF'
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

# Desktop folder
Desktop/
**/Desktop/

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

cat > "$CLEAN_DIR/.gitattributes" << 'EOF'
# Binary files to track with Git LFS
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.pdf filter=lfs diff=lfs merge=lfs -text
*.pack filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
EOF

# Initialize new Git repository
echo "Initializing new Git repository..."
cd "$CLEAN_DIR"
git init

# Initial commit
git add .
git commit -m "Initial commit with clean repository"

echo ""
echo "======================= SUCCESS ======================="
echo "Your clean repository is ready at: $CLEAN_DIR"
echo ""
echo "Next steps:"
echo "1. cd $CLEAN_DIR"
echo "2. Add your GitHub repository as remote:"
echo "   git remote add origin https://github.com/mentneo/mentmine.git"
echo "3. Push to a new branch:"
echo "   git push -u origin main --force"
echo ""
echo "Note: This approach completely abandons your Git history"
echo "but it's the most reliable way to fix the issue."
echo "========================================================="
