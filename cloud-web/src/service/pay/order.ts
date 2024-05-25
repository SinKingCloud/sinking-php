import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 订单记录 GET /user/order/lists */
export async function getPayOrder(params: API.RequestParams = {}) {
    return get("/user/order/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}