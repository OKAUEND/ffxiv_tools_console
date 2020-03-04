module.exports = {
  publicPath: "./",
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "./src/assets/scss/prepends.scss";'
      }
    }
  }
};
