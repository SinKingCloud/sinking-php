import React from "react";
import Theme from "@/components/theme";
import Content, {BodyProps} from "./content";

const Body: React.FC<BodyProps> = (props: any) => {
    /**
     * 页面容器
     */
    return <Theme theme={props?.themes} mode={props?.mode}>
        <Content {...props}>
            {props?.children}
        </Content>
    </Theme>;
};

export default Body
