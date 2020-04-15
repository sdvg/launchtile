<script>
  import clone from 'lodash/clone'
  import dateTime from '@/filters/dateTime'
  import CodeEditor from './CodeEditor'
  import IconTrash from '@/icons/IconTrash'

  export default {
    components: {
      CodeEditor,
      IconTrash,
    },
    filters: {
      dateTime,
    },
    props: {
      inputSnippet: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        snippet: null,
      }
    },
    watch: {
      inputSnippet (snippet) {
        this.snippet = clone(snippet)
      },
    },
    created () {
      this.snippet = clone(this.inputSnippet)
    },
    methods: {
      deleteSnippet () {
        if (confirm(`Sure you want to delete ${this.snippet.title}?`)) {
          this.$emit(`deleteSnippet`)
        }
      },
    },
  }
</script>

<template>
  <div :class="$style.root">
    <header :class="$style.header">
      <label :class="$style.titleInputContainer">
        <span class="visually-hidden">Title</span>
        <input
          v-model="snippet.title"
          :class="$style.titleInput"
          placeholder="Add a title ..."
          @input="$emit(`updateSnippet`, snippet)"
        >
      </label>

      <div :class="$style.actions">
        <button
          :class="$style.action"
          @click="deleteSnippet"
        >
          <IconTrash :class="$style.actionIcon" />
          Delete
        </button>
      </div>
    </header>

    <CodeEditor
      v-model="snippet.content"
      :class="$style.codeEditor"
      @input="$emit(`updateSnippet`, snippet)"
    />

    <footer :class="$style.footer">
      <b>Created</b>: {{ snippet.created | dateTime }}
      <b>Updated</b>: {{ snippet.updated | dateTime }}
    </footer>
  </div>
</template>

<style module>
  .root {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .titleInputContainer {
    width: 100%;
  }

  .titleInput {
    border: none;
    font-size: 14px;
    padding: 8px 18px;
    width: 100%;
    background: var(--color-background-stronger);
    color: var(--color-text-stronger);
  }

  @media(prefers-color-scheme: light) {
    .titleInput {
      color: var(--color-text-main);
    }
  }

  .actions {
    display: flex;
  }

  .action {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    color: var(--color-text-stronger);
    font-size: inherit;
    padding: 0 16px;
  }

  @media(prefers-color-scheme: light) {
    .action {
      color: var(--color-accent);
    }
  }

  .actionIcon {
    fill: currentColor;
    width: 16px;
    height: 16px;
    margin-right: 4px;
    margin-top: -1px; /* visually align */
  }

  .codeEditor {
    margin-top: 4px;
    height: 100%;
  }

  .footer {
    text-align: right;
    padding: 16px 4px 0;
  }
</style>
