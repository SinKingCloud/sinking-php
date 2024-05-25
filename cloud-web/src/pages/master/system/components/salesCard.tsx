import {Card, Col, DatePicker, Empty, Row, Tabs} from 'antd';
import type {RangePickerProps} from 'antd/es/date-picker/generatePicker';
import type moment from 'moment';
import {Column} from '@ant-design/charts';
import numeral from 'numeral';
import {createStyles} from "antd-style";
const useStyles = createStyles(({css}): any => {
    return {
        anticon: {
            marginLeft: "16px",
            color: "@text-color-secondary",
            cursor: "pointer",
            transition: "color 0.32s",
            ":hover": {
                color: "@text-color",
            }
        },
        headerInfo: {
            position: "relative",
            textAlign: "center"
        },
        span: {
            display: "inline-block",
            marginBottom: "4px",
            color: "@text-color-secondary",
            fontSize: "@font-size-base",
            lineHeight: "22px",
        },
        p: {
            margin: 0,
            color: "@heading-color",
            fontSize: "24px",
            lineHeight: "32px",
        },
        em: {
            position: "absolute",
            top: 0,
            right: 0,
            width: "1px",
            height: "56px",
            backgroundColor: "@border-color-split",
        },
        rankingList: {
            margin: "25px 0 0",
            padding: 0,
            listStyle: "none"
        },
        li: {
            display: "flex",
            alignItems: "center",
            marginTop: "16px",
            zoom: 1,
        },
        span1: {
            color: "@text-color",
            fontSize: "14px",
            lineHeight: "22px",
        },
        rankingItemNumber: {
            display: " inline-block",
            width: "20px",
            height: "20px",
            marginTop: "1.5px",
            marginRight: "16px",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "20px",
            textAlign: "center",
            backgroundColor: "@tag-default-bg",
            borderRadius: "20px"
        },
        active: {
            color: "#fff",
            backgroundColor: "#314659",
        },
        rankingItemTitle: {
            flex: 1,
            marginRight: "8px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
        },
        salesExtra: {
            display: "inline-block",
            marginRight: "24px"
        },
        a: {
            marginLeft: "24px",
            color: "@text-color",
            ":hover":{
                color: "@primary-color"
            }
        },
        salesBar :{
            padding: "0 0 32px 32px"
        },
        salesRank :{
            padding: "0 32px 32px 72px",
        },
        card:css`
            .ant-tabs-nav-wrap {
                padding-left: 16px
            },
            .ant-tabs-nav {
                padding-top: 16px;
                padding-bottom: 14px;
                line-height: 24px;
            },
        .ant-tabs-extra-content {
            padding-right: 24px;
            line-height: 55px;
        },
        .ant-card-head {
            position: relative;
        },
        .ant-card-head-title {
            align-items: normal;
        }
        `,
        salesCardExtra:{
            height: "inherit"
        },
        salesTypeRadio:{
            position: "absolute",
            right: "54px",
            bottom: "12px",
        },
        trendText: {
            marginLeft: "8px",
            color: "@heading-color"
        }
    }
})
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
}) =>{
    const {
        styles:{
            anticon, headerInfo, span, p, em, rankingList, li, span1, rankingItemNumber, active, rankingItemTitle, salesExtra,
            a,salesBar,card,salesCardExtra,salesTypeRadio,trendText,salesRank}} = useStyles()
    return (
        <Card loading={loading} bordered={false} bodyStyle={{padding: 0}}>
            <div>
                <Tabs
                    tabBarExtraContent={
                        <div>
                            <div className={salesExtra}>
                                <a  onClick={() => selectDate(1)}>
                                    按天
                                </a>
                                <a  onClick={() => selectDate(2)}>
                                    按周
                                </a>
                                <a  onClick={() => selectDate(3)}>
                                    按月
                                </a>
                                <a  onClick={() => selectDate(4)}>
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
                                <div className={salesBar}>
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
                                <div className={salesRank}>
                                    <h4>网站用户量排名</h4>
                                    <ul className={rankingList}>
                                        {(salesData?.topUser?.length || 0) > 0 && <ul className={rankingList}>
                                            {salesData?.topUser?.map((item: any, i: number) => (
                                                <li key={"topUser_" + i}>
                      <span className={`${rankingItemNumber} ${i < 3 ? active : ''}`}>
                        {i + 1}
                      </span>
                                                    <span className={rankingItemTitle} title={item?.web?.name}>
                        {item?.web?.name}
                      </span>
                                                    <span>
                        {numeral(item?.user_num).format('0,0')}
                      </span>
                                                </li>
                                            ))}
                                        </ul>}
                                        {(salesData?.topUser?.length || 0) <= 0 &&
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="订单量" key="views">
                        <Row>
                            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                                <div className={salesBar}>
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
                                <div className={salesRank}>
                                    <h4>网站订单量排名</h4>
                                    {(salesData?.topOrder?.length || 0) > 0 && <ul className={rankingList}>
                                        {salesData?.topOrder?.map((item: any, i: number) => (
                                            <li key={"topOrder_" + i}>
                      <span className={`${rankingItemNumber} ${i < 3 ? active : ''}`}>
                        {i + 1}
                      </span>
                                                <span className={rankingItemTitle} title={item?.web?.name}>
                        {item?.web?.name}
                      </span>
                                                <span>{numeral(item?.order_succ_num).format('0,0')}</span>
                                            </li>
                                        ))}
                                    </ul>}
                                    {(salesData?.topOrder?.length || 0) <= 0 &&
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>
        </Card>
    );
}
export default SalesCard;
