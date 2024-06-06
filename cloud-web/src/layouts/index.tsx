import React from "react";
import {Outlet} from "umi";
import {App} from "antd";
import {Theme} from "@/components";

export default () => {
    return (
        <Theme>
            <App>
                <Outlet/>
            </App>
        </Theme>
    );
}