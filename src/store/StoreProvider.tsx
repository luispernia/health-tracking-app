import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useActivityStore } from './activity-store';
import { useWorkoutStore } from './workout-store';
import { colors } from '@constants/Colors';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializeStore = useActivityStore(state => state.initializeStore);
  const loadWorkoutHistory = useWorkoutStore(state => state.loadWorkoutHistory);
  const isStoreLoading = useActivityStore(state => state.isLoading);
  
  useEffect(() => {
    const setupStore = async () => {
      try {
        // Initialize stores with values from database
        await initializeStore();
        
        if (typeof loadWorkoutHistory === 'function') {
          // Check if it returns a promise
          try {
            await Promise.resolve(loadWorkoutHistory());
          } catch (e) {
            // If it's not a promise, this will just silently fail
            // which is fine since we're just trying to await if possible
          }
        }
      } catch (error) {
        console.error('Error initializing store:', error);
        setError('Failed to load data. Please restart the app.');
      }
    };
    
    setupStore();
  }, [initializeStore, loadWorkoutHistory]);
  
  // Monitor store loading state
  useEffect(() => {
    if (!isStoreLoading) {
      // Once store loading is complete, mark app as initialized
      setInitialized(true);
    }
  }, [isStoreLoading]);
  
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  if (!initialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primaryYellow} />
        <Text style={styles.loadingText}>Loading activity data...</Text>
      </View>
    );
  }
  
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    padding: 20,
  },
}); 