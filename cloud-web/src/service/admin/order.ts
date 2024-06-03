import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 获取订单列表 GET /admin/order/lists */
export async function getOrderList(params: API.RequestParams = {}) {
    return get("/admin/order/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}