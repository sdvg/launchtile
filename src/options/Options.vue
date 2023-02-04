<script setup>
  import OptionsHeader from './OptionsHeader/OptionsHeader'
</script>

<template>
  <div :class="$style.root">
    <OptionsHeader />

    <div :class="$style.main">
      <router-view />
    </div>
  </div>
</template>

<style module>
  .root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--color-background-main);
  }

  .main {
    flex-grow: 1;
    margin: 16px;
  }
</style>
