/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:56:07
 * @LastEditors: わからないよう
 */
import Request from '../../utils/request';
import Request2 from '../../utils/formRequest';



/**
 * 获取手机验证码
 * @param {mobile, businessType} data
 */
export const getCode = data => Request({
  url: `/v1/login/captcha/${data.mobile}`,
  method: 'POST',
  data,
  requestType: true
})

/**
 * 拿用户信息
 */
export const getOpenid = data => Request({
  url: '/api/currentTime',
  method: 'GET',
  data,
})


/**
 * upload 头像
 * @param {file} data
 */
export const fuck = data => Request2({
  url: '/upload_pic',
  method: 'POST',
  data,
})



