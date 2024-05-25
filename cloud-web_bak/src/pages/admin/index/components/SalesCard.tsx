import {Card, Col, DatePicker, Empty, Row, Tabs} from 'antd';
import type {RangePickerProps} from 'antd/es/date-picker/generatePicker';
import type moment from 'moment';
import {Column} from '@ant-design/charts';

import numeral from 'numeral';
import styles from '../style.less';

type RangePickerValue = RangePickerProps<moment.Moment>['value'];

const {RangePicker} = DatePicker;
const {TabPane} = Tabs;

const SalesCard = ({
                     rangePickerValue,
                     salesData,
                     handleRangePickerChange,
                     loading,
                     selectDate,
                     dateType,
                   }: {
  rangePickerValue: RangePickerValue;
  salesData: any;
  loading: boolean;
  handleRangePickerChange: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  selectDate: (key: number) => void;
  dateType: number;
}) => (
  <Card loading={loading} bordered={false} bodyStyle={{padding: 0}}>
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              <a className={dateType == 1 ? styles.currentDate : ''} onClick={() => selectDate(1)}>
                按天
              </a>
              <a className={dateType == 2 ? styles.currentDate : ''} onClick={() => selectDate(2)}>
                按周
              </a>
              <a className={dateType == 3 ? styles.currentDate : ''} onClick={() => selectDate(3)}>
                按月
              </a>
              <a className={dateType == 4 ? styles.currentDate : ''} onClick={() => selectDate(4)}>
                按年
              </a>
            </div>
            <RangePicker
              value={rangePickerValue}
              onChange={handleRangePickerChange}
              style={{width: 256}}
            />
          </div>
        }
        size="large"
        tabBarStyle={{marginBottom: 24}}
      >
        <TabPane tab="用户量" key="sales">
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Column
                  height={300}
                  forceFit
                  data={(salesData?.data || []) as any}
                  xField="date"
                  yField="user_num"
                  xAxis={{
                    visible: true,
                    title: {
                      visible: false,
                    },
                  }}
                  yAxis={{
                    visible: true,
                    title: {
                      visible: false,
                    },
                  }}
                  meta={{
                    user_num: {
                      alias: '用户量',
                    },
                  }}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>分站用户量排名</h4>
                <ul className={styles.rankingList}>
                  {(salesData?.topUser?.length || 0) > 0 && <ul className={styles.rankingList}>
                    {salesData?.topUser?.map((item: any, i: number) => (
                      <li key={"topUser_" + i}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                        <span className={styles.rankingItemTitle} title={item?.web?.name}>
                        {item?.web?.name}
                      </span>
                        <span className={styles.rankingItemValue}>
                        {numeral(item?.user_num).format('0,0')}
                      </span>
                      </li>
                    ))}
                  </ul>}
                  {(salesData?.topUser?.length || 0) <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                </ul>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="订单量" key="views">
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Column
                  height={300}
                  forceFit
                  data={(salesData?.data || []) as any}
                  xField="date"
                  yField="order_succ_num"
                  xAxis={{
                    visible: true,
                    title: {
                      visible: false,
                    },
                  }}
                  yAxis={{
                    visible: true,
                    title: {
                      visible: false,
                    },
                  }}
                  meta={{
                    order_succ_num: {
                      alias: '订单量',
                    },
                  }}
                />
              </div>
            </Col>
            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>分站订单量排名</h4>
                {(salesData?.topOrder?.length || 0) > 0 && <ul className={styles.rankingList}>
                  {salesData?.topOrder?.map((item: any, i: number) => (
                    <li key={"topOrder_" + i}>
                      <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                        {i + 1}
                      </span>
                      <span className={styles.rankingItemTitle} title={item?.web?.name}>
                        {item?.web?.name}
                      </span>
                      <span>{numeral(item?.order_succ_num).format('0,0')}</span>
                    </li>
                  ))}
                </ul>}
                {(salesData?.topOrder?.length || 0) <= 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default SalesCard;
