import { ref } from "vue";
import { getCategoryAPI } from "@/apis/layout";
import { defineStore } from "pinia";

export const useCategoryStore = defineStore("category", () => {
  // 导航列表管理
  const categoryList = ref([]);
  const getCategory = async () => {
    const res = await getCategoryAPI();
    categoryList.value = res.result;
  };

  return {
    categoryList,
    getCategory,
  };
});
