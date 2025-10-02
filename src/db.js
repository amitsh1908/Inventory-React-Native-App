// src/db.js
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DB_NAME = 'inventory.db';
const DB_LOCATION = 'default';

let db;

export async function initDB() {
  db = await SQLite.openDatabase({name: DB_NAME, location: DB_LOCATION});
  await db.executeSql(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barcode TEXT UNIQUE,
    name TEXT,
    price REAL,
    quantity INTEGER DEFAULT 0,
    last_checkin TEXT,
    last_checkout TEXT
  );`);

  await db.executeSql(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    barcode TEXT,
    name TEXT,
    price REAL,
    quantity INTEGER,
    type TEXT,
    time TEXT,
    total_value REAL
  );`);
  return db;
}

export async function addOrUpdateProduct({barcode, name, price, qty, type}) {
  const time = new Date().toISOString();
  const total = price * qty;
  let [res] = await db.executeSql(`SELECT id,quantity FROM products WHERE barcode=?`, [barcode]);
  if(res.rows.length === 0){
    const p = await db.executeSql(
      `INSERT INTO products (barcode,name,price,quantity, last_checkin, last_checkout) VALUES (?,?,?,?,?,?)`,
      [barcode, name, price, (type==='IN'? qty: 0), (type==='IN'?time:null), (type==='OUT'?time:null)]
    );
    const productId = p[0].insertId;
    await db.executeSql(`INSERT INTO logs (product_id,barcode,name,price,quantity,type,time,total_value) VALUES (?,?,?,?,?,?,?)`,
      [productId,barcode,name,price,qty,type,time,total]);
  } else {
    const existing = res.rows.item(0);
    let newQty = existing.quantity + (type==='IN'? qty: -qty);
    if(newQty < 0) newQty = 0;
    await db.executeSql(`UPDATE products SET quantity=?, price=?, ${type==='IN'?'last_checkin':'last_checkout'}=? WHERE id=?`, [newQty, price, time, existing.id]);
    await db.executeSql(`INSERT INTO logs (product_id,barcode,name,price,quantity,type,time,total_value) VALUES (?,?,?,?,?,?,?)`,
      [existing.id,barcode,name,price,qty,type,time,price*qty]);
  }
}

export async function getAllProducts() {
  const [res] = await db.executeSql(`SELECT * FROM products ORDER BY name`);
  const rows = [];
  for(let i=0;i<res.rows.length;i++) rows.push(res.rows.item(i));
  return rows;
}

export async function getLogs({type=null, startDate=null, endDate=null} = {}) {
  let query = 'SELECT * FROM logs WHERE 1=1';
  const params = [];
  if(type) { query += ' AND type = ?'; params.push(type); }
  if(startDate) { query += ' AND time >= ?'; params.push(startDate); }
  if(endDate) { query += ' AND time <= ?'; params.push(endDate); }
  query += ' ORDER BY time DESC';
  const [res] = await db.executeSql(query, params);
  const rows = [];
  for(let i=0;i<res.rows.length;i++) rows.push(res.rows.item(i));
  return rows;
}

export default { initDB, addOrUpdateProduct, getAllProducts, getLogs };