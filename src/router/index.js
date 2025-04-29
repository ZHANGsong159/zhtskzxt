import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/xlghkzxt/XlghkzxtIndex.vue'),
    redirect: '/xlghkzxt',
    meta: { isAuth: true, title:'主页' },

  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/components/xlghkzxt/xlghkzxtLogin.vue'),
  },
  {
    path: '/xlghkzxt',
    name: '训练规划与电磁环境控制系统',
    component: () => import('@/components/xlghkzxt/XlghkzxtIndex.vue'),
    meta: {
      isAuth: true,  // 需要登录
      title: '训练规划与电磁环境控制系统'     // 页面标题
    },
  },
  {
    path: '/pinpuindex',
    name: '频谱图',
    component: () => import('@/components/xlghkzxt/PinpuIndex.vue'),
    meta: {
      isAuth: true,  // 需要登录
      title: '频谱图'     // 页面标题
    },
  },
  {
    path: '/test',
    name: '测试',
    component: () => import('@/components/xlghkzxt/components/hightEcharts.vue'),
    meta: {
      isAuth: true,  // 需要登录
      title: '测试'     // 页面标题
    },
  },
  {
    path: '/testtime',
    name: 'testtime',
    component: () => import('@/components/xlghkzxt/components/testTIEME.vue'),
  },
]

const router = new VueRouter({
  routes
})



router.beforeEach((to, from, next) => {
  //如果路由需要跳转
  // console.log(to,'tototo');
  
  if (to.meta.isAuth) {
      //判断 如果school本地存储是qinghuadaxue的时候，可以进去
      if (localStorage.getItem('token')) {
        console.log(localStorage.getItem('token'));
        
          next()  //放行
      } else {
          alert('登录信息失效，请重新登录。')

          router.push('/login')
      }
  } else {
      // 否则，放行
      next()
  }
})

export default router
