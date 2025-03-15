const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('This script will migrate your project to the new src structure.');
console.log('Make sure you have committed your changes before proceeding.');

rl.question('Are you ready to proceed? (y/n) ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    try {
      console.log('\n1. Running migration to src structure...');
      execSync('npm run migrate-to-src', { stdio: 'inherit' });
      
      console.log('\n2. Updating import statements...');
      execSync('npm run update-imports', { stdio: 'inherit' });
      
      console.log('\n3. Migration complete!');
      console.log('\nYou can now run "npm run cleanup-after-migration" to remove the original directories if everything works correctly.');
      console.log('\nMake sure to test your app thoroughly before cleaning up.');
    } catch (error) {
      console.error('Error during migration:', error.message);
    }
  } else {
    console.log('Migration cancelled.');
  }
  
  rl.close();
}); 