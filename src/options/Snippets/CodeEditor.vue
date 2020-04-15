<script>
  import CodeMirror from 'codemirror/lib/codemirror'
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/addon/display/placeholder'
  import 'codemirror/addon/hint/javascript-hint'
  import 'codemirror/addon/hint/show-hint'
  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/theme/3024-day.css'
  import 'codemirror/theme/moxer.css'

  const THEME_DARK = `moxer`
  const THEME_LIGHT = `3024-day`

  export default {
    props: {
      value: {
        type: String,
        required: true,
      },
    },
    watch: {
      value (value) {
        if (value !== this.codeMirror.getValue()) {
          this.codeMirror.setValue(value)
        }
      },
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
      })

      this.codeMirror.on(`change`, this.onChange)

      this.lightThemeMediaQuery = matchMedia(`(prefers-color-scheme: light)`)
      this.setEditorTheme()
      this.lightThemeMediaQuery.addEventListener(`change`, this.setEditorTheme)
    },
    destroyed () {
      this.codeMirror.off(`change`, this.onChange)
      this.lightThemeMediaQuery.removeEventListener(`change`, this.setEditorTheme)
    },
    methods: {
      onChange () {
        this.$emit(`input`, this.codeMirror.getValue())
      },
      setEditorTheme () {
        this.codeMirror.setOption(`theme`, this.lightThemeMediaQuery.matches ? THEME_LIGHT : THEME_DARK)
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
</style>
