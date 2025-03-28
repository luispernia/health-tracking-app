import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema/activity';
import { runMigrations } from './migrations/001_initial_schema';
import { runNutritionMigration } from './migrations/002_nutrition_schema';

// Database file name
export const DB_NAME = 'fitness_tracker.db';

// Initialize the SQLite database
const sqlite = SQLite.openDatabaseSync(DB_NAME);

// Run migrations to ensure tables exist
(async () => {
  try {
    // Run initial schema migration
    await runMigrations(sqlite);
    
    // Run nutrition tracking migration
    // await runNutritionMigration(sqlite);
  } catch (error) {
    console.error('Failed to run migrations:', error);
  }
})();

// Initialize Drizzle orm with our schema
export const db = drizzle(sqlite, { schema });

export * from './schema/activity';