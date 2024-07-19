import React, { useRef, useState} from 'react'
import {Body, Icon} from "@/components";
import {
    Avatar,
    Button,
    Card, DotLoading,
    Form,
    Input,
    List,
    Modal,
    Tag,
    Toast
} from "antd-mobile";
import {historyPush} from "@/utils/route";
import {createStyles, useTheme} from "antd-style";
import {useModel} from "umi";
import {Account, Cards, Clock, Money, NiCheng, OutLogin, Reset, Tongxunlu, UploadImage} from "@/components/icon";
import {updateInfo} from "@/service/person/update";
import {ModalShowProps} from "antd-mobile/2x/es/components/modal";
import {deleteHeader} from "@/utils/auth";
import {outLogin} from "@/service/user/login";
import {getUploadUrl, uploadFile} from "@/service/common/upload";

const useStyles = createStyles(() => {
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
                borderRadius: "8px"
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
            }
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
        },
    }
})
export default () => {
    const {styles: {card, list, card1, item, modal, label, formBody}} = useStyles()
    const theme = useTheme()
    const user = useModel("user")
    const modalRef = useRef<any>()
    const verifyRef = useRef<any>()
    /**
     * 退出登录
     */
    const [outLoading, setOutLoading] = useState(false)
    /**
     * 表单提交
     */
    const [form] = Form.useForm()
    const [btnLoading, setBtnLoading] = useState(false)
    const formFinish = async (values: any) => {
        if(values?.nick_name == undefined || values?.nick_name == ""){
            Toast.show({
                content: "请输入昵称",
                position: 'top',
            })
            return
        }
        if(values?.contact == undefined || values?.contact == ""){
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
     * 上传头像
     */
    // const Basic: FC = () => {
    //     const [fileList, setFileList] = useState<ImageUploadItem[]>([
    //         {
    //             url: user?.web?.avatar,
    //         },
    //     ])
    //     const beforeUpload = (file:any)=>{
    //         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //         if (!isJpgOrPng) {
    //             Toast?.show({
    //                 icon: 'fail',
    //                 content: '图片只支持jpg/png格式',
    //             })
    //             return false;
    //         }
    //         const isLt2M = file.size / 1024 / 1024 < 2;
    //         if (!isLt2M) {
    //             Toast?.show({
    //                 icon: 'fail',
    //                 content: '图片不能大于2MB',
    //             })
    //             return false;
    //         }
    //         return isJpgOrPng && isLt2M;
    //     }
    //     const mockUpload = (file:any)=> {
    //         return {
    //             url: URL.createObjectURL(file),
    //         }
    //     }
    //     return (
    //         <ImageUploader
    //             value={fileList}
    //             onChange={setFileList}
    //             upload={mockUpload}
    //             beforeUpload={beforeUpload}
    //         />
    //     )
    // }
    /**
     * 邮箱号码验证
     */
    const handleShowModalForNullAccount = () => {
        modalRef.current = Modal.show({
            className: modal,
            showCloseButton: true,
            content: (
                <Form form={form} className={formBody} onFinish={formFinish}>
                    <Form.Item name="account" label="账号" className={label}>
                        <Input placeholder="请输入账号" clearable />
                    </Form.Item>
                    <Form.Item>
                        <Button type="submit" block color={"primary"} loading={btnLoading} style={{ letterSpacing: "1px" }}>保存</Button>
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
                    }}>首次未设置密码的账号，直接修改即可</p>
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
        <Body showHeader={false} bodyStyle={{padding: 0}}>
            <Card className={card} style={{backgroundColor: theme.colorPrimary, borderRadius: 0, paddingBlock: "15px"}}>
                <Avatar src={user?.web?.avatar}
                        style={{width: "60px", height: "60px", marginRight: "15px", borderRadius: "8px"}}/>
                <div>
                    <span style={{
                        color: "#fff",
                        display: "inline-block",
                        marginBottom: "10px"
                    }}>{user?.web?.nick_name}</span><br/>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Tag style={{
                            backgroundColor: "#dbe6f0",
                            color: theme.colorPrimary,
                            paddingBlock: "6px",
                            "--border-radius": "5px",
                            "--border-color": theme.colorPrimary
                        }}>{user?.web?.is_master ? '管理员' : (user?.web?.is_admin ? '站长' : '会员')}</Tag>
                        <Tag style={{
                            marginLeft: "10px",
                            backgroundColor: "#dbe6f0",
                            color: theme.colorPrimary,
                            paddingBlock: "6px",
                            "--border-radius": "5px",
                            "--border-color": theme.colorPrimary
                        }}>ID:{user?.web?.id}</Tag>
                    </div>
                </div>
            </Card>
            <div style={{padding: "10px"}}>
                <Card style={{marginBottom: "10px", "--adm-card-padding-inline": 0}} className={card1}>
                    <List className={list} style={{borderRadius: "5px"}}>
                        <List.Item className={item}
                                   style={{fontSize: "14px", color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"}}
                                   prefix={<Icon style={{fontSize: "22px", color: "#f38e1b"}} type={Money}/>}
                                   extra={<span style={{fontSize: "13px", color: "gray"}}>{user?.web?.money}</span>}
                                   onClick={() => historyPush("user.pay")}>
                            账户余额
                        </List.Item>
                        <List.Item className={item}
                                   style={{fontSize: "14px", color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"}}
                                   prefix={<Icon style={{fontSize: "22px", color: "#33cc4d"}} type={Cards}/>}
                                   extra={<span style={{fontSize: "13px", color: "gray"}}>{user?.web?.id}</span>}
                                   onClick={() => {
                                   }}>
                            账号ID
                        </List.Item>
                        <List.Item className={item}
                                   style={{fontSize: "14px", color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"}}
                                   prefix={<Icon style={{fontSize: "22px", color: "#19b3e6"}} type={NiCheng}/>}
                                   extra={<span style={{fontSize: "13px", color: "gray"}}>{user?.web?.nick_name}</span>}
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
                                               <Form.Item>
                                                   <Button type="submit" block color={"primary"} loading={btnLoading}
                                                           style={{letterSpacing: "1px"}}>保存</Button>
                                               </Form.Item>
                                           </Form>)
                                       } as ModalShowProps)
                                   }}>
                            我的昵称
                        </List.Item>
                        <List.Item className={item}
                                   style={{fontSize: "14px", color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"}}
                                   prefix={<Icon style={{fontSize: "22px", color: "#d125f4"}} type={Tongxunlu}/>}
                                   extra={<span style={{fontSize: "13px", color: "gray"}}>{user?.web?.contact}</span>}
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
                                               <Form.Item>
                                                   <Button type="submit" block color={"primary"} loading={btnLoading}
                                                           style={{letterSpacing: "1px"}}>保存</Button>
                                               </Form.Item>
                                           </Form>)
                                       } as ModalShowProps)
                                   }}>
                            联系方式
                        </List.Item>
                        <List.Item className={item}
                                   style={{fontSize: "14px", color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"}}
                                   prefix={<Icon style={{fontSize: "22px", color: "#33cc4d"}} type={Clock}/>}
                                   extra={<span
                                       style={{fontSize: "13px", color: "gray"}}>{user?.web?.login_time}</span>}
                                   onClick={() => {
                                   }}>
                            登录时间
                        </List.Item>
                        {/*<List.Item className={item}*/}
                        {/*           style={{fontSize: "14px", color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"}}*/}
                        {/*           prefix={<Icon style={{fontSize: "22px", color: "#f38e1b"}} type={UploadImage}/>}*/}
                        {/*           onClick={() => {*/}
                        {/*                Modal?.show({*/}
                        {/*                   className: modal,*/}
                        {/*                   showCloseButton: true,*/}
                        {/*                   content: (<Basic/>)*/}
                        {/*               } as ModalShowProps)*/}
                        {/*           }}>*/}
                        {/*    上传头像*/}
                        {/*</List.Item>*/}
                    </List>
                </Card>
                <Card style={{"--adm-card-padding-inline": 0, marginBottom: "10px"}} className={card1}>
                    <List className={list} style={{borderRadius: "5px"}}>
                        <List.Item className={item}
                                   style={{fontSize: "14px", color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"}}
                                   prefix={<Icon style={{fontSize: "22px", color: "#f655a6"}} type={Reset}/>}
                                   extra={<span style={{
                                       fontSize: "13px",
                                       color: "gray"
                                   }}>{user?.web?.account || "未绑定账号"}</span>}
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
                {outLoading &&
                    <div style={{
                        color: '#00b578',
                        position: "absolute",
                        top: "70%",
                        left: "50%",
                        transform: "translate(-50%,-50%)"
                    }}>
                        <DotLoading color={theme.colorPrimary}/>
                        <span>退出登录中</span>
                    </div> || <Card style={{"--adm-card-padding-inline": 0}} className={card1}>
                        <List className={list} style={{borderRadius: "5px"}}>
                            <List.Item className={item}
                                       style={{
                                           fontSize: "14px",
                                           color: theme.isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
                                       }}
                                       prefix={<Icon style={{fontSize: "22px", color: "#f65555"}} type={OutLogin}/>}
                                       onClick={async () => {
                                           setOutLoading(true)
                                           await outLogin({
                                               onSuccess: (r: any) => {
                                                   deleteHeader()
                                                   Toast.show({
                                                       content: r?.message,
                                                       position: 'top',
                                                   })
                                                   historyPush("user.login")
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

            </div>
        </Body>
    )
}