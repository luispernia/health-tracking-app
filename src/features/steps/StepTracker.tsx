import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Button, TouchableOpacity } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useActivityStore } from '../../store/activity-store';
import { colors } from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// Approx calories burned per step (varies by individual)
const CALORIES_PER_STEP = 0.04;

// Custom colors for error states
const errorColor = '#fb4934';

export default function StepTracker() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | 'checking'>('checking');
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  
  const { 
    steps,
    setSteps, 
    addCalories,
    updateDailySteps
  } = useActivityStore();

  useEffect(() => {
    // Check if Pedometer is available on this device
    const checkAvailability = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);
        
        if (isAvailable) {
          // Check permission status
          const permission = await Pedometer.getPermissionsAsync();
          setPermissionStatus(permission.status);
          
          if (permission.status === 'granted') {
            subscribe();
          }
        } else {
          setError('Pedometer not available on this device');
        }
      } catch (error) {
        setError('Error checking pedometer availability');
        setIsPedometerAvailable(false);
      }
    };
    
    checkAvailability();
    
    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Request permissions
  const requestPermission = async () => {
    try {
      const { status } = await Pedometer.requestPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        subscribe();
      }
    } catch (error) {
      setError('Error requesting permissions');
    }
  };

  // Subscribe to pedometer updates
  const subscribe = () => {
    // Unsubscribe if there's an existing subscription
    unsubscribe();
    
    // Create a new subscription
    const subscription = Pedometer.watchStepCount(result => {
      const currentSteps = result.steps;
      
      // Update steps in store
      setSteps(currentSteps);
      
      // Calculate calories burned (very approximate)
      const caloriesBurned = currentSteps * CALORIES_PER_STEP;
      
      // Update calories in store
      addCalories(caloriesBurned);
      
      // Update daily steps in database
      updateDailySteps(currentSteps);
    });
    
    setSubscription(subscription);
  };

  // Unsubscribe from pedometer updates
  const unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  if (isPedometerAvailable === 'checking') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Checking pedometer availability...</Text>
      </View>
    );
  }

  if (!isPedometerAvailable) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={24} color={errorColor} />
        <Text style={styles.errorText}>{error || 'Pedometer not available'}</Text>
      </View>
    );
  }

  if (permissionStatus !== 'granted') {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="footsteps-outline" size={36} color={colors.primaryYellow} />
        <Text style={styles.permissionTitle}>Step Tracking Permission</Text>
        <Text style={styles.permissionText}>
          Allow this app to access your pedometer data to track steps and calculate calories burned.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="footsteps-outline" size={24} color={colors.primaryYellow} />
      </View>
      <Text style={styles.stepsText}>{steps}</Text>
      <Text style={styles.label}>Steps Today</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: colors.text,
    fontSize: 16,
  },
  stepsText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  iconContainer: {
    marginBottom: 8,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: errorColor,
    fontSize: 14,
    marginLeft: 8,
  },
  permissionContainer: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  permissionText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: colors.primaryYellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 