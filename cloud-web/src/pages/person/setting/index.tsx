import React, {useEffect, useState} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import {Alert, Avatar, Button, Col, Form, Image, Input, message, Modal, Row, Space, Tag, Upload} from "antd";
import ProForm, {ProFormText} from "@ant-design/pro-form";
import {LockOutlined, SafetyOutlined, UploadOutlined} from "@ant-design/icons";
// @ts-ignore
import {useModel} from "@@/plugin-model/useModel";
import {updateInfo, updatePassword, updateEmail} from "@/services/person/update";
import {getUploadUrl} from "@/services/common/upload";
import EmailVerify from "@/components/Other/EmailVerify";

export default (): React.ReactNode => {
  const {initialState, setInitialState} = useModel('@@initialState');
  // @ts-ignore
  const {currentUser} = initialState;
  const [isUploadAvatarLoading, setIsUploadAvatarLoading] = useState(false);
  /**
   * 获取当前用户信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchUserInfo().then(() => {
      setLoading(false)
    });
  }, []);
  /**
   * 修改密码modal
   */
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isPasswordModalLoading, setIsPasswordModalLoading] = useState(false);
  const [passwordForm] = Form.useForm();
  /**
   * 修改邮箱modal
   */
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isEmailModalLoading, setIsEmailModalLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailForm] = Form.useForm();
  return (
    <PageContainer title={false}>
      <Modal key={"editPassword"} width={430} destroyOnClose={true} forceRender={true} title="修改密码"
             visible={isPasswordModalVisible} confirmLoading={isPasswordModalLoading}
             onOk={passwordForm.submit} okText={"确 认"} onCancel={() => {
        setIsPasswordModalVisible(false);
        passwordForm.resetFields();
      }}>
        <EmailVerify form={passwordForm} email={currentUser?.email} onFinish={async (values) => {
          if (values.password.length > 20 || values.password.length < 6) {
            message.error("密码长度必须为6-20位之间");
            return;
          }
          setIsPasswordModalLoading(true);
          updatePassword(values).then((r) => {
            setIsPasswordModalLoading(false);
            if (r.code != 200) {
              message.error(r.message || "请求失败").then()
            } else {
              setIsPasswordModalVisible(false);
              message.success(r.message).then();
            }
          })
        }} bottomNodes={
          <Form.Item name={"password"} label="账户新密码" rules={[{required: true, message: '请输入新密码',}]}>
            <Input placeholder="请输入新密码"/>
          </Form.Item>
        }/>
      </Modal>
      <Modal key={"editEmail"} width={430} destroyOnClose={true} forceRender={true} title="修改邮箱"
             visible={isEmailModalVisible} confirmLoading={isEmailModalLoading}
             onOk={emailForm.submit} okText={"确 认"} onCancel={() => {
        setIsEmailModalVisible(false);
        emailForm.resetFields();
      }}>
        <EmailVerify form={emailForm} email={email} onFinish={async (values) => {
          setIsEmailModalLoading(true);
          updateEmail(values).then(async (r) => {
            setIsEmailModalLoading(false);
            if (r.code != 200) {
              message.error(r.message || "请求失败").then()
            } else {
              await fetchUserInfo();
              setIsEmailModalVisible(false);
              message.success(r.message).then();
            }
          })
        }} topNodes={
          <Form.Item name={"email"} label="安全邮箱" rules={[{required: true, message: '请输入需要绑定的安全邮箱',}]}>
            <Input placeholder="请输入需要绑定的邮箱" onChange={(e) => {
              setEmail(e.target.value);
            }}/>
          </Form.Item>
        } bottomNodes={
          <Form.Item name={"password"} label="账户密码" rules={[{required: true, message: '请输入新手机号',}]}>
            <Input placeholder="请输入密码验证身份"/>
          </Form.Item>
        }/>
      </Modal>
      <Row>
        <Col xs={{span: 24, offset: 0}} lg={{span: 14, offset: 5}}>
          <ProCard title="账户设置" headerBordered loading={loading}>
            <Row>
              <Col lg={{span: 7, offset: 0}} style={{textAlign: "center", margin: "0px auto 20px auto"}}>
                <Space direction="vertical" size={"small"}>
                  <Avatar style={{width: "150px", height: "150px"}} src={
                    <Image
                      style={{width: "150px", height: "150px"}}
                      src={currentUser?.avatar || "https://aliyun_id_photo_bucket.oss.aliyuncs.com/default_handsome.jpg"}/>
                  }/>
                  <Alert message={currentUser?.nick_name} style={{fontWeight: "bolder", fontSize: "20px"}} type="info"/>
                  <div>
                    <Tag color="cyan">ID:{currentUser?.id}</Tag>
                    <Tag color="purple">余额:{parseFloat(currentUser?.money || 0).toFixed(2)}</Tag>
                  </div>
                  <div>
                    <Upload name="file" showUploadList={false} action={getUploadUrl()} beforeUpload={(file: any) => {
                      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                      if (!isJpgOrPng) {
                        message.error('请上传图片格式文件');
                        return false;
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('图片不能大于2MB');
                        return false;
                      }
                      return isJpgOrPng && isLt2M;
                    }} onChange={(info: any) => {
                      if (info.file.status == "uploading") {
                        setIsUploadAvatarLoading(true);
                      } else if (info.file.status === 'done') {
                        const url = info.file.response.data;
                        if (url != undefined && url != "") {
                          updateInfo({avatar: url}).then(async (r) => {
                            setIsUploadAvatarLoading(false);
                            if (r.code != 200) {
                              message.error(r.message || "请求失败").then()
                            } else {
                              await fetchUserInfo();
                              message.success(r.message).then();
                            }
                          })
                        } else {
                          setIsUploadAvatarLoading(false);
                        }
                      } else if (info.file.status === 'error') {
                        setIsUploadAvatarLoading(false);
                        message.error(`文件上传失败`);
                      }
                    }}>
                      <Button loading={isUploadAvatarLoading}>
                        <UploadOutlined/> 上传头像
                      </Button>
                    </Upload>
                  </div>
                </Space>
              </Col>
              <Col lg={{span: 13, offset: 1}}>
                <ProForm onFinish={async (values) => {
                  await updateInfo(values).then(async (r) => {
                    if (r.code != 200) {
                      message.error(r.message || "请求失败").then()
                    } else {
                      await fetchUserInfo();
                      setIsPasswordModalVisible(false);
                      message.success(r.message).then();
                    }
                  })
                }}>
                  <ProFormText width="md" label="账号" name="account" tooltip="未设置用户可修改一次"
                               rules={[{required: true, message: '请输入登陆账号',}]} initialValue={currentUser?.account}>
                    <Row gutter={6} wrap={false}>
                      <Col flex={5}>
                        <Input type="text" placeholder="请输入您的登陆账号" defaultValue={currentUser?.account}
                               disabled={currentUser?.account != ""}/>
                      </Col>
                      <Col flex={7}>
                        <Button onClick={() => {
                          passwordForm.resetFields();
                          setIsPasswordModalVisible(true);
                        }}>
                          <LockOutlined/>修改密码
                        </Button>
                      </Col>
                    </Row>
                  </ProFormText>
                  <ProFormText width="md" label="绑定邮箱" tooltip="账户绑定的安全邮箱">
                    <Row gutter={6} wrap={false}>
                      <Col flex={5}>
                        <Input type="text" value={currentUser?.email} disabled={true}/>
                      </Col>
                      <Col flex={7}>
                        <Button onClick={() => {
                          setIsEmailModalVisible(true);
                        }}>
                          <SafetyOutlined/>修改邮箱
                        </Button>
                      </Col>
                    </Row>
                  </ProFormText>
                  <ProFormText
                    width="md"
                    name="nick_name"
                    label="昵称"
                    initialValue={currentUser?.nick_name}
                    tooltip="账户昵称"
                    placeholder="请输入账户昵称"
                    rules={[{required: true, message: '请输入账户昵称',},]}
                  />

                  <ProFormText
                    width="md"
                    name="contact"
                    label="联系方式"
                    initialValue={currentUser?.contact}
                    tooltip="您的联系方式"
                    placeholder="请输入联系方式"
                    rules={[{required: true, message: '请输入联系方式!',},]}
                  />
                  <ProFormText
                    width="md"
                    name="login_time"
                    initialValue={currentUser?.login_time}
                    label="登陆时间"
                    tooltip="上次登陆时间"
                    disabled={true}
                  />
                </ProForm>
              </Col>
            </Row>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};
