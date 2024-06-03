import React from "react";
import {createStyles} from "antd-style";
const useStyles = createStyles((): any => {
    return {
        right: {
            float: "right",
            zIndex: 2
        },
        left: {
            float: "left",
            zIndex: 2,
        },
    };
});

export type HeaderProps = {
    right?: any;//右侧
    left?: any;//左侧
};

const Header: React.FC<HeaderProps> = (props) => {
    const {styles: {right, left}} = useStyles();
    return <>
        {props?.left && <div className={left}>
            {props.left}
        </div>}
        {props?.right && <div className={right}>
            {props.right}
        </div>}
    </>
}

export default Header;