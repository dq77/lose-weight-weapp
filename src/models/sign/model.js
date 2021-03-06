/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:43:06
 * @LastEditors: わからないよう
 */
import * as signApi from './service';

export default {
  namespace: 'sign',
  state: {
    couponList: []
  },

  effects: {
    * effectsDemo(_, { call, put }) {
      const { status, data } = yield call(signApi.demo, {});
      if (status === 'ok') {
        yield put({ type: 'save',
          payload: {
            topData: data,
          } });
      }
    },

    // 签到
    * signIn({payload,callback},{call,put}) {
      payload.nickname = payload.nickName
      const data = yield call(signApi.signIn, { ...payload })
      callback && callback(data)
    },

    //  获取群周列表
    * getWeekList({payload, callback}, {call, put}) {
      const data = yield call(signApi.getWeekList, { ...payload })
      callback && callback(data)
    },

    //  获取群月列表
    * getMonthList({payload, callback}, {call, put}) {
      const data = yield call(signApi.getMonthList, { ...payload })
      callback && callback(data)
    },

    
  
    // 创建群
    * creatGroup({payload, callback}, {call, put}) {
      const data = yield call(signApi.creatGroup, { ...payload })
      callback && callback(data)
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
