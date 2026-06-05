import React from 'react';
import { SafeAreaView } from 'react-native';
import { useSimulatedSensors } from '@/lib/sensors';
import { Colors } from '@/lib/theme';
import AIScreen from '@/components/dashboards/AIScreen';

export default function AIPage() {
  const data = useSimulatedSensors();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <AIScreen data={data} />
    </SafeAreaView>
  );
}
