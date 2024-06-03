import React, {useRef} from 'react';
import ProTable from '@ant-design/pro-table';
import {getParams} from "@/utils/page";
import {getLogList} from "@/service/person/log";
import {App} from "antd";
import { Body } from '@/components';
export default (): React.ReactNode => {
    /**
     * 表单处理
     */
    const actionRef = useRef();
    const {message} = App.useApp()

    /**
     * table表格渲染
     */
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: '记录ID',
            hideInSearch: true,
            hideInTable: true,
            sorter: true,
        },
        {
            title: '请求ID',
            dataIndex: 'request_id',
            tip: '该请求的唯一ID',
            copyable: true,
        },
        {
            title: '请求IP',
            dataIndex: 'request_ip',
            tip: '请求者IP',
            copyable: true,
        },
        {
            title: '事件类型',
            dataIndex: 'type',
            tip: '事件类型',
            valueEnum: {
                0: {
                    text: '登陆',
                    status: 'success',
                },
                1: {
                    text: '查看',
                    status: 'warning',
                },
                2: {
                    text: '删除',
                    status: 'error',
                },
                3: {
                    text: '修改',
                    status: 'default',
                },
                4: {
                    text: '创建',
                    status: 'success',
                },
            },
        },
        {
            title: '标题',
            dataIndex: 'title',
            tip: '标题',
            hideInSearch: true,
        },
        {
            title: '内容',
            dataIndex: 'content',
            tip: '内容',
            hideInSearch: true,
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
            tip: '请求接口时间',
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
                    headerTitle={'操作日志'}
                    actionRef={actionRef}
                    style={{overflowX:"auto",whiteSpace:"nowrap"}}
                    scroll={{x:true}}
                    rowKey={'id'}
                    //@ts-ignore
                    columns={columns}
                    request={async (params, sort) => {
                        const fetchParams = getParams(params, sort)
                        const data = await getLogList({
                            body:{
                                ...fetchParams
                            }
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
                        labelWidth: "auto",
                    }}
                />
        </Body>
    );
};
