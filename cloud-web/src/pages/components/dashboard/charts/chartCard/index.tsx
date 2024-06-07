import {Card} from 'antd';
import type {CardProps} from 'antd/es/card';
import React from 'react';
import classNames from 'classnames';
import {createStyles} from "antd-style";

type totalType = () => React.ReactNode;
const useStyles = createStyles(({css}): any => {
    return {
        chartCard: {
            position: "relative"
        },
        chartTop: {
            position: "relative",
            width: "100%",
            overflow: "hidden",
        },
        chartTopMargin: {
            marginBottom: "12px"
        },
        chartTopHasMargin: {
            marginBottom: "20px"
        },
        metaWrap: {
            float: "left"
        },
        avatar1: {
            position: "relative",
            top: "4px",
            float: "left",
            marginRight: "20px",
        },
        img: {
            borderRadius: "100%"
        },
        meta: {
            height: "22px",
            lineHeight: "22px"
        },
        action1: {
            position: "absolute",
            top: "4px",
            right: 0,
            lineHeight: 1,
            cursor: "pointer",
        },
        content: {
            position: "relative",
            width: "100%",
            marginBottom: "12px",
        },
        contentFixed: {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
        },
        footer1: css`
            margin-top: 8px;
            padding-top: 9px;

            & > * {
                position: relative;
            }
        `,
        footerMargin: {
            marginTop: "20px"
        }
    }
})
const renderTotal = (total?: number | totalType | React.ReactNode) => {
    if (!total && total !== 0) {
        return null;
    }
    let totalDom;
    switch (typeof total) {
        case 'undefined':
            totalDom = null;
            break;
        case 'function':
            totalDom = <div style={{
                height: "38px",
                marginTop: "4px",
                marginBottom: 0,
                overflow: "hidden",
                fontSize: "30px",
                lineHeight: "38px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                wordBreak: 'break-all'
            }}>{total()}</div>;
            break;
        default:
            totalDom = <div style={{
                height: "38px",
                marginTop: "4px",
                marginBottom: 0,
                overflow: "hidden",
                fontSize: "30px",
                lineHeight: "38px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                wordBreak: 'break-all'
            }}>{total}</div>;
    }
    return totalDom;
};

export type ChartCardProps = {
    title: React.ReactNode;
    action?: React.ReactNode;
    total?: React.ReactNode | number | (() => React.ReactNode | number);
    footer?: React.ReactNode;
    contentHeight?: number;
    avatar?: React.ReactNode;
    style?: React.CSSProperties;
} & CardProps;

const ChartCard: React.FC<ChartCardProps> = ({...props}) => {
    const {
        styles: {
            chartCard,
            chartTop,
            chartTopMargin,
            avatar1,
            metaWrap,
            meta,
            action1,
            content,
            contentFixed,
            footer1,
            footerMargin
        }
    } = useStyles()
    const {
        loading = false,
        contentHeight,
        title,
        avatar,
        action,
        total,
        footer,
        children,
        ...rest
    } = props;
    return (
        <Card loading={loading} {...rest}>
            <div className={chartCard}>
                <div
                    className={classNames(chartTop, {
                        [chartTopMargin]: !children && !footer,
                    })}
                >
                    <div className={avatar1}>{avatar}</div>
                    <div className={metaWrap}>
                        <div className={meta}>
                            <span>{title}</span>
                            <span className={action1}>{action}</span>
                        </div>
                        {renderTotal(total)}
                    </div>
                </div>
                {children && (
                    <div className={content} style={{height: contentHeight || 'auto'}}>
                        <div className={contentHeight && contentFixed}>{children}</div>
                    </div>
                )}
                {footer && (
                    <div
                        className={classNames(footer1, {
                            [footerMargin]: !children,
                        })}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </Card>
    )
}

export default ChartCard;
