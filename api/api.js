import fetch from "./http";
export default {
    /**
   *登录
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  login(params) {
    return fetch.fetchPost("applets/forum/login", params);
  },
 
  /**
   *新支付统一接口
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  unifiedPay(params) {
    return fetch.fetchPost("applets/forum/Pay/unifiedPay", params);
  },
   
    /**
   *判断是否是VIP
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  checkUserVip(params) {
    return fetch.fetchGet("applets/forum/checkUserVip", params);
  },
   
     /**
   *检测手机号
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  checkTellIsVip(params) {
    return fetch.fetchGet("applets/forum/checkTellIsVip", params);
  },
  
  /**
   *检测用户是否在成团列表中
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  checkUserInGroup(params) {
    return fetch.fetchGet("applets/forum/checkUserInGroup", params);
  },
}

// 获得充值单支付参数
// // 订单列表
// export const getOrderList = function (params) {
//   return fetch.fetchGet(mokeUrl + "api/user/v1/order/list", params);
// };