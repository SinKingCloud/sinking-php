import {API} from "../../../typings";
import {get} from "@/utils/request";
/** 获取通知列表 GET /user/notice/lists */
export async function getNoticeList(params?: {
    body: { page: number; web_id: string; place: string; page_size: number };
    onSuccess: (r: any) => void
}) {
    return get("/user/notice/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 获取通知列表 GET /user/notice/info */
export async function getNoticeInfo(params?: { body: { id: any }; onSuccess: (r: any) => void }) {
    return get("/user/notice/info", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
