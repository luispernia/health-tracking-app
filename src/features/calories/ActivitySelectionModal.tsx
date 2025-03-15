import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@constants/Colors';
import { Exercise, WorkoutRoutine, exercises, workoutRoutines } from '../../types/workout';

type ActivitySelectionMode = 'single' | 'routine';

interface ActivitySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectActivity: (calories: number) => void;
}

export default function ActivitySelectionModal({ 
  visible, 
  onClose,
  onSelectActivity
}: ActivitySelectionModalProps) {
  const [selectionMode, setSelectionMode] = useState<ActivitySelectionMode>('single');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);
  const [quantity, setQuantity] = useState('');
  const [exerciseQuantities, setExerciseQuantities] = useState<{[key: string]: string}>({});
  
  const resetSelections = () => {
    setSelectedExercise(null);
    setSelectedRoutine(null);
    setQuantity('');
    setExerciseQuantities({});
  };
  
  const handleModeChange = (mode: ActivitySelectionMode) => {
    setSelectionMode(mode);
    resetSelections();
  };
  
  const handleExerciseSelection = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setQuantity('10'); // Default quantity
  };
  
  const handleRoutineSelection = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    // Initialize quantities with default values
    const quantities: {[key: string]: string} = {};
    routine.exercises.forEach(item => {
      quantities[item.exercise.id] = item.defaultQuantity.toString();
    });
    setExerciseQuantities(quantities);
  };
  
  const handleQuantityChange = (value: string) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };
  
  const handleExerciseQuantityChange = (exerciseId: string, value: string) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setExerciseQuantities(prev => ({
        ...prev,
        [exerciseId]: value
      }));
    }
  };
  
  const calculateTotalCalories = (): number => {
    if (selectionMode === 'single' && selectedExercise) {
      return selectedExercise.caloriesPerUnit * (parseInt(quantity) || 0);
    } else if (selectionMode === 'routine' && selectedRoutine) {
      return selectedRoutine.exercises.reduce((total, item) => {
        const qty = parseInt(exerciseQuantities[item.exercise.id]) || 0;
        return total + (item.exercise.caloriesPerUnit * qty);
      }, 0);
    }
    return 0;
  };
  
  const handleConfirm = () => {
    const calories = calculateTotalCalories();
    if (calories > 0) {
      onSelectActivity(calories);
      onClose();
      resetSelections();
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Log Activity</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.tabs}>
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    selectionMode === 'single' && styles.activeTab
                  ]}
                  onPress={() => handleModeChange('single')}
                >
                  <Text style={[
                    styles.tabText,
                    selectionMode === 'single' && styles.activeTabText
                  ]}>Single Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    selectionMode === 'routine' && styles.activeTab
                  ]}
                  onPress={() => handleModeChange('routine')}
                >
                  <Text style={[
                    styles.tabText,
                    selectionMode === 'routine' && styles.activeTabText
                  ]}>Workout Routine</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.selectionArea}>
                {selectionMode === 'single' ? (
                  <>
                    <Text style={styles.sectionTitle}>Select Exercise</Text>
                    {exercises.map(exercise => (
                      <TouchableOpacity 
                        key={exercise.id}
                        style={[
                          styles.exerciseItem,
                          selectedExercise?.id === exercise.id && styles.selectedItem
                        ]}
                        onPress={() => handleExerciseSelection(exercise)}
                      >
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseInfo}>
                          {exercise.caloriesPerUnit} cal/{exercise.unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                    
                    {selectedExercise && (
                      <View style={styles.quantityContainer}>
                        <Text style={styles.quantityLabel}>
                          How many {selectedExercise.unit}?
                        </Text>
                        <TextInput
                          style={styles.quantityInput}
                          value={quantity}
                          onChangeText={handleQuantityChange}
                          keyboardType="number-pad"
                          placeholder="Enter quantity"
                          placeholderTextColor={colors.textSecondary}
                        />
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.sectionTitle}>Select Workout Routine</Text>
                    {workoutRoutines.map(routine => (
                      <TouchableOpacity 
                        key={routine.id}
                        style={[
                          styles.routineItem,
                          selectedRoutine?.id === routine.id && styles.selectedItem
                        ]}
                        onPress={() => handleRoutineSelection(routine)}
                      >
                        <Text style={styles.routineName}>{routine.name}</Text>
                        <Text style={styles.routineInfo}>
                          {routine.exercises.length} exercises
                        </Text>
                      </TouchableOpacity>
                    ))}
                    
                    {selectedRoutine && (
                      <View style={styles.routineExercises}>
                        <Text style={styles.sectionTitle}>Exercises in this routine:</Text>
                        {selectedRoutine.exercises.map(item => (
                          <View key={item.exercise.id} style={styles.routineExerciseItem}>
                            <View style={styles.routineExerciseInfo}>
                              <Text style={styles.routineExerciseName}>
                                {item.exercise.name}
                              </Text>
                              <Text style={styles.exerciseInfo}>
                                {item.exercise.caloriesPerUnit} cal/{item.exercise.unit}
                              </Text>
                            </View>
                            <View style={styles.routineQuantityContainer}>
                              <TextInput
                                style={styles.routineQuantityInput}
                                value={exerciseQuantities[item.exercise.id]}
                                onChangeText={(value) => 
                                  handleExerciseQuantityChange(item.exercise.id, value)
                                }
                                keyboardType="number-pad"
                                placeholder="Qty"
                                placeholderTextColor={colors.textSecondary}
                              />
                              <Text style={styles.routineQuantityUnit}>
                                {item.exercise.unit}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </ScrollView>
              
              <View style={styles.footer}>
                <View style={styles.caloriesSummary}>
                  <Text style={styles.caloriesLabel}>Total Calories:</Text>
                  <Text style={styles.caloriesValue}>{calculateTotalCalories()}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.confirmButton,
                    calculateTotalCalories() === 0 && styles.disabledButton
                  ]}
                  onPress={handleConfirm}
                  disabled={calculateTotalCalories() === 0}
                >
                  <Ionicons name="checkmark" size={20} color={colors.background} />
                  <Text style={styles.confirmButtonText}>Add to Daily Count</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryYellow,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  activeTabText: {
    color: colors.text,
    fontWeight: '600',
  },
  selectionArea: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    fontWeight: '600',
  },
  exerciseItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  routineItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: colors.primaryYellow,
  },
  exerciseName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  exerciseInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  routineName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  routineInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quantityContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  quantityInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 6,
    padding: 10,
    color: colors.text,
    fontSize: 16,
  },
  routineExercises: {
    marginTop: 16,
  },
  routineExerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  routineExerciseInfo: {
    flex: 1,
  },
  routineExerciseName: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  routineQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  routineQuantityInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 6,
    padding: 8,
    width: 60,
    color: colors.text,
    textAlign: 'center',
  },
  routineQuantityUnit: {
    color: colors.textSecondary,
    marginLeft: 4,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  caloriesSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  caloriesLabel: {
    fontSize: 16,
    color: colors.text,
  },
  caloriesValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryYellow,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryYellow,
    padding: 14,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: colors.background,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
}); 