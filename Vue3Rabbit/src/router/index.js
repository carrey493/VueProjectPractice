// createRouter：创建router实例对象
// createWebHistory：创建history模式的路由

import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login/index.vue";
import Layout from "@/views/Layout/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component对应的关系位置
  routes: [
    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "", // 默认页路由置空
          name: "Home",
          component: () => import("@/views/Home/index.vue"),
        },
        {
          path: "/category/:id",
          name: "Category",
          component: () => import("@/views/Category/index.vue"),
        },
        {
          path: "/category/sub/:id",
          name: "SubCategory",
          component: () => import("@/views/SubCategory/index.vue"),
        },
        {
          path: "/cartlist",
          name: "Cartlist",
          component: () => import("@/views/CartList/index.vue"),
        },
        {
          path: "/detail/:id",
          name: "Detail",
          component: () => import("@/views/Detail/index.vue"),
        },
        {
          path: "checkout",
          name: "Checkout",
          component: () => import("@/views/CheckOut/index.vue"),
        },
        {
          path: "/pay/:orderId",
          name: "Pay",
          component: () => import("@/views/Pay/index.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
  ],
  // 路由滚动行为定制
  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

export default router;
