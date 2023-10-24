import React, {useEffect, useState} from 'react';
import {getConfigList, updateConfigs} from "@/services/master/config";
import {Form, message, Spin} from "antd";
import ProForm, {ProFormSelect, ProFormText} from "@ant-design/pro-form";

const BaseView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getConfigList({page_size: 1000, key: "master"}).then((r): any => {
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
    });
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
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>基础设置</h3>
        <ProForm key={"base"} form={form} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="master.contact"
            label="总站联系方式"
            tooltip="总站管理员的联系方式"
            placeholder={"请输入总站管理员的联系方式"}
            rules={[{required: true, message: "请输入总站管理员的联系方式"},]}
          />
          <ProFormSelect
            name="master.is_proxy"
            label="使用CDN"
            valueEnum={{
              1: '开启',
              0: '关闭',
            }}
            width="md"
            tooltip="如果使用了cdn等网关代理产品。需要打开此配置才能正确获取用户IP"
            placeholder="请选择是否使用CDN"
            rules={[{required: true, message: '请选择是否使用CDN'}]}
          />
          <ProFormSelect
            name="master.request.log.open"
            label="请求日志"
            valueEnum={{
              1: '开启',
              0: '关闭',
            }}
            width="md"
            tooltip="对http请求进行记录,开启可能会造成性能损耗"
            placeholder="请选择是否开启请求日志记录"
            rules={[{required: true, message: '请选择是否开启请求日志记录'}]}
          />
          <ProFormSelect
            name="master.debug"
            label="DEBUG模式"
            valueEnum={{
              1: '开启',
              0: '关闭',
            }}
            width="md"
            tooltip="开启debug在遇到异常时将会直接抛出,如果是生产环境请关闭此选项"
            placeholder="请选择是否开启debug"
            rules={[{required: true, message: '请选择是否开启debug'}]}
          />
        </ProForm>
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>注册设置</h3>
        <ProForm key={"reg"} form={form1} onFinish={onFinish}>
          <ProFormSelect
            name="master.reg.email"
            label="邮箱注册"
            valueEnum={{
              1: '开启',
              0: '关闭',
            }}
            width="md"
            tooltip="关闭后用户将禁止通过邮箱注册账号,不填则默认开启"
            placeholder="请选择是否开启邮箱注册"
            rules={[{required: true, message: '请选择是否开启邮箱注册'}]}
          />
          <ProFormSelect
            name="master.reg.qrlogin"
            label="QQ扫码注册"
            valueEnum={{
              1: '开启',
              0: '关闭',
            }}
            width="md"
            tooltip="关闭后用户将禁止通过QQ扫码注册注册账号,不填则默认开启"
            placeholder="请选择是否开启QQ扫码注册注册"
            rules={[{required: true, message: '请选择是否开启QQ扫码注册注册'}]}
          />
          <ProFormSelect
            name="master.reg.phone"
            label="手机注册"
            valueEnum={{
              1: '开启',
              0: '关闭',
            }}
            width="md"
            tooltip="关闭后用户将禁止通过手机注册账号,不填则默认开启"
            placeholder="请选择是否开启手机注册"
            rules={[{required: true, message: '请选择是否开启手机注册'}]}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default BaseView;
