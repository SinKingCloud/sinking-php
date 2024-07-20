import {Mobile} from "@/components";
import {useLocation, useSelectedRoutes} from "@umijs/renderer-react";
import React, {useEffect, useState} from "react";
import {getCurrentPath, getCurrentTabBarItems, historyPush} from "@/utils/route";
import {getLoginToken} from "@/utils/auth";
import {useModel} from "umi";
import request from "@/utils/request";

/**
 * 中间件
 * @param ctx context
 * @param next 执行函数
 */
const check = async (ctx: any, next: any) => {
    await next();
    if (ctx.res.code == 403) {
        historyPush("notAllowed");
    }
}
request.use(check);

export default function () {
    const location = useLocation();
    const tabBarItems = getCurrentTabBarItems(location?.pathname);
    const route: any = useSelectedRoutes();
    const [tabBarActiveKey, setTabBarActiveKey] = useState("");
    const [showTabBar, setShowTabBar] = useState(true);
    const user = useModel('user');
    const isIndex = () => {
        return getCurrentPath(location?.pathname) == '/index';
    }
    const initUser = () => {
        if (isIndex()) {
            return;
        }
        if (getLoginToken() == "") {
            historyPush("login");
            return;
        }
        user?.getWebUser()?.then((u: any) => {
            user?.setWeb(u);
        });
    }

    /**
     * 初始化tabBar显示状态
     */
    useEffect(() => {
        if (isIndex()) {
            setShowTabBar(false);
            return;
        }
        if (!user?.web) {
            initUser();
        }
        const name = route?.pop()?.route?.name;
        setTabBarActiveKey(name);
        let show = false;
        for (let i = 0; i < tabBarItems?.length; i++) {
            if (tabBarItems?.[i]?.key == name) {
                show = true;
                break;
            }
        }
        setShowTabBar(show);
    }, [location]);

    /**
     * 初始化用户
     */
    useEffect(() => {
        initUser();
    }, []);

    return <Mobile tabBar={tabBarItems}
                   onTabBarChange={(key) => {
                       historyPush(key);
                   }}
                   tabBarActiveKey={tabBarActiveKey}
                   showTabBar={showTabBar}/>;
}