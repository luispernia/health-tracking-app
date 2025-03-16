import { create } from 'zustand';

interface WorkoutEntry {
  id: number;
  date: string;
  workout_name: string;
  calories: number;
  duration: number;
}

interface WorkoutState {
  // Workout history
  workoutHistory: WorkoutEntry[];
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  loadWorkoutHistory: () => void;
  addWorkout: (workout: Omit<WorkoutEntry, 'id' | 'date'>) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  // Initial state
  workoutHistory: [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      workout_name: 'Morning Run',
      calories: 320,
      duration: 30
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      workout_name: 'Weight Training',
      calories: 250,
      duration: 45
    }
  ],
  isLoading: false,
  
  // Load workout history (simulate loading)
  loadWorkoutHistory: () => {
    set({ isLoading: false });
  },
  
  // Add a new workout to history
  addWorkout: (workout) => {
    const nextId = Math.max(0, ...get().workoutHistory.map(w => w.id)) + 1;
    
    const newWorkout: WorkoutEntry = {
      id: nextId,
      date: new Date().toISOString().split('T')[0],
      workout_name: workout.workout_name,
      calories: workout.calories,
      duration: workout.duration
    };
    
    set(state => ({
      workoutHistory: [newWorkout, ...state.workoutHistory]
    }));
  }
})); 