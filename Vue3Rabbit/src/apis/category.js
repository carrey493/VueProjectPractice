import request from "@/utils/http.js";

/**
 * @description: 获取分类数据
 * @param {*} id 分类id
 * @return {*}
 */
export const getTopCategoryAPI = (id) => {
  console.log(id, 88888);

  return request({
    url: "/category",
    params: {
      id,
    },
  });
};
