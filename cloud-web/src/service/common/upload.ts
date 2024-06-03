import Settings from "../../../config/defaultSettings";
import {API} from "../../../typings";
import {post} from "@/utils/request";

export function getUploadUrl(): string {
    return Settings.gateway + "/auth/upload/file"
}

export async function uploadFile(params?: FormData) {
    return post("/auth/upload/file", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
}