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
 * 注册
 * @param {mobile, password,verification,channel='APP'} data
 */
export const register = data => Request({
  url: `/v1/login/${data.channel}/tzg`,
  method: 'POST',
  data,
  requestType: true
})


/**
 * 账户登录
 * @param {mobile, password,channel='APP'} data
 */
export const login = data => Request({
  url: '/v1/login',
  method: 'POST',
  data,
})
/**
 * 验证码登录
 * @param {mobile,verification,channel='APP'} data
 */
export const codeLogin = data => Request({
  url: '/user/login',
  method: 'POST',
  data,
})

/**
 * 拿用户信息
 */
export const getUserInfo = data => Request({
  url: '/v2/users/TAO_ZU_GONG',
  method: 'get',
  data,
})

// /**
//  * 找回密码
//  * @param {mobile,newPassword,verification} data
//  */
export const  findPassword = data => Request({
  url:'/v1/login/password',
  method:'PUT',
  data
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


// 京东手机号绑定
export const jdBindPhone = data => Request({
  url: '/user/jd/bind',
  method: 'get',
  data,
})



