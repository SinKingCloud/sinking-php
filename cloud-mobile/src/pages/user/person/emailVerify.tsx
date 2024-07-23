import React, {useRef, useState} from 'react'
import {Body} from "@/components";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {Button, Card, Form, Input, Toast} from "antd-mobile";
import {createStyles, useTheme} from "antd-style";
import {useModel} from "umi";
import { updatePassword} from "@/service/person/update";
import {historyPush} from "@/utils/route";
import {deleteHeader} from "@/utils/auth";
import {sendEmail} from "@/service/common/email";
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
            }
        },
    }
})
export default () => {
    const captcha = useRef<CaptchaRef>({});
    const [form] = Form.useForm()
    const [emailForm] = Form.useForm()
    const {styles: {label, body, btn}} = useStyles();
    const theme = useTheme()
    const user = useModel("user")
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
     */
    const [btnLoading, setBtnLoading] = useState(false)
    const formFinish = async (values: any) => {
        if (values?.email == undefined || values.email == "") {
            Toast.show({
                content: "邮箱不能为空",
                position: "top"
            })
            return
        } else if (!/^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/.test(values?.email)) {
            Toast.show({
                content: "邮箱格式不正确",
                position: "top"
            })
            return
        }
        if (values?.email_code == undefined || values?.email_code == "") {
            Toast.show({
                content: "验证码不能为空",
                position: "top"
            })
            return
        }
        if (values?.password == undefined || values?.password == "") {
            Toast?.show({
                content: "请输入新密码",
                position: "top"
            })
            return
        } else if (values.password.length > 20 || values.password.length < 6) {
            Toast?.show({
                content: "密码长度必须为6-20位之间",
                position: "top"
            })
            return
        }
        const code = values?.email_code
        delete values?.email_code
        setBtnLoading(true)
        await updatePassword({
            body: {
                type: "email",
                ...values,
                code: code
            },
            onSuccess: (r: any) => {
                Toast.show({
                    content: r?.message,
                    icon: "success"
                })
                user?.refreshWebUser(() => {
                    deleteHeader()
                    historyPush("login")
                })
            },
            onFail: (r: any) => {
                Toast?.show({
                    content: r?.message || "修改失败",
                    icon: "fail"
                })
            },
            onFinally: () => {
                setBtnLoading(false)
            }
        })
    }
    return (
        <Body title={"邮箱账号验证"} headStyle={{backgroundColor: theme.colorPrimary, color: "#fff"}}
              titleStyle={{color: "#fff"}}>
            <Captcha ref={captcha}/>
            {user?.web?.email == null && <Card>
                    <p style={{textAlign:"center"}}>还没有绑定邮箱账号，请先绑定邮箱账号</p>
                </Card> ||
                <Card>
                    <Form form={form} initialValues={{email: user?.web?.email}} className={body} onFinish={formFinish}>
                        <Form.Item label='邮箱账号' name="email" className={label}>
                            <Input placeholder='请输入邮箱账号' clearable/>
                        </Form.Item>
                        <Form.Item label='验证码' name="email_code" className={label}
                                   extra={<Button loading={smsLoading} disabled={sendCodeDisabled}
                                                  style={{
                                                      fontSize: "12px",
                                                      color: theme.colorPrimary,
                                                      "--border-width": "0px",
                                                      padding: "0px"
                                                  }}
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
                        <Form.Item name="password" label="账户新密码" className={label}>
                            <Input placeholder="请输入新密码" type={"password"}/>
                        </Form.Item>
                        <Form.Item className={btn}>
                            <Button type="submit" loading={btnLoading} style={{
                                "--background-color": theme.colorPrimary,
                                "--border-color": theme.colorPrimary,
                                fontWeight: 600,
                            }} block color='primary'>修改</Button>
                        </Form.Item>
                    </Form>
                </Card>
            }

        </Body>
    )

}