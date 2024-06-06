import React from "react";
import {Layouts} from "./components";
import {getUserMenuItems} from "@/utils/route";

export default () => {
    return (
        <Layouts menu={getUserMenuItems()}/>
    );
}