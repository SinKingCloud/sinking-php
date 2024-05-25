import React, {FC, Suspense, useEffect, useState} from 'react';
import {GridContent} from '@ant-design/pro-layout';
import PageLoading from "@/components/Other/Dashboard/PageLoading";
import IntroduceRow from "@/pages/master/index/components/IntroduceRow";
import {getChart, getCount, getToDo, getTopWeb} from "@/services/admin";
import SalesCard from "./components/SalesCard";
import moment from "moment";
import {Alert, Card, Col, List, Row, Skeleton} from "antd";
import styles from './style.less'
import NoticeInfo from "@/components/Other/NoticeInfo";
import Marquee from "react-fast-marquee";
import {getNotice} from "@/services/person/config";
import ProCard from "@ant-design/pro-card";
import {NotificationOutlined} from "@ant-design/icons";
import {ago} from "@/util/time";
import {getNoticeList} from "@/services/person/notice";
import {useModel} from "@@/plugin-model/useModel";
import numeral from "numeral";
import {DonutConfig} from "@ant-design/charts/es/donut";
import {Donut} from "@ant-design/charts";

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
  const {initialState} = useModel('@@initialState');
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
   * 滚动公告信息
   */
  const [notice2Loading, setNotice2Loading] = useState(true);
  const [notice2Data, setNotice2Data] = useState({});
  const getNotice2Data = () => {
    setNotice2Loading(true);
    getNotice({type: 'p'}).then((r) => {
      setNotice2Loading(false);
      if (r?.code == 200) {
        setNotice2Data(r?.data);
      }
    });
  };

  /**
   * 获取公告信息
   */
  const [noticeLoading, setNoticeLoading] = useState(true);
  const [noticeData, setNoticeData] = useState<any>([]);
  const getNoticeData = async () => {
    setNoticeLoading(true);
    const temp: any[] = [];
    let d = await getNoticeList({page: 1, page_size: 3, web_id: 'system', place: "admin"});
    if (d?.code == 200) {
      d?.data?.list?.map((k: any) => {
        temp?.push(k);
      });
    }
    if (!initialState?.currentUser?.is_master) {
      d = await getNoticeList({page: 1, page_size: 5, web_id: 'parent', place: "admin"});
      if (d?.code == 200) {
        d?.data?.list?.map((k: any) => {
          temp?.push(k);
        });
      }
    }
    setNoticeData(temp);
    setNoticeLoading(false);
  };

  /**
   * 加载数据
   */
  useEffect(() => {
    getGenCount();
    getChartData();
    getToDoData();
    getNotice2Data();
    getNoticeData();
  }, []);
  return (
    <GridContent>
      <>
        <NoticeInfo id={noticeId} visible={noticeVisible} onClose={hideNoticeInfoModal}/>
        <Suspense fallback={<PageLoading/>}>
          <Skeleton title={false} loading={notice2Loading} active>
            <Row hidden={notice2Data?.['notice.admin'] == "" || notice2Data?.['notice.admin'] == null}>
              <Col>
                <Alert
                  style={{margin: "-10px 0 15px 0"}}
                  banner
                  type={"info"}
                  message={
                    <Marquee pauseOnHover gradient={false}>
                      {notice2Data?.['notice.admin']}
                    </Marquee>
                  }
                />
              </Col>
            </Row>
          </Skeleton>
        </Suspense>
        <Suspense fallback={<PageLoading/>}>
          <IntroduceRow loading={countLoading} countData={countData?.sum} visitData={countData?.count}/>
        </Suspense>
        <Suspense fallback={<PageLoading/>}>
          <Card bordered={false} loading={toDoLoading} style={{marginBottom: "20px"}}>
            <Row>
              <Col sm={12} md={12} xs={12}>
                <Info title="我的提现" value={(toDoData?.cash || 0) > 0 ? toDoData?.cash + '个待处理' : '暂无'}
                      bordered/>
              </Col>
              <Col sm={12} md={12} xs={12}>
                <Info title="累计提成 " value={'￥' + (toDoData?.deduct_money || 0)?.toFixed(2)}/>
              </Col>
            </Row>
          </Card>
        </Suspense>
        <Suspense fallback={<PageLoading/>}>
          <Row gutter={24}>
            <Col sm={12} md={12} xs={24} style={{marginBottom: "20px"}}>
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
                    formatter: (text, item) => {
                      // eslint-disable-next-line no-underscore-dangle
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
              <ProCard headerBordered title="系统公告" loading={noticeLoading} bodyStyle={{padding: "0 20px 0 20px"}}>
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
                          avatar={<NotificationOutlined style={{fontSize: "20px", lineHeight: "50px"}}/>}
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
        <Suspense fallback={<PageLoading/>}>
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
