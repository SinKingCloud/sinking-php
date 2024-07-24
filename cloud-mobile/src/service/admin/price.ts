import {API} from "../../../typings";
import {get,post} from "@/utils/request";

/** 获取信息 GET /admin/price/my */
export async function getMy(params: API.RequestParams = {}) {
    return get("/admin/price/my", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取信息 GET /admin/price/getWeb */
export async function getWeb(params: API.RequestParams = {}) {
    return get("/admin/price/getWeb", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 更新信息 POST /admin/price/setWeb */
export async function setWeb(params: API.RequestParams = {}) {
    return post("/admin/price/setWeb", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}