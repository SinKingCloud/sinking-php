import React, {useRef, useState} from 'react'
import {Body} from "@/components";
import {Button, Form, Input, Toast,Card} from "antd-mobile";
import {sendSms} from "@/service/common/sms";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {updatePhone} from "@/service/person/update";
import {useModel} from "@@/exports";
import {createStyles} from "antd-style";
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
                paddingRight: "12px"
            },
            ".adm-input-element": {
                fontSize: "12px !important"
            },
        },
        butt: {
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing: "1px"
        },
        sms: {
            fontSize: "12px",
            color: token.colorPrimary,
            "--border-width": "0px",
            padding: "0px"
        },
        head: {
            backgroundColor: `${token.colorPrimary} !important`,
            color: "#fff"
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
            lineHeight:1.3
        }
    }
})
export default () => {
    const {styles: {label, btn, body,butt,sms,head,p,num,sp}} = useStyles()
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
     * 修改手机号码
     */
    const [phoneLoading, setPhoneLoading] = useState(false)
    const phoneFinish = async (values: any) => {
        if (values?.phone == undefined || values.phone == "") {
            Toast.show({
                content: "手机号不能为空",
                position: "top"
            })
            return
        } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(values.phone)) {
            Toast.show({
                content: "请输入正确的手机号",
                position: "top"
            })
            return
        }
        if (values?.sms_code == undefined || values.sms_code == "") {
            Toast.show({
                content: "验证码不能为空",
                position: "top"
            })
            return
        }
        setPhoneLoading(true)
        await updatePhone({
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
                setPhoneLoading(false)
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
        <Body space={true} title="修改手机" headClassNames={head} titleStyle={{color:"#fff"}} showBack={true} >
            <Captcha ref={captcha}/>
            <Card>
                <p className={p}>当前账号的绑定的手机为：
                    <span className={num}>{phoneNumber || "未设置"}</span>
                </p>
                <p className={sp}>如网站显示的手机号与此页不同，请以此页显示为准，网站显示的可能为缓存内容，如需更换手机号可在下方修改即可</p>
            </Card>
            <Form form={form} className={body} onFinish={phoneFinish}>
                <Form.Item name="phone" label="手机号码" className={label}>
                    <Input placeholder="请输入新手机号码" clearable/>
                </Form.Item>
                <Form.Item label='验证码' name="sms_code" className={label}
                           extra={<Button loading={smsLoading}
                                          disabled={sendCodeDisabled} className={sms}
                                          onClick={(e) => {
                                              const phone = form.getFieldValue("phone")
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
                <Form.Item className={btn}>
                    <Button type="submit" block color="primary" loading={phoneLoading} className={butt}>修改</Button>
                </Form.Item>
            </Form>
        </Body>
    )
}