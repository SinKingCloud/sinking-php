import React, {useEffect, useRef, useState} from 'react';
import {
    App,
    Button,
    Drawer,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Modal,
    ModalProps,
    Select,
    Space,
    Spin,
    Table
} from 'antd';
import ProTable from '@ant-design/pro-table';
import {getData} from "@/utils/page";
import {DownOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {createNotice, deleteNotice, getNoticeInfo, getNoticeList, updateNotice} from "@/service/master/notice";
import BraftEditor from "braft-editor";
import 'braft-editor/dist/index.css';
import {uploadFile} from "@/service/common/upload";
import {Body} from '@/components';
import {NamePath} from "rc-field-form/es/interface";

export default (): React.ReactNode => {
    const {message, modal} = App.useApp()
    /**
     * 表单处理
     */
    const actionRef = useRef();
    const ref = useRef();
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
        let api = createNotice;
        if (values.id != undefined) {
            api = updateNotice;
            values.ids = [values.id];
            values.sort = values.sort.toString();
            values.status = values.status.toString();
            delete values.id;
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        values.content = editValue || "";
        await api({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    message?.success(r?.message)
                    setIsModalVisible(false)
                    form.resetFields();
                    //@ts-ignore
                    actionRef.current.reload()
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
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const showBatchModal = () => {
        setIsModalEditVisible(true);
    }
    const onEditFinish = async (values: any) => {
        values.ids = selectedRowKeys
        if (values.status != undefined && values.status >= 0) {
            values.status = values.status.toString();
        }
        await updateNotice({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    message?.success(r?.message)
                    setIsModalEditVisible(false);
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
                    setIsModalEditVisible(false)
                }
            }
        })

    }

    /**
     * 删除数据
     * @param ids id列表
     */
    const deleteSubmit = (ids: any[]) => {
        modal.confirm({
            title: '您确定要删除该数据吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '删除后该数据不可恢复',
            okType: 'danger',
            onOk: async () => {
                message?.loading({content: '正在删除公告', duration: 600000, key: "notice"})
                await deleteNotice({
                    body: {
                        ids: ids
                    },
                    onSuccess: (r: any) => {
                        if (r?.code == 200) {
                            message?.success(r?.message)
                            message.destroy("notice")
                            //@ts-ignore
                            actionRef.current.reloadAndRest()
                        }
                    },
                    onFail: (r: any) => {
                        if (r?.code != 200) {
                            message?.error(r?.message || "请求失败")
                            message.destroy("notice")
                        }
                    }
                })
            },
        } as ModalProps);
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
            title: '标题',
            dataIndex: 'title',
            tip: '通知标题',
            copyable: true,
        },
        {
            title: '位置',
            dataIndex: 'place',
            tip: '通知显示位置',
            valueEnum: {
                "index": {
                    text: '系统首页',
                },
                "shop": {
                    text: '用户商城',
                },
                "admin": {
                    text: '分站后台',
                },
            },
        },
        {
            title: '浏览量',
            dataIndex: 'look_num',
            tip: '通知的浏览量',
            hideInSearch: true,
            render: (text: string) => {
                return text + "次";
            }
        },
        {
            title: '排序',
            dataIndex: 'sort',
            tip: '将会由大到小显示',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '修改时间',
            valueType: 'dateTime',
            dataIndex: 'update_time',
            tip: '上次修改时间',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '添加时间',
            valueType: 'dateTime',
            dataIndex: 'create_time',
            tip: '上次修改时间',
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
            title: '添加时间',
            valueType: 'dateTimeRange',
            dataIndex: 'create_time',
            tip: '添加记录时间',
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
            tip: '显示状态',
            sorter: true,
            valueEnum: {
                0: {
                    text: '显示',
                    status: 'success',
                },
                1: {
                    text: '隐藏',
                    status: 'error',
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
                                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                    showNoticeInfo(record?.id)
                                }}>
                                    编 辑
                                </a>
                            )
                        },
                        {
                            key: "delete",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    // @ts-ignore
                                    deleteSubmit([record.id])
                                }}>
                                    删 除
                                </a>
                            )
                        }
                    ]
                }} trigger={['click']} placement="bottom" arrow={true}>
                    <Button size={"small"} onClick={e => e.preventDefault()}>操
                        作 <DownOutlined/></Button>
                </Dropdown>;
            }
        },
    ];

    /**
     * 富文本编辑器内容
     */
    const [editValue, setEditValue] = useState();
    /**
     * 获取公告详情
     * @param id 公告ID
     */
    const [noticeLoading, setNoticeLoading] = useState(false);
    const showNoticeInfo = (id: number) => {
        setNoticeLoading(true);
        setIsModalVisible(true);
        getNoticeInfo({
            body: {
                id: id
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    r.data.content = BraftEditor.createEditorState(r?.data?.content);
                    form.setFieldsValue(r?.data);
                    setNoticeLoading(false);
                }
            },
            onFail: (r: any) => {
                if (r?.code != 200) {
                    message?.error(r?.message || "请求失败")
                    setNoticeLoading(false);
                }
            }
        });
    }
    const [title, setTitle] = useState<any>()
    useEffect(() => {
        setTitle(form.getFieldValue("id" as NamePath));
    }, [])
    return (
        <Body>
            <Drawer key="form" destroyOnClose={true} forceRender={true}
                    width="100%"
                    title={title == undefined ? "新 建" : "编 辑"}
                    open={isModalVisible} onClose={() => {
                setIsModalVisible(false);
                form.resetFields();
            }}>
                <Spin spinning={noticeLoading}>
                    <div style={{display: !noticeLoading ? "block" : "none"}}>
                        <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right"
                              labelCol={{span: 2}} wrapperCol={{span: 21}}>
                            <Form.Item name="id" label="ID" hidden={true}>
                                <Input placeholder="请输入ID"/>
                            </Form.Item>
                            <Form.Item name="title" label="标题" rules={[{required: true}]}>
                                <Input placeholder="请输入标题" style={{maxWidth: "500px"}}/>
                            </Form.Item>
                            <Form.Item name="place" label="位置" rules={[{required: true}]}>
                                <Select placeholder="请输入显示位置" style={{maxWidth: "500px"}} options={[{
                                    value: "index",
                                    label: "系统首页"
                                }, {
                                    value: "shop",
                                    label: "用户商城"
                                }, {
                                    value: "admin",
                                    label: "分站后台"
                                }]}/>
                            </Form.Item>
                            <Form.Item name="sort" label="排序" rules={[{required: true}]}>
                                <InputNumber placeholder="请输入排序数值"
                                             style={{maxWidth: "500px", minWidth: "150px"}}/>
                            </Form.Item>
                            <Form.Item name="status" label="状态" rules={[{required: true}]}>
                                <Select placeholder="请选择公告状态" style={{maxWidth: "500px"}} options={[{
                                    value: 0,
                                    label: "显示"
                                }, {
                                    value: 1,
                                    label: "隐藏"
                                }]}/>

                            </Form.Item>
                            <Form.Item name="content" label="内容" rules={[{required: true}]}>
                                <BraftEditor
                                    onChange={(editorState: any) => {
                                        setEditValue(editorState.toHTML());
                                    }}
                                    media={{
                                        uploadFn: async (param) => {
                                            const formData = new FormData();
                                            formData.append('file', param.file);
                                            const res = await uploadFile(formData);
                                            if (res?.code == 200) {
                                                param.success({
                                                    meta: {
                                                        alt: param?.file?.name || "",
                                                        autoPlay: false,
                                                        controls: false,
                                                        id: res?.data || "",
                                                        loop: false,
                                                        poster: param?.file?.name || "",
                                                        title: param?.file?.name || ""
                                                    }, url: res?.data || ""
                                                });
                                            } else {
                                                param.error({msg: "上传文件失败"});
                                            }
                                        }
                                    }}
                                    className="my-editor"
                                    style={{border: "1px solid #d1d1d1", borderRadius: "5px"}}
                                    placeholder="请输入通知内容"
                                />
                            </Form.Item>
                            <Form.Item style={{textAlign: "center"}}>
                                <Button type="primary" htmlType="submit">
                                    确认
                                </Button>
                                <Button htmlType="button" onClick={() => {
                                    form.resetFields();
                                }} style={{marginLeft: "10px"}}>
                                    重置
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Spin>

            </Drawer>

            <Modal key={"edit"} width={350} destroyOnClose={true} forceRender={true} title="批量编辑"
                   open={isModalEditVisible}
                   onOk={edit.submit} okText={"确 认"} onCancel={() => {
                setIsModalEditVisible(false);
                edit.resetFields();
            }}>
                <Form form={edit} name="control-hooks1" onFinish={onEditFinish} labelAlign="right" labelCol={{span: 5}}
                      wrapperCol={{span: 18}}>
                    <Form.Item name="status" label="状态" colon
                               rules={[{required: true, message: "请选择修改的状态"}]}>
                        <Select placeholder="请选择公告状态" options={[{
                            value: 0,
                            label: "显示"
                        },
                            {
                                value: 1,
                                label: "隐藏"
                            }]}/>
                    </Form.Item>
                </Form>
            </Modal>

            <ProTable
                // @ts-ignore
                columns={columns}
                form={{layout: "vertical", autoFocusFirstInput: false}}
                headerTitle={'通知列表'}
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
                            <a onClick={showBatchModal}>批量修改</a>
                            <a onClick={() => {
                                deleteSubmit(selectedRowKeys)
                            }}>批量删除</a>
                        </Space>
                    );
                }}
                request={(params, sort) => {
                    return getData(params, sort, getNoticeList)
                }}
                search={{
                    defaultCollapsed: true,
                    labelWidth: 'auto',
                }}
                toolBarRender={() => [
                    <Button key="primary" type="primary" onClick={() => {
                        setIsModalVisible(true)
                    }}>
                        新建
                    </Button>,
                ]}/>
        </Body>
    );
};
