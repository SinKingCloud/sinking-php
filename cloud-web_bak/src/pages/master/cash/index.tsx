import React, {useRef, useState} from 'react';
import {Button, Dropdown, Form, Input, InputNumber, Menu, message, Modal, Select, Table, Tag, Typography} from 'antd';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {getParams} from "@/util/page";
import {DownOutlined} from "@ant-design/icons";
import {getCashList, updateCash} from "@/services/master/cash";

export default (): React.ReactNode => {

  /**
   * 表单处理
   */
  const actionRef = useRef();
  const ref = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);

  /**
   * 获取选中项
   */
  const getSelectedIds = () => {
    const ids: any[] = [];
    selectedRowsState.map((k: any) => {
      ids.push(k.id);
    });
    return ids;
  };

  /**
   * 表单
   */
  const [form] = Form.useForm();//新建编辑表单
  const [edit] = Form.useForm();//批量修改表单
  /**
   * 新建编辑提交表单
   * @param values 表单项
   */
  const onFormFinish = async (values: any) => {
    values.ids = [values.id];
    values.status = values.status.toString();
    delete values.id;
    setIsModalVisible(false)
    updateCash(values).then((r) => {
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
   * 批量修改提交表单
   * @param values 表单项
   */
  const onEditFinish = async (values: any) => {
    setIsModalEditVisible(false);
    values.ids = getSelectedIds()
    if (values.status != undefined && values.status >= 0) {
      values.status = values.status.toString();
    }
    updateCash(values).then((r) => {
      if (r.code != 200) {
        message.error(r.message || "请求失败").then()
      } else {
        // @ts-ignore
        actionRef.current.reload()
        // @ts-ignore
        actionRef.current.clearSelected();
        edit.resetFields();
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
      title: '账号信息',
      dataIndex: 'account',
      tip: '用户账号',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>昵称:{record?.user?.nick_name}(￥{parseFloat(record?.user?.money || 0).toFixed(2)}元)</Tag>
          <br/>
          <Tag>账号:{record?.user?.account || '未设置'}(<Typography.Text
            copyable>{record?.user?.email}</Typography.Text>)</Tag>
        </>;
      }
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
      title: '用户ID',
      dataIndex: 'user_id',
      tip: '用户ID',
      hideInTable: true,
      valueType: 'digit',
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
                form.setFieldsValue(record);
                setIsModalVisible(true);
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
      <Modal key={"form"} destroyOnClose={true} width={400} forceRender={true}
             title={form.getFieldValue("id") == undefined ? "申请提现" : "编辑提现"}
             visible={isModalVisible} onOk={form.submit} okText={"确 认"} onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}>
        <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 6}}
              wrapperCol={{span: 16}}>
          <Form.Item name={"id"} label="ID" hidden={true}>
            <Input placeholder="请输入ID"/>
          </Form.Item>
          <Form.Item name={"type"} label="提现方式" rules={[{required: true}]}>
            <Select placeholder="请选择提现方式">
              <Select.Option value={0}>支付宝</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={"name"} label="提现姓名" rules={[{required: true}]}>
            <Input placeholder="请输入提现姓名"/>
          </Form.Item>
          <Form.Item name={"account"} label="提现账号" rules={[{required: true}]}>
            <Input placeholder="请输入提现账号"/>
          </Form.Item>
          <Form.Item name={"money"} label="提现金额" hidden={form.getFieldValue('id') != undefined}
                     rules={[{required: true}]}>
            <InputNumber placeholder="请输入提现金额" style={{minWidth: "150px"}}/>
          </Form.Item>
          <Form.Item name={"status"} label="提现状态" rules={[{required: true}]}>
            <Select placeholder="请选择提现状态">
              <Select.Option value={0}>正在处理</Select.Option>
              <Select.Option value={1}>处理完成</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={"remark"} label="提现备注">
            <Input.TextArea placeholder="请输入备注"/>
          </Form.Item>
        </Form>
      </Modal>

      <Modal key={"edit"} width={350} destroyOnClose={true} forceRender={true} title="批量编辑" visible={isModalEditVisible}
             onOk={edit.submit} okText={"确 认"} onCancel={() => {
        setIsModalEditVisible(false);
        edit.resetFields();
      }}>
        <Form form={edit} name="control-hooks" onFinish={onEditFinish} labelAlign="right" labelCol={{span: 6}}
              wrapperCol={{span: 16}}>
          <Form.Item name={"status"} label="状态">
            <Select placeholder="请选择提现状态">
              <Select.Option value={0}>正在处理</Select.Option>
              <Select.Option value={1}>处理完成</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={"remark"} label="备注">
            <Input.TextArea placeholder="请输入备注"/>
          </Form.Item>
        </Form>
      </Modal>

      <ProTable
        // @ts-ignore
        columns={columns}
        defaultSize={"small"}
        form={{layout: "vertical", autoFocusFirstInput: false}}
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

        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
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
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择&nbsp;&nbsp;<a style={{fontWeight: 600}}>{selectedRowsState.length}</a>&nbsp;&nbsp;项
            </div>
          }>
          <Button type="primary"
                  onClick={async () => {
                    setIsModalEditVisible(true);
                  }}>
            批量编辑
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
