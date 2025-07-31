import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.less' // 引入全局样式文件
import './assets/fonts/font.css'
import request from './utils/request'
import pac from './../package.json'

// import { Message } from 'element-ui'; // 添加这行


// import 'vue-ip-input/dist/vue-ip-input.css';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入样式文件

// import * as echarts from 'echarts';

console.log('版本号：' + pac.version)
// console.log('构建版本号：' + pac.buildVersion)


Vue.use(ElementUI) // 全局注册组件

// Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

request.setVueInstance(new Vue({
  router,
  store,
  render: h => h(App)
}))






new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
