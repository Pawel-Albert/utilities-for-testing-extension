import {UserScripts} from '../types/userScripts'
import {createIndexedDBService} from './indexedDB'

const db = createIndexedDBService({
  dbName: 'TesterUtilitiesDB',
  stores: ['settings', 'scripts']
})

export function createScriptsService() {
  async function saveToStorages(scripts: UserScripts): Promise<void> {
    await chrome.storage.sync.set({userScripts: scripts})
    await db.saveData('settings', 'currentScripts', scripts)
  }

  async function getScripts(): Promise<UserScripts> {
    try {
      const chromeScripts = (await chrome.storage.sync.get('userScripts')).userScripts
      if (chromeScripts) {
        await db.saveData('settings', 'currentScripts', chromeScripts)
        return chromeScripts
      }

      const dbScripts = await db.getData<UserScripts>('settings', 'currentScripts')
      if (Object.keys(dbScripts).length > 0) {
        await saveToStorages(dbScripts)
        return dbScripts
      }

      return {}
    } catch (error) {
      console.error('Error loading scripts:', error)
      return {}
    }
  }

  async function debugStorage(): Promise<void> {
    console.group('Storage Debug Info')
    const chromeScripts = await chrome.storage.sync.get('userScripts')
    console.log('Chrome Storage:', chromeScripts)
    const dbScripts = await db.getData('settings', 'currentScripts')
    console.log('IndexedDB Storage:', dbScripts)
    console.groupEnd()
  }

  return {
    saveToStorages,
    getScripts,
    debugStorage
  }
}
