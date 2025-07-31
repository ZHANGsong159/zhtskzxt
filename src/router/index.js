import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    // component: () => import('@/views/XlghkzxtIndex.vue'),
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


router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '训练规划系统'
  // 2. 检查需要认证的页面
  if (to.meta.isAuth) {
    // 检查用户是否已登录
    const isAuthenticated = checkAuthStatus()
    if (isAuthenticated) {
      // 用户已认证，允许访问
      next()
    } else {
      // 用户未认证，重定向到登录页
      // 添加redirect参数，登录后可以返回原页面
      next({
        path: '/login',
      })
    }
  } else {
    // 其他页面直接放行
    next()
  }
})

// 捕获路由错误并忽略导航取消
router.onError(error => {
  if (error.name === 'NavigationCancelled') {
    return false; // 静默处理
  }
  // 其他错误照常处理
  console.error(error);
});

function checkAuthStatus() {
  // 实际项目中应检查token是否有效（包括过期时间）
  console.log(!!sessionStorage.getItem('token'),'sessionStorage.getItem(token)');
  
  return !!sessionStorage.getItem('token')
}

export default router
