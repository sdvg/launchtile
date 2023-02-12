<script setup>
  import IconInfo from '@/icons/IconInfo'
</script>

<template>
  <p :class="$style.root">
    <IconInfo :class="$style.iconInfo" />

    Snippets can be searched for like bookmarks and run the specified JavaScript code in the context of the currently open web page when executed.
  </p>
</template>

<style module>
  .root {
    display: flex;
    align-items: center;
    font-size: 16px;
    background: var(--color-background-alt);
    padding: 8px;
    border-radius: 3px;
    width: fit-content;
  }

  .iconInfo {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    fill: currentColor;
  }
</style>
