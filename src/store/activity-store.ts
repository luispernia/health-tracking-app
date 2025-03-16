import { create } from 'zustand';
import { 
  getDailySummary, 
  getUserSettings, 
  getDailyNutrition, 
  getNutritionGoals, 
  updateCaloriesIntake, 
  updateWaterIntake,
  updateCaloriesIntakeGoal,
  updateWaterIntakeGoal,
  logActivity 
} from '../db/operations';

interface ActivityState {
  // Daily activity tracking
  steps: number;
  activeMinutes: number;
  distance: number;
  calories: number;
  calorieGoal: number;
  
  // New added metrics
  caloriesIntake: number;
  caloriesIntakeGoal: number;
  caloriesGained: number;
  waterIntake: number;
  waterIntakeGoal: number;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  initializeStore: () => Promise<void>;
  setSteps: (steps: number) => void;
  setActiveMinutes: (minutes: number) => void;
  setDistance: (distance: number) => void;
  addCalories: (calories: number) => void;
  setCalorieGoal: (goal: number) => void;
  
  // New added actions
  addCaloriesIntake: (calories: number) => Promise<void>;
  setCaloriesIntakeGoal: (goal: number) => Promise<void>;
  addCaloriesGained: (calories: number) => void;
  addWaterIntake: (amount: number) => Promise<void>;
  setWaterIntakeGoal: (goal: number) => Promise<void>;
  
  // Steps tracking
  updateDailySteps: (steps: number) => Promise<void>;
}

// Default user ID - in a real app, this would come from authentication
const DEFAULT_USER_ID = 1;

export const useActivityStore = create<ActivityState>((set, get) => ({
  // Initial state
  steps: 0,
  activeMinutes: 0,
  distance: 0,
  calories: 0,
  calorieGoal: 800,
  
  // New added initial states
  caloriesIntake: 0,
  caloriesIntakeGoal: 2000,
  caloriesGained: 0,
  waterIntake: 0,
  waterIntakeGoal: 2.5,
  
  isLoading: true,
  
  // Initialize store with data from database
  initializeStore: async () => {
    // First set loading to true
    set({ isLoading: true });
    
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch data from database
      const summary = await getDailySummary(DEFAULT_USER_ID, today);
      const settings = await getUserSettings(DEFAULT_USER_ID);
      const nutrition = await getDailyNutrition(DEFAULT_USER_ID, today);
      const nutritionGoals = await getNutritionGoals(DEFAULT_USER_ID);
      
      // Update store with fetched data
      set({
        steps: summary.totalSteps || 0,
        activeMinutes: summary.totalActivityMinutes || 0,
        distance: summary.totalDistance || 0,
        calories: summary.totalCaloriesBurned || 0,
        calorieGoal: settings?.dailyCalorieGoal || 800,
        
        // Nutrition data from database
        caloriesIntake: nutrition.caloriesIntake || 0,
        caloriesIntakeGoal: nutritionGoals.caloriesIntakeGoal,
        caloriesGained: nutrition.caloriesGained || 0,
        waterIntake: nutrition.waterIntake || 0,
        waterIntakeGoal: nutritionGoals.waterIntakeGoal,
        
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load activity data:', error);
      set({ isLoading: false });
    }
  },
  
  // Update steps
  setSteps: (steps) => {
    set({ steps });
  },
  
  // Update active minutes
  setActiveMinutes: (minutes) => {
    set({ activeMinutes: minutes });
  },
  
  // Update distance
  setDistance: (distance) => {
    set({ distance });
  },
  
  // Add calories
  addCalories: (calories) => {
    set((state) => ({ calories: state.calories + calories }));
  },
  
  // Set calorie goal
  setCalorieGoal: (goal) => {
    set({ calorieGoal: goal });
  },
  
  // Add calories intake and update database
  addCaloriesIntake: async (calories) => {
    const { caloriesIntake } = get();
    const newCaloriesIntake = caloriesIntake + calories;
    set({ caloriesIntake: newCaloriesIntake });
    
    // Update in database
    try {
      await updateCaloriesIntake(DEFAULT_USER_ID, newCaloriesIntake);
    } catch (error) {
      console.error('Failed to update calories intake:', error);
    }
  },
  
  // Set calories intake goal and update database
  setCaloriesIntakeGoal: async (goal) => {
    set({ caloriesIntakeGoal: goal });
    
    // Update in database
    try {
      await updateCaloriesIntakeGoal(DEFAULT_USER_ID, goal);
    } catch (error) {
      console.error('Failed to update calories intake goal:', error);
    }
  },
  
  // Add calories gained
  addCaloriesGained: (calories) => {
    set((state) => ({ caloriesGained: state.caloriesGained + calories }));
  },
  
  // Add water intake and update database
  addWaterIntake: async (amount) => {
    const { waterIntake } = get();
    const newWaterIntake = waterIntake + amount;
    set({ waterIntake: newWaterIntake });
    
    // Update in database
    try {
      await updateWaterIntake(DEFAULT_USER_ID, newWaterIntake);
    } catch (error) {
      console.error('Failed to update water intake:', error);
    }
  },
  
  // Set water intake goal and update database
  setWaterIntakeGoal: async (goal) => {
    set({ waterIntakeGoal: goal });
    
    // Update in database
    try {
      await updateWaterIntakeGoal(DEFAULT_USER_ID, goal);
    } catch (error) {
      console.error('Failed to update water intake goal:', error);
    }
  },
  
  // Update daily steps in the database
  updateDailySteps: async (steps) => {
    try {
      // Log a 'walking' activity type (assuming ID 1 is walking)
      // This will automatically update the daily summary
      const walkingActivityTypeId = 1;
      // Convert steps to approximate duration (assuming average pace)
      const estimatedDuration = Math.round(steps / 100); // Very rough estimate
      // Estimate distance in km (average stride length)
      const estimatedDistance = steps * 0.0007; // ~0.7m per step
      
      await logActivity(
        DEFAULT_USER_ID,
        walkingActivityTypeId,
        estimatedDuration,
        estimatedDistance,
        steps,
        'Tracked via Pedometer'
      );
      
      // Update the local state
      set({ steps });
    } catch (error) {
      console.error('Failed to update steps in database:', error);
    }
  },
})); 