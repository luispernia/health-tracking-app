import { create } from 'zustand';

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
  initializeStore: () => void;
  setSteps: (steps: number) => void;
  setActiveMinutes: (minutes: number) => void;
  setDistance: (distance: number) => void;
  addCalories: (calories: number) => void;
  setCalorieGoal: (goal: number) => void;
  
  // New added actions
  addCaloriesIntake: (calories: number) => void;
  setCaloriesIntakeGoal: (goal: number) => void;
  addCaloriesGained: (calories: number) => void;
  addWaterIntake: (amount: number) => void;
  setWaterIntakeGoal: (goal: number) => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  // Initial state
  steps: 5248,
  activeMinutes: 47,
  distance: 3.2,
  calories: 420,
  calorieGoal: 800,
  
  // New added initial states
  caloriesIntake: 1250,
  caloriesIntakeGoal: 2000,
  caloriesGained: 830,
  waterIntake: 1.5,
  waterIntakeGoal: 2.5,
  
  isLoading: true,
  
  // Initialize store with default values
  initializeStore: () => {
    // First set loading to true
    set({ isLoading: true });
    
    // Simulate fetching data
    setTimeout(() => {
      // After data is "loaded", set loading to false
      set({ isLoading: false });
    }, 300);
  },
  
  // Update steps
  setSteps: (steps: number) => {
    set({ steps });
  },
  
  // Update active minutes
  setActiveMinutes: (minutes: number) => {
    set({ activeMinutes: minutes });
  },
  
  // Update distance
  setDistance: (distance: number) => {
    set({ distance });
  },
  
  // Add calories (cumulative)
  addCalories: (calories: number) => {
    const newTotal = get().calories + calories;
    set({ calories: newTotal });
  },
  
  // Set calorie goal
  setCalorieGoal: (goal: number) => {
    set({ calorieGoal: goal });
  },
  
  // Add intake calories (cumulative)
  addCaloriesIntake: (calories: number) => {
    const newTotal = get().caloriesIntake + calories;
    set({ caloriesIntake: newTotal });
  },
  
  // Set intake calorie goal
  setCaloriesIntakeGoal: (goal: number) => {
    set({ caloriesIntakeGoal: goal });
  },
  
  // Add calories gained (cumulative)
  addCaloriesGained: (calories: number) => {
    const newTotal = get().caloriesGained + calories;
    set({ caloriesGained: newTotal });
  },
  
  // Add water intake (cumulative)
  addWaterIntake: (amount: number) => {
    const newTotal = get().waterIntake + amount;
    set({ waterIntake: newTotal });
  },
  
  // Set water intake goal
  setWaterIntakeGoal: (goal: number) => {
    set({ waterIntakeGoal: goal });
  },
})); 