import React from 'react'
import {Body, Icon} from "@/components";
import {Money, Refresh,Text1,Type} from "@/components/icon";
import {useModel} from "umi";
import {List, Toast} from "antd-mobile";
import {getWebUserInfo} from "@/service/person/info";
import {historyPush} from "@/utils/route";
import {useTheme} from "antd-style";
export default () => {
    const theme = useTheme()
    const user = useModel("user")
    return (
        <Body showHeader={false}>
            <div style={{backgroundColor:"rgb(92,165,214)",paddingLeft:"20px",overflow:"hidden"}}>
                <p style={{color:"rgba(255,255,255,0.8)",fontSize:"15px"}}>账户余额(元)<Icon onClick={()=>{
                    getWebUserInfo()
                    Toast.show({
                        content: '刷新成功',
                        position: 'top',
                    })
                }} style={{marginLeft:"10px"}} type={Refresh}/></p>
                    <h1 style={{color: "#fff", fontSize: "40px"}}>{user?.web?.money}</h1>
            </div>
            <List style={{marginBottom: "10px"}}>
                <List.Item  style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}} prefix={<Icon style={{fontSize:"22px",color:"blue"}} type={Money}/>} onClick={() =>historyPush("pay.recharge")}>
                    充值金额
                </List.Item>
                <List.Item style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}} prefix={<Icon style={{fontSize:"22px",color:"#ff8f1f"}} type={Type}/>} onClick={() =>historyPush("pay.station")}>
                    开通主站
                </List.Item>
            </List>
            <List>
                <List.Item style={{fontSize:"14px",color:theme.isDarkMode ? "#b3b3b3":"rgba(0,0,0,0.7)"}} prefix={<Icon style={{fontSize:"22px",color:"#05d005"}} type={Text1}/>} onClick={() => {}}>
                    余额记录
                </List.Item>
            </List>
        </Body>
    )
}