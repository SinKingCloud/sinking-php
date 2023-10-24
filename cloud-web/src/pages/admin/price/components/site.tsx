import React, {useEffect, useState} from 'react';
import {Form, message, Spin} from "antd";
import ProForm, {ProFormText} from "@ant-design/pro-form";
import {getMy, getWeb, setWeb} from "@/services/admin/price";

const SiteView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [myPrice, setMyPrice] = useState({});
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

  /**
   * 获取成本价格
   */
  const getMyPrice = async () => {
    setIsLoading(true);
    return await getMy().then((r): any => {
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
      getMyPrice().then(data => {
        setMyPrice(data);
        setIsLoading(false);
      })
    });
  }, []);

  return (
    <Spin spinning={isLoading} size="default">
      <div style={{display: isLoading ? 'none' : 'block'}}>
        <ProForm key={"form"} form={form} onFinish={onFinish}>
          <ProFormText
            width="md"
            name="site.price"
            label={"开通价格,成本:" + (myPrice['site.cost.price'] || 0) + "元/" + (myPrice['site.month'] || 0) + "月,最低售价:" + (myPrice['site.min.price'] || 0) + "元/" + (myPrice['site.month'] || 0) + "月"}
            tooltip="用户开通分站价格"
            placeholder={"请输入用户开通分站价格"}
            rules={[{required: true, message: "请输入用户开通分站价格"}, {
              pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
              message: "请输入正确的金额"
            }]}
          />
        </ProForm>
      </div>
    </Spin>
  );
};
export default SiteView;
