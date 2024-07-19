// @ts-ignore
import {request} from 'umi';
import {get, post} from "@/utils/request";
import {API} from "../../../typings";

/** 密码登录 POST /auth/login/pwd */
export async function loginByPwd(params: API.RequestParams = {}) {
    return post("/auth/login/pwd", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 邮箱登录 POST /auth/login/email */
export async function loginByEmail(params: API.RequestParams = {}) {
    return post("/auth/login/email", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 短信登录 POST /auth/login/sms */
export async function loginBySms(params: API.RequestParams = {}) {
    return post("/auth/login/sms", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 退出登录 GET /auth/login/out */
export async function outLogin(params: API.RequestParams = {}) {
    return get("/auth/login/out", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 二维码登陆 GET /auth/login/qrLogin */
export async function qrLogin(params: API.RequestParams = {}) {
    return get("/auth/login/qrlogin", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 生成二维码 GET /auth/verify/qrcode */
export async function genQrCode(params?: {
    onFail: (r: any) => void;
    body: { captcha_id: string };
    onSuccess: (r: any) => void
}) {
    return get("/auth/verify/qrcode", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
