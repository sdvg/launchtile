import Vue from 'vue'
import Options from './Options.vue'
import '@/global.css'
import VueRouter from 'vue-router'
import SectionGeneral from '@/options/SectionGeneral/SectionGeneral'
import SectionSnippets from '@/options/SectionSnippets/SectionSnippets'
import RouteNames from '@/options/constants/RouteNames'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      name: RouteNames.General,
      path: `/`,
      component: SectionGeneral,
    },
    {
      name: RouteNames.Snippets,
      path: `/snippets`,
      component: SectionSnippets,
    },
    {
      path: `*`,
      redirect: { name: RouteNames.General },
    },
  ],
})

/* eslint-disable no-new */
new Vue({
  el: `#app`,
  router,
  render: h => h(Options),
})
