import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Button, DatePicker, Form, message, Modal, Select, Tag, Typography} from "antd";
import {getParams} from "@/util/page";
import {deleteOrder, getOrderList} from "@/services/master/order";
import {ExclamationCircleOutlined} from "@ant-design/icons";

export default (): React.ReactNode => {
  /**
   * 表单处理
   */
  const actionRef = useRef();
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
      hideInTable: true,
    },
    {
      title: '外部订单ID',
      dataIndex: 'out_trade_no',
      tip: '外部订单唯一ID',
      hideInTable: true,
    },
    {
      title: '站点ID',
      dataIndex: 'web_id',
      tip: '请输入站点ID以筛选',
      hideInTable: true,
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      tip: '请输入用户ID以筛选',
      hideInTable: true,
    },
    {
      title: '账号信息',
      dataIndex: 'user',
      tip: '用户账号信息',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>昵称:{record?.user?.nick_name}(ID:<Typography.Text
            copyable>{record?.user?.id || 0}</Typography.Text>)</Tag>
          <br/>
          <Tag>邮箱:<Typography.Text copyable>{record?.user?.email}</Typography.Text></Tag>
        </>;
      }
    },
    {
      title: '所属站点',
      dataIndex: 'web',
      tip: '所属站点ID',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>名称:<Typography.Text copyable>{record?.web?.name}</Typography.Text></Tag>
          <br/>
          <Tag>ID:<Typography.Text copyable>{record?.web_id}</Typography.Text></Tag>
        </>;
      }
    },
    {
      title: '订单ID',
      tip: '订单ID信息(内部订单号/外部订单号)',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <div>
          {record?.trade_no && <Tag><Typography.Text copyable>{record?.trade_no}</Typography.Text></Tag>}
          {record?.out_trade_no && <><br/><Tag><Typography.Text
            copyable>{record?.out_trade_no}</Typography.Text></Tag></>}
        </div>;
      }
    },
    {
      title: '订单类型',
      dataIndex: 'order_type',
      tip: '订单类型',
      valueEnum: {
        0: {
          text: '余额充值',
          color: '#2d8efc',
        },
        1: {
          text: '开通主站',
          color: '#5037ff',
        },
        2: {
          text: '在线下单',
          color: '#13e537',
        },
        3: {
          text: '续费主站',
          color: '#6d1aa1',
        }
      },
    },
    {
      title: '订单名称',
      dataIndex: 'name',
      tip: '订单名称',
      hideInSearch: true,
    },
    {
      title: '订单金额',
      dataIndex: 'money',
      tip: '订单金额',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag color={"green"}>金额:{parseFloat(record?.money || 0).toFixed(2) + "元"}</Tag>
          <br/>
          <Tag color={"blue"}>提成:{parseFloat(record?.commission_money || 0).toFixed(2) + "元"}</Tag>
        </>;
      }
    },
    {
      title: '支付方式',
      dataIndex: 'pay_type',
      tip: '支付方式',
      valueEnum: {
        0: {
          text: '支付宝',
          color: 'blue',
        },
        1: {
          text: '微信',
          color: 'green',
        },
        2: {
          text: 'QQ',
          color: 'yellow',
        },
        3: {
          text: '余额',
          color: 'red',
        }
      },
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
      tip: '订单支付时间',
      hideInSearch: true,
    },
    {
      title: '支付时间',
      valueType: 'dateTimeRange',
      dataIndex: 'update_time',
      tip: '订单支付时间',
      hideInTable: true,
      search: {
        transform: (value: any) => {
          return {
            update_time_start: value[0],
            update_time_end: value[1],
          };
        },
      },
    },
    {
      title: '创建时间',
      valueType: 'dateTimeRange',
      dataIndex: 'create_time',
      tip: '订单创建时间',
      hideInTable: true,
      search: {
        transform: (value: any) => {
          return {
            create_time_start: value[0],
            create_time_end: value[1],
          };
        },
      },
    },
  ];

  /**
   * 弹窗处理
   */
  const [deleteForm] = Form.useForm();//删除表单
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const onDeleteFinish = async (values: any) => {
    setIsDeleteModalVisible(false);
    Modal.confirm({
      title: '您确定要删除符合该条件数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后该数据不可恢复',
      okType: 'danger',
      onOk() {
        deleteForm.resetFields();
        const rangeTimeValue = values['range-time-picker'];
        deleteOrder({
          create_time_start: rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
          create_time_end: rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
          status: values['status'] >= 0 ? values['status'] : "",
          pay_type: values['pay_type'] >= 0 ? values['pay_type'] : "",
          prder_type: values['prder_type'] >= 0 ? values['prder_type'] : "",
        }).then((r) => {
          if (r.code != 200) {
            message.error(r.message || "请求失败").then()
          } else {
            // @ts-ignore
            actionRef.current.reloadAndRest()
            message.success(r.message).then()
          }
        })
      },
    });
  }

  return (
    <PageContainer title={false}>
      <Modal key={"delete"} width={370} destroyOnClose={true} forceRender={true} title="清理数据"
             visible={isDeleteModalVisible}
             onOk={deleteForm.submit} okText={"确 认"} onCancel={() => {
        setIsDeleteModalVisible(false);
        deleteForm.resetFields();
      }}>
        <Form form={deleteForm} name="control-hooks" onFinish={onDeleteFinish} labelAlign="right"
              labelCol={{span: 6}}
              wrapperCol={{span: 24}}>
          <Form.Item name={"status"} label="订单状态" rules={[{required: true}]} initialValue={"0"}>
            <Select placeholder="请选择订单状态">
              <Select.Option value="-1">全部</Select.Option>
              <Select.Option value="0">未支付</Select.Option>
              <Select.Option value="1">已支付</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={"pay_type"} label="支付方式" rules={[{required: true}]} initialValue={"-1"}>
            <Select placeholder="请选择支付方式">
              <Select.Option value="-1">全部</Select.Option>
              <Select.Option value="0">支付宝</Select.Option>
              <Select.Option value="1">微信</Select.Option>
              <Select.Option value="2">QQ</Select.Option>
              <Select.Option value="3">余额</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={"order_type"} label="订单类型" rules={[{required: true}]} initialValue={"-1"}>
            <Select placeholder="请选择订单类型">
              <Select.Option value="-1">全部</Select.Option>
              <Select.Option value="0">余额充值</Select.Option>
              <Select.Option value="1">在线下单</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="range-time-picker" label="时间范围" rules={[{required: true}]}>
            <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
          </Form.Item>
        </Form>
      </Modal>
      <ProTable
        defaultSize={"small"}
        form={{layout: "vertical",autoFocusFirstInput:false}}
        headerTitle={'订单记录'}
        actionRef={actionRef}
        formRef={ref}
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
          const data = await getOrderList(getParams(params, sort));
          return {
            data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
            success: data.code === 200,
            total: data.data.total,
          };
        }}
        search={{
          defaultCollapsed: true,
          labelWidth: 20,
        }}
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => {
            setIsDeleteModalVisible(true)
          }}>
            清理
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
