import React, {useEffect, useState} from 'react';
import {getConfigList, updateConfigs} from "@/service/master/config";
import {App, Form, Spin} from "antd";
import ProForm, {ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css})=>{
    return{
        label:css`
            .ant-form-item-label >label{
                font-size: 14px;
            }
        `
    }
})
const CashView: React.FC = () => {
    const {styles:{label}} = useStyles()
    const [isLoading, setIsLoading] = useState(false);
    const {message} = App.useApp()
    const [data,setData] = useState(()=>{
        return JSON.parse(localStorage.getItem('cash') || '{}')
    })
    /**
     * 初始化表单值
     */
    const getConfigs = async () => {
        setIsLoading(true);
        return await getConfigList({
            body:{
                page_size: 1000,
                key: "cash"
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    let temp:any = {};
                    r?.data?.list.forEach((k: any) => {
                      return temp[k?.key] = k?.value;
                    });
                    setData(temp)
                    localStorage.setItem('cash', JSON.stringify(temp))
                    setIsLoading(false)
                }
            }
        });
    }

    const [form] = Form.useForm();
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
        getConfigs().then(() => {
            form?.setFieldsValue(data);
        });
    }, []);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                <h3 style={{fontWeight: "bold", marginTop: "30px", color: "#5d5d5d"}}>基本设置</h3>
                <ProForm key={"cash"} form={form} onFinish={onFinish} size={"large"} className={label}>
                    <ProFormSelect
                        name="cash.open"
                        label="开启提现"
                        valueEnum={{
                            1: '开启',
                            0: '关闭',
                        }}
                        width="md"
                        tooltip="站长是否开启提现功能"
                        placeholder="请选择是否开启提现"
                        rules={[{required: true, message: '请选择是否开启提现'}]}
                    />
                    <ProFormText
                        width="md"
                        name="cash.deduct"
                        label="提现手续费(%)"
                        tooltip="申请提现扣除n%手续费，0为无费率"
                        placeholder={"请输入提现手续费率"}
                        rules={[{
                            required: true,
                            message: "请输入提现手续费率"
                        }, {pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$|100.00$/, message: "请输入正确的费率"}]}
                    />
                    <ProFormText
                        width="md"
                        name="cash.min.money"
                        label="最低提现金额"
                        tooltip="用户最低提现金额,0为不限制"
                        placeholder={"请输入最低提现金额"}
                        rules={[{required: true, message: "请输入最低提现金额"}, {
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                            message: "请输入正确的金额"
                        }]}
                    />
                </ProForm>
            </div>
        </Spin>
    );
};
export default CashView;
