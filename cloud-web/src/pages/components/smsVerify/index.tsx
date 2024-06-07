import React, {useRef, useState} from 'react';
import {App, Button, Col, Form, Input, Row} from "antd";
import {FormInstance} from "antd/lib/form/hooks/useForm";
import {sendSms} from "@/service/common/sms";
import Captcha, {CaptchaRef} from "../../../components/captcha";

export type SmsVerifyProps = {
    onFinish: (value?: any) => Promise<boolean | void>;
    form: FormInstance;
    phone?: string;
    topNodes?: React.ReactNode;
    bottomNodes?: React.ReactNode;
};

const SmsVerify: React.FC<SmsVerifyProps> = (props) => {
    const {onFinish, form, phone, bottomNodes, topNodes} = props;
    const {message} = App.useApp()
    const captcha = useRef<CaptchaRef>({});
    const [isEmailSendLoading, setIsEmailSendLoading] = useState(false);
    return (
        <>
            <Captcha ref={captcha}/>
            <Form form={form} onFinish={async (values: any) => {
                await onFinish(values);
            }} labelAlign="right"
                  labelCol={{span: 6}}>
                {topNodes}
                <Form.Item name="sms_code" label="短信验证码" rules={[{required: true, message: '请输入短信验证码',},]}>
                    <Row gutter={6} wrap={false}>
                        <Col flex={22}>
                            <Input placeholder="请输入短信验证码"/>
                        </Col>
                        <Col flex={2}>
                            <Button loading={isEmailSendLoading} onClick={(e) => {
                                if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone || '')) {
                                    message?.error("请输入正确的手机号");
                                    return;
                                }
                                setIsEmailSendLoading(true);
                                captcha?.current?.Show?.(async (res) => {
                                    await sendSms({
                                        body: {
                                            captcha_id: res?.randstr,
                                            captcha_code: res?.ticket,
                                            phone: phone,
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
export default SmsVerify;
