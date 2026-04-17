import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

type Priority = 'alta' | 'media' | 'baixa';
type Status = 'aberto' | 'em_andamento' | 'resolvido';

const priorityConfig: Record<Priority, { icon: string; bg: string }> = {
  alta:  { icon: '🔴', bg: '#FFE5E5' },
  media: { icon: '🟡', bg: '#FFF3E0' },
  baixa: { icon: '🟢', bg: '#E8F5E9' },
};

const statusConfig: Record<Status, { label: string; color: string; bg: string }> = {
  aberto:       { label: 'Aberto',       color: '#1565C0', bg: '#E3F2FD' },
  em_andamento: { label: 'Em andamento', color: '#F57F17', bg: '#FFF8E1' },
  resolvido:    { label: 'Resolvido',    color: '#2E7D32', bg: '#E8F5E9' },
};

export default function TicketListScreen({ navigation }: any) {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(data);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const priority = priorityConfig[item.priority as Priority] ?? { icon: '⚪', bg: '#F2F2F7' };
    const status = statusConfig[item.status as Status] ?? { label: item.status, color: item.color, bg: '#F2F2F7' };
    const isLast = index === tickets.length - 1;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Detail', { ticket: item })}
        style={[styles.card, !isLast && styles.cardBorder]}
      >
        <View style={[styles.iconWrap, { backgroundColor: priority.bg }]}>
          <Text style={styles.iconText}>{priority.icon}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.meta}>
            {item.priority} prioridade
          </Text>
        </View>

        <View style={styles.cardRight}>
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chamados</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('Create')}
        >
          <Text style={styles.newButtonText}>+ Novo</Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#000',
  },
  newButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  listContent: {
    flexGrow: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  cardBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  cardBody: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 3,
  },
  meta: {
    fontSize: 12,
    color: '#8E8E93',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    color: '#C7C7CC',
  },
});