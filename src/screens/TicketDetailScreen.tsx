import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function TicketDetailScreen({ route, navigation }: any) {
  const { ticket } = route.params;
  const [status, setStatus] = useState(ticket.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: 'open' | 'in_progress' | 'done') => {
    try {
      setLoading(true);

      await updateDoc(doc(db, 'tickets', ticket.id), {
        status: newStatus,
        updatedAt: Date.now()
      });

      setStatus(newStatus);
      alert('Status atualizado!');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Descrição
      </Text>
      <Text>{ticket.description}</Text>

      <Text style={{ marginTop: 10 }}>
        Prioridade: {ticket.priority}
      </Text>

      <Text style={{ marginTop: 10 }}>
        Status atual: {status}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Marcar como EM ANDAMENTO"
          disabled={loading || status === 'in_progress'}
          onPress={() => updateStatus('in_progress')}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Marcar como RESOLVIDO"
          disabled={loading || status === 'done'}
          onPress={() => updateStatus('done')}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Reabrir (OPEN)"
          disabled={loading || status === 'open'}
          onPress={() => updateStatus('open')}
        />
      </View>
    </View>
  );
}