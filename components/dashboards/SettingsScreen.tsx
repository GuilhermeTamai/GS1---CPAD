import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, Switch, StyleSheet,
} from 'react-native';
import { useMission } from '@/context/MissionContext';
import { Colors } from '@/lib/theme';

/**
 * Tela de Configurações — formulário validado com persistência via AsyncStorage.
 * Permite alterar nome da missão, localização, tripulação e limiares de alerta.
 * Salvo automaticamente via Context API (que usa AsyncStorage internamente).
 */
export default function SettingsScreen() {
  const { state, dispatch } = useMission();

  const [form, setForm] = useState({
    missionName:      state.name,
    location:         state.location,
    crew:             String(state.crew),
    oxygenThreshold:  String(state.alertThresholds.oxygen),
    waterThreshold:   String(state.alertThresholds.water),
    energyThreshold:  String(state.alertThresholds.energy),
    foodThreshold:    String(state.alertThresholds.food),
  });

  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [saved,  setSaved]    = useState(false);

  // ── Validação ────────────────────────────────────────────────────────────────
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!form.missionName.trim())              e.missionName = 'Nome da missão é obrigatório';
    if (!form.location.trim())                  e.location    = 'Localização é obrigatória';
    const crew = Number(form.crew);
    if (isNaN(crew) || crew < 1 || crew > 100) e.crew        = 'Tripulação: entre 1 e 100';

    ['oxygenThreshold', 'waterThreshold', 'energyThreshold', 'foodThreshold'].forEach((key) => {
      const v = Number(form[key as keyof typeof form]);
      if (isNaN(v) || v < 5 || v > 50) e[key] = 'Limiar: entre 5% e 50%';
    });
    return e;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    dispatch({
      type:    'UPDATE_MISSION',
      payload: {
        name:     form.missionName.trim(),
        location: form.location.trim(),
        crew:     Number(form.crew),
      },
    });
    dispatch({
      type:    'SET_THRESHOLDS',
      payload: {
        oxygen: Number(form.oxygenThreshold),
        water:  Number(form.waterThreshold),
        energy: Number(form.energyThreshold),
        food:   Number(form.foodThreshold),
      },
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Campo de formulário ───────────────────────────────────────────────────────
  const Field = ({
    label, field, keyboardType = 'default', placeholder,
  }: {
    label: string;
    field: keyof typeof form;
    keyboardType?: 'default' | 'numeric';
    placeholder?: string;
  }) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={form[field]}
        onChangeText={(v) => {
          setForm((f) => ({ ...f, [field]: v }));
          setErrors((e) => ({ ...e, [field]: '' }));
        }}
        placeholder={placeholder}
        placeholderTextColor={Colors.textDim}
        keyboardType={keyboardType}
        style={[styles.input, errors[field] ? styles.inputError : null]}
      />
      {!!errors[field] && (
        <Text style={styles.errorText}>⚠ {errors[field]}</Text>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Dados da missão */}
      <Text style={styles.sectionTitle}>DADOS DA MISSÃO</Text>
      <View style={styles.card}>
        <Field label="Nome da Missão"         field="missionName"     placeholder="Ex: Artemis Base Alpha" />
        <Field label="Localização"            field="location"        placeholder="Ex: Lua — Polo Sul" />
        <Field label="Tamanho da Tripulação"  field="crew"            keyboardType="numeric" />
      </View>

      {/* Limiares */}
      <Text style={styles.sectionTitle}>LIMIARES DE ALERTA (%)</Text>
      <View style={[styles.infoBox]}>
        <Text style={styles.infoText}>
          ℹ Alertas são disparados quando os recursos caírem abaixo dos valores definidos.
        </Text>
      </View>
      <View style={styles.card}>
        <Field label="💨 Oxigênio (%)"  field="oxygenThreshold"  keyboardType="numeric" />
        <Field label="💧 Água (%)"      field="waterThreshold"   keyboardType="numeric" />
        <Field label="⚡ Energia (%)"   field="energyThreshold"  keyboardType="numeric" />
        <Field label="🥗 Alimento (%)"  field="foodThreshold"    keyboardType="numeric" />
      </View>

      {/* Preferências */}
      <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
      <View style={styles.card}>
        {(
          [
            { key: 'notifications', label: 'Notificações push' },
            { key: 'autoAlert',     label: 'Alertas automáticos' },
          ] as const
        ).map((pref) => (
          <View key={pref.key} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{pref.label}</Text>
            <Switch
              value={state.settings[pref.key]}
              onValueChange={(v) =>
                dispatch({ type: 'UPDATE_SETTINGS', payload: { [pref.key]: v } })
              }
              trackColor={{ false: 'rgba(255,255,255,0.12)', true: Colors.accent }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </View>

      {/* Feedback de sucesso */}
      {saved && (
        <View style={styles.savedBanner}>
          <Text style={styles.savedText}>✅ Configurações salvas com sucesso!</Text>
        </View>
      )}

      {/* Botão de salvar */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.saveBtnText}>Salvar Configurações</Text>
      </TouchableOpacity>

      {/* Informações do sistema */}
      <View style={styles.card}>
        <Text style={styles.infoRowLabel}>Informações do Sistema</Text>
        {[
          ['Missão',           state.name],
          ['Local',            state.location],
          ['Tripulação',       `${state.crew} pessoas`],
          ['Alertas gerados',  String(state.alertHistory.length)],
        ].map(([k, v]) => (
          <View key={k} style={styles.infoRow}>
            <Text style={styles.infoKey}>{k}</Text>
            <Text style={styles.infoVal}>{v}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content:   { padding: 16, paddingBottom: 80 },

  sectionTitle: {
    fontSize:      11,
    fontWeight:    '700',
    color:         Colors.textDim,
    letterSpacing: 1.2,
    marginBottom:  10,
    marginTop:     4,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         16,
    marginBottom:    14,
  },

  fieldWrapper: { marginBottom: 14 },
  fieldLabel:   { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth:     1,
    borderColor:     Colors.border,
    borderRadius:    8,
    padding:         10,
    color:           Colors.text,
    fontSize:        14,
  },
  inputError: { borderColor: Colors.danger },
  errorText:  { fontSize: 11, color: Colors.danger, marginTop: 3 },

  infoBox: {
    backgroundColor: Colors.infoBg,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     Colors.info + '33',
    padding:         12,
    marginBottom:    12,
  },
  infoText: { fontSize: 12, color: Colors.info },

  toggleRow: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    marginBottom:    12,
  },
  toggleLabel: { fontSize: 13, color: Colors.text },

  savedBanner: {
    backgroundColor: Colors.successBg,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     Colors.success + '44',
    padding:         14,
    marginBottom:    12,
    alignItems:      'center',
  },
  savedText: { color: Colors.success, fontWeight: '600' },

  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius:    8,
    padding:         14,
    alignItems:      'center',
    marginBottom:    14,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  infoRowLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 10 },
  infoRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:    8,
  },
  infoKey: { fontSize: 13, color: Colors.textMuted },
  infoVal: { fontSize: 13, fontWeight: '500', color: Colors.text },
});
