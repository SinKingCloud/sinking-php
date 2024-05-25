import React from "react";
import {createStyles} from "antd-style";
const useStyles = createStyles((): any => {
    return {
        right: {
            float: "right",
            zIndex: 2
        },
    };
});

export type HeaderProps = {
    right?: any;//右侧
};

const Header: React.FC<HeaderProps> = (props) => {
    const {styles: {right}} = useStyles();
    return <>
        {props?.right && <div className={right}>
            {props.right}
        </div>}
    </>
}

export default Header;