import React, {useEffect, useState} from 'react';
import {App, Form, Spin} from "antd";
import ProForm, {ProFormTextArea} from "@ant-design/pro-form";
import {getNotice, setNotice} from "@/service/admin/set";
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
const NoticeView: React.FC = () => {
    const {styles:{box}} = useStyles()

    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp()
    const [form] = Form.useForm();
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getNotice({
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
        await setNotice({
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
        getConfigs();
    }, []);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                <ProForm key="base" form={form} onFinish={onFinish} className={box}>
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
