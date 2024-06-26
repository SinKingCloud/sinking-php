import React from "react";
import {createStyles} from "antd-style";
import {NavBar, TabBar} from "antd-mobile";
import {Icon} from "@/components";
import {Home, Money, Shop, User} from "@/components/icon";
import {history, useLocation} from "umi";
const useStyles = createStyles((): any => {
    return {
        header: {
            height:"50px !important",
            position: 'sticky',
            top: "0px",
            zIndex: "999",
        },
        body: {
            height: "calc(100vh - 100px)",
            overflowY: "auto",
        },
        tab_bar: {
            position: "fixed",
            bottom: "0px",
            zIndex: 999,
            width: "100vw",
            backgroundColor: "#fff",
            boxShadow: "0px 0px 2px rgba(0,0,0,0.2)",
        },
    }
})

export interface TabItem {
    icon?: any;//图标
    title?: any;//tabBar文字
    key?: any;//路由
}
export type MobileProps = {
    onBack?: () => void, //返回按钮的事件
    title?: any;// 头部标题显示
    showTabBar?: any; // 显示底部tabBar
    showBack?: any;// 显示返回的按钮
    children?: any;//子内容
    showHeader?: any;//显示头部header
    tabBar?: TabItem[];//tabBar
    path?: any;//激活色
}
const Mobile: React.FC<MobileProps> = (props: any) => {
    const tabs = [
        {
            icon: <Icon type={Home}/>,
            title: '数据概览',
            key: '/user/index'
        },
        {
            icon: <Icon type={Shop}/>,
            title: '在线商城',
            key: '/user/shop/site'
        },
        {
            icon: <Icon type={Money}/>,
            title: '财务管理',
            key: '/user/pay/recharge'
        },
        {
            icon: <Icon type={User}/>,
            title: '账户管理',
            key: '/user/person/setting'
        }
    ]
    const back = ()=>{
        history.back()
    }
    const {pathname} = useLocation()
    const {styles: {header, body, tab_bar}} = useStyles()
    const {
        onBack = back,
        title = undefined,
        showTabBar = true,
        showBack = true,
        showHeader = true,
        tabBar = tabs,
        path = pathname,
        children
    } = props

    return <>
        {showHeader && <NavBar
            className={header}
            backArrow={showBack}
            onBack={onBack}
        >
            {title}
        </NavBar>}
        <div className={body}>
            {children}
        </div>
        {showTabBar && <div className={tab_bar}>
            <TabBar
                activeKey={path}
                onChange={(key)=>{
                    history.push(key)
                }}>
                {tabBar?.map(item => (
                    <TabBar.Item key={item.key} icon={item.icon} title={item.title}/>
                ))}
            </TabBar>
        </div>}
    </>
}
export default Mobile