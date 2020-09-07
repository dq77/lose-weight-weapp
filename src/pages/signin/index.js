/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:53:28
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtForm, AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { getCookie, setCookie, delCookie } from '../../utils/cookie'
import { dateFormat } from '../../utils/date'

import './index.scss'

@connect(({ sign, user }) => ({
  ...sign, ...user
}))
export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: '',
      week: '',
      mobile: '',
      groupId: '',
      nickname: '',
      height: '',
      targetWeight: '',
      monthTargetWeight: '',
      weekTargetWeight: '',
      todayWeight: '',
      signSuccess: false,
    }
  }


  componentDidMount() {
    const userInfo = getCookie('userInfo')
    if (userInfo) {
      try {
        console.log(userInfo);
        const signFlag = getCookie('signFlag')
        if (signFlag === dateFormat(new Date(), 'yyyy-MM-dd')) {
          // 今日已经打过卡了 直接去列表页
          this.setState({ groupId: userInfo.groupId }, () => {
            this.toPaper()
          })
        }
        this.setState({
          mobile: userInfo.mobile,
          groupId: userInfo.groupId,
          nickname: userInfo.nickname,
          height: userInfo.height,
          targetWeight: userInfo.targetWeight,
          monthTargetWeight: userInfo.monthTargetWeight,
          weekTargetWeight: userInfo.weekTargetWeight,
        })
      } catch(e) {
        delCookie('userInfo')
      }
    }
    this.getDay()
  }

  getDay = () => {
    const today = dateFormat(new Date(), 'yyyy年MM月dd日')
    const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][new Date().getDay()]
    this.setState({ today: today, week: week })
  }

  changemobile = (mobile) => { this.setState({ mobile: mobile }) }
  changegroupId = (groupId) => { this.setState({ groupId: groupId }) }
  changenickname = (nickname) => { this.setState({ nickname: nickname }) }
  changeheight = (height) => { this.setState({ height: height }) }
  changetargetWeight = (targetWeight) => { this.setState({ targetWeight: targetWeight }) }
  changemonthTargetWeight = (monthTargetWeight) => { this.setState({ monthTargetWeight: monthTargetWeight }) }
  changeweekTargetWeight = (weekTargetWeight) => { this.setState({ weekTargetWeight: weekTargetWeight }) }
  changetodayWeight = (todayWeight) => { this.setState({ todayWeight: todayWeight }) }
  validate = () => {
    if (!this.state.mobile) { return '请输入手机号' }
    if (!this.state.groupId) { return '请输入群号' }
    if (!this.state.nickname) { return '请输入昵称' }
    if (!this.state.height) { return '请输入身高' }
    if (!this.state.targetWeight) { return '请输入目标体重' }
    if (!this.state.monthTargetWeight) { return '请输入月目标体重' }
    if (!this.state.weekTargetWeight) { return '请输入周目标体重' }
    if (!this.state.todayWeight) { return '请输入今日体重' }
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
      groupId: this.state.groupId,
      nickname: this.state.nickname,
      height: this.state.height,
      targetWeight: this.state.targetWeight,
      weekTargetWeight: this.state.weekTargetWeight,
      monthTargetWeight: this.state.monthTargetWeight,
      todayWeight: this.state.todayWeight
    }
    this.props.dispatch({
      type: 'sign/signIn',
      payload: { ...param },
      callback: res => {
        if (res.code === '200') {
          setCookie('userInfo', param);
          setCookie('signFlag', dateFormat(new Date(), 'yyyy-MM-dd'));
          this.setState({ signSuccess: true })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }
  handleEnterKey = (e) => {
    if(e.nativeEvent.keyCode === 13){ //e.nativeEvent获取原生的事件对像
      this.signIn()
    }
  }
  toPaper = () => {
    Taro.navigateTo({
      url: `/packageA/pages/weekList/index?groupId=${this.state.groupId}`
    })
  }
  toUser = () => {
    this.props.history.push({ pathname: `/user` });
  }
  onContact = (e) => {
    console.log(e);
  }
  toCreat = () => {
    Taro.navigateTo({
      url: `/packageA/pages/newGroup/index`
    })
  }

  render () {
    const { today, week, mobile, groupId, nickname, height, targetWeight, monthTargetWeight, weekTargetWeight, todayWeight, signSuccess } = this.state
    return (
      <View className='qiandao-page'>
        <View className='top-info'>
          <Text onClick={this.show}>{today}</Text> <Text className='week'>{week}</Text>
        </View>
        <View className='form-area'>
          <AtForm>
            <AtInput name='mobile' title='手机号码' type='phone' placeholder='请输入手机号' value={mobile} onChange={this.changemobile} />
            <AtInput name='groupId' title='群号' type='digit' placeholder='请输入群号' value={groupId} onChange={this.changegroupId} />
            <AtInput name='nickname' title='昵称' type='text' placeholder='请输入昵称' value={nickname} onChange={this.changenickname} />
            <AtInput name='height' title='身高' type='digit' placeholder='请输入身高' value={height} onChange={this.changeheight}><View>cm</View></AtInput>
            <AtInput name='targetWeight' title='目标体重' type='digit' placeholder='请输入目标体重' value={targetWeight} onChange={this.changetargetWeight}><View>kg</View></AtInput>
            <AtInput name='monthTargetWeight' title='月目标体重' type='digit' placeholder='请输入月目标体重' value={monthTargetWeight} onChange={this.changemonthTargetWeight}><View>kg</View></AtInput>
            <AtInput name='weekTargetWeight' title='周目标体重' type='digit' placeholder='请输入周目标体重' value={weekTargetWeight} onChange={this.changeweekTargetWeight}><View>kg</View></AtInput>
            <AtInput name='todayWeight' title='今日体重' type='digit' placeholder='请输入今日体重' value={todayWeight} onChange={this.changetodayWeight}><View>kg</View></AtInput>
          </AtForm>
        </View>
        <View className='sign-area'>
          <AtButton type='primary' onClick={this.signIn}>打卡</AtButton>
        </View>
        <View className='creat'>
          <AtButton openType='contact' onContact={this.onContact} className='creat-btn contact'>联系客服</AtButton>
          <Text className='creat-btn' onClick={this.toServe}></Text>
          <Text className='creat-btn' onClick={this.toCreat}>创建群</Text>
        </View>
        <AtModal isOpened={signSuccess}>
          <AtModalHeader>打卡成功</AtModalHeader>
          <AtModalContent className='modal-cnt'>
            恭喜您，打卡成功！
          </AtModalContent>
          <AtModalAction> <Button onClick={this.toPaper}>返回</Button> <Button onClick={this.toPaper}>查看周报</Button> </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
