import React, { createContext, useContext } from 'react';

// Create a dummy context without actual database functionality
export const DatabaseContext = createContext<{
  isLoaded: boolean;
}>({
  isLoaded: true,
});

// Hook to use the database context
export const useDatabase = () => useContext(DatabaseContext);

// Dummy database provider component that doesn't use SQLite
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // Simply render children without any database initialization
  return (
    <DatabaseContext.Provider value={{ isLoaded: true }}>
      {children}
    </DatabaseContext.Provider>
  );
} 