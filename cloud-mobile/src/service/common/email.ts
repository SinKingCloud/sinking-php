import {API} from "../../../typings";
import {post} from "@/utils/request";

/** 发送邮箱验证码 POST /auth/verify/email */
export async function sendEmail(params: API.RequestParams = {}) {
    return post("/auth/verify/email", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}