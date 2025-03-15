import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  StatusBar,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import CalorieProgressCircle from '@features/calories/CalorieProgressCircle';
import ActivitySummaryCard from '@features/calories/ActivitySummaryCard';
import ActivitySelectionModal from '@features/calories/ActivitySelectionModal';
import { colors } from '@constants/Colors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  SlideInRight
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ActivityScreen() {
  // State
  const [caloriesBurned, setCaloriesBurned] = useState(420);
  const [calorieGoal, setCalorieGoal] = useState(800);
  const [showActivityModal, setShowActivityModal] = useState(false);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const progressScale = useSharedValue(0.9);
  
  // Background small calorie increments for simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCaloriesBurned(prev => {
        // Random small increment between 1-3 calories for background activity
        const increment = Math.floor(Math.random() * 3) + 1;
        return prev + increment;
      });
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Initial animations
  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    progressScale.value = withSpring(1, { damping: 12 });
  }, []);
  
  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: withTiming((1 - headerOpacity.value) * -20, { duration: 500 }) }
    ]
  }));
  
  const circleContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: progressScale.value }
    ]
  }));

  // Handle adding calories from workout
  const handleAddCalories = (calories: number) => {
    setCaloriesBurned(prev => prev + calories);
    
    // Pulse animation
    progressScale.value = withSequence(
      withTiming(1.05, { duration: 200 }),
      withTiming(1, { duration: 300 })
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Text style={styles.greeting}>Hi there,</Text>
          <Text style={styles.title}>Your Fitness Dashboard</Text>
        </Animated.View>
        
        {/* Main Calorie Component */}
        <Animated.View 
          style={[styles.calorieMainSection, circleContainerStyle]}
          entering={FadeIn.duration(600).delay(300)}
        >
          <CalorieProgressCircle 
            calories={caloriesBurned} 
            goal={calorieGoal} 
          />
          
          <TouchableOpacity 
            style={styles.addCaloriesButton}
            onPress={() => setShowActivityModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="fitness" size={20} color={colors.background} />
            <Text style={styles.buttonText}>Log Workout</Text>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Activity Summary</Text>
          
          <Animated.View entering={SlideInRight.duration(400).delay(200)}>
            <ActivitySummaryCard 
              icon="footsteps" 
              title="Steps"
              value="5,248"
              unit="steps"
              color={colors.primaryYellow} 
            />
          </Animated.View>
          
          <Animated.View entering={SlideInRight.duration(400).delay(300)}>
            <ActivitySummaryCard 
              icon="time-outline" 
              title="Active Time"
              value="47"
              unit="min"
              color={colors.orange} 
            />
          </Animated.View>
          
          <Animated.View entering={SlideInRight.duration(400).delay(400)}>
            <ActivitySummaryCard 
              icon="trending-up" 
              title="Distance"
              value="3.2"
              unit="km"
              color={colors.green} 
            />
          </Animated.View>
        </View>
      </ScrollView>
      
      {/* Activity Selection Modal */}
      <ActivitySelectionModal
        visible={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        onSelectActivity={handleAddCalories}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 4,
  },
  calorieMainSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  addCaloriesButton: {
    marginTop: 16,
    backgroundColor: colors.primaryYellow,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  summarySection: {
    marginBottom: 20,
  },
}); 