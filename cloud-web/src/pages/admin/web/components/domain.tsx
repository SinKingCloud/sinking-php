import React, {useEffect, useRef, useState} from 'react';
import {createDomain, deleteDomain, getDomainConfig, getDomainList, updateDomain} from "@/service/admin/web";
import {Alert, App, Button, Dropdown, Form, Input, Menu, Modal, Select} from "antd";
import {DownOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import ProTable from "@ant-design/pro-table";
import {getData, getParams} from "@/utils/page";
import {useModel} from "umi";
import {getNoticeList} from "@/service/admin/notice";

const DomainView: React.FC = () => {
    const {message, modal} = App.useApp()
    const user = useModel("user")
    /**
     * 域名编辑表单
     */
    const [domainConfig, setDomainConfig] = useState({});
    useEffect(() => {
        getDomainConfig({
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                }
                setDomainConfig(r?.data);
            }
        });
    }, []);
    const domainActionRef = useRef();
    const domainRef = useRef();
    const deleteDomains = (ids: [number], web_id: number) => {
        modal.confirm({
            title: '确定要删除此域名吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '删除后此域名则不可访问',
            okType: 'danger',
            onOk: async () => {
                const key = "deleteDomains";
                message?.loading({content: '正在删除域名', key, duration: 60})
                await deleteDomain({
                    body: {
                        ids: ids, web_id: web_id
                    },
                    onSuccess: (r: any) => {
                        if (r?.code == 200) {
                            message?.success(r?.message)
                            message?.destroy(key)
                            // @ts-ignore
                            domainActionRef?.current?.reload();
                        }
                    },
                    onFail: (r: any) => {
                        if (r?.code != 200) {
                            message?.error(r?.message)
                            message?.destroy(key)
                        }
                    }
                });
            },
        });
    }
    const changeDomainStatus = (ids: [number], web_id: number, status: number) => {
        modal.confirm({
            title: '确定要' + (status == 0 ? "恢复" : "封禁") + '此域名吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '此操作将会影响此域名的访问',
            okType: 'primary',
            onOk:async()=> {
                const key = "changeDomainStatus";
                message?.loading({content: '正在更改域名状态', key, duration: 60})
                await updateDomain({
                    body: {
                        web_id: web_id, ids: ids, status: status
                    },
                    onSuccess: (r: any) => {
                        if (r?.code == 200) {
                            message?.success(r?.message)
                            message?.destroy(key)
                            // @ts-ignore
                            domainActionRef?.current?.reload();
                        }
                    },
                    onFail: (r: any) => {
                        if (r?.code != 200) {
                            message?.error(r?.message)
                            message?.destroy(key)
                        }
                    }
                });
            },
        });
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
                    items:[
                        {
                            key:"delete_domain",
                            label: (
                                <a style={{fontSize: "small"}} onClick={() => {
                                    if (record?.type == 0) {
                                        message.error("系统域名不可操作");
                                        return;
                                    }
                                    deleteDomains([record?.id], record?.web_id);
                                }}>
                                    删除
                                </a>
                            )
                        },
                        {
                            key:"status_domain",
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
                }}  trigger={['click']} placement="bottom" arrow={true}>
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
        values.web_id = user?.web?.web_id;
        setIsModalDomainAddBtnLoading(true);
        await createDomain({
            body:{
                ...values
            },
            onSuccess:(r:any)=>{
                message?.success(r?.message)
                setIsModalDomainAddVisible(false);
                domainAdd.resetFields();
                // @ts-ignore
                domainActionRef.current.reload();
            },
            onFail:(r:any)=>{
                if(r?.code != 200){
                    message?.error(r?.message)
                    setIsModalDomainAddBtnLoading(false);
                }
            }
        });
    }
    return (
        <div>
            <ProTable
                defaultSize={"small"}
                form={{layout: "vertical"}}
                headerTitle={'额度:' + domainConfig['master.domain.num'] + '个'}
                actionRef={domainActionRef}
                formRef={domainRef}
                scroll={{x: true}}
                style={{overflowX:"auto",whiteSpace:"nowrap"}}
                rowKey={'id'}
                // @ts-ignore
                columns={domainColumns}
                request={ (params, sort) => {
                    params.web_id = user?.web?.web_id;
                    return getData(params,sort,getDomainList)
                }}
                pagination={{defaultPageSize: 5}}
                search={false}
                toolBarRender={() => [
                    <Button key="primary" size={"small"} type="primary" onClick={() => {
                        setIsModalDomainAddVisible(true)
                    }}>
                        添加
                    </Button>,
                ]}
            />
            <Modal key="domain_add" width={350} destroyOnClose={true} forceRender={true} title="添加"
                   open={isModalDomainAddVisible} onOk={domainAdd.submit}
                   okButtonProps={{loading: isModalDomainAddBtnLoading}} okText="确 认"
                   onCancel={() => {
                       setIsModalDomainAddVisible(false);
                   }}>
                <Alert
                    message={"您需要把域名解析至:" + domainConfig['master.domain.resolve']}
                    type="info" showIcon style={{marginBottom: "20px"}}/>
                <Form form={domainAdd} name="control-hooks" onFinish={onDomainAddFormFinish} labelAlign="right"
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
                        <Select placeholder="请选择域名状态" options={[{
                            value: 0,
                            label: "正常"
                        }, {
                            value: 1,
                            label: "封禁"
                        }]} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default DomainView;
