import {Body, Icon} from "@/components";
import {Ellipsis, Email, Message, Qrcode} from "@/components/icon";
import { Dropdown} from "antd";
import {Avatar, Button, Checkbox, Form, Input, Toast} from "antd-mobile";
import React, {useEffect, useRef, useState} from "react";
import {createStyles, useResponsive, useTheme} from "antd-style";
import {historyPush} from "@/utils/route";
import {loginByPwd} from "@/service/user/login";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {setLoginToken} from "@/utils/auth";
import {useModel} from "umi";
const useStyles = createStyles(({isDarkMode,css}):any=>{
    const border = isDarkMode ? "1px solid rgb(70,70,70) !important" : "1px solid #eeeeee !important"
    return{
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
        btn:{
            ".adm-list-item-content":{
                borderBottom:"none !important",
                borderTop:"none !important",
                paddingBlock:"8px"
            },
        },
        body:{
            ".adm-list-body":{
                borderRadius:"5px",
                borderTop:"none !important",
                borderBottom:"none !important",
            },
            marginBottom:"10px",
        },
        check:{
            ".adm-checkbox-icon":{
                height:"15px !important",
                width:"15px !important",
            }
        },
    }
})
const passLoginPage = () => {
    const captcha = useRef<CaptchaRef>({});
    const [form] = Form.useForm()
    const {styles:{label,body,check,btn,span}} = useStyles();
    const items = [
        {
            key:"sms",
            label:(
                <span onClick={()=>historyPush('login.smsLogin')}><Icon type={Message} style={{marginRight:"5px"}}/>短信登录</span>
            ),
        },
        {
            key:"qrcode",
            label:(
                <span onClick={()=>historyPush('login.qrLogin')}><Icon type={Qrcode} style={{marginRight:"5px"}}/>扫码登录</span>
            ),
        },
        {
            key:"email",
            label:(
                <span onClick={()=>historyPush('login.emailLogin')}><Icon type={Email} style={{marginRight:"5px"}}/>邮箱登录</span>
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
     * 表单提交
     */
    const [loading,setLoading] = useState<any>(false)
    const finish = async(values:any)=>{
        if(values?.account == undefined || values.account==""){
            Toast.show({
                content: "账号不能为空",
                position:"top"
            })
            return
        }
        if(values?.password == undefined || values.password==""){
            Toast.show({
                content: "密码不能为空",
                position:"top"
            })
            return
        }
        setLoading(true)
        captcha?.current?.Show?.(async (res) => {
        await loginByPwd({
            body:{
                ...values,
                captcha_id: res?.randstr,
                captcha_code: res?.ticket,
            },
            onSuccess:(r:any)=>{
                Toast.show({
                    content: r?.message,
                    icon:"success"
                })
                historyPush("user.index")
                setLoginToken(isMobile, r?.data?.token);
            },
            onFail:(r:any)=>{
                Toast.show({
                    content: r?.message || "登录失败",
                    icon:"fail"
                })
            },
            onFinally:()=>{
                setLoading(false)
            }
        })
        }, () => {
            Toast.show({
                content: "请完成验证码认证",
                icon:"fail"
            })
            setLoading(false);
        });
    }
    const theme = useTheme()
    return (
        <Body title={"欢迎登录"} bodyStyle={{padding:"10px"}}  headStyle={{backgroundColor: "rgb(92,165,214)"}} titleStyle={{color:"#fff"}} showBack={false}
        right={
            <Dropdown menu={{items}} placement="bottomLeft" overlayStyle={{width: "max-content"}} arrow>
                <Icon type={Ellipsis} style={{fontSize: "18px",color:"#fff"}}/>
            </Dropdown>
        } >
            <Captcha ref={captcha}/>
            <Form layout='horizontal'  form={form} className={body} onFinish={finish}>
                <Form.Item label='账号' name="account" className={label}>
                    <Input placeholder='请输入手机号/账号'  clearable/>
                </Form.Item>
                <Form.Item label='密码' name="password" className={label}>
                    <Input placeholder='请输入登录密码' type={"password"} clearable/>
                </Form.Item>
                <Form.Item name="checked" className={label}>
                    <Checkbox className={check}>
                        <span className={span} style={{fontSize: "12px", marginRight: "10px",color:theme.isDarkMode?"#b3b3b3":""}}>记住登录状态</span>
                        <span style={{fontSize: "11px",color:"gray"}} >（在公共设备登录时请不要勾选）</span>
                    </Checkbox>
                </Form.Item>
                <Form.Item className={btn}>
                    <Button type={"submit"} block color='primary' loading={loading}
                            style={{"--background-color":"#5ca5d6","--border-color":"#5ca5d6",fontSize:"15px",fontWeight:600,marginBottom:"10px"}}>登&nbsp;&nbsp;录</Button>
                </Form.Item>
            </Form>
            <ul style={{
                listStyle: "none",
                margin: 0,
                paddingBlock: "20px",
                borderRadius: "8px",
                paddingLeft: 0,
                display: "flex",
                fontSize:"12px",
                color:"#1b84cb",
                cursor:"pointer"
            }}>
                <li style={{width: "33.3%", borderRight: "0.5px solid #eeeeee", textAlign: "center"}} onClick={()=>historyPush('login.smsLogin')}>
                    短信登录
                </li>
                <li style={{width: "33.3%", borderRight: "0.5px solid #eeeeee", textAlign: "center"}} onClick={()=>historyPush('login.qrLogin')}>
                    扫码登录
                </li>
                <li style={{width: "33.3%", textAlign: "center"}} onClick={()=>historyPush('login.emailLogin')}>
                    邮箱登录
                </li>
            </ul>
        </Body>
    );
};

export default passLoginPage;
