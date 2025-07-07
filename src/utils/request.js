/**** request.js ****/
// 导入axios
import axios from 'axios'
// 使用element-ui Message做消息提醒
// import {Message} from 'element-ui';
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
            vm.$message.error(response.data.message)
            vm.$router.push('/login');
        }
    }
  }
  return response 

  
}, error => {
  if (!error.response) {
    if (!error.response) {
      // 处理网络错误/超时
      console.error('请求出错:', error);
      //  alert(`请求失败: ${error.message}`); // 或用 UI 库的 message/toast
       return Promise.resolve({ code: 500 }); // 阻止错误传播
      // throw error;
      // return Promise.reject(error)
      // const errorMessage = '网络错误';
      // const safeError = new Error(errorMessage);
      // safeError.status = 0;
      // safeError.data = null;
      // Message.error(errorMessage);
      // return Promise.reject(safeError);
    }
    if (error.response) { 
      // HTTP 错误处理
      // let errorMessage = '';
      // switch (error.response.status) {
      //   case 400: errorMessage = '错误请求'; break;
      //   case 401: 
      //     errorMessage = '未授权，请重新登录';
      //     break;
      //   default: 
      //     errorMessage = `服务器错误 (${error.response.status})`;
      // }
      return Promise.resolve({ code: 500 }); // 阻止错误传播
      // throw error;
      // // 创建标准错误对象
      // const safeError = new Error(errorMessage);
      // safeError.status = error.response.status; // 直接访问已确认的属性
      // safeError.data = error.response.data || null; // 确保数据为 null
      
      // Message.error(errorMessage);
      // return Promise.reject(safeError); // 确保返回拒绝的 Promise
    }
  }

})
//4.导入文件
export default service