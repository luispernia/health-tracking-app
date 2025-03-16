import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { colors } from '@constants/Colors';
import CustomTabBar from '../../components/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        tabBarShowLabel: true,
        tabBarStyle: { 
          display: 'none', // Hide the default tab bar as we're using a custom one
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Activity',
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
        }}
      />
      <Tabs.Screen
        name="body"
        options={{
          title: 'Body',
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
        }}
      />
    </Tabs>
  );
} 