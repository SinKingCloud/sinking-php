import {Body, Icon} from "@/components";
import {Button, List, Modal} from "antd-mobile";
import {
    Cdk,
    Gift,
    Help,
    Huo,
    Left,
    Tabulate,
    Recharge,
    Right,
    Shop,
    Type,
    User,
    Message,
    Than
} from "@/components/icon";
import {history} from "umi";
import React, {useRef} from "react";
import {createStyles} from "antd-style";
import {historyPush} from "@/utils/route";

const useStyles = createStyles(() => {
    return {
        list: {
            ".adm-list-item ": {
                lineHeight: "1 !important"
            },
            ".adm-list-header": {
                backgroundColor: "#fff",
                borderRadius: "5px",
                fontSize: "12px !important",
            }
        },
        icon: {
            ".adm-list-item-content-arrow": {
                fontSize: "15px",
                color: "rgba(0,0,0,0.7)"
            },
            ".adm-list-item-description":{
                marginTop:"3px"
            }
        },
        body:{
            backgroundColor:"#faf8f8 !important",
        },
    }
})
export default function HomePage() {
    const modalRef = useRef<any>();
    const {styles: {list, icon,body}} = useStyles()
    const users = [
        {
            key: 1,
            name: (
                <span style={{fontSize: "13px", color: "#f655a6",fontWeight:600}}>暑假活动<Icon type={Huo}
                                                                                                style={{marginLeft: "10px"}}/></span>
            ),
            description: (
                <span style={{
                    fontSize: "12px",
                    color: "rgba(0,0,0,0.7)"
                }} >永久代挂5折，下单年费多送6个月，点此查看</span>
            ),
        },
        {
            key: 2,
            name: (
                <span style={{fontSize: "13px", color: "#477eeb",fontWeight:600}}>邀请好友活动<Icon type={Huo}
                                                                                                    style={{marginLeft: "10px"}}/></span>
            ),
            description: (
                <span style={{
                    fontSize: "12px",
                    color: "rgba(0,0,0,0.7)"
                }}>与好友一起动动手指即可免费用代挂，欢迎参与</span>
            ),
        },
    ]
    const notice = [
        {
            key:1,
            name:(<span style={{fontSize: "13px", color: "rgba(0,0,0,0.7)"}}>关于挂机状态频繁变为登录保护的通知</span>)
        }
    ]
    return (
        <Body  showHeader={false} bodyClassNames={body}>
            <div style={{
                textAlign: 'center', backgroundColor: "rgb(92,165,214)",
                overflow: "hidden", color: "#fff"
            }}>
                <h1 style={{marginBottom:0, color: "yellow",fontSize:"32px", textShadow: "0 1px 0 #525252, 1px 1px 1px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.3)",}}>测试数据</h1>
                <p style={{
                    fontSize: "18px",
                    marginTop:0,
                    textShadow: "0 1px 0 #525252, 1px 1px 1px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.3)",
                    paddingBottom:"10px"
                }}>创建最好用的在线挂机网站</p>
            </div>
            <div style={{padding: "10px", boxSizing: "border-box",}}>
                <Button block color='warning' size='large' style={{marginBottom: "10px"}} onClick={() => {
                    modalRef.current = Modal?.show({
                        content: (
                            <>
                                <div style={{
                                    color: "red",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    marginBottom: "30px"
                                }}>请选择下单方式
                                </div>
                                <div style={{display: "flex", justifyContent: "space-around"}}>
                                    <Button color='warning' style={{fontSize: "14px"}} onClick={() => {
                                        historyPush("other.person.onlinePay")
                                        modalRef?.current?.close()
                                    }}>
                                        <Icon type={Shop} style={{marginRight: "5px"}}/>在线支付
                                    </Button>
                                    <Button color='warning' style={{fontSize: "14px"}} onClick={() => {
                                        historyPush("other.person.cdkPay")
                                        modalRef?.current?.close()
                                    }}>
                                        <Icon type={Cdk} style={{marginRight: "5px"}}/>使用卡密
                                    </Button>
                                </div>

                            </>
                        ),
                        closeOnMaskClick: true,
                    })
                }}>
                    <Icon type={Right} style={{marginRight: "15px"}}/>
                    点此下单
                    <Icon type={Left} style={{marginLeft: "15px"}}/>
                </Button>
                <ul style={{
                    listStyle: "none",
                    padding: "0",
                    margin: "0",
                    height: "90px",
                    backgroundColor: "#fff",
                    width: "100%",
                    borderRadius: "5px",
                    display: "flex",
                    marginBottom: "10px"
                }}>
                    <li style={{height: "100%", width: "25%", textAlign: "center"}}
                        onClick={() => historyPush("user.list")}>
                        <Icon type={Tabulate} style={{fontSize: "26px", margin: "25px 0 5px 0"}}/><br/>
                        <span>代练列表</span>
                    </li>
                    <li style={{height: "100%", width: "25%", textAlign: "center"}}
                        onClick={() => historyPush("user.pay")}>
                        <Icon type={Recharge} style={{fontSize: "26px", margin: "25px 0 5px 0"}}/><br/>
                        <span>余额充值</span>
                    </li>
                    <li style={{height: "100%", width: "25%", textAlign: "center"}}
                        onClick={() => historyPush("user.help")}>
                        <Icon type={Help} style={{fontSize: "26px", margin: "25px 0 5px 0"}}/><br/>
                        <span>使用帮助</span>
                    </li>
                    <li style={{height: "100%", width: "25%", textAlign: "center"}} onClick={() => historyPush("user.person.info")}>
                        <Icon type={User} style={{fontSize: "26px", margin: "25px 0 5px 0"}}/><br/>
                        <span>我的账户</span>
                    </li>
                </ul>
                <div style={{marginBottom: "10px", display: "flex", justifyContent: "space-between",backgroundColor:"#fff",borderRadius:"5px",padding:"13px 13px 10px 13px",boxSizing:"border-box"}}>
                    <span style={{fontSize: "12px"}}><Icon type={Type} style={{marginRight: "17px", fontSize: "15px"}}/>点此下载代练APP，一键安装，方便随时使用</span>
                    <Icon type={Than} style={{fontSize:"13px"}}/>
                </div>
                <List header='活动信息' className={list} style={{marginBottom:"10px"}}>
                    {users.map(user => (
                        <List.Item
                            className={icon}
                            key={user.key}
                            prefix={
                                <Icon type={Gift} style={{fontSize: "18px"}}/>
                            }
                            extra={""}
                            description={user.description}
                            onClick={() => {
                                if(user?.key == 1){
                                    historyPush("other.person.summer")
                                }else{
                                    historyPush("other.person.invite")
                                }
                            }}
                        >
                            {user.name}
                        </List.Item>
                    ))}
                </List>
                <List header='公告信息' className={list}>
                    {notice.map(user => (
                        <List.Item
                            className={icon}
                            key={user.key}
                            prefix={
                                <Icon type={Message} style={{fontSize: "18px",color:"#ff8f1f"}}/>
                            }
                            extra={
                                ''
                            }
                            onClick={() => {
                                historyPush("other.person.info")
                            }}
                        >
                            {user.name}
                        </List.Item>
                    ))}
                </List>
            </div>
        </Body>
    );
}
