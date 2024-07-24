import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, Skeleton} from "antd-mobile";
import {Ellipsis, Recharge} from "@/components/icon";
import dayjs from "dayjs";
import {Dropdown, Empty, Typography} from "antd";
import {getPayLog} from "@/service/pay";
import {createStyles} from "antd-style";
const useStyles = createStyles(()=>{
    return{
        extra:{
            fontSize: "11px", color: "gray"
        },
        tit:{
            fontSize: "12px", fontWeight: "normal"
        }
    }
})
export default () => {
    const {styles:{extra,tit}} = useStyles()
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
               orderData?.list?.length >0 && orderData?.list?.map(user => (
                    <Card key={user.id} style={{marginBottom: "10px"}}
                          title={<div className={tit}>
                              <Icon type={Recharge} style={{marginRight: "3px"}}/>{user.title}</div>}
                          extra={<div className={extra}>{dayjs(user.create_time).format('YYYY-MM-DD')}</div>}>
                        <span className={extra}>
                            <span style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginRight: "3px",
                                color: user.type == 0 ? "#33cc4b" : "#F65555"
                            }}>{user.type == 0 ? "+" : "-"}{user.money}</span>
                            元
                        </span><br/>
                        <Paragraph copyable style={{marginBottom: "-22px"}}>
                            <span className={extra}>订单号：{user.content}</span>
                        </Paragraph><br/>
                    </Card>
                )) ||  <Empty description='暂无数据' />
            }
        </Body>
    )
}