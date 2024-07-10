import {Icon, Mobile} from "@/components";
import {useLocation, useSelectedRoutes} from "@umijs/renderer-react";
import React, {useEffect, useState} from "react";
import {Help, Home, Tabulate, Recharge, User} from "@/components/icon";
export default function Layout() {
    const param:any = useSelectedRoutes()
    const { pathname } = useLocation()
    const [show,setShow] = useState(false)
    const hide = ()=>{
        if (param.length > 0) {
            param[0]?.route?.children.map((item: any) => {
                if(pathname === item.path && item.hideInMenu === true){
                    setShow(true)
                }else{
                    setShow(false)
                }
            });
        }
    }
    useEffect(() => {
        hide()
    }, [param]);
  return (
        <Mobile tabBar={[
            { key: "/", icon: <Icon type={Home}/>, title: "首页"},
          {key: "/list", icon: <Icon type={Tabulate}/>, title: "列表"},
            {key: "/recharge", icon: <Icon type={Recharge}/>, title: "充值"},
            {key: "/help", icon: <Icon type={Help}/>, title: "帮助"},
            {key: "/my", icon: <Icon type={User}/>, title: "我的"},
        ]} showTabBar={hide} className={show}/>
  )
}
