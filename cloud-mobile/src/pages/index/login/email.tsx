import {Body, Icon} from "@/components";
import {Ellipsis, Email, Message, Qrcode} from "@/components/icon";
import React, {useEffect, useRef, useState} from "react";
import {Col, Dropdown, Row} from "antd";
import {Button, Card, Checkbox, Form, Grid, Input, Toast} from "antd-mobile";
import {createStyles, useResponsive, useTheme} from "antd-style";
import {historyPush} from "@/utils/route";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {sendEmail} from "@/service/common/email";
import {loginByEmail} from "@/service/user/login";
import {setLoginToken} from "@/utils/auth";
import {useModel} from "umi";

const useStyles = createStyles(({css, isDarkMode, token}): any => {
    const border = isDarkMode ? "1px solid rgb(40,40,40) !important" : "1px solid #eeeeee !important"
    return {
        label: css`
            .adm-list-item-content-prefix {
                font-size: 12px !important;
                width: 65px
            }

        ,
        . adm-form-item-label {
            line-height: 2
        },
        . adm-list-item-content {
            border-bottom: ${border};
            border-top: none !important;
        },
        `,
        btn: {
            ".adm-list-item-content": {
                borderBottom: "none !important",
                borderTop: "none !important",
                paddingBlock: "9px",
                paddingRight: "0 !important"
            },
        },
        body: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
            ".adm-list-item": {
                paddingLeft: "0 !important"
            },
            ".adm-input-element": {
                fontSize: "12px !important"
            },
        },
        check: {
            ".adm-checkbox-icon": {
                height: "15px !important",
                width: "15px !important",
            }
        },
        tab: {
            fontSize: "14px",
            color: token.colorPrimary
        },
        card: {
            ".adm-card": {
                padding: "0 !important",
                lineHeight: 2.5
            }
        },
        icon:{
            marginRight: "5px"
        },
        sms:{
            fontSize: "12px",
            color: token.colorPrimary,
            "--border-width": "0px",
            padding: "0px"
        },
        head:{
            backgroundColor: `${token.colorPrimary} !important`, color: "#fff"
        },
        remember:{
            fontSize: "12px", marginRight: "10px"
        },
        gong:{
            fontSize: "11px", color: "gray"
        },
        butt:{
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing:"1px"
        }
    }
});

export default () => {
    const [form] = Form.useForm()
    const captcha = useRef<CaptchaRef>({});
    const {styles: {label, body, check, btn, tab, card,icon,sms,head,remember,gong,butt}} = useStyles();
    const items = [
        {
            key: "password",
            label: (
                <span onClick={() => historyPush('login')}><Icon type={Message} className={icon}/>密码登录</span>
            ),
        },
        {
            key: "qrcode",
            label: (
                <span onClick={() => historyPush('login.qrcode')}><Icon type={Qrcode} className={icon}/>扫码登录</span>
            ),
        },
        {
            key: "sms",
            label: (
                <span onClick={() => historyPush('login.sms')}><Icon type={Email} className={icon}/>短信登录</span>
            ),
        },
    ]
    /**
     * 获取邮箱验证码
     */
    const [emailLoading, setEmailLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const getCode = (e: any) => {
        let time = 60;
        const timer = setInterval(() => {
            setDisabled(true);
            e.target.innerHTML = `${time}秒后重新获取`;
            time--;
            if (time <= 0) {
                setDisabled(false);
                e.target.innerHTML = ' 获取验证码';
                time = 0;
                clearInterval(timer);
            }
        }, 1000);
    };
    /**
     * 表单提交
     */
    const [loading, setLoading] = useState(false);
    const user = useModel("user");
    const formFinish = async (values: any) => {
        if (values?.email == undefined || values.email == "") {
            Toast.show({
                content: "邮箱不能为空",
                position: "top"
            });
            return;
        } else if (!/^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/.test(values?.email)) {
            Toast.show({
                content: "邮箱格式不正确",
                position: "top"
            });
            return
        }
        if (values?.email_code == undefined || values.email_code == "") {
            Toast.show({
                content: "验证码不能为空",
                position: "top"
            });
            return;
        }
        setLoading(true)
        captcha?.current?.Show?.(async (res) => {
            await loginByEmail({
                body: {
                    ...values,
                    captcha_id: res?.randstr,
                    captcha_code: res?.ticket,
                },
                onSuccess: (r: any) => {
                    setLoginToken("mobile", r?.data?.token);
                    user?.refreshWebUser(() => {
                        historyPush("user.index");
                        Toast.show({
                            content: r?.message,
                            icon: "success"
                        });
                    });
                },
                onFail: (r: any) => {
                    Toast.show({
                        content: r?.message || "登录失败",
                        icon: "fail"
                    });
                },
                onFinally: () => {
                    setLoading(false)
                }
            })
        }, () => {
            Toast.show({
                content: "请完成验证码认证",
                icon: "fail"
            })
            setLoading(false);
        });
    }
    const web = useModel("web")
    return (
        <Body title="邮箱登录" headClassNames={head} titleStyle={{color: "#fff"}} right={
            <Dropdown menu={{items}} placement="bottomLeft" overlayStyle={{width: "max-content"}} arrow>
                <Icon type={Ellipsis} style={{fontSize: "18px", color: "#fff"}}/>
            </Dropdown>}>
            <Captcha ref={captcha}/>
            <Grid columns={1} gap={8}>
                <Grid.Item>
                    <Card>
                        <Form form={form} className={body} onFinish={formFinish}>
                            <Form.Item label='邮箱账号' name="email" className={label}>
                                <Input placeholder='请输入邮箱' clearable/>
                            </Form.Item>
                            <Form.Item label='验证码' name="email_code" className={label}
                                       extra={<Button loading={emailLoading} disabled={disabled} className={sms}
                                                      onClick={(e) => {
                                                          const email = form.getFieldValue("email")
                                                          if (email == undefined || email == "") {
                                                              Toast.show({
                                                                  content: "请输入邮箱",
                                                                  icon: "fail"
                                                              })
                                                              return
                                                          }
                                                          setEmailLoading(true)
                                                          captcha?.current?.Show?.(async (res) => {
                                                              await sendEmail({
                                                                  body: {
                                                                      captcha_id: res?.randstr,
                                                                      captcha_code: res?.ticket,
                                                                      email: email,
                                                                  },
                                                                  onSuccess: (r) => {
                                                                      Toast.show({
                                                                          content: r?.message,
                                                                          icon: "success"
                                                                      })
                                                                      getCode(e)
                                                                  },
                                                                  onFail: (r) => {
                                                                      Toast.show({
                                                                          content: r?.message,
                                                                          icon: "fail"
                                                                      })
                                                                  },
                                                                  onFinally: () => {
                                                                      setEmailLoading(false)
                                                                  }
                                                              })
                                                          }, () => {
                                                              Toast.show({
                                                                  content: "请完成验证码认证",
                                                                  icon: "fail"
                                                              })
                                                              setEmailLoading(false)
                                                          })
                                                      }}>发送验证码</Button>}>
                                <Input placeholder='请输入邮箱验证码' clearable/>
                            </Form.Item>
                            <Form.Item name="checked" className={label}>
                                <Checkbox className={check}>
                                    <span className={remember}>记住登录状态</span>
                                    <span className={gong}>（在公共设备登录时请不要勾选）</span>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item className={btn}>
                                <Button type={"submit"} loading={loading} className={butt} block color='primary'>登录</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card className={card}>
                        <Row justify={"space-around"}>
                            <Col onClick={() => historyPush('login')}><span className={tab}>密码登录</span></Col>
                            {web?.info?.reg_phone &&
                                <Col onClick={() => historyPush('login.sms')}><span
                                    className={tab}>短信登录</span></Col>}
                            {web?.info?.reg_qrlogin &&
                                <Col onClick={() => historyPush('login.qrcode')}><span
                                    className={tab}>扫码登录</span></Col>}
                        </Row>
                    </Card>
                </Grid.Item>
            </Grid>
        </Body>
    );
};
