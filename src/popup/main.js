import Vue from 'vue'
import Popup from './Popup'
import '@/global.css'

/* eslint-disable no-new */
new Vue({
  el: `#app`,
  render: h => h(Popup),
})

if (process.env.NODE_ENV === `development`) {
  window.browser = browser
}
