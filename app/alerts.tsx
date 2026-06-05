import React from 'react';
import { SafeAreaView } from 'react-native';
import { useSimulatedSensors } from '@/lib/sensors';
import { Colors } from '@/lib/theme';
import AlertsScreen from '@/components/dashboards/AlertsScreen';

export default function AlertsPage() {
  const data = useSimulatedSensors();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <AlertsScreen data={data} />
    </SafeAreaView>
  );
}
