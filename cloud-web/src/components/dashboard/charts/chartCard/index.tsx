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
        metaWrap: {
            float: "left"
        },
        avatars: {
            position: "relative",
            top: "4px",
            float: "left",
            marginRight: "20px",
        },
        meta: {
            height: "22px",
            color: "@text-color-secondary",
            fontSize: "@font-size-base",
            lineHeight: "22px",
        },
        actions: {
            position: "absolute",
            top: "4px",
            right: 0,
            lineHeight: 1,
            cursor: "pointer",
        },
        totals: {
            height: "38px",
            marginTop: "4px",
            marginBottom: 0,
            overflow: "hidden",
            color: "@heading-color",
            fontSize: "30px",
            lineHeight: "38px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            wordBreak: "break-all",
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
        footers: {
            marginTop: "8px",
            paddingTop: "9px",
            borderTop: "1px solid @border-color-split"
        },
        footerMargin: {
            marginTop: "20px"
        }
    }
})
const renderTotal = (total?: number | totalType | React.ReactNode) => {
    const {styles: {totals}} = useStyles()
    if (!total && total !== 0) {
        return null;
    }
    let totalDom;
    switch (typeof total) {
        case 'undefined':
            totalDom = null;
            break;
        case 'function':
            totalDom = <div className={totals}>{total()}</div>;
            break;
        default:
            totalDom = <div className={totals}>{total}</div>;
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

class ChartCard extends React.Component<ChartCardProps> {
    renderContent = () => {
        const {
            styles: {
                chartCard, chartTop, chartTopMargin, metaWrap, avatars,
                meta, actions, content, contentFixed,footers,footerMargin
            }
        } = useStyles()
        const {contentHeight, title, avatar, action, total, footer, children, loading} = this.props;
        if (loading) {
            return false;
        }
        return (
            <div className={chartCard}>
                <div
                    className={classNames(chartTop, {
                        [chartTopMargin]: !children && !footer,
                    })}
                >
                    <div className={avatars}>{avatar}</div>
                    <div className={metaWrap}>
                        <div className={meta}>
                            <span >{title}</span>
                            <span className={actions}>{action}</span>
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
                        className={classNames(footers, {
                            [footerMargin]: !children,
                        })}
                    >
                        {footer}
                    </div>
                )}
            </div>
        );
    };

    render() {
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
        } = this.props;
        return (
            <Card loading={loading} bodyStyle={{padding: '20px 24px 8px 24px'}} {...rest}>
                {this.renderContent()}
            </Card>
        );
    }
}

export default ChartCard;
