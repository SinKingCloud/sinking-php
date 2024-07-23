import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 获取数据 GET /admin/count/all */
export async function getCount(params: API.RequestParams = {}) {
    return get("/admin/count/all", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取数据 GET /master/count/topWeb */
export async function getTopWeb(params: API.RequestParams = {}) {
    return get("/admin/count/topWeb", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取数据 GET /admin/count/chart */
export async function getChart(params: API.RequestParams = {}) {
    return get("/admin/count/chart", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取数据 GET /admin/count/toDo */
export async function getToDo(params: API.RequestParams = {}) {
    return get("/admin/count/toDo", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}