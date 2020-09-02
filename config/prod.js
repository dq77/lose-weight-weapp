/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:28:16
 * @LastEditors: わからないよう
 */

// 打包时，切换你要打的环境
const build = 'test' // 这是打测试环境的包
// const build = 'prod' // 这是打生产环境的包

// 打包时，切换你要打的国家 (可给你牛逼坏了)
const channel = 'canada' // 打加拿大
// const channel = 'usa' // 打美国

// 上面两项要在打包时选择好 下面谨慎改动

// eslint-disable-next-line import/no-commonjs
module.exports = {
  env: {
    NODE_ENV: '"production"',
    CHANNEL: `"${channel}"`,
    BUILD: `"${build}"`
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    publicPath: `/${channel}`,
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}
