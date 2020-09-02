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
    *register({ payload, callback }, { call, put }) {
      const response = yield call(userApi.register, payload)
      callback && callback(response)
    },
    *login({ payload, callback }, { call, put }) {
      const response = yield call(userApi.login, payload)
      callback && callback(response)
    },
    *codeLogin({ payload, callback }, { call, put }) {
      const response = yield call(userApi.codeLogin, payload)
      callback && callback(response)
    },
    *getUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(userApi.getUserInfo, payload)
      callback && callback(response)
      if (response.code == 200) {
        sessionStorage.setItem('userInfo', JSON.stringify(response.data))
        yield put({
          type: 'save',
          payload: {
            userInfo: response.data
          }
        })
      }
    },
    *findPassword({ payload, callback }, { call, put }) {
      const response = yield call(userApi.findPassword, payload)
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
