import React, {FC, Suspense, useEffect, useState} from 'react';
import {GridContent} from '@ant-design/pro-layout';
import PageLoading from "@/components/Other/Dashboard/PageLoading";
import IntroduceRow from "@/pages/master/index/components/IntroduceRow";
import {getChart, getCount, getToDo, getTopWeb} from "@/services/master";
import SalesCard from "./components/SalesCard";
import moment from "moment";
import {Card, Col, Row} from "antd";
import styles from './style.less'

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({title, value, bordered}) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em/>}
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
    getCount().then((r) => {
      setCountLoading(false);
      if (r?.code == 200) {
        setCountData(r?.data);
      }
    });
  };

  /**
   * 数据表格
   */
  const [chartLoading, setChartLoading] = useState(true);
  const [chartData, setChartData] = useState<any>({});
  const [rangePickerValue, setRangePickerValue] = useState<any>([moment().add(-30, 'days'), moment()]);
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
    const start_date = moment(rangeDate[0]).format('YYYY-MM-DD');
    const end_date = moment(rangeDate[1]).format('YYYY-MM-DD');
    setChartLoading(true);
    const r = await getChart({type: type, start_date: start_date, end_date: end_date});
    if (r?.code == 200) {
      temp.data = r?.data;
    }
    const r1 = await getTopWeb({
      type: type,
      order_by: 'user_num',
      start_date: start_date,
      end_date: end_date,
      limit: 7
    });
    if (r1?.code == 200) {
      temp.topUser = r1?.data;
    }
    const r2 = await getTopWeb({
      type: type,
      order_by: 'order_succ_num',
      start_date: start_date,
      end_date: end_date,
      limit: 7
    });
    if (r2?.code == 200) {
      temp.topOrder = r2?.data;
    }
    setChartData(temp);
    setChartLoading(false);
  }
  //更改日期事件
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
    getToDo().then((r) => {
      setToDoLoading(false);
      if (r?.code == 200) {
        setToDoData(r?.data);
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
    <GridContent>
      <>

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
      </>
    </GridContent>
  );
};
