import React, {useEffect, useState} from 'react'
import {Body, VirtualRef} from "@/components";
import {Button, Card, Form, Input, Modal, ModalShowProps, Selector, Toast} from "antd-mobile";
import {createStyles, useResponsive} from "antd-style";
import {useModel} from "umi";
import {buySite, getSite} from "@/service/shop/site";
import {getPayConfig} from "@/service/pay";
import {Select, Typography} from 'antd';
import {setPayJumpUrl} from "@/utils/pay";

const useStyles = createStyles(({css, responsive, token}): any => {
    return {
        modals: css`
            .ant-modal-title {
                margin-bottom: 15px;
            }
        `,
        select: css`
            .ant-select-selector {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }

            width: 45%;
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
                minWidth: "354px !important",
            }
        },
        label: {
            ".adm-input-element": {
                fontSize: "14px !important"
            }
        },
        to: {
            ".adm-list-item-content": {
                borderTop: "none !important"
            }
        },
        inner: {
            ".adm-form-item-child-inner": {
                display: "flex"
            }
        },
        p: {
            fontSize: "19px", fontWeight: 600, color: "#f38e1b", margin: "10px 0"
        },
        man: {
            fontSize: "16px", fontWeight: 600, color: "#f655a6"
        },
        btn: {
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            color: "#fff"
        },
        inp: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            width: "55%"
        },
        size: {
            fontSize: "12px"
        },
        pay: {
            width: "100%"
        }
    }
});

export default () => {
    const {
        styles: {select, formBody, modal, label, to, inner, p, man, btn, inp, size, pay}
    } = useStyles();
    /**
     * 初始化
     */
    const {mobile} = useResponsive();
    const user = useModel("user");
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
    const [form] = Form.useForm();
    const [btnLoading, setBtnLoading] = useState(false);
    const formFinish = (values: any) => {
        const url = values.prefix + '.' + values.domain;
        if (values?.name == undefined || values?.name == "") {
            Toast.show({
                position: "top",
                content: "请输入网站名称"
            });
            return;
        }
        if (values?.prefix == undefined || values?.prefix == "") {
            Toast.show({
                position: "top",
                content: "请输入前缀"
            });
            return;
        }
        if (values?.domain == undefined || values?.domain == "") {
            Toast.show({
                position: "top",
                content: "请选择后缀"
            });
            return;
        }
        if (values?.type == undefined || values?.type == "") {
            Toast.show({
                position: "top",
                content: "请选择支付方式"
            });
            return;
        }
        setBtnLoading(true);
        buySite({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast?.show({
                    icon: "success",
                    content: r?.message
                });
                //支付成功
                if (r?.code == 200 && values.type == 3) {
                    Modal?.confirm({
                        title: '开通成功,请点击确认访问您的网站',
                        content: (<>您的网站域名：<Typography.Text
                            copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
                        onConfirm: () => {
                            window.location.href = location.protocol + '//' + url
                        }
                    });
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
                    });
                }
            },
            onFail: (r: any) => {
                Toast?.show({
                    icon: "fail",
                    content: r?.message || "开通失败"
                });
            },
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <Body title="开通主站" loading={loading}>
            <Card>
                <p className={p}>搭建主站介绍</p>
                <span className={size}>无需建站技术，一键搭建与本站完全相同的网站，自己做站长，无需服务器，赠送二级域名，可进入网站控制后台，可自定义网站名称、公告、帮助等内容，拥有自己的用户管理体系，可极低的价格为用户开通主站等。</span>
                <p className={man}>主站搭建费用:￥{parseInt(siteConfig?.['site.price'])}</p>
                <div id="test"></div>
                <Button block className={btn} onClick={() => {
                    Modal?.show({
                        forceRender: true,
                        getContainer: VirtualRef?.current,
                        className: modal,
                        showCloseButton: true,
                        content: (<Form form={form}  className={formBody} onFinish={formFinish}>
                            <Form.Item name="name" label="网站名称" className={label}>
                                <Input placeholder="请输入网站名称" clearable/>
                            </Form.Item>
                            <Form.Item label={"绑定域名"} className={inner}>
                                <Form.Item name="prefix" noStyle>
                                    <Input className={inp} placeholder="请输入前缀"/>
                                </Form.Item>
                                <Form.Item name="domain" noStyle>
                                    <Select placeholder="请选择后缀" className={select}>

                                        {siteConfig?.['master.domains']?.map((k: any) => {
                                            return <Select.Option key={"domain_" + k}
                                                                  value={k}>.{k}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Form.Item>
                            <Form.Item name="type" label="支付方式" className={label}>
                                <Select placeholder="请选择支付方式" className={pay}>
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
                    } as ModalShowProps);
                    form?.setFieldsValue({domain: siteConfig?.['master.domains']?.[0], type: 3});
                }}>
                    我要搭建
                </Button>
            </Card>
        </Body>)
}