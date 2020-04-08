import Vue from 'vue'
import Options from './Options.vue'
import '@/global.css'

/* eslint-disable no-new */
new Vue({
  el: `#app`,
  render: h => h(Options),
})

if (process.env.NODE_ENV === `development`) {
  window.browser = browser
}
