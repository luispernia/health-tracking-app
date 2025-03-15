import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { colors } from '@constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        tabBarActiveBackgroundColor: colors.background,
        tabBarInactiveBackgroundColor: colors.background,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <Ionicons name="fitness" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 5,
    backgroundColor: colors.background,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 