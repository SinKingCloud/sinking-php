import React from 'react'
import {Body, Icon, Title} from "@/components";
import {Card, Grid, List} from "antd-mobile";
import {UnorderedListOutline} from "antd-mobile-icons";
import {createStyles} from "antd-style";
import {JM, KeFu} from "@/components/icon";
const useStyles = createStyles(({isDarkMode,token}) => {
    return {
        list: {
            ".adm-list-body": {
                borderTop: "none !important",
                borderBottom: "none !important",
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
    }
})
export default () => {
    const {styles: {list, card, item}} = useStyles()
    return (
        <Body showHeader={false}  space={true}>
           <Card title={<Title>网站设置</Title>} className={card}>
               <List className={list}>
                   <List.Item className={item} prefix={<UnorderedListOutline />} onClick={() => {}}>
                       价格设置
                   </List.Item>
                   <List.Item className={item} prefix={<Icon type={JM}/>} onClick={() => {}}>
                       界面设置
                   </List.Item>
                   <List.Item className={item} prefix={<Icon type={KeFu}/>} onClick={() => {}}>
                       客服设置
                   </List.Item>
                   <List.Item className={item} prefix={<UnorderedListOutline />} onClick={() => {}}>
                       通知设置
                   </List.Item>
                   <List.Item className={item} prefix={<UnorderedListOutline />} onClick={() => {}}>
                       域名设置
                   </List.Item>
               </List>
           </Card>
        </Body>
    )
}