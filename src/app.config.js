/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:28:16
 * @LastEditors: わからないよう
 */
export default {
  pages: [
    'pages/index/index',
    'pages/user/index',
    'pages/signin/index',
  ],
  subpackages: [
    {
      "root": "packageA",
      "pages": [
        "pages/weekList/index"
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './images/tab/home.png',
        selectedIconPath: './images/tab/home-active.png'
      },
      // {
      //   pagePath: 'pages/category/index',
      //   text: '分类',
      //   iconPath: './images/tab/cate.png',
      //   selectedIconPath: './images/tab/cate-active.png'
      // },
      {
        pagePath: 'pages/user/index',
        text: '我的',
        iconPath: './images/tab/user.png',
        selectedIconPath: './images/tab/user-active.png'
      }
    ],
    color: '#333',
    selectedColor: '#4164ff',
    backgroundColor: '#fff',
    borderStyle: 'black'
  }
}
