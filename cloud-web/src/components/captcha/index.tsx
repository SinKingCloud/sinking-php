import React from "react";
//@ts-ignore
import Script from 'react-load-script';

export interface CaptchaRef {
    Show?: (onSuccess: (res: any) => void, onFail: (res: any) => void) => void;
}

const Captcha = React.forwardRef<CaptchaRef>((props, ref) => {

    /**
     * 显示验证码
     * @param onSuccess 成功回调
     * @param onFail 失败回调
     */
    const show = (onSuccess: (res: any) => void = undefined, onFail: (res: any) => void = undefined) => {
        // @ts-ignore
        const captcha = new TencentCaptcha('2046626881', (res) => {
            if (res.ret == 0) {
                onSuccess?.(res);

            } else {
                onFail?.(res);
            }
        });
        captcha?.show();
    }

    React.useImperativeHandle(ref, () => ({
        Show: show,
    }));

    return (
        <Script url={"https://ssl.captcha.qq.com/TCaptcha.js"}/>
    );
});
export default Captcha;