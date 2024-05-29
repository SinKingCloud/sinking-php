import {API} from "../../../typings";
import {get} from "@/utils/request";

/** 获取数据 GET /master/count/all */
export async function getCount(params: API.RequestParams = {}) {
    return get("/master/count/all", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取数据 GET /master/count/topWeb */
export async function getTopWeb(params?: {
    end_date: string;
    limit: number;
    order_by: string;
    type: number;
    start_date: string
}) {
    return get("/master/count/topWeb", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取数据 GET /master/count/chart */
export async function getChart(params?: { end_date: string; type: number; start_date: string }) {
    return get("/master/count/chart", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取数据 GET /master/count/toDo */
export async function getToDo(params: API.RequestParams = {}) {
    return get("/master/count/toDo", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}