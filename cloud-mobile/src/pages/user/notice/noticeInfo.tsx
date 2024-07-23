import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, Skeleton} from "antd-mobile";
import {Look, Time, User} from "@/components/icon";
import {useParams} from "umi"
import {getNoticeInfo} from "@/service/person/notice";
import {ago} from "@/utils/time";
export default () => {
    const params = useParams<any>()
    const [noticeData,setNoticeData] = useState()
    const [loading,setLoading] = useState(false)
    useEffect(() => {
        if(params?.id != undefined || params?.id != ""){
            setLoading(true)
            getNoticeInfo({
                body:{
                    id:params?.id
                },
                onSuccess: (r: any) => {
                    setNoticeData(r?.data)
                },
                onFinally:()=>{
                    setLoading(false)
                }
            })
        }
    }, []);
    return (
        <Body title={"系统公告"} >
            {loading && <Skeleton.Paragraph  animated /> ||
                <Card>
                    <p style={{
                        fontSize: "15px",
                        color: "red",
                        textAlign: "center",
                        fontWeight: 600,
                        marginBottom:0,
                        marginTop:0
                    }}>{noticeData?.title}</p>
                    <div style={{
                        fontSize: "11px",
                        color: "gray",
                        borderBottom: "1px dashed #eeeeee",
                        paddingBottom: "10px",
                        textAlign:"center"
                    }}>
                        <span style={{marginRight: "15px"}}><Icon type={User} style={{marginRight: "2px"}}/>管理员</span>
                        <span style={{marginRight:"5px"}}><Icon type={Time} style={{marginRight: "2px"}}/>{ago(noticeData?.create_time || '0000-00-00 00:00:00')}</span>
                        <span><Icon type={Look} style={{marginRight: "2px",fontSize:"24px"}}/>{noticeData?.look_num || 0}次</span>
                    </div>
                    <p dangerouslySetInnerHTML={{__html: noticeData?.content || ""}}/>
                </Card>
            }
        </Body>
    )
}