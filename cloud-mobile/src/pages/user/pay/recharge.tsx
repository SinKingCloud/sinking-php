import React, {useEffect, useState} from "react"
import {Body, Icon} from "@/components";
import {Button, Form, Input, Selector, Toast, Skeleton} from "antd-mobile";
import {createStyles, useResponsive} from "antd-style";
import {Mayun, Qq, Weinxin} from "@/components/icon";
import {getPayConfig, recharge} from "@/service/pay";
import {setPayJumpUrl} from "@/utils/pay";
import {historyPush} from "@/utils/route";

const useStyles = createStyles(({token}): any => {
    return {
        label: {
            ".adm-list-item-content-prefix": {
                fontSize: "28px",
                paddingTop: "0px !important",
                fontWeight: 600,
                width: "auto !important",
            },
            ".adm-list-item-content": {
                borderBottom: "none !important",
                borderTop: "none !important",
                paddingBlock: "8px"
            },
        },
        body: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
            marginBottom: "10px",
        },
        p: {
            fontSize: "14px", marginLeft: "20px"
        },
        span: {
            fontSize: "12px", fontWeight: 600
        },
        icon: {
            fontSize: "14px", marginRight: "5px"
        },
        btn: {
            "--background-color": token.colorPrimary,
            "--border-color": token.colorPrimary,
            fontWeight: 600,
            letterSpacing: "1px"
        },
        notice: {
            color: "#b3b3b3", fontSize: "12px", textAlign: "center"
        }
    }
})
export default () => {
    const [form] = Form.useForm();
    const {styles: {label, body, p, span, icon, btn, notice}} = useStyles();
    const [loading, setLoading] = useState(false)
    const {mobile} = useResponsive()
    const formFinish = async (values: any) => {
        if (values?.money == "" || values?.money == undefined) {
            Toast?.show({
                content: "请输入充值金额",
                position: 'top',
            })
            return
        } else if (!/\d/.test(values?.money)) {
            Toast?.show({
                content: "格式错误",
                position: 'top',
            })
            return
        } else if (values?.money < 10) {
            Toast?.show({
                content: "充值金额最少为10",
                position: 'top',
            })
            return
        }
        values = {money: parseInt(values?.money), type: parseInt(values?.type)}
        setLoading(true)
        await recharge({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                setPayJumpUrl();
                if (mobile) {
                    window.location.href = r.data;
                } else {
                    window.open(r.data);
                }
                Toast.show({
                    content: '订单是否已支付成功,如支付成功请点击刷新按钮刷新余额',
                    afterClose: () => {
                        historyPush("user.pay")
                    },
                })
            },
            onFail: (r: any) => {
                Toast.show({
                    content: r?.message || "请求错误",
                    position: 'top',
                })
            },
            onFinally: () => {
                setLoading(false)
            }
        })
    }
    /**
     * 支付配置
     */
    const [configLoading, setConfigLoading] = useState(false)
    const [payConfig, setPayConfig] = useState({});
    useEffect(() => {
        setConfigLoading(true)
        getPayConfig({
            onSuccess: (r: any) => {
                setPayConfig(r?.data)
            },
            onFinally: () => {
                setConfigLoading(false);
            }
        });
    }, []);
    const options = [
        {
            label: (
                <span className={span}><Icon type={Mayun} className={icon}/>支付宝</span>
            ),
            value: 0,
            show: payConfig?.["pay.alipay.type"],
        },
        {
            label: (
                <span className={span}><Icon type={Weinxin} className={icon}/>微信</span>
            ),
            value: 1,
            show: payConfig?.["pay.wxpay.type"]
        },
        {
            label: (
                <span className={span}><Icon type={Qq} className={icon}/>QQ</span>
            ),
            value: 2,
            show: payConfig?.["pay.qqpay.type"]
        }
    ]
    return (
        <Body title="充值账户余额">
            <Form layout="horizontal" form={form} initialValues={{type: "0"}} className={body} onFinish={formFinish}>
                <p className={p}>充值金额</p>
                <Form.Item name="money" label={"￥"} className={label}>
                    <Input placeholder="请输入充值金额" clearable/>
                </Form.Item>
                <p className={p}>支付方式</p>
                <Form.Item name="type" className={label}>
                    {configLoading && <Skeleton.Paragraph animated/> ||
                        <Selector
                            style={{"--border-radius": "5px", "--padding": "10px 14px"}}
                            options={options.filter(option => option.show)}
                        />
                    }
                </Form.Item>
                <Form.Item className={label}>
                    <Button type={"submit"} block color='primary' loading={loading} className={btn}>立即支付</Button>
                </Form.Item>
            </Form>
            <p className={notice}>提示信息:在线支付后余额实时到账，无需等待</p>
        </Body>
    )
}