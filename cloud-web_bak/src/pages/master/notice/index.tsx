import React, {useRef, useState} from 'react';
import {Button, Drawer, Dropdown, Form, Input, InputNumber, Menu, message, Modal, Select, Spin, Table} from 'antd';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {getParams} from "@/util/page";
import {DownOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {createNotice, deleteNotice, getNoticeInfo, getNoticeList, updateNotice} from "@/services/master/notice";
import BraftEditor from "braft-editor";
import 'braft-editor/dist/index.css';
import {uploadFile} from "@/services/common/upload";

export default (): React.ReactNode => {
  /**
   * 表单处理
   */
  const actionRef = useRef();
  const ref = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);

  /**
   * 获取选中项
   */
  const getSelectedIds = () => {
    const ids: any[] = [];
    selectedRowsState.map((k: any) => {
      ids.push(k.id);
    });
    return ids;
  };

  /**
   * 表单
   */
  const [form] = Form.useForm();//新建编辑表单
  const [edit] = Form.useForm();//批量修改表单
  /**
   * 新建编辑提交表单
   * @param values 表单项
   */
  const onFormFinish = async (values: any) => {
    let api = createNotice;
    if (values.id != undefined) {
      api = updateNotice;
      values.ids = [values.id];
      values.sort = values.sort.toString();
      values.status = values.status.toString();
      delete values.id;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    values.content = editValue || "";
    setIsModalVisible(false)
    api(values).then((r) => {
      if (r.code != 200) {
        message.error(r.message || "请求失败").then()
      } else {
        // @ts-ignore
        actionRef.current.reload()
        form.resetFields();
        message.success(r.message).then()
      }
    })
  }

  /**
   * 批量修改提交表单
   * @param values 表单项
   */
  const onEditFinish = async (values: any) => {
    setIsModalEditVisible(false);
    values.ids = getSelectedIds()
    if (values.status != undefined && values.status >= 0) {
      values.status = values.status.toString();
    }
    updateNotice(values).then((r) => {
      if (r.code != 200) {
        message.error(r.message || "请求失败").then()
      } else {
        // @ts-ignore
        actionRef.current.reload()
        // @ts-ignore
        actionRef.current.clearSelected();
        edit.resetFields();
        message.success(r.message).then()
      }
    })
  }

  /**
   * 删除数据
   * @param ids id列表
   */
  const deleteSubmit = (ids: any[]) => {
    Modal.confirm({
      title: '您确定要删除该数据吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后该数据不可恢复',
      okType: 'danger',
      onOk() {
        deleteNotice({ids: ids}).then((r) => {
          if (r.code != 200) {
            message.error(r.message || "请求失败").then()
          } else {
            // @ts-ignore
            actionRef.current.reloadAndRest()
            message.success(r.message).then()
          }
        })
      },
    });
  }

  /**
   * 批量删除
   */
  const modalDelete = () => {
    deleteSubmit(getSelectedIds())
  }

  /**
   * table表格渲染
   */
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '记录ID',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
      tip: '通知标题',
      copyable: true,
    },
    {
      title: '位置',
      dataIndex: 'place',
      tip: '通知显示位置',
      valueEnum: {
        "index": {
          text: '系统首页',
        },
        "shop": {
          text: '用户商城',
        },
        "admin": {
          text: '分站后台',
        },
      },
    },
    {
      title: '浏览量',
      dataIndex: 'look_num',
      tip: '通知的浏览量',
      hideInSearch: true,
      render: (text: string) => {
        return text + "次";
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      tip: '将会由大到小显示',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '修改时间',
      valueType: 'dateTime',
      dataIndex: 'update_time',
      tip: '上次修改时间',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '添加时间',
      valueType: 'dateTime',
      dataIndex: 'create_time',
      tip: '上次修改时间',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '修改时间',
      valueType: 'dateTimeRange',
      dataIndex: 'update_time',
      tip: '上次修改时间',
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
      title: '添加时间',
      valueType: 'dateTimeRange',
      dataIndex: 'create_time',
      tip: '添加记录时间',
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
    {
      title: '状态',
      dataIndex: 'status',
      tip: '显示状态',
      sorter: true,
      valueEnum: {
        0: {
          text: '显示',
          status: 'success',
        },
        1: {
          text: '隐藏',
          status: 'error',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'Option',
      hideInSearch: true,
      editable: false,
      render: (text: string, record: any) => {
        return <Dropdown overlay={(
          <Menu>
            <Menu.Item key={"edit"}>
              <a style={{fontSize: "small"}} onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                showNoticeInfo(record?.id)
              }}>
                编 辑
              </a>
            </Menu.Item>
            <Menu.Item key={"delete"}>
              <a style={{fontSize: "small"}} onClick={() => {
                // @ts-ignore
                deleteSubmit([record.id])
              }}>
                删 除
              </a>
            </Menu.Item>
          </Menu>
        )} trigger={['click']} placement="bottomCenter" arrow={true}>
          <Button size={"small"} style={{fontSize: "small"}} onClick={e => e.preventDefault()}>操
            作 <DownOutlined/></Button>
        </Dropdown>;
      }
    },
  ];

  /**
   * 富文本编辑器内容
   */
  const [editValue, setEditValue] = useState();
  /**
   * 获取公告详情
   * @param id 公告ID
   */
  const [noticeLoading, setNoticeLoading] = useState(false);
  const showNoticeInfo = (id: number) => {
    setNoticeLoading(true);
    setIsModalVisible(true);
    getNoticeInfo({id: id}).then((r) => {
      setNoticeLoading(false);
      if (r?.code == 200) {
        // @ts-ignore
        r.data.content = BraftEditor.createEditorState(r?.data?.content);
        form.setFieldsValue(r?.data);
      } else {
        message.error(r?.message || "获取数据失败").then();
      }
    });
  }
  return (
    <PageContainer title={false}>
      <Drawer key={"form"} destroyOnClose={true} forceRender={true}
              width={"100%"}
              title={form.getFieldValue("id") == undefined ? "新 建" : "编 辑"}
              visible={isModalVisible} onClose={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}>
        <Spin spinning={noticeLoading}>
          <div style={{display: !noticeLoading ? "block" : "none"}}>
            <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 2}}
                  wrapperCol={{span: 21}}>
              <Form.Item name="id" label="ID" hidden={true}>
                <Input placeholder="请输入ID"/>
              </Form.Item>
              <Form.Item name="title" label="标题" rules={[{required: true}]}>
                <Input placeholder="请输入标题" style={{maxWidth: "500px"}}/>
              </Form.Item>
              <Form.Item name="place" label="位置" rules={[{required: true}]}>
                <Select placeholder="请输入显示位置" style={{maxWidth: "500px"}}>
                  <Select.Option value="index">系统首页</Select.Option>
                  <Select.Option value="shop">用户商城</Select.Option>
                  <Select.Option value="admin">分站后台</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="sort" label="排序" rules={[{required: true}]}>
                <InputNumber placeholder="请输入排序数值" style={{maxWidth: "500px", minWidth: "150px"}}/>
              </Form.Item>
              <Form.Item name="status" label="状态" rules={[{required: true}]}>
                <Select placeholder="请选择公告状态" style={{maxWidth: "500px"}}>
                  <Select.Option value={0}>显示</Select.Option>
                  <Select.Option value={1}>隐藏</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="content" label="内容" rules={[{required: true}]}>
                <
                  // @ts-ignore
                  BraftEditor
                  onChange={(editorState: any) => {
                    setEditValue(editorState.toHTML());
                  }}
                  media={{
                    uploadFn: async (param) => {
                      const formData = new FormData();
                      formData.append('file', param.file);
                      const res = await uploadFile(formData);
                      if (res?.code == 200) {
                        param.success({
                          meta: {
                            alt: param?.file?.name || "",
                            autoPlay: false,
                            controls: false,
                            id: res?.data || "",
                            loop: false,
                            poster: param?.file?.name || "",
                            title: param?.file?.name || ""
                          }, url: res?.data || ""
                        });
                      } else {
                        param.error({msg: "上传文件失败"});
                      }
                    }
                  }}
                  className="my-editor"
                  style={{border: "1px solid #d1d1d1", borderRadius: "5px"}}
                  // @ts-ignore
                  placeholder="请输入通知内容"
                />
              </Form.Item>
              <Form.Item style={{textAlign: "center"}}>
                <Button type="primary" htmlType="submit">
                  确认
                </Button>
                <Button htmlType="button" onClick={() => {
                  form.resetFields();
                }} style={{marginLeft: "10px"}}>
                  重置
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Spin>

      </Drawer>

      <Modal key={"edit"} width={350} destroyOnClose={true} forceRender={true} title="批量编辑"
             visible={isModalEditVisible}
             onOk={edit.submit} okText={"确 认"} onCancel={() => {
        setIsModalEditVisible(false);
        edit.resetFields();
      }}>
        <Form form={edit} name="control-hooks" onFinish={onEditFinish} labelAlign="right" labelCol={{span: 6}}
              wrapperCol={{span: 16}}>
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择公告状态">
              <Select.Option value={0}>显示</Select.Option>
              <Select.Option value={1}>隐藏</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ProTable
        // @ts-ignore
        columns={columns}
        defaultSize={"small"}
        form={{layout: "vertical", autoFocusFirstInput: false}}
        headerTitle={'通知列表'}
        actionRef={actionRef}
        formRef={ref}
        scroll={{x: "auto"}}
        rowKey={'id'}
        options={{
          density: true,
          fullScreen: true,
          setting: true,
        }}

        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
          onChange: (_, selectedRows: any) => {
            setSelectedRows(selectedRows);
          },
        }}
        request={async (params, sort) => {
          const data = await getNoticeList(getParams(params, sort));
          return {
            data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
            success: data.code === 200,
            total: data.data.total,
          };
        }}
        search={{
          defaultCollapsed: true,
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => {
            setIsModalVisible(true)
          }}>
            新建
          </Button>,
        ]}/>
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择&nbsp;&nbsp;<a style={{fontWeight: 600}}>{selectedRowsState.length}</a>&nbsp;&nbsp;项
            </div>
          }>
          <Button danger={true} onClick={modalDelete}>
            批量删除
          </Button>
          <Button type="primary"
                  onClick={async () => {
                    setIsModalEditVisible(true);
                  }}>
            批量编辑
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};
