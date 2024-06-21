import React, {useEffect, useRef, useState} from 'react';
import {Alert, App, Button, Dropdown, Form, Input, InputNumber, Modal, Select, Tag, Typography} from 'antd';
import ProTable from '@ant-design/pro-table';
import {getData} from "@/utils/page";
import {DownOutlined} from "@ant-design/icons";
import {createCash, getCashConfig, getCashList, updateCash} from "@/service/admin/cash";
import {Body, Title} from "@/components";
import {NamePath} from "rc-field-form/es/interface";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css}) => {
    return {
        modals: css`
            .ant-modal-title {
                margin-bottom: 15px;
            }
        `
    }
})
export default (): React.ReactNode => {
    const {styles: {modals}} = useStyles()
    /**
     * 初始化
     */
    const {message} = App.useApp()
    const [cashConfig, setCashConfig] = useState({});
    useEffect(() => {
        getCashConfig({
            onSuccess: (r: any) => {
                setCashConfig(r?.data);
            }
        })
    }, []);

    /**
     * 表单处理
     */
    const actionRef = useRef<any>();
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
        await api({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                message?.success(r?.message)
                setIsModalVisible(false)
                actionRef.current.reload()
                form.resetFields();
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
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
                                    if (record?.status != 0) {
                                        message?.error("已处理的提现记录无法编辑")
                                    } else {
                                        form.setFieldsValue(record);
                                        setIsModalVisible(true);
                                    }
                                }}>
                                    编 辑
                                </a>
                            )
                        }
                    ]
                }} trigger={['click']} placement="bottom" arrow={true}>
                    <Button size="small" onClick={e => e.preventDefault()}>操
                        作 <DownOutlined/></Button>
                </Dropdown>;
            }
        },
    ];
    const [title, setTitle] = useState<any>()
    useEffect(() => {
        setTitle(form.getFieldValue("id" as NamePath))
    }, [isModalVisible])
    return (
        <Body>
            <Modal key={"form"} destroyOnClose={true} forceRender={true} width={400}
                   title={<Title>{title == undefined ? "申请提现" : "编辑提现"}</Title>} className={modals}
                   open={isModalVisible} onOk={form.submit} okText={"确 认"} onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
            }}>
                <div hidden={title != undefined}>
                    <Alert
                        message={"提现费率:" + cashConfig['cash.deduct'] + "%,单笔最低:" + cashConfig['cash.min.money'] + "元"}
                        type="info" showIcon style={{marginBottom: "20px"}}/>
                </div>
                <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 6}}
                      wrapperCol={{span: 16}}>
                    <Form.Item name="id" label="ID" hidden={true}>
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
                </Form>
            </Modal>
            <ProTable
                // @ts-ignore
                columns={columns}
                defaultSize={"small"}
                form={{layout: "vertical", autoFocusFirstInput: false}}
                headerTitle={<Title>提现列表</Title>}
                actionRef={actionRef}
                formRef={ref}
                style={{overflowX: "auto", whiteSpace: "nowrap"}}
                scroll={{x: true}}
                rowKey={'id'}
                options={{
                    density: true,
                    fullScreen: true,
                    setting: true,
                }}
                request={(params, sort) => {
                    return getData(params, sort, getCashList)
                }}
                search={{
                    defaultCollapsed: true,
                    labelWidth: 'auto',
                }}
                toolBarRender={() => [
                    <Button key="primary" type="primary" onClick={() => {
                        if (cashConfig['cash.open'] != 1) {
                            message?.warning("系统未开启提现功能");
                        } else {
                            setIsModalVisible(true)
                        }
                    }}>
                        提现
                    </Button>,
                ]}/>
        </Body>
    );
};
