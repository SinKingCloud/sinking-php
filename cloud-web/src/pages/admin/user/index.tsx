import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {getParams} from "@/util/page";
import {Avatar, Button, Dropdown, Form, Input, Menu, message, Modal, Select, Tag, Typography, Upload} from "antd";
import {getUserList, updateUserInfo, updateUserMoney} from "@/services/admin/user";
import {DownOutlined, ExclamationCircleOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {getUploadUrl} from "@/services/common/upload";
import {useModel} from "@@/plugin-model/useModel";
import {getPayLog} from "@/services/admin/pay";
import {getLogList} from "@/services/admin/log";

export default (): React.ReactNode => {
  /**
   * 表单处理
   */
  const actionRef = useRef();
  const ref = useRef();

  /**
   * 图片上传
   */
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadFileList, setUploadFileList] = useState();
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传图片格式文件');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不能大于2MB');
      return;
    }
    return isJpgOrPng && isLt2M;
  }
  const handleChange = (info: any) => {
    setUploadFileList(info.fileList);
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setUploadLoading(false);
      const response = info.file.response;
      if (response?.code != 200) {
        message.error(response?.message || "上传文件错误")
      } else {
        info.file.url = info.file.response.data;
        setUploadFileList(info.fileList);
      }
      return;
    }
  };

  /**
   * 用户编辑表单
   */
  const [form] = Form.useForm();//编辑用户表单
  const [isModalVisible, setIsModalVisible] = useState(false);//编辑用户弹窗
  const [isModalBtnLoading, setIsModalBtnLoading] = useState(false);//编辑用户弹窗按钮
  const onFormFinish = async (values: any) => {
    setIsModalBtnLoading(true);
    values.ids = [values.id];
    delete values.id;
    // @ts-ignore
    if (uploadFileList?.length > 0) {
      // @ts-ignore
      values.avatar = uploadFileList[0]?.url || ""
    } else {
      values.avatar = ""
    }
    return updateUserInfo(values).then((r) => {
      setIsModalBtnLoading(false);
      setIsModalVisible(false);
      if (r.code != 200) {
        message.error(r.message || "请求失败").then()
      } else {
        // @ts-ignore
        actionRef.current.reload()
        form.resetFields();
        message.success(r.message).then()
      }
    });
  }

  /**
   * 余额明细
   */
  const [isModalPayVisible, setIsModalPayVisible] = useState(false);//编辑弹窗
  const [payUserId, setPayUserId] = useState(0);//编辑弹窗
  const payActionRef = useRef();
  const payRef = useRef();
  const payColumns = [
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
  ];

  /**
   * 余额调整表单
   */
  const [money] = Form.useForm();//余额调整表单
  const [isModalMoneyVisible, setIsModalMoneyVisible] = useState(false);//余额调整弹窗
  const [isModalMoneyBtnLoading, setIsModalMoneyBtnLoading] = useState(false);//余额调整弹窗按钮
  const onMoneyFinish = async (values: any) => {
    setIsModalMoneyBtnLoading(true)
    return updateUserMoney(values).then((r) => {
      setIsModalMoneyBtnLoading(false);
      setIsModalMoneyVisible(false);
      if (r.code != 200) {
        message.error(r.message || "请求失败").then()
      } else {
        // @ts-ignore
        actionRef.current.reload()
        form.resetFields();
        message.success(r.message).then()
      }
    });
  }

  /**
   * 日志信息
   */
  const [isModalLogVisible, setIsModalLogVisible] = useState(false);//编辑弹窗
  const [logUserId, setLogUserId] = useState(0);//编辑弹窗
  const logActionRef = useRef();
  const logRef = useRef();
  const logColumns = [
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
  ];

  /**
   * 修改用户状态
   * @param user_id 用户ID
   * @param status 状态
   */
  const changeUserStatus = (user_id: string, status: number) => {
    Modal.confirm({
      title: '确定要' + (status == 0 ? "恢复" : "封禁") + '用户吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '您的操作将会立即生效',
      okType: 'primary',
      onOk() {
        const key = "userStatus";
        message.loading({content: '正在更改用户状态', key, duration: 60}).then();
        updateUserInfo({ids: [user_id], status: status}).then((r: any) => {
          if (r?.code == 200) {
            // @ts-ignore
            actionRef?.current.reload();
            message.success({content: r?.message, key, duration: 2}).then();
          } else {
            message.error({content: r?.message, key, duration: 2}).then();
          }
        });
      },
    });
  };

  const {initialState,} = useModel('@@initialState');
  // @ts-ignore
  const {currentUser} = initialState;

  /**
   * table表格渲染
   */
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '用户ID',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '头像',
      tip: '用户头像',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Avatar src={record?.avatar}
                  style={{backgroundColor: "green"}}>{record?.nick_name || record?.account}</Avatar>
        </>;
      }
    },
    {
      title: '昵称',
      tip: '用户昵称',
      dataIndex: 'nick_name',
      hideInSearch: true,
    },
    {
      title: '账号信息',
      dataIndex: 'account_info',
      tip: '账户身份',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>邮箱:<Typography.Text copyable>{record?.email || "未设置"}</Typography.Text></Tag>
          <br/>
          <Tag>账号:<Typography.Text copyable>{record?.account || "未设置"}</Typography.Text></Tag>
          <br/>
          <Tag>手机:<Typography.Text copyable>{record?.phone || "未设置"}</Typography.Text></Tag>
        </>;
      }
    },
    {
      title: '账号',
      dataIndex: 'account',
      tip: '用户账号',
      hideInTable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      tip: '绑定邮箱',
      hideInTable: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      tip: '绑定手机',
      hideInTable: true,
    },
    {
      title: '余额',
      dataIndex: 'money',
      tip: '账户余额',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return parseFloat(record?.money || 0).toFixed(2) + "元"
      }
    },
    {
      title: '登陆信息',
      dataIndex: 'login_info',
      tip: '登录信息',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>时间:<Typography.Text copyable>{record?.login_time || "未登录"}</Typography.Text></Tag>
          <br/>
          <Tag>IP:<Typography.Text copyable>{record?.login_ip || "未登录"}</Typography.Text></Tag>
        </>;
      }
    },
    {
      title: '登陆IP',
      dataIndex: 'login_ip',
      tip: '上次登录IP',
      copyable: true,
      hideInTable: true,
    },
    {
      title: '登陆时间',
      valueType: 'dateTimeRange',
      dataIndex: 'login_time',
      tip: '上次登陆时间',
      hideInTable: true,
      search: {
        transform: (value: any) => {
          return {
            login_time_start: value[0],
            login_time_end: value[1],
          };
        },
      },
    },
    {
      title: '相关时间',
      dataIndex: 'user_time',
      tip: '用户相关日期',
      hideInSearch: true,
      render: (text: string, record: any) => {
        return <>
          <Tag>注册时间:<Typography.Text copyable>{record?.create_time || "未登录"}</Typography.Text></Tag>
          <br/>
          <Tag>修改时间:<Typography.Text copyable>{record?.update_time || "未登录"}</Typography.Text></Tag>
        </>;
      }
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
      title: '注册时间',
      valueType: 'dateTimeRange',
      dataIndex: 'create_time',
      tip: '用户注册时间',
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
      title: '账号状态',
      dataIndex: 'status',
      tip: '用户状态',
      sorter: true,
      valueEnum: {
        0: {
          text: '正常',
          status: 'success',
        },
        1: {
          text: '封禁',
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
        return <Dropdown overlay={<Menu>
          <Menu.Item key={"edit_modal"}>
            <a style={{fontSize: "small"}} onClick={() => {
              form.setFieldsValue(record);
              if (record?.avatar) {
                // @ts-ignore
                setUploadFileList([{uid: '-1', name: 'image.png', status: 'done', url: record?.avatar}]);
              }
              setIsModalVisible(true);
            }}>
              编 辑
            </a>
          </Menu.Item>
          <Menu.Item key={"money_modal"}>
            <a style={{fontSize: "small"}} onClick={() => {
              money?.setFieldsValue({user_id: record?.id, type: 0});
              setIsModalMoneyVisible(true);
            }}>
              余 额
            </a>
          </Menu.Item>
          <Menu.Item key={"pay"}>
            <a style={{fontSize: "small"}} onClick={() => {
              setPayUserId(record?.id || 0)
              setIsModalPayVisible(true);
            }}>
              明 细
            </a>
          </Menu.Item>
          <Menu.Item key={"log"}>
            <a style={{fontSize: "small"}} onClick={() => {
              setLogUserId(record?.id || 0)
              setIsModalLogVisible(true);
            }}>
              日 志
            </a>
          </Menu.Item>
          <Menu.Item key={"status"}>
            <a style={{fontSize: "small"}} onClick={() => {
              changeUserStatus(record?.id, record?.status == 0 ? 1 : 0);
            }}>
              {record?.status == 0 ? '封 禁' : '恢 复'}
            </a>
          </Menu.Item>
        </Menu>} trigger={['click']} placement="bottomCenter" arrow={true}>
          <Button size={"small"} hidden={record?.id == currentUser?.id} style={{fontSize: "small"}}
                  onClick={e => e.preventDefault()}>操
            作 <DownOutlined/></Button>
        </Dropdown>;
      }
    },
  ];

  return (
    <PageContainer title={false}>
      <Modal key={"form"} destroyOnClose={true} forceRender={true}
             title={"编 辑"}
             visible={isModalVisible} onOk={form.submit} okButtonProps={{loading: isModalBtnLoading}} okText={"确 认"}
             onCancel={() => {
               // @ts-ignore
               setUploadFileList([]);
               setIsModalVisible(false);
               form.resetFields();
             }}>
        <Form form={form} name="control-hooks" onFinish={onFormFinish} labelAlign="right" labelCol={{span: 4}}
              wrapperCol={{span: 18}}>
          <Form.Item name={"id"} label="ID" hidden={true}>
            <Input placeholder="请输入ID"/>
          </Form.Item>
          <Form.Item name={"avatar"} label="头像">
            <Upload
              name="file"
              listType="picture-card"
              className="avatar-uploader"
              fileList={uploadFileList}
              showUploadList={true}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              action={getUploadUrl()}
              maxCount={1}
              onPreview={(file) => {
                // @ts-ignore
                if (file?.url) {
                  window.open(file?.url);
                  return;
                }
                // @ts-ignore
                window.open(file?.response.data.url);
              }}
            >
              <div>
                {uploadLoading ? <LoadingOutlined/> : <PlusOutlined/>}
                <div style={{marginTop: 8}}>上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item name={"status"} label="状态" rules={[{required: true}]}>
            <Select placeholder="请选择用户状态">
              <Select.Option value={0}>正常</Select.Option>
              <Select.Option value={1}>禁止</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={"password"} label="密码">
            <Input placeholder="不修改则留空"/>
          </Form.Item>
          <Form.Item name={"nick_name"} label="昵称">
            <Input placeholder="请输入用户昵称"/>
          </Form.Item>
        </Form>
      </Modal>

      <Modal key={"pay"} destroyOnClose={true} forceRender={true}
             title={"余额明细"}
             visible={isModalPayVisible} onOk={() => {
        money?.setFieldsValue({user_id: payUserId, type: 0});
        setIsModalMoneyVisible(true);
      }}
             okText={"加款"}
             onCancel={() => {
               setIsModalPayVisible(false);
             }} bodyStyle={{padding: "0px"}} width={700}>
        {isModalPayVisible && (
          <ProTable
            defaultSize={"small"}
            form={{layout: "vertical"}}
            headerTitle={false}
            actionRef={payActionRef}
            formRef={payRef}
            scroll={{x: "auto"}}
            rowKey={'id'}
            options={false}
            // @ts-ignore
            columns={payColumns}
            request={async (params, sort) => {
              params.user_id = payUserId;
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
            pagination={{defaultPageSize: 5}}
            search={false}
          />
        )}
      </Modal>

      <Modal key={"log"} destroyOnClose={true} forceRender={true}
             title={"操作日志"}
             visible={isModalLogVisible}
             footer={null}
             onCancel={() => {
               setIsModalLogVisible(false);
             }} bodyStyle={{padding: "0px"}} width={700}>
        {isModalLogVisible && (
          <ProTable
            defaultSize={"small"}
            form={{layout: "vertical"}}
            headerTitle={false}
            actionRef={logActionRef}
            formRef={logRef}
            scroll={{x: "auto"}}
            rowKey={'id'}
            options={false}
            // @ts-ignore
            columns={logColumns}
            request={async (params, sort) => {
              params.user_id = logUserId;
              const data = await getLogList(getParams(params, sort));
              if (data.code != 200) {
                message.error(data.message);
              }
              return {
                data: data.data.list === undefined || data.data.list === null || data.data.list.length <= 0 ? [] : data.data.list,
                success: data.code === 200,
                total: data.data.total,
              };
            }}
            pagination={{defaultPageSize: 5}}
            search={false}
          />
        )}
      </Modal>

      <Modal key={"money"} width={350} destroyOnClose={true} okButtonProps={{loading: isModalMoneyBtnLoading}}
             forceRender={true} title="用户加款"
             visible={isModalMoneyVisible}
             onOk={money.submit} okText={"确 认"} onCancel={() => {
        setIsModalMoneyVisible(false);
        money.resetFields();
      }}>
        <Form form={money} name="control-hooks" onFinish={onMoneyFinish} labelAlign="right" labelCol={{span: 6}}
              wrapperCol={{span: 16}}>
          <Form.Item name={"user_id"} label="用户ID" hidden={true} rules={[{required: true, message: "请输入操作金额"}, {
            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
            message: "请输入正确的用户ID"
          }]}>
            <Input placeholder="请输入用户ID"/>
          </Form.Item>
          <Form.Item name={"type"} label="类型" rules={[{required: true, message: "请选择操作类型"}]}>
            <Select placeholder="请选择操作类型">
              <Select.Option value={0}>充值</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={"money"} label="金额" rules={[{required: true, message: "请输入操作金额"}, {
            pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
            message: "请输入正确的金额"
          }]}>
            <Input placeholder="请输入操作金额"/>
          </Form.Item>
          <Form.Item name={"remark"} label="备注">
            <Input.TextArea placeholder="请输入用户备注(选填)"/>
          </Form.Item>
        </Form>
      </Modal>

      <ProTable
        defaultSize={"small"}
        form={{layout: "vertical", autoFocusFirstInput: false}}
        headerTitle={'用户列表'}
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
          const data = await getUserList(getParams(params, sort));
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
