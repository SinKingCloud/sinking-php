import React, {useEffect, useState} from 'react';
import {
    Alert, App,
    Avatar,
    Button, Card,
    Col,
    Dropdown,
    Form,
    Image,
    Input,
    Modal,
    Row,
    Space,
    Tag,
    Upload
} from "antd";
import ProForm, {ProFormItem, ProFormText} from "@ant-design/pro-form";
import {LockOutlined, MailOutlined, SafetyOutlined, UploadOutlined} from "@ant-design/icons";
import {updateInfo, updatePassword, updateEmail, updatePhone} from "@/service/person/update";
import {getUploadUrl} from "@/service/common/upload";
import SmsVerify from "@/pages/components/smsVerify";
import {Body, Title} from '@/components';
import {useModel} from "umi";
import EmailVerify from "@/pages/components/emailVerify";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css}) => {
    return {
        modal: css`
            .ant-modal-title {
                margin-bottom: 15px;
            }
        `
    }
})
export default (): React.ReactNode => {
    const {styles: {modal}} = useStyles()
    const user = useModel('user');
    useEffect(() => {
        user?.refreshWebUser();
    }, []);
    const {message} = App.useApp()
    const [isUploadAvatarLoading, setIsUploadAvatarLoading] = useState(false);
    /**
     * 修改密码modal
     */
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [isPasswordModalLoading, setIsPasswordModalLoading] = useState(false);
    const [changePwdType, setChangePwdType] = useState('phone');
    const [passwordForm] = Form.useForm();
    const [phonePawForm] = Form.useForm();
    /**
     * 修改邮箱modal
     */
    const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
    const [isEmailModalLoading, setIsEmailModalLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailForm] = Form.useForm();
    /**
     * 修改手机号modal
     */
    const [isPhoneModalVisible, setIsPhoneModalVisible] = useState(false);
    const [isPhoneModalLoading, setIsPhoneModalLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [phoneForm] = Form.useForm();
    return (
        <Body>
            <Modal key={"editPassword"} width={340} destroyOnClose={true} forceRender={true}
                   title={<Title>修改密码</Title>} className={modal}
                   open={isPasswordModalVisible} confirmLoading={isPasswordModalLoading}
                   onOk={changePwdType == 'email' ? passwordForm.submit : phonePawForm.submit} okText={"确 认"}
                   onCancel={() => {
                       setIsPasswordModalVisible(false);
                       passwordForm.resetFields();
                   }}>
                {
                    changePwdType == 'email' &&
                    <EmailVerify form={passwordForm} email={user?.web?.email} onFinish={async (values: any) => {
                        if (values.password.length > 20 || values.password.length < 6) {
                            message?.error("密码长度必须为6-20位之间");
                            return;
                        }
                        setIsPasswordModalLoading(true);
                        await updatePassword({
                            body: {
                                type: "email",
                                code: values?.email_code,
                                password: values?.password
                            },
                            onSuccess: (r: any) => {
                                message?.success(r?.message)
                                user?.refreshWebUser();
                            },
                            onFail: (r: any) => {
                                message?.error(r?.message || "请求失败")
                            }, onFinally: () => {
                                setIsPasswordModalLoading(false)
                            }
                        });
                    }} bottomNodes={
                        <Form.Item name="password" label="账户新密码"
                                   rules={[{required: true, message: '请输入新密码',}]}>
                            <Input placeholder="请输入新密码"/>
                        </Form.Item>
                    }/>
                }
                {
                    changePwdType == 'phone' &&
                    <SmsVerify form={phonePawForm} phone={user?.web?.phone} onFinish={async (values: any) => {
                        if (values.password.length > 20 || values.password.length < 6) {
                            message?.error("密码长度必须为6-20位之间");
                            return;
                        }
                        setIsPasswordModalLoading(true);
                        await updatePassword({
                            body: {
                                type: "phone",
                                code: values?.sms_code,
                                password: values?.password
                            },
                            onSuccess: (r: any) => {
                                message?.success(r?.message)
                                user?.refreshWebUser();
                                setIsPasswordModalVisible(false)
                            },
                            onFail: (r: any) => {
                                message?.error(r?.message || "请求失败")
                            }, onFinally: () => {
                                setIsPasswordModalLoading(false)
                            }
                        });
                    }} bottomNodes={
                        <Form.Item name="password" label="账户新密码"
                                   rules={[{required: true, message: '请输入新密码',}]}>
                            <Input placeholder="请输入新密码"/>
                        </Form.Item>
                    }/>
                }
            </Modal>
            <Modal key="editEmail" width={340} destroyOnClose={true} forceRender={true} title={<Title>修改邮箱</Title>}
                   open={isEmailModalVisible} confirmLoading={isEmailModalLoading} className={modal}
                   onOk={emailForm.submit} okText="确 认" onCancel={() => {
                setIsEmailModalVisible(false);
                emailForm.resetFields();
            }}>
                <EmailVerify form={emailForm} email={email} onFinish={async (values: any) => {
                    setIsEmailModalLoading(true);
                    await updateEmail({
                        body: {
                            ...values
                        },
                        onSuccess: (r: any) => {
                            message?.success(r?.message)
                            user?.refreshWebUser();
                        },
                        onFail: (r: any) => {
                            message?.error(r?.message || "请求失败");
                        }, onFinally: () => {
                            setIsEmailModalLoading(false);
                        }
                    });
                }} topNodes={
                    <Form.Item name="email" label="新安全邮箱"
                               rules={[{required: true, message: '请输入需要新绑定的安全邮箱',}]}>
                        <Input placeholder="请输入需要绑定的邮箱" onChange={(e) => {
                            setEmail(e.target.value);
                        }}/>
                    </Form.Item>
                }/>
            </Modal>
            <Modal key={"editPhone"} width={340} destroyOnClose={true} forceRender={true}
                   title={<Title>修改手机</Title>} className={modal}
                   open={isPhoneModalVisible} confirmLoading={isPhoneModalLoading}
                   onOk={phoneForm.submit} okText={"确 认"} onCancel={() => {
                setIsPhoneModalVisible(false);
                phoneForm.resetFields();
            }}>
                <SmsVerify form={phoneForm} phone={phone} onFinish={async (values: any) => {
                    setIsPhoneModalLoading(true);
                    await updatePhone({
                        body: {
                            ...values
                        },
                        onSuccess: (r: any) => {
                            message?.success(r?.message)
                            user?.refreshWebUser();
                        },
                        onFail: (r: any) => {
                            message?.error(r?.message || "请求失败")
                        },
                        onFinally: () => {
                            setIsPhoneModalLoading(false);
                        }
                    })
                }} topNodes={
                    <Form.Item name="phone" label="新安全手机"
                               rules={[{required: true, message: '请输入需要新绑定的安全手机',}]}>
                        <Input placeholder="请输入需要绑定的手机号" onChange={(e) => {
                            setPhone(e.target.value);
                        }}/>
                    </Form.Item>
                }/>
            </Modal>
            <Row>
                <Col xs={{span: 24, offset: 0}} md={{span: 18, offset: 3}} lg={{span: 16, offset: 4}}
                     xl={{span: 14, offset: 6}}>
                    <Card title={<Title>账户设置</Title>} bordered>
                        <Row>
                            <Col lg={12} style={{textAlign: "center", margin: "0px auto 20px auto", width: "100%"}}>
                                <Space direction="vertical" size={"small"}>
                                    <Avatar style={{width: "150px", height: "150px"}} src={
                                        <Image
                                            style={{width: "150px", height: "150px"}}
                                            src={user?.web?.avatar || "https://aliyun_id_photo_bucket.oss.aliyuncs.com/default_handsome.jpg"}/>
                                    }/>
                                    <Alert message={user?.web?.nick_name}
                                           style={{fontWeight: "bolder", fontSize: "20px"}} type="info"/>
                                    <div>
                                        <Tag color="cyan">ID:{user?.web?.id}</Tag>
                                        <Tag color="purple">余额:{parseFloat(user?.web?.money || 0).toFixed(2)}</Tag>
                                    </div>
                                    <div>
                                        <Upload name="file" showUploadList={false} action={getUploadUrl()}
                                                beforeUpload={(file: any) => {
                                                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                                                    if (!isJpgOrPng) {
                                                        message?.error('请上传图片格式文件');
                                                        return false;
                                                    }
                                                    const isLt2M = file.size / 1024 / 1024 < 2;
                                                    if (!isLt2M) {
                                                        message?.error('图片不能大于2MB');
                                                        return false;
                                                    }
                                                    return isJpgOrPng && isLt2M;
                                                }}
                                                onChange={async (info: any) => {
                                                    if (info.file.status == "uploading") {
                                                        setIsUploadAvatarLoading(true);
                                                    } else if (info.file.status === 'done') {
                                                        const url = info.file.response.data;
                                                        if (url != undefined && url != "") {
                                                            await updateInfo({
                                                                body: {
                                                                    avatar: url
                                                                },
                                                                onSuccess: (r: any) => {
                                                                    message?.success(r?.message)
                                                                    user?.refreshWebUser();
                                                                },
                                                                onFail: (r: any) => {
                                                                    message?.error(r?.message || "请求失败");
                                                                }, onFinally: () => {
                                                                    setIsUploadAvatarLoading(false);
                                                                }
                                                            })
                                                        } else {
                                                            setIsUploadAvatarLoading(false);
                                                        }
                                                    } else if (info.file.status === 'error') {
                                                        setIsUploadAvatarLoading(false);
                                                        message?.error(`文件上传失败`);
                                                    }
                                                }}>
                                            <Button loading={isUploadAvatarLoading}>
                                                <UploadOutlined/> 上传头像
                                            </Button>
                                        </Upload>
                                    </div>
                                </Space>
                            </Col>
                            <Col lg={12} style={{width: "100%"}}>
                                <ProForm onFinish={async (values) => {
                                    await updateInfo({
                                        body: {
                                            ...values
                                        },
                                        onSuccess: (r: any) => {
                                            message?.success(r?.message)
                                            user?.refreshWebUser();
                                            setIsPasswordModalVisible(false);
                                        },
                                        onFail: (r: any) => {
                                            message?.error(r?.message || "请求失败");
                                        }
                                    })
                                }}>
                                    <ProFormItem label="账号" name="account" tooltip="未设置用户可修改一次"
                                                 rules={[{required: true, message: '请输入登陆账号',}]}
                                                 initialValue={user?.web?.account || "未设置"}>
                                        <Row gutter={5} wrap={false}>
                                            <Col flex={8}>
                                                <Input type="text" placeholder="请输入您的登陆账号"
                                                       defaultValue={user?.web?.account}
                                                       disabled={user?.web?.account != undefined && user?.web?.account != ""}/>
                                            </Col>
                                            <Col flex={4}>
                                                <Dropdown placement="bottom" arrow={true} trigger={["click"]} menu={{
                                                    items: [
                                                        {
                                                            key: "editByEmail",
                                                            label: (
                                                                <a style={{fontSize: "small"}} onClick={() => {
                                                                    setChangePwdType('email');
                                                                    setIsPasswordModalVisible(true);
                                                                }}>
                                                                    通过邮箱验证
                                                                </a>
                                                            )
                                                        },
                                                        {
                                                            key: "editByPhone",
                                                            label: (
                                                                <a style={{fontSize: "small"}} onClick={() => {
                                                                    setChangePwdType('phone');
                                                                    setIsPasswordModalVisible(true);
                                                                }}>
                                                                    通过手机验证
                                                                </a>
                                                            )
                                                        }
                                                    ]
                                                }}>
                                                    <Button block><LockOutlined/>修改密码</Button>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    </ProFormItem>
                                    <ProFormItem label="绑定手机" tooltip="账户绑定的安全手机">
                                        <Row gutter={5} wrap={false}>
                                            <Col flex={7}>
                                                <Input type="text"
                                                       value={user?.web?.phone || "未绑定"} disabled={true}/>
                                            </Col>
                                            <Col flex={5}>
                                                <Button block onClick={() => {
                                                    setIsPhoneModalVisible(true);
                                                }}>
                                                    <SafetyOutlined/>修改手机
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ProFormItem>
                                    <ProFormItem label="绑定邮箱" tooltip="账户绑定的安全邮箱">
                                        <Row gutter={5} wrap={false}>
                                            <Col flex={7}>
                                                <Input type="text"
                                                       value={user?.web?.email || "未绑定"} disabled={true}/>
                                            </Col>
                                            <Col flex={5}>
                                                <Button block onClick={() => {
                                                    setIsEmailModalVisible(true);
                                                }}>
                                                    <MailOutlined/>修改邮箱
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ProFormItem>
                                    <ProFormText
                                        name="nick_name"
                                        label="昵称"
                                        initialValue={user?.web?.nick_name}
                                        tooltip="账户昵称"
                                        placeholder="请输入账户昵称"
                                        rules={[{required: true, message: '请输入账户昵称',},]}
                                    />

                                    <ProFormText
                                        name="contact"
                                        label="联系方式"
                                        initialValue={user?.web?.contact}
                                        tooltip="您的联系方式"
                                        placeholder="请输入联系方式"
                                        rules={[{required: true, message: '请输入联系方式!',},]}
                                    />
                                    <ProFormText
                                        name="login_time"
                                        initialValue={user?.web?.login_time}
                                        label="登陆时间"
                                        tooltip="上次登陆时间"
                                        disabled={true}
                                    />
                                </ProForm>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Body>
    );
};
