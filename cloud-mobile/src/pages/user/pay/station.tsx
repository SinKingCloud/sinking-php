import React, {useEffect, useState} from 'react'
import {Body} from "@/components";
import {Button, Card, Form, Input, Modal, Toast, Image, SpinLoading} from "antd-mobile";
import defaultSettings from "../../../../config/defaultSettings";
import {createStyles, useResponsive, useTheme} from "antd-style";
import {useModel} from "umi";
import {buySite, getSite} from "@/service/shop/site";
import {getPayConfig} from "@/service/pay";
import {Select, Typography} from 'antd';
import {setPayJumpUrl} from "@/utils/pay";

const useStyles = createStyles(({css, responsive, isDarkMode, token}): any => {
    const base = ((defaultSettings?.basePath || "/") + "images/buy-bg.png")
    const base1 = ((defaultSettings?.basePath || "/") + "images/personPackage.svg")
    return {
        modals: css`
            .ant-modal-title {
                margin-bottom: 15px;
            }
        `,
        mainTitle: css`
            background-image: url(${base});
            background-repeat: no-repeat;
            background-size: cover;
            height: 250px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;

            ${responsive.md} {
                height: 60px;
            }
        `,
        topTitle: css`
            font-size: 30px;
            color: #cfc8bd !important;
            padding-top: 45px;
            box-sizing: border-box;

            ${responsive.md} {
                font-size: 14px;
                padding-top: 12px;
            }
        `,
        main: {
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: isDarkMode ? "0 5px 10px 0 rgba(95, 94, 94, 0.68)" : "0 50px 40px 0 #eeeeeead",
        }
        ,
        body: css`
            margin: -100px auto 0 auto;

            ${responsive.md} {
                margin: -15px auto 0 auto;
            }
        `,
        cardTitle: css`
            position: relative;
            background-image: url(${base1});
            background-repeat: no-repeat;
            background-size: cover;
            height: 120px;
            border-radius: 10px 10px 0 0;
            text-align: center;

            ${responsive.md} {
                height: 90px;
                width: 90%;
                margin-left: 5%;
            }
        `,
        topTitle2: css`
            font-size: 27px;
            font-weight: bolder;
            color: #af6e01;
            height: 65px;
            line-height: 75px;

            ${responsive.md} {
                font-size: 20px;
                height: 50px;
                line-height: 65px;
            }
        `,
        bottomTitle: css`
            font-size: 18px;
            color: #af6e01;

            ${responsive.md} {
                font-size: 13px;
            }
        `,
        cardBody: {
            borderRadius: "0 0 10px 10px !important",
            padding: "12px 0"
        },
        box: {
            backgroundColor: "rgb(255 249 238)",
            border: "1px solid #ffdea8",
            maxWidth: "350px",
            margin: "20px auto 0 auto",
            borderRadius: "5px",
            cursor: "pointer",
        },
        top: {
            height: "100px",
            textAlign: "left",
        },
        tips: {
            backgroundColor: "rgb(233 198 140)",
            position: "absolute",
            borderRadius: "7px 0 7px 0",
            padding: " 5px 10px",
            marginTop: "-15px",
            fontSize: "12px",
            color: "white",
        },
        bottom: {
            height: "40px",
            lineHeight: "40px",
            backgroundColor: "papayawhip",
            padding: "0 10px 0 10px",
        },
        left: {
            float: "left"
        },
        right: {
            float: "right"
        },
        describe: css`
            max-width: 80%;
            margin: 40px auto 0 auto;

            ${responsive.md} {
                max-width: 100%;
                margin: 0;
            }
        `,
        contain: {
            overflowY: "hidden"
        },
        table: {
            width: "800px",
            overflowX: "scroll",
            border: isDarkMode ? "1px solid rgb(50, 50, 50)" : "1px solid #ebebeb",
            borderRadius: "15px",
            margin: "0 auto",
        },
        thead: {
            textAlign: "center",
            width: "100%",
            display: "flex",
            borderBottom: "1px solid #ccc",
            borderBottomColor: "rgba(205, 206, 207, 0.5)",
            alignItems: "center",
            height: "90px",
            backgroundColor: isDarkMode ? "rgb(139,137,137)" : "#e4e4e4",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px"
        },
        tbody: {
            textAlign: "center",
            fontWeight: "lighter",
            borderBottomLeftRadius: "15px",
            borderBottomRightRadius: "15px"
        },
        tr: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bolder"
        },
        th: {
            flex: 8
        },
        td: {
            flex: 8
        },
        select: css`
            .ant-select-selector {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        `,
        formBody: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
            marginBottom: "10px",
        },
        modal: {
            ".adm-center-popup-wrap": {
                minWidth: "96% !important",
                maxWidth: "96% !important"
            }
        },
        label:{
            ".adm-input-element":{
                fontSize:"14px !important"
            }
        },
        to:{
            ".adm-list-item-content":{
                borderTop: "none !important"
            }
        },
        inner:{
            ".adm-form-item-child-inner":{
                display:"flex"
            }
        }
    }
})
export default () => {
    const {
        styles: {select, formBody, modal,label,to,inner}} = useStyles()
    /**
     * 初始化
     */
    const {mobile} = useResponsive()
    const user = useModel("user")
    const [siteConfig, setSiteConfig] = useState({});
    const [payConfig, setPayConfig] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getSite({
            onSuccess: (r) => {
                setSiteConfig(r?.data);
            }
        }).finally(() => {
            getPayConfig({
                onSuccess: (r2) => {
                    setPayConfig(r2?.data);
                }
            }).finally(() => {
                setLoading(false);
            });
        });

    }, []);
    /**
     * 表单提交
     */
    const [form] = Form.useForm()
    const [btnLoading, setBtnLoading] = useState(false)
    const formFinish = (values: any) => {
        const url = values.prefix + '.' + values.domain;
        if (values?.name == undefined || values?.name == "") {
            Toast.show({
                position: "top",
                content: "请输入网站名称"
            })
            return
        }
        if (values?.prefix == undefined || values?.prefix == "") {
            Toast.show({
                position: "top",
                content: "请输入前缀"
            })
            return
        }
        if (values?.domain == undefined || values?.domain == "") {
            Toast.show({
                position: "top",
                content: "请选择后缀"
            })
            return
        }
        if (values?.type == undefined || values?.type == "") {
            Toast.show({
                position: "top",
                content: "请选择支付方式"
            })
            return
        }
        setBtnLoading(true)
        buySite({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast?.show({
                    icon: "success",
                    content: r?.message
                })
                //支付成功
                if (r?.code == 200 && values.type == 3) {
                    Modal?.confirm({
                        title: '开通成功,请点击确认访问您的网站',
                        content: (<>您的网站域名：<Typography.Text
                            copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
                        onConfirm: () => {
                            window.location.href = location.protocol + '//' + url
                        }
                    })
                } else {
                    setPayJumpUrl(location.protocol + '//' + url);
                    if (mobile) {
                        window.location.href = r.data;
                    } else {
                        window.open(r.data);
                    }
                    Modal?.confirm({
                        title: '订单是否已支付成功',
                        content: (<>如支付成功请点击确认访问您的网站，域名：<Typography.Text
                            copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
                        onConfirm: () => {
                            window.location.href = location.protocol + '//' + url
                        }
                    })
                }
            },
            onFail: (r: any) => {
                Toast?.show({
                    icon: "fail",
                    content: r?.message || "开通失败"
                })
            },
            onFinally: () => {
                setLoading(false)
            }

        })
    }
    const theme = useTheme()
    return (
        <Body title="开通主站">
            <Card>
                <p style={{fontSize: "19px", fontWeight: 600, color: "#f38e1b", margin: "10px 0"}}>搭建主站介绍</p>
                <span style={{fontSize: "12px"}}>无需建站技术，一键搭建与本站完全相同的代练网站，自己做站长，无需服务器，赠送二级域名，可进入网站控制后台，可自定义网站名称、公告、帮助等内容，支持对接支付接口，
                                    方便的自动化收款能力，拥有自己的用户管理体系，可极低的价格为用户开通主站等。</span>
                <p style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#f655a6"
                }}>主站搭建费用:￥{parseInt(siteConfig?.['site.price'])}</p>
                <Button block style={{
                    "--background-color": theme.colorPrimary,
                    "--border-color": theme.colorPrimary,
                    fontWeight: 600,
                    color: "#fff"
                }} onClick={() => {
                    Modal?.show({
                        className: modal,
                        showCloseButton: true,
                        content: (<Form form={form} className={formBody} onFinish={formFinish}>
                            <Form.Item name="name" label="网站名称"  className={label}>
                                <Input placeholder="请输入网站名称" clearable/>
                            </Form.Item>
                            <Form.Item label={"绑定域名"} className={inner}>
                                <Form.Item name="prefix" className={label} noStyle>
                                    <Input style={{
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                        width:"55%"
                                    }} placeholder="请输入前缀" />
                                </Form.Item>
                                <Form.Item name="domain" noStyle>
                                    <Select placeholder="请选择后缀" style={{width:"45%"}} className={select}>
                                        {siteConfig?.['master.domains']?.map((k: any) => {
                                            return <Select.Option key={"domain_" + k}
                                                                  value={k}>.{k}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item name="type" label="支付方式">
                                <Select placeholder="请选择支付方式" defaultValue={3} style={{width: "100%"}}>
                                    <Select.Option
                                        value={3}>余额支付(余额:￥{parseFloat(user?.web?.money).toFixed(2)})</Select.Option>
                                    {payConfig?.['pay.qqpay.type'] &&
                                        <Select.Option value={2}>QQ支付</Select.Option>}
                                    {payConfig?.['pay.wxpay.type'] &&
                                        <Select.Option value={1}>微信支付</Select.Option>}
                                    {payConfig?.['pay.alipay.type'] &&
                                        <Select.Option value={0}>支付宝支付</Select.Option>}
                                </Select>
                            </Form.Item>
                            <Form.Item className={to}>
                                <Button type="submit" block color={"primary"} loading={btnLoading}>开通</Button>
                            </Form.Item>
                        </Form>)
                    })
                    form?.setFieldsValue({domain: siteConfig?.['master.domains']?.[0], type: 3});
                }}>
                    我要搭建
                </Button>
            </Card>
        </Body>)
}