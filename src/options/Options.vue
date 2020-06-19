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
    display: flex;
    flex-direction: column;
    padding: 16px;
    height: 100vh;
    background: var(--color-background-main);
  }

  .snippets {
    margin-top: 16px;
    flex-grow: 1;
  }
</style>
