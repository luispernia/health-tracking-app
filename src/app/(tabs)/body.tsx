import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  StatusBar
} from 'react-native';
import { colors } from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing
} from 'react-native-reanimated';

// Main Body Screen Component
export default function BodyScreen() {
  const router = useRouter();
  
  // State for weight tracking
  const [weight, setWeight] = useState('75.5');
  const [goalWeight, setGoalWeight] = useState('70.0');
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [tempWeight, setTempWeight] = useState('');
  
  // Mock data for the metrics
  const calorieDeficit = 450; // calories per day
  const weeklyRate = 0.5; // kg per week
  const daysToGoal = 77; // days until goal weight
  const hydrationPercent = 78; // percent of daily goal
  const waterIntake = 1.8; // liters
  const waterGoal = 2.3; // liters
  
  // Calculate progress percentages
  const weightDifference = parseFloat(weight) - parseFloat(goalWeight);
  const totalToLose = 80.5 - parseFloat(goalWeight); // initial - goal weight
  const progressPercent = ((totalToLose - weightDifference) / totalToLose) * 100;
  
  // Toggle weight input visibility
  const toggleWeightInput = () => {
    if (showWeightInput) {
      // Update weight if a valid value was entered
      if (tempWeight && !isNaN(parseFloat(tempWeight))) {
        setWeight(tempWeight);
      }
    } else {
      // Set temporary weight to current weight when showing the input
      setTempWeight(weight);
    }
    setShowWeightInput(!showWeightInput);
  };
  
  // Format date to display
  const getFormattedDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };
  
  // Calculate projected date
  const getProjectedDate = () => {
    const today = new Date();
    const projectedDate = new Date(today.getTime() + (daysToGoal * 24 * 60 * 60 * 1000));
    return projectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
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
            <Text style={styles.greeting}>Track</Text>
            <Text style={styles.title}>Body Metrics</Text>
          </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="options-outline" size={24} color={colors.primaryYellow} />
            </TouchableOpacity>
          </View>
        
        {/* Current Weight Section */}
        <View style={styles.weightSection}>
          <View style={styles.weightHeader}>
            <Text style={styles.sectionTitle}>Current Weight</Text>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
          
          <View style={styles.weightCard}>
            <View style={styles.weightCardContent}>
              <View style={styles.weightValueContainer}>
                {showWeightInput ? (
                  <TextInput
                    style={styles.weightInput}
                    value={tempWeight}
                    onChangeText={setTempWeight}
                    keyboardType="numeric"
                    autoFocus
                    selectTextOnFocus
                  />
                ) : (
                  <Text style={styles.weightValue}>{weight}</Text>
                )}
                <Text style={styles.weightUnit}>kg</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={toggleWeightInput}
              >
                <Text style={styles.updateButtonText}>
                  {showWeightInput ? 'Save' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.weightBottomRow}>
              <View style={styles.weightChange}>
                <Ionicons 
                  name="trending-down" 
                  size={16} 
                  color={colors.green} 
                />
                <Text style={[styles.weightChangeText, { color: colors.green }]}>
                  -0.4 kg this week
                </Text>
              </View>
              <View style={styles.weightGoal}>
                <Text style={styles.weightGoalText}>
                  Goal: {goalWeight} kg
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          
          <View style={styles.progressCard}>
            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarLabels}>
                <Text style={styles.progressBarStart}>Start: 80.5kg</Text>
                <Text style={styles.progressBarCurrent}>Current</Text>
                <Text style={styles.progressBarGoal}>Goal: {goalWeight}kg</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                <View style={[
                  styles.progressBarIndicator, 
                  { left: `${progressPercent}%` }
                ]} />
              </View>
            </View>
            
            <Text style={styles.weightRemaining}>
              {weightDifference.toFixed(1)} kg to go
            </Text>
          </View>
        </View>
        
        {/* Metrics Grid Section */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Daily Metrics</Text>
          
          <View style={styles.metricsGrid}>
            {/* Caloric Deficit Card */}
            <View style={styles.metricCard}>
              <View style={styles.metricIconContainer}>
                <Ionicons name="flame-outline" size={22} color="#FF9500" />
              </View>
              <Text style={styles.metricTitle}>Caloric Deficit</Text>
              <Text style={styles.metricValue}>{calorieDeficit}</Text>
              <Text style={styles.metricUnit}>cal/day</Text>
            </View>
            
            {/* Weekly Rate Card */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                <Ionicons name="trending-down-outline" size={22} color="#34C759" />
              </View>
              <Text style={styles.metricTitle}>Weekly Rate</Text>
              <Text style={styles.metricValue}>{weeklyRate}</Text>
              <Text style={styles.metricUnit}>kg/week</Text>
            </View>
            
            {/* Projected Date Card */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(90, 200, 250, 0.1)' }]}>
                <Ionicons name="calendar-outline" size={22} color="#5AC8FA" />
              </View>
              <Text style={styles.metricTitle}>Goal Reached By</Text>
              <Text style={styles.metricValue}>{getProjectedDate()}</Text>
              <Text style={styles.metricUnit}>{daysToGoal} days</Text>
            </View>
            
            {/* Hydration Card */}
            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
                <Ionicons name="water-outline" size={22} color="#007AFF" />
              </View>
              <Text style={styles.metricTitle}>Hydration</Text>
              <View style={styles.hydrationContainer}>
                <View style={styles.hydrationProgressContainer}>
                  <View style={[styles.hydrationProgress, { width: `${hydrationPercent}%` }]} />
                </View>
                <Text style={styles.hydrationText}>
                  {waterIntake} / {waterGoal}L
                </Text>
              </View>
              <Text style={styles.metricUnit}>{hydrationPercent}% of goal</Text>
            </View>
          </View>
        </View>
        
        {/* Insights Section */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          
          <View style={styles.insightCard}>
            <Ionicons name="analytics-outline" size={24} color={colors.primaryYellow} style={styles.insightIcon} />
            <Text style={styles.insightText}>
              At your current rate, you'll reach your goal weight by {getProjectedDate()}. Keep going!
            </Text>
          </View>
          
          <View style={styles.insightCard}>
            <Ionicons name="water-outline" size={24} color="#007AFF" style={styles.insightIcon} />
            <Text style={styles.insightText}>
              Your hydration is below target today. Try to drink {(waterGoal - waterIntake).toFixed(1)}L more water.
            </Text>
          </View>
        </View>
        
        {/* Add extra padding at the bottom to ensure content isn't covered by the tab bar */}
        <View style={{ height: 100 }} />
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dbTestButton: {
    backgroundColor: colors.primaryYellow,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
  },
  dbTestButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  // Weight Section Styles
  weightSection: {
    marginBottom: 24,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  weightCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weightCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightValue: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.text,
  },
  weightInput: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.text,
    padding: 0,
    width: 120,
  },
  weightUnit: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  updateButton: {
    backgroundColor: colors.primaryYellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  updateButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 14,
  },
  weightBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightChangeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  weightGoal: {},
  weightGoalText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Progress Section Styles
  progressSection: {
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarStart: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressBarCurrent: {
    fontSize: 12,
    color: colors.primaryYellow,
    fontWeight: '500',
  },
  progressBarGoal: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primaryYellow,
    borderRadius: 5,
  },
  progressBarIndicator: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primaryYellow,
    borderWidth: 3,
    borderColor: colors.backgroundSecondary,
    top: -3,
    marginLeft: -8,
  },
  weightRemaining: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  // Metrics Grid Styles
  metricsSection: {
    marginBottom: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  metricUnit: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  hydrationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  hydrationProgressContainer: {
    height: 6,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  hydrationProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  hydrationText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  // Insights Section Styles
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightIcon: {
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
}); 