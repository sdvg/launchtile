<script>
  export default {
    props: {
      activeSnippet: {
        type: Object,
        default: null,
      },
    },
  }
</script>

<template>
  <div :class="$style.root">
    {{ activeSnippet.title }}
  </div>
</template>

<style module>
  .root {
    background: lightgoldenrodyellow;
  }
</style>
