import React, { useState } from 'react';
import {View, Alert, Text, Button, StyleSheet, TextInput} from 'react-native';
import BarcodeScanner from '../components/BarcodeScanner';
import { addOrUpdateProduct, getAllProducts } from '../db';

export default function CheckOutScreen({navigation}) {
  const [scanning, setScanning] = useState(true);
  const [barcode, setBarcode] = useState('');
  const [message, setMessage] = useState('');
  const [qty, setQty] = useState('1');
  const [product, setProduct] = useState(null);

  const onScanned = async (value) => {
    if (!value) return;
    setScanning(false);
    const cleanedValue = value.toString().replace(/\s/g, '');
    setBarcode(cleanedValue);
    const prods = await getAllProducts();
    const p = prods.find(x => x.barcode.replace(/\s/g, '') === cleanedValue);
    if(p){
      setProduct(p);
      setMessage(`Product found: ${p.name}. Enter quantity and press Check-Out.`);
    } else {
      setProduct(null);
      setMessage('Product not found. Please scan a valid product barcode.');
    }
  };

  const onCheckOut = async () => {
    try {
      if(!product) {
        setMessage('No product selected. Please scan a valid product barcode first.');
        return;
      }
      const quantity = parseInt(qty, 10);
      if(isNaN(quantity) || quantity <= 0) {
        setMessage('Invalid quantity. Please enter a valid quantity greater than zero.');
        return;
      }
      await addOrUpdateProduct({ barcode: barcode, name: product.name, price: product.price, qty: quantity, type:'OUT' });
      setMessage(`Checked Out successfully: ${product.name}, Quantity: ${quantity}`);
      setTimeout(() => {
        setScanning(true);
        setBarcode('');
        setMessage('');
        setQty('1');
        setProduct(null);
      }, 2000);
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <View style={{flex:1}}>
      <View style={{height:300}}>
        {scanning ? <BarcodeScanner onScanned={onScanned} active={scanning} /> : <View style={styles.messageBox}><Text>{message || '---'}</Text></View>}
      </View>
      {!scanning && product && (
        <View style={{padding:16}}>
          <Text>Barcode: {barcode}</Text>
          <Text>Product Name: {product.name}</Text>
          <Text>Price: {product.price}</Text>
          <Text>Quantity to Check-Out</Text>
          <TextInput
            keyboardType="numeric"
            value={qty}
            onChangeText={setQty}
            style={styles.input}
          />
          <Button title="Check-Out" onPress={onCheckOut} />
          <View style={{height:8}} />
          <Button title="Scan Again" onPress={() => {
            setScanning(true);
            setBarcode('');
            setMessage('');
            setQty('1');
            setProduct(null);
          }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageBox: {flex:1, alignItems:'center', justifyContent:'center'},
  input: {borderWidth:1, borderColor:'#ddd', padding:8, marginBottom:12, borderRadius:6}
});
