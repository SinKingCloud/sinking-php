import React, {useEffect, useRef, useState} from 'react';
import ProTable from '@ant-design/pro-table';
import {getParams} from "@/utils/page";
import {App, Avatar, Button, Dropdown, Form, Input, Modal, Select, Tag, Typography, Upload} from "antd";
import {getUserList, updateUserInfo, updateUserMoney} from "@/service/master/user";
import {DownOutlined, ExclamationCircleOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {getUploadUrl} from "@/service/common/upload";
import {createWeb} from "@/service/master/web";
import {getDomainConfig} from "@/service/admin/web";
import {getPayLog} from "@/service/master/pay";
import {getLogList} from "@/service/master/log";
import { Body } from '@/components';
export default (): React.ReactNode => {
    /**
     * 表单处理
     */
    const actionRef = useRef();
    const ref = useRef();
    const {message,modal} = App.useApp()
    /**
     * 支持的设置
     */
    const [domainConfig, setDomainConfig] = useState({});
    useEffect(() => {
        getDomainConfig({
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    setDomainConfig(r?.data);
                }
            }
        });
    }, []);

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
            const response = info?.file?.response;
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
        // @ts-ignore
        if (uploadFileList?.length > 0) {
            // @ts-ignore
            values.avatar = uploadFileList[0]?.url || ""
        } else {
            values.avatar = ""
        }
        return updateUserInfo({
            body:{
                ...values
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    setIsModalVisible(false);
                    message?.success(r?.message)
                    // @ts-ignore
                    actionRef.current.reload()
                    form.resetFields();
                }
            },
            onFail:(r:any)=>{
                if (r.code != 200) {
                    message?.error(r?.message || "请求失败")
                    setIsModalBtnLoading(false);
                }
            }
        });
    }

    /**
     * 开通网站表单
     */
    const [add] = Form.useForm();//表单
    const [isModalAddWebVisible, setIsModalAddWebVisible] = useState(false);//弹窗
    const [isModalAddWebBtnLoading, setIsModalAddWebBtnLoading] = useState(false);//按钮
    const onAddFormFinish = async (values: any) => {
        setIsModalAddWebBtnLoading(true);
        return createWeb({
            body:{
                ...values
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    setIsModalAddWebVisible(false);
                    message?.success(r?.message)
                    // @ts-ignore
                    actionRef.current.reload()
                    add.resetFields();
                }
            },
            onFail:(r:any)=>{
                if (r.code != 200) {
                    message?.error(r?.message || "请求失败")
                }
            }
        });
    }

    /**
     * 余额明细
     */
    const [isModalPayVisible, setIsModalPayVisible] = useState(false);//编辑弹窗
    const [payUserId, setPayUserId] = useState(0);//编辑弹窗
    const payActionRef = useRef();
    const payRef = useRef();
    const payColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: '记录ID',
            hideInSearch: true,
            hideInTable: true,
            sorter: true,
        },
        {
            title: '记录类型',
            dataIndex: 'type',
            tip: '记录类型',
            valueEnum: {
                0: {
                    text: '增加',
                    status: 'success',
                },
                1: {
                    text: '减少',
                    status: 'error',
                },
            },
        },
        {
            title: '记录标题',
            dataIndex: 'title',
            tip: '记录标题',
            hideInSearch: true,
        },
        {
            title: '记录详细',
            dataIndex: 'content',
            tip: '记录详细',
            hideInSearch: true,
        },
        {
            title: '金额',
            dataIndex: 'money',
            tip: '金额',
            hideInSearch: true,
            render: (text:any,record: any) => {
                return parseFloat(record?.money || 0).toFixed(2) + "元";
            }
        },
        {
            title: '操作时间',
            valueType: 'dateTime',
            dataIndex: 'create_time',
            tip: '操作时间',
            sorter: true,
            hideInSearch: true,
            editable: false,
        },
    ];

    /**
     * 余额调整表单
     */
    const [money] = Form.useForm();//余额调整表单
    const [isModalMoneyVisible, setIsModalMoneyVisible] = useState(false);//余额调整弹窗
    const [isModalMoneyBtnLoading, setIsModalMoneyBtnLoading] = useState(false);//余额调整弹窗按钮
    const onMoneyFinish = async (values: any) => {
        setIsModalMoneyBtnLoading(true)
        return updateUserMoney({
            body:{
                ...values
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    message?.success(r?.message)
                    setIsModalMoneyBtnLoading(false);
                    setIsModalMoneyVisible(false);
                    // @ts-ignore
                    actionRef.current.reload();
                    // @ts-ignore
                    payActionRef.current.reload();
                    form.resetFields();
                }
            },
            onFail:(r:any)=>{
                if (r.code != 200) {
                    message?.error(r?.message || "请求失败")
                    setIsModalMoneyBtnLoading(false);
                }
            }
        });
    }

    /**
     * 日志信息
     */
    const [isModalLogVisible, setIsModalLogVisible] = useState(false);//编辑弹窗
    const [logUserId, setLogUserId] = useState(0);//编辑弹窗
    const logActionRef = useRef();
    const logRef = useRef();
    const logColumns = [
        {
            title: '请求IP',
            dataIndex: 'request_ip',
            tip: '请求者IP',
            copyable: true,
        },
        {
            title: '事件类型',
            dataIndex: 'type',
            tip: '事件类型',
            valueEnum: {
                0: {
                    text: '登陆',
                    status: 'success',
                },
                1: {
                    text: '查看',
                    status: 'warning',
                },
                2: {
                    text: '删除',
                    status: 'error',
                },
                3: {
                    text: '修改',
                    status: 'default',
                },
                4: {
                    text: '创建',
                    status: 'success',
                },
            },
        },
        {
            title: '标题',
            dataIndex: 'title',
            tip: '标题',
            hideInSearch: true,
        },
        {
            title: '内容',
            dataIndex: 'content',
            tip: '内容',
            hideInSearch: true,
        },
        {
            title: '操作时间',
            valueType: 'dateTime',
            dataIndex: 'create_time',
            tip: '操作时间',
            sorter: true,
            hideInSearch: true,
            editable: false,
        },
    ];

    /**
     * 修改用户状态
     * @param user_id 用户ID
     * @param status 状态
     */
    const changeUserStatus = (user_id: string, status: number) => {
        modal.confirm({
            title: '确定要' + (status == 0 ? "恢复" : "封禁") + '用户吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '您的操作将会立即生效',
            okType: 'primary',
            onOk() {
                const key = "userStatus";
                message.loading({content: '正在更改用户状态', key, duration: 60}).then();
                updateUserInfo({
                    body: {
                        ids: [user_id],
                        status: status
                    },
                    onSuccess: (r: any) => {
                        if (r?.code == 200) {
                            message?.success({content: r?.message, key, duration: 2})
                            // @ts-ignore
                            actionRef?.current.reload();
                        }
                    },
                    onFail:(r:any)=>{
                        if (r.code != 200) {
                            message?.error({content: r?.message, key, duration: 2})
                        }
                    }
                });
            },
        });
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
            title: '头像',
            tip: '用户头像',
            align:"center",
            hideInSearch: true,
            render: (text:any,record: any) => {
                return <>
                    <Avatar src={record?.avatar}
                            style={{backgroundColor: "green"}}>{record?.nick_name || record?.account}</Avatar>
                </>;
            }
        },
        {
            title: '用户资料',
            tip: '用户信息',
            dataIndex: 'user_info',
            hideInSearch: true,
            render: (text:any,record: any) => {
                return <>
                    <Tag>昵称:<Typography.Text copyable>{record?.nick_name || "未设置"}</Typography.Text></Tag>
                    <br/>
                    <Tag>身份:{record?.is_admin ? '站长' : '会员'}</Tag>
                    <br/>
                    <Tag>站点:{record?.web?.name}(ID:<Typography.Text copyable>{record?.web_id}</Typography.Text>)</Tag>
                </>;
            }
        },
        {
            title: '账号',
            dataIndex: 'account',
            tip: '用户账号',
            hideInTable: true,
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            tip: '绑定邮箱',
            hideInTable: true,
        },
        {
            title: '手机号',
            dataIndex: 'phone',
            tip: '绑定手机',
            hideInTable: true,
        },
        {
            title: '账号信息',
            dataIndex: 'account_info',
            tip: '账户身份',
            hideInSearch: true,
            render: (text:any,record: any) => {
                return <>
                    <Tag>邮箱:<Typography.Text copyable>{record?.email || "未设置"}</Typography.Text></Tag>
                    <br/>
                    <Tag>账号:<Typography.Text copyable>{record?.account || "未设置"}</Typography.Text></Tag>
                    <br/>
                    <Tag>手机:<Typography.Text copyable>{record?.phone || "未设置"}</Typography.Text></Tag>
                    <br/>
                    <Tag>余额:<Typography.Text
                        copyable>{parseFloat(record?.money || 0).toFixed(2) + "元"}</Typography.Text></Tag>
                </>;
            }
        },
        {
            title: '所属站点',
            dataIndex: 'web_id',
            tip: '所属站点ID',
            hideInTable: true,
        },
        {
            title: '登陆IP',
            dataIndex: 'login_ip',
            tip: '登陆IP',
            hideInTable: true,
        },
        {
            title: '登陆信息',
            dataIndex: 'login_info',
            tip: '登录信息',
            hideInSearch: true,
            render: (text:any,record: any) => {
                return <>
                    <Tag>时间:<Typography.Text copyable>{record?.login_time || "未登录"}</Typography.Text></Tag>
                    <br/>
                    <Tag>IP:<Typography.Text copyable>{record?.login_ip || "未登录"}</Typography.Text></Tag>
                </>;
            }
        },
        {
            title: '相关时间',
            dataIndex: 'user_time',
            tip: '用户相关日期',
            hideInSearch: true,
            render: (text:any,record: any) => {
                return <>
                    <Tag>注册时间:<Typography.Text copyable>{record?.create_time || "未登录"}</Typography.Text></Tag>
                    <br/>
                    <Tag>修改时间:<Typography.Text copyable>{record?.update_time || "未登录"}</Typography.Text></Tag>
                </>;
            }
        },
        {
            title: '登陆时间',
            valueType: 'dateTimeRange',
            dataIndex: 'login_time',
            tip: '上次登陆时间',
            hideInTable: true,
            search: {
                transform: (value: any) => {
                    return {
                        login_time_start: value[0],
                        login_time_end: value[1],
                    };
                },
            },
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
            title: '注册时间',
            valueType: 'dateTimeRange',
            dataIndex: 'create_time',
            tip: '用户注册时间',
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
            tip: '用户状态',
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
            render: (text:any,record: any) => {
                return <Dropdown menu={{
                    items:[
                        {
                            key: "edit_modal",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    form.setFieldsValue(record);
                                    if (record?.avatar) {
                                        // @ts-ignore
                                        setUploadFileList([{
                                            uid: '-1',
                                            name: 'image.png',
                                            status: 'done',
                                            url: record?.avatar
                                        }]);
                                    }
                                    setIsModalVisible(true);
                                }}>
                                    编 辑
                                </a>
                            )
                        },
                        {
                            key:"money_modal",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    money?.setFieldsValue({user_id: record?.id, type: 0});
                                    setIsModalMoneyVisible(true);
                                }}>
                                    余 额
                                </a>
                            )
                        },
                        {
                            key:"add_modal",
                            label: (
                                <a style={{fontSize: "small"}} hidden={record?.is_admin} onClick={() => {
                                    add?.setFieldsValue({
                                        user_id: record?.id,
                                        domain: domainConfig['master.domains']?.[0]
                                    });
                                    setIsModalAddWebVisible(true);
                                }}>
                                    开 通
                                </a>
                            )
                        },
                        {
                            key:"pay",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                setPayUserId(record?.id || 0)
                                setIsModalPayVisible(true);
                            }}>
                                明 细
                            </a>
                            )
                        },
                        {
                            key:"log",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    setLogUserId(record?.id || 0)
                                    setIsModalLogVisible(true);
                                }}>
                                    日 志
                                </a>
                            )
                        },
                        {
                            key:"status",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    changeUserStatus(record?.id, record?.status == 0 ? 1 : 0);
                                }}>
                                    {record?.status == 0 ? '封 禁' : '恢 复'}
                                </a>
                            )
                        }
                    ]
                }} trigger={['click']} placement="bottom" arrow={true}>
                    <Button size={"small"} onClick={e => e.preventDefault()}>
                        操作 <DownOutlined/>
                    </Button>
                </Dropdown>;
            }
        },
    ];

    return (
        <Body>
            <Modal key={"form"} destroyOnClose={true} forceRender={true} title={"编 辑"}
                   open={isModalVisible} onOk={form.submit} okButtonProps={{loading: isModalBtnLoading}} okText={"确 认"}
                   onCancel={() => {
                       // @ts-ignore
                       setUploadFileList([]);
                       setIsModalVisible(false);
                       form.resetFields();
                   }}>
                <Form form={form} name="control-hooks1" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 4}}
                      wrapperCol={{span: 18}}>
                    <Form.Item name={"id"} label="ID" hidden={true}>
                        <Input placeholder="请输入ID"/>
                    </Form.Item>
                    <Form.Item name={"avatar"} label="头像">
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
                    <Form.Item name={"account"} label="账号">
                        <Input placeholder="请输入用户账号"/>
                    </Form.Item>
                    <Form.Item name={"phone"} label="手机号">
                        <Input placeholder="请输入用户手机号"/>
                    </Form.Item>
                    <Form.Item name={"email"} label="邮箱">
                        <Input placeholder="请输入用户邮箱"/>
                    </Form.Item>
                    <Form.Item name={"status"} label="状态" rules={[{required: true}]}>
                        <Select placeholder="请选择用户状态" options={[{
                            value:0,
                            label:"正常"
                        }, {
                            value:1,
                            label:"禁止"
                        }]} />
                    </Form.Item>
                    <Form.Item name={"password"} label="密码">
                        <Input placeholder="不修改则留空"/>
                    </Form.Item>
                    <Form.Item name={"nick_name"} label="昵称">
                        <Input placeholder="请输入用户昵称"/>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal key={"add_web"} width={400} destroyOnClose={true} okButtonProps={{loading: isModalAddWebBtnLoading}}
                   forceRender={true} title="开通网站" open={isModalAddWebVisible}
                   onOk={add.submit} okText={"确认"} onCancel={() => {
                        setIsModalAddWebVisible(false);
                        add.resetFields();
            }}>
                <Form form={add} name="control-hooks2" onFinish={onAddFormFinish} labelAlign="right" labelCol={{span: 6}}
                      wrapperCol={{span: 16}} >
                    <Form.Item name={"user_id"} label="用户ID" hidden={true}
                               rules={[{required: true, message: "请输入操作金额"}, {
                                   pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                                   message: "请输入正确的用户ID"
                               }]}>
                        <Input placeholder="请输入用户ID"/>
                    </Form.Item>
                    <Form.Item name={"name"} label="站点名称" rules={[{required: true, message: "请输入操作金额"}]}>
                        <Input placeholder="请输入站点名称"/>
                    </Form.Item>
                    <Form.Item label="绑定域名">
                            <Form.Item
                                name="prefix"
                                noStyle
                                rules={[{required: true, message: '请输入前缀'}]}
                            >
                                <Input style={{width: '45%'}} placeholder="请输入前缀"/>
                            </Form.Item>
                            <Form.Item
                                name="domain"
                                noStyle
                                rules={[{required: true, message: '请选择后缀'}]}
                            >
                                <Select placeholder="请选择后缀" style={{width: '55%'}}>
                                    {domainConfig['master.domains']?.map((k: any) => {
                                        return <Select.Option key={"domain_" + k} value={k}>.{k}</Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal key={"pay"} destroyOnClose={true} forceRender={true}
                   title={"余额明细"}
                   open={isModalPayVisible} onOk={() => {
                money?.setFieldsValue({user_id: payUserId, type: 0});
                setIsModalMoneyVisible(true);
            }}
                   okText={"加款"}
                   onCancel={() => {
                       setIsModalPayVisible(false);
                   }} width={700}>
                {isModalPayVisible && (
                    <ProTable
                        form={{layout: "vertical"}}
                        headerTitle={false}
                        actionRef={payActionRef}
                        formRef={payRef}
                        options={false}
                        rowKey={'id'}
                        // @ts-ignore
                        columns={payColumns}
                        scroll={{x:true}}
                        style={{overflowX:"auto",whiteSpace:"nowrap"}}
                        request={async (params, sort) => {
                            params.user_id = payUserId;
                            const fetchParams = getParams(params, sort)
                            const data = await getPayLog({
                                body:{
                                    ...fetchParams
                                }
                            });
                            if (data.code != 200) {
                                message?.error(data?.message);
                            }
                            return {
                                data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
                                success: data.code === 200,
                                total: data.data.total,
                            };
                        }}
                        pagination={{defaultPageSize: 5}}
                        search={false}
                    />
                )}
            </Modal>

            <Modal key={"log"} destroyOnClose={true} forceRender={true} title={"操作日志"} open={isModalLogVisible}
                   footer={null}
                   onCancel={() => {
                       setIsModalLogVisible(false);
                   }}  width={700}>
                {isModalLogVisible && (
                    <ProTable
                        form={{layout: "vertical"}}
                        headerTitle={false}
                        actionRef={logActionRef}
                        formRef={logRef}
                        options={false}
                        rowKey={'id'}
                        // @ts-ignore
                        columns={logColumns}
                        scroll={{x:true}}
                        style={{overflowX:"auto",whiteSpace:"nowrap"}}
                        request={async (params, sort) => {
                            params.user_id = logUserId;
                            const fetchParams = getParams(params, sort)
                            const data = await getLogList({
                                body:{
                                    ...fetchParams
                                }
                            });
                            if (data?.code != 200) {
                                message?.error(data?.message);
                            }
                            return {
                                data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
                                success: data.code === 200,
                                total: data.data.total,
                            };
                        }}
                        pagination={{defaultPageSize: 5}}
                        search={false}
                    />
                )}
            </Modal>

            <Modal key={"money"} width={350} destroyOnClose={true} okButtonProps={{loading: isModalMoneyBtnLoading}}
                   forceRender={true} title="用户加款" open={isModalMoneyVisible}
                   onOk={money.submit} okText={"确 认"} onCancel={() => {
                setIsModalMoneyVisible(false);
                money.resetFields();
            }}>
                <Form form={money} name="control-hooks3" onFinish={onMoneyFinish} labelAlign="right" labelCol={{span: 6}}
                      wrapperCol={{span: 16}}>
                    <Form.Item name={"user_id"} label="用户ID" hidden={true}
                               rules={[{required: true, message: "请输入操作金额"}, {
                                   pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                                   message: "请输入正确的用户ID"
                               }]}>
                        <Input placeholder="请输入用户ID"/>
                    </Form.Item>
                    <Form.Item name={"type"} label="类型" rules={[{required: true, message: "请选择操作类型"}]}>
                        <Select placeholder="请选择操作类型" options={[{
                            value: 0,
                            label: "充值"
                        },{
                            value:1,
                            label:"扣除"
                        }]} />
                    </Form.Item>
                    <Form.Item name={"money"} label="金额" rules={[{required: true, message: "请输入操作金额"}, {
                        pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                        message: "请输入正确的金额"
                    }]}>
                        <Input placeholder="请输入操作金额"/>
                    </Form.Item>
                    <Form.Item name={"remark"} label="备注">
                        <Input.TextArea placeholder="请输入用户备注(选填)"/>
                    </Form.Item>
                </Form>
            </Modal>

            <ProTable
                form={{layout: "vertical", autoFocusFirstInput: false}}
                headerTitle={'用户列表'}
                actionRef={actionRef}
                formRef={ref}
                rowKey={'id'}
                // @ts-ignore
                columns={columns}
                scroll={{x:true}}
                style={{overflowX:"auto",whiteSpace:"nowrap"}}
                request={async (params, sort) => {
                    const fetchParams = getParams(params, sort)
                    const data = await getUserList({
                        body:{
                            ...fetchParams
                        }
                    });
                    if (data?.code != 200) {
                        message?.error(data?.message);
                    }
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
            />
        </Body>
    );
};
