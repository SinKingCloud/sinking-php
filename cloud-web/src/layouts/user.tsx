import React, {useEffect,useState} from "react";
import Layout from "@/layouts/components";
import {getUserMenuItems} from "@/utils/route";
import defaultSettings from "../../config/defaultSettings";
import {Icon} from "@/components";
import {useModel} from "umi";
import {deleteHeader, getLoginToken} from "@/utils/auth";
import {historyPush} from "@/utils/route";
import {App, Avatar,  Col,  Popover, Row} from "antd";
import {createStyles} from "antd-style";
import Settings from "@/../config/defaultSettings";
import {Bottom, Exit, Order, Setting} from "@/components/icon";
import {outLogin} from "@/service/user/login";
import request from "@/utils/request";
/**
 * 中间件
 * @param ctx context
 * @param next 执行函数
 */
const check = async (ctx: any, next: any) => {
    await next();
    if (ctx.res.code == 503 || ctx.res.code == 403) {
        deleteHeader();
        historyPush("user.login");
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
                width:"auto"
            },
            text: {
                cursor: "pointer",
                borderRadius: "5px",
                letterSpacing: "1px",
                height: "42px",
                lineHeight: "42px",
                color: "#000",
                fontSize: "14px",
                paddingLeft: "10px",
                boxSizing: "border-box",
                transition: "background-color 0.5s ease",
                ":hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                }
            }
        };
    });
    const {styles: {img, nickname, profile, pop, content_top, ava, text, top_text, box}} = useStyles();
    return <>
        <Popover className={profile} overlayInnerStyle={{padding: 0}} overlayClassName={box} autoAdjustOverflow={false}
                 placement="bottomRight"
                 content={<div style={{width: "200px"}}>
                     <Row className={content_top}>
                         <Col span={6}><Avatar className={ava} src={user?.web?.avatar}/></Col>
                         <Col span={16} className={top_text}>
                             <div style={{
                                 fontSize: 13,
                                 marginTop: 18,
                                 marginBottom: 10
                             }}>{user?.web?.nick_name || "未设置"}</div>
                             <div>{user?.web?.phone}</div>
                         </Col>
                     </Row>
                     <ul style={{listStyle: "none", padding: 0, margin: 0, borderBottom: "1px solid #f0f0f0"}}>
                         <li className={text}><Icon type={Setting} style={{fontSize:16,marginRight:4}}/>账号设置</li>
                         <li className={text}><Icon type={Order} style={{fontSize:16,marginRight:4}}/>操作设置</li>
                     </ul>
                     <ul style={{listStyle: "none", padding: 0, margin: 0}}>
                         <li className={text} onClick={async () => {
                             message?.loading({content: '正在退出登录', duration: 600000, key: "outLogin"});
                             await outLogin({
                                 onSuccess:(r)=>{
                                     if(r?.code == 200){
                                         message?.success(r?.message || "退出登录成功")
                                         deleteHeader()
                                         message?.destroy("outLogin")
                                         historyPush("user.login");
                                     }
                                 },
                                 onFail:(r)=>{
                                     if(r?.code == 500){
                                         message?.error(r?.message || "退出登录失败")
                                     }
                                 }
                             })
                         }}><Icon type={Exit} style={{fontSize:16,marginRight:4}} />退出登录
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
/**
 * 用户系统
 */
export default () => {
    /**
     * 全局信息
     */
    const user = useModel("user");//用户信息
    const web = useModel("web");
    /**
     * 初始化用户信息
     */
    const [loading, setLoading] = useState(false);
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

    return (
        <Layout loading={loading}
                menus={getUserMenuItems()}
                footer={<>©{new Date().getFullYear()} All Right Revered {web?.info?.name || Settings?.title}</>}
                headerRight={<RightTop/>}
                menuBottomBtnText={"开发文档"}
                onMenuBottomBtnClick={() => {
                    console.log("点击了底部按钮")
                }}
                menuCollapsedWidth={60}
                menuUnCollapsedWidth={210}
                onLogoClick={() => {
                    console.log("点击了logo")
                }}
                onMenuClick={(item) => {
                    console.log("点击了菜单", item)
                }}
                collapsedLogo={() => {
                    return <img src={(Settings?.base || "/") + "logo.svg"} width="40px"
                                alt={web?.info?.name}/>
                }}
                unCollapsedLogo={() => {
                    return (
                        <span style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                             <img src={(Settings?.base || "/") + "logo.svg"} width={40}
                                  alt={web?.info?.name}/>
                            <span style={{
                                fontSize: 20,
                                marginLeft: 8,
                                color: "#0051eb",
                                fontWeight: 700,
                            }}>{web?.info?.name}</span>
                        </span>

                    )
                }}
                onMenuBtnClick={(state) => {
                    console.log("点击了菜单按钮", state)
                }}
        />
    );
}