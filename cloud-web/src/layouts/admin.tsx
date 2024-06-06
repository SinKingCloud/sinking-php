import React from "react";
import Layouts from "./components/layouts";
import {getAdminMenuItems} from "@/utils/route";

export default () => {
    return (
        <Layouts menu={getAdminMenuItems()}/>
    );
}