import React, {useEffect, useState} from 'react';
import {App, Button, Form, Input, ModalProps, Spin} from "antd";
import ProForm, {ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {getWeb, setWeb} from "@/service/admin/set";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {getMy} from "@/service/admin/price";
import {buySite} from "@/service/admin/web";
import {useModel} from "umi";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css}) => {
    return {
        box: css`
            .ant-form-item .ant-form-item-control {
                margin-bottom: 10px !important;
            }
        `
    }
})
const BaseView: React.FC = () => {
    const {styles: {box}} = useStyles()
    const {message, modal} = App.useApp()
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const web = useModel("web")
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getWeb({
            onSuccess: (r: any) => {
                form.setFieldsValue(r?.data)
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            },
            onFinally: () => {
                setIsLoading(false)
            }
        });
    }

    /**
     * 提交表单
     */
    const onFinish = async (values: any) => {
        await setWeb({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                message?.success(r?.message || "修改成功")
                web?.refreshInfo()
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            }
        });
    }

    /**
     * 获取成本价格
     */
    const [myPrice, setMyPrice] = useState({});
    const getMyPrice = async () => {
        await getMy({
            onSuccess: (r: any) => {
                setMyPrice(r?.data || {});
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            }
        });
    }
    /**
     * 初始化数据
     */
    // @ts-ignore
    useEffect(() => {
        getMyPrice();
        getConfigs();
    }, []);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                <ProForm form={form} onFinish={onFinish} className={box}>
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
                        <Input style={{maxWidth: "180px"}} disabled={true} value={web?.info?.expire_time}/>
                        <Button style={{marginLeft: "10px"}} type={"primary"} ghost onClick={() => {
                            modal.confirm({
                                title: '确定要续费站点到期时间吗?',
                                icon: <ExclamationCircleOutlined/>,
                                content: '将会花费' + (myPrice?.['site.cost.price'] || 0) + '元续期' + (myPrice?.['site.month'] || 0) + '个月网站时长',
                                okType: 'primary',
                                onOk: async () => {
                                    const key = 'buySite';
                                    message?.loading({content: '正在进行续期操作', key, duration: 60})
                                    await buySite({
                                        body: {},
                                        onSuccess: (r: any) => {
                                            message?.success(r?.message);
                                            web?.refreshInfo();
                                        },
                                        onFail: (r: any) => {
                                            message?.error(r?.message || "续期失败");
                                        },
                                        onFinally: () => {
                                            message.destroy(key)
                                        }
                                    });
                                },
                            } as ModalProps);
                        }}>续期</Button>
                    </ProFormText>
                </ProForm>
            </div>
        </Spin>
    );
};
export default BaseView;
