import React, {useEffect, useState} from 'react';
import {Form, message, Spin, Upload} from "antd";
import ProForm, {ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {getUi, setUi} from "@/services/admin/set";
import {useModel} from "@@/plugin-model/useModel";
import {getUploadUrl} from "@/services/common/upload";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";

const UiView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState<any>({});
  /**
   * 刷新信息
   */
  const {initialState, setInitialState} = useModel('@@initialState');
  const fetchWebInfo = async () => {
    const currentWeb = await initialState?.fetchWebInfo?.();
    if (currentWeb) {
      await setInitialState((s: any) => ({
        ...s,
        currentWeb: currentWeb,
      }));
    }
  };
  /**
   * 初始化表单值
   */
  const getConfigs = async () => {
    setIsLoading(true);
    return await getUi().then((r): any => {
      if (r?.code != 200) {
        return {};
      } else {
        return r?.data || {};
      }
    });
  }

  /**
   * 图片上传
   */
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadFileList, setUploadFileList] = useState<any>();
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      message.error('请上传图片格式文件');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不能大于2MB');
      return;
    }
    return isJpgOrPng && isLt2M;
  }
  const handleChange = (info: any) => {
    setUploadFileList(info.fileList);
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setUploadLoading(false);
      const response = info.file.response;
      if (response?.code != 200) {
        message.error(response?.message || "上传文件错误")
      } else {
        info.file.url = info.file.response.data;
        setUploadFileList(info.fileList);
      }
      return;
    }
  };

  const [form] = Form.useForm();
  /**
   * 提交表单
   */
  const onFinish = async (values: any) => {
    // @ts-ignore
    if (uploadFileList?.length > 0) {
      // @ts-ignore
      values["ui.logo"] = uploadFileList[0]?.url || ""
    } else {
      values["ui.logo"] = ""
    }
    await setUi(values).then((r) => {
      if (r.code != 200) {
        message.error(r.message || "请求失败").then();
      } else {
        //刷新配置
        fetchWebInfo();
        message.success(r.message || "修改成功").then();
      }
    });
  }

  /**
   * 初始化数据
   */
  useEffect(() => {
    setIsLoading(true)
    getConfigs().then(data => {
      setIndex(data?.["index.templates"]);
      form?.setFieldsValue(data);
      if (data?.["ui.logo"] != undefined && data?.["ui.logo"] != "") {
        setUploadFileList([{uid: '-1', name: 'image.png', status: 'done', url: data?.["ui.logo"]}]);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <Spin spinning={isLoading} size="default">
      <div style={{display: isLoading ? 'none' : 'block'}}>
        <ProForm key={"ui"} form={form} onFinish={onFinish}>
          <ProFormSelect
            name="ui.index"
            label="首页模板"
            valueEnum={index}
            width="md"
            tooltip="网站首页的模板"
            placeholder="请选择网站首页模板"
            rules={[{required: true, message: '请选择网站首页模板'}]}
          />
          <ProFormSelect
            name="ui.layout"
            label="网站布局"
            valueEnum={{
              "top": "上下布局",
              "left": "左右布局",
            }}
            width="md"
            tooltip="用户界面布局"
            placeholder="请选择用户界面布局"
            rules={[{required: true, message: '请选择用户界面布局'}]}
          />
          <ProFormSelect
            name="ui.theme"
            label="菜单主题"
            valueEnum={{
              "light": "亮色",
              "dark": "暗色",
            }}
            width="md"
            tooltip="用户界面菜单主题"
            placeholder="请选择用户界面菜单主题"
            rules={[{required: true, message: '请选择用户界面菜单主题'}]}
          />
          <ProFormSelect
            name="ui.watermark"
            label="界面水印"
            valueEnum={{
              1: '开启',
              0: '关闭',
            }}
            width="md"
            tooltip="系统界面是否显示用户昵称水印"
            placeholder="请选择是否打开界面水印"
            rules={[{required: true, message: '请选择是否打开界面水印'}]}
          />
          <ProFormText name="ui.logo" label="网站LOGO" tooltip="网站的显示LOGO">
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              fileList={uploadFileList}
              showUploadList={true}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              action={getUploadUrl()}
              maxCount={1}
              onPreview={(file) => {
                // @ts-ignore
                if (file?.url) {
                  window.open(file?.url || "");
                  return;
                }
                // @ts-ignore
                window.open(file?.response.data.url);
              }}
            >
              <div>
                {uploadLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div style={{marginTop: 8}}>上传</div>
              </div>
            </Upload>
          </ProFormText>

        </ProForm>
      </div>
    </Spin>
  );
};
export default UiView;
