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
 * Tela de IA — integração com Claude (IA Generativa) para análise preditiva.
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

    const systemPrompt = `Você é COSMOS-AI, assistente de missão espacial avançado para a plataforma CosmoDeploy.
Responda sempre em português brasileiro. Seja direto e técnico. Use emojis relevantes. Formate em tópicos curtos.

Missão: ${state.name} | Local: ${state.location} | Tripulação: ${state.crew} pessoas | Dia: ${state.daysMission}

Dados atuais dos sensores:
- Oxigênio: ${data.oxygen.level.toFixed(1)}% (limiar: ${state.alertThresholds.oxygen}%)
- Água: ${data.water.level.toFixed(1)}% (limiar: ${state.alertThresholds.water}%)
- Energia: ${data.energy.level.toFixed(1)}% (limiar: ${state.alertThresholds.energy}%)
- Alimento: ${data.food.level.toFixed(1)}% (limiar: ${state.alertThresholds.food}%)
- Temperatura interna: ${data.temperature.internal.toFixed(1)}°C
- Pressão: ${data.pressure.level.toFixed(1)} kPa
- Sinal: ${data.signal.strength.toFixed(0)}% | Latência: ${data.signal.latency.toFixed(0)}ms
- Estabilidade orbital: ${data.orbital.stability.toFixed(1)}%`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system:     systemPrompt,
          messages:   [{ role: 'user', content: q }],
        }),
      });

      const json = await res.json();
      const text = json.content?.map((c: { text?: string }) => c.text ?? '').join('') ?? 'Sem resposta';

      setChatHistory((h) => [...h, { query: q, response: text }]);
      setAnalysis(text);
    } catch (e) {
      setError('Erro ao conectar com COSMOS-AI. Verifique a conexão.');
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
          <Text style={styles.aiSub}>Assistente de Análise Preditiva · Powered by Claude</Text>
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
