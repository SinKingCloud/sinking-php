import Settings from "../../../config/defaultSettings";
import request, {post} from "@/utils/request";
import {API} from "../../../typings";

export function getUploadUrl(): string {
    return Settings.gateway + "/auth/upload/file"
}

export async function uploadFile(params: API.RequestParams = {}) {
    return post("/auth/upload/file", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}