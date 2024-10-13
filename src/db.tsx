import { openDB } from 'idb';

interface OfflineData {
  id?: number; // IndexedDB puede auto incrementar el id
  key: string; // Clave única para identificar los datos
  value: string;
  timestamp: number;
}

const DB_NAME = 'offline-db';
const STORE_NAME = 'offline-data';

// Inicializa la base de datos con IndexedDB
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      store.createIndex('key', 'key', { unique: true });
    },
  });
};

// Guarda los datos offline con una clave única
export const saveDataOffline = async (data: OfflineData) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.put(data); // put reemplaza si ya existe la clave
  await tx.done;
};

// Recupera los datos guardados usando la clave
export const getOfflineData = async (key: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, key);
};

// Limpia todos los datos almacenados en la base de datos offline
export const clearOfflineData = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.store.clear();
  await tx.done;
};
