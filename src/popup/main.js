import Vue from 'vue'
import Popup from './Popup'
import '@/global.css'
import { getOptions } from '@/lib/options'

(async () => {
  const options = await getOptions()
  console.log(options)

  /* eslint-disable no-new */
  new Vue({
    el: `#app`,
    render: h => h(Popup, {
      props: {
        options,
      },
    }),
  })
})()
