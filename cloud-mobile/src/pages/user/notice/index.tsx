import React, {useEffect, useState} from 'react'
import {Body, Icon, Title} from "@/components";
import {Card, List, Skeleton} from "antd-mobile";
import {Message} from "@/components/icon";
import {ago} from "@/utils/time";
import {historyPush} from "@/utils/route";
import {getNoticeList} from "@/service/person/notice";
import {createStyles, useTheme} from "antd-style";
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
        tit: {
            fontSize: "14px",
            color: isDarkMode ? "#b3b3b3" : "#000",
            fontWeight: 600
        },
    }
})
export default () => {
    const {styles: {list, icon, card, tit}} = useStyles()
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
    useEffect(() => {
        getNoticeData()
    }, []);
    const theme = useTheme()
    return (
        <Body showHeader={false}>
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
                                    historyPush("user.noticeInfo", {id: user?.id})
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
    )

}