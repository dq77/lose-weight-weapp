/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:28:16
 * @LastEditors: わからないよう
 */

// 开发时，连接不同服务器
const build = 'test' // 这是连接测试环境
// const build = 'prod' // 这是连接生产环境 注意线上数据操作

// 开发时，设置不同国家渠道
const channel = 'canada' // 连接加拿大
// const channel = 'usa' // 连接美国

// 上面两项为本地配置(仅开发环境下生效) 若要打包请移步 /config/prod.js 进行配置

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
    esnextModules: ['taro-ui']
  }
}
