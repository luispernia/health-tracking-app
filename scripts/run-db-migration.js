const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Running database migration script...');

// Check if the migration directory exists
const migrationDir = path.join(__dirname, '../src/db/migrations');
if (!fs.existsSync(migrationDir)) {
  console.error('Migration directory does not exist at:', migrationDir);
  process.exit(1);
}

// Execute the TypeScript file that contains the migration
try {
  console.log('Running migration...');
  
  // Create a temporary JS file to import and run our migration
  const tempMigrationFile = path.join(__dirname, 'temp-migration.js');
  
  fs.writeFileSync(tempMigrationFile, `
    // This is a temporary file to run the migration
    const SQLite = require('expo-sqlite');
    const path = require('path');
    
    async function runMigration() {
      try {
        console.log('Opening database...');
        const db = SQLite.openDatabaseSync('fitness_tracker.db');
        
        // Import the migration module
        const { runMigrations } = require('../src/db/migrations/001_initial_schema');
        
        // Run the migration
        console.log('Running database migrations...');
        await runMigrations(db);
        
        console.log('Migration completed successfully!');
        process.exit(0);
      } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
      }
    }
    
    runMigration();
  `);
  
  // Run the temporary file with Node.js
  console.log('Executing migration script...');
  execSync('node ' + tempMigrationFile, { stdio: 'inherit' });
  
  // Remove the temporary file
  fs.unlinkSync(tempMigrationFile);
  
  console.log('Database migration completed successfully!');
} catch (error) {
  console.error('Error running migration:', error.message);
  process.exit(1);
} 