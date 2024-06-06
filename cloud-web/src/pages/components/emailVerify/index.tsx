import React, {useEffect, useRef, useState} from 'react';
import {App, Button, Col, Form,  Input, Row} from "antd";
import {FormInstance} from "antd/lib/form/hooks/useForm";
import {getCaptchaUrl} from "@/service/common/captcha";
import {sendEmail} from "@/service/common/email";
import Captcha, {CaptchaRef} from "../../../components/captcha";
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
    const captcha = useRef<CaptchaRef>({});
    const [sendCodeDisabled, setSendCodeDisabled] = useState(false);
    const [isEmailSendLoading, setIsEmailSendLoading] = useState(false);
    const getCode = (e: any) => {
        let time = 60;
        const timer = setInterval(() => {
            setSendCodeDisabled(true);
            e.target.innerHTML = `${time}秒后重新获取`;
            // eslint-disable-next-line no-plusplus
            time--;
            if (time <= 0) {
                getCaptchaUrl();
                setSendCodeDisabled(false);
                e.target.innerHTML = ' 获取验证码';
                time = 0;
                clearInterval(timer);
            }
        }, 1000);
    };

    return (
        <>
            <Captcha ref={captcha}/>
            <Form form={form} name="control-hooks" onFinish={async (values: any) => {
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
                                setIsEmailSendLoading(true);
                                captcha?.current?.Show?.(async (res) => {
                                    await sendEmail({
                                        body: {
                                            captcha_id: res?.randstr,
                                            captcha_code: res?.ticket,
                                            email: email,
                                        },
                                        onSuccess: (r) => {
                                            message?.success(r?.message)
                                            setIsEmailSendLoading(false);
                                            getCode(e)
                                        },
                                        onFail: (r) => {
                                            message?.error(r?.message)
                                            setIsEmailSendLoading(false);
                                        }
                                    })
                                }, () => {
                                    message?.warning("请完成验证码认证")
                                    setIsEmailSendLoading(false);
                                })
                            }}>
                                获取验证码
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
                {bottomNodes}
            </Form>
        </>
    );
};

export default EmailVerify;
