import React, {useRef} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {getParams} from "@/util/page";
import {message} from "antd";
import {getPayLog} from "@/services/pay/pay";

export default (): React.ReactNode => {
  /**
   * 表单处理
   */
  const actionRef = useRef();
  const ref = useRef();

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
      render: (text: string, record: any) => {
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
    <PageContainer title={false}>
      <ProTable
        defaultSize={"small"}
        form={{layout: "vertical",autoFocusFirstInput:false}}
        headerTitle={'消费明细'}
        actionRef={actionRef}
        formRef={ref}
        scroll={{x: "auto"}}
        rowKey={'id'}
        options={{
          density: true,
          fullScreen: true,
          setting: true,
        }}
        // @ts-ignore
        columns={columns}
        request={async (params, sort) => {
          const data = await getPayLog(getParams(params, sort));
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
          defaultCollapsed: true,
          labelWidth: 20,
        }}
      />
    </PageContainer>
  );
};
