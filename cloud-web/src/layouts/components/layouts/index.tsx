import React, {useEffect, useState} from "react";
import {Layout} from "@/components";
import {Icon} from "@/components";
import {useModel} from "umi";
import {deleteHeader, getLoginToken} from "@/utils/auth";
import {historyPush} from "@/utils/route";
import {App, Avatar, Col, Popover, Row, Tooltip} from "antd";
import {createStyles} from "antd-style";
import Settings from "../../../../config/defaultSettings";
import {Auto, Bottom, Dark, Exit, Light, Main, Order, Right, Setting, System, Web} from "@/components/icon";
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
    /**
     * 样式
     */
    const useStyles = createStyles(({css, token}): any => {
        return {
            img: {
                marginBottom: "5px",
            },
            nickname: {
                marginLeft: "3px",
                fontSize: "13px",
                color: "rgb(122,122,122)",
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
                    background-color: rgba(85, 126, 253, 1) !important;
                }
            `,
            content_top: {
                height: "70px",
                width: "100%",
                backgroundColor: token?.colorPrimaryBorderHover,
                borderBottom: "1px solid gray",
                overflow: "hidden",
                backgroundImage: "url(https://www.xiaoke.cn/xk/static/bg_blue.a89f3e00.png)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                lineHeight: "70px"
            },
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
                color: "rgb(115, 115, 115)",
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
                }
            },
        };
    });
    const {styles: {img, nickname, profile, pop, content_top, ava, top_text, box, menu, menuItem,icon}} = useStyles();
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
                             <div><Icon type={Setting} style={{fontSize: 14}}/>账号设置</div>
                             <Icon type={Right}></Icon>
                         </li>
                         <li className={menuItem} onClick={() => historyPush("user.log2")}>
                             <div><Icon type={Order} style={{fontSize: 14}}/>操作设置</div>
                             <Icon type={Right}></Icon>
                         </li>
                         {user?.web?.is_master && <li className={menuItem} onClick={() => historyPush("master.index")}>
                             <div><Icon type={System} style={{fontSize: 14}}/>系统管理</div>
                             <Icon type={Right}></Icon>
                         </li>}
                         {user?.web?.is_admin && <li className={menuItem} onClick={() => historyPush("admin.index")}>
                             <div><Icon type={Web} style={{fontSize: 14}}/>网站管理</div>
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
                                         historyPush("user.login");
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
    menu: any
}
/**
 * 用户系统
 */
const Layouts: React.FC<slide> = ({...props}) => {
    const {menu} = props
    /**
     * 全局信息
     */
    const user = useModel("user");//用户信息
    const web = useModel("web");
    /**
     * 初始化用户信息
     */
    const [loading, setLoading] = useState(false)
    const initUser = () => {
        setLoading(true);
        if (getLoginToken() == "") {
            historyPush("user.login");
            return;
        }
        user?.getWebUser()?.then((u: any) => {
            user?.setWeb(u);
        })?.finally(() => {
            setLoading(false);
        });
    }
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
                    color: "#0051eb",
                    fontSize: "25px",
                    marginLeft: "5px", fontWeight: "bolder",
                    float: "left",
                    lineHeight: "30px",
                    whiteSpace: "nowrap",
                }
            }
        };
    });
    const {styles: {collapsedImg, unCollapsed}} = useStyles();
    return (
        <>
            <Title/>
            <Layout loading={loading}
                    menus={menu}
                    footer={<>©{new Date().getFullYear()} All Right Revered {web?.info?.name || Settings?.title}</>}
                    headerRight={<RightTop/>}
                    menuCollapsedWidth={60}
                    menuUnCollapsedWidth={210}
                    menuBottomBtnText={"首页"}
                    menuBottomBtnIcon={Main}
                    onMenuBottomBtnClick={() => {
                        historyPush("user.index")
                    }}
                    collapsedLogo={() => {
                        return <img src={web?.info?.logo || (Settings?.basePath || "/") + "logo.svg"}
                                    alt={Settings?.title} className={collapsedImg}/>
                    }}
                    unCollapsedLogo={() => {
                        return (
                            <div className={unCollapsed}>
                                <img src={web?.info?.logo || (Settings?.basePath || "/") + "logo.svg"}
                                     alt="沉沦云网络"/>
                                <div>{web?.info?.name || Settings?.title}</div>
                            </div>)
                    }}
            /></>
    );
}
export default Layouts;