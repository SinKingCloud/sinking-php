import React, { useRef, useState} from 'react'
import {Body, Icon} from "@/components";
import {
    Avatar,
    Button,
    Card, DotLoading,
    Form, Grid, ImageUploader,
    Input,
    List,
    Modal,
    Tag,
    Toast
} from "antd-mobile";
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader'
import {historyPush} from "@/utils/route";
import {createStyles, useTheme} from "antd-style";
import {useModel} from "umi";
import {
    Clock,
    Email,
    NiCheng,
    OutLogin,
    Phone,
    Reset,
    Text1,
    Tongxunlu, TypeAll,
    UploadImage
} from "@/components/icon";
import {updateEmail, updateInfo, updatePhone} from "@/service/person/update";
import {ModalShowProps} from "antd-mobile/es/components/modal";
import {deleteHeader} from "@/utils/auth";
import {outLogin} from "@/service/user/login";
import {sendSms} from "@/service/common/sms";
import Captcha, {CaptchaRef} from "@/components/captcha";
import {sendEmail} from "@/service/common/email";
import {getUploadUrl, uploadFile} from "@/service/common/upload";
import log from "@/pages/user/person/log";

const useStyles = createStyles(({token, isDarkMode}): any => {
    return {
        card: {
            ".adm-card-body": {
                display: "flex"
            }
        },
        list: {
            ".adm-list-body": {
                borderTop: "none !important",
                borderBottom: "none !important",
                borderRadius: "8px",
                userSelect: "none",
            },
            ".adm-list-item": {
                paddingLeft: "0 !important"
            },
            ".adm-list-item-content": {
                paddingLeft: "12px !important",
            }
        },
        card1: {
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            }
        },
        item: {
            ".adm-list-item-content-arrow": {
                fontSize: "14px"
            },
            fontSize: "14px", color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
        },
        modal: {
            ".adm-center-popup-wrap": {
                minWidth: "96% !important",
                maxWidth: "96% !important"
            }
        },
        label: {
            ".adm-input-element": {
                fontSize: "14px !important"
            }
        },
        formBody: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop: "none !important",
                borderBottom: "none !important",
            },
            ".adm-list-item": {
                paddingLeft: "0 !important"
            }
        },
        btn: {
            ".adm-list-item-content": {
                paddingRight: "0 !important"
            }
        },
        tag: {
            backgroundColor: "#dbe6f0",
            color: `${token.colorPrimary} !important`,
            paddingBlock: "6px",
            "--border-radius": "5px",
            "--border-color": `${token.colorPrimary} !important`
        },
        extra: {
            fontSize: "13px", color: "gray"
        }
    }
})
export default () => {
    const captcha = useRef<CaptchaRef>({});
    const {styles: {card, list, card1, item, modal, label, formBody, btn, tag, extra}} = useStyles()
    const theme = useTheme()
    const user = useModel("user")
    const modalRef = useRef<any>()
    const verifyRef = useRef<any>()
    /**
     * 获取验证码
     */
    const [sendCodeDisabled, setSendCodeDisabled] = useState(false);
    const [smsLoading, setSmsLoading] = useState(false)
    const getCode = (e: any) => {
        let time = 60;
        const timer = setInterval(() => {
            setSendCodeDisabled(true);
            e.target.innerHTML = `${time}秒后重新获取`;
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
     * 退出登录
     */
    const [outLoading, setOutLoading] = useState(false)
    /**
     * 修改资料
     */
    const [form] = Form.useForm()
    const [btnLoading, setBtnLoading] = useState(false)
    const formFinish = async (values: any) => {
        if (values?.nick_name == undefined || values?.nick_name == "") {
            Toast.show({
                content: "请输入昵称",
                position: 'top',
            })
            return
        }
        if (values?.contact == undefined || values?.contact == "") {
            Toast.show({
                content: "请输入联系方式",
                position: 'top',
            })
            return
        }
        setBtnLoading(true)
        await updateInfo({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast.show({
                    content: r?.message,
                    position: 'top',
                })
                user?.refreshWebUser()
                modalRef?.current?.close()
                form.resetFields()
            },
            onFail: (r: any) => {
                Toast.show({
                    content: r?.message || "修改失败",
                    position: 'top',
                })
            },
            onFinally: () => {
                setBtnLoading(false)
            }
        })
    }
    /**
     * 修改手机号码
     */
    const [phoneLoading, setPhoneLoading] = useState(false)
    const phoneFinish = async (values: any) => {
        if (values?.phone == undefined || values.phone == "") {
            Toast.show({
                content: "手机号不能为空",
                position: "top"
            })
            return
        } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(values.phone)) {
            Toast.show({
                content: "请输入正确的手机号",
                position: "top"
            })
            return
        }
        if (values?.sms_code == undefined || values.sms_code == "") {
            Toast.show({
                content: "验证码不能为空",
                position: "top"
            })
            return
        }
        setPhoneLoading(true)
        await updatePhone({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast.show({
                    content: r?.message,
                    position: 'top',
                })
                user?.refreshWebUser()
                modalRef?.current?.close()
                form.resetFields()
            },
            onFail: (r: any) => {
                Toast.show({
                    content: r?.message || "修改失败",
                    position: "top"
                })
            },
            onFinally: () => {
                setPhoneLoading(false)
            }
        })
    }
    /**
     * 修改邮箱账号
     */
    const [emailLoading, setEmailLoading] = useState(false)
    const emailFinish = async (values: any) => {
        if (values?.email == undefined || values?.email == "") {
            Toast.show({
                content: "邮箱不能为空",
                position: "top"
            });
            return;
        } else if (!/^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/.test(values?.email)) {
            Toast.show({
                content: "邮箱格式不正确",
                position: "top"
            });
            return
        }
        if (values?.email_code == undefined || values.email_code == "") {
            Toast.show({
                content: "验证码不能为空",
                position: "top"
            });
            return;
        }
        setEmailLoading(true)
        await updateEmail({
            body: {
                ...values
            },
            onSuccess: (r: any) => {
                Toast.show({
                    content: r?.message,
                    position: 'top',
                })
                user?.refreshWebUser()
                modalRef?.current?.close()
                form.resetFields()
            },
            onFail: (r: any) => {
                Toast.show({
                    content: r?.message || "修改失败",
                    position: "top"
                })
            },
            onFinally: () => {
                setEmailLoading(false)
            }
        })
    }
    /**
     * 上传头像
     */
    const [files, setFiles] = useState<ImageUploadItem[]>([
        {
            url:user?.web?.avatar || ""
        }
    ]);
    const beforeUpload = (file: any) => {
        if (file.size > 1024 * 1024) {
            Toast.show('请选择小于 1M 的图片')
            return null
        }
        return file
    }

    const mockUploadFail = (file: File): Promise<any> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Fail to upload'));
            }, 2000);
        });
    };
    /**
     * 号码验证
     */
    const handleShowModalForNullAccount = () => {
        modalRef.current = Modal.show({
            className: modal,
            showCloseButton: true,
            content: (
                <Form form={form} className={formBody} onFinish={formFinish}>
                    <Form.Item name="account" label="账号" className={label}>
                        <Input placeholder="请输入账号" clearable/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="submit" block color={"primary"} loading={btnLoading}
                                style={{letterSpacing: "1px"}}>保存</Button>
                    </Form.Item>
                </Form>
            )
        });
    };
    const handleShowModalForPasswordChange = () => {
        verifyRef.current = Modal.show({
            className: modal,
            showCloseButton: true,
            content: (
                <>
                    <p style={{
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#f655a6",
                        marginBottom: "10px"
                    }}>请选择一种方式进行修改</p>
                    <p style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "gray"
                    }}>未绑定手机号和邮箱的用户需要先进行绑定才能修改密码</p>
                    <Button block color={"primary"} style={{
                        letterSpacing: "1px",
                        margin: "20px 0",
                        "--background-color": theme.colorPrimary,
                        "--border-color": theme.colorPrimary
                    }} onClick={() => {
                        historyPush("person.phoneVerify");
                        verifyRef.current.close();
                    }}>通过手机验证</Button>
                    <Button block color={"primary"} style={{
                        letterSpacing: "1px",
                        "--background-color": theme.colorPrimary,
                        "--border-color": theme.colorPrimary
                    }} onClick={() => {
                        historyPush("person.emailVerify");
                        verifyRef.current.close();
                    }}>通过邮箱验证</Button>
                </>
            )
        });
    };

    return (
        <Body showHeader={false} bodyStyle={{padding: 0}} space={false}>
            <Captcha ref={captcha}/>
            <Grid columns={1} gap={8}>
                <Grid.Item>
                    <Card className={card}
                          style={{backgroundColor: theme.colorPrimary, borderRadius: 0, paddingBlock: "15px"}}>
                        <Avatar src={user?.web?.avatar}
                                style={{width: "60px", height: "60px", marginRight: "15px", borderRadius: "8px"}}/>
                        <div>
                    <span style={{
                        color: "#fff",
                        display: "inline-block",
                        marginBottom: "10px"
                    }}>{user?.web?.nick_name}</span><br/>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Tag
                                    className={tag}>{user?.web?.is_master ? '管理员' : (user?.web?.is_admin ? '站长' : '会员')}</Tag>
                                <Tag style={{marginLeft: "10px"}} className={tag}>ID:{user?.web?.id}</Tag>
                            </div>
                        </div>
                    </Card>
                </Grid.Item>
            </Grid>

            <div style={{padding: "10px"}}>
                <Grid columns={1} gap={8}>
                    <Grid.Item>
                        <Card style={{"--adm-card-padding-inline": 0}} className={card1}>
                            <List className={list} style={{borderRadius: "5px"}}>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#19b3e6"}} type={NiCheng}/>}
                                           extra={<span className={extra}>{user?.web?.nick_name}</span>}
                                           onClick={() => {
                                               modalRef.current = Modal?.show({
                                                   className: modal,
                                                   showCloseButton: true,
                                                   content: (<Form form={form}
                                                                   initialValues={{nick_name: user?.web?.nick_name || "未设置"}}
                                                                   className={formBody} onFinish={formFinish}>
                                                       <Form.Item name="nick_name" label="昵称" className={label}>
                                                           <Input placeholder="请输入账户名称" clearable/>
                                                       </Form.Item>
                                                       <Form.Item className={btn}>
                                                           <Button type="submit" block color={"primary"}
                                                                   loading={btnLoading}
                                                                   style={{letterSpacing: "1px"}}>保存</Button>
                                                       </Form.Item>
                                                   </Form>)
                                               } as ModalShowProps)
                                           }}>
                                    我的昵称
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#d125f4"}}
                                                         type={Tongxunlu}/>}
                                           extra={<span className={extra}>{user?.web?.contact}</span>}
                                           onClick={() => {
                                               modalRef.current = Modal?.show({
                                                   className: modal,
                                                   showCloseButton: true,
                                                   content: (<Form form={form}
                                                                   initialValues={{contact: user?.web?.contact || "未设置"}}
                                                                   className={formBody} onFinish={formFinish}>
                                                       <Form.Item name="contact" label="联系方式" className={label}>
                                                           <Input placeholder="请输入联系方式" clearable/>
                                                       </Form.Item>
                                                       <Form.Item className={btn}>
                                                           <Button type="submit" block color={"primary"}
                                                                   loading={btnLoading}
                                                                   style={{letterSpacing: "1px"}}>保存</Button>
                                                       </Form.Item>
                                                   </Form>)
                                               } as ModalShowProps)
                                           }}>
                                    联系方式
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#33cc4d"}} type={Clock}/>}
                                           extra={<span className={extra}>{user?.web?.login_time}</span>}
                                           onClick={() => {}}>
                                    登录时间
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#f38e1b"}}
                                                         type={UploadImage}/>}
                                           onClick={() => {
                                             modalRef.current =  Modal?.show({
                                                   className: modal,
                                                   showCloseButton: true,
                                                   title: "头像上传",
                                                   content: (
                                                       <ImageUploader
                                                           value={files}
                                                           onChange={ async (info:any)=>{
                                                               const index = info[0].url.indexOf("http");
                                                               const result = info[0].url.substring(index);
                                                               if(info.length>0){
                                                                   setFiles(info[0].url)
                                                               }
                                                              await uploadFile({
                                                                 body:{
                                                                     avatar:result
                                                                 },
                                                                 onSuccess:(r:any)=>{
                                                                     Toast.show({
                                                                         content:r.message,
                                                                         icon:"success"
                                                                     })
                                                                     modalRef.current?.close()
                                                                     user?.refreshWebUser()
                                                                 },
                                                                 onFail:(r:any)=>{
                                                                     Toast.show({
                                                                         content:r.message,
                                                                         icon:"fail"
                                                                     })
                                                                 }
                                                             })
                                                           }}
                                                           preview
                                                           beforeUpload={beforeUpload as any}
                                                           upload={mockUploadFail as any}
                                                       />
                                                   )
                                               } as ModalShowProps)
                                           }}>
                                    上传头像
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#05d005"}} type={Text1}/>}
                                           onClick={() => historyPush("person.log")}>
                                    操作日志
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card style={{"--adm-card-padding-inline": 0}} className={card1}>
                            <List className={list} style={{borderRadius: "5px"}}>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#f655a6"}} type={Reset}/>}
                                           extra={<span className={extra}>{user?.web?.account || "未绑定账号"}</span>}
                                           onClick={() => {
                                               if (user?.web?.account === null) {
                                                   handleShowModalForNullAccount();
                                               } else {
                                                   handleShowModalForPasswordChange();
                                               }
                                           }}>
                                    修改密码
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card style={{"--adm-card-padding-inline": 0}} className={card1}>
                            <List className={list} style={{borderRadius: "5px"}}>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#19b3e6"}} type={Email}/>}
                                           extra={<span className={extra}>{user?.web?.email || "未绑定邮箱"}</span>}
                                           onClick={() => {
                                               modalRef.current = Modal.show({
                                                   className: modal,
                                                   showCloseButton: true,
                                                   title: "修改邮箱账号",
                                                   content: (
                                                       <Form form={form} className={formBody} onFinish={emailFinish}>
                                                           <Form.Item name="email" label="邮箱" className={label}>
                                                               <Input placeholder="请输入邮箱账号" clearable/>
                                                           </Form.Item>
                                                           <Form.Item label='验证码' name="email_code" className={label}
                                                                      extra={<Button loading={smsLoading}
                                                                                     disabled={sendCodeDisabled}
                                                                                     style={{
                                                                                         fontSize: "12px",
                                                                                         color: theme.colorPrimary,
                                                                                         "--border-width": "0px",
                                                                                         padding: "0px"
                                                                                     }}
                                                                                     onClick={(e) => {
                                                                                         const email = form.getFieldValue("email")
                                                                                         if (email == undefined || email == "") {
                                                                                             Toast.show({
                                                                                                 content: "请输入邮箱",
                                                                                                 icon: "fail"
                                                                                             })
                                                                                             return
                                                                                         }
                                                                                         setSmsLoading(true)
                                                                                         captcha?.current?.Show?.(async (res) => {
                                                                                             await sendEmail({
                                                                                                 body: {
                                                                                                     captcha_id: res?.randstr,
                                                                                                     captcha_code: res?.ticket,
                                                                                                     email: email,
                                                                                                 },
                                                                                                 onSuccess: (r) => {
                                                                                                     Toast.show({
                                                                                                         content: r?.message,
                                                                                                         icon: "success"
                                                                                                     })
                                                                                                     getCode(e)
                                                                                                 },
                                                                                                 onFail: (r) => {
                                                                                                     Toast.show({
                                                                                                         content: r?.message,
                                                                                                         icon: "fail"
                                                                                                     })
                                                                                                 },
                                                                                                 onFinally: () => {
                                                                                                     setSmsLoading(false)
                                                                                                 }
                                                                                             })
                                                                                         }, () => {
                                                                                             Toast.show({
                                                                                                 content: "请完成验证码认证",
                                                                                                 icon: "fail"
                                                                                             })
                                                                                             setSmsLoading(false)
                                                                                         })
                                                                                     }}>发送验证码</Button>}>
                                                               <Input placeholder='请输入邮箱验证码' clearable/>
                                                           </Form.Item>
                                                           <Form.Item>
                                                               <Button type="submit" block color={"primary"}
                                                                       loading={emailLoading}
                                                                       style={{letterSpacing: "1px"}}>修改</Button>
                                                           </Form.Item>
                                                       </Form>
                                                   )
                                               });
                                           }}>
                                    绑定邮箱
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card style={{"--adm-card-padding-inline": 0}} className={card1}>
                            <List className={list} style={{borderRadius: "5px"}}>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#f38e1b"}} type={Phone}/>}
                                           extra={<span className={extra}>{user?.web?.phone || "未绑定手机号码"}</span>}
                                           onClick={() => {
                                               modalRef.current = Modal.show({
                                                   className: modal,
                                                   showCloseButton: true,
                                                   title: "修改手机号码",
                                                   content: (
                                                       <Form form={form} className={formBody} onFinish={phoneFinish}>
                                                           <Form.Item name="phone" label="手机号码" className={label}>
                                                               <Input placeholder="新手机号码" clearable/>
                                                           </Form.Item>
                                                           <Form.Item label='验证码' name="sms_code" className={label}
                                                                      extra={<Button loading={smsLoading}
                                                                                     disabled={sendCodeDisabled}
                                                                                     style={{
                                                                                         fontSize: "12px",
                                                                                         color: theme.colorPrimary,
                                                                                         "--border-width": "0px",
                                                                                         padding: "0px"
                                                                                     }}
                                                                                     onClick={(e) => {
                                                                                         const phone = form.getFieldValue("phone")
                                                                                         if (phone == undefined || phone == "") {
                                                                                             Toast.show({
                                                                                                 content: "请输入手机号码",
                                                                                                 icon: "fail"
                                                                                             })
                                                                                             return
                                                                                         }

                                                                                         setSmsLoading(true)
                                                                                         captcha?.current?.Show?.(async (res) => {
                                                                                             await sendSms({
                                                                                                 body: {
                                                                                                     captcha_id: res?.randstr,
                                                                                                     captcha_code: res?.ticket,
                                                                                                     phone: phone,
                                                                                                 },
                                                                                                 onSuccess: (r) => {
                                                                                                     Toast.show({
                                                                                                         content: r?.message,
                                                                                                         icon: "success"
                                                                                                     })
                                                                                                     getCode(e)
                                                                                                 },
                                                                                                 onFail: (r) => {
                                                                                                     Toast.show({
                                                                                                         content: r?.message,
                                                                                                         icon: "fail"
                                                                                                     })
                                                                                                 },
                                                                                                 onFinally: () => {
                                                                                                     setSmsLoading(false)
                                                                                                 }
                                                                                             })
                                                                                         }, () => {
                                                                                             Toast.show({
                                                                                                 content: "请完成验证码认证",
                                                                                                 icon: "fail"
                                                                                             })
                                                                                             setSmsLoading(false)
                                                                                         })
                                                                                     }}>发送验证码</Button>}>
                                                               <Input placeholder='请输入短信验证码' clearable/>
                                                           </Form.Item>
                                                           <Form.Item>
                                                               <Button type="submit" block color="primary"
                                                                       loading={phoneLoading}
                                                                       style={{letterSpacing: "1px"}}>修改</Button>
                                                           </Form.Item>
                                                       </Form>
                                                   )
                                               });
                                           }}>
                                    绑定手机
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        {outLoading &&
                            <div style={{
                                color: '#00b578',
                                textAlign: 'center'
                            }}>
                                <DotLoading color={theme.colorPrimary}/>
                                <span>退出登录中</span>
                            </div> || <Card style={{"--adm-card-padding-inline": 0}} className={card1}>
                                <List className={list} style={{borderRadius: "5px"}}>
                                    <List.Item className={item}
                                               prefix={<Icon style={{fontSize: "22px", color: "#f65555"}}
                                                             type={OutLogin}/>}
                                               onClick={async () => {
                                                   setOutLoading(true)
                                                   await outLogin({
                                                       onSuccess: (r: any) => {
                                                           deleteHeader()
                                                           Toast.show({
                                                               content: r?.message,
                                                               position: 'top',
                                                           })
                                                           historyPush("login")
                                                       },
                                                       onFail: (r: any) => {
                                                           Toast.show({
                                                               content: r?.message,
                                                               position: 'top',
                                                           })
                                                       },
                                                       onFinally: () => {
                                                           setOutLoading(false)
                                                       }
                                                   })

                                               }}>
                                        退出登录
                                    </List.Item>
                                </List>
                            </Card>}
                    </Grid.Item>
                </Grid>
            </div>
        </Body>
    )
}