/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:46:18
 * @LastEditors: わからないよう
 */
import Taro from '@tarojs/taro'

export function setCookie(name, value) {
  Taro.setStorageSync(name, value)
}

export function getCookie(name) {
  return Taro.getStorageSync(name)
}
export function delCookie(name) {
  Taro.removeStorageSync(name)
} 
