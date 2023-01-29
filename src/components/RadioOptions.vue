<script>
  import { v4 as uuidv4 } from 'uuid'

  export default {
    props: {
      value: {
        type: String,
        default: () => null,
      },
      options: {
        type: Array,
        required: true,
      },
    },
    data () {
      return {
        localValue: this.value,
      }
    },
    computed: {
      inputName () {
        return uuidv4()
      },
    },
    watch: {
      value: {
        immediate: true,
        handler () {
          this.localValue = this.value
        },
      },
    },
  }
</script>

<template>
  <div :class="$style.root">
    <label
      v-for="option in options"
      :key="option.option"
      :class="$style.option"
    >
      <input
        v-model="localValue"
        :value="option.value"
        :name="inputName"
        type="radio"
        class="visually-hidden"
        @click="$emit(`input`, option.value)"
      >

      <div :class="$style.label">
        {{ option.label }}
      </div>
    </label>
  </div>
</template>

<style module>
  .root {
    display: inline-flex;
    height: 28px;
    border-radius: 5px;
    border: 1px solid var(--color-text-main);
    background: var(--color-background-main);
    font-size: 16px;
  }

  .option {
    display: flex;
  }

  .label {
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-left: 1px solid var(--color-text-main);
    cursor: pointer;
  }

  :focus-visible + .label {
    box-shadow: var(--focus-box-shadow);
  }

  :checked + .label {
    background: var(--color-text-main);
    color: var(--color-background-stronger);
  }
</style>
