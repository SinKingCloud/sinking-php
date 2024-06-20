import React, {useEffect, useRef, useState} from 'react';
import ProTable from '@ant-design/pro-table';
import {getData} from "@/utils/page";
import {
    Alert, App,
    Avatar,
    Badge,
    Button,
    Dropdown,
    Form,
    Input,
    Modal, ModalProps,
    Select, TablePaginationConfig,
    Tag,
    Typography,
    Upload
} from "antd";
import {updateUserInfo, updateUserMoney} from "@/service/admin/user";
import {DownOutlined, ExclamationCircleOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {getUploadUrl} from "@/service/common/upload";
import {
    createDomain,
    deleteDomain,
    getDomainConfig,
    getDomainList,
    getWebList,
    updateDomain,
    updateWebInfo
} from "@/service/admin/web";
import moment from "moment";
import {Body, Title} from '@/components';
import {useModel} from "umi";
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
     * 表单处理
     */
    const actionRef = useRef<any>();
    const ref = useRef();
    const {message, modal} = App.useApp()
    const user = useModel("user")
    /**
     * 图片上传
     */
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadFileList, setUploadFileList] = useState();
    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message?.error('请上传图片格式文件');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message?.error('图片不能大于2MB');
            return;
        }
        return isJpgOrPng && isLt2M;
    }
    const handleChange = (info: any) => {
        setUploadFileList(info.fileList);
        if (info.file.status === 'uploading') {
            setUploadLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setUploadLoading(false);
            const response = info.file.response;
            if (response?.code != 200) {
                message?.error(response?.message || "上传文件错误")
            } else {
                info.file.url = info.file.response.data;
                setUploadFileList(info.fileList);
            }
            return;
        }
    };

    /**
     * 用户编辑表单
     */
    const [form] = Form.useForm();//编辑用户表单
    const [isModalVisible, setIsModalVisible] = useState(false);//编辑用户弹窗
    const [isModalBtnLoading, setIsModalBtnLoading] = useState(false);//编辑用户弹窗按钮
    const onFormFinish = async (values: any) => {
        setIsModalBtnLoading(true);
        values.ids = [values.id];
        delete values.id;
        if (uploadFileList?.length > 0) {
            values.avatar = uploadFileList[0]?.url || ""
        } else {
            values.avatar = ""
        }
        values.user_type = 1;
        return updateUserInfo({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                message?.success(r?.message)
                setIsModalVisible(false);
                actionRef.current.reload()
                form.resetFields();
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            },
            onFinally: () => {
                setIsModalBtnLoading(false);
            }
        });
    }

    /**
     * 域名编辑表单
     */
    const [domainConfig, setDomainConfig] = useState({});
    useEffect(() => {
        getDomainConfig({
            onSuccess: (r: any) => {
                setDomainConfig(r?.data);
            }
        });
    }, []);
    const [isModalDomainVisible, setIsModalDomainVisible] = useState(false);//编辑弹窗
    const [domainWebId, setDomainWebId] = useState(0);//编辑弹窗
    const domainActionRef = useRef<any>();
    const domainRef = useRef();
    const deleteDomains = (ids: [number], web_id: number) => {
        modal.confirm({
            title: '确定要删除此域名吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '删除后此域名则不可访问',
            okType: 'danger',
            onOk: async () => {
                message?.loading({content: '正在删除域名', key: "delete", duration: 60})
                await deleteDomain({
                    body: {
                        ids: ids,
                        web_id: web_id
                    },
                    onSuccess: (r: any) => {
                        message?.success(r?.message)
                        domainActionRef?.current?.reload();
                    },
                    onFail: (r: any) => {
                        message?.error(r?.message || "请求失败")
                    },
                    onFinally: () => {
                        message?.destroy("delete")
                    }
                });
            },
        } as ModalProps);
    }
    const changeDomainStatus = (ids: [number], web_id: number, status: number) => {
        modal.confirm({
            title: '确定要' + (status == 0 ? "恢复" : "封禁") + '此域名吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '此操作将会影响此域名的访问',
            okType: 'primary',
            onOk: async () => {
                const key = "changeDomainStatus";
                message?.loading({content: '正在更改域名状态', key, duration: 60})
                await updateDomain({
                    body: {
                        web_id: web_id, ids: ids, status: status
                    },
                    onSuccess: (r: any) => {
                        message?.success(r?.message)
                        domainActionRef?.current?.reload();
                    },
                    onFail: (r: any) => {
                        message?.error(r?.message || "请求失败")
                    },
                    onFinally: () => {
                        message?.destroy(key)
                    }
                });
            },
        } as ModalProps);
    };
    const domainColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: '用户ID',
            hideInTable: true,
        },
        {
            title: '域名',
            dataIndex: 'domain',
            tip: '域名',
            copyable: true,
        },
        {
            title: '类型',
            dataIndex: 'type',
            tip: '域名类型',
            valueEnum: {
                0: {
                    text: '系统',
                },
                1: {
                    text: '自定义',
                },
            },
        },
        {
            title: '域名状态',
            dataIndex: 'status',
            tip: '域名状态',
            valueEnum: {
                0: {
                    text: '正常',
                    status: 'success',
                },
                1: {
                    text: '封禁',
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
                            key: "delete_domain",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    if (record?.type == 0) {
                                        message?.error("系统域名不可操作");
                                        return;
                                    }
                                    deleteDomains([record?.id], record?.web_id);
                                }}>
                                    删除
                                </a>
                            )
                        },
                        {
                            key: "status_domain",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    if (record?.type == 0) {
                                        message?.error("系统域名不可操作");
                                        return;
                                    }
                                    changeDomainStatus([record?.id], record?.web_id, record?.status == 0 ? 1 : 0);
                                }}>
                                    {record?.status == 0 ? '封禁' : '恢复'}
                                </a>
                            )
                        }
                    ]
                }} trigger={['click']} placement="bottom" arrow={true}>
                    <Button size={"small"}
                            onClick={e => e.preventDefault()}>操
                        作 <DownOutlined/></Button>
                </Dropdown>;
            }
        },
    ];
    const [domainAdd] = Form.useForm();//编辑用户表单
    const [isModalDomainAddVisible, setIsModalDomainAddVisible] = useState(false);//编辑弹窗
    const [isModalDomainAddBtnLoading, setIsModalDomainAddBtnLoading] = useState(false);//编辑弹窗按钮
    const onDomainAddFormFinish = async (values: any) => {
        values.web_id = domainWebId;
        setIsModalDomainAddBtnLoading(true);
        return createDomain({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                message?.success(r?.message)
                setIsModalDomainAddVisible(false);
                domainAdd.resetFields();
                domainActionRef.current.reload();
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            },
            onFinally: () => {
                setIsModalDomainAddBtnLoading(false);
            }
        });
    }

    /**
     * 站点编辑表单
     */
    const [web] = Form.useForm();//编辑用户表单
    const [isModalWebVisible, setIsModalWebVisible] = useState(false);//编辑弹窗
    const [isModalWebBtnLoading, setIsModalWebBtnLoading] = useState(false);//编辑弹窗按钮
    const onWebFormFinish = async (values: any) => {
        setIsModalWebBtnLoading(true);
        values.ids = [values.id];
        delete values.id;
        if (values.expire_time) {
            values.expire_time = moment(values.expire_time).format('YYYY-MM-DD');
        }
        return updateWebInfo({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                message?.success(r?.message)
                setIsModalWebVisible(false);
                actionRef.current.reload()
                form.resetFields();
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            },
            onFinally: () => {
                setIsModalWebBtnLoading(false);
            }
        });
    }

    /**
     * 余额调整表单
     */
    const [money] = Form.useForm();//余额调整表单
    const [isModalMoneyVisible, setIsModalMoneyVisible] = useState(false);//余额调整弹窗
    const [isModalMoneyBtnLoading, setIsModalMoneyBtnLoading] = useState(false);//余额调整弹窗按钮
    const onMoneyFinish = async (values: any) => {
        setIsModalMoneyBtnLoading(true)
        return updateUserMoney({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                message?.success(r?.message)
                setIsModalMoneyVisible(false);
                actionRef.current.reload()
                form.resetFields();
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            },
            onFinally: () => {
                setIsModalMoneyBtnLoading(false);
            }
        });
    }
    /**
     * 修改用户状态
     * @param user_id 用户ID
     * @param status 状态
     */
    const changeUserStatus = (user_id: string, status: number) => {
        modal.confirm({
            title: '确定要' + (status == 0 ? "恢复" : "封禁") + '用户吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '此操作将会影响站长用户',
            okType: 'primary',
            onOk: async () => {
                const key = "userStatus";
                message?.loading({content: '正在更改用户状态', key, duration: 60})
                await updateUserInfo({
                    body: {
                        ids: [user_id], status: status, user_type: 1
                    },
                    onSuccess: (r: any) => {
                        message?.success(r?.message)
                        actionRef?.current.reload();
                    },
                    onFail: (r: any) => {
                        message?.error(r?.message)
                    },
                    onFinally: () => {
                        message?.destroy(key)
                    }
                });
            },
        } as ModalProps);
    };

    /**
     * 修改站点状态
     * @param web_id 站点ID
     * @param status 状态
     */
    const changeWebStatus = (web_id: string, status: number) => {
        modal.confirm({
            title: '确定要' + (status == 0 ? "恢复" : "封禁") + '此站点吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '此操作将会影响此站点所有用户',
            okType: 'primary',
            onOk: async () => {
                const key = "webStatus";
                message?.loading({content: '正在更改站点状态', key, duration: 60})
                await updateWebInfo({
                    body: {
                        ids: [web_id], status: status
                    },
                    onSuccess: (r: any) => {
                        message?.success(r?.message)
                        actionRef?.current.reload();
                    },
                    onFail: (r: any) => {
                        message?.error(r?.message)
                    },
                    onFinally: () => {
                        message?.destroy(key)
                    }
                });
            },
        } as ModalProps);
    };
    /**
     * table表格渲染
     */
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: '用户ID',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '用户状态',
            tip: '用户状态和头像',
            hideInSearch: true,
            render: (text: string, record: any) => {
                return <>
                    <Badge dot color={record?.user?.status == 0 ? 'green' : 'red'}>
                        <Avatar src={record?.user?.avatar}
                                style={{backgroundColor: "green"}}>{record?.user?.nick_name || record?.user?.account}</Avatar>
                    </Badge>
                </>;
            }
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
            title: '网站名称',
            dataIndex: 'name',
            tip: '网站名称',
            hideInTable: true,
        },
        {
            title: '网站信息',
            dataIndex: 'info',
            tip: '网站信息',
            hideInSearch: true,
            render: (text: string, record: any) => {
                return <>
                    <Tag>名称:{record?.name}</Tag>
                    <br/>
                    <Tag>域名:{record?.domain}</Tag>
                </>;
            }
        },
        {
            title: '相关日期',
            dataIndex: 'time',
            tip: '相关日期',
            hideInSearch: true,
            render: (text: string, record: any) => {
                return <>
                    <Tag>开通时间:{record?.create_time}</Tag>
                    <br/>
                    <Tag>修改时间:{record?.update_time}</Tag>
                </>;
            }
        },
        {
            title: '到期时间',
            valueType: 'dateTime',
            dataIndex: 'expire_time',
            tip: '站点到期时间',
            sorter: true,
            hideInSearch: true,
            editable: false,
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
            title: '开通时间',
            valueType: 'dateTimeRange',
            dataIndex: 'create_time',
            tip: '站点开通时间',
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
            title: '到期时间',
            valueType: 'dateTimeRange',
            dataIndex: 'expire_time',
            tip: '站点到期时间',
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
            title: '站点状态',
            dataIndex: 'status',
            tip: '站点状态',
            sorter: true,
            valueEnum: {
                0: {
                    text: '正常',
                    status: 'success',
                },
                1: {
                    text: '封禁',
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
                                    form.setFieldsValue(record?.user);
                                    if (record?.user?.avatar) {
                                        // @ts-ignore
                                        setUploadFileList([{
                                            uid: '-1',
                                            name: 'image.png',
                                            status: 'done',
                                            url: record?.user?.avatar
                                        }]);
                                    }
                                    setIsModalVisible(true);
                                }}>
                                    编辑用户
                                </a>
                            )
                        },
                        {
                            key: "edit_site",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    web.setFieldsValue(record);
                                    web.setFieldsValue({expire_time: moment(record?.expire_time, 'YYYY-MM-DD')});
                                    setIsModalWebVisible(true);
                                }}>
                                    编辑站点
                                </a>
                            )
                        },
                        {
                            key: "edit_domain",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    setDomainWebId(record?.id);
                                    setIsModalDomainVisible(true);
                                }}>
                                    域名管理
                                </a>
                            )
                        },
                        {
                            key: "money",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    money?.setFieldsValue({user_id: record?.user?.id, type: 0});
                                    setIsModalMoneyVisible(true);
                                }}>
                                    账号加款
                                </a>
                            )
                        },
                        {
                            key: "status",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    changeUserStatus(record?.user?.id, record?.user?.status == 0 ? 1 : 0);
                                }}>
                                    {record?.user?.status == 0 ? '封禁' : '恢复'}用户
                                </a>
                            )
                        },
                        {
                            key: "status_site",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    changeWebStatus(record?.id, record?.status == 0 ? 1 : 0);
                                }}>
                                    {record?.status == 0 ? '封禁' : '恢复'}站点
                                </a>
                            )
                        }
                    ]
                }} trigger={['click']} placement="bottom" arrow={true}>
                    <Button size={"small"} hidden={record?.id == user?.web?.web_id}
                            onClick={e => e.preventDefault()}>操
                        作 <DownOutlined/></Button>
                </Dropdown>;
            }
        },
    ];

    return (
        <Body>
            <Modal key="form" destroyOnClose={true} forceRender={true}
                   title={<Title>编 辑</Title>} className={modals}
                   open={isModalVisible} onOk={form.submit} okButtonProps={{loading: isModalBtnLoading}} okText="确 认"
                   onCancel={() => {
                       // @ts-ignore
                       setUploadFileList([]);
                       setIsModalVisible(false);
                       form.resetFields();
                   }}>
                <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 4}}
                      wrapperCol={{span: 18}}>
                    <Form.Item name="id" label="ID" hidden={true}>
                        <Input placeholder="请输入ID"/>
                    </Form.Item>
                    <Form.Item name="avatar" label="头像">
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            fileList={uploadFileList}
                            showUploadList={true}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            action={getUploadUrl()}
                            maxCount={1}
                            onPreview={(file) => {
                                // @ts-ignore
                                if (file?.url) {
                                    window.open(file?.url);
                                    return;
                                }
                                // @ts-ignore
                                window.open(file?.response.data.url);
                            }}
                        >
                            <div>
                                {uploadLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                                <div style={{marginTop: 8}}>上传</div>
                            </div>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="status" label="状态" rules={[{required: true}]}>
                        <Select placeholder="请选择用户状态" options={[
                            {
                                value: 0,
                                label: "正常"
                            },
                            {
                                value: 1,
                                label: "禁止"
                            }
                        ]}/>
                    </Form.Item>
                    <Form.Item name="password" label="密码">
                        <Input placeholder="不修改则留空"/>
                    </Form.Item>
                    <Form.Item name="nick_name" label="昵称">
                        <Input placeholder="请输入用户昵称"/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal key="domain" destroyOnClose={true} forceRender={true} title={<Title>域名管理</Title>}
                   className={modals}
                   open={isModalDomainVisible} onOk={() => {
                setIsModalDomainAddVisible(true);
            }}
                   okText="添加"
                   onCancel={() => {
                       setIsModalDomainVisible(false);
                   }}>
                {isModalDomainVisible && (
                    <ProTable
                        defaultSize={"small"}
                        form={{layout: "vertical"}}
                        headerTitle={false}
                        actionRef={domainActionRef}
                        formRef={domainRef}
                        scroll={{x: true}}
                        style={{overflowX: "auto", whiteSpace: "nowrap"}}
                        rowKey={'id'}
                        options={false}
                        // @ts-ignore
                        columns={domainColumns}
                        request={(params, sort) => {
                            params.web_id = domainWebId;
                            return getData(params, sort, getDomainList)
                        }}
                        pagination={{defaultPageSize: 5} as TablePaginationConfig}
                        search={false}
                    />
                )}
            </Modal>
            <Modal key="domain_add" width={350} destroyOnClose={true} forceRender={true} title={<Title>添加</Title>}
                   open={isModalDomainAddVisible} onOk={domainAdd.submit} className={modals}
                   okButtonProps={{loading: isModalDomainAddBtnLoading}} okText="确 认"
                   onCancel={() => {
                       setIsModalDomainAddVisible(false);
                   }}>
                <Alert
                    message={"最大绑定:" + domainConfig['master.domain.num'] + "个,解析地址:" + domainConfig['master.domain.resolve']}
                    type="info" showIcon style={{marginBottom: "20px"}}/>
                <Form form={domainAdd} name="control-hooks1" onFinish={onDomainAddFormFinish} labelAlign="right"
                      labelCol={{span: 4}}
                      wrapperCol={{span: 20}}>
                    <Form.Item name="domain" label="域名" rules={[{
                        required: true,
                        message: "请输入域名"
                    }, {
                        pattern: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][--a-zA-Z0-9]{0,62})+\.?/,
                        message: "请输入正确的域名"
                    },
                    ]}>
                        <Input placeholder="请输入域名"/>
                    </Form.Item>
                    <Form.Item name="status" label="状态" rules={[{required: true}]}>
                        <Select placeholder="请选择域名状态" options={[
                            {
                                value: 0,
                                label: "正常"
                            },
                            {
                                value: 1,
                                label: "封禁"
                            }
                        ]}/>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal key="web" destroyOnClose={true} forceRender={true} title={<Title>编 辑</Title>}
                   open={isModalWebVisible}
                   onOk={web.submit} okButtonProps={{loading: isModalWebBtnLoading}} className={modals}
                   okText="确 认"
                   onCancel={() => {
                       setIsModalWebVisible(false);
                       web.resetFields();
                   }}>
                <Form form={web} name="control-hooks2" onFinish={onWebFormFinish} labelAlign="right"
                      labelCol={{span: 4}}
                      wrapperCol={{span: 18}}>
                    <Form.Item name="id" label="ID" hidden={true}>
                        <Input placeholder="请输入ID"/>
                    </Form.Item>
                    <Form.Item name="name" label="名称" rules={[{required: true, message: "请输入名称"}]}>
                        <Input placeholder="请输入名称"/>
                    </Form.Item>
                    <Form.Item name="title" label="标题" rules={[{required: true, message: "请输入标题"}]}>
                        <Input placeholder="请输入标题"/>
                    </Form.Item>
                    <Form.Item name="keywords" label="关键词" rules={[{required: true, message: "请输入关键词"}]}>
                        <Input.TextArea placeholder="请输入关键词"/>
                    </Form.Item>
                    <Form.Item name="description" label="描述" rules={[{required: true, message: "请输入描述"}]}>
                        <Input.TextArea placeholder="请输入描述"/>
                    </Form.Item>
                    <Form.Item name="status" label="状态" rules={[{required: true}]}>
                        <Select placeholder="请选择站点状态" options={[
                            {
                                value: 0,
                                label: "正常"
                            },
                            {
                                value: 1,
                                label: "封禁"
                            }
                        ]}/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal key="money" width={350} destroyOnClose={true} okButtonProps={{loading: isModalMoneyBtnLoading}}
                   forceRender={true} title={<Title>用户加款</Title>} className={modals} open={isModalMoneyVisible}
                   onOk={money.submit} okText="确 认" onCancel={() => {
                setIsModalMoneyVisible(false);
                money.resetFields();
            }}>
                <Form form={money} name="control-hooks3" onFinish={onMoneyFinish} labelAlign="right"
                      labelCol={{span: 6}}
                      wrapperCol={{span: 16}}>
                    <Form.Item name="user_id" label="用户ID" hidden={true}
                               rules={[{required: true, message: "请输入操作金额"}, {
                                   pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                                   message: "请输入正确的用户ID"
                               }]}>
                        <Input placeholder="请输入用户ID"/>
                    </Form.Item>
                    <Form.Item name="type" label="类型" rules={[{required: true, message: "请选择操作类型"}]}>
                        <Select placeholder="请选择操作类型" options={[
                            {
                                value: 0,
                                label: "充值"
                            }
                        ]}/>
                    </Form.Item>
                    <Form.Item name="money" label="金额" rules={[{required: true, message: "请输入操作金额"}, {
                        pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                        message: "请输入正确的金额"
                    }]}>
                        <Input placeholder="请输入操作金额"/>
                    </Form.Item>
                    <Form.Item name="remark" label="备注">
                        <Input.TextArea placeholder="请输入用户备注(选填)"/>
                    </Form.Item>
                </Form>
            </Modal>

            <ProTable
                defaultSize={"small"}
                form={{layout: "vertical", autoFocusFirstInput: false}}
                headerTitle={<Title>站点列表</Title>}
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
                // @ts-ignore
                columns={columns}
                request={(params, sort) => {
                    return getData(params, sort, getWebList)
                }}
                search={{
                    defaultCollapsed: true,
                    labelWidth: 20,
                }}
            />
        </Body>
    );
};
