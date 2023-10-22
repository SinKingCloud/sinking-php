import React, {useEffect, useState} from 'react';
import {Form, message, Spin} from "antd";
import ProForm, {ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {getWeb, setWeb} from "@/services/admin/set";
import {useModel} from "@@/plugin-model/useModel";

const BaseView: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  /**
   * 获取当前站点信息
   */
  const fetchWebInfo = async () => {
    const currentWeb = await initialState?.fetchWebInfo?.();
    if (currentWeb) {
      await setInitialState((s: any) => ({
        ...s,
        currentWeb: currentWeb,
      }));
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getWeb().then((r): any => {
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
    await setWeb(values).then((r) => {
      if (r.code != 200) {
        message.error(r.message || "请求失败").then();
      } else {
        fetchWebInfo();
        message.success(r.message || "修改成功").then();
      }
    });
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
        <ProForm key={"base"} form={form} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="name"
            label="网站名称"
            tooltip="网站LOGO显示名称"
            placeholder={"请输入网站名称"}
            rules={[{required: true, message: "请输入网站名称"},]}
          />
          <ProFormText
            width="md"
            name="title"
            label="网站标题"
            tooltip="网站首页标题显示"
            placeholder={"请输入网站标题"}
            rules={[{required: true, message: "请输入网站标题"},]}
          />
          <ProFormTextArea
            width="md"
            name="keywords"
            label="网站关键词"
            tooltip="网站首页关键词"
            placeholder={"请输入网站关键词"}
            rules={[{required: true, message: "请输入网站关键词"},]}
          />
          <ProFormTextArea
            width="md"
            name="description"
            label="网站描述"
            tooltip="网站描述"
            placeholder={"请输入网站描述"}
            rules={[{required: true, message: "请输入网站描述"},]}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default BaseView;
