import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSpring
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '@constants/Colors';

const { width } = Dimensions.get('window');

// Extract AnimatedIcon component outside of the main component
// to comply with React Hooks rules
interface AnimatedIconProps {
  iconName: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
}

const AnimatedIcon = ({ iconName, isFocused }: AnimatedIconProps) => {
  const scale = useSharedValue(1);
  
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  React.useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.2, { damping: 10 });
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isFocused]);
  
  return (
    <Animated.View style={[styles.iconContainer, iconStyle]}>
      <Ionicons 
        name={iconName} 
        size={24} 
        color={isFocused ? colors.primaryYellow : colors.tabBarInactive} 
      />
    </Animated.View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const selectedTabWidth = useSharedValue(0);
  const selectedTabX = useSharedValue(0);
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  
  // Create animated styles for the indicator
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      // Make the indicator slightly smaller than the tab width
      width: selectedTabWidth.value * 0.8,
      height: 34,
      borderRadius: 17,
      backgroundColor: 'rgba(250, 189, 47, 0.15)',
      // Center the indicator horizontally within the tab
      transform: [{ translateX: selectedTabX.value + (selectedTabWidth.value * 0.1) }],
      bottom: 12,
    };
  });

  return (
    <View style={[
      styles.outerContainer, 
      { paddingBottom: insets.bottom || 16 }
    ]}>
      <BlurView 
        intensity={40} 
        tint="dark" 
        style={styles.container}
      >
        <View style={styles.blurBackground} />
        <View style={styles.contentContainer}>
          <Animated.View style={indicatorStyle} />
          
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.title || route.name;
            const isFocused = state.index === index;
            
            // Icon to display
            let iconName: keyof typeof Ionicons.glyphMap;
            switch (route.name) {
              case 'index':
                iconName = isFocused ? 'stats-chart' : 'stats-chart-outline';
                break;
              case 'workouts':
                iconName = isFocused ? 'fitness' : 'fitness-outline';
                break;
              case 'body':
                iconName = isFocused ? 'body' : 'body-outline';
                break;
              case 'diet':
                iconName = isFocused ? 'restaurant' : 'restaurant-outline';
                break;
              default:
                iconName = 'square';
            }
            
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
              
              // Animate the indicator
              selectedTabWidth.value = withTiming(tabWidths[route.key] || 0, { duration: 250 });
              selectedTabX.value = withSpring(tabWidths[`${route.key}_x`] || 0, {
                damping: 20,
                stiffness: 200,
              });
            };
            
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={styles.tabButton}
                onLayout={event => {
                  const { width, x } = event.nativeEvent.layout;
                  setTabWidths(prev => ({
                    ...prev,
                    [route.key]: width,
                    [`${route.key}_x`]: x,
                  }));
                  
                  if (isFocused) {
                    selectedTabWidth.value = width;
                    selectedTabX.value = x;
                  }
                }}
              >
                <AnimatedIcon iconName={iconName} isFocused={isFocused} />
                
                <Text style={[
                  styles.tabBarLabel, 
                  { color: isFocused ? colors.primaryYellow : colors.tabBarInactive }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    marginBottom: 16,
    zIndex: 999,
  },
  container: {
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(80, 80, 80, 0.3)',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(40, 40, 40, 0.3)', // Subtle dark tint
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CustomTabBar; 