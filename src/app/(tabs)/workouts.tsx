import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Image
} from 'react-native';
import { colors } from '@constants/Colors';
import { workoutRoutines, WorkoutRoutine, Exercise } from '../../types/workout';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

// Progress indicator component
const ProgressIndicator = ({ count, total }: { count: number; total: number }) => {
  const width = (count / total) * 100;
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${width}%` }]} />
    </View>
  );
};

export default function WorkoutsScreen() {
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);

  // Toggle expanded routine
  const toggleRoutine = (id: string) => {
    setExpandedRoutineId(expandedRoutineId === id ? null : id);
  };

  // Calculate total estimated time for a routine (assuming 1 minute per 10 reps/sets)
  const calculateEstTime = (routine: WorkoutRoutine) => {
    return routine.exercises.reduce((total: number, item) => {
      if (item.exercise.unit === 'minutes') {
        return total + item.defaultQuantity;
      } else {
        return total + Math.ceil(item.defaultQuantity / 10);
      }
    }, 0);
  };

  // Get appropriate icon for exercise type
  const getExerciseIcon = (exercise: Exercise) => {
    const name = exercise.name.toLowerCase();
    
    if (name.includes('push') || name.includes('pull')) return 'barbell-outline';
    if (name.includes('sit') || name.includes('core')) return 'body-outline';
    if (name.includes('jump') || name.includes('burpee')) return 'pulse-outline';
    if (name.includes('run')) return 'walk-outline';
    if (name.includes('cycling') || name.includes('bike')) return 'bicycle-outline';
    if (name.includes('swim')) return 'water-outline';
    if (name.includes('squat')) return 'fitness-outline';
    
    return 'flash-outline';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Train</Text>
            <Text style={styles.title}>Workout Library</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="add-circle" size={34} color={colors.primaryYellow} />
          </TouchableOpacity>
        </View>
        
        {/* Featured workout section */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Workout</Text>
          <TouchableOpacity style={styles.featuredCard}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }} 
              style={styles.featuredImage}
            />
            <View style={styles.featuredOverlay}>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Full Body Blast</Text>
                <View style={styles.featuredMeta}>
                  <Ionicons name="time-outline" size={14} color="#fff" />
                  <Text style={styles.featuredMetaText}>20 min • High Intensity</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Routines section */}
        <View style={styles.routinesSection}>
          <Text style={styles.sectionTitle}>My Routines</Text>
          <View style={styles.routinesContainer}>
            {workoutRoutines.map(routine => {
              const isExpanded = expandedRoutineId === routine.id;
              const estTime = calculateEstTime(routine);
              const totalCalories = routine.exercises.reduce((total, item) => 
                total + (item.exercise.caloriesPerUnit * item.defaultQuantity), 0);
                
              return (
                <Animated.View 
                  key={routine.id} 
                  style={styles.routineCard}
                >
                  <TouchableOpacity 
                    style={styles.routineHeader}
                    onPress={() => toggleRoutine(routine.id)}
                  >
                    <View style={styles.routineHeaderLeft}>
                      <View style={[styles.routineIconBg, getWorkoutColor(routine.name)]}>
                        <Ionicons 
                          name={getWorkoutIcon(routine.name)} 
                          size={18} 
                          color="#fff" 
                        />
                      </View>
                      <View style={styles.routineHeaderText}>
                        <Text style={styles.routineName}>{routine.name}</Text>
                        <View style={styles.routineMeta}>
                          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.routineMetaText}>{estTime} min</Text>
                          <View style={styles.routineMetaDot} />
                          <Ionicons name="fitness-outline" size={14} color={colors.textSecondary} />
                          <Text style={styles.routineMetaText}>
                            {routine.exercises.length} exercises
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.routineHeaderRight}>
                      <Text style={styles.routineCalories}>{totalCalories} cal</Text>
                      <Ionicons 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={colors.textSecondary} 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.routineDetails}>
                      <View style={styles.exercisesList}>
                        {routine.exercises.map((item, index) => (
                          <View key={item.exercise.id} style={styles.exerciseItem}>
                            <View style={styles.exerciseLeft}>
                              <View style={[styles.exerciseIconBg, { backgroundColor: getExerciseColor(index) }]}>
                                <Ionicons 
                                  name={getExerciseIcon(item.exercise)} 
                                  size={16} 
                                  color="#fff" 
                                />
                              </View>
                              <Text style={styles.exerciseName}>
                                {item.exercise.name}
                              </Text>
                            </View>
                            <View style={styles.exerciseRight}>
                              <Text style={styles.exerciseQuantity}>
                                {item.defaultQuantity} {item.exercise.unit}
                              </Text>
                              <Text style={styles.exerciseCalories}>
                                {item.exercise.caloriesPerUnit * item.defaultQuantity} cal
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                      
                      <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startButtonText}>Start Workout</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        </View>
        
        {/* Weekly progress section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Weekly Goal</Text>
            <Text style={styles.progressCount}>3 of 5 workouts</Text>
          </View>
          <ProgressIndicator count={3} total={5} />
          <Text style={styles.progressSubtext}>
            You're on track! 2 more workouts to reach your weekly goal.
          </Text>
        </View>
        
        {/* Add extra padding at the bottom to ensure content isn't covered by the tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get workout icon based on workout name
function getWorkoutIcon(name: string): keyof typeof Ionicons.glyphMap {
  name = name.toLowerCase();
  if (name.includes('morning')) return 'sunny-outline';
  if (name.includes('full body')) return 'body-outline'; 
  if (name.includes('cardio')) return 'heart-outline';
  if (name.includes('core')) return 'fitness-outline';
  return 'barbell-outline';
}

// Helper function to get workout background color
function getWorkoutColor(name: string) {
  name = name.toLowerCase();
  if (name.includes('morning')) return { backgroundColor: '#5E5CE6' };
  if (name.includes('full body')) return { backgroundColor: '#FF2D55' };
  if (name.includes('cardio')) return { backgroundColor: '#FF9500' };
  if (name.includes('core')) return { backgroundColor: '#30D158' };
  return { backgroundColor: '#007AFF' };
}

// Helper function to get exercise color
function getExerciseColor(index: number): string {
  const colors = ['#5E5CE6', '#FF2D55', '#FF9500', '#30D158', '#007AFF'];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  featuredCard: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.backgroundSecondary,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredMetaText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
  },
  featuredButton: {
    backgroundColor: colors.primaryYellow,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  featuredButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.background,
  },
  routinesSection: {
    marginBottom: 24,
  },
  routinesContainer: {
    marginBottom: 8,
  },
  routineCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  routineHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routineHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routineIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routineHeaderText: {
    flex: 1,
  },
  routineName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  routineMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineMetaText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  routineMetaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginRight: 8,
  },
  routineHeaderRight: {
    alignItems: 'flex-end',
  },
  routineCalories: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryYellow,
    marginBottom: 4,
  },
  routineDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  exercisesList: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  exerciseIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 16,
    color: colors.text,
  },
  exerciseRight: {
    alignItems: 'flex-end',
  },
  exerciseQuantity: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  exerciseCalories: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  startButton: {
    backgroundColor: colors.primaryYellow,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  progressSection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressCount: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryYellow,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primaryYellow,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
}); 