import React, {useState} from 'react'
import {Body, Icon, VirtualRef} from "@/components";
import {
    Avatar,
    Card, Dialog, DotLoading,
    Grid,
    List,
    Tag,
    Toast
} from "antd-mobile";
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
            },
            backgroundColor: token.colorPrimary, borderRadius: 0, paddingBlock: "15px"
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
        },
        ava: {
            width: "60px", height: "60px", marginRight: "15px", borderRadius: "8px"
        },
        nick: {
            color: "#fff", display: "inline-block", marginBottom: "10px"
        },
        inner: {
            marginLeft: "10px"
        },
        main: {
            padding: "10px"
        },
        ic1: {
            fontSize: "22px", color: "#f655a6"
        },
        ic2: {
            fontSize: "22px", color: "#19b3e6"
        },
        ic3: {
            fontSize: "22px", color: "#d125f4"
        },
        ic4: {
            fontSize: "22px", color: "#f65555"
        },
        ic5: {
            fontSize: "22px", color: "#05d005"
        },
        ic6: {
            fontSize: "22px", color: "#f38e1b"
        },
        loading: {
            color: '#00b578', textAlign: 'center'
        },
        login: {
            fontSize: "22px", color: "#f65555"
        }
    }
})
export default () => {

    const {
        styles: {
            card, list, card1, item,  tag, extra,ava,
            nick, inner, main, ic1, ic2, ic3, ic4, ic5, ic6, loading, login
        }
    } = useStyles();
    const theme = useTheme();
    const user = useModel("user");
    /**
     * 退出登录
     */
    const [outLoading, setOutLoading] = useState(false);

    return (
        <Body showHeader={false} bodyStyle={{padding: 0}} space={false}>
            <Grid columns={1} gap={8}>
                <Grid.Item>
                    <Card className={card}>
                        <Avatar src={user?.web?.avatar} className={ava}/>
                        <div>
                            <span className={nick}>{user?.web?.nick_name}</span><br/>
                            <div>
                                <Tag
                                    className={tag}>{user?.web?.is_master ? '管理员' : (user?.web?.is_admin ? '站长' : '会员')}</Tag>
                                <Tag className={tag + " " + inner}>ID:{user?.web?.id}</Tag>
                            </div>
                        </div>
                    </Card>
                </Grid.Item>
            </Grid>
            <div className={main}>
                <Grid columns={1} gap={8}>
                    <Grid.Item>
                        <Card className={card1}>
                            <List className={list}>
                                <List.Item className={item}
                                           prefix={<Icon className={ic1} type={TypeAll}/>}
                                           onClick={() => {
                                               historyPush("admin.index")
                                           }}>
                                    网站后台
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card className={card1}>
                            <List className={list}>
                                <List.Item className={item}
                                           prefix={<Icon className={ic2} type={NiCheng}/>}
                                           extra={<span className={extra}>{user?.web?.nick_name}</span>}
                                           onClick={() => {
                                           }}>
                                    我的昵称
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon className={ic3} type={Tongxunlu}/>}
                                           extra={<span className={extra}>{user?.web?.contact}</span>}
                                           onClick={() => {
                                           }}>
                                    联系方式
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon className={ic4} type={NiCheng}/>}
                                           onClick={() => historyPush("user.person.update")}>
                                    修改资料
                                </List.Item>
                                <List.Item className={item}
                                           prefix={<Icon className={ic5} type={Text1}/>}
                                           onClick={() => historyPush("user.person.log")}>
                                    操作日志
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card className={card1}>
                            <List className={list}>
                                <List.Item className={item}
                                           prefix={<Icon className={ic1} type={Reset}/>}
                                           extra={<span className={extra}>{user?.web?.account || "未绑定账号"}</span>}
                                           onClick={() => {
                                               if (user?.web?.account === null) {
                                                   Toast?.show({
                                                       content: "请先绑定账号",
                                                       position: "top",
                                                       afterClose: () => {
                                                           historyPush("user.person.update")
                                                       }
                                                   })
                                               } else {
                                                   historyPush("user.person.phoneVerify");
                                               }
                                           }}>
                                    修改密码
                                </List.Item>
                            </List>
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card className={card1}>
                            <List className={list}>
                                <List.Item className={item}
                                           prefix={<Icon className={ic2} type={Email}/>}
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
                        <Card className={card1}>
                            <List className={list}>
                                <List.Item className={item}
                                           prefix={<Icon className={ic6} type={Phone}/>}
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
                            <div className={loading}>
                                <DotLoading color={theme.colorPrimary}/>
                                <span>退出登录中</span>
                            </div> || <Card className={card1}>
                                <List className={list}>
                                    <List.Item className={item}
                                               prefix={<Icon className={login} type={OutLogin}/>}
                                               onClick={() => {
                                                   Dialog?.confirm({
                                                       title: "提示",
                                                       content: '确定退出登录吗？',
                                                       getContainer: VirtualRef?.current,
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