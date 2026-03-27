import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './src/services/firebase';
import AppNavigator from './src/navigation/AppNavigator';


export default function App() {

  return <AppNavigator />;
  
}