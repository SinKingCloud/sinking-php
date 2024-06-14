import React, {useEffect, useState} from 'react';
import {getConfigList, updateConfigs} from "@/service/master/config";
import {App, Form, Spin} from "antd";
import ProForm, {ProFormText, ProFormTextArea} from "@ant-design/pro-form";
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
const WebView: React.FC = () => {
    const {styles:{box}} = useStyles()
    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp()
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getConfigList({
            body:{
                page_size: 1000,
                key: "master"
            },
            onSuccess:(r:any)=>{
                    let temp:any = {};
                    r?.data?.list.forEach((k: any) => {
                       return temp[k?.key] = k?.value;
                    });
                    form?.setFieldsValue(temp);
                    form1?.setFieldsValue(temp);
            },
            onFinally:()=>{
                setIsLoading(false)
            }
        });
    }

    /**
     * 提交表单
     */
    const onFinish = async (values: any) => {
        await updateConfigs({
            body:{
                ...values
            },
            onSuccess:(r:any)=>{
                    message?.success(r?.message || "修改成功")
            },
            onFail:(r:any)=>{
                    message?.error(r?.message || "请求失败")
            }
        });
    }
    /**
     * 初始化数据
     */
    useEffect(() => {
        getConfigs()
    }, []);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>基础设置</h3>
                <ProForm key={"web"} form={form} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="master.domains"
                        label="分站域名(多个域名使用|分割,首位无需加点)"
                        tooltip="用户开通分站可选择的域名"
                        placeholder={"请输入分站域名"}
                        rules={[{required: true, message: "请输入分站域名"},]}
                    />
                    <ProFormText
                        width="md"
                        name="master.domain.num"
                        label="域名最多绑定个数"
                        tooltip="用户网站最大可绑定域名个数"
                        placeholder={"请输入用户网站最大可绑定域名个数"}
                        rules={[{required: true, message: "请输入用户网站最大可绑定域名个数"}, {
                            pattern: /^[+]{0,1}(\d+)$/,
                            message: "请输入正确的数字"
                        }]}
                    />
                    <ProFormText
                        width="md"
                        name="master.domain.resolve"
                        label="自定义域名解析地址"
                        tooltip="用户自定义域名绑定解析地址"
                        placeholder={"请输入自定义域名解析地址"}
                        rules={[{required: true, message: "请输入自定义域名解析地址"},]}
                    />
                    <ProFormTextArea
                        width="md"
                        name="master.domain.black"
                        label="黑名单域名(一行一个)"
                        tooltip="不允许使用的域名"
                        placeholder={"黑名单域名"}
                    />
                </ProForm>
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>新开设置</h3>
                <ProForm key={"web_new"} form={form1} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="master.web.title"
                        label="默认标题"
                        tooltip="默认网站首页标题显示"
                        placeholder={"请输入默认标题,可用变量{$name}引用网站名称"}
                        rules={[{required: true, message: "请输入网站默认标题"},]}
                    />
                    <ProFormTextArea
                        width="md"
                        name="master.web.keywords"
                        label="默认关键词"
                        tooltip="默认网站首页关键词"
                        placeholder={"请输入默认关键词,可用变量{$name}引用网站名称"}
                        rules={[{required: true, message: "请输入网站默认关键词"},]}
                    />
                    <ProFormTextArea
                        width="md"
                        name="master.web.description"
                        label="默认描述"
                        tooltip="默认网站描述"
                        placeholder={"请输入默认描述,可用变量{$name}引用网站名称"}
                        rules={[{required: true, message: "请输入网站默认描述"},]}
                    />
                </ProForm>
            </div>
        </Spin>
    );
};
export default WebView;
