import { createStore } from 'vuex'
import number from './state/number.js'
import userInfo from './state/userInfo.js'

export default createStore({
  //数据较多时分模块处理
  modules: {
    number, userInfo
  }
})
