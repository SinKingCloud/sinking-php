import Footer from "../footer";
import Header from "../header";
import Sider from "../sider";
import {createStyles, useResponsive, useTheme} from "antd-style";
import React, {useState} from "react";
import {Outlet, useModel} from "umi";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import Loading from "@/loading"
import {App, Button, ConfigProvider, Drawer, Layout} from "antd";
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

const useLayoutStyles = createStyles(({isDarkMode, token, css, responsive}): any => {
    return {
        sider: {
            zIndex: 2,
            boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
            height: '100vh',
            overflowY: "auto",
            position: "fixed !important",
            bottom: 0,
            ".ant-menu-dark":{
                backgroundColor:isDarkMode?"rgb(20,20,20) ":"rgb(0,21,41)",
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
            backgroundColor: isDarkMode ? "rgb(20,20,20) " :"#fff !important",
            ".ant-menu-dark":{
                backgroundColor:isDarkMode?"rgb(20,20,20) ":"rgb(0,21,41)",
            }
        },
        content: css`
            min-height: calc(100vh - 117px);
            width: 100%;
            height: 100%;
            > div > div > div:first-of-type {
                width: 80%;
                margin-left: 10%;
            }
            ${responsive.md} {
                > div > div > div:first-of-type {
                    width: 100%;
                    margin-left: 0;
                }
            }
        `,
        content1: {
            minHeight: "calc(100vh - 117px)",
            width: "100% !important",
            height: "100%",
        },
        footer: {
            textAlign: 'center',

        },
        flow: {
            display: "flex",
            justifyContent: "space-between",
        },
        logo: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: "220px",
            height: "55px",
        },
    };
});

export type LayoutProps = {
    loading?: boolean,
    menuCollapsedWidth?: Number,
    menuUnCollapsedWidth?: Number,
    menus?: any,
    onMenuClick?: (item: any) => void,
    onMenuBtnClick?: (state: boolean) => void,
    footer?: any,
    headerRight?: any,
    headerLeft?: any,
    onLogoClick?: () => void,
    collapsedLogo?: (isLight: boolean) => any,
    unCollapsedLogo?: (isLight: boolean) => any,
    menuBottomBtnIcon?: string,
    menuBottomBtnText?: string,
    onMenuBottomBtnClick?: () => void,
    layout?: string,
    themeType?:any
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
        layout = 'inline',
        themeType = "light"
    } = props;
    const systemTheme = useTheme();
    /*
     * 样式
     */
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const {
        styles: {
            sider,
            content1,
            header,
            content,
            footer,
            body,
            drawMenu,
            menuBtn,
            flow,
            logo,
        }
    } = useLayoutStyles();
    const {mobile, md} = useResponsive();
    const menuBtnOnClick = () => {
        let status: boolean;
        if ((layout == 'inline' && mobile) || (layout == 'horizontal' && !md)) {
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
    /**
     * 获取菜单
     * @param mode 布局模式
     */
    const getSider = (mode) => {
        mode = mode == "horizontal" ? mode : "inline";
        return <Sider layout={mode} collapsed={collapsed}
                      themeType={themeType}
                      onLogoClick={onLogoClick}
                      collapsedLogo={collapsedLogo}
                      unCollapsedLogo={unCollapsedLogo}
                      menuBottomBtnIcon={menuBottomBtnIcon}
                      menuBottomBtnText={menuBottomBtnText}
                      onMenuBottomBtnClick={onMenuBottomBtnClick}
                      menus={menus}
                      onMenuClick={(item) => {
                          onMenuClick?.(item)
                      }}/>
    }
    /**
     * 移动端抽屉
     */
    const drawer = <Drawer placement={"left"} closable={false} open={open} width={menuUnCollapsedWidth}
                           classNames={{body: drawMenu}}
                           onClose={() => {
                               setOpen(false)
                           }}>
        {getSider("inline")}
    </Drawer>;
    /**
     * 左右模式
     */
    const LayoutNormal = <Layout>
        <Layout.Sider  className={sider} trigger={null} collapsible collapsed={collapsed}
                      width={menuUnCollapsedWidth} collapsedWidth={menuCollapsedWidth}
                      hidden={mobile}  style={{background:themeType == "dark"? "rgb(0,21,41)" : "#fff"}}>
            {(mobile && drawer)
                ||
                getSider(layout)}
        </Layout.Sider>
        <Layout className={body}
                style={{marginLeft: mobile ? 0 : (collapsed ? menuCollapsedWidth + "px" : menuUnCollapsedWidth + "px")}}>
            <Layout.Header className={header} >
                <Header left={<div><Button type="text" size={"large"}
                                           icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                           onClick={menuBtnOnClick} className={menuBtn}/>{headerLeft}</div>}
                        right={headerRight}/>
            </Layout.Header>
            <Layout.Content className={content1}>
                <Outlet/>
            </Layout.Content>
            {props?.footer && <Layout.Footer className={footer}>
                <Footer> {props?.footer}</Footer>
            </Layout.Footer>}
        </Layout>
    </Layout>;
    /**
     * 上下模式
     */
    const LayoutFlow = <Layout>
        <Layout.Header className={header} style={{background:themeType == "dark"? systemTheme?.isDarkMode?"rgb(20,20,20)":"rgb(0,21,41)" : "#fff" }}>
            {!md && <Header left={<div>
                <Button type="text" size={"large"} icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={menuBtnOnClick} className={menuBtn}/>
                {headerLeft}
            </div>} right={headerRight}/>}
            {(!md && drawer) ||
                <div className={flow} style={{background:themeType == "dark"? systemTheme?.isDarkMode?"rgb(20,20,20)":"rgb(0,21,41)" : systemTheme?.isDarkMode? "rgb(20,20,20)" : "#fff"}}>
                    <div className={logo}>
                        {unCollapsedLogo?.(!systemTheme?.isDarkMode)}
                    </div>
                    {getSider(layout)}
                    <div>{headerRight}</div>
                </div>
            }
        </Layout.Header>
        <Layout.Content className={content}>
            <Outlet/>
        </Layout.Content>
        {props?.footer && <Layout.Footer className={footer}>
            <Footer> {props?.footer}</Footer>
        </Layout.Footer>}
    </Layout>;
    return (
        <ConfigProvider locale={zhCN}>
            <App>
                {(loading && <Loading/>) || (layout == "horizontal" ? LayoutFlow : LayoutNormal)}
            </App>
        </ConfigProvider>
    );
}
export default SinKing;