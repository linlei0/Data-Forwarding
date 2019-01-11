import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss'

import './permission'
import i18n from './lang'
import { getApp } from './utils/lfStore'
import './icons'
// 本地开发环境则使用mock数据
// if (process.env.NODE_ENV !== 'production') require('@/mock')
function getBrowserInfo() {
  var Sys = {}
  var ua = navigator.userAgent.toLowerCase()
  var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/
  var m = ua.match(re)
  Sys.browser = m[1].replace(/version/, "'safari")
  Sys.ver = m[2]
  return Sys
}
// 在使用table fixed时会底部会出现部分确实，原因是重写谷歌浏览器滚动条导致，重写设置定位与滚动条高度相同即可
if (getBrowserInfo().browser === 'chrome') {
  const styleNode = document.createElement('style')
  styleNode.innerText = `.el-table__fixed-right{
    bottom: 8px !important;
  }`
  document.head.appendChild(styleNode)
}
Vue.use(Element, {
  size: 'medium',
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
getApp().then(data => {
  if (data) {
    store.commit('setApp', data)
    i18n.locale = data.language
  }
})

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
