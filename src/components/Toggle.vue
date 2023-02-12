<script>
  export default {
    props: {
      value: {
        type: Boolean,
        required: true,
      },
    },
    data () {
      return {
        localValue: this.value,
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (newValue) {
          this.localValue = newValue
        },
      },
    },
    methods: {
      handleInput () {
        setTimeout(() => { // allow localValue to update
          this.$emit(`input`, this.localValue)
        })
      },
    },
  }
</script>

<template>
  <label :class="$style.root">
    <input
      v-model="localValue"
      type="checkbox"
      class="visually-hidden"
      @input="handleInput"
    >

    <div :class="$style.visual" />

    <div :class="$style.textLabel">
      <slot />
    </div>
  </label>
</template>

<style module>
  .root {
    display: flex;
    align-items: center;

    --width: 56px;
    --height: calc(var(--width) / 2);
  }

  .visual {
    display: inline-block;
    width: var(--width);
    height: var(--height);
    border-radius: calc(var(--width) / 2);
    background: var(--color-background-main);
    position: relative;
    cursor: pointer;
    border: 1px solid var(--color-text-main);
    transition: background 200ms;
  }

  :checked + .visual {
    background: var(--color-accent);
  }

  :focus-visible + .visual {
    box-shadow: var(--focus-box-shadow);
  }

  .visual::before {
    --size: calc(var(--height) - 4px);

    content: "";
    position: absolute;
    top: 1px;
    bottom: 1px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    display: block;
    background: var(--color-text-main);
    transition: transform 200ms;
    margin: 0 1px;
  }

  :checked + .visual::before {
    transform: translateX(calc(var(--width) / 2));
  }

  .textLabel {
    margin-left: 8px;
    font-size: 16px;
  }
</style>
