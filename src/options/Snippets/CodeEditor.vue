<script>
  import CodeMirror from 'codemirror/lib/codemirror'
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/addon/display/placeholder'
  import 'codemirror/addon/hint/javascript-hint'
  import 'codemirror/addon/hint/show-hint'
  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/addon/selection/mark-selection'
  import 'codemirror/addon/dialog/dialog'
  import 'codemirror/addon/dialog/dialog.css'
  import 'codemirror/addon/search/searchcursor'
  import 'codemirror/addon/search/search'
  import 'codemirror/theme/3024-day.css'
  import 'codemirror/theme/moxer.css'
  import getThemeByOptionOrPreference from '@/lib/getThemeByOptionOrPreference'
  import { getOptions } from '@/lib/options'
  import * as Themes from '@/constants/themes'

  const THEME_MAP = {
    [Themes.DARK]: `moxer`,
    [Themes.LIGHT]: `3024-day`,
  }

  export default {
    props: {
      value: {
        type: String,
        required: true,
      },
    },
    data () {
      return {
        options: null,
      }
    },
    watch: {
      value (value) {
        if (value !== this.codeMirror.getValue()) {
          this.codeMirror.setValue(value)
        }
      },
      options () {
        this.setEditorTheme()
      },
    },
    async created () {
      this.options = await getOptions()
    },
    mounted () {
      this.codeMirror = CodeMirror(this.$refs.root, {
        value: this.value,
        mode: {
          name: `javascript`,
          globalVars: true,
        },
        autoCloseBrackets: true,
        lineNumbers: true,
        extraKeys: { 'Ctrl-Space': `autocomplete` },
        placeholder: `Code goes here ...`,
        tabSize: 2,
        styleSelectedText: true,
      })

      this.codeMirror.on(`change`, this.onChange)
    },
    destroyed () {
      this.codeMirror.off(`change`, this.onChange)
    },
    methods: {
      onChange () {
        this.$emit(`input`, this.codeMirror.getValue())
      },
      setEditorTheme () {
        const editorTheme = THEME_MAP[getThemeByOptionOrPreference(this.options.theme)]
        this.codeMirror.setOption(`theme`, editorTheme)
      },
    },
  }
</script>

<template>
  <div
    ref="root"
    :class="$style.root"
  />
</template>

<style module>
  .root {
    display: flex;
    flex-direction: column;
    font-size: 14px;
  }

  :global(.CodeMirror) {
    flex-grow: 1;
  }

  :global(.cm-searching.CodeMirror-selectedtext) {
    background-color: #ffa;
    color: #4e4e4e !important;
  }

  :root[data-theme="light"] :global(.cm-searching.CodeMirror-selectedtext) {
    color: #4e4e4e !important;
  }
</style>
