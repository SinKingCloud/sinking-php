import React, { Suspense, useEffect, useState} from 'react';
import PageLoading from "@/pages/components/dashboard/pageLoading";
import IntroduceRow from "./components/introduceRow";
import {getChart, getCount, getToDo, getTopWeb} from "@/service/master";
import SalesCard from "./components/salesCard";
import dayjs from "dayjs";
import {Card, Col, Row} from "antd";
import {Body} from "@/components";
const Info: React.FC<{
    title: React.ReactNode;
    value: React.ReactNode;
    bordered?: boolean;
}> = ({title, value, bordered}) => (
    <div style={{position: "relative",textAlign: "center"}}>
        <span style={{display: "inline-block", marginBottom: "4px", lineHeight: "22px"}}>{title}</span>
        <p style={{margin: 0, fontSize: "24px", lineHeight: "32px"}}>{value}</p>
        {bordered && <em style={{position: "absolute", top: 0, right: 0, width:"1px", height: "56px"}}/>}
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
            onSuccess:(r:any)=>{
                setCountLoading(false)
                if(r?.code == 200){
                    setCountData(r?.data);
                }
            }
        });
    };
    /**
     * 数据表格
     */
    const [chartLoading, setChartLoading] = useState(true);
    const [chartData, setChartData] = useState<any>({});
    const [rangePickerValue, setRangePickerValue] = useState<any>( [
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
            body:{
                type: type,
                start_date: start_date,
                end_date: end_date
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    temp.data = r?.data;
                }
            }
        });

        await getTopWeb({
            body:{
                type: type,
                order_by: 'user_num',
                start_date: start_date,
                end_date: end_date,
                limit: 7
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    temp.topUser = r?.data;
                }
            }
        })
        await getTopWeb({
            body:{
                type: type,
                order_by: 'order_succ_num',
                start_date: start_date,
                end_date: end_date,
                limit: 7
            },
            onSuccess:(r:any)=>{
                if(r?.code == 200){
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
            onSuccess:(r:any)=>{
                if(r?.code == 200){
                    setToDoData(r?.data);
                    setToDoLoading(false);
                }
            }
        });
    };

    /**
     * 加载数据
     */
    useEffect(() => {
        getGenCount();
        getChartData();
        getToDoData();
    }, []);
    return (
        <Body>
                <Suspense fallback={<PageLoading/>}>
                    <IntroduceRow loading={countLoading} countData={countData?.sum} visitData={countData?.count}/>
                </Suspense>
                <Suspense fallback={<PageLoading/>}>
                    <Card bordered={false} loading={toDoLoading} style={{marginBottom: "20px"}}>
                        <Row>
                            <Col sm={12} md={12} xs={12}>
                                <Info title="我的待办" value={(toDoData?.cash || 0) > 0 ? toDoData?.cash + '个提现' : '暂无'} bordered/>
                            </Col>
                            <Col sm={12} md={12} xs={12}>
                                <Info title="程序版本 " value={toDoData?.version?.name || "latest"}/>
                            </Col>
                        </Row>
                    </Card>
                </Suspense>
                <Suspense fallback={null} >
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
