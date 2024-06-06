import React from "react";
import Layouts from "./components/layouts";
import {getMasterMenuItems} from "@/utils/route";

export default () => {
    return (
        <Layouts menu={getMasterMenuItems()}/>
    );
}