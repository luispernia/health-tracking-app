import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors } from '@constants/Colors';

export default function DietScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Diet Tracker</Text>
        <Text style={styles.placeholder}>Food tracking coming soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
}); 