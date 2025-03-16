import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  StatusBar,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import ProgressCircle from '@features/calories/ProgressCircle';
import ActivityCard from '@features/calories/ActivityCard';
import StepTracker from '@features/steps/StepTracker';
import { colors } from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useActivityStore } from '../../store/activity-store';

const { width } = Dimensions.get('window');

// Helper to get current time in readable format
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper to format date for last updated
const getLastUpdated = () => {
  return `Updated ${getCurrentTime()}`;
};

export default function ActivityScreen() {
  // Global state
  const { 
    steps, 
    activeMinutes, 
    distance, 
    calories, 
    calorieGoal,
    caloriesGained,
    waterIntake,
    waterIntakeGoal,
    isLoading
  } = useActivityStore();
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryYellow} />
          <Text style={styles.loadingText}>Loading activity data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Today</Text>
            <Text style={styles.title}>Health Summary</Text>
          </View>
          <View style={styles.profileIconContainer}>
            <Ionicons name="person-circle" size={40} color={colors.primaryYellow} />
          </View>
        </View>
        
        {/* Main Progress Circles - Horizontally Scrollable */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsScrollContainer}
          snapToInterval={width - 64 + 16}
          decelerationRate="fast"
        >
          <ProgressCircle
            value={calories}
            goal={calorieGoal}
            title="Calories Burned"
            unit="cal"
            color={'#FF9500'}
            secondaryColor={'#FF2D55'}
            icon="flame"
            lastUpdated={getLastUpdated()}
            changePercent={8}
            subtitle="Active Calories"
          />
          
          <ProgressCircle
            value={caloriesGained}
            goal={1000}
            title="Calories Gained"
            unit="cal"
            color={'#FF2D55'}
            secondaryColor={'#FF9500'}
            icon="trending-up"
            lastUpdated={getLastUpdated()}
            changePercent={-3}
            subtitle="Consumed Today"
          />
          
          <ProgressCircle
            value={waterIntake}
            goal={waterIntakeGoal}
            title="Water Intake"
            unit="L"
            color={'#5AC8FA'}
            secondaryColor={'#007AFF'}
            icon="water"
            lastUpdated={getLastUpdated()}
            changePercent={12}
            subtitle="Hydration Level"
          />
        </ScrollView>
        
        {/* Step Tracker Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Step Activity</Text>
          <Text style={styles.sectionSubtitle}>Live tracking with pedometer</Text>
        </View>
        
        <View style={styles.stepsSection}>
          <StepTracker />
        </View>
        
        {/* Activity Cards Section */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Activity Metrics</Text>
          <Text style={styles.sectionSubtitle}>Today's Statistics</Text>
        </View>
        
        <View style={styles.activityCardsContainer}>
          <View style={styles.cardWrapper}>
            <ActivityCard
              title="Steps"
              value={steps}
              icon="footsteps"
              color="#5E60CE"
              percentChange={12}
              unit="steps"
            />
          </View>
          
          <View style={styles.cardWrapper}>
            <ActivityCard
              title="Distance"
              value={distance}
              icon="map"
              color="#64DFDF"
              percentChange={5}
              unit="km"
            />
          </View>
          
          <View style={styles.cardWrapper}>
            <ActivityCard
              title="Active Minutes"
              value={activeMinutes}
              icon="timer"
              color="#80FFDB"
              percentChange={15}
              unit="min"
            />
          </View>
          
          <View style={styles.cardWrapper}>
            <ActivityCard
              title="Water"
              value={waterIntake}
              icon="water"
              color="#48BFE3"
              percentChange={10}
              unit="L"
            />
          </View>
        </View>
        
        {/* Spacer for navigation bar */}
        <View style={styles.navigationSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  metricsScrollContainer: {
    paddingRight: 16,
    paddingBottom: 8,
    marginBottom: 16,
  },
  stepsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  activityCardsContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  navigationSpacer: {
    height: 80, // Add space for the navigation bar
  },
}); 