/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:53:28
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtList, AtListItem, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import * as echarts from '../../lib/ec-canvas/echarts';
import { delCookie } from '../../../utils/cookie'
import { dateFormat } from '../../../utils/date'

import './index.scss'

@connect(({ sign, user }) => ({
  ...sign, ...user
}))
export default class WeekList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: getCurrentInstance().router.params.groupId,
      groupName: '',
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      date: dateFormat(new Date(), 'yyyy-MM-dd'),
      weekGroupDatas: [],
      activeItem: {},
      ec: {onInit: this.initChart},
      showActionSheet: false, // 显示功能弹窗
      loading: true
    }
  }


  componentDidMount() {
    this.getList()
  }

  getList = () => {
    const params = {
      groupId: this.state.groupId,
      week: this.getWeekOfYear(),
      year: this.state.date.slice(0, 4)
    }
    this.props.dispatch({
      type: 'sign/getWeekList',
      payload: { ...params },
      callback: res => {
        if (res.code === '200') {
          // 跨月的周，月减字段和月目标字段的筛选
          res.data.groupMembers.map(member => {
            const monthReduce = member.monthReduces.filter(item => {
              return item.month === this.state.date.slice(5, 7)-0
            })[0]
            const monthTargetWeight = member.monthTargetWeights.filter(item => {
              return item.month === this.state.date.slice(5, 7)-0
            })[0]
            member.monthReduce = monthReduce ? monthReduce.monthReduce : '-'
            member.monthTargetWeight = monthTargetWeight ? monthTargetWeight.monthTargetWeight : '-'
          })
          this.setState({
            weekGroupDatas: res.data.groupMembers,
            groupName: res.data.groupName,
            loading: false
          })
        } else {
          // Toast.fail(res.msg, 2);
        }
      }
    })
  }
  topClick = () => {
    this.setState({
      activeItem: {}
    })
  }
  clickLine = (item) => {
    const old = this.state.activeItem.mobile
    if (old) {
      this.setState({
        activeItem: {}
      })
    } else {
      this.setState({
        activeItem: item,
      })
    }
  }
  getColorByData = (item, row, index) => {
    const rowList = row.map(one => { return one.dayWeight > 0 ? one.dayWeight : null })
    let lastWeight = null
    for (let i = index-1;i>=0;i--) {
      if (!lastWeight) {
        lastWeight = rowList[i]
      }
    }
    let className = 'w46'
    if (lastWeight && item.dayWeight > 0) {
      if (item.dayWeight < lastWeight) {
        className += ' green'
      } else if (item.dayWeight > lastWeight) {
        className += ' yellow'
      }
    }
    return className
  }
  getWeekOfYear = () => {
    const today = new Date(Date.parse(this.state.date.replace(/-/g,'/')+' 01:00:00'))
    
    let firstDay = new Date(today.getFullYear(),0, 1);
    const dayOfWeek = firstDay.getDay(); 
    let spendDay= 1;
    if (dayOfWeek !== 0) {
      spendDay=7-dayOfWeek+1;
    }
    firstDay = new Date(today.getFullYear(),0, 1+spendDay);
    const d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);
    const result =Math.ceil(d/7);
    return result+1;
  }

  changeWeek = (e) => {
    this.setState({ date: e.detail.value }, () => { this.getList() })
  }

  showActionSheet = () => {
    this.setState({
      showActionSheet: true
    })
  }
  closeActionSheet = () => {
    this.setState({
      showActionSheet: false
    })
  }

  editSign = () => {
    delCookie('signFlag')
    Taro.redirectTo({
      url: '/pages/signin/index'
    })
  }

  delItem = () => {
    console.log(12);
  }

  toMonth = () => {
    Taro.redirectTo({
      url: `/packageA/pages/monthList/index?groupId=${this.state.groupId}`
    })
  }

  initChart = (canvas, width, height, dpr) => {
    const item = this.state.activeItem
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    const option = {
      title: {
        text: item.nickname,
        subtext: `身高：${item.height} 　 周目标：${item.weekTargetWeight<0?'-':item.weekTargetWeight} 　 总目标：${item.targetWeight} `,
        left: 'center',
        top: 14
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value',
        min: function (value) {
          return value.min - 6;
        },
        max: function (value) {
          return value.max + 6;
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        bottom: 40,
        height: 180,
        top: 60
      },
      series: [{
        data: item.weights.map(one => {
          return one.dayWeight > 0 ? one.dayWeight : null
        }),
        type: 'line',
        connectNulls: true,
        itemStyle: {
          color: '#E6A23C',
        },
        lineStyle: {
          color: '#E6A23C'
        }
      }]
    };
    
    chart.setOption(option);
    return chart;
  }

  render() {
    const { weekGroupDatas, activeItem, groupName, groupId, loading, date, ec, windowHeight, showActionSheet } = this.state
    return (
      <View className='weeklist-page'>
        <ScrollView className='table-area' style={{height: `${activeItem.weights? `${windowHeight-270}px`:'100vh'}`}} scrollY>
          <View className='top-list'>
            <AtList>
              <AtListItem title={`${groupName} (${groupId})`} onClick={this.toMonth} extraText='前往月统计' arrow='right' />
              <Picker mode='date' onChange={this.changeWeek} end={dateFormat(new Date(), 'yyyy-MM-dd')}>
                <AtListItem title='选择日期' extraText={date} arrow='right' />
              </Picker>
            </AtList>
          </View>
          <ScrollView scrollX>
            <View className='list-table'>
              <View className='row head'>
                <View className='td w70 first'>昵称</View>
                <View className='td w46 brline'>身高</View>
                <View className='td w46'>一</View>
                <View className='td w46'>二</View>
                <View className='td w46'>三</View>
                <View className='td w46'>四</View>
                <View className='td w46'>五</View>
                <View className='td w46'>六</View>
                <View className='td w46 brline'>日</View>
                <View className='td w46'>周减</View>
                <View className='td w46'>月减</View>
                <View className='td w46'>周目标</View>
                <View className='td w46'>月目标</View>
                <View className='td w46'>总目标</View>
                <View className='td w46'>入表</View>
              </View>
              {weekGroupDatas.map(item => (
                <View key={item.mobile} onClick={() => { this.clickLine(item) }} className={item.mobile === activeItem.mobile ? 'active row' : 'row'}>
                  <View className='td w70 nickName'>{item.nickname}</View>
                  <View className='td w46 brline'>{item.height}</View>
                  {item.weights.map((one, index) => (
                    <View key={index} className={`td ${this.getColorByData(one, item.weights, index)} ${index===6 && 'brline'}`}>
                      {one.dayWeight < 0 ? '-' : one.dayWeight}
                    </View>
                  ))}
                  <View className={`td w46 ${item.weekReduce > 0 ? 'green' : ''} ${item.weekReduce < 0 ? 'yellow' : ''}`}>{item.weekReduce}</View>
                  <View className={`td w46 ${item.monthReduce > 0 ? 'green' : ''} ${item.monthReduce < 0 ? 'yellow' : ''}`}>{item.monthReduce}</View>
                  <View className='td w46'>{item.weekTargetWeight < 0 ? '-' : item.weekTargetWeight}</View>
                  <View className='td w46'>{item.monthTargetWeight}</View>
                  <View className='td w46'>{item.targetWeight}</View>
                  <View className='td w46'>{item.initWeight}</View>
                </View>
              ))}
            </View>
          </ScrollView>
          {loading && (<View>加载中</View>)}
          {!activeItem.weights && (
            <View className='btm-area'>
              <View className='edit' onClick={this.showActionSheet}>更多功能</View>
              <View>(点击昵称可查看详细数据)</View>
            </View>
          )}
        </ScrollView>
        <AtActionSheet isOpened={showActionSheet} cancelText='取消' onClose={this.closeActionSheet}>
          <AtActionSheetItem onClick={this.toMonth}>前往月统计</AtActionSheetItem>
          <AtActionSheetItem onClick={this.editSign}>修改打卡</AtActionSheetItem>
        </AtActionSheet>
        {activeItem.weights && (
          <View className='echart-area'>
            <View className='top-menu'>
              {/* <View className='del-btn' onClick={this.delItem}>删除该成员</View> */}
            </View>
            <ec-canvas className='echart-canvas' id='mychart-dom-line' canvas-id='mychart-line' ec={ec}></ec-canvas>
          </View>
        )}
      </View>
    )
  }
}
