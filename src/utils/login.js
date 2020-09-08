/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:45:23
 * @LastEditors: わからないよう
 */
import Taro from '@tarojs/taro'
import { getCookie, setCookie } from './cookie'
import { getOpenid } from '../models/user/service'

// 微信小程序检验登陆状态
export function appMiniCheckSession() {
  return new Promise((resolve) => {
    if (getCookie('openid')) {
      Taro.checkSession().then(() => {
        // 授权状态在线 ===> 无需重复登陆
        resolve(getCookie('openid'))
      }, () => {
        // 授权状态失效 ===> 前往登陆
        appMiniLogin().then((res)=> {
          resolve(res);
        })
      })
    } else {
      appMiniLogin().then((res) => {
        resolve(res);
      });
    }
  })
}



// 微信小程序登陆
export function appMiniLogin() {
  return new Promise((resolve) => {
    Taro.login().then(res => {
      res.code && getAppMiniOpeId(res.code).then(openid => {
        resolve(openid)
      });
    })
  })
}

// 跟服务端换取openid
export function getAppMiniOpeId(code) {
  return new Promise((resolve) => {
    getOpenid({ authCode: code }).then(res => {
      if (res.code === '200') {
        Taro.hideLoading();
        if (res.data.token) {
          setCookie('Token', res.data.token)
        }
        // openid
        if (res.data && res.data.openid) {
          setCookie('openid', res.data.openid)
        } else if (res.data.wxUserResponse && res.data.wxUserResponse.openid) {
          setCookie('openid', res.data.wxUserResponse.openid)
        }
        // sessionKey
        if (res.data && res.data.wxUserResponse) {
          setCookie('sessionKey', res.data.wxUserResponse.sessionKey)
        }
        resolve(getCookie('openid'));
      }
    })
  })
}