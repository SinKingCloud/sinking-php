import Body from "@/layouts/components/body";
import Footer from "@/layouts/components/footer";
import Header from "@/layouts/components/header";
import Sider from "@/layouts/components/sider";
import {createStyles, useResponsive} from "antd-style";
import React, {useState} from "react";
import {Outlet, useModel} from "umi";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import Loading from "@/loading"
import {App, Button, ConfigProvider, Drawer, Layout as SkLayout} from "antd";
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

const useLayoutStyles = createStyles((): any => {
    return {
        sider: {
            zIndex: 2,
            boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
            height: '100vh',
            position: "fixed !important",
            bottom: 0,
        },
        menuBtn: {
            width: "55px !important",
            height: "55px",
            lineHeight: "55px",
            fontSize: "0 !important",
            cursor: "pointer",
            float: "left",
            ":hover": {
                background: "none !important",
            }
        },
        drawMenu: {
            padding: "0px !important",
        },
        body: {
            transition: "margin-left 0.2s !important",
        },
        header: {
            padding: 0,
            height: "55px",
            lineHeight: "55px !important",
            width: "100%",
            zIndex: 1,
            boxShadow: "0 2px 8px 0 rgba(29, 35, 41, 0.05)",
            position: "sticky",
            top: 0,
            userSelect: "none",
        },
        content: {
            minHeight: "calc(100vh - 110px)",
            maxWidth: "100%",
            height: "100%",
            overflow: "auto"
        },
        footer: {
            textAlign: 'center',
        },
    };
});

export type LayoutProps = {
    loading?: boolean;//是否显示加载
    menuCollapsedWidth?: Number;//菜单关闭时宽度
    menuUnCollapsedWidth?: Number;//菜单开启时宽度
    menus?: any;//菜单列表
    onMenuClick?: (item: any) => void;//点击菜单回调
    onMenuBtnClick?: (state: boolean) => void;//菜单按钮点击
    footer?: any;//底部内容
    headerRight?: any;//顶部右侧内容
    headerLeft?: any;//顶部左侧内容
    onLogoClick?: () => void;//点击logo回调
    collapsedLogo?: (isLight: boolean) => any;//折叠时logo
    unCollapsedLogo?: (isLight: boolean) => any;//展开时logo
    menuBottomBtnIcon?: string;//底部按钮图标
    menuBottomBtnText?: string;//底部按钮文字
    onMenuBottomBtnClick?: () => void;//点击底部按钮回调
};

const Layout: React.FC<LayoutProps> = (props) => {
    const {
        loading = false,
        menus,
        onMenuClick,
        onMenuBtnClick,
        onLogoClick,
        collapsedLogo,
        unCollapsedLogo,
        headerRight,
        menuCollapsedWidth = 60,
        menuUnCollapsedWidth = 220,
        menuBottomBtnIcon = undefined,
        menuBottomBtnText = undefined,
        onMenuBottomBtnClick,
    } = props;
    /*
     * 样式
     */
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const {styles: {sider, header, content, footer, body, drawMenu, menuBtn,}} = useLayoutStyles();
    const {mobile} = useResponsive();
    const systemTheme = useModel("theme");
    const menuBtnOnClick = () => {
        let status: boolean;
        if (mobile) {
            if (collapsed) {
                setCollapsed(false);
            }
            status = !open
            setOpen(status);
        } else {
            status = !collapsed
            setCollapsed(status);
        }
        onMenuBtnClick?.(status);
    }

    return (
        <ConfigProvider locale={zhCN}>
            <App>
                {(loading && <Loading/>) || <SkLayout>
                    <SkLayout.Sider className={sider} trigger={null} collapsible collapsed={collapsed}
                                    width={menuUnCollapsedWidth} collapsedWidth={menuCollapsedWidth} hidden={mobile}>
                        {(mobile && <Drawer placement={"left"} closable={false} open={open} width={menuUnCollapsedWidth}
                                            classNames={{body: drawMenu}}
                                            onClose={() => {
                                                setOpen(false)
                                            }}>
                                <Sider collapsed={collapsed}
                                       unCollapsedLogo={unCollapsedLogo}
                                       menuBottomBtnIcon={menuBottomBtnIcon}
                                       menuBottomBtnText={menuBottomBtnText}
                                       onMenuBottomBtnClick={onMenuBottomBtnClick}
                                       menus={menus}
                                       onLogoClick={onLogoClick} collapsedLogo={collapsedLogo}
                                       onMenuClick={(item) => {
                                           setOpen(false);
                                           onMenuClick?.(item);
                                       }}/>
                            </Drawer>)
                            ||
                            <Sider collapsed={collapsed}
                                   onLogoClick={onLogoClick}
                                   collapsedLogo={collapsedLogo}
                                   unCollapsedLogo={unCollapsedLogo}
                                   menuBottomBtnIcon={menuBottomBtnIcon}
                                   menuBottomBtnText={menuBottomBtnText}
                                   onMenuBottomBtnClick={onMenuBottomBtnClick}
                                   menus={menus}
                                   onMenuClick={(item) => {
                                       onMenuClick?.(item);
                                   }}/>}
                    </SkLayout.Sider>
                    <SkLayout className={body}
                              style={{marginLeft: mobile ? 0 : (collapsed ? menuCollapsedWidth + "px" : menuUnCollapsedWidth + "px")}}>
                        <SkLayout.Header className={header}>
                            <Button type="text" size={"large"}
                                    icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                    onClick={menuBtnOnClick} className={menuBtn}/>
                            <Header  right={headerRight}/>
                        </SkLayout.Header>
                        <SkLayout.Content className={content}>
                            <Outlet/>
                        </SkLayout.Content>
                        {props?.footer && <SkLayout.Footer className={footer}>
                            <Footer> {props?.footer}</Footer>
                        </SkLayout.Footer>}
                    </SkLayout>
                </SkLayout>}
            </App>
        </ConfigProvider>
    );
}
export {
    Body,
    Footer,
    Header,
    Sider,
}
export default Layout;