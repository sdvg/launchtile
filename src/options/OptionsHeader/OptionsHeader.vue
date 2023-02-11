<script setup>
  import RouteNames from '@/options/constants/RouteNames'
  import { version } from '@/../package.json'
</script>

<template>
  <div :class="$style.root">
    <img
      :class="$style.logo"
      src="./logo.svg"
      alt="LaunchTile logo"
    >

    <nav>
      <ul :class="$style.navigationList">
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

    <div :class="$style.right">
      Version {{ version }}
      |
      <a
        href="https://github.com/sdvg/launchtile"
        target="_blank"
        rel="noopener"
      >GitHub</a> |
      <a
        href="https://github.com/sdvg/launchtile/blob/master/CHANGELOG.md"
        target="_blank"
        rel="noopener"
      >Changelog</a>
    </div>
  </div>
</template>

<style module>
  .root {
    display: flex;
    align-items: center;
    padding: 0 32px;
    background: var(--color-background-stronger);
  }

  .logo {
    height: 20px;
    margin-right: 16px;
  }

  .navigationList {
    display: flex;
  }

  .navigationLink {
    display: block;
    font-size: 18px;
    text-decoration: none;
    padding: 8px 16px;
  }

  .navigationLink.isActive {
    background: var(--color-accent);
    color: var(--color-text-stronger);
  }

  .right {
    margin-left: auto;
  }
</style>
