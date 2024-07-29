import {Body, Icon, Title} from "@/components";
import {Avatar, Button, Card, Grid, List, NoticeBar, Skeleton} from "antd-mobile";
import {Data, Help, Message, Recharge, User,} from "@/components/icon";
import React, {useEffect, useState} from "react";
import {createStyles} from "antd-style";
import {historyPush} from "@/utils/route";
import {getContact, getNotice} from "@/service/person/config";
import {useModel} from "umi";
import {Col, Row} from "antd";
import {getNoticeList} from "@/service/person/notice";

const useStyles = createStyles(({isDarkMode}): any => {
    return {
        body: {
            userSelect: "none"
        },
        list: {
            ".adm-list-item ": {
                paddingLeft: "0 !important",
                lineHeight: "0.8 !Important"
            },
            ".adm-list-header": {
                borderRadius: "5px",
                fontSize: "12px !important",
            },
            " .adm-list-body": {
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px"
            },
            "--border-top": "none",
            "--border-bottom": "none"
        },
        btn: {
            height: "160px",
            width: "100%",
            fontSize: "14px",
        },
        card: {
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block,0) 0",
            }
        },
        nav: {
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            fontSize: "12px"
        },
        tit: {
            fontSize: "14px",
            color: isDarkMode ? "#b3b3b3" : "#000",
            fontWeight: 600,
        },
        icons: {
            display: "block",
            fontSize: "22px",
            lineHeight: 1.3
        },
        icon: {
            ".adm-list-item-content-arrow": {
                fontSize: "15px",
                color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
            },
            ".adm-list-item-description": {
                marginTop: "3px"
            }
        },
        notice: {
            fontSize: "14px", borderRadius: "5px"
        },
        home: {
            display: "flex",
            alignItems: "center",
            justifyContent: 'center',
            flexDirection: "column"
        },
        ava: {
            borderRadius: "50%", height: "50px", width: "50px"
        },
        listSpan: {
            fontSize: "12px",
            color: isDarkMode ? "#b3b3b3" : "#4f4f4f"
        },
        connact: {
            borderRadius: "5px", height: "28px", width: "28px"
        },
        tex: {
            fontSize: "12px", marginBottom: "4px", display: "inline-block"
        },
        cardLine: {
            ".adm-card": {
                padding: "0 var(--adm-card-padding-inline, 0px)"
            },
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            },
            ".adm-card-header-title": {
                paddingLeft: "12px"
            },
            ".adm-list-item-content-prefix": {
                marginLeft: "12px"
            }
        },
        preFix: {
            fontSize: "14px", color: "#ff8f1f"
        },
        extra: {
            fontSize: "10px !important",
            width: "40px",
            height: "20px",
            padding: "5px",
            lineHeight: "5px"
        },
        small: {
            fontSize: "10px"
        },
        hel: {
            fontSize: "26px"
        },
        respect: {
            fontSize: "16px", marginTop: "10px"
        },
        back: {
            fontWeight: 600
        }
    }
})
export default function HomePage() {
    const user = useModel("user")
    const {
        styles: {
            list, card, nav, tit, icons, icon, notice, home, ava, respect,
            listSpan, connact, tex, cardLine, preFix, extra, small, body, hel, back
        }
    } = useStyles();
    /**
     * 滚动公告
     */
    const [noticeData2, setNoticeData2] = useState()
    const getNoticeData2 = async () => {
        await getNotice({
            onSuccess: (r: any) => {
                setNoticeData2(r?.data);
            },
        })
    }
    /**
     * 获取公告信息
     */
    const [noticeData, setNoticeData] = useState<any>([]);
    const getNoticeData = async () => {
        const temp: any[] = [];
        await getNoticeList({
            body: {
                page: 1, page_size: 5, web_id: 'system', place: "index"
            },
            onSuccess: (r: any) => {
                r?.data?.list?.map((k: any) => {
                    temp?.push(k);
                });
            },
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
        });
        setNoticeData(temp);
    };
    /**
     * 客服信息
     */
    const [contactData, setContactData] = useState({});
    const getContactData = async () => {
        await getContact({
            onSuccess: (r: any) => {
                setContactData(r?.data);
            },
        })
    };
    const [pageLoading, setPageLoading] = useState(true)
    useEffect(() => {
        setPageLoading(true)
        getNoticeData().finally(() => {
            getNoticeData2().finally(() => {
                getContactData().finally(() => {
                    setPageLoading(false);
                });
            });
        });
    }, []);
    return (
        <Body showHeader={false} loading={pageLoading} space={true} bodyClassNames={body}>
            <Card>
                <div className={home}>
                    <Avatar src={user?.web?.avatar} className={ava}/>
                    <span className={hel}>你好,{user?.web?.nick_name}</span>
                    <span className={respect}>尊敬的 <span
                        className={back}>{user?.web?.nick_name}</span>，欢迎回来！</span>
                </div>
            </Card>
                <NoticeBar content={noticeData2?.['notice.index']} color="info" className={notice}/>
            <Card>
                <Row justify={"space-around"}>
                    <Col onClick={() => historyPush('user.list')}>
                        <div className={nav}><Icon type={Data} className={icons}/>数据管理
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.pay')}>
                        <div className={nav}><Icon type={Recharge} className={icons}/>余额充值
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.help')}>
                        <div className={nav}><Icon type={Help} className={icons}/>使用帮助
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.person')}>
                        <div className={nav}><Icon type={User} className={icons}/>我的账户</div>
                    </Col>
                </Row>
            </Card>
            {noticeData.length > 0 && <Grid.Item className={cardLine}>
                <Card title={<Title><span className={tit}>系统公告</span></Title>}>
                    <List className={list}>
                        {noticeData.map(user => (
                            <List.Item
                                className={icon}
                                key={user?.id}
                                prefix={<Icon type={Message} className={preFix}/>}
                                extra={''}
                                onClick={() => {
                                    historyPush("user.notice.info", {id: user?.id})
                                }}
                            >
                                <span className={listSpan}>{user?.title}</span>
                            </List.Item>
                        ))}
                    </List>
                </Card>
            </Grid.Item> || null}
            <Card className={card} title={<Title><span className={tit}>联系方式</span></Title>}>
                <List className={list}>
                            <List.Item prefix={
                                <Avatar
                                    src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.one'] || 10000) + "&spec=100"}
                                    size="large" shape="square" className={connact}/>}
                                       description={<span className={small}>QQ:{contactData?.['contact.one']}</span>}
                                       extra={<Button fill='outline' color='primary' size={"mini"}
                                                      className={extra} onClick={() => {
                                           window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.one'] + "&site=qq&menu=yes");
                                       }}>联系</Button>}>
                                <span className={tex}>官方客服</span>
                            </List.Item>
                            <List.Item prefix={
                                <Avatar
                                    src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.two'] || 10000) + "&spec=100"}
                                    size="large" shape="square" className={connact}/>}
                                       description={<span className={small}>QQ:{contactData?.['contact.two']}</span>}
                                       extra={<Button fill='outline' color='primary' size={"mini"}
                                                      className={extra} onClick={() => {
                                           window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.two'] + "&site=qq&menu=yes");
                                       }}>联系</Button>}>
                                <span className={tex}>官方客服</span>
                            </List.Item>
                            <List.Item prefix={
                                <Avatar
                                    src={"https://p.qlogo.cn/gh/" + (contactData?.['contact.three'] || 10000) + "/" + (contactData?.['contact.three'] || 1000) + "/100"}
                                    size="large" shape="square" className={connact}/>}
                                       description={<span
                                           className={small}>群号:{contactData?.['contact.three']}</span>}
                                       extra={<Button fill='outline' color='primary' size={"mini"}
                                                      className={extra} onClick={() => {
                                           window.open(contactData?.['contact.four']);
                                       }}>加入</Button>}>
                                <span className={tex}>官方Q群</span>
                            </List.Item>
                </List>
            </Card>
        </Body>
    );
}
