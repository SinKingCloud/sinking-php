import React, {useRef, useState} from 'react'
import {Body} from "@/components";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {Button, Card, Form, Input, Toast} from "antd-mobile";
import {sendSms} from "@/service/common/sms";
import {createStyles, useTheme} from "antd-style";
import {useModel} from "umi";
import {updatePassword} from "@/service/person/update";
import {historyPush} from "@/utils/route";
import {deleteHeader} from "@/utils/auth";
const useStyles = createStyles(({css,isDarkMode,token}): any => {
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
        .adm-input-element{
            font-size: 12px !important;
        }
        `,
        btn: {
            ".adm-list-item-content": {
                borderBottom: "none !important",
                borderTop: "none !important",
                paddingBlock: "9px",
                paddingRight:"0 !important"
            },

        },
        body: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop:"none !important",
                borderBottom:"none !important",
            },
            ".adm-list-item": {
                paddingLeft: "0 !important"
            },
        },
    }
})
export default () => {
    const captcha = useRef<CaptchaRef>({});
    const [form] = Form.useForm()
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
    const [btnLoading,setBtnLoading] = useState(false)
    const formFinish = async(values:any)=>{

        if(values?.phone==undefined || values?.phone==""){
            Toast?.show({
                content: "请输入手机号码",
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
        if(values?.sms_code==undefined || values?.sms_code==""){
            Toast?.show({
                content: "请输入验证码",
                position:"top"
            })
            return
        }
        if(values?.password==undefined || values?.password==""){
            Toast?.show({
                content: "请输入新密码",
                position:"top"
            })
            return
        }else if (values.password.length > 20 || values.password.length < 6) {
            Toast?.show({
                content: "密码长度必须为6-20位之间",
                position:"top"
            })
            return
        }
        const code = values?.sms_code
        delete values?.sms_code
        setBtnLoading(true)
        await updatePassword({
            body:{
                type:"phone",
                ...values,
                code:code
            },
            onSuccess:(r:any)=>{
                Toast.show({
                    content: r?.message,
                    icon: "success"
                })
                user?.refreshWebUser(()=>{
                    deleteHeader()
                    historyPush("login")
                })
            },
            onFail:(r:any)=>{
                Toast?.show({
                    content: r?.message || "修改失败",
                    icon:"fail"
                })
            },
            onFinally:()=>{
                setBtnLoading(false)
            }
        })
    }
    return (
        <Body title={"手机号码验证"} headStyle={{backgroundColor: theme.colorPrimary,color: "#fff"}} titleStyle={{color: "#fff"}}>
            <Captcha ref={captcha}/>
            <Card>
                <Form  form={form} initialValues={{phone:user?.web?.phone}} className={body} onFinish={formFinish}>
                    <Form.Item label='手机号码' name="phone" className={label}>
                        <Input placeholder='请输入手机号码' clearable/>
                    </Form.Item>
                    <Form.Item label='验证码' name="sms_code" className={label}
                               extra={<Button loading={smsLoading} disabled={sendCodeDisabled}
                                              style={{fontSize: "12px", color: theme.colorPrimary, "--border-width": "0px",padding:"0px"}}
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
                    <Form.Item name="password" label="账户新密码" className={label}>
                        <Input placeholder="请输入新密码" type="password"/>
                    </Form.Item>
                    <Form.Item className={btn}>
                        <Button type="submit" loading={btnLoading} style={{
                            "--background-color":theme.colorPrimary,
                            "--border-color": theme.colorPrimary,
                            fontWeight: 600,
                        }} block color='primary' >修改</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Body>
    )

}