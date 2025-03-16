import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  height: real('height'),  // in cm
  weight: real('weight'),  // in kg
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Activity types table
export const activityTypes = sqliteTable('activity_types', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  caloriesPerMinute: real('calories_per_minute').notNull(), // estimated calories burned per minute
  icon: text('icon'), // icon name for the UI
});

// Activities table - records of user activities
export const activities = sqliteTable('activities', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  activityTypeId: integer('activity_type_id', { mode: 'number' })
    .notNull()
    .references(() => activityTypes.id),
  startTime: text('start_time').notNull().default(sql`CURRENT_TIMESTAMP`),
  endTime: text('end_time'),
  duration: integer('duration'), // in minutes
  caloriesBurned: real('calories_burned'), // calculated based on activity type and duration
  distance: real('distance'), // in km (if applicable)
  steps: integer('steps'), // if applicable
  notes: text('notes'),
});

// Calorie goals table
export const calorieGoals = sqliteTable('calorie_goals', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  targetCalories: real('target_calories').notNull(),
  startDate: text('start_date').notNull().default(sql`CURRENT_TIMESTAMP`),
  endDate: text('end_date'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

// Daily summary table - aggregated data for each day
export const dailySummaries = sqliteTable('daily_summaries', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  totalCaloriesBurned: real('total_calories_burned').notNull().default(0),
  totalSteps: integer('total_steps').default(0),
  totalDistance: real('total_distance').default(0), // in km
  totalActivityMinutes: integer('total_activity_minutes').default(0),
  goalAchieved: integer('goal_achieved', { mode: 'boolean' }).default(false),
});

// User settings table
export const userSettings = sqliteTable('user_settings', {
  userId: integer('user_id', { mode: 'number' })
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  dailyCalorieGoal: real('daily_calorie_goal').default(800),
  dailyStepsGoal: integer('daily_steps_goal').default(10000),
  notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' }).default(true),
  theme: text('theme').default('light'),
});

