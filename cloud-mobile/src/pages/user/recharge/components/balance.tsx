import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, Skeleton} from "antd-mobile";
import {Ellipsis, Recharge} from "@/components/icon";
import dayjs from "dayjs";
import {Dropdown, Typography} from "antd";
import {getPayLog} from "@/service/pay";

export default () => {
    const {Paragraph} = Typography;
    const [orderData, setOrderData] = useState()
    const [loading, setLoading] = useState(false)
    const init = (type?: any) => {
        setLoading(true)
        getPayLog({
            body: {
                type: type
            },
            onSuccess: (r: any) => {
                setOrderData(r?.data)
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
                <span onClick={() => init(0)}>增加记录</span>
            )
        },
        {
            key: 2,
            label: (
                <span onClick={() => init(1)}>减少记录</span>
            )
        },
    ]
    return (
        <Body title="余额明细" right={<Dropdown menu={{items}}>
            <a onClick={(e) => e.preventDefault()}>
                <Icon type={Ellipsis} style={{fontSize: "18px"}}/>
            </a>
        </Dropdown>}>
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
                                color: user.type == 0 ? "#33cc4b" : "#F65555"
                            }}>{user.type == 0 ? "+" : "-"}{user.money}</span>
                            元
                        </span><br/>
                        <Paragraph copyable style={{marginBottom: "-22px"}}>
                            <span style={{fontSize: "11px", color: "gray"}}>订单号：{user.content}</span>
                        </Paragraph><br/>
                        <span style={{fontSize: "11px", color: "gray"}}>
                        记录标题：{user.title}
                    </span>

                    </Card>
                ))
            }

        </Body>
    )
}