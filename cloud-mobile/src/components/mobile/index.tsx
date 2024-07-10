import React from "react";
import {createStyles} from "antd-style";
import {TabBar} from "antd-mobile";
import {history, Outlet} from "umi";
import {ConfigProvider} from "antd";
import zhCN from "antd/locale/zh_CN";
import {useLocation} from "umi";
const useStyles = createStyles(({isDarkMode}): any => {
    return {
        container:{
            display: "flex",
            flexDirection: "column",
            position:"fixed",
            top:0,
            left:0,
            right:0,
            bottom:0,
        },
        tab_bar: {
            backgroundColor: isDarkMode ? "rgb(20,20,20)" : "#fff",
            boxShadow: "0px 0px 4px rgba(0,0,0,0.2)",
            ".adm-tab-bar-item": {
                color: isDarkMode ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)"
            },
            ".adm-tab-bar-item-active": {
                color: "#1677ff !important"
            },
            ".adm-tab-bar-item-icon":{
                fontSize:"18px",
                paddingTop:"4px",
                boxSizing:"border-box"
            },
        },
    }
})
export interface TabItem {
    icon?: any;//图标
    title?: any;//tabBar文字
    key?: any;//路由
}
export type MobileProps = {
    showTabBar?: any; // 显示底部tabBar
    tabBar?: TabItem[];//tabBar
    className?:any;//tabBar高度
    path?:any;//当前激活的tabBar
}
const Mobile: React.FC<MobileProps> = (props: any) => {
    const {styles: {tab_bar,container}} = useStyles()
    const {pathname} = useLocation()
    const {
        showTabBar = true,
        tabBar = [],
        className = false,
        path=pathname
    } = props
    const tabBarHeight = className ? {height:0} : {}
    return <>
        <ConfigProvider locale={zhCN}>
            <div className={container}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1 1 auto",
                    overflow: "hidden",
                }}>
                    <Outlet/>
                </div>
                    {showTabBar &&  <div className={tab_bar} style={tabBarHeight}>
                        <TabBar
                            activeKey={path}
                            onChange={(key) => {
                                history.push(key)
                            }}>
                            {tabBar.length > 0 && tabBar?.map((item: any) => (
                                <TabBar.Item key={item.key} icon={item.icon} title={item.title}/>
                            ))}
                        </TabBar>
                    </div>}
                </div>
        </ConfigProvider>
    </>
}
export default Mobile