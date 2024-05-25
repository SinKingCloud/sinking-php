import ProForm, {ProFormDigit, ProFormText} from '@ant-design/pro-form';
import React, {useEffect, useState} from 'react';
import {getConfigList, testEmail, updateConfigs} from "@/services/master/config";
import {Form, message, Spin} from "antd";

const EmailView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getConfigList({page_size: 1000, key: "email"}).then((r): any => {
      if (r?.code != 200) {
        return {};
      } else {
        const temp = {};
        r?.data?.list.forEach((k: any) => {
          temp[k?.key] = k?.value;
        });
        return temp;
      }
    });
  }

  const [form] = Form.useForm();
  /**
   * 提交表单
   */
  const onFinish = async (values: any) => {
    await updateConfigs(values).then((r) => {
      if (r?.code != 200) {
        message.error(r?.message || "请求失败").then();
      } else {
        message.success(r?.message || "修改成功").then();
      }
    });
  }
  /**
   * 初始化数据
   */
  useEffect(() => {
    setIsLoading(true)
    getConfigs().then(data => {
      form?.setFieldsValue(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <Spin spinning={isLoading} size="default">
      <div style={{display: isLoading ? 'none' : 'block'}}>
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>发信设置</h3>
        <ProForm key={"email"} form={form} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="email.host"
            label="发信地址"
            tooltip="邮箱服务器的发信地址"
            placeholder={"请输入邮箱服务器的发信地址"}
            rules={[{required: true, message: "请输入邮箱服务器的发信地址"},]}
          />
          <ProFormDigit
            width="md"
            name="email.port"
            label="发信端口"
            tooltip="邮箱服务器的发信端口"
            placeholder={"邮箱服务器的发信端口"}
            rules={[{required: true, message: "邮箱服务器的发信端口"},]}
          />
          <ProFormText
            width="md"
            name="email.user"
            label="发信账户"
            tooltip="邮箱服务器的发信账户"
            placeholder={"邮箱服务器的发信账户"}
            rules={[{required: true, message: "邮箱服务器的发信账户"},]}
          />
          <ProFormText
            width="md"
            name="email.pwd"
            label="发信密码"
            tooltip="邮箱服务器的发信密码"
            placeholder={"邮箱服务器的发信密码"}
            rules={[{required: true, message: "邮箱服务器的发信密码"},]}
          />
        </ProForm>
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>测试发信</h3>
        <ProForm key={"form"} onFinish={async (values: any) => {
          await testEmail(values).then((r) => {
            if (r.code != 200) {
              message.error(r.message || "请求失败").then();
            } else {
              message.success(r.message || "请求成功").then();
            }
          })
        }}>
          <ProFormText
            width="md"
            name="email"
            label="收信邮箱"
            tooltip="接收邮件的邮箱账号"
            placeholder={"请输入接收邮件的邮箱账号"}
            rules={[{
              required: true,
              message: "请输入接收邮件的邮箱账号"
            }, {
              pattern: /^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/,
              message: "邮箱格式不正确"
            },
            ]}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default EmailView;
