import React from 'react'
import {Body, Icon} from "@/components";
import {Money, Refresh,Text1,Type} from "@/components/icon";
import {useModel} from "umi";
import {Card, List, Toast} from "antd-mobile";
import {getWebUserInfo} from "@/service/person/info";
import {historyPush} from "@/utils/route";
import {createStyles, useTheme} from "antd-style";
const useStyles = createStyles(()=>{
    return{
        list:{
            ".adm-list-body":{
                borderTop:"none !important",
                borderBottom:"none !important"
            }
        },
        card: {
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            }
        }
    }
})
export default () => {
    const {styles:{list,card}} = useStyles()
    const theme = useTheme()
    const user = useModel("user")
    return (
        <Body showHeader={false}>
            <Card style={{backgroundColor:"rgb(92,165,214)",paddingLeft:"20px",marginBottom:"10px"}}>
                <p style={{color:"rgba(255,255,255,0.8)",fontSize:"15px"}}>账户余额(元)<Icon onClick={()=>{
                    getWebUserInfo()
                    Toast.show({
                        content: '刷新成功',
                        position: 'top',
                    })
                }} style={{marginLeft:"10px"}} type={Refresh}/></p>
                    <h1 style={{color: "#fff", fontSize: "40px",marginTop:"0",marginBottom:"0"}}>{user?.web?.money}</h1>
            </Card>
            <Card style={{marginBottom:"10px"}} className={card}>
                <List className={list}>
                    <List.Item  style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}} prefix={<Icon style={{fontSize:"22px",color:"blue"}} type={Money}/>} onClick={() =>historyPush("pay.recharge")}>
                        充值金额
                    </List.Item>
                    <List.Item style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}} prefix={<Icon style={{fontSize:"22px",color:"#ff8f1f"}} type={Type}/>} onClick={() =>historyPush("pay.station")}>
                        开通主站
                    </List.Item>
                </List>
            </Card>
          <Card className={card}>
              <List className={list}>
                  <List.Item style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}} prefix={<Icon style={{fontSize:"22px",color:"#05d005"}} type={Text1}/>} onClick={() => historyPush("pay.record")}>
                      订单记录
                  </List.Item>
                  <List.Item style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}} prefix={<Icon style={{fontSize:"22px",color:"#05d005"}} type={Text1}/>} onClick={() =>historyPush("pay.balance")}>
                      余额明细
                  </List.Item>
              </List>
          </Card>
        </Body>
    )
}