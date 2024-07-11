import React from 'react'
import {Body, Icon} from "@/components";
import {Card} from "antd-mobile";
import {Danger, Time, User} from "@/components/icon";
export default () => {
    return (
        <Body title={"公告信息"}>
            <div style={{
                padding: "10px",
                boxSizing: "border-box",
               // height: "calc(100vh - 45px)",
               // backgroundColor: "#faf8f8"
            }}>
                <Card>
                    <p style={{
                        fontSize: "13px",
                        color: "red",
                        textAlign: "center",
                        fontWeight: 600,
                        marginBottom: "20px"
                    }}>关于挂架状态频繁变为登录保护的通知</p>
                    <div style={{
                        fontSize: "11px",
                        color: "gray",
                        borderBottom: "1px dashed #eeeeee",
                        paddingBottom: "5px"
                    }}>
                        <span style={{marginRight: "15px"}}><Icon type={User}
                                                                  style={{marginRight: "2px"}}/>系统管理员</span>
                        <span><Icon type={Time} style={{marginRight: "2px"}}/>2022-03-31</span>
                    </div>
                    <p style={{fontSize: "13px", marginTop: "20px", fontWeight: 600}}>
                        尊敬的用户您好：
                    </p>
                    <p>由于TX更新，当前部分用户挂机出现需要频繁验证设备的问题，后台正在对此进行修复，修复后将另行通知，感谢您的支持与谅解。</p>
                </Card>
            </div>
        </Body>
    )

}