import { v4 as uuidv4 } from 'uuid'

const storageApi = browser.storage.local

const createItem = async (storageKey, values) => {
  const id = `${storageKey}_${uuidv4()}`
  const item = {
    id,
    ...values,
  }

  await storageApi.set({ [id]: item })

  return item
}

const queryItemsByStorageKey = async storageKey => {
  const allItems = await storageApi.get()

  return Object.values(allItems).filter(item => item.id && item.id.startsWith(storageKey))
}

const updateItem = item => {
  return storageApi.set({ [item.id]: item })
}

const removeItem = id => {
  return storageApi.remove([id])
}

export {
  createItem,
  queryItemsByStorageKey,
  updateItem,
  removeItem,
}
