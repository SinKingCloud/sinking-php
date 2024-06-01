import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 获取信息 GET /admin/person/log */
export async function getLogList(params: API.RequestParams = {}) {
    return get("/admin/log/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}