import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { DB_NAME } from './index';
import { runMigrations } from './migrations/001_initial_schema';

// Database context interface
interface DatabaseContextType {
  isLoaded: boolean;
}

// Create context with default values
const DatabaseContext = createContext<DatabaseContextType>({
  isLoaded: false,
});

// Custom hook to use the database context
export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initDatabase() {
      try {
        // Open database connection
        const db = SQLite.openDatabaseSync(DB_NAME);
        
        // Run migrations
        await runMigrations(db);
        
        // Set database as ready
        setIsReady(true);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError('Failed to initialize database. Please restart the application.');
      }
    }

    initDatabase();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Initializing database...</Text>
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ isLoaded: true }}>
      {children}
    </DatabaseContext.Provider>
  );
} 