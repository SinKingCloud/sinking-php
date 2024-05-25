import Settings from "../../../config/defaultSettings";
import {API} from "../../../typings";
import {post} from "@/utils/request";

export function getUploadUrl(): string {
    return Settings.api + "/auth/upload/file"
}

export async function uploadFile(params: API.RequestParams = {}) {
    return post("/auth/upload/file", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}