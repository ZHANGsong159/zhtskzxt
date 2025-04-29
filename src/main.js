import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.less' // 引入全局样式文件
import './assets/fonts/font.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入样式文件
Vue.use(ElementUI) // 全局注册组件


Vue.config.productionTip = false







new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
