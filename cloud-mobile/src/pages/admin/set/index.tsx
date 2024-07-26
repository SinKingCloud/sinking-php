import React from 'react'
import {Body, Icon, Title} from "@/components";
import {Card, List} from "antd-mobile";
import {createStyles} from "antd-style";
import {Admin, Home, JM, KeFu, Money, Notice, Sets, Text1} from "@/components/icon";
import {historyPush} from "@/utils/route";

const useStyles = createStyles(({isDarkMode, token}) => {
    return {
        list: {
            ".adm-list-body": {
                borderTop: "none !important",
                borderBottom: "none !important",
                borderRadius: "10px"
            },
            ".adm-list-item": {
                paddingLeft: "0 !important"
            },
            ".adm-list-item-content": {
                paddingLeft: "12px !important"
            },
        },
        card: {
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            },
            "--adm-card-padding-inline": 0,
            ".adm-card-header-title": {
                paddingLeft: "12px"
            }
        },
        item: {
            fontSize: "14px",
            color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)",
            ":hover": {
                color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
            }
        },
        head: {
            backgroundColor: `${token.colorPrimary} !important`,
            color: "#fff"
        }
    }
})
export default () => {
    const {styles: {list, card, item, head}} = useStyles()
    return (
        <Body space={true} title="网站信息" showBack={false} headClassNames={head} titleStyle={{color: "#fff"}}>
            <Card className={card}>
                <List className={list}>
                    <List.Item className={item} prefix={<Icon type={Text1}/>} onClick={() => {
                        historyPush("admin.set.base")
                    }}>
                        基本设置
                    </List.Item>
                    <List.Item className={item} prefix={<Icon type={Money}/>} onClick={() => {
                        historyPush("admin.set.money")
                    }}>
                        价格设置
                    </List.Item>
                    <List.Item className={item} prefix={<Icon type={JM}/>} onClick={() => {
                    }}>
                        界面设置
                    </List.Item>
                    <List.Item className={item} prefix={<Icon type={KeFu}/>} onClick={() => {
                    }}>
                        客服设置
                    </List.Item>
                    <List.Item className={item} prefix={<Icon type={Notice}/>} onClick={() => {
                    }}>
                        通知设置
                    </List.Item>
                    <List.Item className={item} prefix={<Icon type={Admin}/>} onClick={() => {
                    }}>
                        域名设置
                    </List.Item>
                </List>
            </Card>
            <Card className={card}>
                <List className={list}>
                    <List.Item className={item} prefix={<Icon type={Home}/>} onClick={() => {
                        historyPush("user.index")
                    }}>
                        网站首页
                    </List.Item>
                </List>
            </Card>
        </Body>
    )
}