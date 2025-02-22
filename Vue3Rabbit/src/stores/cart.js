import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./user";
import { insertCartAPI, findNewCartListAPI, delCartAPI } from "@/apis/cart.js";

export const useCartStore = defineStore(
  "cart",
  () => {
    const userStore = useUserStore();
    const isLogin = computed(() => userStore.userInfo.token);
    // 1. 定义state
    const cartList = ref([]);
    // 2. 定义action
    const addCart = async (goods) => {
      // 添加购物车操作：已添加过的商品数量+1，未添加过的商品添加到购物车
      // 思路：通过匹配过来的商品id是否在cartList中，判断是否已经添加过购物车
      const { skuId, count } = goods;
      if (isLogin.value) {
        // 登录状态下，添加购物车操作
        await insertCartAPI({ skuId, count });
        updateNewList();
      } else {
        const item = cartList.value.find((item) => goods.skuId === item.skuId);
        if (item) {
          item.count++;
        } else {
          cartList.value.push(goods);
        }
      }
    };

    // 删除商品
    const delCart = async (skuId) => {
      if (isLogin.value) {
        // 登录状态下，删除购物车操作
        await delCartAPI([skuId]);
        updateNewList();
      } else {
        const index = cartList.value.findIndex((item) => skuId === item.skuId);
        if (index !== -1) cartList.value.splice(index, 1);
      }
    };

    // 清空购物车
    const clearCart = () => {
      cartList.value = [];
    };

    // 获取最新购物车列表
    const updateNewList = async () => {
      const res = await findNewCartListAPI();
      cartList.value = res.result;
    };

    // 计算总的数量与价格
    const allCount = computed(() =>
      cartList.value.reduce((prev, item) => prev + item.count, 0)
    );

    const allPrice = computed(() =>
      cartList.value.reduce(
        (prev, item) => prev + item.count * parseInt(item.price),
        0
      )
    );

    // 已选择数量
    const selectedCount = computed(() =>
      cartList.value
        .filter((item) => item.selected)
        .reduce((prev, item) => prev + item.count, 0)
    );

    // 已选择商品总价
    const selectedPrice = computed(() =>
      cartList.value
        .filter((item) => item.selected)
        .reduce((prev, item) => prev + item.count * parseInt(item.price), 0)
    );

    // 单选功能
    const singleCheck = (skuId, selected) => {
      const item = cartList.value.find((item) => skuId === item.skuId);
      item.selected = selected;
    };

    // 全选功能
    const allCheck = (selected) => {
      cartList.value.forEach((item) => (item.selected = selected));
    };

    // 是否全选
    const isAll = computed(() => {
      return cartList.value.every((item) => item.selected);
    });

    return {
      cartList,
      addCart,
      delCart,
      allCount,
      allPrice,
      singleCheck,
      isAll,
      allCheck,
      selectedCount,
      selectedPrice,
      clearCart,
      updateNewList,
    };
  },
  {
    persist: true,
  }
);
