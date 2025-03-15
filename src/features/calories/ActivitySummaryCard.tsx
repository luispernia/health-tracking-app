import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@constants/Colors';

interface ActivitySummaryCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string | number;
  unit?: string;
  color: string;
}

export default function ActivitySummaryCard({ 
  icon, 
  title, 
  value, 
  unit, 
  color 
}: ActivitySummaryCardProps) {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  unit: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
}); 