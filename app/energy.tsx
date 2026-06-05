import React from 'react';
import { SafeAreaView } from 'react-native';
import { useSimulatedSensors } from '@/lib/sensors';
import { Colors } from '@/lib/theme';
import EnergyScreen from '@/components/dashboards/EnergyScreen';

export default function EnergyPage() {
  const data = useSimulatedSensors();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <EnergyScreen data={data} />
    </SafeAreaView>
  );
}
