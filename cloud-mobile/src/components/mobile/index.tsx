import React from "react";
import SkLayout, {MobileProps} from "./sinking";
import Theme from "../theme";
import Body from "./body";

const Mobile: React.FC<MobileProps> = (props: any) => {
    return <Theme>
        <SkLayout {...props}/>
    </Theme>;
}

export {
    Body,
}
export default Mobile