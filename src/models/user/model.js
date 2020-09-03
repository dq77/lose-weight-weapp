/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:56:07
 * @LastEditors: わからないよう
 */
import * as userApi from './service'

export default {
  namespace: 'user',
  state: {
    userInfo: {},
    couponList: [],
    cornerMark: []
  },

  effects: {
    *getCode({ payload, callback }, { call, put }) {
      const response = yield call(userApi.getCode, payload)
      callback && callback(response)
    },
  },

  reducers: {
    save(state, { payload }) {
      
      return { ...state, ...payload }
    },
    getCoupon(state, payload) {
      return { ...state, couponList: payload.payload }
    }
  }
}
