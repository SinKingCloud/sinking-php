import React from "react";
import {Outlet, useLocation} from "umi";
import {App} from "antd";
import {Theme} from "@/components";
import {getCurrentMenus, getCurrentPath} from "@/utils/route";
import {indexPath} from "../../config/routes";
import {Layout} from "@/layouts/components";

export default () => {
    const location = useLocation();
    const getMenus = () => {
        return getCurrentMenus(location?.pathname, true);
    }
    const getDom = () => {
        if (getCurrentPath(location?.pathname) == '/' + indexPath) {
            return <Theme>
                <App>
                    <Outlet/>
                </App>
            </Theme>;
        } else {
            return <Layout menu={getMenus()}/>
        }
    }
    return getDom();
}