import * as StorageKeys from '@/constants/storageKeys'
import { ref } from 'vue'
import { storageApi } from '@/lib/storage'
import * as Themes from '@/constants/themes'

const OptionKeys = {
  THEME: `theme`,
  ALLOW_FAVICONS: `allowFavicons`,
}

const defaultOptions = {
  [OptionKeys.THEME]: Themes.SYSTEM,
  [OptionKeys.ALLOW_FAVICONS]: false,
}
const options = ref(null)
const getOptions = async () => {
  if (!options.value) {
    storageApi.onChanged.addListener((changes) => {
      if (changes[StorageKeys.OPTIONS]?.newValue) {
        const changedOptions = changes[StorageKeys.OPTIONS].newValue ?? {}

        options.value = {
          ...defaultOptions,
          ...changedOptions,
        }
      }
    })

    const storedOptions = (await storageApi.get(StorageKeys.OPTIONS))[StorageKeys.OPTIONS] ?? {}

    options.value = {
      ...defaultOptions,
      ...storedOptions,
    }
  }

  return options
}

const setOption = async (key, value) => {
  const options = await getOptions()

  await storageApi.set({
    [StorageKeys.OPTIONS]: {
      ...options.value,
      [key]: value,
    },
  })
}

export {
  OptionKeys,
  setOption,
  getOptions,
}
