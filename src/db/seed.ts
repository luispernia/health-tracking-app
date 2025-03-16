import { db, activityTypes, users, userSettings, calorieGoals } from './index';

export async function seedDatabase() {
  console.log('Seeding database...');
  
  try {
    // Insert default activity types
    await db.insert(activityTypes).values([
      { name: 'Walking', caloriesPerMinute: 4, icon: 'footsteps' },
      { name: 'Running', caloriesPerMinute: 10, icon: 'trending-up' },
      { name: 'Cycling', caloriesPerMinute: 8, icon: 'bicycle' },
      { name: 'Swimming', caloriesPerMinute: 9, icon: 'water' },
      { name: 'Yoga', caloriesPerMinute: 3, icon: 'body' },
      { name: 'Weight Training', caloriesPerMinute: 5, icon: 'barbell' },
    ]).onConflictDoNothing();
    
    // Insert a demo user if none exists
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length === 0) {
      // Insert a demo user
      const demoUser = await db.insert(users).values({
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'password123', // In a real app, this would be hashed
        height: 175,
        weight: 70,
      }).returning();
      
      if (demoUser.length > 0) {
        const userId = demoUser[0].id;
        
        // Insert user settings
        await db.insert(userSettings).values({
          userId,
          dailyCalorieGoal: 800,
          dailyStepsGoal: 10000,
        });
        
        // Insert a calorie goal
        await db.insert(calorieGoals).values({
          userId,
          targetCalories: 800,
          isActive: true,
        });
      }
    }
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
} 