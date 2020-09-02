/*
 * @Author: 刁琪
 * @Date: 2020-08-18 13:58:51
 * @LastEditors: わからないよう
 */
import Request from '../../utils/request';



// 无用
export const couponList = data => Request({
  url: `/user_coupon/coupon_list`,
  method: 'POST',
  data: data.list
});