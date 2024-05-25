import React, {useEffect, useState} from 'react';
import {getConfigList, testCloud, updateConfigs} from "@/services/master/config";
import {Form, message, Spin} from "antd";
import ProForm, {ProFormText} from "@ant-design/pro-form";

const CloudView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getConfigList({page_size: 1000, key: "cloud"}).then((r): any => {
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
    await testCloud({id: values['cloud.id'], key: values['cloud.key']}).then(async (r) => {
      if (r?.code == 200) {
        await updateConfigs(values).then((r2) => {
          if (r2.code != 200) {
            message.error(r2?.message || "请求失败").then();
          } else {
            message.success(r2?.message || "修改成功").then();
          }
        });
      } else {
        message.error(r?.message || "请求失败").then();
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
        <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>基本设置</h3>
        <ProForm key={"cloud"} form={form} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="cloud.id"
            label="云端APPID"
            tooltip="云端APPID"
            placeholder={"请输入云端APPID"}
            rules={[{
              required: true,
              message: "请输入云端APPID"
            }, {pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/, message: "请输入正确的APPID"}]}
          />
          <ProFormText
            width="md"
            name="cloud.key"
            label="云端APPKEY"
            tooltip="云端APPKEY,0为不限制"
            placeholder={"请输入云端APPKEY"}
            rules={[{required: true, message: "请输入云端APPKEY"}]}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default CloudView;
