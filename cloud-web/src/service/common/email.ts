import {API} from "../../../typings";
import {post} from "@/utils/request";

/** 发送邮箱验证码 POST /auth/verify/email */
export async function sendEmail(params?: {
    onFail: (r: any) => void;
    body: { captcha_id: string; captcha_code: any; email: any };
    onSuccess: (r: any) => void
}) {
    return post("/auth/verify/email", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}