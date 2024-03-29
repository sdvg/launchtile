import { v4 as uuidv4 } from 'uuid'

const storageApi = browser.storage.local

const createCollectionItem = async (storageKey, values) => {
  const id = `${storageKey}_${uuidv4()}`
  const item = {
    id,
    ...values,
  }

  await storageApi.set({ [id]: item })

  return item
}

const queryCollectionItemsByStorageKey = async storageKey => {
  const allItems = await storageApi.get()

  return Object.values(allItems).filter(item => item.id && item.id.startsWith(storageKey))
}

const updateItem = item => {
  const plainItem = JSON.parse(JSON.stringify(item)) // required for Firefox storage

  return storageApi.set({ [item.id]: plainItem })
}

const removeItem = id => {
  return storageApi.remove([id])
}

export {
  storageApi,
  createCollectionItem,
  queryCollectionItemsByStorageKey,
  updateItem,
  removeItem,
}
