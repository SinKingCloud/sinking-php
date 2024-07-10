import React from 'react'
import {Body} from "@/components";
import {Card, List} from "antd-mobile";
import {createStyles} from "antd-style";
import { Typography } from 'antd';
const { Paragraph } = Typography;
const useStyles = createStyles(({css}) => {
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
        <Body title="邀请好友活动" >
            <div style={{
                padding: "10px",
                boxSizing: "border-box",
                height: "calc(100vh - 45px)",
                backgroundColor: "#faf8f8",
            }}>
                <Card style={{marginBottom:"10px"}}>
                    <p style={{textAlign:"center",color:"#477eeb",fontSize:"14px",lineHeight:"20px",margin:0}}>
                        点燃夏日激情，舞动青春之歌<br/>
                        <span style={{fontSize:"13px"}}>暑假优惠活动限时开启，欢迎新老用户参与</span>
                    </p>
                </Card>
                <Card style={{marginBottom:"10px"}}>
                    <p style={{textAlign:"center",fontSize:"14px",margin:"0 0 5px 0"}}>
                        邀请链接
                    </p>
                    <Paragraph copyable style={{textAlign:"center",fontSize:"16px",fontWeight:600,color:"#477eeb",display:"block"}}>https://cldg.aadg.ren/21530</Paragraph>
                </Card>
                    <div style={{display:"flex",borderRadius:"5px",fontSize:"10px",justifyContent:"space-between",padding:"8px 10px",backgroundColor:"#fff",boxSizing:"border-box"}}>
                        <span style={{color:"gray"}}>可兑换的卡密</span>
                        <span>活动积分:
                          <span style={{color:"red",fontWeight:600}}>0</span>
                        </span>
                    </div>
                <List className={list} style={{marginBottom:"10px"}}>
                    {users?.length > 0 && users.map(user => (
                        <List.Item
                            key={user.key}
                            extra={user.integral}
                        >
                            {user.name}
                        </List.Item>
                    )) ||  <p style={{height:"40px",lineHeight:"40px",textAlign:"center",fontSize:"13px"}}>
                        暂无卡密</p> }
                </List>
                <List header='兑换的卡密列表' className={list} style={{marginBottom:"10px"}}>
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
                    <List.Item style={{fontSize:"11px",lineHeight:"13px",color:"#477eeb"}}>
                        <p >1、通过邀请链接邀请好友进入网站并成功使用代练。（您的好友可免费体验7天的等级套装，无需付费）</p>
                        <p >2、每邀请一位好友可获得1个活动积分，活动积分可在本页面兑换各套装代练卡密，所有卡密可无限次兑换。</p>
                        <p>3、兑换的卡密无任何使用限制，可下单新代练或续费代练，自用、出售、赠送给他人使用等均可。动动手即可白嫖代练。</p>
                        <p>注：每位好友邀请一次有效，同一个账号、IP、设备均被视为同一人，重复邀请不会累积活动积分。</p>
                        <p style={{color:"#ff8f1f"}}>活动时间:&nbsp;&nbsp;&nbsp;7月1日凌晨0点&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;8月31日晚上12点</p>
                    </List.Item>
                </List>
            </div>
        </Body>
    )
}