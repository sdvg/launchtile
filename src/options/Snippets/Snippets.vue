<script>
  import Sidebar from './Sidebar'
  import Details from './Details'
  import { SNIPPETS } from '@/storageKeys'

  export default {
    components: {
      Sidebar,
      Details,
    },
    data () {
      return {
        snippets: [],
        activeSnippet: null,
      }
    },
    async created () {
      const { [SNIPPETS]: snippets } = await browser.storage.sync.get(SNIPPETS)

      this.snippets = snippets || []

      if (this.snippets.length) {
        this.openSnippet(this.snippets[0])
      }
    },
    methods: {
      newSnippet () {
        const newSnippet = {
          title: `Snippet #${this.snippets.length + 1}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          code: ``,
        }

        this.snippets.push(newSnippet)
        this.activeSnippet = newSnippet

        browser.storage.sync.set({ [SNIPPETS]: this.snippets })
      },
      openSnippet (snippet) {
        this.activeSnippet = snippet
      },
    },
  }
</script>

<template>
  <div :class="$style.root">
    <Sidebar
      :class="$style.sidebar"
      :snippets="snippets"
      :activeSnippet="activeSnippet"
      @newSnippet="newSnippet"
      @openSnippet="openSnippet"
    />
    <Details
      v-if="activeSnippet"
      :class="$style.details"
      :activeSnippet="activeSnippet"
    />
  </div>
</template>

<style module>
  .root {
    height: 400px;
    display: flex;
  }

  .sidebar {
    width: 230px;
  }

  .details {
    flex-grow: 1;
  }
</style>
