<script>
  import Sidebar from './Sidebar'
  import Details from './Details'
  import { SNIPPET } from '@/constants/storageKeys'
  import {
    createCollectionItem,
    queryCollectionItemsByStorageKey,
    updateItem,
    removeItem,
  } from '@/lib/storage'
  import sortBy from 'lodash/sortBy'
  import { EXECUTE_SCRIPT } from '@/constants/executionTypes'

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
      await this.fetchSnippets()

      if (this.snippets.length) {
        this.openSnippet(sortBy(this.snippets, `created`)[0])
      }

      browser.storage.onChanged.addListener(this.storageChanged)
    },
    destroyed () {
      browser.storage.onChanged.removeListener(this.storageChanged)
    },
    methods: {
      async fetchSnippets () {
        this.snippets = await queryCollectionItemsByStorageKey(SNIPPET) || []
      },
      storageChanged () {
        this.fetchSnippets()
      },
      async newSnippet () {
        try {
          const newSnippet = await createCollectionItem(SNIPPET, {
            title: `Snippet #${this.snippets.length + 1}`,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            executionType: EXECUTE_SCRIPT,
            content: ``,
          })

          this.snippets.push(newSnippet)
          this.openSnippet(newSnippet)
        } catch (error) {
          console.error(error)
          alert(`Error creating snippet: ${error.message}`)
        }
      },
      async deleteSnippet (snippet) {
        try {
          await removeItem(snippet.id)

          this.snippets = this.snippets.filter(searchSnippet => searchSnippet.id !== snippet.id)
          this.activeSnippet = null
        } catch (error) {
          console.error(error)
          alert(`Error deleting snippet: ${error.message}`)
        }
      },
      openSnippet (snippet) {
        this.activeSnippet = snippet
      },
      async updateSnippet (snippet) {
        this.activeSnippet = {
          ...snippet,
          updated: new Date().toISOString(),
        }

        try {
          await updateItem(this.activeSnippet)
        } catch (error) {
          console.error(error)
          alert(`Error saving the snippet: ${error.message}`)
        }
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
    margin-bottom: 28px; /* visually align with Details footer */
    flex-shrink: 0;
  }

  .details {
    flex-grow: 1;
  }
</style>
