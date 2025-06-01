/**
 * Repository Cleanup Script
 * 
 * This script helps clean up large files from your Git repository
 * and creates a fresh repository without the problematic files.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration - update these values if needed
const REPO_URL = 'https://github.com/mentneo/mentmine.git'; 
const BRANCH_NAME = 'clean-main';
const ROOT_DIR = process.cwd(); // Current working directory
const TEMP_DIR = path.join(ROOT_DIR, 'clean_repo_temp');

// Create .gitignore file with proper ignores
const createGitignore = () => {
  console.log('Creating improved .gitignore file...');
  
  const gitignoreContent = `
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
`;

  fs.writeFileSync(path.join(ROOT_DIR, '.gitignore'), gitignoreContent);
  console.log('✓ .gitignore file created');
};

// Create .gitattributes file for LFS
const createGitAttributes = () => {
  console.log('Creating .gitattributes file for Git LFS...');
  
  const gitattributesContent = `
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
`;

  fs.writeFileSync(path.join(ROOT_DIR, '.gitattributes'), gitattributesContent);
  console.log('✓ .gitattributes file created');
};

// Create a clean repository
const createCleanRepo = () => {
  try {
    console.log('Creating a clean repository...');
    
    // Create temporary directory
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(TEMP_DIR, { recursive: true });
    
    // Copy all files except node_modules, Desktop folder, and .git
    console.log('Copying files to temporary directory (this may take a while)...');
    execSync(`rsync -av --progress ${ROOT_DIR}/ ${TEMP_DIR}/ --exclude="node_modules" --exclude=".git" --exclude="Desktop" --exclude=".cache"`, { stdio: 'inherit' });
    
    // Initialize new git repository
    console.log('Initializing new Git repository...');
    process.chdir(TEMP_DIR);
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial clean commit"', { stdio: 'inherit' });
    
    // Add remote and push to branch
    console.log(`Adding remote and pushing to ${BRANCH_NAME}...`);
    execSync(`git remote add origin ${REPO_URL}`, { stdio: 'inherit' });
    execSync(`git push -u origin ${BRANCH_NAME} --force`, { stdio: 'inherit' });
    
    console.log(`
✅ Success! 
Your clean repository is now in: ${TEMP_DIR}
It has been pushed to branch: ${BRANCH_NAME}

Next steps:
1. cd ${TEMP_DIR}
2. Continue working from this clean repository
3. Your files are preserved but the Git history has been reset
`);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Please fix the error and try again.');
  }
};

// Main execution
console.log('Repository Cleanup Tool');
console.log('======================');
createGitignore();
createGitAttributes();
createCleanRepo();
