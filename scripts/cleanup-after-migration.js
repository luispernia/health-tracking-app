const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Directories to remove after migration
const directoriesToRemove = [
  'app',
  'components',
  'hooks',
  'constants'
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('This will remove the original directories after migration. Are you sure? (y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    directoriesToRemove.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      
      if (fs.existsSync(dirPath)) {
        try {
          // Check if directory is empty
          const files = fs.readdirSync(dirPath);
          if (files.length === 0) {
            fs.rmdirSync(dirPath);
            console.log(`Removed empty directory: ${dir}`);
          } else {
            console.log(`Directory ${dir} is not empty. Please remove manually if needed.`);
          }
        } catch (error) {
          console.error(`Error removing ${dir}:`, error.message);
        }
      } else {
        console.log(`Directory ${dir} does not exist, skipping`);
      }
    });
    
    console.log('Cleanup complete!');
  } else {
    console.log('Cleanup cancelled.');
  }
  
  rl.close();
}); 