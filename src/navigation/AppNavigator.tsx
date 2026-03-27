import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TicketListScreen from '../screens/TicketListScreen';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';


export type RootStackParamList = {
  List: undefined;
  Create: undefined;
  Detail: { ticket: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={TicketListScreen} />
        <Stack.Screen name="Create" component={CreateTicketScreen} />
        <Stack.Screen name="Detail" component={TicketDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}