import Footer from "../footer";
import Header from "../header";
import Sider from "../sider";
import {createStyles, useResponsive, useTheme} from "antd-style";
import React, {useState} from "react";
import {Outlet} from "umi";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import Loading from "@/loading"
import {App, Button, ConfigProvider, Drawer, Layout, Watermark} from "antd";
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
            backgroundColor: isDarkMode ? "black" : "transparent",
        },
        header: {
            padding: 0,
            height: "55px",
            lineHeight: "55px !important",
            width: "100%",
            zIndex: 3,
            boxShadow: "0 2px 8px 0 " + (isDarkMode ? "rgba(0, 0, 0, 0.25)" : "rgba(29, 35, 41, 0.05)"),
            position: "sticky !important",
            top: 0,
            userSelect: "none",
            background: token?.colorBgContainer + " !important",
            ".ant-menu-item-icon":{
                color:isDarkMode?"rgb(255,255,255,0.85)":""
            }
        },
        content: css`
            min-height: calc(100vh - 117px);
            width: 100%;
            height: 100%;

            > div > div > div > div:first-of-type {
                width: 80%;
                margin-left: 10%;
            }

            ${responsive.md} {
                > div > div > div > div:first-of-type {
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
            justifyContent: "space-between"
        },
        logo: {
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            width: "220px",
            height: "55px",
        },
        darkColor: {
            backgroundColor: "#001529 !important"
        }
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
    layout?: string;//布局
    menuTheme?: string;//菜单主题
    waterMark?: any;//水印
};

const SinKing: React.FC<LayoutProps> = (props) => {
    let {
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
        menuTheme = "light",
        waterMark = undefined
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
            darkColor
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
     * 获取菜单主题颜色
     */
    const getColor = () => {
        const mode = systemTheme?.isDarkMode ? "light" : (menuTheme == "dark" ? menuTheme : "light");
        return !systemTheme?.isDarkMode && mode == "dark" ? ' ' + darkColor : '';
    }

    /**
     * 获取水印字体
     */
    const getWaterMaskFont = () => {
        return {
            color: systemTheme?.isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.07)"
        };
    }

    /**
     * 获取菜单
     * @param mode 布局模式
     */
    const getSider = (mode) => {
        mode = mode == "horizontal" ? mode : "inline";
        menuTheme = menuTheme == "dark" ? menuTheme : "light";
        return <Sider layout={mode} theme={menuTheme} collapsed={collapsed}
                      onLogoClick={onLogoClick}
                      collapsedLogo={collapsedLogo}
                      unCollapsedLogo={unCollapsedLogo}
                      menuBottomBtnIcon={menuBottomBtnIcon}
                      menuBottomBtnText={menuBottomBtnText}
                      onMenuBottomBtnClick={onMenuBottomBtnClick}
                      menus={menus}
                      onMenuClick={(item) => {
                          setOpen(false);
                          onMenuClick?.(item);
                      }}/>;
    }

    /**
     * 获取outlet
     */
    const getOutlet = () => {
        return <Watermark gap={[200, 200]} font={getWaterMaskFont()} content={waterMark}>
            <Outlet/>
        </Watermark>;
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
        <Layout.Sider className={sider} trigger={null} collapsible collapsed={collapsed}
                      width={menuUnCollapsedWidth} collapsedWidth={menuCollapsedWidth}
                      hidden={mobile}>
            {(mobile && drawer)
                ||
                getSider(layout)}
        </Layout.Sider>
        <Layout className={body}
                style={{marginLeft: mobile ? 0 : (collapsed ? menuCollapsedWidth + "px" : menuUnCollapsedWidth + "px")}}>
            <Layout.Header className={header}>
                <Header left={<div><Button type="text" size={"large"}
                                           icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                           onClick={menuBtnOnClick} className={menuBtn}/>{headerLeft}</div>}
                        right={headerRight}/>
            </Layout.Header>
            <Layout.Content className={content1}>
                {getOutlet()}
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
        <Layout.Header className={header}>
            {!md && <Header left={<div>
                <Button type="text" size={"large"} icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={menuBtnOnClick} className={menuBtn}/>
                {headerLeft}
            </div>} right={headerRight}/>}
            {(!md && drawer) ||
                <div className={flow + getColor()}>
                    <div className={logo}>
                        {unCollapsedLogo?.(!systemTheme?.isDarkMode)}
                    </div>
                    {getSider(layout)}
                    <div>{headerRight}</div>
                </div>
            }
        </Layout.Header>
        <Layout.Content className={content}>
            {getOutlet()}
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