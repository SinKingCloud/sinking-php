import React, {useEffect, useState} from 'react';
import {getConfigList, testCloud, updateConfigs} from "@/service/master/config";
import {App, Form, Spin} from "antd";
import ProForm, {ProFormText} from "@ant-design/pro-form";
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
const CloudView: React.FC = () => {
    const {styles:{box}} = useStyles()
    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp()
    const [form] = Form.useForm();

    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getConfigList({
            body:{
                page_size: 1000,
                key: "cloud"
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    let temp:any = {};
                    r?.data?.list.forEach((k: any) => {
                       return temp[k?.key] = k?.value;
                    });
                    form.setFieldsValue(temp)
                    setIsLoading(false)
                }
            }
        });
    }

    /**
     * 提交表单
     */
    const onFinish = async (values: any) => {
        await testCloud({
            body:{
                id: values['cloud.id'],
                key: values['cloud.key']
            },
            onSuccess:async (r:any)=>{
                if(r?.code == 200){
                    await updateConfigs({
                        body:{
                            ...values
                        },
                        onSuccess:(r2:any)=>{
                            if(r2?.code == 200){
                                message?.success(r2?.message || "修改成功")
                            }
                        },
                        onFail:(r2:any)=>{
                            if(r2?.code != 200){
                                message?.error(r2?.message || "请求失败")
                            }
                        }
                    })
                }
        },
            onFail:(r:any)=>{
                if(r?.code != 200){
                    message?.error(r?.message || "请求失败")
                }
            }
        })
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
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>基本设置</h3>
                <ProForm form={form} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="cloud.id"
                        label="云端APPID"
                        tooltip="云端APPID"
                        placeholder={"请输入云端APPID"}
                        rules={[{
                            required: true,
                            message: "请输入云端APPID"
                        }, {pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/, message: "请输入正确的APPID"}]}
                    />
                    <ProFormText
                        width="md"
                        name="cloud.key"
                        label="云端APPKEY"
                        tooltip="云端APPKEY,0为不限制"
                        placeholder={"请输入云端APPKEY"}
                        rules={[{required: true, message: "请输入云端APPKEY"}]}
                    />
                </ProForm>
            </div>
        </Spin>
    );
};
export default CloudView;
