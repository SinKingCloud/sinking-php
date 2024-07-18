import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 消费记录 GET /user/pay/lists */
export async function getPayLog(params: API.RequestParams = {}) {
    return get("/user/pay/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 账户充值 POST /user/pay/recharge */
export async function recharge(params: API.RequestParams = {}) {
    return post("/user/pay/recharge", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取支付配置 GET /user/config/getPay */
export async function getPayConfig(params: API.RequestParams = {}) {
    return get("/user/config/getPay", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}