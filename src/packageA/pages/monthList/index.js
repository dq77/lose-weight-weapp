/*
 * @Author: 刁琪
 * @Date: 2020-08-17 13:53:28
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Picker, ScrollView } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtList, AtListItem } from 'taro-ui'
import * as echarts from '../../lib/ec-canvas/echarts';
import { delCookie } from '../../../utils/cookie'
import { dateFormat } from '../../../utils/date'

import './index.scss'

@connect(({ sign, user }) => ({
  ...sign, ...user
}))
export default class MonthList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: getCurrentInstance().router.params.groupId,
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      windowWidth: Taro.getSystemInfoSync().windowWidth,
      groupName: '',
      date: dateFormat(new Date(), 'yyyy-MM'),
      groupMembers: [],
      activeItem: {},
      ec: {onInit: this.initChart},
      loading: true
    }
  }


  componentDidMount() {
    this.getList()
  }

  getList = () => {
    const params = {
      groupId: this.state.groupId,
      month:this.state.date.slice(5, 7),
      year: this.state.date.slice(0, 4)
    }
    this.props.dispatch({
      type: 'sign/getMonthList',
      payload: { ...params },
      callback: res => {
        if (res.code === '200') {
          this.setState({
            groupMembers: res.data.groupMembers,
            groupName: res.data.groupName,
            loading: false
          })
        } else {
          // Toast.fail(res.msg, 2);
        }
      }
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
    let className = 'td w70'
    if (lastWeight && item.dayWeight > 0) {
      if (item.dayWeight < lastWeight) {
        className += ' green'
      } else if (item.dayWeight > lastWeight) {
        className += ' yellow'
      }
    }
    return className
  }
  changeMonth = (e) => {
    this.setState({ date: e.detail.value }, () => { this.getList() })
  }

  toWeek = () => {
    Taro.redirectTo({
      url: `/packageA/pages/weekList/index?groupId=${this.state.groupId}`
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
        text: item.nickName,
        subtext: `身高：${item.height} 　 月目标：${item.monthTargetWeight<0?'-':item.monthTargetWeight} 　 总目标：${item.targetWeight} `,
        left: 'center',
        top: 14
      },
      xAxis: {
        type: 'category',
        data: item.weights.map(oneDay => {
          return oneDay.dateString.slice(5)
        })
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
        trigger: 'axis',
        renderMode: 'richText',
        formatter: '{b0} \n {c0}'
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
    const { groupMembers, activeItem, groupName, groupId, loading, date, ec, windowHeight, windowWidth } = this.state
    return (
      <View className='weeklist-page'>
        <ScrollView className='table-area' style={{height: `${activeItem.weights? `${windowHeight-270}px`:'100vh'}`}} scrollY>
          <View className='top-list'>
            <AtList>
              <AtListItem title={`${groupName} (${groupId})`} onClick={this.toWeek} extraText='前往周统计' arrow='right' />
              <Picker mode='date' fields='month' onChange={this.changeMonth} end={dateFormat(new Date(), 'yyyy-MM')}>
                <AtListItem title='选择月份' extraText={date} arrow='right' />
              </Picker>
            </AtList>
          </View>
          {!loading && (
            <View className='left-area' style={{width: '47px'}}>
              <View className='w46'>昵称</View>
              <View className='w46'>身高</View>
              <View className='w46'>入表</View>
              <View className='w46'>总目标</View>
              <View className='w46'>月目标</View>
              <View className='w46'>月减</View>
              {groupMembers[0] && groupMembers[0].weights.map(item => {return (
                <View className='w46' key={item.dateString}>{item.dateString.slice(5)}</View>
              )})}
            </View>
          )}
          {!loading && (
            <ScrollView className='list-table' scrollX style={{width: `${windowWidth - 47}px`}}>
              <View className='right-area' style={{width: `${groupMembers.length * 70.5}px`}}>
                <View className='row nick-name'>
                  {groupMembers.map(item => (
                    <View className='nick-name td' onClick={() => { this.clickLine(item) }} key={item.mobile}>{item.nickname}</View>
                  ))}
                </View>
                <View className='row'>
                  {groupMembers.map(item => (
                    <View className='td' onClick={() => { this.clickLine(item) }} key={item.mobile}>{item.height}</View>
                  ))}
                </View>
                <View className='row'>
                  {groupMembers.map(item => (
                    <View className='td' onClick={() => { this.clickLine(item) }} key={item.mobile}>{item.initWeight}</View>
                  ))}
                </View>
                <View className='row'>
                  {groupMembers.map(item => (
                    <View className='td' onClick={() => { this.clickLine(item) }} key={item.mobile}>{item.targetWeight}</View>
                  ))}
                </View>
                <View className='row'>
                  {groupMembers.map(item => (
                    <View className='td' onClick={() => { this.clickLine(item) }} key={item.mobile}>{item.monthTargetWeight>0?item.monthTargetWeight:'-'}</View>
                  ))}
                </View>
                <View className='row'>
                  {groupMembers.map(item => (
                    <View className='td' onClick={() => { this.clickLine(item) }} key={item.mobile}>{item.monthReduce}</View>
                  ))}
                </View>
                {groupMembers[0] && groupMembers[0].weights.map((day, index) => {return (
                  <View className='row' key={day.dateString}>
                    {groupMembers.map(item => (
                      <View key={item.mobile} onClick={() => { this.clickLine(item) }} className={this.getColorByData(item.weights[index], item.weights, index)}>
                        {item.weights[index].dayWeight>0?item.weights[index].dayWeight:'-'}
                      </View>
                    ))}
                  </View>
                )})}
              </View>
            </ScrollView>
          )}
          {loading && (<View className='tac'>加载中</View>)}
          {/* {!activeItem.weights && (
            <View className='btm-area'>
              <View className='edit' onClick={this.editSign}>修改打卡</View>
              <View>(点击昵称可查看详细数据)</View>
            </View>
          )} */}
        </ScrollView>
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
