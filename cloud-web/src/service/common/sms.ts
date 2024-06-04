
import {post} from "@/utils/request";

/** 发送短信验证码 POST /auth/verify/sms */
export async function sendSms(params?: {
    onFail: (r: any) => void;
    body: { captcha_id: string; phone: any; captcha_code: any };
    onSuccess: (r: any) => void
}) {
    return post("/auth/verify/sms", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}