import Settings from "../../../config/defaultSettings";
import request, {post} from "@/utils/request";
export function getUploadUrl(): string {
    return Settings.gateway + "/auth/upload/file"
}
// export async function uploadFile(params?: any) {
//     return post("/auth/upload/file", params?.body, params?.onSuccess, params?.onFail, params?.onFinally);
// }
export async function uploadFile(body: any, options?: { [key: string]: any }) {
    return request('/auth/upload/file', {
        method: 'POST',
        data: body,
        ...(options || {}),
    });
}
