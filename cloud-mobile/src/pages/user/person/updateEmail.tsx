
import React, {useRef, useState} from 'react'
import {Body} from "@/components";
import {Button, Form, Input, Toast} from "antd-mobile";
import {updateEmail} from "@/service/person/update";
import {useModel} from "umi";
import {createStyles} from "antd-style";
import {sendEmail} from "@/service/common/email";
import Captcha, {CaptchaRef} from "@/components/captcha";
const useStyles = createStyles(({token, isDarkMode, css}): any => {
    const border = isDarkMode ? "1px solid rgb(40,40,40) !important" : "1px solid #eeeeee !important"
    return {
        label: css`
            .adm-list-item-content-prefix {
                font-size: 12px !important;
                width: 65px
            }
        ,
        . adm-form-item-label {
            line-height: 2;
            margin-bottom: 6px !important;
        },
        . adm-list-item-content {
            border-bottom: ${border};
            border-top: none !important;
        },
        . adm-input-element {
            font-size: 12px !important;
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
                paddingRight:"12px"
            },
            ".adm-input-element": {
                fontSize: "12px !important"
            },
        },
        butt:{
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing:"1px"
        },
        sms:{
            fontSize: "12px",
            color: token.colorPrimary,
            "--border-width": "0px",
            padding: "0px"
        },
        head:{
            backgroundColor: `${token.colorPrimary} !important`,
            color:"#fff"
        }
    }
})
export default () => {
    const {styles: {label, btn, body,butt,sms,head}} = useStyles()
    const [form] = Form.useForm()
    const user = useModel("user")
    const captcha = useRef<CaptchaRef>({});
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
     * 修改邮箱账号
     */
    const [emailLoading, setEmailLoading] = useState(false)
    const emailFinish = async (values: any) => {
        if (values?.email == undefined || values?.email == "") {
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
        if (values?.email_code == undefined || values?.email_code == "") {
            Toast.show({
                content: "验证码不能为空",
                position: "top"
            });
            return;
        }
        setEmailLoading(true)
        await updateEmail({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast.show({
                    content: r?.message,
                    position: 'top',
                })
                user?.refreshWebUser()
            },
            onFail: (r: any) => {
                Toast.show({
                    content: r?.message || "修改失败",
                    position: "top"
                })
            },
            onFinally: () => {
                setEmailLoading(false)
            }
        })
    }
    return (
        <Body space={true} title="修改邮箱" headClassNames={head} titleStyle={{color:"#fff"}} showBack={true}>
            <Captcha ref={captcha}/>
            <Form form={form} className={body} onFinish={emailFinish}>
                <Form.Item name="email" label="邮箱" className={label}>
                    <Input placeholder="请输入新邮箱账号" clearable/>
                </Form.Item>
                <Form.Item label='验证码' name="email_code" className={label}
                           extra={<Button loading={smsLoading} disabled={sendCodeDisabled} className={sms}
                                          onClick={(e) => {
                                              const email = form.getFieldValue("email")
                                              if (email == undefined || email == "") {
                                                  Toast.show({
                                                      content: "请输入邮箱",
                                                      icon: "fail"
                                                  })
                                                  return
                                              }
                                              setSmsLoading(true)
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
                    <Input placeholder='请输入邮箱验证码' clearable/>
                </Form.Item>
                <Form.Item className={btn}>
                    <Button type="submit" block color={"primary"} loading={emailLoading} className={butt}>修改</Button>
                </Form.Item>
            </Form>
        </Body>
    )
}