// src/screens/ReportsScreen.js
import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Button, FlatList, Alert} from 'react-native';
import { getLogs } from '../db';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const ranges = {
  'Today': () => {
    const s = new Date(); s.setHours(0,0,0,0);
    const e = new Date(); e.setHours(23,59,59,999);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Last 7 Days': () => {
    const e = new Date(); const s = new Date(); s.setDate(e.getDate()-6); s.setHours(0,0,0,0);
    return {start:s.toISOString(), end:e.toISOString()};
  },
  'Last 30 Days': () => {
    const e = new Date(); const s = new Date(); s.setDate(e.getDate()-29); s.setHours(0,0,0,0);
    return {start:s.toISOString(), end:e.toISOString()};
  }
};

export default function ReportsScreen(){
  const [logs, setLogs] = useState([]);
  const [rangeKey, setRangeKey] = useState('Today');

  const load = useCallback(async () => {
    const r = ranges[rangeKey]();
    const rows = await getLogs({startDate:r.start, endDate:r.end});
    setLogs(rows);
  }, [rangeKey]);

  useEffect(()=>{ load(); },[load]);

  const exportExcel = async () => {
    if(logs.length===0) return Alert.alert('No data to export');
    const data = logs.map(l=>({ ID:l.id, Product:l.name, Barcode:l.barcode, Price:l.price, Quantity:l.quantity, Type:l.type, Time:l.time, TotalValue:l.total_value }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    const wbout = XLSX.write(wb, {type:'binary', bookType:'xlsx'});
    const path = RNFS.DocumentDirectoryPath + `/report_${Date.now()}.xlsx`;
    await RNFS.writeFile(path, wbout, 'ascii');
    await Share.open({url:'file://' + path, title:'Exported Report'});
  };

  const exportPDF = async () => {
    if(logs.length===0) return Alert.alert('No data to export');
    let html = `<h1>Report (${rangeKey})</h1><table border="1" cellpadding="5"><tr><th>Product</th><th>Price</th><th>Qty</th><th>Type</th><th>Time</th><th>Total</th></tr>`;
    logs.forEach(r=> { html += `<tr><td>${r.name}</td><td>${r.price}</td><td>${r.quantity}</td><td>${r.type}</td><td>${r.time}</td><td>${r.total_value}</td></tr>`; });
    html += '</table>';
    const results = await RNHTMLtoPDF.convert({ html, fileName:`report_${Date.now()}`, base64:false });
    await Share.open({url:results.filePath});
  };

  return (
    <View style={{flex:1,padding:12}}>
      <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:12}}>
        <Button title="Today" onPress={()=>setRangeKey('Today')} />
        <Button title="Last 7 Days" onPress={()=>setRangeKey('Last 7 Days')} />
        <Button title="Last 30 Days" onPress={()=>setRangeKey('Last 30 Days')} />
        <Button title="Reload" onPress={load} />
      </View>
      <FlatList data={logs} keyExtractor={i=>String(i.id)} renderItem={({item})=>(
        <View style={{padding:8,borderBottomWidth:1,borderColor:'#eee'}}>
          <Text style={{fontWeight:'600'}}>{item.name}</Text>
          <Text>{item.type} — Qty: {item.quantity} — ₹{item.total_value} — {item.time}</Text>
        </View>
      )}/>
      <View style={{marginTop:12}}>
        <Button title="Export to Excel" onPress={exportExcel} />
        <View style={{height:8}}/>
        <Button title="Export to PDF" onPress={exportPDF} />
      </View>
    </View>
  )
}