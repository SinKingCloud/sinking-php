import type {FC} from 'react';
import {Avatar, Card, Col, Skeleton, Row, Statistic, Alert, Button, List} from 'antd';
import {Link, useModel} from 'umi';
import Marquee from 'react-fast-marquee';
import React, {useEffect, useState} from "react";
import ProCard from "@ant-design/pro-card";
import {NotificationOutlined, PlusOutlined} from "@ant-design/icons";
import {getNoticeList} from "@/service/person/notice";
import {ago} from "@/utils/time";
import {getContact, getNotice} from "@/service/person/config";
import NoticeInfo from "@/pages/components/noticeInfo";
import {createStyles, useResponsive} from "antd-style";
import {Title,Body} from "@/components";
import Mobile from "@/components/mobile";
const useStyles = createStyles(({css, responsive, isDarkMode}): any => {
    const color = isDarkMode ? "#fff" : "rgba(0, 0, 0, 0.85)"
    const border = isDarkMode ? "1px solid rgb(50, 50, 50)" : "1px solid #f6f6f6"
    return {
        pageHeaderContent: css`
            display: flex;
            align-items: center;
            padding: 10px;
        `,
        avatar: css`
            height: 65px;
            width: 65px;
            margin-right: 15px;
            flex-shrink: 0;

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
                margin-bottom: 10px;
            }
        `,
        box: css`
            height: 65px;
        `,
        title: css`
            margin-top: 8px;
            font-size: 20px;
            color: ${color};
            line-height: 1;

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
                text-align: center;
                margin-top: 0;
                line-height: 1;
            }
        `,
        content: css`
            font-size: 15px;
            line-height: 1;
            color: ${color};

            ${responsive.md && responsive.xl && responsive.lg && responsive.sm} {
                line-height: 20px;
            }
        `,
        right: css`
            display: flex;
            align-items: center;
        `,
        money: css`
            margin-bottom: 4px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 14px;
            padding: 0 30px;
            box-sizing: border-box;
            display: flex;
            align-items: center;

            ${responsive.md} {
                padding: 0 30px;
                box-sizing: border-box;
                margin-top: 10px;
                .ant-statistic-title {
                    font-size: 14px;
                }
                .ant-statistic-content {
                    font-size: 22px !important;
                }
            }
        `,
        projectGrid: css`
            width: 33.33%;
            border: ${border};
            border-radius: 0 !important;
            padding: 0 !important;

            ${responsive.md} {
                width: 100%;

                .ant-card-body {
                    padding: 0 !important;
                }
            }
        `,
        newButton: css`
            width: 100%;
            height: 145px;
            border-radius: 0 !important;
            color: ${color};
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
        `,
        contact: {
            padding: "15px",
            height: "100%",
            // width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            info: {
                marginLeft: "10px",
                marginTop: "-3px",
                text: {
                    fontSize: "10px",
                    color: "rgb(122 122 122)",
                },
                uin: {
                    fontSize: "13px",
                    color: "rgb(122 122 122)",
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
        avatar2: css`
            margin-right: 15px;
        `,
        inner: {
            display: "flex",
            justifyContent: "space-between"
        },
        align: css`
            width: 100%;
            display: flex;
            align-items: center;

            ${responsive.md} {
                display: flex;
                flex-direction: column;

                .ant-col-16 {
                    max-width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center
                }

                .ant-col-8 {
                    max-width: 100%;
                }
            }
        `,
        my: css`
            .ant-pro-card-header {
                margin-bottom: 5px;
                padding-inline: 16px;
            }
        `,
        card: css`
            .ant-card-body {
                padding: 0 !important;
            }
        `
    };
});
const PageHeaderContent: FC = () => {
    const {
        styles: {box, avatar, title, content}
    } = useStyles();
    const user = useModel("user");
    const loading = user && Object.keys(user).length;
    if (!loading) {
        return <Skeleton avatar paragraph={{rows: 1}} active/>;
    }
    return (
        <>
            <Avatar src={user?.web?.avatar} className={avatar}/><br/>
            <div className={box}>
                <div className={title}>
                    你好，
                    {user?.web?.nick_name}！
                </div>
                <br/>
                <div style={{maxWidth: "450px"}} className={content}>
                    尊敬的 <b>{user?.web?.nick_name}</b> ,欢迎回来，我们已等候多时！
                </div>
            </div>
        </>

    );
};
const ExtraContent: FC = () => {
    const user = useModel("user")
    const {styles: {money}} = useStyles();
    return (
        <>
            <div className={money}>
                <Statistic title="余额" prefix={"￥"} value={parseFloat(user?.web?.money || 0).toFixed(2)}/>
            </div>
            <div className={money}>
                <Statistic title="身份"
                           value={user?.web?.is_master ? '管理员' : (user?.web?.is_admin ? '站长' : '会员')}/>
            </div>
        </>
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
            inner,
            align,
            pageHeaderContent,
            right,
            card
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
                    setNotice2Data(r?.data);
            },
            onFinally:()=>{
                setNotice2Loading(false);
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
                    setContactData(r?.data);
            },
            onFinally:()=>{
                setContactLoading(false);
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
    const {mobile} = useResponsive()
    /**
     * 初始化数据
     */
    useEffect(() => {
        getNoticeData();
        getNotice2Data();
        getContactData();
    }, []);
    const page = <>
        <NoticeInfo id={noticeId} open={noticeVisible} onClose={hideNoticeInfoModal}/>
        <Row gutter={24}>
            <Skeleton title={false} loading={notice2Loading} active>
                {notice2Data?.['notice.index'] && <Col xl={24} md={24}>
                    <Alert
                        style={{fontSize: "14px", marginTop: "8px", marginBottom: "15px"}} banner
                        type={"info"}
                        message={
                            <Marquee pauseOnHover gradient={false}>
                                {notice2Data?.['notice.index']}
                            </Marquee>
                        }
                    />
                </Col>}
            </Skeleton>
            <Col xl={24} md={24}>
                <Card style={{marginBottom: "20px"}}>
                    <Row className={align}>
                        <Col span={16} className={pageHeaderContent}>
                            <PageHeaderContent/>
                        </Col>
                        <Col span={8} className={right}>
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
                            style={{marginBottom: 24}}
                            title={<Title>我的数据</Title>}
                            extra={<Link to="/user/index">查看全部</Link>}
                            loading={false}
                            bodyStyle={{padding: 0}}
                        >
                            <Card.Grid className={projectGrid} style={{padding: "0px"}}>
                                <Card className={card} bordered={false}>
                                    <Button className={newButton}>
                                        <PlusOutlined/> 立即添加
                                    </Button>
                                </Card>
                            </Card.Grid>
                        </ProCard>
                    </Col>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <ProCard
                            className={projectList}
                            style={{marginBottom: 24}}
                            bordered={false}
                            loading={contactLoading}
                            bodyStyle={{padding: 0}}
                        >
                            <Row>
                                <Col xl={8} lg={8} md={8} sm={24} xs={24} span={8}
                                     hidden={contactData?.['contact.one'] == ''}>
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
                                <Col xl={8} lg={8} md={8} sm={24} xs={24} span={8}
                                     hidden={contactData?.['contact.two'] == ''}>
                                    <div className={contact}>
                                        <div className={inner}>
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
                                <Col xl={8} lg={8} md={8} sm={24} xs={24} span={8}
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
                    className={my}
                    title={<Title>系统公告</Title>}
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
    </>
    return <>
            {mobile && <Mobile showHeader={false} showBack={false}>{page}</Mobile> || <Body>
                {page}
            </Body>}
        </>
}