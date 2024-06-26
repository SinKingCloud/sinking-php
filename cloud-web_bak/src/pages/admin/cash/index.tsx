import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Dropdown, Form, Input, InputNumber, Menu, message, Modal, Select, Tag, Typography} from 'antd';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {getParams} from "@/util/page";
import {DownOutlined} from "@ant-design/icons";
import {createCash, getCashConfig, getCashList, updateCash} from "@/services/admin/cash";

export default (): React.ReactNode => {
  /**
   * 初始化
   */
  const [cashConfig, setCashConfig] = useState({});
  useEffect(() => {
    getCashConfig().then((r) => {
      if (r?.code == 200) {
        setCashConfig(r?.data);
      }
    })
  }, []);

  /**
   * 表单处理
   */
  const actionRef = useRef();
  const ref = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * 表单
   */
  const [form] = Form.useForm();//新建编辑表单
  /**
   * 新建编辑提交表单
   * @param values 表单项
   */
  const onFormFinish = async (values: any) => {
    let api = createCash;
    if (values.id != undefined) {
      api = updateCash;
      values.ids = [values.id];
      delete values.id;
    }
    setIsModalVisible(false)
    api(values).then((r) => {
      if (r.code != 200) {
        message.error(r.message || "请求失败").then()
      } else {
        // @ts-ignore
        actionRef.current.reload()
        form.resetFields();
        message.success(r.message).then()
      }
    })
  }

  /**
   * table表格渲染
   */
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '记录ID',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '提现信息',
      dataIndex: 'cash',
      tip: '提现信息',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>提现姓名:<Typography.Text copyable>{record?.name}</Typography.Text></Tag>
          <br/>
          <Tag>提现账号:<Typography.Text copyable>{record?.account || '未设置'}</Typography.Text></Tag>
        </>;
      }
    },
    {
      title: '金额信息',
      dataIndex: 'money',
      tip: '用户账号',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>提现金额:{parseFloat(record?.money || 0).toFixed(2)}元</Tag>
          <br/>
          <Tag>实际到账:{parseFloat(record?.real_money || 0).toFixed(2)}元</Tag>
        </>;
      }
    },
    {
      title: '提现方式',
      dataIndex: 'type',
      tip: '提现方式',
      valueEnum: {
        0: {
          text: '支付宝',
          color: 'blue',
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      tip: '备注',
      hideInSearch: true,
    },
    {
      title: '提现姓名',
      dataIndex: 'name',
      tip: '提现姓名',
      hideInTable: true,
    },
    {
      title: '提现账号',
      dataIndex: 'account',
      tip: '提现账号',
      hideInTable: true,
    },
    {
      title: '修改时间',
      valueType: 'dateTime',
      dataIndex: 'update_time',
      tip: '修改时间',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '申请时间',
      valueType: 'dateTime',
      dataIndex: 'create_time',
      tip: '上次申请时间',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '修改时间',
      valueType: 'dateTimeRange',
      dataIndex: 'update_time',
      tip: '上次修改时间',
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
      title: '申请时间',
      valueType: 'dateTimeRange',
      dataIndex: 'create_time',
      tip: '申请提现时间',
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
    {
      title: '状态',
      dataIndex: 'status',
      tip: '提现状态',
      sorter: true,
      valueEnum: {
        1: {
          text: '处理完毕',
          status: 'success',
        },
        0: {
          text: '正在处理',
          status: 'warning',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'Option',
      hideInSearch: true,
      editable: false,
      render: (text: string, record: any) => {
        return <Dropdown overlay={(
          <Menu>
            <Menu.Item key={"edit"}>
              <a style={{fontSize: "small"}} onClick={() => {
                if (record?.status != 0) {
                  message.error("已处理的提现记录无法编辑")
                } else {
                  form.setFieldsValue(record);
                  setIsModalVisible(true);
                }
              }}>
                编 辑
              </a>
            </Menu.Item>
          </Menu>
        )} trigger={['click']} placement="bottomCenter" arrow={true}>
          <Button size={"small"} style={{fontSize: "small"}} onClick={e => e.preventDefault()}>操
            作 <DownOutlined/></Button>
        </Dropdown>;
      }
    },
  ];

  return (
    <PageContainer title={false}>
      <Modal key={"form"} destroyOnClose={true} forceRender={true}
             width={400}
             title={form.getFieldValue("id") == undefined ? "申请提现" : "编辑提现"}
             visible={isModalVisible} onOk={form.submit} okText={"确 认"} onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}>
        <div hidden={form.getFieldValue('id') != undefined}>
          <Alert message={"提现费率:" + cashConfig['cash.deduct'] + "%,单笔最低:" + cashConfig['cash.min.money'] + "元"}
                 type="info" showIcon style={{marginBottom: "20px"}}/>
        </div>
        <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 6}}
              wrapperCol={{span: 16}}>
          <Form.Item name="id" label="ID" hidden={true}>
            <Input placeholder="请输入ID"/>
          </Form.Item>
          <Form.Item name="type" label="提现方式" rules={[{required: true}]}>
            <Select placeholder="请选择提现方式">
              <Select.Option value={0}>支付宝</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="name" label="提现姓名" rules={[{required: true}]}>
            <Input placeholder="请输入提现姓名"/>
          </Form.Item>
          <Form.Item name="account" label="提现账号" rules={[{required: true}]}>
            <Input placeholder="请输入提现账号"/>
          </Form.Item>
          <Form.Item name="money" label="提现金额" hidden={form.getFieldValue('id') != undefined}
                     rules={[{required: true}]}>
            <InputNumber placeholder="请输入提现金额" style={{minWidth: "150px"}}/>
          </Form.Item>
        </Form>
      </Modal>
      <ProTable
        // @ts-ignore
        columns={columns}
        defaultSize={"small"}
        form={{layout: "vertical",autoFocusFirstInput:false}}
        headerTitle={'提现列表'}
        actionRef={actionRef}
        formRef={ref}
        scroll={{x: "auto"}}
        rowKey={'id'}
        options={{
          density: true,
          fullScreen: true,
          setting: true,
        }}
        request={async (params, sort) => {
          const data = await getCashList(getParams(params, sort));
          return {
            data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
            success: data.code === 200,
            total: data.data.total,
          };
        }}
        search={{
          defaultCollapsed: true,
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => {
            if (cashConfig['cash.open'] != 1) {
              message.warn("系统未开启提现功能")
            } else {
              setIsModalVisible(true)
            }
          }}>
            提现
          </Button>,
        ]}/>
    </PageContainer>
  );
};
