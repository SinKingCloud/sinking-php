import React, {useEffect, useRef} from "react";
import {createStyles} from "antd-style";
import {TabBar} from "antd-mobile";
import {Outlet} from "umi";
import {ConfigProvider} from "antd-mobile";
import {ConfigProvider as AntdConfigProvider} from "antd";
import zhCN from "antd-mobile/es/locales/zh-CN";
import antdZhCN from "antd/es/locale/zh_CN";
import {useLocation} from "umi";
import {App} from "antd";

const useStyles = createStyles(({token, isDarkMode, css, responsive}): any => {
    return {
        container: css`
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            max-width: 500px;
            margin: 0 auto;
            box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.13);

            ${responsive.mobile} {
                max-width: none;
            }
            
            .adm-mask{
                max-width: 500px !important;
                width: 100%;
                left: initial !important;
            }

            .adm-popup {
                max-width: 500px !important;
                margin: 0 auto !important;
            }

            .adm-popup-body {
                max-width: 500px !important;
                width: 100%;
                left: initial !important;
                box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.2);
            }
        `,
        body: {
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            overflow: "hidden",
            background: isDarkMode ? "rgb(20,20,20)" : "rgb(246,246,246)",
            ".adm-list-item-content": {
                borderTop: isDarkMode ? `0.5px solid rgb(46, 46, 46) !important` : `0.5px solid rgb(233, 233, 233) !important`
            }
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
    tabBarActiveKey?: any;//tabBar选中key
    tabBarStyles?: any;//tabBar样式
    tabBarClassNames?: any;//tabBar样式
    path?: any;//当前激活的tabBar
    onTabBarChange?: (key: any) => void;//tabBar改变事件
    bodyStyle?: any;//内容样式
    bodyClassName?: any;//内容class
}

let VirtualRef = null;//虚拟挂载节点

const SkLayout: React.FC<MobileProps> = (props: any) => {

    const {styles: {tab, container, body}} = useStyles();

    const {pathname} = useLocation();

    const {
        showTabBar = true,
        tabBar = [],
        tabBarActiveKey = pathname,
        tabBarStyles = {},
        tabBarClassNames = "",
        onTabBarChange = undefined,
        bodyStyle = undefined,
        bodyClassName = "",
    } = props;

    VirtualRef = useRef();

    return <ConfigProvider locale={zhCN}>
        <AntdConfigProvider locale={antdZhCN}>
            <App>
                <div className={container}>
                    <div ref={VirtualRef}/>
                    <div className={body + " " + bodyClassName} style={bodyStyle}>
                        <Outlet/>
                    </div>
                    {showTabBar && (tabBar?.length || 0) > 0 && <div className={tab}>
                        <TabBar className={tabBarClassNames}
                                style={tabBarStyles}
                                activeKey={tabBarActiveKey}
                                onChange={(key) => {
                                    onTabBarChange?.(key);
                                }}>
                            {tabBar.length > 0 && tabBar?.map((item: any) => (
                                <TabBar.Item key={item.key} icon={item.icon} title={item.title}/>
                            ))}
                        </TabBar>
                    </div>}
                </div>
            </App>
        </AntdConfigProvider>
    </ConfigProvider>;
}

export {
    VirtualRef
}

export default SkLayout