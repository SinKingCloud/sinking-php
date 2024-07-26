import React, {useRef, useState} from 'react'
import {Body} from "@/components";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {Button, Card, Form, Input, Toast} from "antd-mobile";
import {sendSms} from "@/service/common/sms";
import {createStyles} from "antd-style";
import {useModel} from "umi";
import {updatePassword} from "@/service/person/update";
import {historyPush} from "@/utils/route";
import {deleteHeader} from "@/utils/auth";

const useStyles = createStyles(({css, isDarkMode, token}): any => {
    const border = isDarkMode ? "1px solid rgb(40,40,40) !important" : "1px solid #eeeeee !important"
    return {
        label: css`
            .adm-list-item-content-prefix {
                font-size: 12px !important;
                width: 65px
            } ,
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
        head: {
            backgroundColor: `${token.colorPrimary} !important`, color: "#fff"
        },
        extra: {
            fontSize: "12px", color: token.colorPrimary, "--border-width": "0px", padding: "0px"
        },
        btn1: {
            "--background-color": token.colorPrimary, "--border-color": token.colorPrimary, fontWeight: 600,
        },
        num:{
            color:"red",fontWeight:600
        },
        p:{
            textAlign:"center",
            fontSize:"13px",
            color:"rgba(0.0.0.0.8)",
            margin:0
        },
        sp:{
            fontSize:"11px",
            color:"#b3b3b3",
            lineHeight:1.3,
            textAlign:"center"
        },

    }
})
export default () => {
    const captcha = useRef<CaptchaRef>({});
    const [form] = Form.useForm()
    const {styles: {label, body, btn, head, extra, btn1,p,num,sp}} = useStyles();
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
        if (values?.sms_code == undefined || values?.sms_code == "") {
            Toast?.show({
                content: "请输入验证码",
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
        const code = values?.sms_code
        delete values?.sms_code
        setBtnLoading(true)
        await updatePassword({
            body: {
                type: "phone",
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
    function hideMiddleDigits(phoneNumber) {
        const prefix = phoneNumber.slice(0, 3);
        const suffix = phoneNumber.slice(-2);
        const middle = '******';
        return prefix + middle + suffix;
    }
    const phoneNumber = hideMiddleDigits(user?.web?.phone.toString())
    return (
        <Body title={"手机号码验证"} headClassNames={head} titleStyle={{color: "#fff"}}>
            <Captcha ref={captcha}/>
            <Card>
                <p className={p}>当前账号的绑定的手机为：
                    <span className={num}>{phoneNumber}</span>
                </p>
                <p className={sp}>如未绑定手机号，也可使用邮箱验证修改密码,<a onClick={()=>historyPush("user.person.emailVerify")}>点击跳转</a></p>
            </Card>
            <Card>
                <Form form={form} className={body} onFinish={formFinish}>
                    <Form.Item label='验证码' name="sms_code" className={label}
                               extra={<Button loading={smsLoading} disabled={sendCodeDisabled} className={extra}
                                              onClick={(e) => {
                                                  const phone = user?.web?.phone
                                                  if (phone == undefined || phone == "") {
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
                        <Input placeholder='请输入短信验证码' clearable/>
                    </Form.Item>
                    <Form.Item name="password" label="账户新密码" className={label}>
                        <Input placeholder="请输入新密码" type="password"/>
                    </Form.Item>
                    <Form.Item className={btn}>
                        <Button type="submit" loading={btnLoading} className={btn1} block color='primary'>修改</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Body>
    )

}