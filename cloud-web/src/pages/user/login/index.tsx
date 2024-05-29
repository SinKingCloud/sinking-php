import {LockOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined} from '@ant-design/icons';
import {Alert, App, Button, Checkbox, Col, Form, Image, Input, Row, Spin, Tabs, TabsProps} from 'antd';
import React, {useEffect, useState} from 'react';
import {Body, Footer} from '@/layouts/components';
// @ts-ignore
import {history, useLocation, useModel} from "umi";
import {getCaptchaUrl} from "@/service/common/captcha";
import {genQrCode, loginByEmail, loginByPwd, loginBySms, qrLogin} from "@/service/user/login";
import {setLoginToken} from "@/utils/auth";
import {sendEmail} from "@/service/common/email";
// @ts-ignore
import QRCode from "qrcode.react/lib";
import {getRandStr, qqJumpUrl} from "@/utils/string";
import {sendSms} from "@/service/common/sms";
import {createStyles, useResponsive} from "antd-style";
import Settings from "../../../../config/defaultSettings";
import {historyPush} from "@/utils/route";

const useStyles = createStyles(({css, token, responsive}): any => {
    return {
        container: {
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "auto",
            backgroundImage: "url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center 110px",
            backgroundSize: "100%",
        },
        content: {
            flex: 1,
            padding: "32px 0"
        },
        main: css`
            width: 328px;
            margin: 0 auto;

            ${responsive.sm} {
                width: 95%;
                max-width: 300px;
            }
        `,
        top: {
            textAlign: "center"
        },
        header: {
            height: 40,
            lineHeight: "40px",
            a: {
                textDecoration: "none"
            }
        },
        logo: {
            height: 40,
            marginRight: 16,
            verticalAlign: "top",
        },
        desc: {
            marginTop: 12,
            marginBottom: 20,
            color: "@text-color-secondary",
            fontSize: 14,
        },
        other: {
            marginTop: "24px",
            lineHeight: "22px",
            textAlign: "left",
            register: {
                float: "right"
            }
        },
        border_corner: {
            zIndex: 2500,
            position: "absolute",
            width: "19px",
            height: "19px",
            background: "rgba(0, 0, 0, 0)",
            border: "5px solid #0051eb"
        },
        border_corner_left_top: {
            top: "-3px",
            left: "-3px",
            borderRight: "none",
            borderBottom: "none",
            borderTopLeftRadius: "10px"
        },

        border_corner_right_top: {
            top: "-3px",
            right: "-3px",
            borderLeft: "none",
            borderBottom: "none",
            borderTopRightRadius: "10px"
        },

        border_corner_left_bottom: {
            bottom: "-3px",
            left: "-3px",
            borderRight: "none",
            borderTop: "none",
            borderBottomLeftRadius: "10px"
        },

        border_corner_right_bottom: {
            bottom: "-3px",
            right: "-3px",
            borderLeft: "none",
            borderTop: "none",
            borderBottomRightRadius: "10px"
        }
    };
});

const Index: React.FC = () => {
    const {
        styles: {
            container, content, top, header, logo, desc, border_corner, main,
            border_corner_left_top, border_corner_right_top, border_corner_left_bottom, border_corner_right_bottom
        }
    } = useStyles();
    const {message} = App.useApp()
    /**
     * 登陆方式
     */
    const [type, setType] = useState<string>('account');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSendLoading, setIsEmailSendLoading] = useState(false);
    const [isSmsSendLoading, setIsSmsSendLoading] = useState(false);
    const [isRead, setIsRead] = useState(true);
    /**
     * 表单
     */
    const [form] = Form.useForm();
    /**
     * 验证码信息
     */
    const [token, setToken] = useState<string>("");
    const [captchaUrl, setCaptchaUrl] = useState<string>("");
    /**
     * 加载验证码
     */
    const changeCaptcha = () => {
        const cap = getCaptchaUrl();
        setToken(cap.token);
        setCaptchaUrl(cap.url);
        form.setFieldsValue({captcha_code: ""});
    }
    /**
     * 获取当前用户信息
     */
    const web = useModel("web")
    const [sendCodeDisabled, setSendCodeDisabled] = useState(false);
    const getCode = (e: any) => {
        let time = 60;
        const timer = setInterval(() => {
            setSendCodeDisabled(true);
            e.target.innerHTML = `${time}秒后重新获取`;
            // eslint-disable-next-line no-plusplus
            time--;
            if (time <= 0) {
                setSendCodeDisabled(false);
                e.target.innerHTML = ' 获取验证码';
                time = 0;
                clearInterval(timer);
            }
        }, 1000);
    };
    /**
     * 扫码登陆
     */
    const {mobile} = useResponsive()
    const [isMobile, setIsMobile] = useState("pc")
    useEffect(() => {
        if (mobile) {
            setIsMobile("mobile")
        } else {
            setIsMobile("pc")
        }
    }, [isMobile])
    const [qrcode, setQrcode] = useState("");
    const [qrcodeLoading, setQrcodeLoading] = useState(true);
    const [qrcodeMessage, setQrcodeMessage] = useState("正在生成二维码");
    const location = useLocation();
    const queryQrCodeStatus = (id?: string) => {
        if (localStorage.getItem("captcha_id") != id || location.pathname != "/user/login") {
            return;
        }
        qrLogin({
            body: {
                captcha_id: id,
                device: isMobile
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    setQrcodeLoading(true);
                    localStorage.removeItem("captcha_id");
                    setQrcodeMessage("验证成功,正在登陆");
                    setLoginToken(isMobile, r?.data?.token);
                    historyPush("user.dashboard");
                    localStorage.removeItem("redirect");
                    setQrcode("");
                    setQrcodeLoading(false);
                    message?.success(r?.message || "登陆成功,正在跳转");
                }
            },
            onFail: (r: any) => {
                if (r?.code != 200) {
                    if (r?.data?.code == -1) {
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        getQrCode();
                    } else if (r?.data?.code == 0) {
                        setTimeout(() => {
                            queryQrCodeStatus(id);
                        }, 1000)
                    }
                }
            }
        })
    }
    const getQrCode = () => {
        const tempToken = getRandStr(32);
        setQrcodeLoading(true);
        setQrcodeMessage("正在生成二维码");
        genQrCode({
            body: {
                captcha_id: tempToken,
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    localStorage.setItem("captcha_id", tempToken);
                    setQrcodeLoading(false);
                    setQrcode(r?.data);
                    setQrcodeMessage("请扫描二维码");
                    queryQrCodeStatus(tempToken);
                }
            },
            onFail: (r: any) => {
                if (r?.code != 200) {
                    setQrcodeMessage(r?.message || "获取二维码失败");
                }
            }
        });
    }

    /**
     * 初始化数据
     */
    useEffect(() => {
        changeCaptcha();
    }, []);
    const items: TabsProps['items'] = [
        {
            key: 'account',
            label: '密码登录',
        },
        {
            key: 'phone',
            label: '短信登录',
        },
        {
            key: 'qrcode',
            label: '扫码登录',
        },
        {
            key: 'email',
            label: '邮箱登录',
        },
    ];
    return (
        <Body breadCrumb={false}>
            <div className={container}>
                <div className={content}>
                    <div className={top}>
                        <div className={header}>
                            <img alt='logo' className={logo}
                                 src={web?.info?.logo || ((Settings?.basePath || '/') + 'logo.svg')}/>
                            <span style={{
                                fontSize: "30px",
                                fontWeight: "bolder"
                            }}>{web?.info?.name || Settings?.title}</span>
                        </div>
                        <div className={desc}>
                            {web?.info?.name || Settings?.title}欢迎您的使用
                        </div>
                    </div>
                    <div className={main}>
                        <Tabs items={items} activeKey={type} onChange={(key) => {
                            setType(key);
                            if (key == "qrcode") {
                                getQrCode();
                            }
                        }}/>
                        <Form form={form} size={"large"} onFinish={(values: any) => {
                            if (!isRead) {
                                message?.error("请阅读并同意《用户使用条款》协议")
                                return;
                            }
                            values.device = isMobile;
                            let login = loginByPwd;
                            if (type == "account") {
                                if (values.account == undefined || values.account.length < 5) {
                                    message?.error("请输入正确的账户名");
                                    return;
                                }
                                if (values.password == undefined || values.password?.length <= 5) {
                                    message?.error("请输入正确的密码");
                                    return;
                                }
                            } else if (type == 'email') {
                                values.captcha_id = token;
                                login = loginByEmail;
                                if (!/^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/.test(values?.email)) {
                                    message?.error("请输入正确的邮箱");
                                    return;
                                }
                                if (values?.email_code == undefined || values?.email_code?.length != 6) {
                                    message?.error("请输入正确的邮箱验证码");
                                    return;
                                }
                                if (values?.captcha_code == undefined || values?.captcha_code?.length != 4) {
                                    message?.error("请输入图形验证码");
                                    return;
                                }
                            } else if (type == 'phone') {
                                values.captcha_id = token;
                                login = loginBySms;
                                if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(values.phone)) {
                                    message?.error("请输入正确的邮箱");
                                    return;
                                }
                                if (values.sms_code == undefined || values.sms_code?.length != 6) {
                                    message?.error("请输入正确的邮箱验证码");
                                    return;
                                }
                                if (values.captcha_code == undefined || values.captcha_code?.length != 4) {
                                    message?.error("请输入图形验证码");
                                    return;
                                }
                            } else {
                                message?.error("不支持该登录方式");
                                return;
                            }
                            setIsLoading(true);
                            login({
                                body: {
                                    ...values
                                },
                                onSuccess: (r: any) => {
                                    if (r?.code == 200) {
                                        localStorage.removeItem("captcha_id");
                                        setLoginToken(isMobile, r?.data?.token);
                                        message?.success(r?.message);
                                        setIsLoading(false);
                                        historyPush("user.dashboard");
                                        localStorage.removeItem("redirect");
                                    }
                                },
                                onFail: (r: any) => {
                                    if (r?.code == 500) {
                                        setIsLoading(false);
                                        changeCaptcha();
                                        message?.error(r?.message || "请求失败")
                                    }
                                }
                            });
                        }}>
                            {type === 'account' && (
                                <>
                                    <Form.Item name='account'>
                                        <Input prefix={<UserOutlined className='site-form-item-icon'/>}
                                               placeholder='请输入账户或邮箱或手机号' size={'large'}/>
                                    </Form.Item>
                                    <Form.Item name='password'>
                                        <Input type={"password"}
                                               prefix={<LockOutlined className='site-form-item-icon'/>}
                                               size={'large'}
                                               placeholder='请输入账号密码'/>
                                    </Form.Item></>
                            )}
                            {(type === 'email' || type === 'phone') && (
                                <>
                                    {type == 'email' && <>
                                        <Form.Item name='email'>
                                            <Input prefix={<MailOutlined className='site-form-item-icon'/>}
                                                   size={'large'}
                                                   placeholder='请输入邮箱'/>
                                        </Form.Item>
                                        <Form.Item style={{marginBottom: "0px"}}>
                                            <Row gutter={4} wrap={false}>
                                                <Col flex='7'>
                                                    <Form.Item name='email_code'>
                                                        <Input prefix={<LockOutlined className='site-form-item-icon'/>}
                                                               placeholder='邮箱验证码'
                                                               size={'large'}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col>
                                                    <Button size={'large'}
                                                            loading={isEmailSendLoading}
                                                            onClick={(e) => {
                                                                const email = form.getFieldValue("email");
                                                                if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
                                                                    message?.error("请输入正确的邮箱")
                                                                    return;
                                                                }
                                                                const captcha_code = form.getFieldValue("captcha_code");
                                                                if (captcha_code == undefined || captcha_code.length != 4) {
                                                                    message?.error("请输入正确的图形验证码")
                                                                    return;
                                                                }
                                                                setIsEmailSendLoading(true);
                                                                sendEmail({
                                                                    body: {
                                                                        email: email,
                                                                        captcha_id: token,
                                                                        captcha_code: captcha_code
                                                                    },
                                                                    onSuccess: (r: any) => {
                                                                        if (r?.code == 200) {
                                                                            getCode(e);
                                                                            setIsEmailSendLoading(false)
                                                                            message?.success(r?.message);
                                                                        }
                                                                    },
                                                                    onFail: (r: any) => {
                                                                        if (r?.code == 500) {
                                                                            setIsEmailSendLoading(false)
                                                                            message?.error(r.message || "请求失败")
                                                                            form.setFieldsValue({captcha: ""});
                                                                            changeCaptcha()
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            disabled={sendCodeDisabled}>获取验证码</Button>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </>}
                                    {type == 'phone' && <>
                                        <Form.Item name='phone'>
                                            <Input prefix={<UserOutlined className='site-form-item-icon'/>}
                                                   size={'large'}
                                                   placeholder='请输入手机号'/>
                                        </Form.Item>
                                        <Form.Item style={{marginBottom: "0px"}}>
                                            <Row gutter={4} wrap={false}>
                                                <Col flex='7'>
                                                    <Form.Item name='sms_code'>
                                                        <Input prefix={<LockOutlined className='site-form-item-icon'/>}
                                                               placeholder='短信验证码'
                                                               size={'large'}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col>
                                                    <Button size={'large'}
                                                            loading={isSmsSendLoading}
                                                            onClick={(e) => {
                                                                const phone = form.getFieldValue("phone");
                                                                if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
                                                                    message?.error("请输入正确的手机号")
                                                                    return;
                                                                }
                                                                const captcha_code = form.getFieldValue("captcha_code");
                                                                if (captcha_code == undefined || captcha_code.length != 4) {
                                                                    message?.error("请输入正确的图形验证码")
                                                                    return;
                                                                }
                                                                setIsSmsSendLoading(true);
                                                                sendSms({
                                                                    body: {
                                                                        phone: phone,
                                                                        captcha_id: token,
                                                                        captcha_code: captcha_code
                                                                    },
                                                                    onSuccess: (r: any) => {
                                                                        if (r?.code == 200) {
                                                                            getCode(e);
                                                                            setIsSmsSendLoading(false);
                                                                            message?.success(r.message);
                                                                        }
                                                                    },
                                                                    onFail: (r: any) => {
                                                                        if (r?.code == 500) {
                                                                            message?.error(r.message || "请求失败")
                                                                            setIsSmsSendLoading(false);
                                                                            changeCaptcha();
                                                                            form.setFieldsValue({captcha: ""});
                                                                        }
                                                                    }
                                                                })
                                                            }}
                                                            disabled={sendCodeDisabled}>获取验证码</Button>
                                                </Col>
                                            </Row>
                                        </Form.Item>
                                    </>}
                                    <Row>
                                        <Col span={16}>
                                            <Form.Item
                                                name="captcha_code"
                                            >
                                                <Input
                                                    prefix={<SafetyCertificateOutlined
                                                        className="site-form-item-icon"/>}
                                                    placeholder="图形验证码"
                                                    type="number"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={7} offset={1}>
                                            <Image
                                                height={40}
                                                preview={false}
                                                src={captchaUrl}
                                                onClick={() => {
                                                    changeCaptcha()
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </>
                            )}
                            {type == "qrcode" && (
                                <>
                                    <Form.Item>
                                        <Alert message="请使用手机QQ扫码下方二维码" type="info" showIcon/>
                                    </Form.Item>
                                    <Form.Item>
                                        <div style={{
                                            border: "1px solid #e1e1e1",
                                            backgroundColor: "#fbfbfb",
                                            borderRadius: "10px",
                                            width: "125px",
                                            height: "125px",
                                            margin: "0px auto",
                                            position: "relative"
                                        }}>
                                            <div
                                                className={border_corner + " " + border_corner_right_bottom}></div>
                                            <div
                                                className={border_corner + " " + border_corner_right_top}></div>
                                            <div
                                                className={border_corner + " " + border_corner_left_bottom}></div>
                                            <div
                                                className={border_corner + " " + border_corner_left_top}></div>
                                            <Spin spinning={qrcodeLoading || qrcode == ""}>
                                                <QRCode
                                                    style={{margin: "14px"}}
                                                    value={qrcode}
                                                    size={95}
                                                    fgColor="#000000"
                                                />
                                            </Spin>
                                        </div>
                                        <div
                                            style={{
                                                textAlign: "center",
                                                margin: "15px auto -15px auto",
                                                color: "#8c8c8c"
                                            }}>
                                            {qrcodeMessage || "请扫描二维码"}
                                        </div>
                                    </Form.Item>
                                    <Form.Item hidden={!isMobile} style={{textAlign: "center"}}>
                                        <Button type='primary' style={{maxWidth: "200px", marginTop: "10px"}}
                                                htmlType='button' block
                                                onClick={() => {
                                                    qqJumpUrl(qrcode);
                                                    message?.warning("验证完毕请回到此页面");
                                                }}>
                                            快捷登陆
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                            <Form.Item hidden={type != "account"} style={{marginTop: "-10px"}}>
                                <a onClick={() => {
                                    message?.warning("使用其他方式登陆自动创建账户")
                                }}>注册帐号</a>
                                <a style={{float: 'right',}} onClick={() => {
                                    message?.warning("请使用其他方式验证登陆后修改密码")
                                }}>忘记密码</a>
                            </Form.Item>
                            <Form.Item hidden={type == "qrcode"}>
                                <Button type='primary' loading={isLoading} htmlType='submit' size={'large'} block>
                                    登 录
                                </Button>
                            </Form.Item>
                            <Row hidden={type == "qrcode"}>
                                <Form.Item name="read">
                                    <Checkbox checked={isRead} onChange={(e) => {
                                        setIsRead(e.target.checked);
                                    }}>我已阅读并同意 <a href=''>《用户使用条款》</a>协议</Checkbox>
                                </Form.Item>
                            </Row>
                        </Form>
                    </div>
                </div>
                <Footer/>
            </div>
        </Body>

    );
};

export default Index;
