// src/screens/InventoryScreen.js
import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity, Modal} from 'react-native';
import {DataTable} from 'react-native-paper';
import { getAllProducts } from '../db';

export default function InventoryScreen(){
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      setItems(await getAllProducts());
    })();
  }, []);

  const filteredItems = items.filter(item => {
    const searchLower = searchText.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchLower) || (item.barcode && item.barcode.toLowerCase().includes(searchLower));
    let matchesFilter = true;
    if(filterType === 'inStock') matchesFilter = item.quantity > 0;
    else if(filterType === 'outOfStock') matchesFilter = item.quantity === 0;
    return matchesSearch && matchesFilter;
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Inventory Items</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or barcode"
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.picker} onPress={() => setModalVisible(true)}>
        <Text>{filterType === 'all' ? 'All' : filterType === 'inStock' ? 'In Stock' : 'Out of Stock'}</Text>
      </TouchableOpacity>
      <DataTable.Header>
        <DataTable.Title>ID</DataTable.Title>
        <DataTable.Title>Name</DataTable.Title>
        <DataTable.Title numeric>Price</DataTable.Title>
        <DataTable.Title numeric>Quantity</DataTable.Title>
        <DataTable.Title>Last Check-In</DataTable.Title>
        <DataTable.Title>Last Check-Out</DataTable.Title>
        <DataTable.Title numeric>Total Value</DataTable.Title>
      </DataTable.Header>
    </View>
  );

  const renderItem = ({item}) => (
    <DataTable.Row>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.name}</DataTable.Cell>
      <DataTable.Cell numeric>₹{item.price.toFixed(2)}</DataTable.Cell>
      <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
      <DataTable.Cell>{item.last_checkin || '-'}</DataTable.Cell>
      <DataTable.Cell>{item.last_checkout || '-'}</DataTable.Cell>
      <DataTable.Cell numeric>₹{(item.price * item.quantity).toFixed(2)}</DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <View style={{flex:1, padding:12}}>
      <FlatList
        data={filteredItems}
        keyExtractor={i => String(i.id)}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => {setFilterType('all'); setModalVisible(false);}} style={styles.modalItem}>
              <Text>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setFilterType('inStock'); setModalVisible(false);}} style={styles.modalItem}>
              <Text>In Stock</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setFilterType('outOfStock'); setModalVisible(false);}} style={styles.modalItem}>
              <Text>Out of Stock</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#fff',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  picker: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

});
