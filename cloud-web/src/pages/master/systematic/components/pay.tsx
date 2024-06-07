import React, {useEffect, useState} from 'react';
import {getConfigList, updateConfigs} from "@/service/master/config";
import {App, Form, Spin} from "antd";
import ProForm, {ProFormSelect, ProFormText} from "@ant-design/pro-form";
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
const PayView: React.FC = () => {
    const {styles:{box}} = useStyles()
    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp()
    const [form] = Form.useForm();
    const [epay1] = Form.useForm();
    const [epay2] = Form.useForm();
    const [epay3] = Form.useForm();
    /**
     *
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getConfigList({
            body:{
                page_size: 1000,
                key: "pay"
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    let temp:any = {};
                    r?.data?.list.forEach((k: any) => {
                       return temp[k?.key] = k?.value;
                    });
                    form?.setFieldsValue(temp);
                    epay1?.setFieldsValue(temp);
                    epay2?.setFieldsValue(temp);
                    epay3?.setFieldsValue(temp);
                    setIsLoading(false)
                }
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
                if(r?.code == 200){
                    message?.success(r?.message || "修改成功")
                }
            },
            onFail:(r:any)=>{
                if(r?.code != 200){
                    message?.error(r?.message || "请求失败")
                }
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
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>通道设置</h3>
                <ProForm form={form} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="pay.min.money"
                        label="最低充值金额"
                        tooltip="用户最低充值金额,0为不限制"
                        placeholder={"请输入最低充值金额"}
                        rules={[{required: true, message: "请输入最低充值金额"}, {
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                            message: "请输入正确的金额"
                        }]}
                    />
                    <ProFormSelect
                        name="pay.alipay.type"
                        label="支付宝"
                        valueEnum={{
                            0: '关闭',
                            'epay1': '易支付通道A',
                            'epay2': '易支付通道B',
                            'epay3': '易支付通道C',
                        }}
                        width="md"
                        tooltip="支付宝支付通道配置"
                        placeholder="请选择支付宝支付通道配置"
                        rules={[{required: true, message: '请选择支付宝支付通道配置'}]}
                    />
                    <ProFormSelect
                        name="pay.wxpay.type"
                        label="微信"
                        valueEnum={{
                            0: '关闭',
                            'epay1': '易支付通道A',
                            'epay2': '易支付通道B',
                            'epay3': '易支付通道C',
                        }}
                        width="md"
                        tooltip="微信支付通道配置"
                        placeholder="请选择微信支付通道配置"
                        rules={[{required: true, message: '请选择微信支付通道配置'}]}
                    />
                    <ProFormSelect
                        name="pay.qqpay.type"
                        label="QQ"
                        valueEnum={{
                            0: '关闭',
                            'epay1': '易支付通道A',
                            'epay2': '易支付通道B',
                            'epay3': '易支付通道C',
                        }}
                        width="md"
                        tooltip="QQ支付通道配置"
                        placeholder="请选择QQ支付通道配置"
                        rules={[{required: true, message: '请选择QQ支付通道配置'}]}
                    />
                </ProForm>
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>易支付通道A</h3>
                <ProForm form={epay1} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="pay.epay1.url"
                        label="易支付地址"
                        tooltip="易支付地址"
                        placeholder={"请输入易支付地址"}
                        rules={[{required: true, message: "请输入易支付地址"},]}
                    />
                    <ProFormText
                        width="md"
                        name="pay.epay1.appid"
                        label="易支付APPID"
                        tooltip="易支付APPID"
                        placeholder={"请输入易支付APPID"}
                        rules={[{required: true, message: "请输入易支付APPID"},]}
                    />
                    <ProFormText
                        width="md"
                        name="pay.epay1.key"
                        label="易支付APPKEY"
                        tooltip="易支付APPKEY"
                        placeholder={"易支付APPKEY"}
                        rules={[{required: true, message: "易支付APPKEY"},]}
                    />
                </ProForm>
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>易支付通道B</h3>
                <ProForm form={epay2} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="pay.epay2.url"
                        label="易支付地址"
                        tooltip="易支付地址"
                        placeholder={"请输入易支付地址"}
                        rules={[{required: true, message: "请输入易支付地址"},]}
                    />
                    <ProFormText
                        width="md"
                        name="pay.epay2.appid"
                        label="易支付APPID"
                        tooltip="易支付APPID"
                        placeholder={"请输入易支付APPID"}
                        rules={[{required: true, message: "请输入易支付APPID"},]}
                    />
                    <ProFormText
                        width="md"
                        name="pay.epay2.key"
                        label="易支付APPKEY"
                        tooltip="易支付APPKEY"
                        placeholder={"易支付APPKEY"}
                        rules={[{required: true, message: "易支付APPKEY"},]}
                    />
                </ProForm>
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>易支付通道C</h3>
                <ProForm form={epay3} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="pay.epay3.url"
                        label="易支付地址"
                        tooltip="易支付地址"
                        placeholder={"请输入易支付地址"}
                        rules={[{required: true, message: "请输入易支付地址"},]}
                    />
                    <ProFormText
                        width="md"
                        name="pay.epay3.appid"
                        label="易支付APPID"
                        tooltip="易支付APPID"
                        placeholder={"请输入易支付APPID"}
                        rules={[{required: true, message: "请输入易支付APPID"},]}
                    />
                    <ProFormText
                        width="md"
                        name="pay.epay3.key"
                        label="易支付APPKEY"
                        tooltip="易支付APPKEY"
                        placeholder={"易支付APPKEY"}
                        rules={[{required: true, message: "易支付APPKEY"},]}
                    />
                </ProForm>
            </div>
        </Spin>
    );
};
export default PayView;
