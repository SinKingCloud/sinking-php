import React, {useEffect, useState} from 'react';
import {App, Button, Col, Form, Image, Input, Row} from "antd";
import {FormInstance} from "antd/lib/form/hooks/useForm";
import {getCaptchaUrl} from "@/service/common/captcha";
import {sendEmail} from "@/service/common/email";
export type EmailVerifyProps = {
    onFinish: (value?: any) => Promise<boolean | void>;
    form: FormInstance<any>;
    email?: string;
    topNodes?: React.ReactNode;
    bottomNodes?: React.ReactNode;
};

const EmailVerify: React.FC<EmailVerifyProps> = (props) => {
    const {onFinish, form, email, bottomNodes, topNodes} = props;
    const {message} = App.useApp()
    /**
     * 验证码信息
     */
    const [token, setToken] = useState<string>("");
    const [captchaUrl, setCaptchaUrl] = useState<string>("");
    const [isCaptchaHidden, setIsCaptchaHidden] = useState<boolean>(false);
    /**
     * 加载验证码
     */
    const changeCaptcha = () => {
        const cap = getCaptchaUrl();
        setToken(cap.token);
        setCaptchaUrl(cap.url);
    }

    const [sendCodeDisabled, setSendCodeDisabled] = useState(false);
    const [isEmailSendLoading, setIsEmailSendLoading] = useState(false);
    const getCode = (e: any) => {
        let time = 60;
        const timer = setInterval(() => {
            setIsCaptchaHidden(true)
            setSendCodeDisabled(true);
            e.target.innerHTML = `${time}秒后重新获取`;
            // eslint-disable-next-line no-plusplus
            time--;
            if (time <= 0) {
                getCaptchaUrl();
                setIsCaptchaHidden(false);
                setSendCodeDisabled(false);
                e.target.innerHTML = ' 获取验证码';
                time = 0;
                clearInterval(timer);
            }
        }, 1000);
    };

    useEffect(() => {
        changeCaptcha();
    }, []);
    return (
        <>
            <Form form={form} name="control-hooks" onFinish={async (values: any) => {
                values.token = token;
                await onFinish(values);
            }} labelAlign="right"
                  labelCol={{span: 6}}>
                {topNodes}
                <Form.Item name={"email_code"} label="邮箱验证码" rules={[{required: true, message: '请输入邮箱验证码',},]}>
                    <Row gutter={6} wrap={false}>
                        <Col flex={22}>
                            <Input placeholder="请输入邮箱验证码"/>
                        </Col>
                        <Col flex={2}>
                            <Button disabled={sendCodeDisabled} loading={isEmailSendLoading} onClick={(e) => {
                                if (!/^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/.test(email || '')) {
                                    message?.error("请输入正确的邮箱");
                                    return;
                                }
                                const captcha_code = form?.getFieldValue("captcha_code");
                                if (captcha_code == undefined || captcha_code.length != 4) {
                                    message?.error("请输入正确的图形验证码")
                                    return;
                                }
                                setIsEmailSendLoading(true);
                                sendEmail({
                                    body:{
                                        email: email?.toString() || "",
                                        captcha_id: token,
                                        captcha_code: captcha_code
                                    },
                                    onSuccess:(r:any)=>{
                                        setIsEmailSendLoading(false)
                                        if(r?.code == 200){
                                            getCode(e)
                                            message?.success(r?.message)
                                        }
                                    },
                                    onFail:(r:any)=>{
                                        if (r.code != 200) {
                                            message?.error(r?.message || "请求失败")
                                            changeCaptcha()
                                        }
                                    }
                                })
                            }}>
                                获取验证码
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item name={"captcha_code"} label="图形验证码" hidden={isCaptchaHidden}>
                    <Row gutter={6} wrap={false}>
                        <Col flex={20}>
                            <Input placeholder="请输入图形验证码"/>
                        </Col>
                        <Col flex={4}>
                            <Image
                                height={30}
                                width={70}
                                preview={false}
                                src={captchaUrl}
                                onClick={() => {
                                    changeCaptcha()
                                }}
                            />
                        </Col>
                    </Row>
                </Form.Item>
                {bottomNodes}
            </Form>
        </>
    );
};

export default EmailVerify;
