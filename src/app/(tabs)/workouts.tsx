import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@constants/Colors';
import { workoutRoutines } from '../../types/workout';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Routines</Text>
          <Text style={styles.subtitle}>Pre-defined workout routines to keep you fit</Text>
        </View>
        
        <View style={styles.routinesContainer}>
          {workoutRoutines.map(routine => (
            <View key={routine.id} style={styles.routineCard}>
              <View style={styles.routineHeader}>
                <Text style={styles.routineName}>{routine.name}</Text>
                <View style={styles.routineExerciseCount}>
                  <Ionicons name="fitness-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.routineExerciseCountText}>
                    {routine.exercises.length} exercises
                  </Text>
                </View>
              </View>
              
              <View style={styles.exercisesList}>
                {routine.exercises.map((item, index) => (
                  <View key={item.exercise.id} style={styles.exerciseItem}>
                    <Text style={styles.exerciseName}>
                      {item.exercise.name}
                    </Text>
                    <Text style={styles.exerciseQuantity}>
                      {item.defaultQuantity} {item.exercise.unit}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.routineStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Est. Calories</Text>
                  <Text style={styles.statValue}>
                    {routine.exercises.reduce((total, item) => 
                      total + (item.exercise.caloriesPerUnit * item.defaultQuantity), 0)}
                  </Text>
                </View>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  routinesContainer: {
    marginBottom: 20,
  },
  routineCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routineHeader: {
    marginBottom: 16,
  },
  routineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  routineExerciseCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routineExerciseCountText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  exercisesList: {
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseName: {
    fontSize: 16,
    color: colors.text,
  },
  exerciseQuantity: {
    fontSize: 16,
    color: colors.primaryYellow,
    fontWeight: '500',
  },
  routineStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryYellow,
  },
  startButton: {
    backgroundColor: colors.primaryYellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  startButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
}); 