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
      const data = yield call(signApi.signIn, { ...payload })
      callback && callback(data)
    },

    //  发放优惠券码
    * getCoupon({payload, callback}, {call, put}) {
      const data = yield call(signApi.getCoupon, { ...payload })
      callback && callback(data)
    },
  
    // 查询我发放的券码
    * myCouponList({payload, callback}, {call, put}) {
      const data = yield call(signApi.getMyCouponList, { ...payload })
      callback && callback(data)
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
