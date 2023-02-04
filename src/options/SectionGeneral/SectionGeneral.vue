<script>
  import RadioOptions from '@/components/RadioOptions'
  import Toggle from '@/components/Toggle'
  import * as Themes from '@/constants/themes'
  import { setOption, getOptions, OptionKeys } from '@/lib/options'
  import { isFirefox } from '@/lib/environment'

  export default {
    components: {
      RadioOptions,
      Toggle,
    },
    data () {
      return {
        options: null,
      }
    },
    computed: {
      Themes () {
        return Themes
      },
      OptionKeys () {
        return OptionKeys
      },
      isFirefox () {
        return isFirefox()
      },
    },
    async created () {
      this.options = await getOptions()
    },
    methods: {
      setOption,
    },
  }
</script>

<template>
  <div
    :class="$style.root"
    v-if="options"
  >
    <h2 :class="$style.headline">
      Theme
    </h2>

    <RadioOptions
      :value="options[OptionKeys.THEME]"
      :options="[
        { value: Themes.SYSTEM, label: `System` },
        { value: Themes.DARK, label: `Dark` },
        { value: Themes.LIGHT, label: `Light` },
      ]"
      @input="value => setOption(OptionKeys.THEME, value)"
    />

    <template v-if="isFirefox">
      <h2 :class="$style.headline">
        Favicons
      </h2>

      <label>
        <Toggle
          :value="options[OptionKeys.ALLOW_FAVICONS]"
          @input="value => setOption(OptionKeys.ALLOW_FAVICONS, value)"
        >
          Load Favicons from DuckDuckGo.com
        </Toggle>
      </label>

      <p :class="$style.ddgDisclaimer">
        ⚠️ Privacy note: This sends the hostnames of your bookmarks to DuckDuckGo.com in order to retrieve the favicons.
        The
        <a
          href="https://duckduckgo.com/privacy"
          target="_blank"
          rel="noopener"
        >DuckDuckGo privacy policy</a>
        applies.
      </p>
    </template>
  </div>
</template>

<style module>
  .root {
    background: var(--color-background-stronger);
    border-radius: 16px;
    padding: 16px;
  }

  .headline {
    color: var(--color-accent);
    border-bottom: 1px solid var(--color-accent);
    font-size: 24px;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .headline:not(:first-of-type) {
    margin-top: 24px;
  }

  .ddgDisclaimer {
    margin-top: 16px;
  }
</style>
