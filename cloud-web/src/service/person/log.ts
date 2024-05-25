import {API} from "../../../typings";
import {get} from "@/utils/request";
export async function getLogList(params: API.RequestParams = {}) {
    return get("/user/log/lists", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}