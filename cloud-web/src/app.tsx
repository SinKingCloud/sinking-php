import {matchRoutes} from 'umi';
import defaultSettings from "../config/defaultSettings";

/**
 * 路由跳转事件
 * @param props 传递参数
 */
export function onRouteChange(props: any) {
    const route = matchRoutes(props?.clientRoutes, props?.location?.pathname)?.pop()?.route;
    //@ts-ignore
    if (route && route?.title) {
        document.title = route?.title + " - " + (defaultSettings?.name || defaultSettings?.title);
    }
}