<script setup>
  import SnippetsIntro from '../SnippetsIntro';
  import Snippets from '../Snippets/Snippets';
</script>

<template>
  <div :class="$style.root">
    <SnippetsIntro :class="$style.intro" />
    <Snippets :class="$style.snippets" />
  </div>
</template>

<style module>
  .root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .intro {
    margin-bottom: 16px;
  }

  .snippets {
    flex-grow: 1;
  }
</style>
