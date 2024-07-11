import React from 'react'
import {Body, Icon} from "@/components";
import {Clock, Cuo, Del, Dui, Ellipsis, Explore, Search, Type} from "@/components/icon";
import {Dropdown} from "antd";
import {Button} from "antd-mobile";
import {history} from "umi";
import {historyPush} from "@/utils/route";

export default () => {
    const items = [
        {
            key: "level",
            label: (
                <span>
                    <Icon type={Explore} style={{marginRight: "5px"}}/>
                    等级查询
                </span>
            )
        },
        {
            key: "count",
            label: (
                <span>
                    <Icon type={Clock} style={{marginRight: "5px"}}/>
                    等级计算
                </span>
            )
        },
        {
            key: "account",
            label: (
                <span>
                    <Icon type={Search} style={{marginRight: "5px"}}/>
                    找回号码
                </span>
            )
        },
        {
            key: "recycle",
            label: (
                <span>
                    <Icon type={Del} style={{marginRight: "5px"}}/>
                    回收站
                </span>
            )
        },
    ]
    return (
        <Body title={"代练列表"} right={
            <>
                <Dropdown menu={{items}} placement="bottom" overlayStyle={{width: "max-content"}} arrow>
                    <Icon type={Type} style={{fontSize: "18px"}}/>
                </Dropdown>
                <Dropdown menu={{
                    items: [
                        {
                            key: "all",
                            label: (
                                <span><Icon type={Type} style={{marginRight: "5px"}}/>全部代练</span>
                            )
                        },
                        {
                            key: "normal",
                            label: (
                                <span><Icon type={Dui} style={{marginRight: "5px"}}/>正常代练</span>
                            )
                        },
                        {
                            key: "abnormal",
                            label: (
                                <span><Icon type={Cuo} style={{marginRight: "5px"}}/>异常代练</span>
                            )
                        }
                    ]
                }} placement="bottomLeft" arrow overlayStyle={{width: "max-content"}}>
                    <Icon type={Ellipsis} style={{fontSize: "18px", marginLeft: "20px"}}/>
                </Dropdown>
            </>
        }>
            <div>--------------------------------</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div><Button onClick={() => {
                history?.push("/admin/index")
            }}>后台</Button></div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div><Button onClick={() => {
                historyPush("other.person.info")
            }}>公告页面</Button></div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>etdsdsddsshdshjsdhjhdshhjdhjshjd</div>
            <div>--------------------------------</div>
        </Body>
    )

}