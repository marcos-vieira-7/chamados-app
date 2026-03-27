import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';


export default function CreateTicketScreen({ navigation }: any) {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');

  const createTicket = async () => {
    if (!description) {
      alert('Digite uma descrição');
      return;
    }

    await addDoc(collection(db, 'tickets'), {
      description,
      priority,
      status: 'open',
      images: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Descrição</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 12 }}
      />

      <Text>Prioridade</Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {['low', 'medium', 'high'].map(p => (
          <TouchableOpacity key={p} onPress={() => setPriority(p as any)}>
            <Text
              style={{
                padding: 10,
                backgroundColor: priority === p ? 'blue' : 'gray',
                color: '#fff'
              }}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Criar Chamado" onPress={createTicket} />
    </View>
  );
}