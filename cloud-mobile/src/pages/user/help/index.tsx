import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, ErrorBlock, List, Skeleton} from "antd-mobile";
import {createStyles} from "antd-style";
import {getNoticeList} from "@/service/person/notice";
import {Message} from "@/components/icon";
import {historyPush} from "@/utils/route";
import defaultSettings from "../../../../config/defaultSettings";

const useStyles = createStyles(({token, isDarkMode}): any => {
    return {
        body: {
            userSelect: "none"
        },
        head: {
            backgroundColor: `${token.colorPrimary} !important`,
            color: "#fff"
        },
        describe: {
            padding: "10px 15px",
            borderTopLeftRadius: "7px",
            borderTopRightRadius: "7px",
            height: "60px",
            backgroundColor: token?.colorInfoBg,
        },
        img: {
            height: "55px",
            width: "80px",
            position: "absolute",
            top: "12px",
            right: "25px",
        },
        card: {
            ".adm-card": {
                padding: "0 var(--adm-card-padding-inline, 0px)",
                background: "transparent !important"
            },
            ".adm-card-body": {
                padding: "var(--adm-card-body-padding-block, 0px) 0"
            },
            ".adm-card-header-title": {
                paddingLeft: "12px"
            },
            ".adm-list-item-content-prefix": {
                marginLeft: "12px"
            },
            ".adm-error-block": {
                margin:"20vh 0"
            }
        },
        p: {
            fontSize: "16px",
            fontWeight: "bolder",
            color: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
            lineHeight: 1,
            margin: "10px 0 !important"
        },
        span: {
            fontSize: "12px",
            color: isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)"
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
        icon: {
            ".adm-list-item-content-arrow": {
                fontSize: "15px",
                color: isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
            },
            ".adm-list-item-description": {
                marginTop: "3px"
            }
        },
        listSpan: {
            fontSize: "12px",
            color: isDarkMode ? "#b3b3b3" : "#4f4f4f"
        },
        preFix: {
            fontSize: "14px", color: token?.colorPrimary
        },
    }
});

export default () => {

    const {styles: {head, p, span, list, icon, listSpan, preFix, body, card, describe, img}} = useStyles();

    const [noticeData, setNoticeData] = useState<any>([]);
    const [noticeLoading, setNoticeLoading] = useState(true);
    const getNoticeData = async () => {
        setNoticeLoading(true);
        const temp: any[] = [];
        await getNoticeList({
            body: {
                page: 1, page_size: 5, web_id: 'my', place: "help"
            },
            onSuccess: (r: any) => {
                r?.data?.list?.map((k: any) => {
                    temp?.push(k);
                });
            },
            onFinally: () => {
                setNoticeLoading(false);
            }
        });
        setNoticeData(temp);
    };

    const [pageLoading, setPageLoading] = useState(false);
    useEffect(() => {
        setPageLoading(true);
        getNoticeData().then(() => {
            setPageLoading(false);
        });
    }, []);

    return (
        <Body title="帮助中心" titleStyle={{color: "#fff"}} loading={pageLoading} headClassNames={head}
              bodyClassNames={body + " " + card} space={true}>
            <Card>
                {noticeLoading && <Skeleton.Paragraph animated/> ||
                    (noticeData?.length <= 0 && <ErrorBlock status='empty'/>) ||
                    <>
                        <div className={describe} style={{}}>
                            <p className={p}>问题帮助中心</p>
                            <span className={span}>此页面可帮助您查阅并解决相关使用问题</span>
                            <img src={((defaultSettings?.basePath || "/") + "images/help.png")}
                                 className={img}
                                 alt="帮助信息"/>
                        </div>
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
                            ))}</List>
                    </>
                    || noticeData.length === 0 && <ErrorBlock status='empty' title="系统还没有发布帮助信息哦"/>
                }
            </Card>
        </Body>
    )
}