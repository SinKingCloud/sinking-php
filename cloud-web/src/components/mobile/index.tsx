import Mobile from "./layoutMobile"
import React from "react";
import {history, useLocation} from "umi";
import {Icon} from "@/components"
import {Home, Order} from "@/components/icon";
export default ()=>{
    const {pathname} = useLocation()
    const tabs = [
        {
            icon: <Icon type={Home}/>,
            title: '首页',
            key: '/user/index'
        },
        {
            icon: <Icon type={Order}/>,
            title: '开发文档',
            key: '/user/docs'
        }
    ]
    return <Mobile
             backArrow={!tabs.find(item => item.key === pathname)}
             change={(key)=>{
                 history.push(key)
             }}
             onBack={()=>{
                 history.back()
             }}
             path={pathname}
             titles={tabs?.map((item:any)=>{
                 if(item?.key === pathname){
                     return item?.title
                 }
             })}
             tabBar={tabs}
    />
}