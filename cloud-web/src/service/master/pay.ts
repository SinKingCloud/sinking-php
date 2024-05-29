import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 消费记录 GET /master/pay/lists */
export async function getPayLog(params: API.RequestParams = {}) {
    return get("/master/pay/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}