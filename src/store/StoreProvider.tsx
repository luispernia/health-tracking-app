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
  const initializeStore = useActivityStore(state => state.initializeStore);
  const loadWorkoutHistory = useWorkoutStore(state => state.loadWorkoutHistory);
  const isStoreLoading = useActivityStore(state => state.isLoading);
  
  useEffect(() => {
    const setupStore = () => {
      // Initialize stores with default values
      initializeStore();
      loadWorkoutHistory();
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
  
  if (!initialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primaryYellow} />
        <Text style={styles.loadingText}>Initializing app...</Text>
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
}); 