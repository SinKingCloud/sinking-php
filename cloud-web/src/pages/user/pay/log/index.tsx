import React, {useRef} from 'react';
import ProTable, {ProColumns} from '@ant-design/pro-table';
import {getParams} from "@/utils/page";
import {message} from "antd";
import {getPayLog} from "@/service/pay/pay";
import { Body } from '@/components';

export default (): React.ReactNode => {
    const actionRef = useRef();
    /**
     * table表格渲染
     */
    const columns: ProColumns[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: '记录ID',
            hideInSearch: true,
            hideInTable: true,
            sorter: true,
        },
        {
            title: '记录类型',
            dataIndex: 'type',
            tip: '记录类型',
            valueEnum: {
                0: {
                    text: '增加',
                    status: 'success',
                },
                1: {
                    text: '减少',
                    status: 'error',
                },
            },
        },
        {
            title: '记录标题',
            dataIndex: 'title',
            tip: '记录标题',
            hideInSearch: true,
        },
        {
            title: '记录详细',
            dataIndex: 'content',
            tip: '记录详细',
            hideInSearch: true,
        },
        {
            title: '金额',
            dataIndex: 'money',
            tip: '金额',
            hideInSearch: true,
            render: (text:any,record: any) => {
                return parseFloat(record?.money || 0).toFixed(2) + "元";
            }
        },
        {
            title: '操作时间',
            valueType: 'dateTime',
            dataIndex: 'create_time',
            tip: '操作时间',
            sorter: true,
            hideInSearch: true,
            editable: false,
        },
        {
            title: '操作时间',
            valueType: 'dateTimeRange',
            dataIndex: 'create_time',
            tip: '操作时间',
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
        <Body>
            <ProTable
                form={{layout: "vertical",autoFocusFirstInput:false}}
                headerTitle={'消费明细'}
                actionRef={actionRef}
                rowKey={'id'}
                style={{overflowX:"auto",whiteSpace:"nowrap"}}
                scroll={{x:true}}
                columns={columns}
                request={async (params, sort) => {
                    const fetchParams = getParams(params, sort)
                    const data = await getPayLog({
                        body:{
                            ...fetchParams
                        }
                    });
                    if (data.code != 200) {
                        message.error(data.message);
                    }
                    return {
                        data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
                        success: data.code === 200,
                        total: data.data.total,
                    };
                }}
                search={{
                    labelWidth: "auto",
                }}
            />
        </Body>
    );
};
