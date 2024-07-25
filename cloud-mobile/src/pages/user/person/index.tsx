import React, {useRef, useState} from 'react'
import {Body, Icon} from "@/components";
import {
    Avatar,
    Button,
    Card, Dialog, DotLoading,
    Grid,
    List,
    Modal,
    Tag,
    Toast
} from "antd-mobile";
import {ImageUploadItem} from 'antd-mobile/es/components/image-uploader'
import {historyPush} from "@/utils/route";
import {createStyles, useTheme} from "antd-style";
import {useModel} from "umi";
import {
    Email,
    NiCheng,
    OutLogin,
    Phone,
    Reset,
    Text1,
    Tongxunlu, TypeAll,
} from "@/components/icon";
import {deleteHeader} from "@/utils/auth";
import {outLogin} from "@/service/user/login";

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
            },
            "--adm-card-padding-inline": 0
        },
        item: {
            ".adm-list-item-content-arrow": {
                fontSize: "14px"
            },
            fontSize: "14px", color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)",
            ":hover": {
                color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
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

    const {styles: {card, list, card1, item, modal, tag, extra}} = useStyles()
    const theme = useTheme()
    const user = useModel("user")
    const verifyRef = useRef<any>()
    /**
     * 退出登录
     */
    const [outLoading, setOutLoading] = useState(false)
    /**
     * 号码验证
     */
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
                        historyPush("user.person.phoneVerify");
                        verifyRef.current.close();
                    }}>通过手机验证</Button>
                    <Button block color={"primary"} style={{
                        letterSpacing: "1px",
                        "--background-color": theme.colorPrimary,
                        "--border-color": theme.colorPrimary
                    }} onClick={() => {
                        historyPush("user.person.emailVerify");
                        verifyRef.current.close();
                    }}>通过邮箱验证</Button>
                </>
            )
        });
    };

    return (
        <Body showHeader={false} bodyStyle={{padding: 0}} space={false}>
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
                        <Card className={card1}>
                            <List className={list} style={{borderRadius: "5px"}}>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#f655a6"}} type={TypeAll}/>}
                                           onClick={() => {
                                               historyPush("admin.index")
                                           }}>
                                    网站后台
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card style={{"--adm-card-padding-inline": 0}} className={card1}>
                            <List className={list} style={{borderRadius: "5px"}}>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#19b3e6"}} type={NiCheng}/>}
                                           extra={<span className={extra}>{user?.web?.nick_name}</span>}
                                           onClick={() => {
                                           }}>
                                    我的昵称
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#d125f4"}}
                                                         type={Tongxunlu}/>}
                                           extra={<span className={extra}>{user?.web?.contact}</span>}
                                           onClick={() => {
                                           }}>
                                    联系方式
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#f65555"}} type={NiCheng}/>}
                                           onClick={() => historyPush("user.person.update")}>
                                    修改资料
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon style={{fontSize: "22px", color: "#05d005"}} type={Text1}/>}
                                           onClick={() => historyPush("user.person.log")}>
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
                                                   historyPush("user.person.update")
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
                                               historyPush("user.person.updateEmail")
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
                                               historyPush("user.person.updatePhone")
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
                                               onClick={() => {
                                                   Dialog?.confirm({
                                                       title:"提示",
                                                       content: '确定退出登录吗？',
                                                       onConfirm: async () => {
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
                                                       },
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