import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Using index in the tabs folder as the redirect target
  return <Redirect href="/(tabs)" />;
}