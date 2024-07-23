import React from 'react'
import {Body, Icon} from "@/components";
import {Money, Refresh, Text1, TypeAll} from "@/components/icon";
import {useModel} from "umi";
import {Card, Grid, List, Toast} from "antd-mobile";
import {getWebUserInfo} from "@/service/person/info";
import {historyPush} from "@/utils/route";
import {createStyles, useTheme} from "antd-style";

const useStyles = createStyles(({isDarkMode,token}) => {
    return {
        list: {
            ".adm-list-body": {
                borderTop: "none !important",
                borderBottom: "none !important",
                borderRadius: "8px"
            },
            ".adm-list-item": {
                paddingLeft: "0 !important"
            },
            ".adm-list-item-content": {
                paddingLeft: "12px !important"
            }
        },
        card: {
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            },
            margin: "0 10px",
            "--adm-card-padding-inline": 0
        },
        item: {
            fontSize: "14px",
            color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)",
            ":hover":{
                color:isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
            }
        },
        card1:{
            backgroundColor: token.colorPrimary, paddingLeft: "20px", borderRadius: 0
        },
        money:{
            color: "rgba(255,255,255,0.8)", fontSize: "15px"
        },
        h1:{
            color: "#fff",
            fontSize: "40px",
            marginTop: "0",
            marginBottom: "0"
        },
        blue:{
            fontSize: "22px", color: "blue"
        },
        green:{
            fontSize: "22px", color: "#05d005"
        },
        orange:{
            fontSize: "22px", color: "#ff8f1f"
        }
    }
})
export default () => {
    const {styles: {list, card, item,card1,money,h1,blue,green,orange}} = useStyles()
    const user = useModel("user")
    return (
        <Body showHeader={false} bodyStyle={{padding: 0}} space={false}>
            <Grid columns={1} gap={8}>
                <Grid.Item>
                    <Card className={card1}>
                        <p className={money}>账户余额(元)<Icon onClick={() => {
                            getWebUserInfo()
                            Toast.show({
                                content: '刷新成功',
                                position: 'top',
                            })
                        }} style={{marginLeft: "10px"}} type={Refresh}/></p>
                        <h1 className={h1}>{user?.web?.money}</h1>
                    </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card className={card}>
                        <List className={list} style={{borderRadius: "5px"}}>
                            <List.Item className={item}
                                       prefix={<Icon className={blue} type={Money}/>}
                                       onClick={() => historyPush("user.pay.recharge")}>
                                充值金额
                            </List.Item>
                            <List.Item className={item}
                                       prefix={<Icon className={orange} type={TypeAll}/>}
                                       onClick={() => historyPush("user.pay.station")}>
                                开通主站
                            </List.Item>
                        </List>
                    </Card>
                </Grid.Item>
                <Grid.Item>
                    <Card className={card}>
                        <List className={list}>
                            <List.Item className={item}
                                       prefix={<Icon className={green} type={Text1}/>}
                                       onClick={() => historyPush("user.pay.record")}>
                                订单记录
                            </List.Item>
                            <List.Item className={item}
                                       prefix={<Icon className={green}  type={Text1}/>}
                                       onClick={() => historyPush("user.pay.balance")}>
                                余额明细
                            </List.Item>
                        </List>
                    </Card>
                </Grid.Item>
            </Grid>
        </Body>
    )
}