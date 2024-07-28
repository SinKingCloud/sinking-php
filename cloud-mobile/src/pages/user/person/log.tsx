import React, {useEffect, useState} from 'react'
import {Body, Icon} from "@/components";
import {Dropdown, Typography} from "antd";
import {Ellipsis} from "@/components/icon";
import {Card, Skeleton} from "antd-mobile";
import dayjs from "dayjs";
import {getLogList} from "@/service/person/log";
import {createStyles} from "antd-style";

const useStyles = createStyles(() => {
    return {
        size: {
            fontSize: "18px"
        },
        tit: {
            fontSize: "12px", fontWeight: "normal"
        },
        extra: {
            fontSize: "11px", color: "gray"
        },
        par: {
            marginBottom: "-22px !important"
        },
        sp: {
            fontSize: "11px", color: "gray"
        }
    }
})
export default () => {
    const {styles: {size, tit, extra, par, sp}} = useStyles()
    const {Paragraph} = Typography;
    const [orderData, setOrderData] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const init = (type?: any) => {
        setLoading(true)
        getLogList({
            body: {
                type: type,
            },
            onSuccess: (r: any) => {
                setOrderData(r.data);
            },
        }).finally(() => {
            setLoading(false);
        });
    }
    useEffect(() => {
        init()
    }, []);
    const items = [
        {
            key: "all",
            label: (
                <span onClick={() => init()}>全部</span>
            )
        },
        {
            key: 0,
            label: (
                <span onClick={() => init(0)}>登录</span>
            )
        },
        {
            key: 1,
            label: (
                <span onClick={() => init(1)}>查看</span>
            )
        },
        {
            key: 2,
            label: (
                <span onClick={() => init(2)}>删除</span>
            )
        },
        {
            key: 3,
            label: (
                <span onClick={() => init(3)}>修改</span>
            )
        },
        {
            key: 4,
            label: (
                <span onClick={() => init(4)}>创建</span>
            )
        },
    ]
    return (
        <Body title="操作日志" right={
            <Dropdown menu={{items}}>
                <a onClick={(e) => e.preventDefault()}>
                    <Icon type={Ellipsis} className={size}/>
                </a>
            </Dropdown>
        } space={true} loading={loading}>
            {
                orderData?.list?.map(user => (
                    <Card key={user.id}
                          title={<div className={tit}>{user.title}</div>}
                          extra={<div className={extra}>{dayjs(user.create_time).format('YYYY-MM-DD')}</div>}>
                        <Paragraph copyable className={par}>
                            <span className={sp}>请求ID：{user.request_id}</span>
                        </Paragraph><br/>
                        <Paragraph copyable className={par}>
                            <span className={sp}>请求IP：{user.request_ip}</span>
                        </Paragraph><br/>
                        <span className={sp}>
                            事件类型：{user?.type == 1 && "查看"}
                            {user?.type == 0 && "登录"}
                            {user?.type == 2 && "删除"}
                            {user?.type == 3 && "修改"}
                            {user?.type == 4 && "创建"}
                        </span><br/>
                        <span className={sp}>
                           内容：{user?.content}
                        </span><br/>
                    </Card>
                ))
            }
        </Body>
    )

}