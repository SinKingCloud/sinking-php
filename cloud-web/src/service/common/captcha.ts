import defaultSettings from "@/../config/defaultSettings";
import {getRandStr} from "@/utils/string";
/**
 * 获取验证码地址
 */
export function getCaptchaUrl(): any {
    const tempToken = getRandStr(32);
    return {
        url: defaultSettings.api + "/auth/verify/captcha?captcha_id=" + tempToken,
        token: tempToken,
    }
}
