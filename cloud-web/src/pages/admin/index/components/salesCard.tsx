import {Card, Col, DatePicker, Empty, Row, Tabs} from 'antd';
import {Column} from '@ant-design/charts';
import type {DatePickerProps} from 'antd';
import numeral from 'numeral';
import {createStyles} from "antd-style";
const {RangePicker} = DatePicker;
export type SalesProps = {
    rangePickerValue: any;
    salesData: any;
    loading: boolean;
    handleRangePickerChange: (dates: any, dateStrings: [string, string]) => void;
    selectDate: (key: number) => void;
    dateType: number;
} & DatePickerProps
const useStyles = createStyles(({css, responsive}): any => {
    return {
        rankingList: {
            margin: "25px 0 0",
            padding: 0,
            listStyle: "none",
            fontSize: "14px",
        },
        li: css`
            display: flex;
            align-items: center;
            margin-top: 16px;
            zoom: 1;

            &::before,
            &::after {
                display: table;
                content: ' ';
            }

            &::after {
                clear: both;
                height: 0;
                font-size: 0;
                visibility: hidden;
            }
        `,
        span: {
            fontSize: "14px",
            lineHeight: "22px",
        },
        rankingItemNumber: css`
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-top: 1.5px;
            margin-right: 16px;
            font-weight: 600;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            border-radius: 20px;
            float: left;
        `,
        rankingItemTitle: {
            flex: 1,
            marginRight: "8px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            float: "left"
        },
        salesExtra: css`
            display: inline-block;
            margin-right: 24px;

            a {
                margin-left: 24px;
                color: #000;
                font-size: 14px;
            }
        `,
        salesBar: {
            padding: "0 0 32px 32px"
        },
        salesRank: {
            padding: "0 32px 32px 72px"
        },
        tabs: css`
            .ant-tabs-bar,
            .ant-tabs-nav-wrap {
                padding-left: 16px;

                .ant-tabs-nav .ant-tabs-tab {
                    padding-top: 16px;
                    padding-bottom: 14px;
                    line-height: 24px;
                }
            }

            .ant-tabs-extra-content {
                padding-right: 24px;
                line-height: 55px;
            }

            .ant-card-head {
                position: relative;
            }

            .ant-card-head-title {
                align-items: normal;
            }
        `,
        salesCardExtra: {
            height: "inherit"
        },
        salesExtraWrap: css`
            ${responsive.md} {
                display: none;
            }
        `,
        currentDate: css`
            color: blue !important;
        `,
        rankingTitle: css`
            margin-top: 16px;
            font-size: 14px;
        `,
        active: {
            color: "#fff",
            backgroundColor: "#314659",
        }
    }
})
const SalesCard: React.FC<SalesProps> = ({...props}) => {
    const {
        rangePickerValue,
        salesData,
        handleRangePickerChange,
        loading,
        selectDate,
        dateType,
    } = props
    const {
        styles: {
            currentDate,
            salesExtraWrap,
            rankingList,
            rankingTitle,
            rankingItemNumber,
            rankingItemTitle,
            salesExtra,
            salesBar,
            salesRank,
            active
        }
    } = useStyles()
    return (
        //@ts-ignore
        <Card loading={loading} bordered={false} styles={{padding: 0}}>
            <Tabs items={[
                {
                    label: '用户量',
                    key:"sales",
                    children:(
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
                                    <h4 className={rankingTitle}>网站用户量排名</h4>
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
                                                    <span style={{float: "right"}}>
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
                    )
                },
                {
                    label: '订单量',
                    key:"views",
                    children: (
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
                                    <h4 className={rankingTitle}>网站订单量排名</h4>
                                    {(salesData?.topOrder?.length || 0) > 0 && <ul className={rankingList}>
                                        {salesData?.topOrder?.map((item: any, i: number) => (
                                            <li key={"topOrder_" + i}>
                      <span className={`${rankingItemNumber} ${i < 3 ? active : ''}`}>
                        {i + 1}
                      </span>
                                                <span className={rankingItemTitle} title={item?.web?.name}>
                        {item?.web?.name}
                      </span>
                                                <span
                                                    style={{float: "right"}}>{numeral(item?.order_succ_num).format('0,0')}</span>
                                            </li>
                                        ))}
                                    </ul>}
                                    {(salesData?.topOrder?.length || 0) <= 0 &&
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
                                </div>
                            </Col>
                        </Row>
                    )
                }
            ]}
                  tabBarExtraContent={
                      <div className={salesExtraWrap}>
                          <div className={salesExtra}>
                              <a className={dateType == 1 ? currentDate : ''} onClick={() => selectDate(1)}>
                                  按天
                              </a>
                              <a className={dateType == 2 ? currentDate : ''} onClick={() => selectDate(2)}>
                                  按周
                              </a>
                              <a className={dateType == 3 ? currentDate : ''} onClick={() => selectDate(3)}>
                                  按月
                              </a>
                              <a className={dateType == 4 ? currentDate : ''} onClick={() => selectDate(4)}>
                                  按年
                              </a>
                          </div>
                          <RangePicker
                              size={"large"}
                              value={rangePickerValue}
                              onChange={handleRangePickerChange}
                              style={{width: 256}}
                          />
                      </div>
                  }
                  size="large"
                  tabBarStyle={{marginBottom: 24}}
            />
        </Card>
    );
}

export default SalesCard;
