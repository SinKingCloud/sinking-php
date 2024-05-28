import React, {useRef} from 'react';
import {getParams} from "@/utils/page";
import {getPayOrder} from "@/service/pay/order";
import { Body } from '@/layouts/components';
import {App} from "antd";
import ProTable from "@ant-design/pro-table";

export default (): React.ReactNode => {
    /**
     * 表单处理
     */
    const actionRef = useRef();
    const {message} = App.useApp()
    /**
     * table表格渲染
     */
    const column= [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: '记录ID',
            hideInSearch: true,
            hideInTable: true,
            sorter: true,
        },
        {
            title: '订单ID',
            dataIndex: 'trade_no',
            tip: '订单唯一ID',
            copyable: true,
        },
        {
            title: '订单类型',
            dataIndex: 'order_type',
            tip: '订单类型',
            valueEnum: {
                0: {
                    text: '余额充值',
                    color: '#2d8efc',
                },
                1: {
                    text: '开通主站',
                    color: '#5037ff',
                },
                2: {
                    text: '在线下单',
                    color: '#13e537',
                },
                3: {
                    text: '网站续费',
                    color: '#dee513',
                }
            },
        },
        {
            title: '订单名称',
            dataIndex: 'name',
            tip: '订单名称',
            hideInSearch: true,
        },
        {
            title: '订单金额',
            dataIndex: 'money',
            tip: '订单金额',
            hideInSearch: true,
            render: (text:any,record: any) => {
                return parseFloat(record?.money || 0).toFixed(2) + "元";
            }
        },
        {
            title: '支付方式',
            dataIndex: 'pay_type',
            tip: '支付方式',
            valueEnum: {
                0: {
                    text: '支付宝',
                    color: 'blue',
                },
                1: {
                    text: '微信',
                    color: 'green',
                },
                2: {
                    text: 'QQ',
                    color: 'yellow',
                },
                3: {
                    text: '余额',
                    color: 'red',
                }
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            tip: '订单状态',
            valueEnum: {
                0: {
                    text: '未支付',
                    status: 'warning',
                },
                1: {
                    text: '已支付',
                    status: 'success',
                },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            tip: '订单创建时间',
            hideInSearch: true,
            sorter: true,
        },
        {
            title: '支付时间',
            dataIndex: 'update_time',
            tip: '订单创建时间',
            hideInSearch: true,
        },
        {
            title: '支付时间',
            valueType: 'dateTimeRange',
            dataIndex: 'update_time',
            tip: '订单支付时间',
            hideInTable: true,
            search: {
                transform: (value: any) => {
                    return {
                        update_time_start: value[0],
                        update_time_end: value[1],
                    };
                },
            },
        },
        {
            title: '创建时间',
            valueType: 'dateTimeRange',
            dataIndex: 'create_time',
            tip: '订单创建时间',
            hideInTable: true,
            search: {
                transform: (value: any) => {
                    return {
                        create_time_start: value[0],
                        create_time_end: value[1],
                    };
                },
            },
        },
    ];
    return (
        <Body >
            <ProTable
                form={{layout: "vertical",autoFocusFirstInput:false}}
                headerTitle={'订单记录'}
                actionRef={actionRef}
                rowKey={'id'}
                style={{overflowX:"auto",whiteSpace:"nowrap"}}
                scroll={{x:true}}
                columns={column}
                request={async (params, sort) => {
                    const fetchParams = getParams(params,sort)
                    const data = await getPayOrder({
                         body:{
                             ...fetchParams
                         },

                     });
                    if (data?.code != 200) {
                        message?.error(data?.message);
                    }
                    return {
                        data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
                        success: data.code === 200,
                        total: data.data.total,
                    };
                }}
                search={{
                    labelWidth: 'auto',
                }}
            />
        </Body>
    );
};
