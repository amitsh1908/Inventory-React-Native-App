// src/screens/InventoryScreen.js
import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import { getAllProducts } from '../db';

export default function InventoryScreen(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ (async ()=>{ setItems(await getAllProducts()); })(); }, []);
  return (
    <View style={{flex:1, padding:12}}>
      <FlatList
        data={items}
        keyExtractor={i=>String(i.id)}
        ListHeaderComponent={<Text style={{fontWeight:'700',fontSize:18}}>Inventory Items</Text>}
        renderItem={({item}) => (
          <View style={styles.row}>
            <View style={{flex:1}}>
              <Text style={{fontWeight:'600'}}>{item.name}</Text>
              <Text>Barcode: {item.barcode}</Text>
              <Text>Price: {item.price}  Qty: {item.quantity}</Text>
              <Text>Last Check-In: {item.last_checkin || '-'}</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <Text style={{fontWeight:'700'}}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  row:{padding:12, borderBottomWidth:1,borderColor:'#eee', flexDirection:'row'}
});