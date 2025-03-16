import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  interpolateColor
} from 'react-native-reanimated';

interface ActivityCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: number | string;
  unit?: string;
  color: string;
  subtitle?: string;
  percentChange?: number;
  onPress?: () => void;
}

export default function ActivityCard({
  icon,
  title,
  value,
  unit,
  color,
  subtitle,
  percentChange,
  onPress
}: ActivityCardProps) {
  // Animation values
  const scale = useSharedValue(1);
  const backgroundOpacity = useSharedValue(0);
  
  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        backgroundOpacity.value,
        [0, 1],
        [colors.backgroundSecondary, color + '15']
      ),
    };
  });

  // Handle press animations
  const handlePressIn = () => {
    scale.value = withTiming(0.98, {
      duration: 200,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
    backgroundOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
    backgroundOpacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.pressableContainer}
    >
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={18} color={color} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color }]}>
              {value}
              {unit && <Text style={styles.unit}> {unit}</Text>}
            </Text>
            
            {percentChange !== undefined && (
              <View style={styles.percentChangeContainer}>
                <Ionicons 
                  name={percentChange >= 0 ? "arrow-up" : "arrow-down"} 
                  size={12} 
                  color={percentChange >= 0 ? colors.green : colors.red} 
                />
                <Text style={[
                  styles.percentChangeText, 
                  {color: percentChange >= 0 ? colors.green : colors.red}
                ]}>
                  {Math.abs(percentChange)}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    width: '100%',
    marginBottom: 12,
  },
  container: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  unit: {
    fontSize: 14,
    fontWeight: '400',
  },
  percentChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  percentChangeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 2,
  },
}); 