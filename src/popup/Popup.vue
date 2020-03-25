<script>
  import IconCog from '@/icons/IconCog'
  import shortcuts from '@/mixins/shortcuts'

  const MAX_RESULTS = 10

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
      }
    },
    computed: {
      visibleResults () {
        const maxOffset = this.results.length - MAX_RESULTS
        const scrollingOffset = this.focusedIndex < MAX_RESULTS ? 0 : Math.min(this.focusedIndex - MAX_RESULTS + 1, maxOffset)

        return this.results.slice(scrollingOffset, scrollingOffset + MAX_RESULTS)
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
    },
    shortcuts: {
      down () {
        if (this.focusedIndex === null || this.focusedIndex === this.results.length - 1) {
          this.focusedIndex = 0
        } else {
          this.focusedIndex = this.focusedIndex + 1
        }
      },
      up () {
        if (this.focusedIndex === null || this.focusedIndex === 0) {
          this.focusedIndex = this.results.length - 1
        } else {
          this.focusedIndex = this.focusedIndex - 1
        }
      },
      enter () {
        this.openFocusedResult()
      },
      space () {
        this.openFocusedResult()
      },
      esc () {
        window.close()
      },
    },
  }
</script>

<template>
  <div>
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

    <ol v-if="results.length">
      <li
        v-for="(result, index) in results"
        v-if="visibleResults.includes(result)"
        :key="result.id"
        @mouseover="focusedIndex = index"
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

          <template v-if="result.title">
            {{ result.title }}
          </template>
          <i v-else>
            {{ result.url }}
          </i>
        </a>
      </li>
    </ol>
  </div>
</template>

<style module>
  html {
    width: 400px;
  }

  .queryContainer {
    border-bottom: 1px solid #b4b4b4;
  }

  .queryInput {
    display: block;
    background: #0c0c0c;
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

  .resultItem {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px;
    line-height: 1;
    text-decoration: none;
    color: #b4b4b4;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .resultItem.isActive {
    background: hsla(340, 82%, 40%, 1);
    color: #d6d6d6;
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

    fill: #fff;
  }
</style>
