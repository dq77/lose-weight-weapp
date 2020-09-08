/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:43:53
 * @LastEditors: わからないよう
 */
import Request from '../../utils/request';

export const demo = data => Request({
  url: '路径',
  method: 'POST',
  data,
});

// 个人打卡
export const signIn = data => Request({
  url: `/api/reduce/writeInfo`,
  method: 'GET',
  data
});

// 获取群周列表数据
export const getWeekList = (data) => Request({
  url: `/api/reduce/groupDataWeek`,
  method: 'GET',
  data
});

// 获取群月列表数据
export const getMonthList = (data) => Request({
  url: `/api/reduce/groupDataMonth`,
  method: 'GET',
  data
});

// 创建群
export const creatGroup = (data) => Request({
  url: `/api/generateGroup`,
  method: 'GET',
  data
});
