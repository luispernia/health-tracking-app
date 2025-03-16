import { SQLiteDatabase } from 'expo-sqlite';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../schema/activity';

/**
 * Adds nutrition and hydration tracking to the database
 * 
 * @param db SQLiteDatabase instance
 * @returns Promise that resolves when migrations are complete
 */
export async function runNutritionMigration(db: SQLiteDatabase): Promise<void> {
  console.log('Running nutrition tracking database migration...');
  const drizzleDb = drizzle(db, { schema });
  
  try {
    // 1. Add new columns to user_settings table
    await db.execAsync(`
      ALTER TABLE user_settings ADD COLUMN daily_calories_intake_goal REAL DEFAULT 2000;
      ALTER TABLE user_settings ADD COLUMN daily_water_intake_goal REAL DEFAULT 2.5;
    `);
    
    // 2. Create the daily_nutrition table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS daily_nutrition (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        calories_intake REAL DEFAULT 0,
        calories_gained REAL DEFAULT 0,
        water_intake REAL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      
      -- Index for faster queries by user and date
      CREATE INDEX IF NOT EXISTS idx_daily_nutrition_user_date 
      ON daily_nutrition (user_id, date);
    `);
    
    console.log('Nutrition tracking migration completed successfully');
  } catch (error) {
    console.error('Failed to run nutrition tracking migration:', error);
    throw error;
  }
} 