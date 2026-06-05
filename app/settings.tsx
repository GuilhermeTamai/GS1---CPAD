import React from 'react';
import { SafeAreaView } from 'react-native';
import { Colors } from '@/lib/theme';
import SettingsScreen from '@/components/dashboards/SettingsScreen';

export default function SettingsPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <SettingsScreen />
    </SafeAreaView>
  );
}
