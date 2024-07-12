import React from 'react'
import {Body, Icon} from "@/components";
import {Card, List} from "antd-mobile";
import {createStyles} from "antd-style";
import {Tex} from "@/components/icon";
import {history} from "umi";
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
                fontSize: "10px !important",
            }
        },
    }
})
export default () => {
    const {styles: {list}} = useStyles()
    const users = []
    const cdkS = []
    return (
        <Body title="暑假活动" right={<Icon type={Tex} style={{fontSize:"16px",color:"#fff"}} onClick={()=>historyPush("other.person.join")}/>}
              headStyle={{backgroundColor:"#f655a6",color:"#fff"}} titleStyle={{color: "#fff"}} bodyStyle={{backgroundColor:"#faf8f8",padding:"10px",height:"100vh"}}>
            <Card style={{marginBottom:"10px"}}>
                <p style={{textAlign:"center",color:"#f655a6",fontSize:"14px",lineHeight:"20px"}}>
                    点燃夏日激情，舞动青春之歌<br/>
                    <span style={{fontSize:"13px"}}>暑假优惠活动限时开启，欢迎新老用户参与</span>
                </p>
            </Card>
            <List header='代练订单列表' className={list} style={{marginBottom:"10px"}}>
                {users?.length > 0 && users.map(user => (
                    <List.Item
                        key={user.key}
                        description={user.description}
                    >
                        {user.name}
                    </List.Item>
                )) ||  <p style={{height:"40px",lineHeight:"40px",textAlign:"center",fontSize:"13px"}}>
                    您没有可领取卡密的订单哦，快去下单代练吧</p>}
            </List>
            <List header='领取的卡密列表' className={list} style={{marginBottom:"10px"}}>
                {cdkS?.length > 0 && cdkS.map(cdk => (
                    <List.Item
                        key={cdk.key}
                        description={cdk.description}
                    >
                        {cdk.name}
                    </List.Item>
                )) ||  <p style={{height:"40px",lineHeight:"40px",textAlign:"center",fontSize:"13px"}}>
                    暂无卡密</p>}
            </List>
            <List header='活动说明' className={list} >
                <List.Item style={{fontSize:"11px"}}>
                    <p style={{color:"#477eeb"}}>1、永久代练各套装均五折优惠、下单时可直接享受折扣价。</p>
                    <p style={{color:"#477eeb",lineHeight:"13px"}}>2、下单或续费任意套装，年费代练额外送6个月、3个月代练额外送1个月。</p>
                    <p style={{color:"#f655a6",lineHeight:"13px"}}>PS：仅各套装代练参与活动，单项不参与，赠送的时间在本页领取卡密后使用卡密续费获得。</p>
                    <p style={{color:"#ff8f1f"}}>活动时间:&nbsp;&nbsp;&nbsp;7月1日凌晨0点&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;8月31日晚上12点</p>
                </List.Item>
            </List>
        </Body>
    )
}