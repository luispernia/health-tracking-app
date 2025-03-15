const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to migrate
const directoriesToMigrate = [
  { from: 'app', to: 'src/app' },
  { from: 'components', to: 'src/components' },
  { from: 'hooks', to: 'src/hooks' },
  { from: 'constants', to: 'src/constants' },
  { from: 'assets', to: 'src/assets' }
];

// Create src directory if it doesn't exist
const srcDir = path.join(__dirname, '..', 'src');
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir);
  console.log('Created src directory');
}

// Create feature directories
const featureDirs = ['calories'];
const featuresDir = path.join(srcDir, 'features');
if (!fs.existsSync(featuresDir)) {
  fs.mkdirSync(featuresDir);
  console.log('Created features directory');
}

featureDirs.forEach(dir => {
  const featureDir = path.join(featuresDir, dir);
  if (!fs.existsSync(featureDir)) {
    fs.mkdirSync(featureDir);
    console.log(`Created features/${dir} directory`);
  }
});

// Create other directories
const otherDirs = ['utils', 'layouts', 'types'];
otherDirs.forEach(dir => {
  const dirPath = path.join(srcDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log(`Created ${dir} directory`);
  }
});

// Migrate directories
directoriesToMigrate.forEach(({ from, to }) => {
  const fromPath = path.join(__dirname, '..', from);
  const toPath = path.join(__dirname, '..', to);
  
  if (fs.existsSync(fromPath)) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(toPath)) {
      fs.mkdirSync(toPath, { recursive: true });
    }
    
    // Copy files
    try {
      execSync(`cp -r ${fromPath}/* ${toPath}/`);
      console.log(`Migrated ${from} to ${to}`);
    } catch (error) {
      console.error(`Error migrating ${from} to ${to}:`, error.message);
    }
  } else {
    console.log(`Directory ${from} does not exist, skipping`);
  }
});

// Move calorie-related components to features/calories
const calorieComponents = [
  'ActivitySummaryCard.tsx',
  'CalorieProgressCircle.tsx'
];

calorieComponents.forEach(file => {
  const srcPath = path.join(__dirname, '..', 'src', 'components', file);
  const destPath = path.join(__dirname, '..', 'src', 'features', 'calories', file);
  
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Moved ${file} to features/calories`);
    } catch (error) {
      console.error(`Error moving ${file}:`, error.message);
    }
  }
});

console.log('Migration complete!');
console.log('Run "npm run update-imports" to update import statements in your code.'); 