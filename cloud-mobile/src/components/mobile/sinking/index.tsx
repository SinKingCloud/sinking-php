import React from "react";
import {createStyles} from "antd-style";
import {TabBar} from "antd-mobile";
import {history, Outlet} from "umi";
import {ConfigProvider} from "antd-mobile";
import zhCN from "antd-mobile/es/locales/zh-CN";
import {useLocation} from "umi";
import {App} from "antd";

const useStyles = createStyles(({token, isDarkMode, css}): any => {
    return {
        container: css`
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        `,
        body: {
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            overflow: "hidden",
        },
        tab: {
            borderTop: "0.5px solid " + (isDarkMode ? "rgb(29, 29, 29)" : "rgb(236, 236, 236)"),
            height: "50px",
            backgroundColor: token?.colorBgContainer,
            ".adm-tab-bar-item": {
                color: isDarkMode ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)"
            },
            ".adm-tab-bar-item-active": {
                color: token?.colorPrimary + " !important"
            },
            ".adm-tab-bar-item-icon": {
                fontSize: "18px",
                paddingTop: "4px",
                boxSizing: "border-box"
            },
        },
    }
})

export interface TabItem {
    badge?: any;//徽标
    icon?: any;//图标
    title?: any;//tabBar文字
    key?: any;//路由
}

export type MobileProps = {
    showTabBar?: any; // 显示底部tabBar
    tabBar?: TabItem[];//tabBar
    tabBarStyles?: any;//tabBar样式
    tabBarClassNames?: any;//tabBar样式
    path?: any;//当前激活的tabBar
}

const SkLayout: React.FC<MobileProps> = (props: any) => {

    const {styles: {tab, container, body}} = useStyles();

    const {pathname} = useLocation();

    const {
        showTabBar = true,
        tabBar = [],
        path = pathname,
        tabBarStyles = {},
        tabBarClassNames = ""
    } = props;

    return <ConfigProvider locale={zhCN}>
        <App>
            <div className={container}>
                <div className={body}>
                    <Outlet/>
                </div>
                {showTabBar && (tabBar?.length || 0) > 0 && <div className={tab}>
                    <TabBar className={tabBarClassNames}
                            style={tabBarStyles}
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
        </App>
    </ConfigProvider>
        ;
}
export default SkLayout