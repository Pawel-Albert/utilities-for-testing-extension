type DBConfig = {
  dbName: string
  stores: string[]
}

export function createIndexedDBService(config: DBConfig) {
  async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.dbName, 1)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result
        config.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store)
          }
        })
      }
    })
  }

  async function getData<T>(storeName: string, key: string): Promise<T> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || {})
    })
  }

  async function saveData<T>(storeName: string, key: string, data: T): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data, key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async function debugStorage(): Promise<void> {
    console.group('IndexedDB Debug Info')
    try {
      const db = await openDB()
      const stores = Array.from(db.objectStoreNames)
      for (const store of stores) {
        const data = await getData(store, 'currentScripts')
        console.log(`Store (${store}):`, data)
      }
    } catch (error) {
      console.error('Debug error:', error)
    }
    console.groupEnd()
  }

  return {
    getData,
    saveData,
    debugStorage
  }
}
