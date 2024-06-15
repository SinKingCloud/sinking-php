import {InfoCircleOutlined} from '@ant-design/icons';
import {TinyArea} from '@ant-design/charts';
import {Col, Row, Tooltip} from 'antd';
import numeral from 'numeral';
import {ChartCard, Field} from '@/pages/components/dashboard/charts';
import Yuan from "@/pages/components/dashboard/utils/yuan";

const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: {marginBottom: 24},
};
const IntroduceRow = ({loading, countData, visitData}: { loading: boolean; countData: any; visitData: any[] }) => (
    <Row gutter={24} style={{marginBottom:"-23px"}}>
        <Col {...topColResponsiveProps}>
            <ChartCard
                style={{fontSize: "14px"}}
                bordered={false}
                title="总销售额"
                action={
                    <Tooltip title="系统共计消费额,10分钟统计一次">
                        <InfoCircleOutlined/>
                    </Tooltip>
                }
                loading={loading}
                total={() => <Yuan>{countData?.consume_money || 0}</Yuan>}
                footer={<Field label="日销售额"
                               value={`￥${numeral(visitData?.slice(-1)?.[0]?.consume_money).format('0,0')}`}/>}
                contentHeight={46}
            >
                <TinyArea
                    color="#0051eb"
                    xField="date"
                    height={46}
                    forceFit
                    yField="consume_money"
                    smooth
                    data={visitData}
                    tooltip={{visible: true}}
                    meta={{date: {alias: "日期"}, consume_money: {alias: "销售金额"}}}/>
            </ChartCard>
        </Col>

        <Col {...topColResponsiveProps}>
            <ChartCard
                bordered={false}
                style={{fontSize: "14px"}}
                loading={loading}
                title="总订单量"
                action={
                    <Tooltip title="支付成功订单数量,10分钟统计一次">
                        <InfoCircleOutlined/>
                    </Tooltip>
                }
                total={numeral(countData?.order_succ_num || 0).format('0,0')}
                footer={<Field label="日订单量"
                               value={numeral(visitData?.slice(-1)?.[0]?.order_succ_num).format('0,0')}/>}
                contentHeight={46}
            >
                <TinyArea
                    color="#27b6a2"
                    xField="date"
                    height={46}
                    forceFit
                    yField="order_succ_num"
                    smooth
                    data={visitData}
                    tooltip={{visible: true}}
                    meta={{date: {alias: "日期"}, order_succ_num: {alias: "订单数量"}}}/>
            </ChartCard>
        </Col>
        <Col {...topColResponsiveProps}>
            <ChartCard
                bordered={false}
                loading={loading}
                style={{fontSize: "14px"}}
                title="总用户数"
                action={
                    <Tooltip title="用户注册数量,10分钟统计一次">
                        <InfoCircleOutlined/>
                    </Tooltip>
                }
                total={numeral(countData?.user_num || 0).format('0,0')}
                footer={<Field label="日新增数" value={numeral(visitData?.slice(-1)?.[0]?.user_num).format('0,0')}/>}
                contentHeight={46}
            >
                <TinyArea
                    color="#975FE4"
                    xField="date"
                    height={46}
                    forceFit
                    yField="user_num"
                    smooth
                    data={visitData}
                    tooltip={{visible: true}}
                    meta={{date: {alias: "日期"}, user_num: {alias: "用户数量"}}}/>
            </ChartCard>
        </Col>
        <Col {...topColResponsiveProps}>
            <ChartCard
                loading={loading}
                bordered={false}
                style={{fontSize: "14px"}}
                title="总站点数"
                action={
                    <Tooltip title="站点数量,10分钟统计一次">
                        <InfoCircleOutlined/>
                    </Tooltip>
                }
                total={numeral(countData?.site_num || 0).format('0,0')}
                footer={<Field label="新增站点" value={numeral(visitData?.slice(-1)?.[0]?.site_num).format('0,0')}/>}
                contentHeight={46}
            >
                <TinyArea
                    color="#ba9a00"
                    xField="date"
                    height={46}
                    forceFit
                    yField="site_num"
                    smooth
                    data={visitData}
                    tooltip={{visible: true}}
                    meta={{date: {alias: "日期"}, site_num: {alias: "站点数量"}}}/>
            </ChartCard>
        </Col>
    </Row>
)

export default IntroduceRow;
