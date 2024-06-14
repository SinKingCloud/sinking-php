import React from "react";
import {createStyles} from "antd-style";
const useStyles = createStyles(({responsive,css}): any => {
    return {
        right: css`
            float: right;
            z-index: 2;
            top: 0;
            position: fixed;
            right: 0;
            // width: 181px;
            ${responsive.md || responsive.lg || responsive.xl || responsive.xxl} {
                top: 0;
                right: 0;
            }
        `,
        left:css`
            float: left;
            z-index: 2;
            width:82%;
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