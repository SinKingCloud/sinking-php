import type {FC} from 'react';
import {Avatar, Card, Col, Skeleton, Row, Statistic, Alert, Button, List} from 'antd';
import {Link, useModel} from 'umi';
// @ts-ignore
import Marquee from 'react-fast-marquee';
import React, {useEffect, useState} from "react";
import ProCard from "@ant-design/pro-card";
import {NotificationOutlined, PlusOutlined} from "@ant-design/icons";
import {getNoticeList} from "@/service/person/notice";
import {ago} from "@/utils/time";
import {getContact, getNotice} from "@/service/person/config";
import NoticeInfo from "@/components/noticeInfo";
import {createStyles} from "antd-style";
import {Body} from "@/layouts/components";
//@ts-ignore
const useStyles = createStyles(({css, token, responsive}): any => {
    return {
        pageHeaderContent: {
            height: "150px",
            display: "flex",
            alignItems: "center",
        },
        avatar: {
            height: "65px",
            width: "65px",
            marginRight: "15px"
        },
        title: {
            fontSize: "20px",
            color: "rgba(0, 0, 0, 0.85)",
            marginBottom: "8px"
        },
        content: {
            fontSize: 14,
            color: "rgba(0, 0, 0, 0.45)"
        },
        right: {
            display: "flex",
            height:"150xpx"
        },
        money: {
            marginBottom: "4px",
            color: "rgba(0, 0, 0, 0.45)",
            fontSize: "14px",
            padding: "0 32px",
        },
        my: css`
            line-height: 30px !important;

            &::before {
                position: absolute;
                font-size: 16px;
                top: 10px;
                left: 6px;
                width: 4px;
                height: 26px;
                background-color: #0051eb;
                content: '';
            }
        `,
        notice: css`
            line-height: 30px !important;

            &::before {
                position: absolute;
                font-size: 16px;
                top: 8px;
                left: 6px;
                width: 4px;
                height: 24px;
                background-color: #0051eb;
                content: '';
            }
        `,
        projectGrid: {
            width: "33.33%",
            border: "1px solid #f6f6f6",
            borderRadius: " 0 !important",
            padding: "0px !important"
        },
        newButton: {
            width: "100%",
            height: "145px",
            borderRadius: "0 !important",
            color: "#979797",
            boxShadow: "none !important",
            border: "none !important",
            padding: "0px !important"
        },
        card: css`
            .ant-card-body {
                padding: 0 !important;
            }
        `,
        contact: {
            padding: "15px",
            height:"100%",
            width:"100%",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            avatar2: {
                marginRight:"10px"
            },
            info: {
                marginLeft: "10px",
                marginTop: "-3px",
                text: {
                    fontSize: "10px",
                    color: "rgb(155 155 155)",
                },
                uin: {
                    fontSize: "13px",
                    color: "rgb(155 155 155)",
                }
            },
            btn: {
                float: "right",
                button: {
                    marginTop: "10px",
                    fontSize: "10px",
                }
            }
        },
        inner:{
            display:"flex",
            width:"135px",
            justifyContent:"space-between"
        },
        inner1:{
            display:"flex",
            width:"105px",
            justifyContent:"space-between"
        },
    };
});
const PageHeaderContent: FC = () => {
    const {
        styles: {pageHeaderContent, avatar, title, content}
    } = useStyles();
    const user = useModel("user")
    const loading = user && Object.keys(user).length;
    if (!loading) {
        return <Skeleton avatar paragraph={{rows: 1}} active/>;
    }
    return (
        <div className={pageHeaderContent}>
            <Avatar src={user?.web?.avatar} className={avatar}/>
            <div>
                <div className={title}>
                    你好，
                    {user?.web?.nick_name}！
                </div>
                <div style={{maxWidth: "450px"}} className={content}>
                    尊敬的 <b>{user?.web?.nick_name}</b> ,欢迎回来，我们已等候多时！
                </div>
            </div>
        </div>
    );
};
const ExtraContent: FC = () => {
    const user = useModel("user")
    const {styles: {right, money}} = useStyles();
    return (
        <div className={right}>
            <div className={money}>
                <Statistic title="余额" prefix={"￥"} value={parseFloat(user?.web?.money || 0).toFixed(2)}/>
            </div>
            <div className={money}>
                <Statistic  title="身份" value={user?.web?.is_master ? '管理员' : (user?.web?.is_admin ? '站长' : '会员')}/>
            </div>
        </div>
    )
};

export default () => {
    const {
        styles: {
            avatar2,
            contact,
            info,
            text,
            uin,
            btn,
            projectList,
            projectGrid,
            newButton,
            my,
            card,
            notice,
            inner,
            inner1
        }
    } = useStyles();
    /**
     * 获取公告信息
     */
    const [noticeLoading, setNoticeLoading] = useState(true);
    const [noticeData, setNoticeData] = useState<any>([]);
    const getNoticeData = async () => {
        setNoticeLoading(true);
        const temp: any[] = [];
        await getNoticeList({
            body: {
                page: 1, page_size: 3, web_id: 'system', place: "index"
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    r?.data?.list?.map((k: any) => {
                        temp?.push(k);
                    });
                }
            }
        });
        await getNoticeList({
            body: {
                page: 1, page_size: 5, web_id: 'my', place: "index"
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    r?.data?.list?.map((k: any) => {
                        temp?.push(k);
                    });
                }
            }
        });
        setNoticeData(temp);
        setNoticeLoading(false);
    };
    /**
     * 滚动公告信息
     */
    const [notice2Loading, setNotice2Loading] = useState(true);
    const [notice2Data, setNotice2Data] = useState({});
    const getNotice2Data = () => {
        setNotice2Loading(true);
        getNotice({
            onSuccess: (r: any) => {
                setNotice2Loading(false);
                if (r?.code == 200) {
                    setNotice2Data(r?.data);
                }
            }
        })
    };
    /**
     * 客服信息
     */
    const [contactLoading, setContactLoading] = useState(true);
    const [contactData, setContactData] = useState({});
    const getContactData = () => {
        setContactLoading(true);
        getContact({
            onSuccess: (r: any) => {
                setContactLoading(false);
                if (r?.code == 200) {
                    setContactData(r?.data);
                }
            }
        })
    };
    /**
     * 查看公告
     */
    const [noticeId, setNoticeId] = useState(0);
    const [noticeVisible, setNoticeVisible] = useState(false);
    const showNoticeInfoModal = (id: number) => {
        setNoticeId(id);
        setNoticeVisible(true);
    }
    const hideNoticeInfoModal = () => {
        setNoticeId(0);
        setNoticeVisible(false);
    }
    /**
     * 初始化数据
     */
    useEffect(() => {
        getNoticeData();
        getNotice2Data();
        getContactData();
    }, []);
    return (
        <Body>
            <NoticeInfo id={noticeId} visible={noticeVisible} onClose={hideNoticeInfoModal}/>
            <Row gutter={24}>
                <Skeleton title={false} loading={notice2Loading} active>
                    <Col xl={24} md={24}
                         hidden={notice2Data?.['notice.index'] == "" || notice2Data?.['notice.index'] == null}>
                        <Alert
                            style={{fontSize:"14px", marginTop:"8px",marginBottom:"15px"}} banner
                            type={"info"}
                            message={
                                <Marquee pauseOnHover gradient={false}>
                                    {notice2Data?.['notice.index']}
                                </Marquee>
                            }
                        />
                    </Col>
                </Skeleton>
                <Col xl={24} md={24}>
                    <Card style={{marginBottom: "20px",height:"150px"}} className={card}>
                        <Row >
                            <Col span={12} style={{paddingLeft:"20px",boxSizing:"border-box"}}>
                                <PageHeaderContent/>
                            </Col>
                            <Col  span={12} style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <ExtraContent/>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                    <Row>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <ProCard
                                className={my}
                                headerBordered
                                style={{marginBottom: 24}}
                                title="我的数据"
                                bordered={false}
                                extra={<Link to="/user/index">查看全部</Link>}
                                loading={false}
                                bodyStyle={{padding: 0}}
                            >
                                <Card.Grid className={projectGrid} style={{padding: "0px"}}>
                                    <Card className={card} bordered={false}>
                                        <Button type="dashed" className={newButton}>
                                            <PlusOutlined/> 立即添加
                                        </Button>
                                    </Card>
                                </Card.Grid>
                            </ProCard>
                        </Col>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <ProCard
                                className={projectList}
                                headerBordered
                                style={{marginBottom: 24}}
                                bordered={false}
                                loading={contactLoading}
                                bodyStyle={{padding: 0}}
                            >
                                <Row>
                                    <Col xl={8} lg={8} md={8} sm={24} xs={24} hidden={contactData?.['contact.one'] == ''}>
                                        <div className={contact}>
                                            <div className={inner}>
                                                <Avatar className={avatar2}
                                                    src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.one'] || 10000) + "&spec=100"}
                                                    size="large" shape="square" style={{borderRadius: "5px"}}/>
                                                <div className={info}>
                                                    <div><span className={text}>官方客服</span></div>
                                                    <div><span
                                                        className={uin}>QQ:{contactData?.['contact.one']}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button size={"small"} className={btn} type="primary" ghost onClick={() => {
                                                window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.one'] + "&site=qq&menu=yes");
                                            }}>联系</Button>
                                        </div>
                                    </Col>
                                    <Col xl={8} lg={8} md={8} sm={24} xs={24} hidden={contactData?.['contact.two'] == ''}>
                                        <div className={contact}>
                                            <div className={inner1}>
                                                <Avatar className={avatar2}
                                                        src={"https://q4.qlogo.cn/headimg_dl?dst_uin=" + (contactData?.['contact.two'] || 10000) + "&spec=100"}
                                                        size="large" shape="square" style={{borderRadius: "5px"}}/>
                                                <div className={info}>
                                                    <div><span className={text}>官方客服</span></div>
                                                    <div><span
                                                        className={uin}>QQ:{contactData?.['contact.two']}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className={btn} size={"small"} type="primary" ghost onClick={() => {
                                                window.open("https://wpa.qq.com/wpa_jump_page?v=3&uin=" + contactData?.['contact.two'] + "&site=qq&menu=yes");
                                            }}>联系</Button>
                                        </div>
                                    </Col>
                                    <Col xl={8} lg={8} md={8} sm={24} xs={24}
                                         hidden={contactData?.['contact.three'] == '' || contactData?.['contact.four'] == ''}>
                                        <div className={contact}>
                                            <div className={inner}>
                                                <Avatar className={avatar2}
                                                        src={"https://p.qlogo.cn/gh/" + (contactData?.['contact.three'] || 10000) + "/" + (contactData?.['contact.three'] || 1000) + "/100"}
                                                        size="large" shape="square" style={{borderRadius: "5px"}}/>
                                                <div className={info}>
                                                    <div><span className={text}>官方Q群</span></div>
                                                    <div><span
                                                        className={uin}>群号:{contactData?.['contact.three']}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className={btn} size={"small"} type="primary" ghost onClick={() => {
                                                window.open(contactData?.['contact.four']);
                                            }}>加入</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </ProCard>
                        </Col>
                    </Row>
                </Col>
                <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                    <ProCard
                        style={{marginBottom: 24}}
                        className={notice}
                        headerBordered
                        title="系统公告"
                        loading={noticeLoading}
                        bodyStyle={{padding: "0 20px 0 20px"}}
                    >
                        <List
                            loading={noticeLoading}
                            itemLayout="horizontal"
                            dataSource={noticeData}
                            renderItem={(item: any) => (
                                <Skeleton avatar title={false} loading={noticeLoading} active>
                                    <List.Item
                                        actions={[<a key="list-loadmore-edit" onClick={() => {
                                            showNoticeInfoModal(item?.id || 0);
                                        }}>查看</a>]}
                                    >
                                        <List.Item.Meta
                                            key={"notice-" + item?.id}
                                            avatar={<NotificationOutlined
                                                style={{fontSize: "20px", lineHeight: "50px"}}/>}
                                            title={item?.title}
                                            description={<span
                                                style={{fontSize: "10px"}}>发布于 {ago(item?.create_time)} ,共 {item?.look_num} 次浏览</span>}
                                        />

                                    </List.Item>

                                </Skeleton>
                            )}
                        />
                    </ProCard>
                </Col>
            </Row>
        </Body>
    )
}