import ProForm, {ProFormDigit, ProFormText} from '@ant-design/pro-form';
import React, {useEffect, useState} from 'react';
import {getConfigList, testSms, updateConfigs} from "@/services/master/config";
import {Form, message, Spin} from "antd";

const SmsView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getConfigList({page_size: 1000, key: "sms"}).then((r): any => {
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
  const [form1] = Form.useForm();
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
    })
  }
  /**
   * 初始化数据
   */
  useEffect(() => {
    setIsLoading(true);
    getConfigs().then(data => {
      form?.setFieldsValue(data);
      form1?.setFieldsValue(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <Spin spinning={isLoading} size="default">
      <div style={{display: isLoading ? 'none' : 'block'}}>
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>阿里云设置</h3>
        <ProForm key={"sms.aliyun"} form={form} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="sms.aliyun.key"
            label="AccessKeyId"
            tooltip="阿里云AccessKeyId"
            placeholder={"请输入阿里云AccessKeyId"}
            rules={[{required: true, message: "请输入阿里云AccessKeyId"},]}
          />
          <ProFormText
            width="md"
            name="sms.aliyun.secret"
            label="AccessKeySecret"
            tooltip="阿里云AccessKeySecret"
            placeholder={"请输入阿里云AccessKeySecret"}
            rules={[{required: true, message: "请输入阿里云AccessKeySecret"},]}
          />
        </ProForm>
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>验证码模版</h3>
        <ProForm key={"sms.captcha"} form={form1} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="sms.captcha.sign"
            label="模版签名"
            tooltip="阿里云短信服务的模版签名"
            placeholder={"请输入模版签名"}
            rules={[{required: true, message: "请输入模版签名"},]}
          />
          <ProFormText
            width="md"
            name="sms.captcha.code"
            label="模版code"
            tooltip="阿里云短信服务的模版code"
            placeholder={"请输入模版code"}
            rules={[{required: true, message: "请输入模版code"},]}
          />
          <ProFormText
            width="md"
            name="sms.captcha.var"
            label="模版变量"
            tooltip="阿里云短信服务的模版变量名，例如模板内容的${code}，只需填写code即可"
            placeholder={"请输入阿里云短信服务的模版变量名"}
            rules={[{required: true, message: "阿里云短信服务的模版变量名"},]}
          />
        </ProForm>
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>测试发信</h3>
        <ProForm key={"form"} onFinish={async (values: any) => {
          await testSms(values).then((r) => {
            if (r.code != 200) {
              message.error(r.message || "请求失败").then();
            } else {
              message.success(r.message || "请求成功").then();
            }
          })
        }}>
          <ProFormText
            width="md"
            name="phone"
            label="收信号码"
            tooltip="接收短信的手机号码"
            placeholder={"请输入接收验证码的手机号码"}
            rules={[{
              required: true,
              message: "请输入接收验证码的手机号码"
            }, {
              pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
              message: "手机号格式不正确"
            },
            ]}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default SmsView;
