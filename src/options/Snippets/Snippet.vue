<script>
  import clone from 'lodash/clone'
  import dateTime from '@/filters/dateTime'
  import CodeEditor from './CodeEditor'
  import IconTrash from '@/icons/IconTrash'
  import IconChevron from '@/icons/IconChevron'
  import * as ExecutionTypes from '@/constants/executionTypes'

  export default {
    components: {
      CodeEditor,
      IconTrash,
      IconChevron,
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
        ExecutionTypes,
        snippet: null,
        isAdvancedOpen: false,
      }
    },
    watch: {
      inputSnippet (snippet) {
        this.snippet = clone(snippet)
      },
      [`snippet.id`] () {
        this.isAdvancedOpen = false
      },
      'snippet.title': `emitChanges`,
      'snippet.content': `emitChanges`,
      'snippet.executionType': `emitChanges`,
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
      emitChanges () {
        this.$emit(`updateSnippet`, this.snippet)
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
        >
      </label>

      <div :class="$style.actions">
        <button
          :class="$style.action"
          @click="deleteSnippet"
        >
          <IconTrash :class="[$style.actionIcon, $style.deleteIcon]" />
          Delete
        </button>

        <button
          :class="[
            $style.action,
            { [$style.isActive]: isAdvancedOpen },
          ]"
          @click="isAdvancedOpen = !isAdvancedOpen"
        >
          Advanced
          <IconChevron
            :class="[$style.actionIcon, $style.advancedIcon]"
            :isUp="isAdvancedOpen"
          />
        </button>
      </div>
    </header>

    <div
      v-if="isAdvancedOpen"
      :class="$style.advanced"
    >
      <h3>
        Execution Method
      </h3>

      <label :class="$style.executionTypeOptionLabel">
        <input
          v-model="snippet.executionType"
          :class="$style.executionTypeOptionInput"
          type="radio"
          name="executionType"
          :value="ExecutionTypes.EXECUTE_SCRIPT"
        >
        <div>
          Use Browser API <code>executeScript</code>

          <p :class="$style.executionTypeOptionExplanation">
            Use the Browser default API to inject snippets. Suitable for most use cases.
          </p>
        </div>
      </label>

      <label :class="$style.executionTypeOptionLabel">
        <input
          v-model="snippet.executionType"
          :class="$style.executionTypeOptionInput"
          type="radio"
          name="executionType"
          :value="ExecutionTypes.INJECT"
        >
        <div>
          Inject code in <code>&lt;script&gt;</code> tag

          <p :class="$style.executionTypeOptionExplanation">
            For edge cases where <code>executeScript</code> doesn't cut it. For example when you need to access
            global variables defined by the webpage or a shadow DOM.
          </p>
        </div>
      </label>
    </div>

    <CodeEditor
      v-model="snippet.content"
      :class="$style.codeEditor"
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

  :root[data-theme="light"] .titleInput {
    color: var(--color-text-main);
  }

  .actions {
    display: flex;
    padding: 0 8px;
  }

  .action {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    color: var(--color-text-stronger);
    font-size: inherit;
    padding: 0 8px;
  }

  .action.isActive {
    color: var(--color-accent);
  }

  :root[data-theme="light"] .action {
    color: var(--color-accent);
  }

  :root[data-theme="light"] .action.isActive {
    color: var(--color-text-main);
  }

  .actionIcon {
    fill: currentColor;
    width: 16px;
    height: 16px;
    margin-top: -1px; /* visually align */
  }

  .deleteIcon {
    margin-right: 4px;
  }

  .advancedIcon {
    margin-left: 4px;
  }

  .advanced {
    padding: 8px 18px;
    margin-top: 8px;
    background: var(--color-background-stronger);
  }

  .executionTypeOptionLabel {
    display: flex;
    align-items: flex-start;
    margin-top: 8px;
    font-size: 14px;
  }

  .executionTypeOptionInput {
    margin-right: 8px;
    margin-top: 1px;
  }

  .executionTypeOptionExplanation {
    margin-top: 4px;
    font-size: 12px;
  }

  .codeEditor {
    margin-top: 8px;
    height: 100%;
  }

  .footer {
    text-align: right;
    padding: 16px 4px 0;
    line-height: 1;
  }
</style>
