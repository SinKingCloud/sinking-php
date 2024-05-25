import React from "react";
import {Outlet} from "umi";
import {App} from "antd";

export default () => {
    return (
        <App>
            <Outlet/>
        </App>
    );
}