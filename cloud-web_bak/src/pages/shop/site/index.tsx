import React, {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import ProCard from "@ant-design/pro-card";
import {Button, Form, Image, Input, message, Modal, Select, Typography} from "antd";
import styles from './style.less';
import {ExclamationCircleOutlined, WechatOutlined} from "@ant-design/icons";
import {buySite, getSite} from "@/services/shop/site";
import {getPayConfig} from "@/services/pay/pay";
import {useModel} from "@@/plugin-model/useModel";
import {checkMobile, isAppleDevice} from "@/util/device";
import {setPayJumpUrl} from "@/util/pay";


export default (): React.ReactNode => {
  /**
   * 初始化
   */
  const [loading, setLoading] = useState(true);
  const {initialState} = useModel('@@initialState');
  // @ts-ignore
  const {currentUser} = initialState;
  const [siteConfig, setSiteConfig] = useState({});
  const [payConfig, setPayConfig] = useState({});
  useEffect(() => {
    setLoading(true);
    getSite().then((r) => {
      if (r?.code == 200) {
        setSiteConfig(r?.data);
        getPayConfig().then((r2) => {
          if (r2?.code == 200) {
            setPayConfig(r2?.data);
            setLoading(false);
          }
        });
      }
    });
  }, []);
  /**
   * 开通网站表单
   */
  const [add] = Form.useForm();//表单
  const [isModalAddWebVisible, setIsModalAddWebVisible] = useState(false);//弹窗
  const [isModalAddWebBtnLoading, setIsModalAddWebBtnLoading] = useState(false);//按钮
  const onAddFormFinish = async (values: any) => {
    setIsModalAddWebVisible(false);
    const url = values.prefix + '.' + values.domain;
    Modal.confirm({
      title: '确定要开通主站吗?',
      icon: <ExclamationCircleOutlined/>,
      content: (<>请牢记您的域名：<Typography.Text
        copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
      okType: 'primary',
      onOk() {
        setIsModalAddWebBtnLoading(true);
        return buySite(values).then((r) => {
          setIsModalAddWebBtnLoading(false);
          if (r.code != 200) {
            message.error(r.message || "请求失败").then()
          } else {
            setIsModalAddWebVisible(false);
            add.resetFields();
            message.success(r.message).then();
            //支付成功
            if (r.code == 200 && values.type == 3) {
              Modal.confirm({
                title: '开通成功,请点击确认访问您的网站',
                icon: <ExclamationCircleOutlined/>,
                content: (<>您的网站域名：<Typography.Text
                  copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>),
                async onOk() {
                  window.location.href = location.protocol + '//' + url
                },
              });
            } else {
              setPayJumpUrl();
              if (checkMobile() || isAppleDevice()) {
                window.location.href = r.data;
              } else {
                window.open(r.data);
              }
              Modal.confirm({
                title: '订单是否已支付成功?',
                icon: <ExclamationCircleOutlined/>,
                content: <>如支付成功请点击确认访问您的网站，域名：<Typography.Text
                  copyable={{tooltips: ['复制', '复制成功']}}>{url}</Typography.Text></>,
                async onOk() {
                  window.location.href = location.protocol + '//' + url
                },
              });
            }
          }
        });
      },
    });
  }

  return (
    <PageContainer title={false} loading={loading}>
      <Modal key={"add_web"} width={400} destroyOnClose={true} okButtonProps={{loading: isModalAddWebBtnLoading}}
             forceRender={true} title="开通网站"
             visible={isModalAddWebVisible}
             onOk={add.submit} okText={'开通'} onCancel={() => {
        setIsModalAddWebVisible(false);
        add.resetFields();
      }}>
        <Form form={add} name="control-hooks" onFinish={onAddFormFinish} labelAlign="right" labelCol={{span: 6}}
              wrapperCol={{span: 16}}>
          <Form.Item name="name" label="网站名称" rules={[{required: true, message: "请输入网站名称"}]}>
            <Input placeholder="请输入网站名称"/>
          </Form.Item>
          <Form.Item label="绑定域名">
            <Input.Group>
              <Form.Item
                name="prefix"
                noStyle
                rules={[{required: true, message: '请输入前缀'}]}
              >
                <Input style={{width: '45%'}} placeholder="请输入前缀"/>
              </Form.Item>
              <Form.Item
                name="domain"
                noStyle
                rules={[{required: true, message: '请选择后缀'}]}
              >
                <Select placeholder="请选择后缀" style={{width: '55%'}}>
                  {siteConfig?.['master.domains']?.map((k: any) => {
                    return <Select.Option key={"domain_" + k} value={k}>.{k}</Select.Option>
                  })}
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item name="type" label="支付方式" rules={[{required: true, message: "请选择支付方式"}]}>
            <Select placeholder="请选择支付方式">
              <Select.Option value={3}>余额支付(余额:￥{parseFloat(currentUser?.money).toFixed(2)})</Select.Option>
              {payConfig?.['pay.qqpay.type'] && <Select.Option value={2}>QQ支付</Select.Option>}
              {payConfig?.['pay.wxpay.type'] && <Select.Option value={1}>微信支付</Select.Option>}
              {payConfig?.['pay.alipay.type'] && <Select.Option value={0}>支付宝支付</Select.Option>}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <ProCard>
        <div className={styles.mainTitle}>
          <div className={styles.topTitle}>合作加盟，专享超值权益</div>
        </div>
        <div className={styles.main}>
          <div className={styles.body}>
            <div className={styles.cardTitle}>
              <div className={styles.topTitle}>尊享主站</div>
              <div className={styles.bottomTitle}>专享特权，享受更多权益，独立站长后台</div>
            </div>
            <ProCard className={styles.cardBody}>
              <div className={styles.box}>
                <div className={styles.top}>
                  <div className={styles.tips}>
                    尊享主站限时低价开通
                  </div>
                  <div style={{padding: "15px 15px 0 15px"}}>
                    <div style={{lineHeight: "60px", height: "45px", overflow: "hidden"}}>
                      <div style={{float: "left"}}>
                        <span style={{
                          color: "rgb(188 115 0)",
                          fontSize: "30px",
                          fontWeight: "bolder"
                        }}>￥{parseInt(siteConfig?.['site.price'])}</span>
                        <span style={{
                          color: "#999",
                          fontSize: "12px"
                        }}>/{parseInt(siteConfig?.['site.month'])}月&nbsp;&nbsp;&nbsp;&nbsp;</span>
                      </div>
                      <div style={{float: "right"}}>
                        <span style={{color: "#999", fontSize: "12px"}}>原价:</span>
                        <span style={{
                          color: "#999",
                          fontSize: "16px",
                          fontWeight: "bolder",
                          textDecoration: "line-through"
                        }}>￥{parseInt(siteConfig?.['site.price']) * 8.5}</span>
                        <span style={{color: "#999", fontSize: "12px"}}>/年</span>
                      </div>
                    </div>
                    <div style={{lineHeight: "30px", height: "30px"}}>
                      <span style={{color: "#999", fontSize: "12px"}}>开通主站享受更多权益</span>
                    </div>
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.left}>
                    <span style={{color: "#999", fontSize: "12px"}}>合计</span>
                    <span style={{
                      color: "#666",
                      fontSize: "15px",
                      fontWeight: "bolder"
                    }}>￥{parseInt(siteConfig?.['site.price'])}</span>
                  </div>
                  <div className={styles.right} style={{fontSize: "13px"}}>
                    <a style={{color: "#0786ff"}} onClick={() => {
                      Modal.info({
                        title: '请联系销售咨询详情',
                        content: (<>联系方式：<Typography.Text
                          copyable={{tooltips: ['复制', '复制成功']}}>{siteConfig?.['contact.one']}</Typography.Text></>),
                      });
                    }}><WechatOutlined/> 咨询详情</a>
                  </div>
                </div>
              </div>
              <Button className={styles.button} type="primary" size={"large"} onClick={() => {
                add?.setFieldsValue({domain: siteConfig?.['master.domains']?.[0], type: 3});
                setIsModalAddWebVisible(true);
              }}>
                立即支付￥{parseInt(siteConfig?.['site.price'])}开通主站
              </Button>
            </ProCard>
          </div>
        </div>
        <div className={styles.describe}>
          <div style={{textAlign: "center", margin: "20px"}}>
            <span style={{fontWeight: "bolder", fontSize: "30px", color: "#575757"}}>权益详情</span>
          </div>
          <div className={styles.contain}>
            <div className={styles.table}>
              <div className={styles.thead}>
                <div className={styles.tr}>
                  <div className={styles.th}>
                    权益说明
                  </div>
                  <div className={styles.th}>
                    个人用户
                  </div>
                  <div className={styles.th}>
                    平台站长
                  </div>
                </div>
              </div>
              <div className={styles.tbody}>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <div style={{float: "left", lineHeight: "50px"}}>
                      <Image style={{width: "40px", height: "40px"}}
                             src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-lingquqiye.98ec47ee.svg"}
                             preview={false}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px", lineHeight: "30px", textAlign: "left"}}>
                      <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                        独立后台
                      </div>
                      <div style={{fontSize: "10px", color: "#929292"}}>
                        尊享主站享有独立后台
                      </div>
                    </div>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                      preview={false}/>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                      preview={false}/>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <div style={{float: "left", lineHeight: "50px"}}>
                      <Image style={{width: "40px", height: "40px"}}
                             src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_seemore.d9ef3871.svg"}
                             preview={false}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px", lineHeight: "30px", textAlign: "left"}}>
                      <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                        发展下级
                      </div>
                      <div style={{fontSize: "10px", color: "#929292"}}>
                        主站可推广网站发展更多用户
                      </div>
                    </div>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                      preview={false}/>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                      preview={false}/>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <div style={{float: "left", lineHeight: "50px"}}>
                      <Image style={{width: "40px", height: "40px"}}
                             src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-gengduochaxun.fd9fd3c5.svg"}
                             preview={false}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px", lineHeight: "30px", textAlign: "left"}}>
                      <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                        低价货源
                      </div>
                      <div style={{fontSize: "10px", color: "#929292"}}>
                        享有更加低价的商品货源
                      </div>
                    </div>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                      preview={false}/>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                      preview={false}/>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <div style={{float: "left", lineHeight: "50px"}}>
                      <Image style={{width: "40px", height: "40px"}}
                             src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-piliangchaxun.1e177671.svg"}
                             preview={false}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px", lineHeight: "30px", textAlign: "left"}}>
                      <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                        销售提成
                      </div>
                      <div style={{fontSize: "10px", color: "#929292"}}>
                        下级站点消费分润拥有{parseInt(siteConfig?.['site.order.deduct'])}%返利
                      </div>
                    </div>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                      preview={false}/>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                      preview={false}/>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <div style={{float: "left", lineHeight: "50px"}}>
                      <Image style={{width: "40px", height: "40px"}}
                             src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-vipshaixuan.eee01296.svg"}
                             preview={false}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px", lineHeight: "30px", textAlign: "left"}}>
                      <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                        数据统计
                      </div>
                      <div style={{fontSize: "10px", color: "#929292"}}>
                        专属后台,数据统计一目了然
                      </div>
                    </div>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                      preview={false}/>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                      preview={false}/>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <div style={{float: "left", lineHeight: "50px"}}>
                      <Image style={{width: "40px", height: "40px"}}
                             src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_quickchoose.187d2dd6.svg"}
                             preview={false}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px", lineHeight: "30px", textAlign: "left"}}>
                      <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                        更多权限
                      </div>
                      <div style={{fontSize: "10px", color: "#929292"}}>
                        激活更多权益,享受更多服务
                      </div>
                    </div>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                      preview={false}/>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                      preview={false}/>
                  </div>
                </div>
                <div className={styles.tr}>
                  <div className={styles.td}>
                    <div style={{float: "left", lineHeight: "50px"}}>
                      <Image style={{width: "40px", height: "40px"}}
                             src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip-gengduolianxi.3f0caf8e.svg"}
                             preview={false}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px", lineHeight: "30px", textAlign: "left"}}>
                      <div style={{fontSize: "15px", fontWeight: "bolder", color: "#5c5c5c"}}>
                        专属客服
                      </div>
                      <div style={{fontSize: "10px", color: "#929292"}}>
                        一对一专属客服售后指导
                      </div>
                    </div>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/free_false.de1b8191.svg"}
                      preview={false}/>
                  </div>
                  <div className={styles.td}>
                    <Image
                      src={"https://cdn2.weimob.com/static/saas-xk-pc-web-stc/sell-crm/online/xk/static/vip_true.5aecacef.svg"}
                      preview={false}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProCard>
    </PageContainer>
  );
};
