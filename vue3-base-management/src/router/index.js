import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/Index.vue'
import Login from '../views/login/Index.vue'
import store from '../store/index.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    //嵌套路由
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/home/Index.vue')
      },
      {
        path: '/list',
        name: 'List',
        component: () => import('../views/list/Index.vue'),
        children: [
          {
            path: '/commodity',
            name: 'Commodity',
            component: () => import('../views/list/Commodity.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to, from, next);
  /* 
  to:从哪个页面
  from:到哪个页面
  next:只有执行next()页面才会跳转
  */

  //判断用户是否登录
  const userInfo = store.state.userInfo.userInfo
  if (userInfo.name && userInfo.password) {
    next()
  } else {
    //未登录
    if (to.path === '/login') {
      next()
      return
    }
    next('/login')
  }
})

export default router
