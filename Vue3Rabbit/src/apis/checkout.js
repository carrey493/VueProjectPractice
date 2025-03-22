import request from "@/utils/http.js";
/**
 * 获取结算信息
 */
export const getCheckoutInfoAPI = () => {
  return request({
    url: "/member/order/pre",
  });
};

// 创建订单
export const createOrderAPI = (data) => {
  return request({
    url: "/member/order",
    method: "POST",
    data,
  });
};
