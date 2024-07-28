import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, ErrorBlock, Skeleton} from "antd-mobile";
import {Look, Time, User} from "@/components/icon";
import {useParams} from "umi"
import {getNoticeInfo} from "@/service/person/notice";
import {ago} from "@/utils/time";
import {createStyles} from "antd-style";

const useStyles = createStyles((): any => {
    return {
        p: {
            fontSize: "15px",
            color: "red",
            textAlign: "center",
            fontWeight: 600,
            marginBottom: 0,
            marginTop: 0
        },
        div: {
            fontSize: "11px",
            color: "gray",
            borderBottom: "1px dashed #eeeeee",
            paddingBottom: "10px",
            textAlign: "center"
        },
        manage: {
            marginRight: "15px"
        },
        rig: {
            marginRight: "2px"
        },
        sp: {
            marginRight: "5px"
        },
        look: {
            marginRight: "2px", fontSize: "24px"
        }
    }
})
export default () => {
    const {styles: {p, div, manage, rig, sp, look}} = useStyles();

    const params = useParams<any>();
    const [noticeData, setNoticeData] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params?.id != undefined || params?.id != "") {
            setLoading(true)
            getNoticeInfo({
                body: {
                    id: params?.id
                },
                onSuccess: (r: any) => {
                    setNoticeData(r?.data)
                },
            }).finally(() => {
                setLoading(false);
            })
        }
    }, []);

    return (
        <Body title={"系统公告"} loading={loading}>
            {
                (noticeData && <Card>
                    <p className={p}>{noticeData?.title}</p>
                    <div className={div}>
                        <span className={manage}><Icon type={User} className={rig}/>管理员</span>
                        <span className={sp}><Icon type={Time}
                                                   className={rig}/>{ago(noticeData?.create_time || '0000-00-00 00:00:00')}</span>
                        <span><Icon type={Look} className={look}/>{noticeData?.look_num || 0}次</span>
                    </div>
                    <p dangerouslySetInnerHTML={{__html: noticeData?.content || ""}}/>
                </Card>) || <ErrorBlock status='empty' title="没有查询到这条公告的信息"/>
            }
        </Body>
    )
}