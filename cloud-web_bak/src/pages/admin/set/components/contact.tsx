import React, {useEffect, useState} from 'react';
import {Form, message, Spin} from "antd";
import ProForm, {ProFormText} from "@ant-design/pro-form";
import {getContact, setContact} from "@/services/admin/set";

const ContactView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getContact().then((r): any => {
      if (r?.code != 200) {
        return {};
      } else {
        return r?.data || {};
      }
    });
  }

  const [form] = Form.useForm();
  /**
   * 提交表单
   */
  const onFinish = async (values: any) => {
    await setContact(values).then((r) => {
      if (r.code != 200) {
        message.error(r.message || "请求失败").then();
      } else {
        message.success(r.message || "修改成功").then();
      }
    })
  }
  /**
   * 初始化数据
   */
  // @ts-ignore
  useEffect(() => {
    setIsLoading(true);
    getConfigs().then(data => {
      form?.setFieldsValue(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <Spin spinning={isLoading} size="default">
      <div style={{display: isLoading ? 'none' : 'block'}}>
        <ProForm key={"contact"} form={form} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="contact.one"
            label="1号客服"
            tooltip="1号客服的QQ联系方式"
            placeholder={"请输入一号客服的QQ联系方式"}
            rules={[{required: true, message: "请输入1号客服的QQ联系方式"},]}
          />
          <ProFormText
            width="md"
            name="contact.two"
            label="2号客服"
            tooltip="2号客服的QQ联系方式"
            placeholder={"请输入2号客服的QQ联系方式"}
          />
          <ProFormText
            width="md"
            name="contact.three"
            label="QQ群号"
            tooltip="QQ群的群号"
            placeholder={"请输入QQ群的群号"}
          />
          <ProFormText
            width="md"
            name="contact.four"
            label="加群链接"
            tooltip="QQ群的加群链接"
            placeholder={"请输入QQ群的加群链接"}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default ContactView;
