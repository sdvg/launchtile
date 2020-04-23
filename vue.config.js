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
        if (process.env.NODE_ENV === `development`) {
          manifest.content_security_policy = `script-src 'self' 'unsafe-eval'; object-src 'self'; img-src chrome://favicon;`
        }

        return manifest
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
