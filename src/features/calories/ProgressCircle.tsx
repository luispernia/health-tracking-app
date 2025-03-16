import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@constants/Colors';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  withTiming, 
  interpolate,
  Easing,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

// Constants
const CIRCLE_RADIUS = 60;
const STROKE_WIDTH = 12;

interface ProgressCircleProps {
  value: number;
  goal: number;
  title: string;
  unit: string;
  color: string;
  secondaryColor?: string;
  icon: keyof typeof Ionicons.glyphMap;
  lastUpdated?: string;
  changePercent?: number;
  subtitle?: string;
}

export default function ProgressCircle({ 
  value, 
  goal, 
  title,
  unit,
  color,
  secondaryColor,
  icon,
  lastUpdated,
  changePercent,
  subtitle
}: ProgressCircleProps) {
  // Animation shared values
  const progress = useSharedValue(0);
  const currentValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  
  // Calculate percentage
  const percentage = Math.min(value / goal, 1);
  const circumference = 2 * Math.PI * CIRCLE_RADIUS;
  const isAboveGoal = value > goal;
  
  // Use gradient colors if provided, otherwise use solid color
  const gradientStart = secondaryColor || color;
  const gradientEnd = color;

  // Set up animations when component mounts or values change
  useEffect(() => {
    // Animate progress circle
    progress.value = withTiming(percentage, {
      duration: 1500,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
    
    // Animate value counter
    currentValue.value = withTiming(value, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });
    
    // Pulse animation on load
    scaleValue.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
      mass: 1
    });
  }, [value, goal, percentage]);

  // Animated props for progress circle
  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = interpolate(
      progress.value,
      [0, 1],
      [circumference, 0]
    );
    
    return {
      strokeDashoffset: circumference - strokeDashoffset,
    };
  });
  
  // Animated style for container
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }]
    };
  });
  
  // Animated style for value text
  const valueTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: 32,
      fontWeight: '600',
      color: isAboveGoal ? '#FF3B30' : color,
      marginBottom: 2,
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.topSection}>
        <View style={styles.headerContainer}>
          <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={18} color={color} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        {lastUpdated && (
          <Text style={styles.lastUpdated}>{lastUpdated}</Text>
        )}
      </View>
      
      <View style={styles.contentSection}>
        <View style={styles.circleContainer}>
          <Svg width={CIRCLE_RADIUS * 2 + STROKE_WIDTH * 2} height={CIRCLE_RADIUS * 2 + STROKE_WIDTH * 2} viewBox={`0 0 ${CIRCLE_RADIUS * 2 + STROKE_WIDTH * 2} ${CIRCLE_RADIUS * 2 + STROKE_WIDTH * 2}`}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={gradientStart} stopOpacity="1" />
                <Stop offset="1" stopColor={gradientEnd} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <G rotation="-90" origin={`${CIRCLE_RADIUS + STROKE_WIDTH}, ${CIRCLE_RADIUS + STROKE_WIDTH}`}>
              {/* Background Circle */}
              <Circle
                cx={CIRCLE_RADIUS + STROKE_WIDTH}
                cy={CIRCLE_RADIUS + STROKE_WIDTH}
                r={CIRCLE_RADIUS}
                stroke={colors.backgroundSecondary}
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
              />
              {/* Progress Circle */}
              <AnimatedCircle
                cx={CIRCLE_RADIUS + STROKE_WIDTH}
                cy={CIRCLE_RADIUS + STROKE_WIDTH}
                r={CIRCLE_RADIUS}
                stroke="url(#grad)"
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={circumference}
                animatedProps={animatedCircleProps}
                strokeLinecap="round"
                fill="transparent"
              />
            </G>
          </Svg>
          
          <View style={styles.centerTextContainer}>
            <AnimatedText style={valueTextStyle}>
              {Math.round(currentValue.value)}
            </AnimatedText>
            <Text style={styles.unit}>{unit}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
          
          <View style={styles.goalContainer}>
            <Text style={styles.goalText}>
              {isAboveGoal ? 'Exceeded goal by' : 'Goal:'} {goal} {unit}
            </Text>
            
            {changePercent !== undefined && (
              <View style={styles.changeContainer}>
                <Ionicons 
                  name={changePercent >= 0 ? "arrow-up" : "arrow-down"} 
                  size={14} 
                  color={changePercent >= 0 ? colors.green : colors.red} 
                />
                <Text style={[
                  styles.changeText, 
                  {color: changePercent >= 0 ? colors.green : colors.red}
                ]}>
                  {Math.abs(changePercent)}%
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>
              {isAboveGoal 
                ? "Goal completed!" 
                : `${Math.round(percentage * 100)}% of daily goal`}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  contentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unit: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  goalText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 2,
  },
  progressTextContainer: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
}); 