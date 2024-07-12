import {Mobile} from "@/components";
import {useLocation, useSelectedRoutes} from "@umijs/renderer-react";
import React, {useEffect, useState} from "react";
import {getCurrentTabBarItems, historyPush} from "@/utils/route";
import {getLoginToken} from "@/utils/auth";
import {useModel} from "umi";

export default function () {
    const location = useLocation();
    const tabBarItems = getCurrentTabBarItems(location?.pathname);
    const route: any = useSelectedRoutes();
    const [tabBarActiveKey, setTabBarActiveKey] = useState("");
    const [showTabBar, setShowTabBar] = useState(true);
    const user = useModel('user')
    const initUser = () => {
        if (getLoginToken() == "") {
            historyPush("user.login");
            return;
        }
        user?.getWebUser()?.then((u: any) => {
            user?.setWeb(u);
        })
    }
    /**
     * 初始化用户
     */
    useEffect(() => {
        initUser();
    }, []);
    useEffect(() => {
        const name = route?.pop()?.route?.name;
        setTabBarActiveKey(name);
        let show = false
        for (let i = 0; i < tabBarItems?.length; i++) {
            if (tabBarItems?.[i]?.key == name) {
                show = true
                break;
            }
        }
        setShowTabBar(show)
    }, [location]);

    return <Mobile tabBar={tabBarItems}
                   onTabBarChange={(key) => {
                       historyPush(key);
                   }}
                   tabBarActiveKey={tabBarActiveKey}
                   showTabBar={showTabBar}/>;
}