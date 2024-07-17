import {Body, Icon} from "@/components";
import {history} from "@@/core/history";
import {Ellipsis, Email, Message, Qrcode, Reg, Reset} from "@/components/icon";
import React, {useEffect, useRef, useState} from "react";
import {Dropdown} from "antd";
import {Button, Checkbox, Form, Input, Toast} from "antd-mobile";
import {createStyles, useResponsive} from "antd-style";
import {historyPush} from "@/utils/route";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {sendSms} from "@/service/common/sms";
import {loginBySms} from "@/service/user/login";
import {setLoginToken} from "@/utils/auth";

const useStyles = createStyles(({css,isDarkMode}): any => {
    const border = isDarkMode ? "1px solid rgb(70,70,70) !important" : "1px solid #eeeeee !important"
    return {
        label:css`
            .adm-list-item-content-prefix {
                font-size: 12px !important;
                width: 65px
            },
        .adm-input-element {
            font-size: 12px !important
        },
        .adm-form-item-label {
            line-height: 2
        },
        .adm-list-item-content {
            border-bottom: ${border};
            border-top: none !important;
            padding-block: 8px
        }
        `,
        btn: {
            ".adm-list-item-content": {
                borderBottom: "none !important",
                borderTop: "none !important",
                paddingBlock: "8px"
            },
        },
        body: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop:"none !important",
                borderBottom:"none !important",
            },
            marginBottom: "10px",
        },
        check: {
            ".adm-checkbox-icon": {
                height: "15px !important",
                width: "15px !important",
            }
        }
    }
})
const smsLoginPage = () => {
    const captcha = useRef<CaptchaRef>({});
    const [form] = Form.useForm()
    const {styles: {label, body, check, btn}} = useStyles();
    const items = [
        {
            key: "password",
            label: (
                <span onClick={() => historyPush('user.login')}><Icon type={Message} style={{marginRight: "5px"}}/>密码登录</span>
            ),
        },
        {
            key: "qrcode",
            label: (
                <span onClick={() => historyPush('login.qrLogin')}><Icon type={Qrcode} style={{marginRight: "5px"}}/>扫码登录</span>
            ),
        },
        {
            key: "email",
            label: (
                <span onClick={() => historyPush('login.emailLogin')}><Icon type={Email} style={{marginRight: "5px"}}/>邮箱登录</span>
            ),
        },
    ]
    const {mobile} = useResponsive()
    const [isMobile, setIsMobile] = useState("pc")
    useEffect(() => {
        if (mobile) {
            setIsMobile("mobile")
        } else {
            setIsMobile("pc")
        }
    }, [mobile]);
    /**
     * 获取验证码
     */
    const [sendCodeDisabled, setSendCodeDisabled] = useState(false);
    const [smsLoading, setSmsLoading] = useState(false)
    const getCode = (e: any) => {
        let time = 60;
        const timer = setInterval(() => {
            setSendCodeDisabled(true);
            e.target.innerHTML = `${time}秒后重新获取`;
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
     * 表单提交
     * @param values
     */
    const [btnLoading, setLoading] = useState(false)
    const formFinish = async (values: any) => {
        if(values?.phone == undefined || values.phone==""){
            Toast.show({
                content: "手机号不能为空",
                position:"top"
            })
            return
        }else if(!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(values.phone)){
            Toast.show({
                content: "请输入正确的手机号",
                position:"top"
            })
            return
        }
        if(values?.sms_code == undefined || values.sms_code==""){
            Toast.show({
                content: "验证码不能为空",
                position:"top"
            })
            return
        }
        setLoading(true)
            await loginBySms({
                body: {
                    ...values,
                },
                onSuccess: (r: any) => {
                    Toast.show({
                        content: r?.message,
                        icon: "success"
                    })
                    historyPush("user.index")
                    setLoginToken(isMobile, r?.data?.token);
                },
                onFail:(r:any)=>{
                    Toast.show({
                        content: r?.message || "登录失败",
                        icon: "fail"
                    })
                },
                onFinally:()=>{
                    setLoading(false)
                }
            })
    }
    return (
        <Body title={"手机短信登录"} headStyle={{backgroundColor: "rgb(92,165,214)", color: "#fff"}}
              titleStyle={{color: "#fff"}}
              bodyStyle={{padding: "10px"}} right={
            <Dropdown menu={{items}} placement="bottomLeft" overlayStyle={{width: "max-content"}} arrow>
                <Icon type={Ellipsis} style={{fontSize: "18px", color: "#fff"}}/>
            </Dropdown>
        }>
            <Captcha ref={captcha}/>
            <Form layout='horizontal' form={form} className={body} onFinish={formFinish}>
                <Form.Item label='手机号码' name="phone" className={label}>
                    <Input placeholder='请输入手机号码' clearable/>
                </Form.Item>
                <Form.Item label='验证码' name="sms_code" className={label}
                           extra={<Button loading={smsLoading} disabled={sendCodeDisabled}
                                          style={{fontSize: "12px", color: "#1b84cb", "--border-width": "0px"}}
                                          onClick={(e) => {
                                              const phone = form.getFieldValue("phone")
                                              if(phone== undefined || phone==""){
                                                   Toast.show({
                                                      content: "请输入手机号码",
                                                      icon: "fail"
                                                  })
                                                  return
                                              }

                                              setSmsLoading(true)
                                              captcha?.current?.Show?.(async (res) => {
                                                  await sendSms({
                                                      body: {
                                                          captcha_id: res?.randstr,
                                                          captcha_code: res?.ticket,
                                                          phone: phone,
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
                                                          setSmsLoading(false)
                                                      }
                                                  })
                                              }, () => {
                                                  Toast.show({
                                                      content: "请完成验证码认证",
                                                      icon: "fail"
                                                  })
                                                  setSmsLoading(false)
                                              })
                                          }}>发送验证码</Button>}>
                    <Input placeholder='请输入短信验证码'   clearable/>
                </Form.Item>
                <Form.Item name="checked" className={label}>
                    <Checkbox className={check}>
                        <span style={{fontSize: "12px", marginRight: "10px"}}>记住登录状态</span>
                        <span style={{fontSize: "11px", color: "gray"}}>（在公共设备登录时请不要勾选）</span>
                    </Checkbox>
                </Form.Item>
                <Form.Item className={btn}>
                    <Button type="submit" loading={btnLoading} style={{
                        "--background-color": "#5ca5d6",
                        "--border-color": "#5ca5d6",
                        fontSize: "15px",
                        fontWeight: 600,
                        marginBottom: "10px"
                    }} block color='primary'>登&nbsp;&nbsp;录</Button>
                </Form.Item>
            </Form>
            <ul style={{
                listStyle: "none",
                margin: 0,
                paddingBlock: "20px",
                borderRadius: "8px",
                paddingLeft: 0,
                display: "flex",
                fontSize: "12px",
                color: "#1b84cb",
                cursor:"pointer"
            }}>
                <li style={{width: "33.3%", borderRight: "0.5px solid #eeeeee", textAlign: "center"}}
                    onClick={() => historyPush('user.login')}>
                    密码登录
                </li>
                <li style={{width: "33.3%", borderRight: "0.5px solid #eeeeee", textAlign: "center"}}
                    onClick={() => historyPush('login.qrLogin')}>
                    扫码登录
                </li>
                <li style={{width: "33.3%", textAlign: "center"}}
                    onClick={() => historyPush('login.emailLogin')}>
                    邮箱登录
                </li>
            </ul>
        </Body>
    );
};

export default smsLoginPage;
