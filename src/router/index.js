import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/XlghkzxtIndex.vue'),
    redirect: '/xlghkzxt',
    meta: { isAuth: true, title:'主页' },

  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/xlghkzxtLogin.vue'),
  },
  {
    path: '/xlghkzxt',
    name: '训练规划及电磁环境控制分系统',
    component: () => import('@/views/XlghkzxtIndex.vue'),
    meta: {
      isAuth: true,  // 需要登录
      title: '训练规划及电磁环境控制分系统'     // 页面标题
    },
  },
  {
    path: '/pinpuindex/:id',
    name: 'pingputu',
    component: () => import('@/views/PinpuIndex.vue'),
    meta: {
      isAuth: true,  // 需要登录
      title: '频谱图'     // 页面标题
    },
  },
  {
    path: '/test',
    name: '测试',
    component: () => import('@/components/xlghkzxt/testTIEME.vue'),
    meta: {
      // isAuth: true,  // 需要登录
      title: '测试'     // 页面标题
    },
  },
  {
    path: '/testtime',
    name: 'testtime',
    component: () => import('@/components/xlghkzxt/components/PinPu/dialogPinPU.vue'),
  },
]

const router = new VueRouter({
  routes
})
document.title = '训练规划系统';


// router.beforeEach((to, from, next) => {
//   //如果路由需要跳转
//   // console.log(to,'tototo');
//   document.title = to.meta.title || '训练规划系统';

//   // 确保每个分支都调用 next()
//   if (to.path === '/login') {
//     // 确保没有多余的导航调用
//     next()
//   } else {
//     // 避免在异步回调中调用 next()
//     next()
//   }
  
// })

export default router
