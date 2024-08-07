import React, {useEffect, useState} from "react";
import {Layout} from "@/components";
import {Icon} from "@/components";
import {useLocation, useModel} from "umi";
import {deleteHeader, getLoginToken} from "@/utils/auth";
import {getCurrentPath, historyPush} from "@/utils/route";
import {App, Avatar, Col, Popover, Row, Tooltip} from "antd";
import {createStyles} from "antd-style";
import Settings from "../../../../config/defaultSettings";
import {Auto, Bottom, Dark, Exit, Light, Order, Right, Setting, System, Web} from "@/components/icon";
import {outLogin} from "@/service/user/login";
import request from "@/utils/request";
import Title from "../title";

/**
 * 中间件
 * @param ctx context
 * @param next 执行函数
 */
const check = async (ctx: any, next: any) => {
    await next();
    if (ctx.res.code == 403) {
        historyPush("notAllowed");
    }
}
request.use(check);
/**
 * 右侧部分组件
 * @constructor
 */
const RightTop: React.FC = () => {
    /**
     * 全局数据
     */
    const user = useModel("user");//用户信息
    const {message} = App.useApp()
    const theme = useModel("theme");//主题信息
    const location = useLocation();
    /**
     * 样式
     */
    const useStyles = createStyles(({css, token, isDarkMode}): any => {
        return {
            img: {
                marginBottom: "5px",
            },
            nickname: {
                marginLeft: "3px",
                fontSize: "13px",
                color: isDarkMode ? token.colorTextSecondary : "rgb(150,150,150)",
                fontWeight: "bold",
            },
            profile: css`
                margin-left: 10px;
                margin-right: 20px;

                .anticon {
                    margin-left: 2px;
                    font-size: 10px;
                }
            `,
            pop: css`
                display: initial;
                padding: 11px 5px;
                border-radius: 10px;
                transition: background-color 0.5s ease;
                cursor: pointer;
            `,
            box: css`
                .ant-popover-inner {
                    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .15) !important;
                }

                .ant-popover-arrow:before {
                    background-color: ${token?.colorPrimary} !important;
                }
            `,
            content_top: css`
                height: 70px;
                width: 100%;
                background-color: ${token?.colorPrimary};
                overflow: hidden;
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAACGBAMAAAD0nt8RAAAAD1BMVEVHcEz///////////////8T4DEaAAAABXRSTlMADAYJA8T7L0gAAALASURBVGjezVpbcoMwDCS2DxBhDgC0BwhNDoDb3v9MfaQQMLb1cqfVVz6YjbS7ks2IptnFCOD7RhcDfIafVRgGvqPVJ/IZmoLcD4YqFbuAgAIkrCCKeqYaICsGnP8WxP0bkE05F71hK4EoWvC0YHh9EwN0v93Fr9frs3aefP/PjdA9Pfo3F8xuxRk74LlaTBpLaPOATaRA0A+lBPAB6rBUNy2KVXwmDOF8YwSs3g1Ij8zYVgPi0PYjlGOppJVATmi9BgcZUJDH1PKokzIamwdGVkGDPGEeB2S+jU9lT2/4KFASip4edxgtfpxDidJiIpvmOsoTYfQEI8UPmR3GOFJuOLHGe0o97YYT8fYKNE4jSnYP7mUpH2x292SW0vKtIyQlNAeM4pEzpTQ0E3BAXOpJA4mYqZTcCx+BCRKOOg5JDE+m5AskjVECcfGzJoNRsokFanRkSgpxJlNSiAudEgmIoYPM+AVWAzKQMTzlzUAOwqCkq0FJV8FqBa9NFWzCsBrt2BLbhEEJ1KDE16DE16Ckq0FJV4GSrNc4lGS9xqEk6zUOJVmvcSgB/UAq2GSqAWJq2IQxpQsgpsZcY4h89Jpbf0xSr5kngBeuaSOv3f/9xuQ2LUnP4tanFWlZqfiMID1nHnQZry/Kv/FB3PF9giTz9foyju/vc6Spl7TQHW5IqDaAPBphKhn/hBogbqoAwpv7WRNKue2kkzI/ZoSpzPIjtTWZ1+03BkgfzRPJKdQupmjlo98v1hoVp9AyiGbFKdRSN0Wy1x56C6FLJKsuhiYzYZtleL0iu2zQtoROXQwqM3nlMmmLQWRm7BkHfSJ5mXkL6aAuJiszd5FsBc1Lkpm/ATbqYpIyS1bRcSo35U5dseLfT0rpXt3qE6GtUTjcKj4SWFNRfcPh9Kvs9bLRN7qY1B+k/HCrTeSL24saozF4MR+gwScpYNNOxQAAAABJRU5ErkJggg==);
                background-repeat: no-repeat;
                background-position: right;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                line-height: 70px;
            `,
            ava: {
                height: "40px",
                width: "40px",
                marginLeft: "10px",
            },
            top_text: {
                color: "#fff",
                fontSize: "12px",
                letterSpacing: "1px",
                lineHeight: "100%",
                marginLeft: "8px",
                width: "auto"
            },
            menu: {
                listStyle: "none",
                padding: 0,
                margin: 0,
                userSelect: "none",
                "li:last-of-type": {
                    borderTop: "0.5px solid rgba(189, 189, 189, 0.2)",
                    borderRadius: "0px 0px 5px 5px",
                    height: "45px",
                    lineHeight: "45px",
                }
            },
            menuItem: {
                cursor: "pointer",
                letterSpacing: "1px",
                height: "40px",
                lineHeight: "40px",
                fontSize: "12px",
                padding: "0px 15px",
                transition: "background-color 0.3s ease",
                color: isDarkMode ? token.colorTextSecondary : "rgba(0,0,0,0.65)",
                display: "flex",
                justifyContent: "space-between",
                ":hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                },
                ".anticon": {
                    fontSize: "11px",
                },
                "div>.anticon": {
                    fontSize: "12.5px",
                    marginRight: "7px"
                }
            },
            icon: {
                fontSize: "17px",
                padding: "7px",
                marginRight: "5px",
                cursor: "pointer",
                borderRadius: "5px",
                transition: "background-color 0.5s ease",
                ":hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
                color: isDarkMode ? token.colorTextSecondary : "rgb(150,150,150)"

            },
        };
    });
    const {styles: {img, nickname, profile, pop, content_top, ava, top_text, box, menu, menuItem, icon}} = useStyles();
    const currentPath = () => {
        return getCurrentPath(location?.pathname).slice(1);
    }
    return <>
        <Tooltip title={theme?.getModeName(theme?.mode)}>
            <Icon type={theme?.isDarkMode() ? Dark : (theme?.isAutoMode() ? Auto : Light)} className={icon}
                  onClick={() => {
                      theme?.toggle?.();
                  }}/>
        </Tooltip>
        <Popover className={profile} overlayInnerStyle={{padding: 0}} overlayClassName={box} autoAdjustOverflow={false}
                 placement="bottomRight"
                 content={<div style={{width: "210px"}}>
                     <Row className={content_top}>
                         <Col span={6}><Avatar className={ava} src={user?.web?.avatar}/></Col>
                         <Col span={16} className={top_text}>
                             <div style={{
                                 fontSize: 13,
                                 marginTop: 18,
                                 marginBottom: 10
                             }}>{user?.web?.nick_name || "未设置"}</div>
                             <div>{user?.web?.phone || user?.web?.email}</div>
                         </Col>
                     </Row>
                     <ul className={menu}>
                         <li className={menuItem} onClick={() => historyPush("user.setting")}>
                             <div><Icon type={Setting} style={{fontSize: 14}}/>账号管理</div>
                             <Icon type={Right}></Icon>
                         </li>
                         <li className={menuItem} onClick={() => historyPush("user.log2")}>
                             <div><Icon type={Order} style={{fontSize: 14}}/>操作日志</div>
                             <Icon type={Right}></Icon>
                         </li>
                         {currentPath() != 'user' && user?.web?.is_master &&
                             <li className={menuItem} onClick={() => historyPush("user.index")}>
                                 <div><Icon type={System} style={{fontSize: 14}}/>网站首页</div>
                                 <Icon type={Right}></Icon>
                             </li>}
                         {currentPath() != 'admin' && user?.web?.is_admin &&
                             <li className={menuItem} onClick={() => historyPush("admin.index")}>
                                 <div><Icon type={Web} style={{fontSize: 14}}/>网站管理</div>
                                 <Icon type={Right}></Icon>
                             </li>}
                         {currentPath() != 'master' && user?.web?.is_master &&
                             <li className={menuItem} onClick={() => historyPush("master.index")}>
                                 <div><Icon type={Setting} style={{fontSize: 14}}/>系统管理</div>
                                 <Icon type={Right}></Icon>
                             </li>}
                         <li className={menuItem} onClick={async () => {
                             message?.loading({content: '正在退出登录', duration: 600000, key: "outLogin"});
                             await outLogin({
                                 onSuccess: (r) => {
                                     if (r?.code == 200) {
                                         message?.success(r?.message || "退出登录成功")
                                         deleteHeader()
                                         message?.destroy("outLogin")
                                         historyPush("login");
                                     }
                                 },
                                 onFail: (r) => {
                                     if (r?.code == 500) {
                                         message?.error(r?.message || "退出登录失败")
                                     }
                                 }
                             })
                         }}>
                             <div><Icon type={Exit} style={{fontSize: 14}}/>退出登录</div>
                             <Icon type={Right}></Icon>
                         </li>
                     </ul>
                 </div>}>
            <div className={pop}>
                <Avatar className={img} src={user?.web?.avatar}>
                    {(user?.web?.nick_name || "未设置")[0]}
                </Avatar>
                <span className={nickname}>{user?.web?.nick_name || "未设置"}</span>
                <Icon type={Bottom}/>
            </div>
        </Popover>
    </>
}

export type slide = {
    menu?: any,
}

/**
 * 用户系统
 */

const SKLayout: React.FC<slide> = ({...props}) => {
    /**
     * 初始化用户信息
     */
    const {menu} = props;
    /**
     * 全局信息
     */
    const user = useModel("user");
    const web = useModel("web");
    const [loading, setLoading] = useState(false);
    const initUser = () => {
        setLoading(true);
        if (getLoginToken() == "") {
            historyPush("login");
            return;
        }
        user?.getWebUser()?.then((u: any) => {
            user?.setWeb(u);
        })?.finally(() => {
            setLoading(false);
        });
    };
    useEffect(() => {
        initUser();
    }, []);
    /**
     * 样式信息
     */
    const useStyles = createStyles((): any => {
        return {
            collapsedImg: {
                width: "35px",
            },
            unCollapsed: {
                overflow: "hidden",
                position: "absolute",
                display: "inline-flex",
                ">img": {
                    width: "35px",
                    float: "left"
                },
                ">div": {
                    fontSize: "25px",
                    marginLeft: "5px",
                    fontWeight: "bolder",
                    float: "left",
                    lineHeight: "30px",
                    whiteSpace: "nowrap",
                }
            },
        };
    });
    const {styles: {collapsedImg, unCollapsed, load}} = useStyles();
    return (
        <>
            <Title/>
            <Layout loading={loading}
                    waterMark={web?.info?.water_mark ? [user?.web?.nick_name, user?.web?.email] : ""}
                    menus={menu}
                    layout={web?.info?.layout == "left" ? "inline" : "horizontal"}
                    menuTheme={web?.info?.theme == "dark" ? "dark" : "light"}
                    footer={<>©{new Date().getFullYear()} All Right
                        Revered {web?.info?.name || Settings?.title}</>}
                    headerRight={<RightTop/>}
                    menuCollapsedWidth={60}
                    menuUnCollapsedWidth={210}
                    collapsedLogo={() => {
                        return <img
                            src={web?.info?.logo || (Settings?.basePath || "/") + "logo.svg"}
                            alt={Settings?.title} className={collapsedImg}/>
                    }}
                    unCollapsedLogo={() => {
                        return (
                            <div className={unCollapsed}>
                                <img
                                    src={web?.info?.logo || (Settings?.basePath || "/") + "logo.svg"}
                                    alt={web?.info?.name || Settings?.title}/>
                                <div style={{color: web?.info?.color ? web?.info?.color : "rgb(0,81,235)"}}>
                                    {web?.info?.name || Settings?.title}
                                </div>
                            </div>)
                    }}/>
        </>
    );
}
export default SKLayout;