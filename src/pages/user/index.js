/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:53:28
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { getCookie, setCookie, delCookie } from '../../utils/cookie'
import { dateFormat } from '../../utils/date'
import { appMiniCheckSession } from '../../utils/login'

import './index.scss'

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      userInfo: {}
    }
  }
  componentDidMount() {
  }
  componentDidShow() {
    const userInfo = getCookie('userInfo')
    if (userInfo) {
      try {
        this.setState({
          userInfo: userInfo,
          isLogin: true
        })
      } catch(e) {
        delCookie('userInfo')
      }
    }
  }

  topClick = () => {
    console.log('已登录');
  }
  // 微信授权获取用户手机号
  bindGetUserInfo(e) {
    appMiniCheckSession().then( (openid)=> {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        Taro.showLoading({
          title: '登录中'
        })
        // console.log('授权用户信息：', e);
        this.props.dispatch({
          type: 'user/weappGetUserInfo',
          payload: {
            encryptedData: e.detail.encryptedData,
            openid: openid,
            sessionKey: getCookie('sessionKey'),
            iv: e.detail.iv
          },
          callback: ()=> {
            Taro.hideLoading();
          }
        })
      } else {
        Taro.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  }

  toSign = () => {
    const signFlag = getCookie('signFlag')
    if (signFlag === dateFormat(new Date(), 'yyyy-MM-dd')) {
      // 今日已经打过卡了 直接去列表页
      Taro.showToast({
        title: '您今天已经打过卡了哟',
        icon: 'none'
      })
    } else {
      Taro.navigateTo({
        url: '/pages/signin/index'
      })
    }
  }

  toList = () => {
    if (this.state.userInfo.groupId) {
      Taro.navigateTo({
        url: `/packageA/pages/weekList/index?groupId=${this.state.userInfo.groupId}`
      })
    } else {
      Taro.showToast({
        title: '请先完成今日份的打卡',
        icon: 'none'
      })
    }
  }

  toHistory = () => {
    Taro.navigateTo({
      url: `/packageA/pages/monthHistory/index`
    })
  }

  toNew = () => {
    Taro.navigateTo({
      url: `/packageA/pages/newGroup/index`
    })
  }
  toServe = () => {
    console.log('对接客服');
  }

  render () {
    const { isLogin, userInfo } = this.state
    return (
      <View className='user-page'>
        {/* {!isLogin && (<AtButton openType='getPhoneNumber'  onGetPhoneNumber={this.bindGetUserInfo.bind(this)} className='login-btn'></AtButton>)} */}
        <View className='top'>
          <View className='user-area' onClick={this.topClick}>
            <View className='left-area'>
              <View className='user-pic'>
                <Image className='Image' src={isLogin ? userInfo.avatarUrl :'http://loseweight.onbetter.cn/image/user/user.png'} alt='头像' />
              </View>
              <View className='user-info'>
                <View className='name'>{isLogin ? userInfo.nickName : '登录'}</View>
                <View className='mobile'>{isLogin ? userInfo.mobile : '登录后查看更多信息'}</View>
              </View>
            </View>
            <View className='right-area'>
              <Image className='right-Image' src='http://loseweight.onbetter.cn/image/user/right.png' alt='right' />
            </View>
          </View>
        </View>
        <View className='mid-area'>
          <View className='window'>
            <View className='item'>
              <View className='num'>{userInfo.todayWeight || '--'}</View>
              <View className='info'>今日体重</View>
            </View>
            <View className='item'>
              <View className='num'>{userInfo.weekTargetWeight || '--'}</View>
              <View className='info'>本周目标</View>
            </View>
            <View className='item'>
              <View className='num'>{userInfo.monthTargetWeight || '--'}</View>
              <View className='info'>本月目标</View>
            </View>
            <View className='item'>
              <View className='num'>{userInfo.targetWeight || '--'}</View>
              <View className='info'>最终目标</View>
            </View>
          </View>
        </View>
        <View className='menu-list'>
          <View className='item' onClick={this.toSign}>
            <View className='text'>每日打卡</View>
            <Image className='menu-Image' src='http://loseweight.onbetter.cn/image/user/menu-right.png' alt='right' />
          </View>
          <View className='item' onClick={this.toList}>
            <View className='text'>群组制表{userInfo.groupId && (<View className='infor'>({userInfo.groupId})</View>)}</View>
            <Image className='menu-Image' src='http://loseweight.onbetter.cn/image/user/menu-right.png' alt='right' />
          </View>
          {/* <View className='item' onClick={this.toHistory}>
            <View className='text'>打卡记录</View>
            <Image className='menu-Image' src='http://loseweight.onbetter.cn/image/user/menu-right.png' alt='right' />
          </View> */}
          <View className='item' onClick={this.toNew}>
            <View className='text'>创建新群 </View>
            <Image className='menu-Image' src='http://loseweight.onbetter.cn/image/user/menu-right.png' alt='right' />
          </View>
          <View className='item' onClick={this.toServe}>
            <View className='text'>联系客服</View>
            <Image className='menu-Image' src='http://loseweight.onbetter.cn/image/user/menu-right.png' alt='right' />
          </View>
        </View>
      </View>
    )
  }
}
