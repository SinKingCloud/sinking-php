import {LockOutlined, MailOutlined, SafetyCertificateOutlined, UserOutlined} from '@ant-design/icons';
import {Alert, Button, Checkbox, Col, Form, Image, Input, message, Row, Spin, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import Footer from '@/components/Footer';
import styles from './index.less';
// @ts-ignore
import {history, useModel} from "umi";
import {getCaptchaUrl} from "@/services/common/captcha";
import defaultSettings from "../../../../config/defaultSettings";
import {genQrCode, loginByEmail, loginByPwd, loginBySms, qrLogin} from "@/services/user/login";
import {setLoginToken} from "@/util/auth";
import {sendEmail} from "@/services/common/email";
import {checkMobile} from "@/util/device";
// @ts-ignore
import QRCode from "qrcode.react/lib";
import {getRandStr, qqJumpUrl} from "@/util/string";
import {sendSms} from "@/services/common/sms";

const Login: React.FC = () => {
  /**
   * 登陆方式
   */
  const [type, setType] = useState<string>('account');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSendLoading, setIsEmailSendLoading] = useState(false);
  const [isSmsSendLoading, setIsSmsSendLoading] = useState(false);
  const [isRead, setIsRead] = useState(true);
  /**
   * 表单
   */
  const [form] = Form.useForm();
  /**
   * 验证码信息
   */
  const [token, setToken] = useState<string>("");
  const [captchaUrl, setCaptchaUrl] = useState<string>("");
  /**
   * 加载验证码
   */
  const changeCaptcha = () => {
    const cap = getCaptchaUrl();
    setToken(cap.token);
    setCaptchaUrl(cap.url);
    form.setFieldsValue({captcha_code: ""});
  }
  const {initialState, setInitialState} = useModel('@@initialState');
  /**
   * 获取当前用户信息
   */
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    await setInitialState((s: any) => ({
      ...s,
      currentUser: userInfo,
    }));
  };

  const [sendCodeDisabled, setSendCodeDisabled] = useState(false);
  const getCode = (e: any) => {
    let time = 60;
    const timer = setInterval(() => {
      setSendCodeDisabled(true);
      e.target.innerHTML = `${time}秒后重新获取`;
      // eslint-disable-next-line no-plusplus
      time--;
      if (time <= 0) {
        setSendCodeDisabled(false);
        e.target.innerHTML = ' 获取验证码';
        time = 0;
        clearInterval(timer);
      }
    }, 1000);
  };
  /**
   * 扫码登陆
   */
  const [qrcode, setQrcode] = useState("");
  const [qrcodeLoading, setQrcodeLoading] = useState(true);
  const [qrcodeMessage, setQrcodeMessage] = useState("正在生成二维码");
  const queryQrCodeStatus = (id?: string) => {
    if (localStorage.getItem("captcha_id") != id || history.location.pathname != "/user/login") {
      return;
    }
    const device = checkMobile() ? 'mobile' : 'pc';
    qrLogin({captcha_id: id, device: device}).then(async (r) => {
      if (r?.code != 200) {
        if (r?.data?.code == -1) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          getQrCode();
        } else if (r?.data?.code == 0) {
          setTimeout(() => {
            queryQrCodeStatus(id);
          }, 1000)
        }
      } else {
        setQrcodeLoading(true);
        localStorage.removeItem("captcha_id");
        setQrcodeMessage("验证成功,正在登陆");
        setLoginToken(device, r?.data?.token);
        await fetchUserInfo();
        history.push(localStorage.getItem("redirect") || '/');
        localStorage.removeItem("redirect");
        setQrcode("");
        setQrcodeLoading(false);
        message.success(r?.message || "登陆成功,正在跳转");
      }
    });
  }
  const getQrCode = () => {
    const tempToken = getRandStr(32);
    setQrcodeLoading(true);
    setQrcodeMessage("正在生成二维码");
    genQrCode({captcha_id: tempToken}).then((r) => {
      if (r?.code == 200) {
        localStorage.setItem("captcha_id", tempToken);
        setQrcodeLoading(false);
        setQrcode(r?.data);
        setQrcodeMessage("请扫描二维码");
        queryQrCodeStatus(tempToken);
      } else {
        setQrcodeMessage(r?.message || "获取二维码失败");
      }
    });
  }

  /**
   * 初始化数据
   */
  useEffect(() => {
    changeCaptcha();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt='logo' className={styles.logo}
                 src={initialState?.currentWeb?.logo || (process.env.NODE_ENV === 'development' ? '/logo.svg' : "/Public/Web/logo.svg")}/>
            <span style={{
              fontSize: "30px",
              fontWeight: "bolder"
            }}>{initialState?.currentWeb?.name || defaultSettings?.title}</span>
          </div>
          <div className={styles.desc}>
            {initialState?.currentWeb?.name || defaultSettings?.title}欢迎您的使用
          </div>
        </div>
        <div className={styles.main}>
          <Tabs activeKey={type} onChange={(key) => {
            setType(key);
            if (key == "qrcode") {
              getQrCode();
            }
          }}>
            <Tabs.TabPane
              key="account"
              tab='密码登陆'
            />
            {initialState?.currentWeb?.reg_phone && <Tabs.TabPane
              key="phone"
              tab='短信登陆'
            />}
            {initialState?.currentWeb?.reg_qrlogin && <Tabs.TabPane
              key="qrcode"
              tab='扫码登陆'
            />}
            {initialState?.currentWeb?.reg_email && <Tabs.TabPane
              key="email"
              tab='邮箱登陆'
            />}
          </Tabs>
          <Form form={form} onFinish={(values: any) => {
            if (!isRead) {
              message.error("请阅读并同意《用户使用条款》协议")
              return;
            }
            values.device = checkMobile() ? 'mobile' : 'pc';
            let login = loginByPwd;
            if (type == "account") {
              if (values.account == undefined || values.account.length < 5) {
                message.error("请输入正确的账户名");
                return;
              }
              if (values.password == undefined || values.password?.length <= 5) {
                message.error("请输入正确的密码");
                return;
              }
            } else if (type == 'email') {
              values.captcha_id = token;
              login = loginByEmail;
              if (!/^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/.test(values.email)) {
                message.error("请输入正确的邮箱");
                return;
              }
              if (values.email_code == undefined || values.email_code?.length != 6) {
                message.error("请输入正确的邮箱验证码");
                return;
              }
              if (values.captcha_code == undefined || values.captcha_code?.length != 4) {
                message.error("请输入图形验证码");
                return;
              }
            } else if (type == 'phone') {
              values.captcha_id = token;
              login = loginBySms;
              if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(values.phone)) {
                message.error("请输入正确的邮箱");
                return;
              }
              if (values.sms_code == undefined || values.sms_code?.length != 6) {
                message.error("请输入正确的邮箱验证码");
                return;
              }
              if (values.captcha_code == undefined || values.captcha_code?.length != 4) {
                message.error("请输入图形验证码");
                return;
              }
            } else {
              message.error("不支持该登录方式");
              return;
            }
            setIsLoading(true);
            login(values).then(async (r) => {
              changeCaptcha();
              if (r.code != 200) {
                setIsLoading(false);
                message.error(r.message || "请求失败").then()
              } else {
                localStorage.removeItem("captcha_id");
                setLoginToken(checkMobile() ? 'mobile' : 'pc', r?.data?.token);
                await fetchUserInfo();
                message.success(r.message);
                setIsLoading(false);
                history.push(localStorage.getItem("redirect") || '/');
                localStorage.removeItem("redirect");
              }
            });
          }}>
            {type === 'account' && (
              <>
                <Form.Item name='account'>
                  <Input prefix={<UserOutlined className='site-form-item-icon'/>} size={'large'}
                         placeholder='请输入账户或邮箱或手机号'/>
                </Form.Item>
                <Form.Item name='password'>
                  <Input type={"password"} prefix={<LockOutlined className='site-form-item-icon'/>} size={'large'}
                         placeholder='请输入账号密码'/>
                </Form.Item></>
            )}
            {(type === 'email' || type === 'phone') && (
              <>
                {type == 'email' && <>
                  <Form.Item name='email'>
                    <Input prefix={<MailOutlined className='site-form-item-icon'/>} size={'large'}
                           placeholder='请输入邮箱'/>
                  </Form.Item>
                  <Form.Item style={{marginBottom: "0px"}}>
                    <Row gutter={4} wrap={false}>
                      <Col flex='7'>
                        <Form.Item name='email_code'>
                          <Input prefix={<LockOutlined className='site-form-item-icon'/>} placeholder='邮箱验证码'
                                 size={'large'}/>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button size={'large'}
                                loading={isEmailSendLoading}
                                onClick={(e) => {
                                  const email = form.getFieldValue("email");
                                  if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email)) {
                                    message.error("请输入正确的邮箱")
                                    return;
                                  }
                                  const captcha_code = form.getFieldValue("captcha_code");
                                  if (captcha_code == undefined || captcha_code.length != 4) {
                                    message.error("请输入正确的图形验证码")
                                    return;
                                  }
                                  setIsEmailSendLoading(true);
                                  sendEmail({
                                    email: email,
                                    captcha_id: token,
                                    captcha_code: captcha_code
                                  }).then((r) => {
                                    setIsEmailSendLoading(false);
                                    changeCaptcha();
                                    if (r.code != 200) {
                                      message.error(r.message || "请求失败").then()
                                    } else {
                                      getCode(e);
                                      form.setFieldsValue({captcha: ""});
                                      message.success(r.message);
                                    }
                                  });
                                }}
                                disabled={sendCodeDisabled}>获取验证码</Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </>}
                {type == 'phone' && <>
                  <Form.Item name='phone'>
                    <Input prefix={<UserOutlined className='site-form-item-icon'/>} size={'large'}
                           placeholder='请输入手机号'/>
                  </Form.Item>
                  <Form.Item style={{marginBottom: "0px"}}>
                    <Row gutter={4} wrap={false}>
                      <Col flex='7'>
                        <Form.Item name='sms_code'>
                          <Input prefix={<LockOutlined className='site-form-item-icon'/>} placeholder='短信验证码'
                                 size={'large'}/>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button size={'large'}
                                loading={isSmsSendLoading}
                                onClick={(e) => {
                                  const phone = form.getFieldValue("phone");
                                  if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone)) {
                                    message.error("请输入正确的手机号")
                                    return;
                                  }
                                  const captcha_code = form.getFieldValue("captcha_code");
                                  if (captcha_code == undefined || captcha_code.length != 4) {
                                    message.error("请输入正确的图形验证码")
                                    return;
                                  }
                                  setIsSmsSendLoading(true);
                                  sendSms({
                                    phone: phone,
                                    captcha_id: token,
                                    captcha_code: captcha_code
                                  }).then((r) => {
                                    setIsSmsSendLoading(false);
                                    changeCaptcha();
                                    if (r.code != 200) {
                                      message.error(r.message || "请求失败").then()
                                    } else {
                                      getCode(e);
                                      form.setFieldsValue({captcha: ""});
                                      message.success(r.message);
                                    }
                                  });
                                }}
                                disabled={sendCodeDisabled}>获取验证码</Button>
                      </Col>
                    </Row>
                  </Form.Item>
                </>}
                <Row>
                  <Col span={16}>
                    <Form.Item
                      name="captcha_code"
                    >
                      <Input
                        prefix={<SafetyCertificateOutlined className="site-form-item-icon"/>}
                        placeholder="图形验证码"
                        type="number"
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={7} offset={1}>
                    <Image
                      height={40}
                      preview={false}
                      src={captchaUrl}
                      onClick={() => {
                        changeCaptcha()
                      }}
                    />
                  </Col>
                </Row>
              </>
            )}
            {type == "qrcode" && (
              <>
                <Form.Item>
                  <Alert message="请使用手机QQ扫码下方二维码" type="info" showIcon/>
                </Form.Item>
                <Form.Item>
                  <div style={{
                    border: "1px solid #e1e1e1",
                    backgroundColor: "#fbfbfb",
                    borderRadius: "10px",
                    width: "125px",
                    height: "125px",
                    margin: "0px auto",
                    position: "relative"
                  }}>
                    <div className={styles.border_corner + " " + styles.border_corner_right_bottom}></div>
                    <div className={styles.border_corner + " " + styles.border_corner_right_top}></div>
                    <div className={styles.border_corner + " " + styles.border_corner_left_bottom}></div>
                    <div className={styles.border_corner + " " + styles.border_corner_left_top}></div>
                    <Spin spinning={qrcodeLoading || qrcode == ""}>
                      <QRCode
                        style={{margin: "14px"}}
                        value={qrcode}
                        size={95}
                        fgColor="#000000"
                      />
                    </Spin>
                  </div>
                  <div style={{textAlign: "center", margin: "15px auto -15px auto", color: "#8c8c8c"}}>
                    {qrcodeMessage || "请扫描二维码"}
                  </div>
                </Form.Item>
                <Form.Item hidden={!checkMobile()} style={{textAlign: "center"}}>
                  <Button type='primary' style={{maxWidth: "200px", marginTop: "10px"}} htmlType='button' block
                          onClick={() => {
                            qqJumpUrl(qrcode);
                            message.warning("验证完毕请回到此页面");
                          }}>
                    快捷登陆
                  </Button>
                </Form.Item>
              </>
            )}
            <Form.Item hidden={type != "account"} style={{marginTop: "-10px"}}>
              <a onClick={() => {
                message.warning("使用其他方式登陆自动创建账户")
              }}>注册帐号</a>
              <a style={{float: 'right',}} onClick={() => {
                message.warning("请使用其他方式验证登陆后修改密码")
              }}>忘记密码</a>
            </Form.Item>
            <Form.Item hidden={type == "qrcode"}>
              <Button type='primary' loading={isLoading} htmlType='submit' size={'large'} block>
                登 录
              </Button>
            </Form.Item>
            <Row hidden={type == "qrcode"}>
              <Form.Item name="read">
                <Checkbox checked={isRead} onChange={(e) => {
                  setIsRead(e.target.checked);
                }}>我已阅读并同意 <a href=''>《用户使用条款》</a>协议</Checkbox>
              </Form.Item>
            </Row>
          </Form>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
