import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

type Status = 'open' | 'in_progress' | 'done';
type Priority = 'low' | 'medium' | 'high';

const statusConfig: Record<Status, { label: string; icon: string; color: string; bg: string }> = {
  open:        { label: 'Aberto',       icon: '🔵', color: '#1565C0', bg: '#E3F2FD' },
  in_progress: { label: 'Em andamento', icon: '🟡', color: '#F57F17', bg: '#FFF8E1' },
  done:        { label: 'Resolvido',    icon: '🟢', color: '#2E7D32', bg: '#E8F5E9' },
};

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  low:    { label: 'Baixa', color: '#2E7D32', bg: '#E8F5E9' },
  medium: { label: 'Média', color: '#F57F17', bg: '#FFF8E1' },
  high:   { label: 'Alta',  color: '#C62828', bg: '#FFE5E5' },
};

const statusFlow: { key: Status; label: string }[] = [
  { key: 'open',        label: 'Reabrir' },
  { key: 'in_progress', label: 'Em andamento' },
  { key: 'done',        label: 'Resolvido' },
];

export default function TicketDetailScreen({ route, navigation }: any) {
  const { ticket } = route.params;
  const [status, setStatus] = useState<Status>(ticket.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: Status) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'tickets', ticket.id), {
        status: newStatus,
        updatedAt: Date.now(),
      });
      setStatus(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = statusConfig[status];
  const currentPriority = priorityConfig[ticket.priority as Priority] ?? {
    label: ticket.priority, color: '#8E8E93', bg: '#F2F2F7',
  };

  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chamado</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Card principal */}
        <View style={styles.card}>
          <Text style={styles.description}>{ticket.description}</Text>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Prioridade</Text>
            <View style={[styles.badge, { backgroundColor: currentPriority.bg }]}>
              <Text style={[styles.badgeText, { color: currentPriority.color }]}>
                {currentPriority.label}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status</Text>
            <View style={[styles.badge, { backgroundColor: currentStatus.bg }]}>
              <Text style={styles.statusIcon}>{currentStatus.icon}</Text>
              <Text style={[styles.badgeText, { color: currentStatus.color }]}>
                {currentStatus.label}
              </Text>
            </View>
          </View>

          {formattedDate && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Criado em</Text>
              <Text style={styles.metaValue}>{formattedDate}</Text>
            </View>
          )}
        </View>

        {/* Alterar status */}
        <Text style={styles.sectionLabel}>ALTERAR STATUS</Text>
        <View style={styles.actionGroup}>
          {statusFlow.map(({ key, label }, index) => {
            const isActive = status === key;
            const isLast = index === statusFlow.length - 1;
            const config = statusConfig[key];

            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.7}
                disabled={loading || isActive}
                onPress={() => updateStatus(key)}
                style={[
                  styles.actionRow,
                  !isLast && styles.actionBorder,
                  isActive && { backgroundColor: config.bg },
                ]}
              >
                <Text style={styles.actionIcon}>{config.icon}</Text>
                <Text style={[
                  styles.actionLabel,
                  isActive && { color: config.color, fontWeight: '600' },
                  (!isActive && loading) && { color: '#C7C7CC' },
                ]}>
                  {label}
                </Text>
                {isActive
                  ? <Text style={[styles.checkmark, { color: config.color }]}>✓</Text>
                  : loading
                    ? <ActivityIndicator size="small" color="#C7C7CC" />
                    : <Text style={styles.chevron}>›</Text>
                }
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
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
    marginBottom: 24,
  },
  backBtn: {
    fontSize: 17,
    color: '#007AFF',
    width: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    lineHeight: 24,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  metaLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  metaValue: {
    fontSize: 14,
    color: '#000',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusIcon: {
    fontSize: 11,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginLeft: 4,
  },
  actionGroup: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  actionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  actionIcon: {
    fontSize: 16,
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 18,
    color: '#C7C7CC',
  },
});

