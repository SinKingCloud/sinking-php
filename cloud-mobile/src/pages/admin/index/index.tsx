import React, {Suspense, useEffect, useState} from 'react'
import {Body, Title} from "@/components";
import {Card, Grid,NoticeBar, Skeleton, ErrorBlock} from "antd-mobile";
import {getNotice} from "@/service/person/config";
import PageLoading from "@/pages/components/pageLoading";
import IntroduceRow from "@/pages/admin/index/introduceRow";
import {getChart, getCount, getToDo, getTopWeb} from "@/service/admin";
import {Col, Row, List} from "antd";
import numeral from "numeral";
import {getNoticeList} from "@/service/person/notice";
import {useModel} from "umi";
import dayjs from "dayjs";
import {ago} from "@/utils/time";
import {NotificationOutlined} from "@ant-design/icons";
import SalesCard from "@/pages/admin/index/salesCard";
import {Donut} from "@ant-design/charts";
import {createStyles} from "antd-style";
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
)
const useStyles = createStyles(({token})=>{
    return{
        head:{
            backgroundColor:`${token.colorPrimary} !important`,
            color:"#fff"
        },
        notice:{
            fontSize: "14px", borderRadius: "5px"
        },
        ava:{
            fontSize: "20px", lineHeight: "50px"
        }
    }
});
export default () => {
    const {styles:{head,notice,ava}} = useStyles();
    /**
     * 滚动公告信息
     */
    const [notice2Loading, setNotice2Loading] = useState(true);
    const [notice2Data, setNotice2Data] = useState({});
    const getNotice2Data = async () => {
        setNotice2Loading(true);
        await getNotice({
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
    const getGenCount = async () => {
        setCountLoading(true);
        await getCount({
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
    const getToDoData = async () => {
        setToDoLoading(true);
        await getToDo({
            onSuccess: (r: any) => {
                setToDoData(r?.data);
            },
            onFinally: () => {
                setToDoLoading(false);
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
            type = selectDateType;
        }
        if (rangeDate.length <= 0) {
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
                temp.data = r?.data;
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
                temp.topUser = r?.data;
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
                temp.topOrder = r?.data;
            }
        })
        setChartData(temp);
        setChartLoading(false);
    };
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
     * 获取公告信息
     */
    const user = useModel("user");
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
                r?.data?.list?.map((k: any) => {
                    temp?.push(k);
                });
            }
        });
        if (!user?.web?.is_master) {
            await getNoticeList({
                body: {
                    page: 1, page_size: 5, web_id: 'parent', place: "admin"
                },
                onSuccess: (r: any) => {
                    r?.data?.list?.map((k: any) => {
                        temp?.push(k);
                    });
                }
            });
        }
        setNoticeData(temp);
        setNoticeLoading(false);
    };
    const [pageLoading, setPageLoading] = useState(false);
    useEffect(() => {
        setPageLoading(true)
        getNotice2Data().finally(() => {
            getGenCount().finally(() => {
                getToDoData().finally(() => {
                    getChartData().finally(() => {
                        getNoticeData().finally(() => {
                            setPageLoading(false)
                        });
                    });
                });
            });
        });
    }, []);
    return (
        <Body title="网站概览" showBack={true} titleStyle={{color:"#fff"}} headClassNames={head} loading={pageLoading}>
            {notice2Loading && <Skeleton.Paragraph animated/> ||
                notice2Data?.['notice.admin'] != null && <NoticeBar content={notice2Data?.['notice.admin']} color='info' className={notice}/>
            }
            <Suspense fallback={<PageLoading/>}>
                <IntroduceRow loading={countLoading} countData={countData?.sum} visitData={countData?.count}/>
            </Suspense>
            <Suspense fallback={<PageLoading/>}>
                <Card bordered={false} loading={toDoLoading}>
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
                <Grid columns={1} gap={8}>
                    <Grid.Item>
                        <Card title={<Title>金额占比</Title>}>
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
                        </Card>
                    </Grid.Item>
                    <Grid.Item>
                        <Card title={<Title>系统公告</Title>}>
                            {noticeData.length > 0 && <List
                                    loading={noticeLoading}
                                    itemLayout="horizontal"
                                    dataSource={noticeData}
                                    renderItem={(item: any) => (
                                        <Skeleton avatar title={false} loading={noticeLoading} active>
                                            <List.Item>
                                                <List.Item.Meta
                                                    key={"notice-" + item?.id}
                                                    avatar={<NotificationOutlined className={ava}/>}
                                                    title={item?.title}
                                                    description={<span
                                                        style={{fontSize: "10px"}}>发布于 {ago(item?.create_time)} ,共 {item?.look_num} 次浏览</span>}
                                                />
                                            </List.Item>
                                        </Skeleton>
                                    )}
                                /> ||
                                <ErrorBlock status='empty' />
                            }

                        </Card>
                    </Grid.Item>
                </Grid>
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
    )
}