const CHROME = `chrome`
const FIREFOX = `firefox`
const browser = process.env.VUE_APP_BROWSER

export const isChrome = () => browser === CHROME
export const isFirefox = () => browser === FIREFOX
