import React from 'react'
import {Body, Icon} from "@/components";
import {Card} from "antd-mobile";
import {Danger, Time, User} from "@/components/icon";
export default () => {
    return (
        <Body title="帮助信息" bodyStyle={{padding:"10px"}}>
                <Card>
                    <p style={{fontSize: "13px", color: "red",textAlign:"center",fontWeight:600,marginBottom:"20px"}}>关于禁止养号、禁止挂机违规用途号码的说明</p>
                    <div style={{fontSize:"11px",color:"gray",borderBottom:"1px dashed #eeeeee",paddingBottom:"5px"}}>
                        <span style={{marginRight: "15px"}}><Icon type={User} style={{marginRight:"2px"}}/>系统管理员</span>
                        <span><Icon type={Time} style={{marginRight:"2px"}}/>2022-03-31</span>
                    </div>
                    <p style={{fontSize:"13px",marginTop:"20px",fontWeight:600}}>
                        尊敬的用户您好：
                    </p>
                    <p>
                        本站为正规等级代练平台，仅接受个人正常聊天使用的号码进行代练，不是个人正常使用的号码请勿下单。
                    </p>
                    <p>
                        不能下单的号码类型枚举：批量注册的、批量购买的、批量养等级的、现在及未来会对外出售\出租的、公司业务使用的、游戏业务使用的，
                        各类工作室使用的、涉及违法的(涉黄/诈骗/赌博等等)
                    </p>
                    <p style={{color:"#f38e1b"}}>
                        包括且不限于以上类型，系统严禁养号、严禁挂机违规用途号码，
                        <span style={{color:"#d125f4"}}>不是个人正常聊天使用的号码都不能下单，</span>
                        望理解与配合，感谢大家支持。
                    </p>
                    <p style={{color:"#f66666"}}>
                        <Icon type={Danger} style={{marginRight:"3px"}}/>
                        代练以上违规号码将永久拉黑账号，终止并冻结账号下所有已下单号码的代练服务，必要时会将违规挂号账户所有信息移交至公安平台。
                    </p>
                    <p style={{color:"#d125f4",fontWeight:600}}>
                        注：新注册号码请自行挂到5级后再下单，5级以下小号无法正常代练。
                    </p>
                </Card>
        </Body>
    )

}