import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

export default function MainScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Inventory App</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.card, styles.checkIn]} onPress={() => navigation.navigate('CheckIn')}>
          <Text style={styles.icon}>📥</Text>
          <Text style={styles.title}>Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, styles.checkOut]} onPress={() => navigation.navigate('CheckOut')}>
          <Text style={styles.icon}>📤</Text>
          <Text style={styles.title}>Check-Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, styles.inventory]} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.icon}>📦</Text>
          <Text style={styles.title}>Inventory Items</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.card, styles.reports]} onPress={() => navigation.navigate('Reports')}>
          <Text style={styles.icon}>📊</Text>
          <Text style={styles.title}>Reports & Analytics</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007bff',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  card: {
    width: '45%',
    marginVertical: 12,
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  checkIn: {
    backgroundColor: '#e6f0ff',
  },
  checkOut: {
    backgroundColor: '#fff0f6',
  },
  inventory: {
    backgroundColor: '#e6fff2',
  },
  reports: {
    backgroundColor: '#fff7e6',
  },
});
