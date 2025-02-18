import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCartStore = defineStore(
  "cart",
  () => {
    // 1. 定义state
    const cartList = ref([]);
    // 2. 定义action
    const addCart = (goods) => {
      // 添加购物车操作：已添加过的商品数量+1，未添加过的商品添加到购物车
      // 思路：通过匹配过来的商品id是否在cartList中，判断是否已经添加过购物车
      const item = cartList.value.find((item) => goods.skuId === item.skuId);
      if (item) {
        item.count++;
      } else {
        cartList.value.push(goods);
      }
    };

    // 删除商品
    const delCart = (skuId) => {
      const index = cartList.value.findIndex((item) => skuId === item.skuId);
      if (index !== -1) cartList.value.splice(index, 1);
    };

    // 计算总的属性与价格
    const allCount = computed(() =>
      cartList.value.reduce((prev, item) => prev + item.count, 0)
    );
    const allPrice = computed(() =>
      cartList.value.reduce(
        (prev, item) => prev + item.count * parseInt(item.price),
        0
      )
    );

    // 单选功能
    const singleCheck = (skuId, selected) => {
      const item = cartList.value.find((item) => skuId === item.skuId);
      item.selected = selected;
    };

    return { cartList, addCart, delCart, allCount, allPrice, singleCheck };
  },
  {
    persist: true,
  }
);
