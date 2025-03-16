import { SQLiteDatabase } from 'expo-sqlite';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../schema/activity';

/**
 * Runs initial database migrations to ensure tables exist
 * before any queries are made
 * 
 * @param db SQLiteDatabase instance
 * @returns Promise that resolves when migrations are complete
 */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  console.log('Running database migrations...');
  const drizzleDb = drizzle(db, { schema });
  
  try {
    // Create tables if they don't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        height REAL,
        weight REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS activity_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        calories_per_minute REAL NOT NULL,
        icon TEXT
      );
      
      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_type_id INTEGER NOT NULL,
        start_time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_time TEXT,
        duration INTEGER,
        calories_burned REAL,
        distance REAL,
        steps INTEGER,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (activity_type_id) REFERENCES activity_types (id)
      );
      
      CREATE TABLE IF NOT EXISTS calorie_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        target_calories REAL NOT NULL,
        start_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_date TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS daily_summaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        total_calories_burned REAL NOT NULL DEFAULT 0,
        total_steps INTEGER DEFAULT 0,
        total_distance REAL DEFAULT 0,
        total_activity_minutes INTEGER DEFAULT 0,
        goal_achieved INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        daily_calorie_goal REAL DEFAULT 800,
        daily_steps_goal INTEGER DEFAULT 10000,
        notifications_enabled INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'light',
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `);
    
    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Error running database migrations:', error);
    throw error;
  }
} 