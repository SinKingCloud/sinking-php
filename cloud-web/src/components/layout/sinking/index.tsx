import Footer from "../footer";
import Header from "../header";
import Sider from "../sider";
import {createStyles, useResponsive} from "antd-style";
import React, {useEffect, useState} from "react";
import {Outlet} from "umi";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import Loading from "@/loading"
import {App, Button, Col, ConfigProvider, Drawer, Layout, Menu, Row} from "antd";
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import {history} from "@@/core/history";
import {useLocation, useModel, useSelectedRoutes} from "@@/exports";
import Settings from "@/../config/defaultSettings"

const useLayoutStyles = createStyles(({isDarkMode, token,css,responsive}): any => {
    return {
        sider: {
            zIndex: 2,
            boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
            height: '100vh',
            overflowY: "auto",
            position: "fixed !important",
            bottom: 0,
            ".ant-layout-header": {
                backgroundColor: token?.colorBgContainer
            }
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
            transform: "translateY(1px)",
            backgroundColor: isDarkMode ? "black" : "transparent"
        },
        header: {
            padding: 0,
            height: "55px",
            lineHeight: "55px !important",
            width: "100%",
            zIndex: 3,
            boxShadow: "0 2px 8px 0 " + (isDarkMode ? "rgba(0, 0, 0, 0.25)" : "rgba(29, 35, 41, 0.05)"),
            position: "sticky",
            top: 0,
            userSelect: "none",
            background: token?.colorBgContainer + " !important"
        },
        content: css`
            min-height: calc(100vh - 117px);
            width: 100%;
            height: 100%;
            > div > div > div:first-of-type {
                width: 80%;
                margin-left: 10%;
            }
            ${responsive.xs || responsive.sm || responsive.md}{
                > div > div > div:first-of-type {
                    width: 100%;
                    margin-left: 0;
                }
            }
        `,
        content1:{
            minHeight: "calc(100vh - 117px)",
            width: "100% !important",
            height: "100%",
        },
        footer: {
            textAlign: 'center',
            transform: "translateY(-1px)",
        },
        unCollapsed: {
            height:"55px",
            width:"220px",
            marginLeft:"8px",
            overflow: "hidden",
            position: "absolute",
            display: "inline-flex",
            ">img": {
                width: "30px",
                float: "left"
            },
            ">div": {
                color: "#0051eb",
                fontSize: "22px",
                marginLeft: "5px", fontWeight: "bolder",
                float: "left",
                lineHeight: "55px",
                whiteSpace: "nowrap",
            }
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
    mode?:"inline" | "horizontal",
};

const SinKing: React.FC<LayoutProps> = (props) => {
    const {
        loading = false,
        menus,
        onMenuClick,
        onMenuBtnClick,
        onLogoClick,
        collapsedLogo,
        unCollapsedLogo,
        headerRight,
        headerLeft,
        menuCollapsedWidth = 60,
        menuUnCollapsedWidth = 220,
        menuBottomBtnIcon = undefined,
        menuBottomBtnText = undefined,
        onMenuBottomBtnClick,
        mode,
    } = props;
    /*
     * 样式
     */
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const {styles: {sider,content1, header, content, footer, body, drawMenu, menuBtn,unCollapsed}} = useLayoutStyles();
    const {mobile} = useResponsive();
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
    const web = useModel("web");
    const [selectedKeys, setSelectedKeys] = useState<any>([]);
    const location = useLocation();
    const match = useSelectedRoutes();
    const initSelectMenu = () => {
        setSelectedKeys([location?.pathname]);
        let temp = []
        for (let i = 0; i < match?.length; i++) {
            temp.push(match[i]?.pathname);
        }
    }
    useEffect(() => {
        initSelectMenu();
    }, [location]);
    const LayoutSlider = ()=>{
        return (<ConfigProvider locale={zhCN}>
            <App>
                {(loading && <Loading/>) || <Layout>
                    <Layout.Sider className={sider} trigger={null} collapsible collapsed={collapsed}
                                  width={menuUnCollapsedWidth} collapsedWidth={menuCollapsedWidth}
                                  hidden={mobile}>
                        {(mobile &&
                                <Drawer placement={"left"} closable={false} open={open} width={menuUnCollapsedWidth}
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
                    </Layout.Sider>
                    <Layout className={body}
                            style={{marginLeft: mobile ? 0 : (collapsed ? menuCollapsedWidth + "px" : menuUnCollapsedWidth + "px")}}>
                        <Layout.Header className={header}>
                            <Button type="text" size={"large"}
                                    icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                    onClick={menuBtnOnClick} className={menuBtn}/>
                            <Header left={headerLeft} right={headerRight}/>
                        </Layout.Header>
                        <Layout.Content className={content1}>
                            <Outlet/>
                        </Layout.Content>
                        {props?.footer && <Layout.Footer className={footer}>
                            <Footer> {props?.footer}</Footer>
                        </Layout.Footer>}
                    </Layout>
                </Layout>}
            </App>
        </ConfigProvider>);
    }
    const LayoutHeader = ()=>{
        return (<ConfigProvider locale={zhCN}>
            <App>
                {(loading && <Loading/>) || <Layout >
                    <Layout.Header className={header}>
                        {mobile && <Button type="text" size={"large"}
                                           icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                           onClick={menuBtnOnClick} className={menuBtn}/> || null}
                        <Header left={
                            <>
                                {(mobile &&
                                        <Drawer placement="left" closable={false} open={open} width={menuUnCollapsedWidth}
                                                classNames={{body: drawMenu}}
                                                onClose={() => {
                                                    setOpen(false)
                                                }}>
                                            <Sider collapsed={collapsed}
                                                   unCollapsedLogo={unCollapsedLogo}
                                                   menus={menus}
                                                   onMenuClick={(item) => {
                                                       setOpen(false);
                                                       onMenuClick?.(item);
                                                   }}/>
                                        </Drawer>)
                                    ||
                                    <>
                                        <div className={unCollapsed}>
                                            <img src={web?.info?.logo || (Settings?.basePath || "/") + "logo.svg"}
                                                 alt="沉沦云网络"/>
                                            <div>{web?.info?.name || Settings?.title}</div>
                                        </div>
                                        <Menu mode={mode} selectedKeys={selectedKeys}
                                              style={{marginLeft: "180px", fontSize: "13px"}}
                                              items={menus} onClick={(item: any) => {
                                            history.push(item?.key);
                                        }}/>
                                    </>
                                }
                            </>
                        } right={headerRight}/>
                    </Layout.Header>
                    <Layout.Content className={content}>
                        <Outlet/>
                    </Layout.Content>
                    {props?.footer && <Layout.Footer className={footer}>
                        <Footer> {props?.footer}</Footer>
                    </Layout.Footer>}
                </Layout>}
            </App>
        </ConfigProvider>)
    }
    const menuMode = ()=>{
        if(mode == "inline"){
            return LayoutSlider()
        }else{
            return LayoutHeader()
        }
    }
  return menuMode()

}
export default SinKing;