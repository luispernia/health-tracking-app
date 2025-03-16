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
    caloriesIntake,
    caloriesIntakeGoal,
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
        
        {/* Main Progress Circles */}
        <View style={styles.metricsSection}>
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
        </View>
        
        {/* Activity Overview Section */}
        <View style={styles.overviewSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity Overview</Text>
            <Text style={styles.sectionSubtitle}>Today's Stats</Text>
          </View>
          
          <ActivityCard 
            icon="footsteps" 
            title="Steps"
            value={steps.toLocaleString()}
            unit="steps"
            color="#5E5CE6" 
            subtitle="Daily average: 6,540 steps"
            percentChange={15}
          />
          
          <ActivityCard 
            icon="time-outline" 
            title="Active Time"
            value={activeMinutes}
            unit="min"
            color="#30D158" 
            subtitle="Weekly goal: 180 minutes"
            percentChange={-5}
          />
          
          <ActivityCard 
            icon="trending-up" 
            title="Distance"
            value={distance.toFixed(1)}
            unit="km"
            color="#007AFF" 
            subtitle="This week: 15.8 km"
            percentChange={8}
          />
          
          <ActivityCard 
            icon="heart" 
            title="Heart Rate"
            value="72"
            unit="bpm"
            color="#FF3B30" 
            subtitle="Resting: 65 bpm"
            onPress={() => {}}
          />
        </View>
        
        {/* Weekly Summary Graph - Placeholder */}
        <View style={styles.weeklySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Overview</Text>
            <Text style={styles.sectionSubtitle}>Last 7 Days</Text>
          </View>
          
          <View style={styles.graphPlaceholder}>
            <Text style={styles.placeholderText}>Weekly Activity Chart</Text>
            <Text style={styles.placeholderSubtext}>Tap to view detailed stats</Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  profileIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsSection: {
    marginBottom: 24,
  },
  overviewSection: {
    marginBottom: 24,
  },
  weeklySection: {
    marginBottom: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  graphPlaceholder: {
    height: 180,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryYellow,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
}); 