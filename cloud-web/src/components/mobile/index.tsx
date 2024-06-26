import React from "react";
import {createStyles} from "antd-style";
import {NavBar, TabBar} from "antd-mobile";
import {Icon} from "@/components";
import {Home, Money, Shop, User} from "@/components/icon";
import {history, useLocation} from "umi";
import {ConfigProvider} from "antd";
import zhCN from "antd/locale/zh_CN";
const useStyles = createStyles(({isDarkMode,token}): any => {
    return {
        header: {
            height:"50px !important",
            position: 'sticky',
            top: "0px",
            zIndex: "999",
            backgroundColor:isDarkMode ? "rgb(20,20,20)" : "#fff",
            boxShadow: "0px 0px 2px rgba(0,0,0,0.2)",
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
            backgroundColor:isDarkMode ? "rgb(20,20,20)" : "#fff",
            boxShadow: "0px 0px 2px rgba(0,0,0,0.2)",
            ".adm-tab-bar-item":{
                color:isDarkMode ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)"
            },
            ".adm-tab-bar-item-active":{
                color:"#1677ff !important"
            }
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
    right?: any;// 导航栏右边内容
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
            key: '/user/person/log'
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
        children,
        right = undefined
    } = props

    return <>
        <ConfigProvider locale={zhCN}>
                {showHeader && <NavBar
                    className={header}
                    backArrow={showBack}
                    onBack={onBack}
                    right={right}
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
        </ConfigProvider>
    </>
}
export default Mobile