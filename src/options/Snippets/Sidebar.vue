<script>
  import IconPlusCircle from '@/icons/IconPlusCircle'

  export default {
    components: {
      IconPlusCircle,
    },
    props: {
      snippets: {
        type: Array,
        required: true,
      },
      activeSnippet: {
        type: Object,
        default: null,
      },
    },
    methods: {
      isSnippetActive (snippet) {
        return snippet === this.activeSnippet
      },
    },
  }
</script>

<template>
  <div :class="$style.root">
    <button
      :class="$style.newButton"
      @click="$emit(`newSnippet`)"
    >
      <IconPlusCircle :class="$style.newButtonIcon" />
      New snippet
    </button>

    <ol
      v-if="snippets.length"
      :class="$style.snippets"
    >
      <li
        v-for="(snippet, snippetIndex) in snippets"
        :key="snippetIndex"
        :class="$style.snippetContainer"
      >
        <button
          :class="[
            $style.snippet,
            { [$style.isActive]: isSnippetActive(snippet) }
          ]"
          @click="$emit(`openSnippet`, snippet)"
        >
          {{ snippet.title }}
        </button>
      </li>
    </ol>
  </div>
</template>

<style module>
  .root {
    display: flex;
    flex-direction: column;
    padding: 4px 4px 0;
  }

  .newButton {
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    color: var(--color-text-stronger);
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  @media(prefers-color-scheme: light) {
    .newButton {
      color: var(--color-text-main);
    }
  }

  .newButtonIcon {
    width: 22px;
    height: 22px;
    margin-right: 6px;
    fill: currentColor;
  }

  .snippets {
    background: var(--color-background-stronger);
    overflow: auto;
    flex-grow: 1;
  }

  .snippetContainer:not(:first-child) {
    margin-top: 2px;
  }

  .snippet {
    display: block;
    width: 100%;
    padding: 4px 8px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    border: none;
    background: transparent;
    color: var(--color-text-main);
  }
  .snippet.isActive {
    background: var(--color-accent);
    color: var(--color-text-stronger);
  }
</style>
