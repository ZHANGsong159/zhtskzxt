/**** request.js ****/
// 导入axios
import axios from 'axios'
import router from '@/router'
// 使用element-ui Message做消息提醒
// import {Message} from 'element-ui';
//1. 创建新的axios实例，
const service = axios.create({ 
   
  // 公共接口--这里注意后面会讲
  baseURL: process.env.BASE_API,
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 15 * 1000
})
let vm
service.setVueInstance = function(vueInstance) {
  vm = vueInstance
}
let isRefreshing = false

// 处理未授权逻辑
function handleUnauthorized(response) {
  // 如果不在刷新状态，锁定并跳转登录
  if (!isRefreshing) {
    isRefreshing = true
    
    // 清空请求队列
    // failedQueue = []

    // 跳转登录页（带来源地址）
    const loginPath = '/login'
    const currentPath = router.currentRoute.fullPath
    console.error('401错误',response.data.message)

    console.log(currentPath,'originalRequest');
    if (currentPath !== loginPath) {
      router.replace({
        path: loginPath,
        query: { redirect: currentPath }
      })
    }
    // 显示提示（仅显示一次）
    // Message.error('会话已过期，请重新登录')
  }
}
// 2.请求拦截器
service.interceptors.request.use(config => { 
  const token = sessionStorage.getItem('token');
  //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
   config.data = JSON.stringify(config.data); //数据转化,也可以使用qs转换
   config.headers = { 
     'Content-Type':'application/json', //配置请求头
     'Authorization':token
   }
  return config
}, error => { 
  Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => { 
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  if(response.data.code==4000){
    if (vm && vm.$message) {
      vm.$message.error(response.data.message)
    }
  }
  if(response.data.code==401){
    if (vm && vm.$router) {
        if (vm.$router.currentRoute.path != '/login') {
            handleUnauthorized(response)
            // vm.$message.error(response.data.message)
            // vm.$router.push('/login');
        }
    }
  }
  return response 

  
}, error => {
  console.log(error,'error.code');
  
  // if(error.code==401){
    if (vm && vm.$router) {
        if (vm.$router.currentRoute.path != '/login') {
            vm.$router.push('/login');
        }
    }
  // }
  if (!error.response) {
    if (!error.response) {
      // 处理网络错误/超时
      // console.error('请求出错:', error);
      //  alert(`请求失败: ${error.message}`); // 或用 UI 库的 message/toast
       return Promise.resolve({ code: 500 }); // 阻止错误传播
    }
    if (error.response) { 
      return Promise.resolve({ code: 500 }); // 阻止错误传播
    }
  }

})






//4.导入文件
export default service