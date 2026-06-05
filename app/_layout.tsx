import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { MissionProvider } from '@/context/MissionContext';
import { Colors } from '@/lib/theme';

// ─── Ícones das tabs ──────────────────────────────────────────────────────────

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

// ─── Layout raiz ─────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <MissionProvider>
      <StatusBar style="light" backgroundColor={Colors.bg} />
      <Tabs
        screenOptions={{
          headerShown:       false,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopWidth:  1,
            borderTopColor:  Colors.border,
            height:          64,
            paddingBottom:   8,
          },
          tabBarActiveTintColor:   Colors.accent,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: {
            fontSize:   10,
            fontWeight: '600',
            marginTop:  -2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title:    'Início',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="sensors"
          options={{
            title:    'Sensores',
            tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="energy"
          options={{
            title:    'Energia',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚡" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title:    'Alertas',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title:    'IA',
            tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title:    'Config',
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚙" focused={focused} />,
          }}
        />
      </Tabs>
    </MissionProvider>
  );
}
