import {Body, Icon} from "@/components";
import {Ellipsis, Email, Message, Qrcode} from "@/components/icon";
import {Col, Dropdown, Row} from "antd";
import {Button, Card, Checkbox, Form, Grid, Input, Tabs, Toast} from "antd-mobile";
import React, {useEffect, useState} from "react";
import {createStyles, useResponsive, useTheme} from "antd-style";
import {historyPush} from "@/utils/route";
import {loginByPwd} from "@/service/user/login";
import {setLoginToken} from "@/utils/auth";
import {useModel} from "umi";

const useStyles = createStyles(({isDarkMode, css, token}): any => {
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
        butt:{
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing:"1px"
        },
        icon:{
            marginRight: "5px"
        },
        elli:{
            fontSize: "18px", color: "#fff"
        },
        span:{
            fontSize: "12px",
            marginRight: "10px",
            color: isDarkMode ? "#b3b3b3" : ""
        },
        gong:{
            fontSize: "11px", color: "gray"
        }
    }
});


export default () => {
    const [form] = Form.useForm()
    const {styles: {label, body, check, btn, span, tab, card,butt,icon,elli,gong}} = useStyles();
    const items = [
        {
            key: "sms",
            label: (
                <span onClick={() => historyPush('login.sms')}><Icon type={Message} className={icon}/>短信登录</span>
            ),
        },
        {
            key: "qrcode",
            label: (
                <span onClick={() => historyPush('login.qrcode')}><Icon type={Qrcode} className={icon}/>扫码登录</span>
            ),
        },
        {
            key: "email",
            label: (
                <span onClick={() => historyPush('login.email')}><Icon type={Email}  className={icon}/>邮箱登录</span>
            ),
        },
    ]
    /**
     * 表单提交
     */
    const user = useModel("user")
    const [loading, setLoading] = useState<any>(false)
    const finish = async (values: any) => {
        if (values?.account == undefined || values.account == "") {
            Toast.show({
                content: "账号不能为空",
                position: "top"
            })
            return
        }
        if (values?.password == undefined || values.password == "") {
            Toast.show({
                content: "密码不能为空",
                position: "top"
            })
            return
        }
        setLoading(true)
        await loginByPwd({
            body: {
                ...values,
            },
            onSuccess: (r: any) => {
                setLoginToken("mobile", r?.data?.token);
                user?.refreshWebUser(() => {
                    Toast.show({
                        content: r?.message,
                        icon: "success"
                    });
                    historyPush("user.index");
                })
            },
            onFail: (r: any) => {
                Toast.show({
                    content: r?.message || "登录失败",
                    icon: "fail"
                });
            },
            onFinally: () => {
                setLoading(false);
            }
        });
    }
    const theme = useTheme();
    const web = useModel("web");
    return (
        <Body title="欢迎登录" headStyle={{backgroundColor: theme.colorPrimary}} titleStyle={{color: "#fff"}}
              showBack={false}
              right={
                  <Dropdown menu={{items}} placement="bottomRight" autoAdjustOverflow={false}
                            overlayStyle={{width: "max-content"}} arrow>
                      <Icon type={Ellipsis} className={elli}/>
                  </Dropdown>
              }>
            <Grid columns={1} gap={8}>
                <Grid.Item>
                    <Card>
                        <Form form={form} className={body} onFinish={finish}>
                            <Form.Item label='账号' name="account" className={label}>
                                <Input placeholder='请输入手机号/账号' clearable/>
                            </Form.Item>
                            <Form.Item label='密码' name="password" className={label}>
                                <Input placeholder='请输入登录密码' type={"password"} clearable/>
                            </Form.Item>
                            <Form.Item name="checked" className={label}>
                                <Checkbox className={check}>
                        <span className={span}>记住登录状态</span>
                            <span className={gong}>（在公共设备登录时请不要勾选）</span>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item className={btn}>
                                <Button type={"submit"} block color='primary' loading={loading} className={butt}>登录</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card className={card}>
                        <Row justify={"space-around"}>
                            {web?.info?.reg_phone &&
                                <Col onClick={() => historyPush('login.sms')}><span
                                    className={tab}>短信登录</span></Col>}
                            {web?.info?.reg_qrlogin &&
                                <Col onClick={() => historyPush('login.qrcode')}><span
                                    className={tab}>扫码登录</span></Col>}
                            {web?.info?.reg_email && <Col onClick={() => historyPush('login.email')}><span
                                className={tab}>邮箱登录</span></Col>}
                        </Row>
                    </Card>
                </Grid.Item>
            </Grid>
        </Body>
    );
};
