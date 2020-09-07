/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:53:28
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton, AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { getCookie, setCookie, delCookie } from '../../../utils/cookie'

import './index.scss'

@connect(({ sign, user }) => ({
  ...sign, ...user
}))
export default class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      groupName: '',
      groupSize: '',
      creatSuccess: false,
      newGroupInfo: {},
    }
  }


  componentDidMount() {
    document.title='创建群'
  }

  changemobile = (mobile) => { this.setState({ mobile: mobile.replace(/\s*/g,"") }) }
  changegroupName = (groupName) => { this.setState({ groupName: groupName }) }
  changegroupSize = (groupSize) => { this.setState({ groupSize: groupSize }) }
  validate = () => {
    if (!this.state.mobile) { return '请输入手机号' }
    if (!this.state.groupName) { return '请输入群名称' }
    if (!this.state.groupSize) { return '请输入群容量' }
    if (this.state.mobile.length !== 11) { return '手机号格式不正确' }
    if (this.state.groupSize > 200) { return '群最多支持200人' }
    return 200
  }
  signIn = () => {
    const valid = this.validate()
    if (valid !== 200) {
      Taro.showToast({
        title: valid,
        icon: 'none'
      })
      return
    }
    const param = {
      mobile: this.state.mobile,
      groupName: this.state.groupName,
      groupSize: this.state.groupSize
    }
    this.props.dispatch({
      type: 'sign/creatGroup',
      payload: { ...param },
      callback: res => {
        if (res.code === '200') {
          const userInfo = getCookie('userInfo') || {}
          userInfo.mobile = this.state.mobile
          userInfo.groupId = res.data.groupId
          setCookie('userInfo', userInfo);
          this.setState({
            creatSuccess: true,
            newGroupInfo: res.data
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }
  copyText = (text) => {
    // eslint-disable-next-line no-undef
    wx.setClipboardData({
      data: text+''
    })
  }
  toSign = () => {
    delCookie('signFlag');
    Taro.navigateTo({
      url: '/pages/signin/index'
    })
  }
  render () {
    const { mobile, groupName, groupSize, creatSuccess, newGroupInfo } = this.state
    return (
      <View className='creat-group-page'>
        <View className='form-area'>
          <AtInput name='mobile' title='手机号码' type='digit' placeholder='请输入手机号' value={mobile} onChange={this.changemobile} />
          <AtInput name='groupName' title='群名称' placeholder='请输入群名称' value={groupName} onChange={this.changegroupName} />
          <AtInput name='groupSize' title='群容量' type='digit' placeholder='请输入群最大人数' value={groupSize} onChange={this.changegroupSize}>
            <View className='right'>人</View>
          </AtInput>
        </View>
        <View className='sign-area'>
          <AtButton type='primary' onClick={this.signIn}>创建群</AtButton>
        </View>
        <AtModal isOpened={creatSuccess}>
          <AtModalHeader>创建成功</AtModalHeader>
          <AtModalContent className='modal-cnt'>
            <View>恭喜您，群创建成功</View>
            <View style={{ textAlign: 'left', paddingLeft: 40}} >　群号：{newGroupInfo.groupId}　　
            <Text style={{ color: '#108ee9', textDecoration: 'underline', touchAction:'none'}} onClick={() => {this.copyText(newGroupInfo.groupId)}}>复制</Text></View>
            <View style={{ textAlign: 'left', paddingLeft: 40}}>群名称：{this.state.groupName}</View>
          </AtModalContent>
          <AtModalAction> <Button onClick={this.toPaper}>返回</Button> <Button onClick={this.toSign}>前往打卡</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
