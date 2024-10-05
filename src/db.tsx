interface OfflineData {
  id?: number; // IndexedDB puede auto incrementar el id
  value: string;
  timestamp: number;
}

import { openDB } from 'idb';

const DB_NAME = 'offline-db';
const STORE_NAME = 'offline-data';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
};

// Cambia 'any' por el tipo 'OfflineData'
export const saveDataOffline = async (data: OfflineData) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.store.add(data);
  await tx.done;
};

export const getOfflineData = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearOfflineData = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.store.clear();
  await tx.done;
};
