import {API} from "../../../typings";
import {get,post} from "@/utils/request";

/** 获取订单列表 GET /master/order/lists */
export async function getOrderList(params: API.RequestParams = {}) {
    return get("/master/order/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 删除订单 POST /master/order/delete */
export async function deleteOrder(params: API.RequestParams = {}) {
    return post("/master/order/delete", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}