const isDevelopment = process.env.NODE_ENV === `development`
const isChrome = process.env.VUE_APP_BROWSER === `chrome`

module.exports = {
  pages: {
    popup: {
      template: `public/browser-extension.html`,
      entry: `./src/popup/main.js`,
      title: `LaunchTile - Popup`,
    },
    options: {
      template: `public/browser-extension.html`,
      entry: `./src/options/main.js`,
      title: `LaunchTile - Options`,
    },
  },
  pluginOptions: {
    browserExtension: {
      manifestTransformer: manifest => {
        const scriptSrc = `script-src 'self'${isDevelopment ? ` 'unsafe-eval'` : ``};`
        const objectSource = `object-src 'self';`
        const imageSource = isChrome ? `img-src chrome://favicon;` : ``

        manifest.content_security_policy = [scriptSrc, objectSource, imageSource].join(` `)

        if (isChrome) {
          manifest.permissions.push(`chrome://favicon/`)
        }

        return manifest
      },
      extensionReloaderOptions: {
        port: process.env.PORT || 9090,
      },
    },
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: false,
        },
      },
    },
  },
}
