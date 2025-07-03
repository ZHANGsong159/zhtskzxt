/**** request.js ****/
// 导入axios
import axios from 'axios'
// 使用element-ui Message做消息提醒
import {Message} from 'element-ui';
//1. 创建新的axios实例，
const service = axios.create({ 
   
  // 公共接口--这里注意后面会讲
  baseURL: process.env.BASE_API,
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 3 * 1000
})
let vm
service.setVueInstance = function(vueInstance) {
  vm = vueInstance
}
// 2.请求拦截器
service.interceptors.request.use(config => { 
  const token = sessionStorage.getItem('token');
  // if(token){
  //   config.headers.token = token
  // }
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
  if (!response.data) {
    return Promise.reject(new Error('接口返回数据为空'));
  }
   
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  if(response.data.code==4000){
    if (vm && vm.$message) {
      vm.$message.error(response.data.message)
    } else {
      console.error('Vue instance not set in request.js')
    }
  }
  
  if(response.data.code==401){
    if (vm && vm.$router) {
        if (vm.$router.currentRoute.path != '/login') {
            vm.$message.error(response.data.message)
            console.log('Vue instance not set in request.js');
            
            vm.$router.push('/login');
        }
    } else {
      console.error('Vue instance not set in request.js')
    }
    
  }
  
  
  return response
}, error => { 
  console.log(error,'error.response');
  
  if (!error.response) {
    // 无响应情况（网络错误/请求超时）
    // console.log(error,'无响应情况（网络错误/请求超时）');
    // return Promise.reject({
    //   code: 'NETWORK_ERROR',
    //   message: '网络连接异常，请检查网络设置'
    // })
  }
   
   /***** 接收到异常响应的处理开始 *****/
  if (error && error.response) { 
   
    // 1.公共错误处理
    // 2.根据响应码具体处理
    switch (error.response.status) { 
   
      case 400:
        error.message = '错误请求'
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        // window.location.href = "/NotFound"
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      case 4000:
        // error.message = 'http版本不支持该请求'
        this.$message.error(error.message)
        break;
      default:
        error.message = `连接错误${ error.response.status}`
      }
  } else { 
   
    // 超时处理
    if (JSON.stringify(error).includes('timeout')) { 
   
      Message.error('服务器响应超时，请刷新当前页')
    }
    error.message = '连接服务器失败'
  }

  Message.error(error.message)
  /***** 处理结束 *****/
  //如果不需要错误处理，以上的处理过程都可省略
  return Promise.resolve(error.response)
})
//4.导入文件
export default service