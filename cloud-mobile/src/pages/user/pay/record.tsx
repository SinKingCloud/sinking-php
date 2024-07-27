import React, {useState} from 'react'
import {Body, Icon, Title, VirtualRef} from "@/components";
import {Card, InfiniteScroll, PullToRefresh, Popup, Dropdown, Radio, Space, DotLoading, ErrorBlock} from "antd-mobile";
import {getPayOrder} from "@/service/pay/order";
import {Recharge, TypeAll} from "@/components/icon";
import dayjs from "dayjs";
import {Typography} from "antd";
import {createStyles} from "antd-style";

const useStyles = createStyles(({css, isDarkMode}): any => {
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
})
export default () => {
    const {styles: {tit, extra, money}} = useStyles()

    /**
     * 数据信息
     */
    const [list, setList] = useState<any>([]);//列表数据
    const [page, setPage] = useState<any>({page: 1, page_size: 10});//分页数据
    const [hasMore, setHasMore] = useState(true);//加载更多
    const [empty, setEmpty] = useState(false);
    /**
     * 加载数据
     * @param page 分页信息
     */
    const loadData = async (page) => {
        const res = await getPayOrder({
            body: {...page, ...{type: 9}},
            onSuccess: (r: any) => {
                const more = !(r?.data?.page * r?.data?.page_size >= r?.data?.total);
                setHasMore(more);
                setEmpty((r?.data?.total || 0) <= 0);
                if (r?.data?.page <= 1) {
                    setList([...r?.data?.list]);
                } else {
                    setList([...list, ...r?.data?.list]);
                }
            },
        });
        if (res?.code != 200) {
            throw new Error('请求失败');
        }
    }
    /**
     * 加载更多
     * @param isRetry 是否是重试请求
     */
    const loadMore = async (isRetry) => {
        await loadData(page);
        if (!isRetry) {
            let temp = {...page};
            temp.page++;
            setPage(temp);
        }
    }
    /**
     * 重置数据
     */
    const resetData = async () => {
        const pageInfo = {...page, ...{page: 2}};
        setPage(pageInfo);
        await loadData({...page, ...{page: 1}});
    }
    /**
     * 筛选弹出层
     */
    const [searchVisible, setSearchVisible] = useState<any>(false);
    const showSearch = () => {
        setSearchVisible(true);
    }
    const closeSearch = () => {
        setSearchVisible(false);
    }

    return (
        <Body title="订单记录"
              right={
                  <div>
                      <Icon type={TypeAll} style={{fontSize: "18px"}} onClick={showSearch}/>
                  </div>

                  // <Dropdown getContainer={document.getElementById("test")}>
                  //     <Dropdown.Item key='sorter' title='排序'>
                  //         <div style={{ padding: 12 }}>
                  //             <Radio.Group defaultValue='default'>
                  //                 <Space direction='vertical' block>
                  //                     <Radio block value='default'>
                  //                         综合排序
                  //                     </Radio>
                  //                     <Radio block value='nearest'>
                  //                         距离最近
                  //                     </Radio>
                  //                     <Radio block value='top-rated'>
                  //                         评分最高
                  //                     </Radio>
                  //                 </Space>
                  //             </Radio.Group>
                  //         </div>
                  //     </Dropdown.Item>
                  // </Dropdown>
              } bodyStyle={{
            userSelect: "none"
        }}>
            <Popup
                getContainer={VirtualRef?.current}
                forceRender={true}
                visible={searchVisible}
                onMaskClick={closeSearch}
                onClose={closeSearch}
                position={"bottom"}
                closeOnSwipe={true} bodyStyle={{
                height: "80%",
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
            }}>
                <Card title={<Title>筛选数据</Title>} extra={<a onClick={closeSearch}>关闭</a>}>
                    测测测
                </Card>
            </Popup>
            <PullToRefresh
                onRefresh={resetData}>
                {(empty && <ErrorBlock status='empty'/>) || (list?.length > 0 && list?.map(item => (
                    <Card key={item.id} style={{marginBottom: "10px"}}
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
                )))}
            </PullToRefresh>
            {!empty && <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>}
            {/*<PullToRefresh*/}
            {/*    onRefresh={async () => {*/}
            {/*        getPayOrder({*/}
            {/*            onSuccess: (r: any) => {*/}
            {/*                setOrderData(r?.data?.list)*/}
            {/*            }*/}
            {/*        })*/}
            {/*    }}*/}
            {/*    renderText={status => {*/}
            {/*        return <div>{statusRecord[status]}</div>*/}
            {/*    }}>*/}
            {/*    {orderData?.length > 0 && orderData?.map(user => (*/}
            {/*        <Card key={user.id} style={{marginBottom: "10px"}}*/}
            {/*              title={<div className={tit}>*/}
            {/*                  <Icon type={Recharge} style={{marginRight: "3px"}}/>{user.name}*/}
            {/*              </div>}*/}
            {/*              extra={<div className={extra}>{dayjs(user.create_time).format('YYYY-MM-DD')}</div>}>*/}
            {/*            <span className={extra}>*/}
            {/*                <span className={money}>{user.money}</span>元*/}
            {/*            </span><br/>*/}
            {/*            <Paragraph copyable style={{marginBottom: "-22px"}}>*/}
            {/*                <span className={extra}>订单号：{user.trade_no}</span>*/}
            {/*            </Paragraph><br/>*/}
            {/*            <span className={extra}>*/}
            {/*            支付方式：*/}
            {/*                {user.order_type == 0 && "支付宝"}*/}
            {/*                {user.order_type == 1 && "微信"}*/}
            {/*                {user.order_type == 2 && "QQ"}*/}
            {/*                {user.order_type == 3 && "余额"}*/}
            {/*        </span><br/>*/}
            {/*            <span className={extra}>*/}
            {/*            状态：*/}
            {/*                {user.status == 0 && "未支付"}*/}
            {/*                {user.status == 1 && "已支付"}*/}
            {/*        </span>*/}
            {/*        </Card>*/}
            {/*    ))}*/}
            {/*</PullToRefresh>*/}
            {/*<InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>*/}
        </Body>
    )
}