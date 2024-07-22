import React from "react";
import {Outlet, useLocation} from "umi";
import {App, Spin} from "antd";
import {Theme} from "@/components";
import {getCurrentMenus, getCurrentPath} from "@/utils/route";
import {indexPath} from "../../config/routes";
import {Layout} from "@/layouts/components";
import {useModel} from "umi";
import {createStyles} from "antd-style";

/**
 * 样式信息
 */
const useStyles = createStyles((): any => {
    return {
        collapsedImg: {
            width: "35px",
        },
        unCollapsed: {
            overflow: "hidden",
            position: "absolute",
            display: "inline-flex",
            ">img": {
                width: "35px",
                float: "left"
            },
            ">div": {
                fontSize: "25px",
                marginLeft: "5px",
                fontWeight: "bolder",
                float: "left",
                lineHeight: "30px",
                whiteSpace: "nowrap",
            }
        },
        load: {
            margin: "0 auto",
            width: "100%",
            lineHeight: "80vh",
        },
    };
});

export default () => {
    const web = useModel("web");
    const location = useLocation();
    const getMenus = () => {
        return getCurrentMenus(location?.pathname, true);
    }
    const {styles: {load}} = useStyles();
    const getDom = () => {
        if (!web?.info?.id) {
            return <Spin spinning={true} size="large" className={load}/>;
        }
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