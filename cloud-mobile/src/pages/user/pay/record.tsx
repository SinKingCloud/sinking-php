import React, { useState} from 'react'
import {Body, Icon, Title} from "@/components";
import {Card, InfiniteScroll, PullToRefresh, Popup, Form, Button, Selector} from "antd-mobile";
import {getPayOrder} from "@/service/pay/order";
import { Recharge, TypeAll} from "@/components/icon";
import dayjs from "dayjs";
import {Typography} from "antd";
import {createStyles} from "antd-style";
import {PullStatus} from "antd-mobile/es/components/pull-to-refresh";

const useStyles = createStyles(({css,isDarkMode}):any => {
    const border = isDarkMode ? "1px solid rgb(40,40,40) !important" : "1px solid #eeeeee !important"
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
        label: css`
        . adm-form-item-label {
            line-height: 2
        },
        . adm-list-item-content {
            border-bottom: ${border};
            border-top: none !important;
        },
        .adm-input-element{
            font-size: 12px !important;
        },
         .adm-form-item-label {
            margin-bottom: 10px !important;
            color: #000 !important;
            font-weight: 600;
            font-size: 16px !important;
        `,
        btn: {
            ".adm-list-item-content": {
                borderBottom: "none !important",
                borderTop: "none !important",
                paddingBlock: "9px",
                paddingRight:"0 !important",
            },
            ".adm-form-item-child-position-normal":{
                width:"100%",
                position:"fixed",
                bottom:"20px",
            },
        },
        body: {
            ".adm-list-body": {
                borderRadius: "5px",
                borderTop:"none !important",
                borderBottom:"none !important",
            },
            ".adm-list-item": {
                paddingLeft: "0 !important"
            },
            ".adm-list-item-content":{
                paddingRight:"0px !important"
            },
            ".adm-list-item-content-main":{
                paddingTop:"0px !important"
            }
        },
        span: {
            fontSize: "12px", fontWeight: 600
        },
        list:{
            ".adm-space":{
                width:"100%"
            },
            ".adm-space-item":{
                width:"31%"
            },
            ".adm-selector-item":{
                width:"70%"
            },
            "--border-radius": "5px !important", "--padding": "10px 14px !important"
        },
        pop:{
            height: '70%',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            padding: "15px",
            boxSizing: "border-box",
        },
        size:{
            fontSize: "18px"
        },
        btn1:{
            width: "42%", marginRight: "8%"
        },
        btn2:{
            width: "42%"
        },
        rig:{
           marginRight: "3px"
        },
        par:{
            marginBottom:"-22px !important"
        }
    }
})
export default () => {
    const {styles: {tit, extra, money,label,btn,body,list,pop,size,btn1,btn2,rig,par}} = useStyles()
    const {Paragraph} = Typography;
    const [orderData, setOrderData] = useState([])
    const options = [
        {
            label: (
                <span>全部记录</span>
            ),
            value: 2,
        },
        {
            label: (
                <span>已支付</span>
            ),
            value: 1,
        },
        {
            label: (
                <span>未支付</span>
            ),
            value: 0,
        }
    ]
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
    const [currentPage, setCurrentPage] = useState(1); // 初始页码
    const [hasMore, setHasMore] = useState(true);
    const loadMore = async (status?:any) => {
        const requestBody = {
            page: currentPage,
            page_size: 10
        };
        if (status) {
            requestBody.status = status;
            requestBody.page = 1
        }
        const append = await getPayOrder({
            body: requestBody
        });
        if (append?.data?.list?.length > 0) {
            setOrderData(prevData => [...prevData, ...append?.data?.list]);
            setCurrentPage(prevPage => prevPage + 1);
            setHasMore(append?.data?.list?.length >0);
        } else {
            setHasMore(false);
        }
    };
    /**
     * 表单提交
     */
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm()
    const formFinish = async(values:any)=> {
        setOrderData([])
        setHasMore(true)
        if(values.type[0] == 1){
           await loadMore(1).finally(()=>{
                setVisible(false)
                form.setFieldValue("type",[2])
            })
        }else if(values.type[0] == 0){
            await loadMore(0).finally(()=>{
                setVisible(false)
                form.setFieldValue("type",[2])
            })
        } else if(values.type[0] == 2){
            await loadMore().finally(()=>{
                setVisible(false)
                form.setFieldValue("type",[2])
            })
        }
    }
        return (
            <Body title="订单记录" space={true}
                  right={<Icon type={TypeAll} className={size} onClick={() => setVisible(true)}/>}>
                <Popup
                    forceRender={true}
                    visible={visible}
                    onMaskClick={() => {
                        setVisible(false)
                    }}
                    bodyClassName={pop}>
                    <Form form={form} initialValues={{type:[2]}} className={body} onFinish={formFinish}>
                        <Form.Item className={label} name="type" label={<Title>快捷筛选</Title>}>
                            <Selector
                                className={list}
                                options={options}
                            />
                        </Form.Item>
                        <Form.Item className={btn}>
                            <Button className={btn1} type="reset">重置</Button>
                            <Button color="primary" type="submit" className={btn2}>确定</Button>
                        </Form.Item>
                    </Form>
                </Popup>
                <PullToRefresh
                    onRefresh={async () => {
                        getPayOrder({
                            onSuccess: (r: any) => {
                                setOrderData(r?.data?.list)
                            }
                        })
                    }}
                    renderText={status => {
                        return <div>{statusRecord[status]}</div>
                    }}>
                    {orderData?.length > 0 && orderData?.map(user => (
                        <Card key={user.id}
                              title={<div className={tit}>
                                  <Icon type={Recharge} className={rig}/>{user.name}
                              </div>}
                              extra={<div className={extra}>{dayjs(user.create_time).format('YYYY-MM-DD')}</div>}>
                        <span className={extra}>
                            <span className={money}>{user.money}</span>元
                        </span><br/>
                            <Paragraph copyable className={par}>
                                <span className={extra}>订单号：{user.trade_no}</span>
                            </Paragraph><br/>
                            <span className={extra}>
                        支付方式：
                                {user.order_type == 0 && "支付宝"}
                                {user.order_type == 1 && "微信"}
                                {user.order_type == 2 && "QQ"}
                                {user.order_type == 3 && "余额"}
                    </span><br/>
                            <span className={extra}>
                        状态：
                                {user.status == 0 && "未支付"}
                                {user.status == 1 && "已支付"}
                    </span>
                        </Card>
                    ))}
                </PullToRefresh>
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
            </Body>
        )
    }