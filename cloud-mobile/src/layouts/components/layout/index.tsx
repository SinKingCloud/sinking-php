import {Mobile} from "@/components";
import {useLocation, useSelectedRoutes} from "@umijs/renderer-react";
import React, {useEffect, useState} from "react";
import {getCurrentPath, getCurrentTabBarItems, historyPush} from "@/utils/route";
import {getLoginToken} from "@/utils/auth";
import {useModel} from "umi";
import request from "@/utils/request";
import {createStyles} from "antd-style";
import {Spin} from "antd";

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

const useStyles = createStyles(({isDarkMode, css}): any => {
    const bac = "radial-gradient(191.09% 94.72% at 12.72264631043257% 89.55399061032864%, rgba(247, 171, 171, 0.3) 0%, rgba(150, 240, 250, 0.21) 45.59%, rgba(181, 174, 245, 0.15) 66.76%, rgba(255, 255, 255, 0.3) 100%) !important"
    return {
        body: css`
            background: ${bac};
        `,
        load: {
            margin: "0 auto",
            width: "100%",
            lineHeight: "80vh",
        },
    }
})

export default function () {
    const location = useLocation();
    const tabBarItems = getCurrentTabBarItems(location?.pathname);
    const route: any = useSelectedRoutes();
    const [tabBarActiveKey, setTabBarActiveKey] = useState("");
    const [showTabBar, setShowTabBar] = useState(true);
    const user = useModel('user');
    const web = useModel('web');
    const isIndex = () => {
        return getCurrentPath(location?.pathname) == '/index';
    }
    const initUser = () => {
        if (isIndex() || getLoginToken() == "") {
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

    const {styles: {body, load}} = useStyles();
    return <>
        {(!web?.info?.id && <Spin spinning={true} size="large" className={load}></Spin>) ||
            <Mobile bodyClassName={body} tabBar={tabBarItems}
                    onTabBarChange={(key) => {
                        historyPush(key);
                    }}
                    tabBarActiveKey={tabBarActiveKey}
                    showTabBar={showTabBar}/>}
    </>;
}