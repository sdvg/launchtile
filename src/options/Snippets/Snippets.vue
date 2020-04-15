<script>
  import Sidebar from './Sidebar'
  import Details from './Details'
  import { SNIPPETS } from '@/storageKeys'
  import throttle from 'lodash/throttle'

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
    watch: {
      snippets () {
        this.throttledPersistSnippets()
      },
    },
    async created () {
      const { [SNIPPETS]: snippets } = await browser.storage.local.get(SNIPPETS)

      this.snippets = snippets || []

      if (this.snippets.length) {
        this.openSnippet(this.snippets[0])
      }

      window.addEventListener(`beforeunload`, this.persistSnippets)

      this.throttledPersistSnippets = throttle(this.persistSnippets, 5000)
    },
    destroyed () {
      this.persistSnippets()
      window.removeEventListener(`beforeunload`, this.persistSnippets)
    },
    methods: {
      async persistSnippets () {
        try {
          await browser.storage.local.set({ [SNIPPETS]: this.snippets })
        } catch (error) {
          console.error(error)
          alert(`Error saving the snippet: ${error.message}`)
        }
      },
      newSnippet () {
        const newSnippet = {
          title: `Snippet #${this.snippets.length + 1}`,
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          content: ``,
        }

        this.snippets.push(newSnippet)
        this.activeSnippet = newSnippet
      },
      deleteSnippet (snippet) {
        this.snippets = this.snippets.filter(searchSnippet => searchSnippet !== snippet)
        this.activeSnippet = null
      },
      openSnippet (snippet) {
        this.activeSnippet = snippet
      },
      updateSnippet (snippet) {
        const updatedSnippet = {
          ...snippet,
          updated: new Date().toISOString(),
        }

        this.snippets = this.snippets.map(searchSnippet => {
          if (searchSnippet === this.activeSnippet) {
            return updatedSnippet
          }
          return searchSnippet
        })

        this.activeSnippet = updatedSnippet
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
      :inputSnippet="activeSnippet"
      @deleteSnippet="deleteSnippet(activeSnippet)"
      @updateSnippet="updateSnippet"
    />
  </div>
</template>

<style module>
  .root {
    min-height: 400px;
    display: flex;
  }

  .sidebar {
    width: 230px;
    margin-bottom: 31px; /* visually align with Details footer */
    flex-shrink: 0;
  }

  .details {
    flex-grow: 1;
  }
</style>
