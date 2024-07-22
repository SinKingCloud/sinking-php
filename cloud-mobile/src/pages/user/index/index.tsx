import {Body, Icon, Title} from "@/components";
import {Avatar, Button, Card, Grid, List, NoticeBar, Skeleton} from "antd-mobile";
import {Help, User, Message, Recharge, Tabulate,} from "@/components/icon";
import React, {useEffect, useState} from "react";
import {createStyles, useTheme} from "antd-style";
import {historyPush} from "@/utils/route";
import {getContact, getNotice} from "@/service/person/config";
import {getNoticeList} from "@/service/person/notice";
import {ago} from "@/utils/time";
import {useModel} from "umi";
import {Col, Row} from "antd";

const useStyles = createStyles(({isDarkMode}): any => {
    return {
        list: {
            ".adm-list-item ": {
                paddingLeft: "0 !important"
            },
            ".adm-list-header": {
                borderRadius: "5px",
                fontSize: "12px !important",
            }
        },
        icon: {
            ".adm-list-item-content-arrow": {
                fontSize: "15px",
                color: "rgba(0,0,0,0.7)"
            },
            ".adm-list-item-description": {
                marginTop: "3px"
            }
        },
        btn: {
            height: "160px",
            width: "100%",
            fontSize: "14px",
        },
        card: {
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            }
        },
        nav: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center"
        },
        tit: {
            fontSize: "14px",
            color: isDarkMode ? "#b3b3b3" : "#000",
            fontWeight: 600
        }
    }
})
export default function HomePage() {
    const theme = useTheme()
    const user = useModel("user")
    const {styles: {list, icon, card, nav, tit}} = useStyles()
    /**
     * 获取公告信息
     */
    const [noticeData, setNoticeData] = useState<any>([]);
    const [noticeLoading, setNoticeLoading] = useState(false)
    const getNoticeData = async () => {
        setNoticeLoading(true)
        const temp: any[] = [];
        await getNoticeList({
            body: {
                page: 1, page_size: 3, web_id: 'system', place: "index"
            },
            onSuccess: (r: any) => {
                r?.data?.list?.map((k: any) => {
                    temp?.push(k);
                });
            },
            onFinally: () => {
                setNoticeLoading(false)
            }
        });
        await getNoticeList({
            body: {
                page: 1, page_size: 5, web_id: 'my', place: "index"
            },
            onSuccess: (r: any) => {
                r?.data?.list?.map((k: any) => {
                    temp?.push(k);
                });
            },
            onFinally: () => {
                setNoticeLoading(false)
            }
        });
        setNoticeData(temp);
    };
    /**
     * 滚动公告
     */
    const [noticeData2, setNoticeData2] = useState()
    const [noticeLoading2, setNoticeLoading2] = useState(false)
    const getNoticeData2 = async () => {
        setNoticeLoading2(true)
        await getNotice({
            onSuccess: (r: any) => {
                setNoticeData2(r?.data);
            },
            onFinally: () => {
                setNoticeLoading2(false);
            }
        })
    }
    /**
     * 客服信息
     */
    const [contactLoading, setContactLoading] = useState(true);
    const [contactData, setContactData] = useState({});
    const getContactData = () => {
        setContactLoading(true);
        getContact({
            onSuccess: (r: any) => {
                setContactData(r?.data);
            },
            onFinally: () => {
                setContactLoading(false);
            }
        })
    };
    useEffect(() => {
        getNoticeData()
        getNoticeData2()
        getContactData()
    }, []);
    return (
        <Body showHeader={false} loading={!user?.web} space={true}>
            {noticeLoading2 && <Skeleton.Paragraph animated/> ||
                <NoticeBar content={noticeData2?.['notice.index']} color="info"
                           style={{fontSize: "14px", borderRadius: "5px"}}/>
            }
            <Card>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center',
                    flexDirection: "column"
                }}>
                    <Avatar src={user?.web?.avatar}
                            style={{borderRadius: "50%", height: "50px", width: "50px"}}/>
                    <span style={{fontSize: "26px"}}>你好,{user?.web?.nick_name}</span>
                    <span style={{fontSize: "16px", marginTop: "10px"}}>尊敬的 <span
                        style={{fontWeight: 600}}>{user?.web?.nick_name}</span>，欢迎回来！</span>
                </div>
            </Card>
            <Card>
                <Row justify={"space-around"}>
                    <Col onClick={() => historyPush('user.list')}>
                        <div className={nav}><Icon type={Tabulate} style={{
                            display: "block",
                            fontSize: "22px",
                            lineHeight: 1.3
                        }}/>代练列表
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.pay')}>
                        <div className={nav}><Icon type={Recharge} style={{
                            display: "block",
                            fontSize: "22px",
                            lineHeight: 1.3
                        }}/>余额充值
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.help')}>
                        <div className={nav}><Icon type={Help} style={{
                            display: "block",
                            fontSize: "22px",
                            lineHeight: 1.3
                        }}/>使用帮助
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.person')}>
                        <div className={nav}><Icon type={User} style={{
                            display: "block",
                            fontSize: "22px",
                            lineHeight: 1.3
                        }}/>我的账户
                        </div>
                    </Col>
                </Row>
            </Card>
            <Card className={card} title={<Title><span className={tit}>联系方式</span></Title>}>
                <List className={list} style={{"--border-top": "none", "--border-bottom": "none"}}>
                    {contactLoading && <Skeleton.Paragraph animated/> ||
                        <>
                            <List.Item prefix={
                                <Avatar
                                    src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.one'] || 10000) + "&spec=100"}
                                    size="large" shape="square"
                                    style={{borderRadius: "5px", height: "36px", width: "36px"}}/>}
                                       description={<span>QQ:{contactData?.['contact.one']}</span>}
                                       extra={<Button fill='outline' color='primary' size={"small"}
                                                      style={{fontSize: "12px"}} onClick={() => {
                                           window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.one'] + "&site=qq&menu=yes");
                                       }}>联系</Button>}>
                                <span style={{fontSize: "14px", marginBottom: "4px"}}>官方客服</span>
                            </List.Item>
                            <List.Item prefix={
                                <Avatar
                                    src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.two'] || 10000) + "&spec=100"}
                                    size="large" shape="square"
                                    style={{borderRadius: "5px", height: "36px", width: "36px"}}/>}
                                       description={<span>QQ:{contactData?.['contact.two']}</span>}
                                       extra={<Button fill='outline' color='primary' size={"small"}
                                                      style={{fontSize: "12px"}} onClick={() => {
                                           window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.two'] + "&site=qq&menu=yes");
                                       }}>联系</Button>}>
                                <span style={{fontSize: "14px", marginBottom: "4px"}}>官方客服</span>
                            </List.Item>
                            <List.Item prefix={
                                <Avatar
                                    src={"https://p.qlogo.cn/gh/" + (contactData?.['contact.three'] || 10000) + "/" + (contactData?.['contact.three'] || 1000) + "/100"}
                                    size="large" shape="square"
                                    style={{borderRadius: "5px", height: "36px", width: "36px"}}/>}
                                       description={<span>群号:{contactData?.['contact.three']}</span>}
                                       extra={<Button fill='outline' color='primary' size={"small"}
                                                      style={{fontSize: "12px"}} onClick={() => {
                                           window.open(contactData?.['contact.four']);
                                       }}>加入</Button>}>
                                <span style={{fontSize: "14px", marginBottom: "4px"}}>官方Q群</span>
                            </List.Item>
                        </>
                    }
                </List>
            </Card>
            <Card title={<Title><span className={tit}>系统公告</span></Title>} className={card}>
                <List className={list} style={{"--border-top": "none", "--border-bottom": "none"}}>
                    {noticeLoading && <Skeleton.Paragraph animated/> ||
                        noticeData.map(user => (
                            <List.Item
                                className={icon}
                                key={user?.id}
                                prefix={<Icon type={Message} style={{fontSize: "18px", color: "#ff8f1f"}}/>}
                                extra={''}
                                description={<span
                                    style={{fontSize: "10px"}}>发布于 {ago(user?.create_time)} ,共 {user?.look_num} 次浏览</span>}
                                onClick={() => {
                                    historyPush("index.notice", {id: user?.id})
                                }}
                            >
                            <span style={{
                                fontSize: "14px",
                                color: theme.isDarkMode ? "#b3b3b3" : "#000"
                            }}>{user?.title}</span>
                            </List.Item>
                        ))
                    }
                </List>
            </Card>
        </Body>
    );
}
