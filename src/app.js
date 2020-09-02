/*
 * @Author: 刁琪
 * @Date: 2020-08-14 17:28:16
 * @LastEditors: わからないよう
 */
import React, { Component } from 'react'
import { Provider } from "react-redux";
import 'taro-ui/dist/style/index.scss'
import dva from "./utils/dva";
import models from "./models/index";
import './app.scss'

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {

  componentDidMount () {
    // console.log(11);
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
