/*
 * @Author: 刁琪
 * @Date: 2020-08-17 14:27:32
 * @LastEditors: わからないよう
 */

import Taro from '@tarojs/taro';
import { getCookie } from './cookie'

let Token;
if (getCookie('Token')) {
  Token = getCookie('Token');
}
const baseUrl = `http://${process.env.CHANNEL}.${process.env.BUILD === 'test' ? 'api.taozugong.cn' : 'service.taozugong.com'}`

export default (options = { method: 'GET', data: {} }) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: baseUrl + options.url,
      data: options.data,
      header: {
        'Content-Type': 'multipart/form-data',
        'Authorization' : Token // 请求携带token
      },
      method: options.method.toUpperCase(),
    }).then((res) => {
      const { statusCode, data } = res;
      if (statusCode >= 200 && statusCode < 300) {
        if (data.code === -1) {
          Taro.showToast({
            title: `${res.data.subMsg}~` || res.data.code,
            icon: 'none',
            mask: true,
          });
        }
        // return data;
        resolve(data)
      } else {
        reject(data)
        throw new Error(`网络请求错误，状态码${statusCode}`);
      }
    })
  })
  
  // return 
}
