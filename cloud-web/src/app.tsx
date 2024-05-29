import {matchRoutes} from 'umi';
import defaultSettings from "../config/defaultSettings";
import {App} from "antd";
import {Antd} from "@/components";

/**
 * 路由跳转事件
 * @param props 传递参数
 */
export function onRouteChange(props: any) {
    const route = matchRoutes(props?.clientRoutes, props?.location?.pathname)?.pop()?.route;
    if (route && route?.title) {
        document.title = route?.title + " - " + (defaultSettings?.name || defaultSettings?.title);
    }
}

/**
 * 挂载静态方法
 * @param container 容器
 */
export function rootContainer(container: React.ReactElement) {
    return (
        <App>
            <Antd/>
            {container}
        </App>
    )
}