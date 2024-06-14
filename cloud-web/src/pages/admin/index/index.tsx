import React, {Suspense, useEffect, useState} from 'react';
import PageLoading from "@/pages/components/dashboard/pageLoading";
import IntroduceRow from "./components/introduceRow";
import {getChart, getCount, getToDo, getTopWeb} from "@/service/admin";
import SalesCard from "./components/salesCard";
import dayjs from "dayjs";
import {Alert, Card, Col, List, Row, Skeleton} from "antd";
import {Body} from "@/components";
import NoticeInfo from "@/pages/components/noticeInfo";
import Marquee from "react-fast-marquee";
import {getNoticeList} from "@/service/person/notice";
import {getNotice} from "@/service/person/config";
import numeral from "numeral";
import ProCard from "@ant-design/pro-card";
import {NotificationOutlined} from "@ant-design/icons";
import {ago} from "@/utils/time";
import {DonutConfig} from "@ant-design/charts/es/donut";
import {Donut} from "@ant-design/charts";
import {useModel} from "umi";

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
export default (): React.ReactNode => {
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
            onFinally:()=>{
                setCountLoading(false)
            }
        });
    };
    /**
     * 数据表格
     */
    const [chartLoading, setChartLoading] = useState(true);
    const [chartData, setChartData] = useState<any>({});
    const [rangePickerValue, setRangePickerValue] = useState<any>([
        dayjs().add(-30, 'days'),
        dayjs(),
    ]);
    const [selectDateType, setSelectDateType] = useState<any>(1);
    const getChartData = async (type: number = 0, rangeDate: any[] = []) => {
        if (type <= 0) {
            // eslint-disable-next-line no-param-reassign
            type = selectDateType;
        }
        if (rangeDate.length <= 0) {
            // eslint-disable-next-line no-param-reassign
            rangeDate = rangePickerValue;
        }
        const temp = {
            data: [],
            topUser: [],
            topOrder: [],
        };
        const start_date = dayjs(rangeDate[0]).format('YYYY-MM-DD');
        const end_date = dayjs(rangeDate[1]).format('YYYY-MM-DD');
        setChartLoading(true);
        await getChart({
            body: {
                type: type,
                start_date: start_date,
                end_date: end_date
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    temp.data = r?.data;
                }
            }
        });

        await getTopWeb({
            body: {
                type: type,
                order_by: 'user_num',
                start_date: start_date,
                end_date: end_date,
                limit: 7
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    temp.topUser = r?.data;
                }
            }
        })
        await getTopWeb({
            body: {
                type: type,
                order_by: 'order_succ_num',
                start_date: start_date,
                end_date: end_date,
                limit: 7
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    temp.topOrder = r?.data;
                }
            }
        })
        setChartData(temp);
        setChartLoading(false);
    }
    // 更改日期事件
    const handleRangePickerChange = (value: any) => {
        setRangePickerValue(value);
        getChartData(selectDateType, value);
    };
    //更改类型事件
    const selectDate = (type: number) => {
        setSelectDateType(type);
        getChartData(type, rangePickerValue);
    };

    /**
     * 数据概览
     */
    const [toDoLoading, setToDoLoading] = useState(true);
    const [toDoData, setToDoData] = useState<any>({});
    const getToDoData = () => {
        setToDoLoading(true);
        getToDo({
            onSuccess: (r: any) => {
                    setToDoData(r?.data);
            },
            onFinally:()=>{
                setToDoLoading(false);
            }
        });
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
     * 获取公告信息
     */
    const user = useModel("user")
    const [noticeLoading, setNoticeLoading] = useState(true);
    const [noticeData, setNoticeData] = useState<any>([]);
    const getNoticeData = async () => {
        setNoticeLoading(true);
        const temp: any[] = [];
        await getNoticeList({
            body: {
                page: 1, page_size: 3, web_id: 'system', place: "admin"
            },
            onSuccess: (r: any) => {
                if (r?.code == 200) {
                    r?.data?.list?.map((k: any) => {
                        temp?.push(k);
                    });
                }
            }
        });
        if (!user?.web?.is_master) {
            await getNoticeList({
                body: {
                    page: 1, page_size: 5, web_id: 'parent', place: "admin"
                },
                onSuccess: (r: any) => {
                    if (r?.code == 200) {
                        r?.data?.list?.map((k: any) => {
                            temp?.push(k);
                        });
                    }
                }
            });
        }
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
            body: {
                type: "p"
            },
            onSuccess: (r: any) => {
                setNotice2Data(r?.data);
            },
            onFinally:()=>{
                setNotice2Loading(false);
            }
        })
    };
    /**
     * 加载数据
     */
    useEffect(() => {
        getGenCount();
        getChartData();
        getToDoData();
        getNotice2Data()
        getNoticeData()
    }, []);
    return (
        <Body>
            <NoticeInfo id={noticeId} open={noticeVisible} onClose={hideNoticeInfoModal}/>
            <Suspense fallback={<PageLoading/>}>
                <Skeleton title={false} loading={notice2Loading} active>
                    {notice2Data?.['notice.admin'] && <Col xl={24} md={24}>
                        <Alert
                            style={{fontSize: "14px", marginTop: "8px", marginBottom: "8px"}} banner
                            type="info"
                            message={
                                <Marquee pauseOnHover gradient={false}>
                                    {notice2Data?.['notice.admin']}
                                </Marquee>
                            }
                        />
                    </Col>}
                </Skeleton>
            </Suspense>
            <Suspense fallback={<PageLoading/>}>
                <IntroduceRow loading={countLoading} countData={countData?.sum} visitData={countData?.count}/>
            </Suspense>
            <Suspense fallback={<PageLoading/>}>
                <Card bordered={false} loading={toDoLoading} style={{marginBottom: "10px"}}>
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
            <Suspense fallback={<PageLoading/>}>
                <Row gutter={24}>
                    <Col sm={12} md={12} xs={24} style={{marginBottom: "10px"}}>
                        <ProCard headerBordered title="金额占比" loading={countLoading}>
                            <Donut
                                forceFit
                                height={340}
                                radius={0.8}
                                angleField="value"
                                colorField="type"
                                data={countData?.donut || []}
                                legend={{
                                    visible: true,
                                }}
                                meta={{
                                    value: {
                                        alias: "金额"
                                    },
                                    type: {
                                        alias: "类型",
                                        formatter: (v) => {
                                            if (v == 'consume_money') {
                                                return '消费金额';
                                            }
                                            if (v == 'deduct_money') {
                                                return '提成金额';
                                            }
                                            if (v == 'recharge_money') {
                                                return '充值金额';
                                            }
                                            return v;
                                        },
                                    }
                                }}
                                tooltip={{visible: true}}
                                label={{
                                    visible: true,
                                    type: 'spider',
                                    style: {
                                        fill: 'rgb(122,122,122)',
                                    },
                                    line: {
                                        stroke: "rgb(122,122,122)"
                                    },
                                    formatter: (text, item) => {
                                        let name = item._origin.type;
                                        if (item._origin.type == 'consume_money') {
                                            name = '消费金额';
                                        }
                                        if (item._origin.type == 'deduct_money') {
                                            name = '提成金额';
                                        }
                                        if (item._origin.type == 'recharge_money') {
                                            name = '充值金额';
                                        }
                                        return `${name}: ${numeral(item._origin.value).format('0,0')} 元`;
                                    },
                                }}
                                statistic={
                                    {
                                        totalLabel: '总流水金额',
                                        visible: true,
                                        htmlContent: () => {
                                            let sums = 0;
                                            (countData?.donut || []).map((item: any) => {
                                                sums = sums + (item?.value || 0);
                                            })
                                            return '总流水:' + sums.toFixed(2);
                                        },
                                    } as unknown as DonutConfig['statistic']
                                }
                            />
                        </ProCard>
                    </Col>
                    <Col sm={12} md={12} xs={24} style={{marginBottom: "20px"}}>
                        <ProCard headerBordered title="系统公告" loading={noticeLoading}
                                 bodyStyle={{padding: "0 20px 0 20px"}}>
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
            </Suspense>
            <Suspense fallback={null}>
                <SalesCard
                    rangePickerValue={rangePickerValue}
                    salesData={chartData}
                    dateType={selectDateType}
                    handleRangePickerChange={handleRangePickerChange}
                    loading={chartLoading}
                    selectDate={selectDate}
                />
            </Suspense>
        </Body>
    );
};
