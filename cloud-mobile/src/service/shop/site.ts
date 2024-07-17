import {API} from "../../../typings";
import {get, post} from "@/utils/request";

/** 获取商品站点信息 GET /user/shop/getSite */
export async function getSite(params: API.RequestParams = {}) {
    return get("/user/shop/getSite", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 开通网站 POST /admin/shop/buySite */
export async function buySite(params: API.RequestParams = {}) {
    return post("/user/shop/buySite", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}