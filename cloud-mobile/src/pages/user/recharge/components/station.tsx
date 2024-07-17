import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Button, Card, Form, Input, Modal, Toast,Image} from "antd-mobile";
import defaultSettings from "../../../../../config/defaultSettings";
import {createStyles, useResponsive} from "antd-style";
import {useModel} from "umi";
import {buySite, getSite} from "@/service/shop/site";
import {getPayConfig} from "@/service/pay";
import {Weinxin} from "@/components/icon";
import {Select, Typography} from 'antd';
import {setPayJumpUrl} from "@/utils/pay";

const useStyles = createStyles(({css, responsive, isDarkMode}): any => {
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

            ${responsive.md } {
                font-size: 20px;
                height: 50px;
                line-height: 65px;
            }
        `,
        bottomTitle: css`
            font-size: 18px;
            color: #af6e01;

            ${responsive.md } {
                font-size: 13px;
            }
        `,
        cardBody: {
            borderRadius: "0 0 10px 10px !important",
            padding: "12px 0"
        },
        button: css`
            margin-top: 10px;
            font-size: 13px;
            width: 40%;
            margin-left: 30%;
            background: linear-gradient(303deg, #e7c183, #fce9c9 100%, #fce9c9 0, #fce9c9 0) !important;
            color: #ab6d28 !important;
            border: 0;
            line-height: 20px;
            height: 40px;

            .ant-btn-primary {
                box-shadow: 0 0 0 rgba(5, 95, 255, 0.1) !important;
            }

            ${responsive.md} {
                width: 100%;
                margin-left: 0;
            }
        `,
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
        formBody:{
            ".adm-list-body":{
                borderRadius:"5px",
                borderTop:"none !important",
                borderBottom:"none !important",
            },
            marginBottom:"10px",
        },
        modal:{
            ".adm-center-popup-wrap":{
                minWidth: "98% !important",
                maxWidth:"98% !important"
            }
        }
    }
})
export default () => {
    const {
        styles: {
            mainTitle, topTitle, main, body, cardTitle, topTitle2, bottomTitle,
            cardBody, button, box, top, tips, bottom, left, right, describe, contain,
            table, thead, tbody, tr, th, td, select, modals,formBody,modal
        }
    } = useStyles()
    /**
     * 初始化
     */

    const { Paragraph, Text } = Typography;
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
    const [btnLoading,setBtnLoading] = useState(false)
    const formFinish = (values:any)=>{
        const url = values.prefix + '.' + values.domain;
        if(values?.name == undefined || values?.name == ""){
            Toast.show({
                position:"top",
                content:"请输入网站名称"
            })
            return
        }
        if(values?.prefix == undefined || values?.prefix == ""){
            Toast.show({
                position:"top",
                content:"请输入前缀"
            })
            return
        }
        if(values?.domain == undefined || values?.domain == ""){
            Toast.show({
                position:"top",
                content:"请选择后缀"
            })
            return
        }
        if(values?.type == undefined || values?.type == ""){
            Toast.show({
                position:"top",
                content:"请选择支付方式"
            })
            return
        }
        setBtnLoading(true)
        buySite({
            body:{
                ...values
            },
            onSuccess:(r:any)=>{
                Toast?.show({
                    icon:"success",
                    content:r?.message
                })
                //支付成功
                if (r?.code == 200 && values.type == 3) {
                    Modal?.confirm({
                        title: '开通成功,请点击确认访问您的网站',
                        content: (<>您的网站域名：<Typography.Text
                            copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
                        onConfirm:()=>{
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
                        onConfirm:()=>{
                            window.location.href = location.protocol + '//' + url
                        }
                    })
                }
            },
            onFail:(r:any)=>{
                Toast?.show({
                    icon:"fail",
                    content:r?.message || "开通失败"
                })
            },
            onFinally:()=>{
                setLoading(false)
            }

        })
    }
    return (
        <Body title="开通主站">
            <Card bodyStyle={{padding: 0}}>
                <div className={mainTitle}>
                    <div className={topTitle}>合作加盟，专享超值权益</div>
                </div>
                <div className={main}>
                    <div className={body}>
                        <div className={cardTitle}>
                            <div className={topTitle2}>尊享主站</div>
                            <div className={bottomTitle}>专享特权，享受更多权益，独立站长后台</div>
                        </div>
                        <Card>
                            <div className={box}>
                                <div className={top}>
                                    <div className={tips}>
                                        尊享主站限时低价开通
                                    </div>
                                    <div style={{padding: "15px 15px 0 15px"}}>
                                        <div style={{lineHeight: "60px", height: "45px", overflow: "hidden"}}>
                                            <div style={{float: "left"}}>
                                <span style={{
                                    color: "rgb(188 115 0)",
                                    fontSize: "30px",
                                    fontWeight: "bolder"
                                }}>￥{parseInt(siteConfig?.['site.price'])}</span>
                                                <span style={{
                                                    color: "#999",
                                                    fontSize: "12px"
                                                }}>/{parseInt(siteConfig?.['site.month'])}月&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                            </div>
                                            <div style={{float: "right"}}>
                                                <span style={{color: "#999", fontSize: "12px"}}>原价:</span>
                                                <span style={{
                                                    color: "#999",
                                                    fontSize: "16px",
                                                    fontWeight: "bolder",
                                                    textDecoration: "line-through"
                                                }}>￥{parseInt(siteConfig?.['site.price']) * 8.5}</span>
                                                <span style={{color: "#999", fontSize: "12px"}}>/年</span>
                                            </div>
                                        </div>
                                        <div style={{lineHeight: "30px", height: "30px"}}>
                                            <span style={{color: "#999", fontSize: "12px"}}>开通主站享受更多权益</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={bottom}>
                                    <div className={left}>
                                        <span style={{color: "#999", fontSize: "12px"}}>合计</span>
                                        <span style={{
                                            color: "#666",
                                            fontSize: "15px",
                                            fontWeight: "bolder"
                                        }}>￥{parseInt(siteConfig?.['site.price'])}</span>
                                    </div>
                                    <div className={right} style={{fontSize: "13px"}}>
                                        <a style={{color: "#0786ff"}} onClick={() => {
                                            Modal?.alert({
                                                content: (
                                                    <>
                                                        <div style={{
                                                            fontSize: "16px",
                                                            fontWeight: 600,
                                                            marginBottom: "10px"
                                                        }}>请联系销售咨询详情
                                                        </div>
                                                        <div style={{flexWrap: "nowrap", display: "flex"}}>
                                                            <span>联系方式:</span>
                                                            <Paragraph copyable>2710911512</Paragraph>
                                                        </div>
                                                    </>
                                                ),
                                            })
                                        }}><Icon type={Weinxin} style={{marginRight: "5px"}}/>咨询详情</a>
                                    </div>
                                </div>
                            </div>
                            <Button className={button} onClick={() => {
                                Modal?.show({
                                    className: modal,
                                    showCloseButton: true,
                                    content: (<Form form={form} className={formBody} onFinish={formFinish}>
                                        <Form.Item name="name" label="网站名称">
                                            <Input placeholder="请输入网站名称" clearable/>
                                        </Form.Item>
                                        <Form.Item
                                            name="prefix"
                                            label={"域名前缀"}
                                        >
                                            <Input style={{
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                            }} placeholder="请输入前缀"/>
                                        </Form.Item>
                                        <Form.Item
                                            name="domain"
                                            label={"域名后缀"}
                                        >
                                            <Select placeholder="请选择后缀" className={select}>
                                                {siteConfig?.['master.domains']?.map((k: any) => {
                                                    return <Select.Option key={"domain_" + k}
                                                                          value={k}>.{k}</Select.Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item name="type" label="支付方式">
                                            <Select placeholder="请选择支付方式" defaultValue={3}>
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
                                        <Form.Item>
                                            <Button type="submit" block color={"primary"}
                                                    loading={btnLoading}>开通</Button>
                                        </Form.Item>
                                    </Form>)
                                })
                                form?.setFieldsValue({domain: siteConfig?.['master.domains']?.[0], type: 3});
                            }}>
                                立即支付￥{parseInt(siteConfig?.['site.price'])}开通主站
                            </Button>
                        </Card>
                    </div>
                </div>
            </Card>
        </Body>)
}