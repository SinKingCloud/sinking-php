import React, {useEffect, useRef, useState} from 'react';
import {App, Avatar, Button, Col, Form, Image, Input, Row, TablePaginationConfig, Tooltip} from 'antd';
import ProCard, {CheckCard} from "@ant-design/pro-card";
import {useModel} from "umi";
import {getData} from "@/utils/page";
import {getPayOrder} from "@/service/pay/order";
import {
    AlipayCircleOutlined,
    ExclamationCircleOutlined,
    QqOutlined,
    SyncOutlined,
    WechatOutlined
} from "@ant-design/icons";
import {getPayConfig, recharge} from "@/service/pay/pay";
import {setPayJumpUrl} from "@/utils/pay";
import {Body, Title} from '@/components';
import {createStyles, useResponsive} from "antd-style";
import ProTable, {ProColumns} from "@ant-design/pro-table";

const useStyles = createStyles(({css, token}) => {
    return {
        border: css`
            .ant-pro-checkcard-checked:after {
                border: 6px solid ${token?.colorPrimary};
                border-block-end: 6px solid transparent;
                border-inline-start: 6px solid transparent;
                border-start-end-radius: 6px;
            }
        `,
        chard: {
            maxWidth: "80px",
            height: "35px",
            margin: " 10px auto",
            ".ant-pro-checkcard-content": {
                paddingInline: "7px !important",
                paddingBlock: "6px !important",
            },
            ".ant-pro-checkcard-sm ": {
                width: "0 !important"
            },
            ".ant-pro-checkcard ": {
                width: "0 !important"
            },
            ".ant-pro-checkcard-header": {
                justifyContent: "space-around"
            }
        }
    }
})
export default (): React.ReactNode => {
    const {styles: {border, chard}} = useStyles()
    const {message, modal} = App.useApp()
    const {mobile} = useResponsive()
    const user = useModel("user")
    const [loading, setLoading] = useState(false);
    const [payConfig, setPayConfig] = useState({});
    useEffect(() => {
        setLoading(true)
        getPayConfig().then((r: any) => {
            if (r?.code == 200) {
                setPayConfig(r?.data);
            }
            setLoading(false);
        });
    }, []);
    const [moneyInput, setMoneyInput] = useState(true);
    const [payBtnLoading, setPayBtnLoading] = useState(false);
    const [refreshIcon, setRefreshIcon] = useState(false);
    const [money, setMoney] = useState("");
    const [form] = Form.useForm();
    const ref = useRef<any>();
    /**
     * table表格渲染
     */
    const columns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: '记录ID',
            hideInSearch: true,
            hideInTable: true,
            sorter: true,
        },
        {
            title: '订单ID',
            dataIndex: 'trade_no',
            tip: '订单唯一ID',
            copyable: true,
        },
        {
            title: '充值金额',
            dataIndex: 'money',
            tip: '充值金额',
            render: (text: any, record: any) => {
                return parseFloat(record?.money || 0).toFixed(2) + "元";
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            tip: '订单状态',
            valueEnum: {
                0: {
                    text: '未支付',
                    status: 'warning',
                },
                1: {
                    text: '已支付',
                    status: 'success',
                },
                2: {
                    text: '已作废',
                    status: 'error',
                },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            tip: '订单创建时间',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '支付时间',
            dataIndex: 'update_time',
            tip: '订单创建时间',
            hideInSearch: true,
        },
    ];
    const page = <>
        <Row gutter={8}>
            <Col xs={{span: 24, offset: 0}} lg={{span: 8, offset: 0}} style={{paddingBottom: "20px"}}>
                <Row style={{paddingBottom: "20px"}}>
                    <Col xs={{span: 24}} lg={{span: 24}}>
                        <ProCard bordered loading={loading}>
                            <div style={{float: "left"}}>
                                <div style={{float: "left"}}>
                                    <Avatar style={{width: "80px", height: "80px"}} src={
                                        <Image preview={false} style={{width: "80px", height: "80px"}}
                                               src={user?.web?.avatar || "https://q1.qlogo.cn/g?b=qq&nk=10086&s=100&t=20190225"}/>}/>
                                </div>
                            </div>
                            <div style={{float: "right"}}>
                  <span style={{
                      fontSize: "40px",
                      fontWeight: "bolder"
                  }}>{parseFloat(user?.web?.money || 0).toFixed(2)}￥</span>
                                <br/>
                                <span style={{color: "#7e7e7e", float: "right"}}>账户余额
                    <Tooltip title="刷新余额"><a onClick={async () => {
                        setRefreshIcon(true);
                        setRefreshIcon(false);
                        message?.success("刷新成功");
                    }}> <SyncOutlined spin={refreshIcon}/></a></Tooltip></span>
                            </div>
                        </ProCard>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{span: 24}} lg={{span: 24}}>
                        <ProCard bordered title={<Title>账户充值</Title>} loading={loading}>
                            <Form
                                form={form}
                                labelCol={{span: 12}}
                                wrapperCol={{span: 24}}
                                autoComplete="off"
                                layout={"vertical"}
                                onFinish={(values) => {
                                    // eslint-disable-next-line no-param-reassign
                                    values = {money: parseInt(values?.money), type: parseInt(values?.type)}
                                    setPayBtnLoading(true);
                                    recharge({
                                        body: {
                                            ...values
                                        },
                                        onSuccess: (r: any) => {
                                            if (r?.code == 200) {
                                                ref?.current?.reload();
                                                setPayJumpUrl();
                                                if (mobile) {
                                                    window.location.href = r.data;
                                                } else {
                                                    window.open(r.data);
                                                }
                                                modal.confirm({
                                                    title: '订单是否已支付成功?',
                                                    icon: <ExclamationCircleOutlined/>,
                                                    content: '如支付成功请点击确认或点击刷新按钮刷新余额',
                                                    async onOk() {
                                                        ref?.current?.reload();
                                                    },
                                                });
                                                setPayBtnLoading(false);
                                            }
                                        },
                                        onFail: (r: any) => {
                                            message?.error(r?.message || "请求错误")
                                            setPayBtnLoading(false);
                                        }
                                    })
                                }}
                            >
                                <Form.Item name="money" label="充值金额" initialValue={"10"}
                                           rules={[{required: true, message: '请输入充值金额'}]}>
                                    <CheckCard.Group className={border}
                                                     onChange={(values) => {
                                                         if (values == "") {
                                                             setMoneyInput(false);
                                                             if (money != "") {
                                                                 form.setFieldsValue({money: money});
                                                             }
                                                         } else {
                                                             setMoneyInput(true);
                                                         }
                                                     }}>
                                        <Row gutter={5}>
                                            <Col span={8}>
                                                <CheckCard
                                                    title="10元"
                                                    size={"small"}
                                                    value="10"
                                                    className={chard}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <CheckCard
                                                    title="50元"
                                                    size={"small"}
                                                    value="50"
                                                    className={chard}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <CheckCard
                                                    title="100元"
                                                    size={"small"}
                                                    value="100"
                                                    className={chard}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <CheckCard
                                                    title="500元"
                                                    size={"small"}
                                                    value="500"
                                                    className={chard}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <CheckCard
                                                    title="1000元"
                                                    size={"small"}
                                                    value="1000"
                                                    className={chard}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                {(!moneyInput &&
                                                    <Input className={chard} placeholder={"金额"}
                                                           onChange={(e) => {
                                                               setMoney(e.target.value);
                                                               form.setFieldsValue({money: e.target.value});
                                                           }}/>) || <CheckCard
                                                    title="自定义"
                                                    size={"small"}
                                                    value=""
                                                    className={chard}
                                                />}
                                            </Col>
                                        </Row>
                                    </CheckCard.Group>
                                </Form.Item>
                                <Form.Item
                                    label="充值方式"
                                    name="type"
                                    rules={[{required: true, message: '请选择充值方式'}]}
                                    initialValue={"0"}>
                                    <CheckCard.Group className={border}>
                                        <Row gutter={5}>
                                            <Col span={8}>
                                                <CheckCard
                                                    title={(<><AlipayCircleOutlined
                                                        style={{marginRight: "3px"}}/>&nbsp;支付宝</>)}
                                                    value="0"
                                                    size={"small"}
                                                    className={chard}
                                                    style={{
                                                        display: payConfig['pay.alipay.type'] ? 'inline-block' : 'none'
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <CheckCard
                                                    title={(<><WechatOutlined
                                                        style={{marginRight: "3px"}}/>&nbsp;微信</>)}
                                                    value="1"
                                                    size={"small"}
                                                    className={chard}
                                                    style={{
                                                        display: payConfig['pay.wxpay.type'] ? 'inline-block' : 'none'
                                                    }}
                                                />
                                            </Col>
                                            <Col span={8}>
                                                <CheckCard
                                                    title={(<><QqOutlined style={{marginRight: "3px"}}/>&nbsp;QQ</>)}
                                                    value="2"
                                                    size={"small"}
                                                    className={chard}
                                                    style={{
                                                        display: payConfig['pay.qqpay.type'] ? 'inline-block' : 'none'
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </CheckCard.Group>
                                </Form.Item>
                                <Form.Item style={{textAlign: "center"}}>
                                    <Button type="primary" htmlType="submit" loading={payBtnLoading}>
                                        确认
                                    </Button>
                                    <Button htmlType="button" onClick={() => {
                                        form?.resetFields();
                                    }} style={{marginLeft: "10px"}}>
                                        重置
                                    </Button>
                                </Form.Item>
                            </Form>
                        </ProCard>
                    </Col>
                </Row>
            </Col>
            <Col xs={{span: 24, offset: 0}} lg={{span: 16, offset: 0}} style={{paddingBottom: "20px"}}>
                <ProTable
                    actionRef={ref}
                    form={{layout: "vertical", autoFocusFirstInput: false}}
                    headerTitle={<Title>充值记录</Title>}
                    rowKey={'id'}
                    style={{overflowX: "auto", whiteSpace: "nowrap"}}
                    scroll={{x: true}}
                    columns={columns}
                    request={(params, sort) => {
                        params.order_type = 0;
                        return getData(params, sort, getPayOrder)
                    }}
                    pagination={{defaultPageSize: 10} as TablePaginationConfig}
                    search={false}
                />
            </Col>
        </Row>
    </>
    return <Body>
        {page}
    </Body>
};
