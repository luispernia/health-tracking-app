import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors } from '@constants/Colors';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  useAnimatedStyle,
  withTiming, 
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Easing, 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

interface CalorieProgressCircleProps {
  calories: number;
  goal: number;
}

export default function CalorieProgressCircle({ calories, goal }: CalorieProgressCircleProps) {
  // Animation shared values
  const progress = useSharedValue(0);
  const calorieCount = useSharedValue(0);
  const pulseValue = useSharedValue(1);
  const flameOpacity = useSharedValue(0);
  const flameScale = useSharedValue(1);
  const celebrationOpacity = useSharedValue(0);
  const celebrationScale = useSharedValue(0);
  
  // State to track if goal has been reached to trigger celebration animation only once
  const [hasReachedGoal, setHasReachedGoal] = useState(false);
  const [hasExceededGoal, setHasExceededGoal] = useState(false);
  
  // Calculate percentage
  const percentage = Math.min(calories / goal, 1);
  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const isAboveGoal = calories > goal;

  // Set up animations when component mounts or values change
  useEffect(() => {
    // Animate progress circle
    progress.value = withTiming(percentage, {
      duration: 1500,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
    
    // Animate calorie counter
    calorieCount.value = withTiming(calories, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });
    
    // Pulse animation for calories text
    pulseValue.value = withSequence(
      withTiming(1.1, { duration: 300, easing: Easing.bezier(0.2, 0, 0.8, 1) }),
      withTiming(1, { duration: 300, easing: Easing.bezier(0.2, 0, 0.8, 1) }),
      withDelay(500, withTiming(1, { duration: 300 })) // Reset after delay
    );
    
    // Celebration animation when reaching goal for the first time
    if (calories >= goal && !hasReachedGoal) {
      setHasReachedGoal(true);
      celebrationOpacity.value = 0;
      celebrationScale.value = 0;
      
      // Delay slightly to sync with progress circle animation
      setTimeout(() => {
        celebrationOpacity.value = withTiming(1, { duration: 500 });
        celebrationScale.value = withSequence(
          withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back()) }),
          withTiming(1, { duration: 400 })
        );
        
        // Hide celebration after a few seconds
        setTimeout(() => {
          celebrationOpacity.value = withTiming(0, { duration: 1000 });
        }, 3000);
      }, 1000);
    }
    
    // Flame animation when above goal
    if (isAboveGoal) {
      if (!hasExceededGoal) {
        setHasExceededGoal(true);
      }
      flameOpacity.value = withTiming(1, { duration: 500 });
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.9, { duration: 800, easing: Easing.inOut(Easing.sin) })
        ),
        -1, // infinite repeat
        true // reverse
      );
    } else {
      flameOpacity.value = withTiming(0, { duration: 500 });
      setHasExceededGoal(false);
    }
  }, [calories, goal, percentage, isAboveGoal, hasReachedGoal, hasExceededGoal]);

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
  
  // Animated style for calories text
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: 36,
      fontWeight: 'bold',
      color: isAboveGoal ? colors.red : colors.text,
      transform: [{ scale: pulseValue.value }],
    };
  });
  
  // Animated style for flames
  const flameContainerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: flameOpacity.value,
      transform: [{ scale: flameScale.value }],
    };
  });
  
  // Animated style for celebration
  const celebrationStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: celebrationOpacity.value,
      transform: [{ scale: celebrationScale.value }],
    };
  });
  
  // Glow effect intensity based on progress
  const glowOpacity = percentage > 0.7 ? 0.4 : percentage > 0.4 ? 0.2 : 0;
  const glowColor = isAboveGoal ? colors.red : colors.primaryYellow;

  return (
    <View style={styles.container}>
      <View style={[
        styles.glowEffect, 
        { 
          opacity: isAboveGoal ? 0.5 : glowOpacity, 
          backgroundColor: glowColor 
        }
      ]} />
      
      {/* Flames behind the circle (when exceeding goal) */}
      {isAboveGoal && (
        <Animated.View style={flameContainerStyle}>
          <View style={styles.flamesContainer}>
            {[...Array(8)].map((_, index) => (
              <AnimatedIonicons 
                key={index}
                name="flame"
                size={40 + (index % 3) * 10}
                color={colors.orange}
                style={[
                  styles.flame,
                  {
                    transform: [
                      { rotate: `${(index * 45)}deg` },
                      { translateY: -radius - 20 },
                      { rotate: `${180}deg` }
                    ],
                    opacity: 0.6 + (index % 3) * 0.15,
                  }
                ]}
              />
            ))}
          </View>
        </Animated.View>
      )}
      
      <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
        <G rotation="-90" origin={`${radius + strokeWidth / 2}, ${radius + strokeWidth / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={isAboveGoal ? colors.red : colors.primaryYellow}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animatedProps={animatedCircleProps}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>
      
      <View style={styles.textContainer}>
        <Animated.Text style={animatedTextStyle}>
          {Math.round(calorieCount.value)}
        </Animated.Text>
        <Text style={styles.label}>CALORIES</Text>
        <Text style={[
          styles.goalText, 
          isAboveGoal && { color: colors.red }
        ]}>
          Goal: {goal}
        </Text>
      </View>
      
      {/* Celebration animation */}
      <Animated.View style={celebrationStyle}>
        <View style={styles.celebrationContainer}>
          {[...Array(5)].map((_, index) => (
            <Ionicons 
              key={index}
              name="star"
              size={30 + (index % 3) * 10}
              color={colors.primaryYellow}
              style={[
                styles.star,
                {
                  transform: [
                    { rotate: `${(index * 72)}deg` },
                    { translateY: -radius - 25 }
                  ],
                }
              ]}
            />
          ))}
          <View style={styles.celebrationTextContainer}>
            <Text style={styles.celebrationText}>Goal reached!</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.2,
    zIndex: -1,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -5,
    letterSpacing: 1,
  },
  goalText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  flamesContainer: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flame: {
    position: 'absolute',
  },
  celebrationContainer: {
    position: 'absolute',
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    position: 'absolute',
  },
  celebrationTextContainer: {
    position: 'absolute',
    top: 30,
    backgroundColor: colors.primaryYellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  celebrationText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  }
}); 