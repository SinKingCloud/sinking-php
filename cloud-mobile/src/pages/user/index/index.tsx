import {Body, Icon, Title} from "@/components";
import {Avatar, Button, Card,  List, NoticeBar, Skeleton} from "antd-mobile";
import {Admin, Help, Master, Recharge, User,} from "@/components/icon";
import React, {useEffect, useState} from "react";
import {createStyles} from "antd-style";
import {historyPush} from "@/utils/route";
import {getContact, getNotice} from "@/service/person/config";
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
            textAlign: "center",
            fontSize:"12px"
        },
        tit: {
            fontSize: "14px",
            color: isDarkMode ? "#b3b3b3" : "#000",
            fontWeight: 600
        },
        icons:{
            display: "block",
            fontSize: "22px",
            lineHeight: 1.3
        }
    }
})
export default function HomePage() {

    const user = useModel("user")
    const {styles: {list, card, nav, tit,icons}} = useStyles()

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
                    <Col onClick={() => historyPush('user.pay')}>
                        <div className={nav}><Icon type={Recharge} className={icons}/>余额充值
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.notice')}>
                        <div className={nav}><Icon type={Help} className={icons}/>公告信息
                        </div>
                    </Col>
                    <Col onClick={() => historyPush('user.person')}>
                        <div className={nav}> <Icon type={User} className={icons}/>我的账户</div>
                    </Col>
                    {user?.web?.is_admin && <Col onClick={() => historyPush('admin.index')}>
                        <div className={nav}> <Icon type={Admin} className={icons}/>网站管理</div>
                    </Col>}
                    {user?.web?.is_master && <Col onClick={() => historyPush('master.index')}>
                        <div className={nav}> <Icon type={Master} className={icons}/>系统管理</div>
                    </Col>}
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

        </Body>
    );
}
