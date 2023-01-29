<script>
  import OptionsSidebar from './OptionsSidebar/OptionsSidebar'

  export default {
    components: {
      OptionsSidebar,
    },
  }
</script>

<template>
  <div :class="$style.root">
    <OptionsSidebar :class="$style.sidebar" />

    <div :class="$style.main">
      <router-view />
    </div>
  </div>
</template>

<style module>
  .root {
    display: flex;
    height: 100vh;
    padding: 16px;
    gap: 16px;
    background: var(--color-background-main);
  }

  .sidebar {
    width: 400px;
  }

  .main {
    background: var(--color-background-stronger);
    flex-grow: 1;
    border-radius: 16px;
    padding: 16px;
  }
</style>
