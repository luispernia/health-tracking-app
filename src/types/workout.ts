export interface Exercise {
  id: string;
  name: string;
  caloriesPerUnit: number;
  unit: string; // e.g., "reps", "minutes", "sets"
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: {
    exercise: Exercise;
    defaultQuantity: number;
  }[];
}

// Sample data for workouts and exercises
export const exercises: Exercise[] = [
  {
    id: 'ex1',
    name: 'Push-ups',
    caloriesPerUnit: 7,
    unit: 'reps'
  },
  {
    id: 'ex2',
    name: 'Sit-ups',
    caloriesPerUnit: 5,
    unit: 'reps'
  },
  {
    id: 'ex3',
    name: 'Squats',
    caloriesPerUnit: 8,
    unit: 'reps'
  },
  {
    id: 'ex4',
    name: 'Jumping Jacks',
    caloriesPerUnit: 10,
    unit: 'sets'
  },
  {
    id: 'ex5',
    name: 'Running',
    caloriesPerUnit: 12,
    unit: 'minutes'
  },
  {
    id: 'ex6',
    name: 'Cycling',
    caloriesPerUnit: 8,
    unit: 'minutes'
  },
  {
    id: 'ex7',
    name: 'Swimming',
    caloriesPerUnit: 14,
    unit: 'minutes'
  },
  {
    id: 'ex8',
    name: 'Burpees',
    caloriesPerUnit: 15,
    unit: 'reps'
  }
];

export const workoutRoutines: WorkoutRoutine[] = [
  {
    id: 'wr1',
    name: 'Quick Morning Workout',
    exercises: [
      { exercise: exercises[0], defaultQuantity: 20 },
      { exercise: exercises[1], defaultQuantity: 30 },
      { exercise: exercises[3], defaultQuantity: 5 }
    ]
  },
  {
    id: 'wr2',
    name: 'Full Body Blast',
    exercises: [
      { exercise: exercises[0], defaultQuantity: 15 },
      { exercise: exercises[2], defaultQuantity: 20 },
      { exercise: exercises[7], defaultQuantity: 10 },
      { exercise: exercises[3], defaultQuantity: 3 }
    ]
  },
  {
    id: 'wr3',
    name: 'Cardio Session',
    exercises: [
      { exercise: exercises[4], defaultQuantity: 15 },
      { exercise: exercises[5], defaultQuantity: 10 }
    ]
  },
  {
    id: 'wr4',
    name: 'Core Strength',
    exercises: [
      { exercise: exercises[0], defaultQuantity: 25 },
      { exercise: exercises[1], defaultQuantity: 40 },
      { exercise: exercises[7], defaultQuantity: 15 }
    ]
  }
]; 