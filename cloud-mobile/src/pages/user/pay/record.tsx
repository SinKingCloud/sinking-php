import React, {useRef} from 'react'
import {Body, Icon} from "@/components";
import {
    Card,
} from "antd-mobile";
import {Recharge, TypeAll} from "@/components/icon";
import dayjs from "dayjs";
import {Typography} from "antd";
import {createStyles} from "antd-style";
import {getPayOrder} from "@/service/pay/order";
import ProList, {ProListRef} from "@/pages/components/pro-list";

const useStyles = createStyles((): any => {
    return {
        tit: {
            fontSize: "12px", fontWeight: "normal"
        },
        extra: {
            fontSize: "11px", color: "gray"
        },
        money: {
            fontSize: "16px", fontWeight: "bold", marginRight: "3px", color: "#33cc4b"
        },
    }
});

export default () => {
    const {styles: {tit, extra, money}} = useStyles();

    const proListRef = useRef<ProListRef>({});
    const request = (params) => {
        return getPayOrder({body: params});
    }
    const showSearch = () => {
        proListRef?.current?.showSearchPanel?.();
    }

    return (
        <Body title="订单记录" right={<Icon type={TypeAll} style={{fontSize: "18px"}} onClick={showSearch}/>}>
            <ProList ref={proListRef} onRequest={request} formFields={[
                {
                    type: "input",
                    name: "test1",
                    label: "测试",
                    // rules: [{required: true}]
                },
                {
                    type: "slider",
                    name: "test2",
                    label: "测试",
                    // rules: [{required: true}]
                },
                {
                    type: "select",
                    name: "test3",
                    label: "测试",
                    // rules: [{required: true}],
                    options: [
                        {label: '苹果', value: '1'},
                        {label: '橘子', value: '2'},
                        {label: '香蕉', value: '3'},
                    ]
                },
                {
                    type: "date",
                    name: "test4",
                    label: "测试",
                    precision: "day"
                    // rules: [{required: true}]
                },
                {
                    type: "input",
                    name: "test5",
                    label: "测试",
                    // rules: [{required: true}]
                },
                {
                    type: "stepper",
                    name: "test6",
                    label: "测试",
                    // rules: [{required: true}]
                },
            ]} render={(item) => {
                return <Card key={item.id} style={{marginBottom: "10px"}}
                             title={<div className={tit}>
                                 <Icon type={Recharge} style={{marginRight: "3px"}}/>{item.name}
                             </div>}
                             extra={<div className={extra}>{dayjs(item.create_time).format('YYYY-MM-DD')}</div>}>
                        <span className={extra}>
                            <span className={money}>{item.money}</span>元
                        </span><br/>
                    <Typography.Paragraph copyable style={{marginBottom: "-22px"}}>
                        <span className={extra}>订单号：{item.trade_no}</span>
                    </Typography.Paragraph><br/>
                    <span className={extra}>
                        支付方式：
                        {item.order_type == 0 && "支付宝"}
                        {item.order_type == 1 && "微信"}
                        {item.order_type == 2 && "QQ"}
                        {item.order_type == 3 && "余额"}
                    </span><br/>
                    <span className={extra}>
                        状态：
                        {item.status == 0 && "未支付"}
                        {item.status == 1 && "已支付"}
                    </span>
                </Card>
            }}/>
        </Body>
    )
}