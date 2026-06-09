import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useMission } from '@/context/MissionContext';
import { SensorData } from '@/lib/types';
import { Colors } from '@/lib/theme';

interface AIScreenProps {
  data: SensorData;
}

interface ChatMessage {
  query:    string;
  response: string;
}

const SUGGESTIONS = [
  'Analise o estado atual da missão',
  'Preveja riscos nas próximas 24h',
  'Otimize consumo de energia',
  'Qual recurso mais crítico?',
];

/**
 * Diferencial bônus: Interpretação inteligente dos dados da missão.
 */
export default function AIScreen({ data }: AIScreenProps) {
  const { state } = useMission();
  const [loading,     setLoading]     = useState(false);
  const [analysis,    setAnalysis]    = useState<string | null>(null);
  const [query,       setQuery]       = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error,       setError]       = useState<string | null>(null);

const runAnalysis = async (customQuery?: string) => {
  const q = (customQuery ?? query).trim();

  if (!q) return;

  setLoading(true);
  setError(null);

  try {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const alerts: string[] = [];

    if (data.oxygen.level < state.alertThresholds.oxygen)
      alerts.push('🫁 Oxigênio abaixo do limite.');

    if (data.water.level < state.alertThresholds.water)
      alerts.push('💧 Reservas de água críticas.');

    if (data.energy.level < state.alertThresholds.energy)
      alerts.push('⚡ Energia abaixo do recomendado.');

    if (data.food.level < state.alertThresholds.food)
      alerts.push('🍽️ Estoque de alimentos reduzido.');

    if (data.signal.strength < 40)
      alerts.push('📡 Comunicação instável.');

    if (data.orbital.stability < 70)
      alerts.push('🛰️ Estabilidade orbital comprometida.');

    const question = q.toLowerCase();

    let response = `🚀 RELATÓRIO COSMOS-AI

Pergunta: ${q}

`;

    if (alerts.length > 0) {
      response += '⚠️ ALERTAS DETECTADOS\n\n';
      response += alerts.join('\n');
      response += '\n\n';
    } else {
      response += '✅ Todos os sistemas estão operando normalmente.\n\n';
    }

    if (
      question.includes('estado') ||
      question.includes('missão')
    ) {
      response +=
        '📊 STATUS GERAL DA MISSÃO\n\n' +
        `🫁 Oxigênio: ${data.oxygen.level.toFixed(1)}%\n` +
        `💧 Água: ${data.water.level.toFixed(1)}%\n` +
        `⚡ Energia: ${data.energy.level.toFixed(1)}%\n` +
        `🍽️ Alimento: ${data.food.level.toFixed(1)}%\n` +
        `🛰️ Estabilidade Orbital: ${data.orbital.stability.toFixed(1)}%\n\n` +
        'Recomendação: manter monitoramento contínuo.';
    }

    else if (
      question.includes('risco') ||
      question.includes('24h')
    ) {
      response += '🔮 PREVISÃO PARA AS PRÓXIMAS 24 HORAS\n\n';

      if (data.energy.level < 40)
        response += '⚠️ Possível escassez energética.\n';

      if (data.water.level < 40)
        response += '⚠️ Reservas de água exigem atenção.\n';

      if (data.signal.strength < 50)
        response += '⚠️ Comunicação pode sofrer degradação.\n';

      if (data.orbital.stability < 75)
        response += '⚠️ Correções orbitais podem ser necessárias.\n';

      response +=
        '\n📋 Recomenda-se monitoramento reforçado dos sistemas críticos.';
    }

    else if (
      question.includes('energia') ||
      question.includes('consumo')
    ) {
      response +=
        '⚡ OTIMIZAÇÃO DE ENERGIA\n\n' +
        '• Desativar módulos não essenciais.\n' +
        '• Reduzir transmissões secundárias.\n' +
        '• Priorizar sistemas de suporte à vida.\n' +
        '• Monitorar bancos de bateria.\n\n';

      if (data.energy.level < 50) {
        response +=
          '⚠️ O nível atual de energia exige medidas de economia.';
      } else {
        response +=
          '✅ O nível energético atual é considerado seguro.';
      }
    }

    else if (
      question.includes('recurso') ||
      question.includes('crítico')
    ) {
      const resources = [
        { name: 'Oxigênio', value: data.oxygen.level },
        { name: 'Água', value: data.water.level },
        { name: 'Energia', value: data.energy.level },
        { name: 'Alimento', value: data.food.level },
      ];

      resources.sort((a, b) => a.value - b.value);

      response +=
        '📉 RECURSO MAIS CRÍTICO\n\n' +
        `${resources[0].name}: ${resources[0].value.toFixed(1)}%\n\n` +
        'Recomendação: priorizar este recurso nas próximas operações.';
    }

    else {
      response +=
        '🤖 Análise concluída.\n\n' +
        `🫁 Oxigênio: ${data.oxygen.level.toFixed(1)}%\n` +
        `💧 Água: ${data.water.level.toFixed(1)}%\n` +
        `⚡ Energia: ${data.energy.level.toFixed(1)}%\n` +
        `🍽️ Alimento: ${data.food.level.toFixed(1)}%\n` +
        `🛰️ Estabilidade Orbital: ${data.orbital.stability.toFixed(1)}%\n\n` +
        'Todos os dados da missão foram processados com sucesso.';
    }

    setAnalysis(response);

    setChatHistory(prev => [
      ...prev,
      {
        query: q,
        response,
      },
    ]);
  } catch {
    setError('Falha ao analisar os dados da missão.');
  } finally {
    setLoading(false);
    setQuery('');
  }
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header da IA */}
      <View style={styles.aiHeader}>
        <Text style={{ fontSize: 28 }}>🤖</Text>
        <View>
          <Text style={styles.aiName}>COSMOS-AI</Text>
          <Text style={styles.aiSub}>Assistente Inteligente de Missão Espacial</Text>
        </View>
      </View>

      {/* Sugestões rápidas */}
      <View style={styles.suggestionsRow}>
        {SUGGESTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => runAnalysis(s)}
            style={styles.suggestionBtn}
            activeOpacity={0.75}
          >
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input personalizado */}
      <View style={styles.inputRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => runAnalysis()}
          placeholder="Pergunte à IA sobre a missão..."
          placeholderTextColor={Colors.textDim}
          style={styles.input}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={() => runAnalysis()}
          disabled={loading}
          style={[styles.sendBtn, loading && { opacity: 0.6 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.sendBtnText}>{loading ? '…' : 'Analisar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={Colors.purple} />
          <Text style={styles.loadingText}>Analisando dados da missão…</Text>
        </View>
      )}

      {/* Erro */}
      {!!error && (
        <View style={styles.errorCard}>
          <Text style={{ color: Colors.danger }}>{error}</Text>
        </View>
      )}

      {/* Resposta atual */}
      {analysis && !loading && (
        <View style={styles.responseCard}>
          <Text style={styles.responseHeader}>🤖 COSMOS-AI</Text>
          <Text style={styles.responseText}>{analysis}</Text>
        </View>
      )}

      {/* Histórico de conversas */}
      {chatHistory.length > 1 && (
        <>
          <Text style={styles.sectionTitle}>HISTÓRICO</Text>
          {chatHistory
            .slice(0, -1)
            .reverse()
            .slice(0, 3)
            .map((h, i) => (
              <View key={i} style={styles.historyCard}>
                <Text style={styles.historyQuery}>→ {h.query}</Text>
                <Text style={styles.historyResp} numberOfLines={3}>
                  {h.response.slice(0, 200)}…
                </Text>
              </View>
            ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { padding: 16, paddingBottom: 80 },

  aiHeader: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             10,
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.purple + '44',
    padding:         14,
    marginBottom:    14,
  },
  aiName: { fontSize: 14, fontWeight: '700', color: Colors.purple },
  aiSub:  { fontSize: 11, color: Colors.textMuted },

  suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  suggestionBtn: {
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
    borderWidth:       1,
    borderColor:       Colors.purple + '44',
    backgroundColor:   Colors.purpleBg,
  },
  suggestionText: { fontSize: 11, color: Colors.purple, fontWeight: '500' },

  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  input: {
    flex:            1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth:     1,
    borderColor:     Colors.border,
    borderRadius:    8,
    padding:         10,
    color:           Colors.text,
    fontSize:        14,
  },
  sendBtn: {
    backgroundColor: Colors.accent,
    borderRadius:    8,
    paddingHorizontal: 16,
    justifyContent:  'center',
  },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  loadingCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         20,
    alignItems:      'center',
    gap:             10,
    marginBottom:    14,
  },
  loadingText: { fontSize: 13, color: Colors.purple },

  errorCard: {
    backgroundColor: Colors.dangerBg,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     Colors.danger + '33',
    padding:         14,
    marginBottom:    14,
  },

  responseCard: {
    backgroundColor: Colors.purpleBg,
    borderRadius:    12,
    borderWidth:     1,
    borderLeftWidth: 3,
    borderColor:     Colors.purple + '33',
    borderLeftColor: Colors.purple,
    padding:         14,
    marginBottom:    16,
  },
  responseHeader: { fontSize: 11, fontWeight: '700', color: Colors.purple, marginBottom: 8 },
  responseText:   { fontSize: 13, color: Colors.text, lineHeight: 22 },

  sectionTitle: {
    fontSize:      11,
    fontWeight:    '700',
    color:         Colors.textDim,
    letterSpacing: 1.2,
    marginBottom:  10,
    marginTop:     4,
  },

  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         14,
    marginBottom:    8,
  },
  historyQuery: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  historyResp:  { fontSize: 12, color: Colors.text, lineHeight: 18 },
});
