import React, {useEffect, useState} from 'react';
import {Form, message, Spin} from "antd";
import ProForm, {ProFormTextArea} from "@ant-design/pro-form";
import {getNotice, setNotice} from "@/services/admin/set";

const NoticeView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getNotice().then((r): any => {
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
    await setNotice(values).then((r) => {
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
    setIsLoading(true)
    getConfigs().then(data => {
      form?.setFieldsValue(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <Spin spinning={isLoading} size="default">
      <div style={{display: isLoading ? 'none' : 'block'}}>
        <ProForm key={"base"} form={form} onFinish={onFinish}>
          <ProFormTextArea
            width="md"
            name="notice.index"
            label="首页公告"
            tooltip="首页滚动公告设置"
            placeholder={"请输入首页滚动公告,不开启请留空"}
          />
          <ProFormTextArea
            width="md"
            name="notice.shop"
            label="商城公告"
            tooltip="商城滚动公告设置"
            placeholder={"请输入商城滚动公告,不开启请留空"}
          />
          <ProFormTextArea
            width="md"
            name="notice.admin"
            label="后台公告"
            tooltip="后台滚动公告设置"
            placeholder={"请输入后台滚动公告,不开启请留空"}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default NoticeView;
