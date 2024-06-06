import React from "react";
import Layouts from "./components/layouts";
import {getUserMenuItems} from "@/utils/route";

export default () => {
    return (
            <Layouts menu={getUserMenuItems()}/>
    );
}