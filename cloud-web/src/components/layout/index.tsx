import React from "react";
import Body from "@/components/layout/body";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Sider from "@/components/layout/sider";
import 'dayjs/locale/zh-cn';
import {Theme} from "@/components";

import SkLayout, {LayoutProps} from "@/components/layout/sinking";

const Layout: React.FC<LayoutProps> = (props) => {
    return (<Theme>
        <SkLayout {...props}/>
    </Theme>);
}

export {
    Body,
    Footer,
    Header,
    Sider,
}

export default Layout;