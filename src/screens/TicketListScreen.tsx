import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';


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

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Novo Chamado" onPress={() => navigation.navigate('Create')} />

      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => navigation.navigate('Detail', { ticket: item })}>
                <View
                style={{
                    padding: 12,
                    borderWidth: 1,
                    marginTop: 10,
                    borderRadius: 8
                }}>
                <Text>{item.description}</Text>
                <Text>Prioridade: {item.priority}</Text>
                <Text>Status: {item.status}</Text>
                </View>
            </TouchableOpacity>
        )}
      />
    </View>
  );
}