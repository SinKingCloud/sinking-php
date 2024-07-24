import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, ErrorBlock, List, Skeleton} from "antd-mobile";
import {createStyles} from "antd-style";
import {getNoticeList} from "@/service/person/notice";
import {Message} from "@/components/icon";
import {ago} from "@/utils/time";
import {historyPush} from "@/utils/route";
import {Empty} from "antd";
const useStyles = createStyles(({token,isDarkMode})=>{
    return {
        head:{
            backgroundColor: `${token.colorPrimary} !important`,
            color: "#fff"
        },
        p:{
            fontSize:"16px",
            lineHeight:1,
            margin:"10px 0 !important"
        },
        span:{
            fontSize:"12px",
            color:"gray"
        },
        list: {
            ".adm-list-item ": {
                paddingLeft: "0 !important"
            },
            ".adm-list-header": {
                borderRadius: "5px",
                fontSize: "12px !important",
            },
            "--border-top": "none", "--border-bottom": "none"
        },
        icon: {
            ".adm-list-item-content-arrow": {
                fontSize: "15px",
                color:isDarkMode ? "#b3b3b3" : "rgba(0,0,0,0.7)"
            },
            ".adm-list-item-description": {
                marginTop: "3px"
            }
        },
        listSpan:{
            fontSize: "14px",
            color: isDarkMode ? "#b3b3b3" : "#000"
        },
        preFix:{
            fontSize: "18px", color: "#ff8f1f"
        }
    }
})
export default () => {
    const {styles:{head,p,span,list,icon,listSpan,preFix}} = useStyles()
    const [noticeData, setNoticeData] = useState<any>([]);
    const [noticeLoading, setNoticeLoading] = useState(false)
    const getNoticeData = async () => {
        setNoticeLoading(true)
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
                setNoticeLoading(false)
            }
        });
        setNoticeData(temp);
    };
    const [pageLoading,setPageLoading] = useState(false)
    useEffect(() => {
        setPageLoading(true)
        getNoticeData().then(()=>{
            setPageLoading(false)
        })
    }, []);
    return (
        <Body title="帮助中心" titleStyle={{color:"#fff"}} loading={pageLoading} headClassNames={head} space={true}>
            <Card >
                <p className={p}>问题帮助中心</p>
                <span className={span}>这里提供使用注意事项、常见问题解答帮助等内容，欢迎查看</span>
                <List className={list} >
                    {noticeLoading && <Skeleton.Paragraph animated/> ||
                       noticeData.length > 0 && noticeData.map(user => (
                            <List.Item
                                className={icon}
                                key={user?.id}
                                prefix={<Icon type={Message} className={preFix}/>}
                                extra={''}
                                description={<span
                                    style={{fontSize: "10px"}}>发布于 {ago(user?.create_time)} ,共 {user?.look_num} 次浏览</span>}
                                onClick={() => {
                                    historyPush("user.notice.info", {id: user?.id})
                                }}
                            >
                                <span className={listSpan}>{user?.title}</span>
                            </List.Item>
                        )) || noticeData.length === 0 &&  <ErrorBlock status='empty'/>
                    }
                </List>
            </Card>
        </Body>
    )
}