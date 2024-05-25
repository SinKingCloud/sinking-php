import React from "react";
import {Body} from "@/layouts/components";
import {App, Button} from "antd";

export default () => {
    const {message} = App.useApp();
    return (
        <Body breadCrumb={false}>
            <Button onClick={() => {
                message?.error("success")
            }}>test</Button>
        </Body>
    );
};