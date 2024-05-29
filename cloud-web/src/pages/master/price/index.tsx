import React from 'react';
import {Tabs} from 'antd';
import type { TabsProps } from 'antd';
import {Body} from "@/layouts/components";
import ProForm, {ProFormDigit, ProFormText} from "@ant-design/pro-form";
const App: React.FC = () =>{
    const [form] = ProForm.useForm()
    /**
     *
     * @param key
     */
    const onChange = (key: string) => {
        console.log(key);
    };
    const items: TabsProps['items'] = [
        {
            key: 'price',
            label: '系统价格',
            children: (
                <ProForm form={form} layout={"horizontal"}>
                    <ProFormText
                        width="md"
                        name="site.cost.price"
                        label="开通成本"
                        tooltip="下级开通分站成本金额,设置为0可无限开通分站"
                        placeholder={"请输入开通分站成本金额"}
                        rules={[{required: true, message: "请输入开通分站成本金额"}, {
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                            message: "请输入正确的金额"
                        }]}
                    />
                    <ProFormText
                        width="md"
                        name="site.min.price"
                        label="最低售价"
                        tooltip="下级可设置的前台最低销售价格"
                        placeholder={"请输入最低销售价格"}
                        rules={[{required: true, message: "请输入最低销售价格"}, {
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                            message: "请输入正确的金额"
                        }]}
                    />
                    <ProFormText
                        width="md"
                        name="site.default.price"
                        label="默认售价"
                        tooltip="新站点开通默认售价"
                        placeholder={"请输入默认销售价格"}
                        rules={[{required: true, message: "请输入默认销售价格"}, {
                            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
                            message: "请输入正确的金额"
                        }]}
                    />
                    <ProFormDigit
                        width="md"
                        name="site.month"
                        label="开通月数"
                        tooltip="用户开通分站自动续期的月数,填写0或为空则永久"
                        placeholder={"用户开通分站自动续期的月数，填写0或为空则永久"}
                        min={0}
                        max={999}
                        rules={[{required: true, message: "请输入用户开通分站自动续期的月数，填写0或为空则永久"},]}
                    />
                    <ProFormText
                        width="md"
                        name="site.recharge.deduct"
                        label="充值提成(%)"
                        tooltip="网站用户充值余额站长获得订单金额的百分比,填写0则无提成"
                        placeholder={"请输入充值提成百分比"}
                        rules={[{
                            required: true,
                            message: "请输入充值提成百分比"
                        }, {pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$|100.00$/, message: "请输入正确的百分比"}]}
                    />
                    <ProFormText
                        width="md"
                        name="site.order.deduct"
                        label="上级分润(%)"
                        tooltip="站长下级站点用户消费上级站长获得利润金额的百分比,填写0则不分润"
                        placeholder={"请输入利润金额的提成百分比"}
                        rules={[{
                            required: true,
                            message: "请输入利润金额的提成百分比"
                        }, {pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$|100.00$/, message: "请输入正确的百分比"}]}
                    />
                </ProForm>
            ),
        },
    ];
   return <Body>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
        </Body>
}
export default App;