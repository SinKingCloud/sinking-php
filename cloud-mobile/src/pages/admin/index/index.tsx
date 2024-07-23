import React, {Suspense, useEffect, useState} from 'react'
import {Body} from "@/components";
import {Card, NoticeBar, Skeleton} from "antd-mobile";
import {getNotice} from "@/service/person/config";
import PageLoading from "@/pages/components/pageLoading";
import IntroduceRow from "@/pages/admin/index/introduceRow";
import {getCount, getToDo} from "@/service/admin";
import {Col, Row} from "antd";
const Info: React.FC<{
    title: React.ReactNode;
    value: React.ReactNode;
    bordered?: boolean;
}> = ({title, value, bordered}) => (
    <div style={{position: "relative", textAlign: "center"}}>
        <span style={{display: "inline-block", marginBottom: "4px", lineHeight: "22px"}}>{title}</span>
        <p style={{margin: 0, fontSize: "24px", lineHeight: "32px"}}>{value}</p>
        {bordered && <em style={{position: "absolute", top: 0, right: 0, width: "1px", height: "56px"}}/>}
    </div>
);
export default () => {
    /**
     * 滚动公告信息
     */
    const [notice2Loading, setNotice2Loading] = useState(true);
    const [notice2Data, setNotice2Data] = useState({});
    const getNotice2Data = () => {
        setNotice2Loading(true);
        getNotice({
            body: {
                type: "p"
            },
            onSuccess: (r: any) => {
                setNotice2Data(r?.data);
            },
            onFinally: () => {
                setNotice2Loading(false);
            }
        })
    };
    /**
     * 数据概览
     */
    const [countLoading, setCountLoading] = useState(true);
    const [countData, setCountData] = useState<any>({});
    const getGenCount = () => {
        setCountLoading(true);
        getCount({
            onSuccess: (r: any) => {
                setCountData(r?.data);
            },
            onFinally: () => {
                setCountLoading(false)
            }
        });
    };
    const [toDoLoading, setToDoLoading] = useState(true);
    const [toDoData, setToDoData] = useState<any>({});
    const getToDoData = () => {
        setToDoLoading(true);
        getToDo({
            onSuccess: (r: any) => {
                setToDoData(r?.data);
            },
            onFinally: () => {
                setToDoLoading(false);
            }
        });
    };
    useEffect(() => {
        getNotice2Data()
        getGenCount()
        getToDoData()
    }, []);
    return (
        <Body title="网站管理" showBack={true}>
            {notice2Loading &&  <Skeleton.Paragraph animated /> ||
                notice2Data?.['notice.admin'] != null &&  <NoticeBar content={notice2Data?.['notice.admin']} color='info' style={{fontSize: "14px", borderRadius: "5px"}}/>
            }
            <Suspense fallback={<PageLoading/>}>
                <IntroduceRow loading={countLoading} countData={countData?.sum} visitData={countData?.count}/>
            </Suspense>
            <Suspense fallback={<PageLoading/>} >
                <Card bordered={false} loading={toDoLoading} >
                    <Row>
                        <Col sm={12} md={12} xs={12}>
                            <Info title="我的待办"
                                  value={(toDoData?.cash || 0) > 0 ? toDoData?.cash + '个提现' : '暂无'} bordered/>
                        </Col>
                        <Col sm={12} md={12} xs={12}>
                            <Info title="累计提成 " value={'￥' + (toDoData?.deduct_money || 0)?.toFixed(2)}/>
                        </Col>
                    </Row>
                </Card>
            </Suspense>
        </Body>
    )
}