import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Card, ErrorBlock, PullToRefresh, Skeleton} from "antd-mobile";
import {Ellipsis, Recharge} from "@/components/icon";
import dayjs from "dayjs";
import {Dropdown, Typography} from "antd";
import {getPayLog} from "@/service/pay";
import {createStyles} from "antd-style";
import {PullStatus} from "antd-mobile/es/components/pull-to-refresh";
const useStyles = createStyles(()=>{
    return{
        extra:{
            fontSize: "11px", color: "gray"
        },
        tit:{
            fontSize: "12px", fontWeight: "normal"
        },
        rig:{
            marginRight: "3px"
        },
        size:{
            fontSize: "18px"
        },
        money:{
            fontSize: "16px",
            fontWeight: "bold",
            marginRight: "3px",
        },
        par:{
            marginBottom:"-22px !important"
        }
    }
})
export default () => {
    const {styles:{extra,tit,rig,size,money,par}} = useStyles();
    const {Paragraph} = Typography;
    const [orderData, setOrderData] = useState();
    const [loading, setLoading] = useState(false);
    /**
     * 下拉刷新
     */
    const statusRecord: Record<PullStatus, string> = {
        pulling: '用力拉',
        canRelease: '松开吧',
        refreshing: '玩命加载中...',
        complete: '好啦',
    }
    /**
     * 上拉加载
     */

    /**
     * 初始化获取数据
     * @param type
     */
    const init = (type?: any) => {
        setLoading(true);
        getPayLog({
            body: {
                type: type,
            },
            onSuccess: (r: any) => {
                setOrderData(r?.data);
            },
            onFinally: () => {
                setLoading(false);
            }
        });
    };
    useEffect(() => {
        init();
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
    ];
    return (
        <Body title="余额明细" right={<Dropdown menu={{items}} space={true}>
            <a onClick={(e) => e.preventDefault()}>
                <Icon type={Ellipsis} className={size}/>
            </a>
        </Dropdown>}>
            {loading && <Skeleton.Paragraph animated/> ||
                <PullToRefresh
                    onRefresh={async () => {
                           await getPayLog({
                                onSuccess: (r: any) => {
                                    setOrderData(r?.data)
                                },
                            })
                    }}
                    renderText={status => {
                        return <div>{statusRecord[status]}</div>
                    }}>
                    {orderData?.list?.length >0 && orderData?.list?.map(user => (
                    <Card key={user.id}
                          title={<div className={tit}>
                              <Icon type={Recharge} className={rig}/>{user.title}</div>}
                          extra={<div className={extra}>{dayjs(user.create_time).format('YYYY-MM-DD')}</div>}>
                        <span className={extra}>
                            <span style={{color: user.type == 0 ? "#33cc4b" : "#F65555"}} className={money}>
                                {user.type == 0 ? "+" : "-"}{user.money}</span>
                            元
                        </span><br/>
                        <Paragraph copyable className={par}>
                            <span className={extra}>订单号：{user.content}</span>
                        </Paragraph><br/>
                    </Card>
                    ))}
                </PullToRefresh>
                || <ErrorBlock status='empty' />
            }
        </Body>
    )
}