<script>
  import Snippets from './Snippets/Snippets'
  import SnippetsIntro from './SnippetsIntro'

  export default {
    components: {
      Snippets,
      SnippetsIntro,
    },
  }
</script>

<template>
  <div :class="$style.root">
    <SnippetsIntro />
    <Snippets :class="$style.snippets" />
  </div>
</template>

<style module>
  .root {
    margin: 16px;
  }

  .snippets {
    margin-top: 16px;
  }
</style>
