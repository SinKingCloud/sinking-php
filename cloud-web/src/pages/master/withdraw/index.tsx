import React, {useEffect, useRef, useState} from 'react';
import {
    App,
    Button,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Space,
    Table,
    Tag,
    Typography
} from 'antd';
import ProTable from '@ant-design/pro-table';
import {getData, getParams} from "@/utils/page";
import {DownOutlined} from "@ant-design/icons";
import {getCashList, updateCash} from "@/service/master/withdraw";
import {Body} from '@/components';
import {getNoticeList} from "@/service/master/notice";
export default (): React.ReactNode => {
    /**
     * 表单处理
     */
    const {message} = App.useApp()
    const actionRef = useRef();
    const ref = useRef();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalEditVisible, setIsModalEditVisible] = useState(false);

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
        await updateCash({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    message?.success(r?.message)
                    setIsModalVisible(false)
                    // @ts-ignore
                    actionRef.current.reload()
                    form.resetFields();
                }
            },
            onFail: (r: any) => {
                if (r?.code != 200) {
                    message?.error(r?.message || "请求失败")
                }
            }
        })
    }

    /**
     * 批量修改提交表单
     * @param values 表单项
     */
    const onEditFinish = async (values: any) => {
        values.ids = selectedRowKeys
        if (values.status != undefined && values.status >= 0) {
            values.status = values.status.toString();
        }
        await updateCash({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    message?.success(r?.message)
                    setIsModalEditVisible(false)
                    // @ts-ignore
                    actionRef.current.reload()
                    // @ts-ignore
                    actionRef.current.clearSelected();
                    edit.resetFields();
                }
            },
            onFail: (r: any) => {
                if (r?.code != 200) {
                    message?.error(r?.message || "请求失败")
                }
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
            title: '完成时间',
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
            title: '完成时间',
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
                return <Dropdown menu={{
                    items: [
                        {
                            key: "edit",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    form.setFieldsValue(record);
                                    setIsModalVisible(true);
                                }}>
                                    编 辑
                                </a>
                            )
                        }
                    ]
                }} trigger={['click']} placement="bottom" arrow={true}>
                    <Button size={"small"} onClick={e => e.preventDefault()}>
                        操作<DownOutlined/>
                    </Button>
                </Dropdown>;
            }
        },
    ];
    const [title,setTitle] = useState<any>()
    useEffect(()=>{
        setTitle(form.getFieldValue("id"))
    },[])
    return (
        <Body>
            <Modal key={"form"} destroyOnClose={true} width={400} forceRender={true}
                   title={title == undefined ? "申请提现" : "编辑提现"}
                   open={isModalVisible} onOk={form.submit} okText={"确 认"} onCancel={() => {
                        setIsModalVisible(false);
                        form.resetFields();
            }}>
                <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 6}}
                      wrapperCol={{span: 16}} >
                    <Form.Item name="id" label="ID" rules={[{required: true}]}>
                        <Input placeholder="请输入ID"/>
                    </Form.Item>
                    <Form.Item name="type" label="提现方式" rules={[{required: true}]}>
                        <Select placeholder="请选择提现方式" options={[
                            {
                                value: 0,
                                label: "支付宝",
                            }
                        ]}/>
                    </Form.Item>
                    <Form.Item name="name" label="提现姓名" rules={[{required: true}]}>
                        <Input placeholder="请输入提现姓名"/>
                    </Form.Item>
                    <Form.Item name="account" label="提现账号" rules={[{required: true}]}>
                        <Input placeholder="请输入提现账号"/>
                    </Form.Item>
                    <Form.Item name="money" label="提现金额" hidden={title != undefined}
                               rules={[{required: true}]}>
                        <InputNumber placeholder="请输入提现金额" style={{minWidth: "150px"}}/>
                    </Form.Item>
                    <Form.Item name="status" label="提现状态" rules={[{required: true}]}>
                        <Select placeholder="请选择提现状态" options={[
                            {
                                value: 0,
                                label: "正在处理",
                            },
                            {
                                value: 1,
                                label: "处理完成",
                            }
                        ]}/>
                    </Form.Item>
                    <Form.Item name="remark" label="提现备注">
                        <Input.TextArea placeholder="请输入备注"/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal key={"edit"} width={350} destroyOnClose={true} forceRender={true} title="批量编辑"
                   open={isModalEditVisible}
                   onOk={edit.submit} okText={"确 认"} onCancel={() => {
                setIsModalEditVisible(false);
                edit.resetFields();
            }}>
                <Form form={edit} name="control-hooks1" onFinish={onEditFinish} labelAlign="right" labelCol={{span: 6}}
                      wrapperCol={{span: 16}} >
                    <Form.Item name="status" label="状态">
                        <Select placeholder="请选择提现状态" options={[
                            {
                                value: 0,
                                label: "正在处理"
                            },
                            {
                                value: 1,
                                label: "处理完成"
                            }
                        ]}/>
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input.TextArea placeholder="请输入备注"/>
                    </Form.Item>
                </Form>
            </Modal>

            <ProTable
                // @ts-ignore
                columns={columns}
                form={{layout: "vertical", autoFocusFirstInput: false}}
                headerTitle={'提现列表'}
                actionRef={actionRef}
                formRef={ref}
                scroll={{x: true}}
                style={{overflowX: "auto", whiteSpace: "nowrap"}}
                rowKey={'id'}
                options={{
                    density: true,
                    fullScreen: true,
                    setting: true,
                }}
                rowSelection={{
                    selectedRowKeys,
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                    onChange: (newSelectedRowKeys) => {
                        setSelectedRowKeys(newSelectedRowKeys);
                    },
                }}
                tableAlertRender={({selectedRowKeys, onCleanSelected,}) => {
                    return (<Space size={24}>
                        <span>已选 {selectedRowKeys.length} 项
                            <a style={{marginInlineStart: 8}} onClick={onCleanSelected}>取消选择</a>
                        </span>
                    </Space>);
                }}
                tableAlertOptionRender={() => {
                    return (
                        <Space size={16}>
                            <a onClick={() => setIsModalEditVisible(true)}>批量编辑</a>
                        </Space>
                    );
                }}
                request={async (params, sort) => {
                    return getData(params,sort,getCashList)
                }}
                search={{
                    defaultCollapsed: true,
                    labelWidth: 'auto',
                }}
            />
        </Body>
    );
};
