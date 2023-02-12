import * as Themes from '@/constants/themes'

export default themeOption => {
  return themeOption === Themes.SYSTEM
    ? window.matchMedia(`(prefers-color-scheme: dark)`).matches ? Themes.DARK : Themes.LIGHT
    : themeOption
}
