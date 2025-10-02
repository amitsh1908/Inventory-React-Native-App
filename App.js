// App.js
import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './src/screens/MainScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import CheckOutScreen from './src/screens/CheckOutScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import { initDB } from './src/db';
import { Provider as PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App(){
  useEffect(()=>{ (async ()=>{ await initDB(); })(); },[]);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName=" " screenOptions={{headerShown:true}}>
          <Stack.Screen name=" " component={MainScreen} />
          <Stack.Screen name="CheckIn" component={CheckInScreen} options={{title:'Check-In'}} />
          <Stack.Screen name="CheckOut" component={CheckOutScreen} options={{title:'Check-Out'}} />
          <Stack.Screen name="Inventory" component={InventoryScreen} options={{title:'Inventory Items'}} />
          <Stack.Screen name="Reports" component={ReportsScreen} options={{title:'Reports & Analytics'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}