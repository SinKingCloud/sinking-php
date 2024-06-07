import React, {useEffect, useState} from 'react';
import {App, Form, Spin} from "antd";
import ProForm, {ProFormText} from "@ant-design/pro-form";
import {getContact, setContact} from "@/service/admin/set";
import {createStyles} from "antd-style";
const useStyles = createStyles(({css})=>{
    return{
        box:css`
            .ant-form-item .ant-form-item-control{
                margin-bottom: 10px !important;
            }
        `
    }
})
const ContactView: React.FC = () => {
    const {styles:{box}} = useStyles()
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const {message} = App.useApp()
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getContact({
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    form.setFieldsValue(r?.data)
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
     * 提交表单
     */
    const onFinish = async (values: any) => {
        await setContact({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    message?.success(r?.message || "修改成功")
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
    // @ts-ignore
    useEffect(() => {
        getConfigs()
    }, []);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                <ProForm form={form} onFinish={onFinish} className={box}>
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
