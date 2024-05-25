import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Button, Col, Form, Image, Input, message, Modal, Row, Tooltip} from 'antd';
import {PageContainer} from "@ant-design/pro-layout";
import ProCard, {CheckCard} from "@ant-design/pro-card";
import {useModel} from "@@/plugin-model/useModel";
import {getParams} from "@/util/page";
import ProTable from "@ant-design/pro-table";
import {getPayOrder} from "@/services/pay/order";
import {
  AlipayCircleOutlined,
  ExclamationCircleOutlined,
  QqOutlined,
  SyncOutlined,
  WechatOutlined
} from "@ant-design/icons";
import {getPayConfig, recharge} from "@/services/pay/pay";
import {checkMobile, isAppleDevice} from "@/util/device";
import {setPayJumpUrl} from "@/util/pay";

export default (): React.ReactNode => {
  const {initialState, setInitialState} = useModel('@@initialState');
  // @ts-ignore
  const {currentUser} = initialState;
  /**
   * 获取当前用户信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const [loading, setLoading] = useState(false);
  const [payConfig, setPayConfig] = useState({});
  useEffect(() => {
    setLoading(true);
    fetchUserInfo().then(() => {
      getPayConfig().then((r) => {
        if (r?.code == 200) {
          setPayConfig(r?.data);
        }
        setLoading(false);
      });
    });
  }, []);
  const [moneyInput, setMoneyInput] = useState(true);
  const [payBtnLoading, setPayBtnLoading] = useState(false);
  const [refreshIcon, setRefreshIcon] = useState(false);
  const [money, setMoney] = useState("");
  const [form] = Form.useForm();
  const ref = useRef();
  /**
   * table表格渲染
   */
  const columns = [
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
      render: (text: string, record: any) => {
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
  return (
    <PageContainer title={false}>
      <Row gutter={8}>
        <Col xs={{span: 24, offset: 0}} lg={{span: 8, offset: 0}} style={{paddingBottom: "20px"}}>
          <Row style={{paddingBottom: "20px"}}>
            <Col xs={{span: 24}} lg={{span: 24}}>
              <ProCard bordered loading={loading}>
                <div style={{float: "left"}}>
                  <div style={{float: "left"}}>
                    <Avatar style={{width: "80px", height: "80px"}} src={
                      <Image preview={false} style={{width: "80px", height: "80px"}}
                             src={currentUser?.avatar || "https://q1.qlogo.cn/g?b=qq&nk=10086&s=100&t=20190225"}/>}/>
                  </div>
                </div>
                <div style={{float: "right"}}>
                  <span style={{
                    fontSize: "40px",
                    fontWeight: "bolder"
                  }}>{parseFloat(currentUser?.money || 0).toFixed(2)}￥</span>
                  <br/>
                  <span style={{color: "#7e7e7e", float: "right"}}>账户余额
                    <Tooltip title="刷新余额"><a onClick={async () => {
                      setRefreshIcon(true);
                      await fetchUserInfo();
                      setRefreshIcon(false);
                      message.success("刷新成功");
                    }}> <SyncOutlined spin={refreshIcon}/></a></Tooltip></span>
                </div>
              </ProCard>
            </Col>
          </Row>
          <Row>
            <Col xs={{span: 24}} lg={{span: 24}}>
              <ProCard bordered title="账户充值" loading={loading} headerBordered>
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
                    recharge(values).then((r) => {
                      setPayBtnLoading(false);
                      if (r.code != 200) {
                        message.error(r?.message || "请求错误")
                      } else {
                        // @ts-ignore
                        ref.current?.reload();
                        setPayJumpUrl();
                        if (checkMobile() || isAppleDevice()) {
                          window.location.href = r.data;
                        } else {
                          window.open(r.data);
                        }
                        Modal.confirm({
                          title: '订单是否已支付成功?',
                          icon: <ExclamationCircleOutlined/>,
                          content: '如支付成功请点击确认或点击刷新按钮刷新余额',
                          async onOk() {
                            await fetchUserInfo();
                            // @ts-ignore
                            ref.current?.reload();
                          },
                        });
                      }
                    })
                  }}
                >
                  <Form.Item name="money" label="充值金额" initialValue={"10"}
                             rules={[{required: true, message: '请输入充值金额'}]}>
                    <CheckCard.Group style={{width: '100%', textAlign: "center"}} onChange={(values) => {
                      if (values == "") {
                        setMoneyInput(false);
                        if (money != "") {
                          form.setFieldsValue({money: money});
                        }
                      } else {
                        setMoneyInput(true);
                      }
                    }}>
                      <CheckCard
                        title="10元"
                        size={"small"}
                        value="10"
                        style={{width: "auto", borderRadius: "10px"}}
                      />
                      <CheckCard
                        title="50元"
                        size={"small"}
                        value="50"
                        style={{width: "auto", borderRadius: "10px"}}
                      />
                      <CheckCard
                        title="100元"
                        size={"small"}
                        value="100"
                        style={{width: "auto", borderRadius: "10px"}}
                      />
                      <CheckCard
                        title="500元"
                        size={"small"}
                        value="500"
                        style={{width: "auto", borderRadius: "10px"}}
                      />
                      <CheckCard
                        title="1000元"
                        size={"small"}
                        value="1000"
                        style={{width: "auto", borderRadius: "10px", display: moneyInput ? "inline-block" : "none"}}
                      />
                      <CheckCard
                        title="自定义"
                        size={"small"}
                        value=""
                        style={{width: "auto", borderRadius: "10px"}}
                      />
                      <Input placeholder={"金额"} bordered hidden={moneyInput}
                             onChange={(e) => {
                               setMoney(e.target.value);
                               form.setFieldsValue({money: e.target.value});
                             }}
                             style={{height: "47px", width: "80px", margin: "0px"}}/>
                    </CheckCard.Group>
                  </Form.Item>
                  <Form.Item
                    label="充值方式"
                    name="type"
                    rules={[{required: true, message: '请选择充值方式'}]}
                    initialValue={"0"}
                  >
                    <CheckCard.Group>
                      <Row gutter={10} wrap={true} style={{margin: "10px 0px 0px 0px"}}>
                        <Col lg={{span: 24}} xs={{span: 24}}>
                          <CheckCard
                            title={(<><AlipayCircleOutlined/> 支付宝</>)}
                            value="0"
                            size={"small"}
                            style={{
                              maxWidth: "95px",
                              borderRadius: "10px",
                              display: payConfig['pay.alipay.type'] ? 'inline-block' : 'none'
                            }}
                          />
                          <CheckCard
                            title={(<><WechatOutlined/> 微信</>)}
                            value="1"
                            size={"small"}
                            style={{
                              maxWidth: "85px",
                              borderRadius: "10px",
                              display: payConfig['pay.wxpay.type'] ? 'inline-block' : 'none'
                            }}
                          />
                          <CheckCard
                            title={(<><QqOutlined/> QQ</>)}
                            value="2"
                            size={"small"}
                            style={{
                              maxWidth: "85px",
                              borderRadius: "10px",
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
                      form.resetFields();
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
            defaultSize={"small"}
            form={{layout: "vertical", autoFocusFirstInput: false}}
            headerTitle={'充值记录'}
            scroll={{x: "auto"}}
            rowKey={'id'}
            options={{
              density: true,
              fullScreen: true,
              setting: true,
            }}
            // @ts-ignore
            columns={columns}
            request={async (params, sort) => {
              params.order_type = 0;
              const data = await getPayOrder(getParams(params, sort));
              if (data.code != 200) {
                message.error(data.message);
              }
              return {
                data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
                success: data.code === 200,
                total: data.data.total,
              };
            }}
            pagination={{defaultPageSize: 10}}
            search={false}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};
