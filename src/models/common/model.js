/*
 * @Author: 刁琪
 * @Date: 2020-08-18 13:58:51
 * @LastEditors: わからないよう
 */

export default {
  namespace: 'common',
  state: {
    channel: '',// 美国 or 加拿大
    isLogin: false
  },

  effects: {
    *setChannel({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          channel: payload
        }
      })
    },
    *setIsLogin({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          isLogin: payload
        }
      })
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
