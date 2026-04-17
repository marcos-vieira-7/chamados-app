import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';

type Priority = 'low' | 'medium' | 'high';

const priorityConfig: Record<Priority, { label: string; icon: string; color: string; bg: string; selectedBg: string }> = {
  low:    { label: 'Baixa',  icon: '🟢', color: '#2E7D32', bg: '#F2F2F7', selectedBg: '#E8F5E9' },
  medium: { label: 'Média',  icon: '🟡', color: '#F57F17', bg: '#F2F2F7', selectedBg: '#FFF8E1' },
  high:   { label: 'Alta',   icon: '🔴', color: '#C62828', bg: '#F2F2F7', selectedBg: '#FFE5E5' },
};

export default function CreateTicketScreen({ navigation }: any) {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('low');

  const createTicket = async () => {
    if (!description.trim()) {
      alert('Digite uma descrição');
      return;
    }

    await addDoc(collection(db, 'tickets'), {
      description,
      priority,
      status: 'open',
      images: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>‹ Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Novo Chamado</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Seção descrição */}
          <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
          <View style={styles.inputCard}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o problema..."
              placeholderTextColor="#C7C7CC"
              multiline
              style={styles.textInput}
            />
          </View>

          {/* Seção prioridade */}
          <Text style={styles.sectionLabel}>PRIORIDADE</Text>
          <View style={styles.priorityGroup}>
            {(Object.keys(priorityConfig) as Priority[]).map((p, index) => {
              const config = priorityConfig[p];
              const isSelected = priority === p;
              const isLast = index === Object.keys(priorityConfig).length - 1;

              return (
                <TouchableOpacity
                  key={p}
                  activeOpacity={0.7}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.priorityRow,
                    !isLast && styles.priorityBorder,
                    isSelected && { backgroundColor: config.selectedBg },
                  ]}
                >
                  <Text style={styles.priorityIcon}>{config.icon}</Text>
                  <Text style={[styles.priorityLabel, isSelected && { color: config.color, fontWeight: '600' }]}>
                    {config.label}
                  </Text>
                  {isSelected && <Text style={[styles.checkmark, { color: config.color }]}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botão criar */}
          <TouchableOpacity style={styles.createBtn} onPress={createTicket} activeOpacity={0.85}>
            <Text style={styles.createBtnText}>Criar Chamado</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  backBtn: {
    fontSize: 17,
    color: '#007AFF',
    width: 60,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    letterSpacing: -0.3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },
  textInput: {
    fontSize: 15,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priorityGroup: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 32,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  priorityBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  priorityIcon: {
    fontSize: 16,
  },
  priorityLabel: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '600',
  },
  createBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
