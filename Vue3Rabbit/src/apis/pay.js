import request from "@/utils/http.js";

// 获取订单详情
export const getOrderAPI = (id) => {
  return request({
    url: `/member/order/${id}`,
  });
};
