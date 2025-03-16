# Fitness Tracker Database

This directory contains the database schema and operations for the Fitness Tracker app.

## Schema

The database schema is defined using Drizzle ORM and SQLite. The main tables are:

- **users**: User accounts and personal information
- **activityTypes**: Types of fitness activities (walking, running, etc.)
- **activities**: Records of user activities
- **calorieGoals**: User's calorie burning goals
- **dailySummaries**: Daily aggregated activity data
- **userSettings**: User preferences and settings

## Usage

### Database Connection

```typescript
import { db } from './index';
```

### Operations

The `operations.ts` file contains utility functions for common database operations:

#### User Operations

```typescript
// Get user by ID
const user = await getUserById(1);

// Get user settings
const settings = await getUserSettings(1);
```

#### Activity Operations

```typescript
// Log a new activity
await logActivity(
  userId: 1,
  activityTypeId: 2, // Running
  duration: 30, // minutes
  distance: 5, // kilometers
  steps: 6000
);

// Get activities for a specific day
const activities = await getDailyActivities(1, '2023-06-15');

// Get daily summary
const summary = await getDailySummary(1); // Today's summary
const pastSummary = await getDailySummary(1, '2023-06-14'); // Specific date
```

### Initialization

To initialize the database with sample data:

```typescript
import { seedDatabase } from './seed';

// In your app initialization
await seedDatabase();
```

## Schema Diagram

```
users
  ↓
  ├── activities
  ├── dailySummaries
  ├── calorieGoals
  └── userSettings

activityTypes
  ↓
  └── activities
```

## Types

All tables are strongly typed using TypeScript types generated from the schema. 