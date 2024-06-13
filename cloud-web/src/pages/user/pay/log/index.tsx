import React, {useRef} from 'react';
import ProTable, {ProColumns} from '@ant-design/pro-table';
import {getData} from "@/utils/page";
import {getPayLog} from "@/service/pay/pay";
import {Body, Title} from '@/components';

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
            render: (text: any, record: any) => {
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
                form={{layout: "vertical", autoFocusFirstInput: false}}
                headerTitle={<Title>消费明细</Title>}
                actionRef={actionRef}
                rowKey={'id'}
                style={{overflowX: "auto", whiteSpace: "nowrap"}}
                scroll={{x: true}}
                columns={columns}
                request={(params, sort) => {
                    return getData(params, sort, getPayLog);
                }}
                search={{
                    labelWidth: "auto",
                }}
            />
        </Body>
    );
};
