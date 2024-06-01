import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 消费记录 GET /admin/pay/lists */
export async function getPayLog(params: API.RequestParams = {}) {
    return get("/admin/pay/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}