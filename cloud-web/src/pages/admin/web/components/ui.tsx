import React, {useEffect, useState} from 'react';
import {App, Form, Spin, Upload} from "antd";
import ProForm, {ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {getUi, setUi} from "@/service/admin/set";
import {getUploadUrl} from "@/service/common/upload";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {createStyles} from "antd-style";
import {useModel} from "umi";

const useStyles = createStyles(({css}) => {
    return {
        box: css`
            .ant-form-item .ant-form-item-control {
                margin-bottom: 10px !important;
            }
        `
    }
})

const UiView: React.FC = () => {
    const {styles: {box}} = useStyles()
    const [isLoading, setIsLoading] = useState(false);
    const [index, setIndex] = useState<any>({});
    const {message} = App.useApp()
    const [form] = Form.useForm();
    const web = useModel("web")
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getUi({
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    form.setFieldsValue(r?.data)
                    setIndex(r?.data?.["index.templates"]);
                    if (r?.data?.["ui.logo"] != undefined && r?.data?.["ui.logo"] != "") {
                        setUploadFileList([{uid: '-1', name: 'image.png', status: 'done', url: r?.data?.["ui.logo"]}]);
                    }
                    setIsLoading(false)
                }
            },
            onFail: (r: any) => {
                if (r?.code != 200) {
                    message?.error(r?.message || "请求失败")
                }
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
            message?.error('请上传图片格式文件');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message?.error('图片不能大于2MB');
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
                message?.error(response?.message || "上传文件错误")
            } else {
                info.file.url = info.file.response.data;
                setUploadFileList(info.fileList);
            }
            return;
        }
    };

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
        await setUi({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    message?.success(r?.message || "修改成功")
                    web?.refreshInfo()
                }
            },
            onFail: (r: any) => {
                if (r?.code != 200) {
                    message?.error(r?.message || "请求失败")
                }
            }
        });
    }

    /**
     * 初始化数据
     */
    useEffect(() => {
        getConfigs();
    }, []);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                <ProForm form={form} onFinish={onFinish} className={box}>
                    <ProFormSelect
                        name="ui.index"
                        label="首页模板"
                        valueEnum={index}
                        width="md"
                        tooltip="网站首页的模板"
                        placeholder="请选择网站首页模板"
                        rules={[{required: true, message: '请选择网站首页模板'}]}
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
                                if (file?.url) {
                                    window.open(file?.url || "");
                                    return;
                                }
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
