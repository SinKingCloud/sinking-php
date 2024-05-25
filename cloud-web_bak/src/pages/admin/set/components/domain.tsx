import React, {useEffect, useRef, useState} from 'react';
import {createDomain, deleteDomain, getDomainConfig, getDomainList, updateDomain} from "@/services/admin/web";
import {Alert, Button, Dropdown, Form, Input, Menu, message, Modal, Select} from "antd";
import {DownOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import ProTable from "@ant-design/pro-table";
import {getParams} from "@/util/page";
// @ts-ignore
import {useModel} from "@@/plugin-model/useModel";

const DomainView: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  // @ts-ignore
  const {currentUser} = initialState;
  /**
   * 域名编辑表单
   */
  const [domainConfig, setDomainConfig] = useState({});
  useEffect(() => {
    getDomainConfig().then((r) => {
      if (r?.code == 200) {
        setDomainConfig(r?.data);
      }
    });
  }, []);
  const domainActionRef = useRef();
  const domainRef = useRef();
  const deleteDomains = (ids: [number], web_id: number) => {
    Modal.confirm({
      title: '确定要删除此域名吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '删除后此域名则不可访问',
      okType: 'danger',
      onOk() {
        const key = "deleteDomains";
        message.loading({content: '正在删除域名', key, duration: 60}).then();
        deleteDomain({ids: ids, web_id: web_id}).then((r) => {
          if (r?.code == 200) {
            // @ts-ignore
            domainActionRef?.current?.reload();
            message.success({content: r?.message, key, duration: 2}).then();
          } else {
            message.error({content: r?.message, key, duration: 2}).then();
          }
        });
      },
    });
  }
  const changeDomainStatus = (ids: [number], web_id: number, status: number) => {
    Modal.confirm({
      title: '确定要' + (status == 0 ? "恢复" : "封禁") + '此域名吗?',
      icon: <ExclamationCircleOutlined/>,
      content: '此操作将会影响此域名的访问',
      okType: 'primary',
      onOk() {
        const key = "changeDomainStatus";
        message.loading({content: '正在更改域名状态', key, duration: 60}).then();
        updateDomain({web_id: web_id, ids: ids, status: status}).then((r: any) => {
          if (r?.code == 200) {
            // @ts-ignore
            domainActionRef?.current.reload();
            message.success({content: r?.message, key, duration: 2}).then();
          } else {
            message.error({content: r?.message, key, duration: 2}).then();
          }
        });
      },
    });
  };
  const domainColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: '用户ID',
      hideInTable: true,
    },
    {
      title: '域名',
      dataIndex: 'domain',
      tip: '域名',
      copyable: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      tip: '域名类型',
      valueEnum: {
        0: {
          text: '系统',
        },
        1: {
          text: '自定义',
        },
      },
    },
    {
      title: '域名状态',
      dataIndex: 'status',
      tip: '域名状态',
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
          <Menu.Item key={"delete_domain"}>
            <a style={{fontSize: "small"}} onClick={() => {
              if (record?.type == 0) {
                message.error("系统域名不可操作");
                return;
              }
              deleteDomains([record?.id], record?.web_id);
            }}>
              删除
            </a>
          </Menu.Item>
          <Menu.Item key={"status_domain"}>
            <a style={{fontSize: "small"}} onClick={() => {
              if (record?.type == 0) {
                message.error("系统域名不可操作");
                return;
              }
              changeDomainStatus([record?.id], record?.web_id, record?.status == 0 ? 1 : 0);
            }}>
              {record?.status == 0 ? '封禁' : '恢复'}
            </a>
          </Menu.Item>
        </Menu>} trigger={['click']} placement="bottomCenter" arrow={true}>
          <Button size={"small"} style={{fontSize: "small"}}
                  onClick={e => e.preventDefault()}>操
            作 <DownOutlined/></Button>
        </Dropdown>;
      }
    },
  ];
  const [domainAdd] = Form.useForm();//编辑用户表单
  const [isModalDomainAddVisible, setIsModalDomainAddVisible] = useState(false);//编辑弹窗
  const [isModalDomainAddBtnLoading, setIsModalDomainAddBtnLoading] = useState(false);//编辑弹窗按钮
  const onDomainAddFormFinish = async (values: any) => {
    values.web_id = currentUser?.web_id;
    setIsModalDomainAddBtnLoading(true);
    return createDomain(values).then((r) => {
      setIsModalDomainAddBtnLoading(false);
      if (r.code != 200) {
        message.error(r.message || "请求失败").then()
      } else {
        domainAdd.resetFields();
        setIsModalDomainAddVisible(false);
        // @ts-ignore
        domainActionRef.current.reload();
        message.success(r.message).then()
      }
    });
  }
  return (
    <div>
      <ProTable
        defaultSize={"small"}
        form={{layout: "vertical"}}
        headerTitle={'额度:' + domainConfig['master.domain.num']+'个'}
        actionRef={domainActionRef}
        formRef={domainRef}
        scroll={{x: "auto"}}
        rowKey={'id'}
        // @ts-ignore
        columns={domainColumns}
        request={async (params, sort) => {
          params.web_id = currentUser?.web_id;
          const data = await getDomainList(getParams(params, sort));
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
        toolBarRender={() => [
          <Button key="primary" size={"small"} type="primary" onClick={() => {
            setIsModalDomainAddVisible(true)
          }}>
            添加
          </Button>,
        ]}
      />
      <Modal key={"domain_add"} width={350} destroyOnClose={true} forceRender={true}
             title={"添加"}
             visible={isModalDomainAddVisible} onOk={domainAdd.submit}
             okButtonProps={{loading: isModalDomainAddBtnLoading}}
             okText={"确 认"}
             onCancel={() => {
               setIsModalDomainAddVisible(false);
             }}>
        <Alert
          message={"您需要把域名解析至:" + domainConfig['master.domain.resolve']}
          type="info" showIcon style={{marginBottom: "20px"}}/>
        <Form form={domainAdd} name="control-hooks" onFinish={onDomainAddFormFinish} labelAlign="right"
              labelCol={{span: 4}}
              wrapperCol={{span: 20}}>
          <Form.Item name={"domain"} label="域名" rules={[{
            required: true,
            message: "请输入域名"
          }, {
            pattern: /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][--a-zA-Z0-9]{0,62})+\.?/,
            message: "请输入正确的域名"
          },
          ]}>
            <Input placeholder="请输入域名"/>
          </Form.Item>
          <Form.Item name={"status"} label="状态" rules={[{required: true}]}>
            <Select placeholder="请选择域名状态">
              <Select.Option value={0}>正常</Select.Option>
              <Select.Option value={1}>封禁</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default DomainView;
