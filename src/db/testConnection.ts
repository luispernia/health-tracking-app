import { db, users, activityTypes } from './index';
import { seedDatabase } from './seed';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // First, seed the database to ensure we have some data
    await seedDatabase();
    
    // Test query 1: Count users
    const userCount = await db.select({
      count: users.id,
    }).from(users);
    console.log('Number of users:', userCount[0]?.count || 0);
    
    // Test query 2: Get all activity types
    const allActivityTypes = await db.select().from(activityTypes);
    console.log('Activity types found:', allActivityTypes.length);
    allActivityTypes.forEach(type => {
      console.log(`- ${type.name} (${type.caloriesPerMinute} cal/min)`);
    });
    
    console.log('Database connection test successful!');
    return true;
  } catch (error) {
    console.error('Database connection test failed!', error);
    return false;
  }
}

// Run the test
testConnection();

export default testConnection; 