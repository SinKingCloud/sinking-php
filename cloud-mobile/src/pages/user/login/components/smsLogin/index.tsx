import {Body, Icon} from "@/components";
import {Ellipsis, Email, Message, Qrcode} from "@/components/icon";
import React, { useRef, useState} from "react";
import {Col, Dropdown, Row} from "antd";
import {Button, Card, Checkbox, Form, Grid, Input, Toast} from "antd-mobile";
import {createStyles, useResponsive, useTheme} from "antd-style";
import {historyPush} from "@/utils/route";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {sendSms} from "@/service/common/sms";
import {loginBySms} from "@/service/user/login";
import {setLoginToken} from "@/utils/auth";
import {useModel} from "umi";
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
        tab:{
            fontSize:"14px",
            color:token.colorPrimary
        },
        card:{
            ".adm-card":{
                padding:"0 !important",
                lineHeight:2.5
            }
        }
    }
})
const smsLoginPage = () => {
    const captcha = useRef<CaptchaRef>({});
    const [form] = Form.useForm()
    const {styles: {label, body, check, btn,tab,card}} = useStyles();
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
    const user = useModel("user")
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
        captcha?.current?.Show?.(async (res) => {
            await loginBySms({
                body: {
                    ...values,
                    captcha_id: res?.randstr,
                    captcha_code: res?.ticket,
                },
                onSuccess: (r: any) => {
                    Toast.show({
                        content: r?.message,
                        icon: "success"
                    })
                    user?.refreshWebUser(()=>{
                        historyPush("user.index")
                    })
                    setLoginToken("mobile", r?.data?.token);
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
        }, () => {
            Toast.show({
                content: "请完成验证码认证",
                icon: "fail"
            })
            setLoading(false)
        })
    }
    const web = useModel("web")
    const theme = useTheme()
    return (
        <Body title={"手机短信登录"} headStyle={{backgroundColor:theme.colorPrimary, color:"#fff"}} titleStyle={{color: "#fff"}} right={
            <Dropdown menu={{items}} placement="bottomLeft" overlayStyle={{width: "max-content"}} arrow>
                <Icon type={Ellipsis} style={{fontSize: "18px", color: "#fff"}}/>
            </Dropdown>
        }>
            <Captcha ref={captcha}/>
            <Grid columns={1} gap={8}>
                <Grid.Item>
                    <Card>
                        <Form  form={form} className={body} onFinish={formFinish}>
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
                            <Form.Item name="checked" className={label}>
                                <Checkbox className={check}>
                                    <span style={{fontSize: "12px", marginRight: "10px"}}>记住登录状态</span>
                                    <span style={{fontSize: "11px", color: "gray"}}>（在公共设备登录时请不要勾选）</span>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item className={btn}>
                                <Button type="submit" loading={btnLoading} style={{
                                    "--background-color":theme.colorPrimary,
                                    "--border-color": theme.colorPrimary,
                                    fontWeight: 600,
                                }} block color='primary' >登&nbsp;&nbsp;录</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card className={card}>
                        <Row justify={"space-evenly"}>
                            <Col onClick={()=>historyPush('user.login')}><span className={tab}>密码登录</span></Col>
                            {web?.info?.reg_qrlogin &&<Col onClick={()=>historyPush('login.qrLogin')}><span className={tab}>扫码登录</span></Col>}
                            {web?.info?.reg_email &&<Col onClick={()=>historyPush('login.emailLogin')}><span className={tab}>邮箱登录</span></Col>}
                        </Row>
                    </Card>
                </Grid.Item>
            </Grid>
        </Body>
    );
};

export default smsLoginPage;
