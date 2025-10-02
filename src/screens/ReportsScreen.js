// src/screens/ReportsScreen.js
import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Button, FlatList, Alert, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import { getLogs } from '../db';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ranges = {
  'Today': () => {
    const s = new Date(); s.setHours(0,0,0,0);
    const e = new Date(); e.setHours(23,59,59,999);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Yesterday': () => {
    const s = new Date(); s.setDate(s.getDate()-1); s.setHours(0,0,0,0);
    const e = new Date(); e.setDate(e.getDate()-1); e.setHours(23,59,59,999);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Last 7 Days': () => {
    const e = new Date(); const s = new Date(); s.setDate(e.getDate()-6); s.setHours(0,0,0,0);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Last 30 Days': () => {
    const e = new Date(); const s = new Date(); s.setDate(e.getDate()-29); s.setHours(0,0,0,0);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Last 3 Months': () => {
    const e = new Date(); const s = new Date(); s.setMonth(e.getMonth()-2); s.setDate(1); s.setHours(0,0,0,0);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Last 6 Months': () => {
    const e = new Date(); const s = new Date(); s.setMonth(e.getMonth()-5); s.setDate(1); s.setHours(0,0,0,0);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Last 1 Year': () => {
    const e = new Date(); const s = new Date(); s.setFullYear(e.getFullYear()-1); s.setMonth(0); s.setDate(1); s.setHours(0,0,0,0);
    return {start:s.toISOString(), end:e.toISOString()};
  }
};

export default function ReportsScreen(){
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [rangeKey, setRangeKey] = useState('Today');
  const [typeFilter, setTypeFilter] = useState('Both');

  const load = useCallback(async () => {
    const r = ranges[rangeKey]();
    const rows = await getLogs({startDate:r.start, endDate:r.end});
    setLogs(rows);
  }, [rangeKey]);

  useEffect(()=>{ load(); },[load]);

  useEffect(() => {
    let filtered = logs;
    if (typeFilter !== 'Both') {
      filtered = logs.filter(l => l.type === typeFilter);
    }
    setFilteredLogs(filtered);
  }, [logs, typeFilter]);

  const exportExcel = async () => {
    if(filteredLogs.length===0) return Alert.alert('No data to export');
    const data = filteredLogs.map(l=>({ ProductName:l.name, Price:l.price, Quantity:l.quantity, Time:l.time, TotalValue:l.total_value }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const wbout = XLSX.write(wb, {type:'base64', bookType:'xlsx'});
    const path = RNFS.DocumentDirectoryPath + `/report_${Date.now()}.xlsx`;
    await RNFS.writeFile(path, wbout, 'base64');
    Alert.alert('Excel Exported', 'Saved to: ' + path);
  };

  const exportPDF = async () => {
    if(filteredLogs.length===0) return Alert.alert('No data to export');
    let html = `<h1>Report (${rangeKey})</h1><table border="1" cellpadding="5"><tr><th>Product Name</th><th>Price</th><th>Quantity</th><th>Time</th><th>Total Value</th></tr>`;
    filteredLogs.forEach(r=> { html += `<tr><td>${r.name}</td><td>${r.price}</td><td>${r.quantity}</td><td>${r.time}</td><td>${r.total_value}</td></tr>`; });
    html += '</table>';
    const path = RNFS.DocumentDirectoryPath + `/report_${Date.now()}.html`;
    await RNFS.writeFile(path, html, 'utf8');
    Alert.alert('HTML Report Saved', 'Saved to: ' + path);
  };

  // Prepare chart data
  const monthlyData = {};
  const productSales = {};
  const inventoryValue = {};

  filteredLogs.forEach(log => {
    const month = new Date(log.time).toISOString().slice(0,7); // YYYY-MM
    if (!monthlyData[month]) monthlyData[month] = {IN:0, OUT:0};
    monthlyData[month][log.type] += log.quantity;

    if (log.type === 'OUT') {
      if (!productSales[log.name]) productSales[log.name] = 0;
      productSales[log.name] += log.quantity;
    }

    if (!inventoryValue[log.name]) inventoryValue[log.name] = 0;
    inventoryValue[log.name] += log.total_value;
  });

  const lineData = {
    labels: Object.keys(monthlyData).sort(),
    datasets: [
      { data: Object.values(monthlyData).map(d => d.IN), color: () => 'green', strokeWidth: 2 },
      { data: Object.values(monthlyData).map(d => d.OUT), color: () => 'red', strokeWidth: 2 }
    ],
    legend: ['Check-In', 'Check-Out']
  };

  const barData = {
    labels: Object.keys(productSales).slice(0,5), // Top 5
    datasets: [{ data: Object.values(productSales).slice(0,5) }]
  };

  const pieData = Object.keys(inventoryValue).slice(0,5).map(name => ({ name, value: inventoryValue[name], color: '#' + Math.floor(Math.random()*16777215).toString(16), legendFontColor: '#7F7F7F', legendFontSize: 15 }));

  return (
    <ScrollView style={{flex:1,padding:16, backgroundColor:'#f5f5f5'}}>
      <Text style={{fontSize:18, fontWeight:'bold', marginBottom:12}}>Reports & Analytics</Text>

      <View style={{marginBottom:12}}>
        <Text>Type:</Text>
        <View style={{flexDirection:'row', justifyContent:'space-around'}}>
          {['IN', 'OUT', 'Both'].map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => setTypeFilter(type)}
              style={{
                backgroundColor: typeFilter === type ? '#2196F3' : 'transparent',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2196F3',
                margin: 4,
              }}
            >
              <Text style={{color: typeFilter === type ? 'white' : '#2196F3', fontWeight: 'bold'}}>
                {type === 'IN' ? 'Check-In' : type === 'OUT' ? 'Check-Out' : 'Both'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{marginBottom:12}}>
        <Text>Date Range:</Text>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'].map(key => (
            <TouchableOpacity
              key={key}
              onPress={() => setRangeKey(key)}
              style={{
                backgroundColor: rangeKey === key ? '#2196F3' : 'transparent',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2196F3',
                margin: 4,
              }}
            >
              <Text style={{color: rangeKey === key ? 'white' : '#2196F3', fontWeight: 'bold'}}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button title="Reload" onPress={load} />

      <View style={{marginTop:12}}>
        <Text style={{fontWeight:'bold'}}>Data Table</Text>
        <View style={{flexDirection:'row', padding:8, backgroundColor:'#f0f0f0'}}>
          <Text style={{flex:1, fontWeight:'bold'}}>Product Name</Text>
          <Text style={{flex:1, fontWeight:'bold'}}>Price</Text>
          <Text style={{flex:1, fontWeight:'bold'}}>Quantity</Text>
          <Text style={{flex:1, fontWeight:'bold'}}>Time</Text>
          <Text style={{flex:1, fontWeight:'bold'}}>Total Value</Text>
        </View>
        <FlatList data={filteredLogs} keyExtractor={i=>String(i.id)} renderItem={({item})=>(
          <View style={{flexDirection:'row', padding:8, borderBottomWidth:1, borderColor:'#eee'}}>
            <Text style={{flex:1}}>{item.name}</Text>
            <Text style={{flex:1}}>{item.price}</Text>
            <Text style={{flex:1}}>{item.quantity}</Text>
            <Text style={{flex:1}}>{item.time}</Text>
            <Text style={{flex:1}}>{item.total_value}</Text>
          </View>
        )}/>
      </View>

      {filteredLogs.length > 0 && (
        <View style={{marginTop:12}}>
          <Text style={{fontWeight:'bold'}}>Charts</Text>
          <Text>Monthly Check-In vs Check-Out</Text>
          <LineChart data={lineData} width={screenWidth-24} height={220} chartConfig={{backgroundColor:'#ffffff', backgroundGradientFrom:'#ffffff', backgroundGradientTo:'#ffffff', decimalPlaces:0, color:(opacity=1)=>`rgba(0,0,0,${opacity})`}} bezier />

          <Text>Top-Selling Products</Text>
          <BarChart data={barData} width={screenWidth-24} height={220} chartConfig={{backgroundColor:'#ffffff', backgroundGradientFrom:'#ffffff', backgroundGradientTo:'#ffffff', decimalPlaces:0, color:(opacity=1)=>`rgba(0,0,255,${opacity})`}} />

          <Text>Inventory Value Distribution</Text>
          <PieChart data={pieData} width={screenWidth-24} height={220} chartConfig={{color:(opacity=1)=>`rgba(0,0,0,${opacity})`}} accessor="value" backgroundColor="transparent" />
        </View>
      )}

      <View style={{marginTop:12, flexDirection:'row', justifyContent:'space-around'}}>
        <View style={{margin:4}}><Button title="Export Excel" onPress={exportExcel} /></View>
        <View style={{margin:4}}><Button title="Export PDF" onPress={exportPDF} /></View>
      </View>
    </ScrollView>
  )
}
