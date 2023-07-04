import defaultSettings from "../../../config/defaultSettings";

/**
 * 获取上传地址
 */
export function getUploadUrl(): string {
  return defaultSettings.api + "/auth/upload/file"
}
