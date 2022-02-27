/* jshint esversion: 6 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/user/Users.vue';
import Rights from '../components/power/Rights.vue';
import Roles from '../components/power/Roles.vue';
import Cate from '../components/goods/Cate.vue';
import GoodsList from '../components/goods/List.vue';
import Addfrom from '../components/goods/Add.vue';
import Order from '../components/order/Order.vue';
import Report from '../components/report/Report.vue';
import Params from '../components/goods/Params.vue';

// 路由懒加载
// const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
// const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
// const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

// const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/User.vue')
// const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
// const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

// const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
// const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

// const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
// const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

// const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
// const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Addfrom },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转
  // next 是一个函数表示放行 next()放行 next('/login')强制跳转
  // to and from are Route Object,next() must be called to resolve the hook}
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
});

export default router;
