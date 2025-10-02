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
  const [message, setMessage] = useState('');

  const onScanned = async (value) => {
    setScanning(false);
    const trimmedValue = value.trim();
    setBarcode(trimmedValue);
    const prods = await getAllProducts();
    const p = prods.find(x => x.barcode.trim() === trimmedValue);
    if(p){ setName(p.name); setPrice(String(p.price)); }
    else { setName(''); setPrice(''); }
  };

  const onCheckIn = async () => {
    try {
      if(!barcode || !name || !price || !qty) return setMessage('Please fill all fields');
      await addOrUpdateProduct({ barcode, name, price: parseFloat(price), qty: parseInt(qty,10), type:'IN' });
      setMessage('Checked In successfully. Product added.');
      setTimeout(() => {
        setBarcode('');
        setName('');
        setPrice('');
        setQty('1');
        setScanning(true);
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <View style={{flex:1}}>
      <View style={{height:300}}>
        {scanning ? <BarcodeScanner onScanned={onScanned} active={scanning} /> : <View style={styles.scannedBox}><Text>Scanned: {barcode || '---'}</Text></View>}
      </View>
      <View style={{padding:16}}>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Text>Barcode</Text>
        <View style={{flexDirection:'row'}}>
          <TextInput value={barcode} onChangeText={setBarcode} style={[styles.input, {flex:1}]} />
          <View style={{width:8}} />
          <Button title="Generate" onPress={() => setBarcode(Math.random().toString(36).substr(2, 9).toUpperCase())} />
        </View>
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
  scannedBox:{flex:1,alignItems:'center',justifyContent:'center'},
  message:{color:'red', textAlign:'center', marginTop:8, fontSize:16, fontWeight:'bold'}
});
