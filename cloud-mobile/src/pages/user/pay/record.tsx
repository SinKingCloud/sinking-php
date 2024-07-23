import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, Skeleton} from "antd-mobile";
import {getPayOrder} from "@/service/pay/order";
import {Ellipsis, Recharge} from "@/components/icon";
import dayjs from "dayjs";
import {Dropdown, Typography} from "antd";
export default () => {
    const {Paragraph} = Typography;
    const [orderData, setOrderData] = useState([])
    const [loading, setLoading] = useState(false)
    const init = (status?: any) => {
        setLoading(true)
        getPayOrder({
            body: {
                status: status,
            },
            onSuccess: (r: any) => {
                setOrderData(r.data);
            },
            onFinally: () => {
                setLoading(false)
            }
        })
    }
    useEffect(() => {
        init()
    }, []);
    const items = [
        {
            key: 0,
            label: (
                <span onClick={() => init()}>全部记录</span>
            )
        },
        {
            key: 1,
            label: (
                <span onClick={() => init(1)}>已支付记录</span>
            )
        },
        {
            key: 2,
            label: (
                <span onClick={() => init(0)}>未支付记录</span>
            )
        },
    ]
    return (
        <Body title="订单记录"
              right={
                  <Dropdown menu={{items}}>
                      <a onClick={(e) => e.preventDefault()}>
                          <Icon type={Ellipsis} style={{fontSize: "18px"}}/>
                      </a>
                  </Dropdown>
              }
        >
            {loading && <Skeleton.Paragraph animated/> ||
                    orderData?.list?.map(user => (
                        <Card key={user.id} style={{marginBottom: "10px"}}
                              title={<div style={{fontSize: "12px", fontWeight: "normal"}}><Icon type={Recharge}
                                                                                                 style={{marginRight: "3px"}}/>{user.name}
                              </div>}
                              extra={<div style={{
                                  fontSize: "11px",
                                  color: "gray"
                              }}>{dayjs(user.create_time).format('YYYY-MM-DD')}</div>}>
                        <span style={{fontSize: "11px", color: "gray"}}>
                            <span style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "3px",
                                color: "#33cc4b"
                            }}>{user.money}</span>
                            元
                        </span><br/>
                            <Paragraph copyable style={{marginBottom: "-22px"}}>
                                <span style={{fontSize: "11px", color: "gray"}}>订单号：{user.trade_no}</span>
                            </Paragraph><br/>
                            <span style={{fontSize: "11px", color: "gray"}}>
                        支付方式：
                                {user.order_type == 0 && "支付宝"}
                                {user.order_type == 1 && "微信"}
                                {user.order_type == 2 && "QQ"}
                                {user.order_type == 3 && "余额"}
                    </span><br/>
                            <span style={{fontSize: "11px", color: "gray"}}>
                        状态：
                                {user.status == 0 && "未支付"}
                                {user.status == 1 && "已支付"}
                    </span>
                        </Card>
                    ))
            }
        </Body>
    )
}