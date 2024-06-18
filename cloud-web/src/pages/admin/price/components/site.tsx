import React, {useEffect, useState} from 'react';
import {App, Form, Spin} from "antd";
import ProForm, {ProFormText} from "@ant-design/pro-form";
import {getMy, getWeb, setWeb} from "@/service/admin/price";
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
const SiteView: React.FC = () => {
    const {styles: {box}} = useStyles()

    const [isLoading, setIsLoading] = useState(false);
    const [myPrice, setMyPrice] = useState({});
    const {message} = App.useApp()
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
                r?.error(r?.message || "请求失败")
            },
            onFinally: () => {
                setIsLoading(false)
            }
        });
    }

    /**
     * 获取成本价格
     */
    const getMyPrice = async () => {
        setIsLoading(true);
        return await getMy({
            onSuccess: (r: any) => {
                setMyPrice(r?.data)
            },
            onFail: (r: any) => {
                r?.error(r?.message || "请求失败")
            },
            onFinally: () => {
                setIsLoading(false)
            }
        });
    }

    const [form] = Form.useForm();
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
            },
            onFail: (r: any) => {
                message?.error(r?.message || "请求失败")
            }
        })
    }
    /**
     * 初始化数据
     */
    // @ts-ignore
    useEffect(() => {
        getConfigs();
        getMyPrice();
    }, []);

    return (
        <Spin spinning={isLoading} size="default">
            <div style={{display: isLoading ? 'none' : 'block'}}>
                <ProForm form={form} onFinish={onFinish} className={box}>
                    <ProFormText
                        width="md"
                        name="site.price"
                        label={"开通价格,成本:" + (myPrice['site.cost.price'] || 0) + "元/" + (myPrice['site.month'] || 0) + "月,最低售价:" + (myPrice['site.min.price'] || 0) + "元/" + (myPrice['site.month'] || 0) + "月"}
                        tooltip="用户开通分站价格"
                        placeholder={"请输入用户开通分站价格"}
                        rules={[{required: true, message: "请输入用户开通分站价格"}, {
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                            message: "请输入正确的金额"
                        }]}
                    />
                </ProForm>
            </div>
        </Spin>
    );
};
export default SiteView;
