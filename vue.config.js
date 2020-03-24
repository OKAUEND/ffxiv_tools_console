module.exports = {
  publicPath: "./",
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/assets/scss/prepends.scss";'
      }
    }
  },
  pages: {
    index: {
      entry: "src/main.js",
      title: "FFXIV CraftTools 管理画面"
    }
  }
};
