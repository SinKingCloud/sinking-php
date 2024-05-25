import {post} from "@/utils/request";
import {API} from "../../../typings";

/** 修改资料 POST /admin/person/update */
export async function updateInfo(params: API.RequestParams = {}) {
    return post("/user/person/update", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 修改密码 POST /admin/person/change_password */
export async function updatePassword(params: API.RequestParams = {}) {
    return post("/user/person/change_password", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 修改邮箱 POST /admin/person/change_email */
export async function updateEmail(params: API.RequestParams = {}) {
    return post("/user/person/change_email", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}
/** 修改手机 POST /admin/person/change_phone */
export async function updatePhone(params: API.RequestParams = {}) {
    return post("/user/person/change_phone", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}