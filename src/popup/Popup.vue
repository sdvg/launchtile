<script>
  import IconCog from '@/icons/IconCog'
  import shortcuts from '@/mixins/shortcuts'

  export default {
    components: {
      IconCog,
    },
    mixins: [shortcuts],
    data () {
      return {
        query: ``,
        focusedIndex: null,
        results: [],
        isResultItemMouseOverBlocked: false,
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
    },
    created () {
      this.fetchRecentBookmarks()
    },
    methods: {
      async fetchRecentBookmarks () {
        this.results = await browser.bookmarks.getRecent(10)
      },
      async queryChanged () {
        if (this.query) {
          this.results = (await browser.bookmarks.search(this.query))
            .filter(bookmark => bookmark.url) // exclude folders
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
      openResult ({ url }) {
        if (this.isUrlBookmarklet(url)) {
          browser.tabs.executeScript(null, { code: url.replace(/^javascript:/, ``) })
          window.close()
        } else {
          browser.tabs.create({ url })
        }
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
    @mousemove="unblockResultItemMouseOver"
    @mousedown="unblockResultItemMouseOver"
  >
    <div :class="$style.queryContainer">
      <input
        v-model="query"
        type="search"
        :class="$style.queryInput"
        placeholder="Search…"
        autofocus
        spellcheck="false"
        @input="queryChanged"
      >
    </div>

    <p
      v-if="!results.length"
      :class="$style.noResults"
    >
      No results
    </p>

    <ol
      v-if="results.length"
      ref="resultList"
      :class="$style.resultList"
    >
      <li
        v-for="(result, index) in results"
        :key="result.id"
        :ref="`resultListItem${index}`"
        @mouseover="resultItemMouseOver(index)"
      >
        <a
          :href="result.url"
          :title="result.url"
          :class="[
            $style.resultItem,
            { [$style.isActive]: index === focusedIndex },
          ]"
          target="_blank"
          @click.prevent="openResult(result)"
        >
          <IconCog
            v-if="isUrlBookmarklet(result.url)"
            :class="$style.faviconAction"
          />
          <img
            v-else
            :class="$style.faviconBookmark"
            :src="`chrome://favicon/size/16@2x/${result.url}`"
            alt=""
          >

          <div :class="$style.resultLabel">
            <template v-if="result.title">
              {{ result.title }}
            </template>
            <i v-else>
              {{ result.url }}
            </i>
          </div>
        </a>
      </li>
    </ol>
  </div>
</template>

<style module>
  @value resultItemHeight: 40px;
  @value maximumResultsInViewport: 10;

  html {
    width: 400px;
  }

  .queryContainer {
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
