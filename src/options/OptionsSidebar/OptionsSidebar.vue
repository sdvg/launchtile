<script>
  import RouteNames from '@/options/constants/RouteNames'
  import { version } from '@/../package.json'

  export default {
    computed: {
      RouteNames () {
        return RouteNames
      },
      version () {
        return version
      },
      year () {
        return new Date().getFullYear()
      },
    },
  }
</script>

<template>
  <aside :class="$style.root">
    <div :class="$style.header">
      <img
        :class="$style.logo"
        src="./logo.svg"
        alt="LaunchTile logo"
      >

      <h1 :class="$style.brand">
        LaunchTile
      </h1>
    </div>

    <nav :class="$style.navigation">
      <ul>
        <li>
          <router-link
            :to="{ name: RouteNames.General }"
            :class="$style.navigationLink"
            :activeClass="$style.isActive"
            exact
          >
            General
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: RouteNames.Snippets }"
            :class="$style.navigationLink"
            :activeClass="$style.isActive"
          >
            Snippets
          </router-link>
        </li>
      </ul>
    </nav>

    <footer :class="$style.footer">
      <p :class="$style.footerParagraph">
        <span>
          © 2020 - {{ year }} by
          <a
            href="https://stefan-dietz.eu/"
            target="_blank"
          >Stefan Dietz</a>
        </span>
      </p>

      <p :class="$style.footerParagraph">
        <span>
          <a
            href="https://github.com/sdvg/launchtile"
            target="_blank"
          >GitHub</a> |
          <a
            href="https://github.com/sdvg/launchtile/blob/master/CHANGELOG.md"
            target="_blank"
          >Changelog</a>
        </span>

        Version {{ version }}
      </p>
    </footer>
  </aside>
</template>

<style module>
  .root {
    display: flex;
    flex-direction: column;
    background: var(--color-background-stronger);
    border-radius: 16px;
    padding: 16px;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 32px;
  }

  .brand {
    margin-left: 16px;
    font-size: 32px;
  }

  .navigation {
    margin-top: 32px;
  }

  .navigationLink {
    display: block;
    font-size: 18px;
    text-decoration: none;
    padding: 14px;
    background: var(--color-background-main);
    border-radius: 16px;
    margin-bottom: 16px;
    text-align: center;
  }

  .navigationLink.isActive {
    background: var(--color-accent);
  }

  .footer {
    margin-top: auto;
    line-height: 2;
  }

  .footerParagraph {
    display: flex;
    justify-content: space-between;
  }
</style>
