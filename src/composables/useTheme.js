import { getOptions } from '@/lib/options'
import { watch } from 'vue'
import getThemeByOptionOrPreference from '@/lib/getThemeByOptionOrPreference'

export default async () => {
  const options = (await getOptions())

  watch(options, () => {
    document.documentElement.dataset.theme = getThemeByOptionOrPreference(options.value.theme)
  }, { immediate: true })
}
