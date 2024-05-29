import {API} from "../../../typings";
import {get} from "@/utils/request";
/** 获取信息 GET /master/person/log */
export async function getLogList(params: API.RequestParams = {}) {
    return get("/master/log/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}