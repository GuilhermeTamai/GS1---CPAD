// app/sensors.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { useSimulatedSensors, useSensorHistory } from '@/lib/sensors';
import { Colors } from '@/lib/theme';
import SensorsScreen from '@/components/dashboards/SensorsScreen';

export default function SensorsPage() {
  const data    = useSimulatedSensors();
  const history = useSensorHistory(data.tick);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <SensorsScreen data={data} history={history} />
    </SafeAreaView>
  );
}
