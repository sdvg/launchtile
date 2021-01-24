<template>
  <div>
    <h2>Snippets</h2>

    <p :class="$style.explanation">
      Snippets can be searched for like bookmarks and run the specified JavaScript code in the context of the currently open web page when executed.
    </p>
  </div>
</template>

<style module>
  .explanation {
    margin-top: 8px;
  }
</style>
