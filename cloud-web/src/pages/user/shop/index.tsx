import React, {useEffect, useState} from 'react';
import ProCard from "@ant-design/pro-card";
import {App, Button, Form, Image, Input, Modal, ModalProps, Select, Typography} from "antd";
import {ExclamationCircleOutlined, WechatOutlined} from "@ant-design/icons";
import {buySite, getSite} from "@/service/shop/site";
import {getPayConfig} from "@/service/pay/pay";
import {setPayJumpUrl} from "@/utils/pay";
import {Body, Title} from "@/components";
import {useModel} from "umi";
import {createStyles, useResponsive} from "antd-style";

const useStyles = createStyles(({css, responsive, isDarkMode}): any => {
    return {
        modals:css`
            .ant-modal-title{
                margin-bottom: 15px;
            }
        `,
        mainTitle: css`
            background-image: url("https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/buy-bg.21d92425.png");
            background-repeat: no-repeat;
            background-size: cover;
            height: 250px;
            text-align: center;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
                height: 60px;
            }
        `,
        topTitle: css`
            font-size: 30px;
            color: #cfc8bd !important;
            padding-top: 45px;
            box-sizing: border-box;

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
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

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
                margin: -15px auto 0 auto;
            }
        `,
        cardTitle: css`
            position: relative;
            background-image: url("https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/personPackage.5c08b148.svg");
            background-repeat: no-repeat;
            background-size: cover;
            height: 120px;
            border-radius: 10px 10px 0 0;
            text-align: center;

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
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

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
                font-size: 20px;
                height: 50px;
                line-height: 65px;
            }
        `,
        bottomTitle: css`
            font-size: 18px;
            color: #af6e01;

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
                font-size: 13px;
            }
        `,
        cardBody: {
            borderRadius: "0 0 10px 10px !important",
            padding: "12px 0"
        },
        button: css`
            margin-top: 20px;
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

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
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
        `
    }
})
export default (): React.ReactNode => {
    const {
        styles: {
            mainTitle, topTitle, main, body, cardTitle, topTitle2, bottomTitle,
            cardBody, button, box, top, tips, bottom, left, right, describe, contain,
            table, thead, tbody, tr, th, td, select,modals
        }
    } = useStyles()
    /**
     * 初始化
     */
    const {message, modal} = App.useApp()
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
     * 开通网站表单
     */
    const [add] = Form.useForm();//表单
    const [isModalAddWebVisible, setIsModalAddWebVisible] = useState(false);//弹窗
    const [isModalAddWebBtnLoading, setIsModalAddWebBtnLoading] = useState(false);//按钮
    const onAddFormFinish = async (values: any) => {
        setIsModalAddWebVisible(false);
        const url = values.prefix + '.' + values.domain;
        modal.confirm({
            title: '确定要开通主站吗?',
            icon: <ExclamationCircleOutlined/>,
            content: (<>请牢记您的域名：<Typography.Text
                copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
            okType: 'primary',
            onOk() {
                setIsModalAddWebBtnLoading(true);
                return buySite({
                    body: {
                        ...values
                    },
                    onSuccess: (r) => {
                        add.resetFields();
                        message?.success(r?.message)
                        //支付成功
                        if (r.code == 200 && values.type == 3) {
                            modal.confirm({
                                title: '开通成功,请点击确认访问您的网站',
                                icon: <ExclamationCircleOutlined/>,
                                content: (<>您的网站域名：<Typography.Text
                                    copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
                                async onOk() {
                                    window.location.href = location.protocol + '//' + url
                                },
                            });
                        } else {
                            setPayJumpUrl();
                            if (mobile) {
                                window.location.href = r.data;
                            } else {
                                window.open(r.data);
                            }
                            modal.confirm({
                                title: '订单是否已支付成功?',
                                icon: <ExclamationCircleOutlined/>,
                                content: <>如支付成功请点击确认访问您的网站，域名：<Typography.Text
                                    copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>,
                                async onOk() {
                                    window.location.href = location.protocol + '//' + url
                                },
                            });
                        }
                    },
                    onFail: (r) => {
                            message?.error(r?.message || "请求失败")
                    },
                    onFinally:()=>{
                        setIsModalAddWebVisible(false);
                    }
                });
            },
        } as ModalProps);
    }
    return (
        <Body loading={loading}>
            <Modal key={"add_web"} width={400} destroyOnClose={true} open={isModalAddWebVisible}
                   okButtonProps={{loading: isModalAddWebBtnLoading}} className={modals}
                   forceRender={true} title={<Title>开通网站</Title>} onOk={add.submit} okText={'开通'}
                   onCancel={() => {
                       setIsModalAddWebVisible(false);
                       add.resetFields();
                   }}>
                <Form form={add} onFinish={onAddFormFinish} labelCol={{span: 6}}
                      wrapperCol={{span: 16}}>
                    <Form.Item name="name" label="网站名称" rules={[{required: true, message: "请输入网站名称"}]}>
                        <Input placeholder="请输入网站名称"/>
                    </Form.Item>
                    <Form.Item label="绑定域名">
                        <Form.Item
                            name="prefix"
                            noStyle
                            rules={[{required: true, message: '请输入前缀'}]}
                        >
                            <Input style={{
                                width: '45%', borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }} placeholder="请输入前缀"/>
                        </Form.Item>
                        <Form.Item
                            name="domain"
                            noStyle
                            rules={[{required: true, message: '请选择后缀'}]}
                        >
                            <Select placeholder="请选择后缀" style={{width: '55%'}} className={select}>
                                {siteConfig?.['master.domains']?.map((k: any) => {
                                    return <Select.Option key={"domain_" + k} value={k}>.{k}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item name="type" label="支付方式" rules={[{required: true, message: "请选择支付方式"}]}>
                        <Select placeholder="请选择支付方式">
                            <Select.Option
                                value={3}>余额支付(余额:￥{parseFloat(user?.web?.money).toFixed(2)})</Select.Option>
                            {payConfig?.['pay.qqpay.type'] && <Select.Option value={2}>QQ支付</Select.Option>}
                            {payConfig?.['pay.wxpay.type'] && <Select.Option value={1}>微信支付</Select.Option>}
                            {payConfig?.['pay.alipay.type'] && <Select.Option value={0}>支付宝支付</Select.Option>}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <ProCard>
                <div className={mainTitle}>
                    <div className={topTitle}>合作加盟，专享超值权益</div>
                </div>
                <div className={main}>
                    <div className={body}>
                        <div className={cardTitle}>
                            <div className={topTitle2}>尊享主站</div>
                            <div className={bottomTitle}>专享特权，享受更多权益，独立站长后台</div>
                        </div>
                        <ProCard className={cardBody}>
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
                                            Modal.info({
                                                title: '请联系销售咨询详情',
                                                content: (<>联系方式：<Typography.Text
                                                    copyable={{tooltips: ['复制', '复制成功']}}>{siteConfig?.['contact.one']}</Typography.Text></>),
                                            });
                                        }}><WechatOutlined/> 咨询详情</a>
                                    </div>
                                </div>
                            </div>
                            <Button className={button} size={"large"} onClick={() => {
                                add?.setFieldsValue({domain: siteConfig?.['master.domains']?.[0], type: 3});
                                setIsModalAddWebVisible(true);
                            }}>
                                立即支付￥{parseInt(siteConfig?.['site.price'])}开通主站
                            </Button>
                        </ProCard>
                    </div>
                </div>
                <div className={describe}>
                    <div style={{textAlign: "center", margin: "20px"}}>
                        <span style={{fontWeight: "bolder", fontSize: "30px", color: "#575757"}}>权益详情</span>
                    </div>
                    <div className={contain}>
                        <div className={table}>
                            <div className={thead}>
                                <div className={tr} style={{fontSize: "20px", color: "#3b434b !important"}}>
                                    <div className={th}>
                                        权益说明
                                    </div>
                                    <div className={th}>
                                        个人用户
                                    </div>
                                    <div className={th}>
                                        平台站长
                                    </div>
                                </div>
                            </div>
                            <div className={tbody}>
                                <div className={tr} style={{
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(205, 206, 207, 0.33)"
                                }}>
                                    <div className={td}>
                                        <div style={{float: "left", lineHeight: "50px"}}>
                                            <Image style={{width: "40px", height: "40px"}}
                                                   src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-lingquqiye.98ec47ee.svg"}
                                                   preview={false}/>
                                        </div>
                                        <div style={{
                                            float: "left",
                                            marginLeft: "20px",
                                            lineHeight: "30px",
                                            textAlign: "left"
                                        }}>
                                            <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                                                独立后台
                                            </div>
                                            <div style={{fontSize: "10px", color: "#929292"}}>
                                                尊享主站享有独立后台
                                            </div>
                                        </div>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                                            preview={false}/>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                                            preview={false}/>
                                    </div>
                                </div>
                                <div className={tr} style={{
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(205, 206, 207, 0.33)"
                                }}>
                                    <div className={td}>
                                        <div style={{float: "left", lineHeight: "50px"}}>
                                            <Image style={{width: "40px", height: "40px"}}
                                                   src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_seemore.d9ef3871.svg"}
                                                   preview={false}/>
                                        </div>
                                        <div style={{
                                            float: "left",
                                            marginLeft: "20px",
                                            lineHeight: "30px",
                                            textAlign: "left"
                                        }}>
                                            <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                                                发展下级
                                            </div>
                                            <div style={{fontSize: "10px", color: "#929292"}}>
                                                主站可推广网站发展更多用户
                                            </div>
                                        </div>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                                            preview={false}/>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                                            preview={false}/>
                                    </div>
                                </div>
                                <div className={tr} style={{
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(205, 206, 207, 0.33)"
                                }}>
                                    <div className={td}>
                                        <div style={{float: "left", lineHeight: "50px"}}>
                                            <Image style={{width: "40px", height: "40px"}}
                                                   src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-gengduochaxun.fd9fd3c5.svg"}
                                                   preview={false}/>
                                        </div>
                                        <div style={{
                                            float: "left",
                                            marginLeft: "20px",
                                            lineHeight: "30px",
                                            textAlign: "left"
                                        }}>
                                            <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                                                低价货源
                                            </div>
                                            <div style={{fontSize: "10px", color: "#929292"}}>
                                                享有更加低价的商品货源
                                            </div>
                                        </div>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                                            preview={false}/>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                                            preview={false}/>
                                    </div>
                                </div>
                                <div className={tr} style={{
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(205, 206, 207, 0.33)"
                                }}>
                                    <div className={td}>
                                        <div style={{float: "left", lineHeight: "50px"}}>
                                            <Image style={{width: "40px", height: "40px"}}
                                                   src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-piliangchaxun.1e177671.svg"}
                                                   preview={false}/>
                                        </div>
                                        <div style={{
                                            float: "left",
                                            marginLeft: "20px",
                                            lineHeight: "30px",
                                            textAlign: "left"
                                        }}>
                                            <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                                                销售提成
                                            </div>
                                            <div style={{fontSize: "10px", color: "#929292"}}>
                                                下级站点消费分润拥有{parseInt(siteConfig?.['site.order.deduct'])}%返利
                                            </div>
                                        </div>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                                            preview={false}/>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                                            preview={false}/>
                                    </div>
                                </div>
                                <div className={tr} style={{
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(205, 206, 207, 0.33)"
                                }}>
                                    <div className={td}>
                                        <div style={{float: "left", lineHeight: "50px"}}>
                                            <Image style={{width: "40px", height: "40px"}}
                                                   src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-vipshaixuan.eee01296.svg"}
                                                   preview={false}/>
                                        </div>
                                        <div style={{
                                            float: "left",
                                            marginLeft: "20px",
                                            lineHeight: "30px",
                                            textAlign: "left"
                                        }}>
                                            <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                                                数据统计
                                            </div>
                                            <div style={{fontSize: "10px", color: "#929292"}}>
                                                专属后台,数据统计一目了然
                                            </div>
                                        </div>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                                            preview={false}/>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                                            preview={false}/>
                                    </div>
                                </div>
                                <div className={tr} style={{
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(205, 206, 207, 0.33)"
                                }}>
                                    <div className={td}>
                                        <div style={{float: "left", lineHeight: "50px"}}>
                                            <Image style={{width: "40px", height: "40px"}}
                                                   src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_quickchoose.187d2dd6.svg"}
                                                   preview={false}/>
                                        </div>
                                        <div style={{
                                            float: "left",
                                            marginLeft: "20px",
                                            lineHeight: "30px",
                                            textAlign: "left"
                                        }}>
                                            <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                                                更多权限
                                            </div>
                                            <div style={{fontSize: "10px", color: "#929292"}}>
                                                激活更多权益,享受更多服务
                                            </div>
                                        </div>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                                            preview={false}/>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                                            preview={false}/>
                                    </div>
                                </div>
                                <div className={tr} style={{
                                    padding: "20px",
                                    borderBottom: "1px solid rgba(205, 206, 207, 0.33)"
                                }}>
                                    <div className={td}>
                                        <div style={{float: "left", lineHeight: "50px"}}>
                                            <Image style={{width: "40px", height: "40px"}}
                                                   src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-gengduolianxi.3f0caf8e.svg"}
                                                   preview={false}/>
                                        </div>
                                        <div style={{
                                            float: "left",
                                            marginLeft: "20px",
                                            lineHeight: "30px",
                                            textAlign: "left"
                                        }}>
                                            <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                                                专属客服
                                            </div>
                                            <div style={{fontSize: "10px", color: "#929292"}}>
                                                一对一专属客服售后指导
                                            </div>
                                        </div>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                                            preview={false}/>
                                    </div>
                                    <div className={td}>
                                        <Image
                                            src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                                            preview={false}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ProCard>
        </Body>
    )
}
