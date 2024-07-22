import React from "react";
import {history} from 'umi';
import route, {index, user, admin, master, indexPath, userPath, adminPath, masterPath} from '../../config/routes';
import {Icon} from "@/components/icon";

/**
 * 递归获取完整路径
 * @param routes
 * @param name
 * @param params
 * @param currentPath
 */
function getPathByName(routes: any, name: any, params: any = {}, currentPath = ''): any {
    for (const route of routes) {
        let finalPath = currentPath + (currentPath && !currentPath.endsWith('/') ? '/' : '') + (route.path.startsWith('/') ? route.path.slice(1) : route.path);
        if (params && Object.keys(params).length > 0) {
            for (const key in params) {
                if (route.path.includes(`:${key}`)) {
                    finalPath = finalPath.replace(`:${key}`, params[key]);
                }
            }
        }
        if (route.name === name) {
            return finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
        }
        if (route.routes) {
            const foundPath = getPathByName(route.routes, name, params, finalPath);
            if (foundPath) {
                return foundPath;
            }
        }
    }
    return null;
}

/**
 * 路由缓存
 */
const routeCache: any = {}

/**
 * 根据name获取路径
 * @param name 标识
 * @param params 参数
 */
export function getFullPathByName(name: any, params: any = {}): string {
    if (Object.keys(params).length <= 0 && routeCache?.[name] != undefined) {
        return routeCache[name];
    }
    routeCache[name] = getPathByName(route, name, params, '');
    return routeCache[name];
}

/**
 * 跳转页面
 * @param name 标识
 * @param params 参数
 */
export function historyPush(name: any, params = {}) {
    history?.push(getFullPathByName(name, params) || "/");
}

/**
 * 获取tabBarItems
 * @param routes 路由信息
 * @param hideTabBar 是否判断隐藏
 */
export function getTabBarItems(routes: any, hideTabBar = true): any {
    let items: any[] = [];
    routes?.map((item) => {
        if (hideTabBar && item?.hideInTabBar === true) {
            return
        }
        let temp: any = undefined;
        if (item?.component) {
            temp = {
                icon: <Icon type={item?.icon || "icon-home"}/>,
                title: item?.title || "",
                key: item?.name || item.path || item?.component,
            }
        } else {
            if ((item?.routes?.length || 0) > 0) {
                temp = {
                    icon: <Icon type={item?.icon || "icon-home"}/>,
                    title: item?.title || "",
                    key: item?.routes?.[0]?.name || item?.routes?.[0].path || item?.routes?.[0]?.component,
                }
            }
        }
        if (item) {
            items?.push(temp);
        }
    });
    return items;
}

/**
 * 获取user菜单
 */
export function getUserTabBarItems(hideMenu = true) {
    return getTabBarItems(user, hideMenu);
}

/**
 * 获取index菜单
 */
export function getIndexTabBarItems(hideMenu = true) {
    return getTabBarItems(index, hideMenu);
}

/**
 * 获取master菜单
 */
export function getMasterTabBarItems(hideMenu = true) {
    return getTabBarItems(master, hideMenu);
}

/**
 * 获取admin菜单
 */
export function getAdminTabBarItems(hideMenu = true) {
    return getTabBarItems(admin, hideMenu);
}

/**
 * 当前访问系统路由
 */
export function getCurrentTabBarItems(pathName: any, hideMenu = true): any {
    if (pathName == "/" || pathName == "") {
        pathName = "/index/index";
    }
    let mode = "";
    const regex = /\/([^/]+)\//; // 正则表达式匹配 / 之间的内容
    const matches = pathName.match(regex); // 匹配结果数组
    if (matches && matches.length >= 2) {
        mode = matches[1];
    }
    if (mode == userPath) {
        return getUserTabBarItems(hideMenu);
    }
    if (mode == indexPath) {
        return getIndexTabBarItems(hideMenu);
    }
    if (mode == masterPath) {
        return getMasterTabBarItems(hideMenu);
    }
    if (mode == adminPath) {
        return getAdminTabBarItems(hideMenu);
    }
    return [];
}

/**
 * 获取当前访问路径
 * @param pathName 当前路径
 */
export function getCurrentPath(pathName: any): any {
    if (pathName == "/" || pathName == "") {
        pathName = "/index/index";
    }
    let mode = "";
    const regex = /\/([^/]+)\//; // 正则表达式匹配 / 之间的内容
    const matches = pathName.match(regex); // 匹配结果数组
    if (matches && matches.length >= 2) {
        mode = matches[1];
    }
    if (mode == userPath) {
        return '/' + userPath;
    }
    if (mode == indexPath) {
        return '/' + indexPath;
    }
    if (mode == masterPath) {
        return '/' + masterPath;
    }
    if (mode == adminPath) {
        return '/' + adminPath;
    }
    return '/' + indexPath;
}