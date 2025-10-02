// src/screens/CheckInScreen.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import BarcodeScanner from '../components/BarcodeScanner';
import { addOrUpdateProduct, getAllProducts } from '../db';

export default function CheckInScreen({navigation}) {
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('1');
  const [scanning, setScanning] = useState(true);

  const onScanned = async (value) => {
    setScanning(false);
    setBarcode(value);
    const prods = await getAllProducts();
    const p = prods.find(x=>x.barcode===value);
    if(p){ setName(p.name); setPrice(String(p.price)); }
    else { setName(''); setPrice(''); }
  };

  const onCheckIn = async () => {
    if(!barcode || !name || !price || !qty) return Alert.alert('Please fill all fields');
    await addOrUpdateProduct({ barcode, name, price: parseFloat(price), qty: parseInt(qty,10), type:'IN' });
    Alert.alert('Checked In');
    navigation.goBack();
  };

  return (
    <View style={{flex:1}}>
      <View style={{height:300}}>
        {scanning ? <BarcodeScanner onScanned={onScanned} active={scanning} /> : <View style={styles.scannedBox}><Text>Scanned: {barcode || '---'}</Text></View>}
      </View>
      <View style={{padding:16}}>
        <Text>Barcode</Text>
        <TextInput value={barcode} onChangeText={setBarcode} style={styles.input} />
        <Text>Product Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />
        <Text>Price</Text>
        <TextInput keyboardType="numeric" value={price} onChangeText={setPrice} style={styles.input} />
        <Text>Quantity</Text>
        <TextInput keyboardType="numeric" value={qty} onChangeText={setQty} style={styles.input} />
        <Button title="Check-In" onPress={onCheckIn} />
        <View style={{height:8}} />
        <Button title="Scan Again" onPress={()=>setScanning(true)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input:{borderWidth:1,borderColor:'#ddd',padding:8,marginBottom:12,borderRadius:6},
  scannedBox:{flex:1,alignItems:'center',justifyContent:'center'}
});