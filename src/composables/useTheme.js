import { getOptions } from '@/lib/options'
import * as Themes from '@/constants/themes'
import { watch } from 'vue'

export default async () => {
  const options = (await getOptions())

  watch(options, () => {
    const themeOption = options.value.theme

    document.documentElement.dataset.theme = themeOption === Themes.SYSTEM
      ? window.matchMedia(`(prefers-color-scheme: dark)`).matches ? Themes.DARK : Themes.LIGHT
      : themeOption
  }, { immediate: true })
}
