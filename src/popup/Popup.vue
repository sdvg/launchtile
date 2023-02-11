<script>
  import IconCog from '@/icons/IconCog'
  import shortcuts from '@/mixins/shortcuts'
  import { SNIPPET } from '@/constants/storageKeys'
  import { queryCollectionItemsByStorageKey } from '@/lib/storage'
  import { isChrome } from '@/lib/environment'
  import sortBy from 'lodash/sortBy'
  import runSnippet from '@/lib/runSnippet'
  import { OptionKeys } from '@/lib/options'
  import useTheme from '@/composables/useTheme'

  export default {
    components: {
      IconCog,
    },
    mixins: [shortcuts],
    props: {
      options: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        query: ``,
        focusedIndex: null,
        results: [],
        isResultItemMouseOverBlocked: false,
        snippets: [],
        resultTypes: {
          BOOKMARK: `bookmark`,
          BOOKMARKLET: `bookmarklet`,
          SNIPPET: `snippet`,
        },
      }
    },
    computed: {
      maximumResultsInViewport () {
        return parseInt(this.$style.maximumResultsInViewport)
      },
      resultItemHeight () {
        return parseInt(this.$style.resultItemHeight)
      },
      viewportHeight () {
        return this.maximumResultsInViewport * this.resultItemHeight
      },
      hasFavicon () {
        return isChrome() || this.options[OptionKeys.ALLOW_FAVICONS]
      },
    },
    created () {
      this.fetchRecentBookmarks()
      this.fetchSnippets()
      useTheme()
    },
    mounted () {
      this.$refs.queryInput.focus() // HTML autofocus attribute doesn't work in Firefox because component rendering is slightly delayed
    },
    methods: {
      async fetchSnippets () {
        this.snippets = await queryCollectionItemsByStorageKey(SNIPPET) || []
      },
      async fetchRecentBookmarks () {
        this.results = (await browser.bookmarks.getRecent(10))
          .map(bookmark => ({
            type: this.isUrlBookmarklet(bookmark.url) ? this.resultTypes.BOOKMARKLET : this.resultTypes.BOOKMARK,
            title: bookmark.title,
            bookmark,
          }))
      },
      async queryChanged () {
        if (this.query) {
          const bookmarksAndBookmarklets = (await browser.bookmarks.search(this.query))
            .filter(bookmark => bookmark.url) // exclude folders

          const bookmarkResults = bookmarksAndBookmarklets
            .filter(({ url }) => !this.isUrlBookmarklet(url))
            .map(bookmark => ({
              type: this.resultTypes.BOOKMARK,
              title: bookmark.title,
              bookmark,
            }))

          const bookmarkletResults = bookmarksAndBookmarklets
            .filter(({ url }) => this.isUrlBookmarklet(url))
            .map(bookmarklet => ({
              type: this.resultTypes.BOOKMARKLET,
              title: bookmarklet.title,
              bookmarklet,
            }))

          const snippetResults = this.snippets
            .filter(snippet => snippet.title.toLowerCase().includes(this.query.toLowerCase()))
            .map(snippet => ({
              type: this.resultTypes.SNIPPET,
              title: snippet.title,
              snippet,
            }))

          this.results = sortBy([
            ...bookmarkResults,
            ...bookmarkletResults,
            ...snippetResults,
          ], `title`)
        } else {
          this.fetchRecentBookmarks()
        }

        this.resetFocusedIndex()
      },
      resetFocusedIndex () {
        this.focusedIndex = this.query.length ? 0 : null
      },
      openFocusedResult () {
        this.openResult(this.results[this.focusedIndex])
      },
      isUrlBookmarklet (url) {
        return url.startsWith(`javascript:`)
      },
      openResult (result) {
        switch (result.type) {
        case this.resultTypes.BOOKMARK:
          browser.tabs.create({ url: result.bookmark.url })
          break
        case this.resultTypes.BOOKMARKLET:
          runSnippet({ code: result.bookmarklet.url.replace(/^javascript:/, ``) })
          break
        case this.resultTypes.SNIPPET:
          runSnippet({
            code: result.snippet.content,
            executionType: result.snippet.executionType,
          })
          break
        }

        window.close()
      },
      resultItemMouseOver (index) {
        if (!this.isResultItemMouseOverBlocked) {
          this.focusedIndex = index
        }
      },
      blockResultItemMouseOver () {
        /* Prevent resting cursor from interfering with keyboard navigation */
        this.isResultItemMouseOverBlocked = true
      },
      unblockResultItemMouseOver () {
        this.isResultItemMouseOverBlocked = false
      },
      handleOptionsLinkClick () {
        browser.tabs.create({ url: `options.html` })
        window.close()
      },
      getFaviconSource (bookmarkUrl) {
        const { hostname } = new URL(bookmarkUrl)

        return isChrome()
          ? `chrome://favicon/size/16@2x/${bookmarkUrl}`
          : `https://icons.duckduckgo.com/ip3/${hostname}.ico`
      },
    },
    shortcuts: {
      down () {
        this.blockResultItemMouseOver()

        if (this.focusedIndex === null || this.focusedIndex === this.results.length - 1) {
          this.focusedIndex = 0
          this.$refs.resultList.scrollTop = 0
        } else {
          this.focusedIndex = this.focusedIndex + 1

          const focusedItemOffset = this.focusedIndex * this.resultItemHeight
          const isFocusedItemOutOfViewport = focusedItemOffset + this.resultItemHeight > this.viewportHeight + this.$refs.resultList.scrollTop

          if (isFocusedItemOutOfViewport) {
            this.$refs.resultList.scrollTop = (this.focusedIndex + 1 - this.maximumResultsInViewport) * this.resultItemHeight
          }
        }
      },
      up () {
        this.blockResultItemMouseOver()

        if (this.focusedIndex === null || this.focusedIndex === 0) {
          this.focusedIndex = this.results.length - 1
          this.$refs.resultList.scrollTop = (this.results.length - this.maximumResultsInViewport) * this.resultItemHeight // scroll to bottom
        } else {
          this.focusedIndex = this.focusedIndex - 1

          const focusedItemOffset = this.focusedIndex * this.resultItemHeight
          const isFocusedItemOutOfViewport = focusedItemOffset < this.$refs.resultList.scrollTop

          if (isFocusedItemOutOfViewport) {
            this.$refs.resultList.scrollTop = focusedItemOffset
          }
        }
      },
      enter () {
        this.openFocusedResult()
      },
      esc () {
        window.close()
      },
    },
  }
</script>

<template>
  <div
    :class="$style.root"
    @mousemove="unblockResultItemMouseOver"
    @mousedown="unblockResultItemMouseOver"
  >
    <div :class="$style.queryContainer">
      <input
        ref="queryInput"
        v-model="query"
        type="search"
        :class="$style.queryInput"
        placeholder="Search…"
        spellcheck="false"
        @input="queryChanged"
      >

      <a
        href="options.html"
        title="Options"
        :class="$style.optionsLink"
        @click.prevent="handleOptionsLinkClick"
      >
        <IconCog :class="$style.optionsLinkIcon" />
        <span class="visually-hidden">Options</span>
      </a>
    </div>

    <p
      v-if="!results.length"
      :class="$style.noResults"
    >
      No results
    </p>

    <ol
      ref="resultList"
      :class="$style.resultList"
    >
      <li
        v-for="(result, index) in results"
        :key="index"
        :ref="`resultListItem${index}`"
        @mouseover="resultItemMouseOver(index)"
      >
        <button
          :title="result.type === resultTypes.BOOKMARK ? result.bookmark.url : result.title"
          :class="[
            $style.resultItem,
            { [$style.isActive]: index === focusedIndex },
          ]"
          @click="openResult(result)"
        >
          <IconCog
            v-if="result.type === resultTypes.BOOKMARKLET || result.type === resultTypes.SNIPPET"
            :class="$style.faviconAction"
          />

          <img
            v-else-if="hasFavicon"
            :class="$style.faviconBookmark"
            :src="getFaviconSource(result.bookmark.url)"
            alt=""
          >

          <div :class="$style.resultLabel">
            <template v-if="result.title">
              {{ result.title }}
            </template>
            <i v-else-if="result.type === resultTypes.BOOKMARK">
              {{ result.bookmark.url }}
            </i>
            <i v-else>
              Untitled element
            </i>
          </div>
        </button>
      </li>
    </ol>
  </div>
</template>

<style module>
  @value resultItemHeight: 40px;
  @value maximumResultsInViewport: 10;

  body {
    width: 400px; /* must be defined on body for Firefox */
    max-width: 100%; /* necessary for Firefox overflow menu */
  }

  .root {
    background: var(--color-background-main);
  }

  .queryContainer {
    position: relative;
    border-bottom: 1px solid var(--color-text-main);
  }

  .queryInput {
    display: block;
    background: var(--color-background-stronger);
    color: inherit;
    width: 100%;
    border: 2px solid transparent;
    outline: none;
    font-size: 20px;
    padding: 12px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  .optionsLink {
    position: absolute;
    top: 4px;
    right: 4px;
  }

  .optionsLinkIcon {
    width: 14px;
    height: 14px;
    fill: var(--color-text-main);
  }

  .noResults {
    text-align: center;
    padding: 12px;
    font-size: 16px;
  }

  .resultList {
    max-height: calc(maximumResultsInViewport * resultItemHeight);
    overflow: auto;
  }

  .resultItem {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    text-decoration: none;
    color: var(--color-text-main);
    font-size: 14px;
    background: transparent;
    border: none
  }

  .resultItem.isActive {
    background: var(--color-accent);
    color: var(--color-text-stronger);
  }

  .resultLabel {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .favicon {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  .faviconBookmark {
    composes: favicon;
  }

  .faviconAction {
    composes: favicon;

    fill: var(--color-bookmarklet-icon);
  }
</style>
