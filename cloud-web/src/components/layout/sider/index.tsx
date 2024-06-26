import {useLocation, history, useSelectedRoutes} from 'umi';
import React, {useEffect, useState} from 'react';
import {ConfigProvider, Menu, Layout} from 'antd';
import {createStyles, useResponsive, useTheme} from "antd-style";
import {Icon} from "@/components";

const useStyles = createStyles(({token, isDarkMode}): any => {
    return {
        left: {
            position: "relative",
            background: token?.colorBgContainer,
            height: "100%",
        },
        menu: {
            zIndex: 1,
            overflow: "auto",
            overflowX: "hidden",
            borderRight: "none !important",
            marginBottom: "50px",
            fontWeight: "bolder",
            userSelect: "none",
            ":focus-visible": {
                outline: "none !important"
            },
            "::-webkit-scrollbar": {
                width: 0
            },
            ".ant-menu-item-selected::after": {
                top: "19% !important",
                right: "5px !important",
                height: "60% !important",
                borderRightWidth: "5px !important",
                borderRadius: "10px 0 0 10px",
            },
            ".ant-menu-item,.ant-menu-submenu-title": {
                transition: "border-color 0.3s,background 0.3s !important"
            },
            ".ant-menu-item-icon": {
                color: isDarkMode ? "rgb(255,255,255,0.85)" : ""
            },
        },
        menuTop: {
            zIndex: 2,
            userSelect: "none",
            height: "100px",
            lineHeight: "100px !important",
            width: "100%",
            padding: "10px !important",
            overflow: "hidden",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: token?.colorBgContainer + " !important",
        },
        menuBottom: {
            background: token?.colorBgContainer,
            userSelect: "none",
            padding: "0px !important",
            borderRadius: "0px",
            height: "50px",
            textAlign: "center",
            lineHeight: "50px !important",
            borderTop: "0.5px solid " + token?.colorBorder + " !important",
            fontWeight: "bolder",
            fontSize: 14,
            color: isDarkMode ? "rgb(255,255,255,0.65)" : "rgba(122,122,122)",
            cursor: "pointer",
            overflow: "hidden",
            position: "absolute",
            width: "100%",
            bottom: "0",
            zIndex: 2,
            transition: "background 0.2s !important",
        },
        logoClose: {
            margin: "0px -10px",
        },
        menu2: {
            fontSize: "13px",
            flex: "auto",
            height: "55px",
            borderBottom: "none !important",
        },
        darkColor: {
            background: "#001529 !important",
            backgroundColor: "#001529 !important",
        },
        darkBorderTop: {
            borderTop: '0.5px solid #202020 !important',
            color: "white"
        }
    };
});

export type SiderProps = {
    collapsed?: boolean;//菜单展开状态
    menus?: any;//菜单列表
    onMenuClick?: (item: any) => void;//点击菜单回调
    onLogoClick?: () => void;//点击logo回调
    collapsedLogo?: (isLight: boolean | undefined) => any;//折叠时logo
    unCollapsedLogo?: (isLight: boolean | undefined) => any;//展开时logo
    menuBottomBtnIcon?: string;//底部按钮图标
    menuBottomBtnText?: string;//底部按钮文字
    onMenuBottomBtnClick?: () => void;//点击底部按钮回调
    layout?: string;//布局
    theme?: string;//主题
};

const Sider: React.FC<SiderProps> = (props) => {
    const {
        collapsed,
        onMenuClick,
        menus,
        onLogoClick,
        collapsedLogo,
        unCollapsedLogo,
        menuBottomBtnIcon = null,
        menuBottomBtnText = null,
        onMenuBottomBtnClick,
        layout = "inline",
        theme = "light"
    } = props;
    const {mobile} = useResponsive();
    const systemTheme = useTheme();
    const {styles: {left, menu, menuTop, menuBottom, menu2, darkColor, darkBorderTop}} = useStyles();
    const [selectedKeys, setSelectedKeys] = useState<any>([]);
    const location = useLocation();
    const match = useSelectedRoutes();
    const initSelectMenu = () => {
        setSelectedKeys([location?.pathname]);
        let temp = []
        for (let i = 0; i < match?.length; i++) {
            temp.push(match[i]?.pathname);
        }
        setStateOpenKeys(temp);
    }

    useEffect(() => {
        initSelectMenu();
    }, [location]);
    /**
     * 只展开一个子集
     */
    const getLevelKeys = (items1: any) => {
        const key: Record<string, number> = {};
        const func = (items2: any, level = 1) => {
            items2.forEach((item: any) => {
                if (item?.key) {
                    key[item.key] = level;
                }
                if (item?.children) {
                    return func(item.children, level + 1);
                }
            });
        };
        func(items1);
        return key;
    };
    const levelKeys = getLevelKeys(menus);
    const [stateOpenKeys, setStateOpenKeys] = useState<any>([]);
    const onOpenChange = (openKeys: any[]) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys.filter((key) => key !== currentOpenKey).findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys.filter((_, index) => index !== repeatIndex).filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            setStateOpenKeys(openKeys);
        }
    }
    const token = useTheme();
    /**
     * 获取菜单主题
     */
    const getTheme = () => {
        if (token?.isDarkMode) {
            return "light";
        }
        return theme == "dark" ? theme : "light";
    }
    const getColor = () => {
        return !token?.isDarkMode && getTheme() == "dark" ? ' ' + darkColor : '';
    }
    const getBorderColor = () => {
        return !token?.isDarkMode && getTheme() == "dark" ? ' ' + darkBorderTop : '';
    }
    return (
        <>
            {(layout == "inline" &&
                <Layout className={left + getColor()}>
                    <Layout.Header className={menuTop + getColor()}
                                   onClick={() => {
                                       onLogoClick?.();
                                   }}>
                        {(mobile || (!mobile && !collapsed)) &&
                            unCollapsedLogo?.(!systemTheme?.isDarkMode)
                        }
                        {!mobile && collapsed &&
                            collapsedLogo?.(systemTheme?.isDarkMode)
                        }
                    </Layout.Header>
                    <Layout.Content className={getColor()}>
                        <ConfigProvider theme={{
                            components: {
                                Menu: {
                                    itemSelectedColor: token?.colorPrimaryText,
                                    itemColor: token?.colorTextSecondary,
                                    itemHoverColor: token?.colorTextSecondary,
                                    fontSize: 13,
                                    itemMarginBlock: 0,
                                    itemMarginInline: 0,
                                    itemBorderRadius: 0,
                                    activeBarWidth: 4,
                                    itemHeight: 45,
                                    subMenuItemBg: "rgba(255, 255, 255, 0)",
                                }
                            }
                        }}>
                            <Menu selectedKeys={selectedKeys}
                                  theme={getTheme()}
                                  mode={"inline"}
                                  items={menus} className={menu}
                                  openKeys={stateOpenKeys}
                                  onOpenChange={onOpenChange}
                                  onClick={(item: any) => {
                                      history.push(item?.key);
                                      setSelectedKeys([item?.key]);
                                      onMenuClick?.(item);
                                  }}/>
                        </ConfigProvider>
                    </Layout.Content>
                    {(menuBottomBtnIcon || menuBottomBtnText) &&
                        <Layout.Footer className={menuBottom + getColor() + getBorderColor()}
                                       onClick={onMenuBottomBtnClick}>
                            {menuBottomBtnIcon && <Icon type={menuBottomBtnIcon}/>}
                            {(mobile || (!mobile && !collapsed)) && menuBottomBtnText}
                        </Layout.Footer>}
                </Layout>) || <ConfigProvider theme={{
                components: {
                    Menu: {
                        horizontalItemSelectedColor: token?.colorPrimaryText,
                        horizontalItemColor: token?.colorTextSecondary,
                        horizontalItemHoverColor: token?.colorTextSecondary,
                        fontSize: 13,
                        itemMarginBlock: 0,
                        itemMarginInline: 0,
                        itemBorderRadius: 0,
                        activeBarWidth: 4,
                        itemHeight: 45,
                        subMenuItemBg: "rgba(255, 255, 255, 0)",
                    }
                }
            }}><Menu theme={getTheme()} mode={"horizontal"} selectedKeys={selectedKeys}
                     items={menus} className={menu2} onClick={(item: any) => {
                history.push(item?.key);
            }}/></ConfigProvider>}
        </>
    )
}

export default Sider