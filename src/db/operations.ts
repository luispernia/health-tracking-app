import { db, activities, dailySummaries, users, calorieGoals, userSettings, activityTypes } from './index';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

// User operations
export const getUserById = async (userId: number) => {
  const result = await db.select().from(users).where(eq(users.id, userId));
  return result[0] || null;
};

export const getUserSettings = async (userId: number) => {
  const result = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
  return result[0] || null;
};

// Activity operations
export const logActivity = async (
  userId: number,
  activityTypeId: number,
  duration: number,
  distance?: number,
  steps?: number,
  notes?: string
) => {
  // Get the activity type to calculate calories
  const activityTypeResult = await db
    .select()
    .from(activityTypes)
    .where(eq(activityTypes.id, activityTypeId));
  
  if (!activityTypeResult.length) {
    throw new Error('Activity type not found');
  }
  
  const activityType = activityTypeResult[0];
  const caloriesBurned = activityType.caloriesPerMinute * duration;
  
  // Insert the activity
  const result = await db.insert(activities).values({
    userId,
    activityTypeId,
    duration,
    caloriesBurned,
    distance,
    steps,
    notes,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + duration * 60 * 1000).toISOString(),
  }).returning();
  
  // Update daily summary
  await updateDailySummary(userId);
  
  return result[0];
};

// Get activities for a specific day
export const getDailyActivities = async (userId: number, date: string) => {
  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;
  
  return db
    .select({
      id: activities.id,
      activityTypeId: activities.activityTypeId,
      duration: activities.duration,
      caloriesBurned: activities.caloriesBurned,
      distance: activities.distance,
      steps: activities.steps,
      startTime: activities.startTime,
      endTime: activities.endTime,
      notes: activities.notes,
      activityName: activityTypes.name,
      icon: activityTypes.icon,
    })
    .from(activities)
    .innerJoin(activityTypes, eq(activities.activityTypeId, activityTypes.id))
    .where(
      and(
        eq(activities.userId, userId),
        gte(activities.startTime, startOfDay),
        lte(activities.startTime, endOfDay)
      )
    );
};

// Update or create daily summary
export const updateDailySummary = async (userId: number) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate totals for today
  const totals = await db
    .select({
      totalCaloriesBurned: sql`COALESCE(SUM(${activities.caloriesBurned}), 0)`,
      totalSteps: sql`COALESCE(SUM(${activities.steps}), 0)`,
      totalDistance: sql`COALESCE(SUM(${activities.distance}), 0)`,
      totalActivityMinutes: sql`COALESCE(SUM(${activities.duration}), 0)`,
    })
    .from(activities)
    .where(
      and(
        eq(activities.userId, userId),
        gte(activities.startTime, `${today}T00:00:00.000Z`),
        lte(activities.startTime, `${today}T23:59:59.999Z`)
      )
    );
  
  const total = totals[0];
  
  // Get user's active calorie goal
  const userGoal = await db
    .select()
    .from(calorieGoals)
    .where(
      and(
        eq(calorieGoals.userId, userId),
        eq(calorieGoals.isActive, true)
      )
    );
  
  const goalCalories = userGoal.length > 0 ? userGoal[0].targetCalories : 0;
  const caloriesBurned = typeof total.totalCaloriesBurned === 'number' ? total.totalCaloriesBurned : 0;
  const goalAchieved = caloriesBurned >= goalCalories && goalCalories > 0;
  
  // Check if a summary exists for today
  const existingSummary = await db
    .select()
    .from(dailySummaries)
    .where(
      and(
        eq(dailySummaries.userId, userId),
        eq(dailySummaries.date, today)
      )
    );
  
  if (existingSummary.length > 0) {
    // Update existing summary
    await db
      .update(dailySummaries)
      .set({
        totalCaloriesBurned: caloriesBurned,
        totalSteps: typeof total.totalSteps === 'number' ? total.totalSteps : 0,
        totalDistance: typeof total.totalDistance === 'number' ? total.totalDistance : 0,
        totalActivityMinutes: typeof total.totalActivityMinutes === 'number' ? total.totalActivityMinutes : 0,
        goalAchieved,
      })
      .where(eq(dailySummaries.id, existingSummary[0].id));
    
    return existingSummary[0].id;
  } else {
    // Create new summary
    const result = await db
      .insert(dailySummaries)
      .values({
        userId,
        date: today,
        totalCaloriesBurned: caloriesBurned,
        totalSteps: typeof total.totalSteps === 'number' ? total.totalSteps : 0,
        totalDistance: typeof total.totalDistance === 'number' ? total.totalDistance : 0,
        totalActivityMinutes: typeof total.totalActivityMinutes === 'number' ? total.totalActivityMinutes : 0,
        goalAchieved,
      })
      .returning();
    
    return result[0].id;
  }
};

// Get daily summary
export const getDailySummary = async (userId: number, date: string = new Date().toISOString().split('T')[0]) => {
  const result = await db
    .select()
    .from(dailySummaries)
    .where(
      and(
        eq(dailySummaries.userId, userId),
        eq(dailySummaries.date, date)
      )
    );
  
  if (result.length === 0) {
    // Create an empty summary if none exists
    return {
      userId,
      date,
      totalCaloriesBurned: 0,
      totalSteps: 0,
      totalDistance: 0,
      totalActivityMinutes: 0,
      goalAchieved: false,
    };
  }
  
  return result[0];
}; 