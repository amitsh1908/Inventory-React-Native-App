// src/screens/MainScreen.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function MainScreen({navigation}){
  return (
    <View style={styles.container}>
      <View style={styles.btn}><Button title="Check-In" onPress={()=>navigation.navigate('CheckIn')} /></View>
      <View style={styles.btn}><Button title="Check-Out" onPress={()=>navigation.navigate('CheckOut')} /></View>
      <View style={styles.btn}><Button title="Inventory Items" onPress={()=>navigation.navigate('Inventory')} /></View>
      <View style={styles.btn}><Button title="Reports & Analytics" onPress={()=>navigation.navigate('Reports')} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20},
  btn:{marginVertical:8}
});