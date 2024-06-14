import React from "react";
import {createStyles} from "antd-style";
const useStyles = createStyles(({responsive,css}): any => {
    return {
        right: css`
            float: right;
            z-index: 2;
            width:12%;
            ${responsive.mobile} {
                width:100%;
                position: fixed;
                right: -205px;
            }
        `,
        left:css`
            float: left;
            z-index: 2;
            width:88%;
        `
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