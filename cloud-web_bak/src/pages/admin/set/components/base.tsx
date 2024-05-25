import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Modal, Row, Spin, Typography} from "antd";
import ProForm, {ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {getWeb, setWeb} from "@/services/admin/set";
import {useModel} from "@@/plugin-model/useModel";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {getMy} from "@/services/admin/price";
import {buySite} from "@/services/admin/web";

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
   * 获取成本价格
   */
  const [myPrice, setMyPrice] = useState({});
  const getMyPrice = () => {
    getMy().then((r): any => {
      if (r?.code == 200) {
        setMyPrice(r?.data || {});
      }
    });
  }
  /**
   * 初始化数据
   */
  // @ts-ignore
  useEffect(() => {
    setIsLoading(true);
    getMyPrice();
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
          <ProFormText
            width="sm"
            label="到期时间"
            tooltip="网站的到期时间"
          >
            <Input style={{maxWidth: "180px"}} disabled={true} value={initialState?.currentWeb?.expire_time}/>
            <Button style={{marginLeft: "10px"}} type={"primary"} ghost onClick={() => {
              const key = 'buySite';
              Modal.confirm({
                title: '确定要续费站点到期时间吗?',
                icon: <ExclamationCircleOutlined/>,
                content: '将会花费' + (myPrice?.['site.cost.price'] || 0) + '元续期' + (myPrice?.['site.month'] || 0) + '个月网站时长',
                okType: 'primary',
                onOk() {
                  message.loading({content: '正在进行续期操作', key, duration: 60}).then();
                  buySite({}).then((r) => {
                    if (r?.code == 200) {
                      fetchWebInfo();
                      message.success({content: r?.message, key, duration: 2}).then();
                    } else {
                      message.error({content: r?.message || "续期失败", key, duration: 2}).then();
                    }
                  });
                },
              });
            }}>续期</Button>
          </ProFormText>
        </ProForm>
      </div>
    </Spin>
  );
};
export default BaseView;
