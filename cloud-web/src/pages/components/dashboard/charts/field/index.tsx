import React from 'react';

export type FieldProps = {
    label: React.ReactNode;
    value: React.ReactNode;
    style?: React.CSSProperties;
};

const Field: React.FC<FieldProps> = ({ label, value, ...rest }) => (
    <div style={{
        margin: 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    }} {...rest}>
        <span style={{
            lineHeight: "22px"
        }}>{label}</span>
        <span style={{
            lineHeight: "22px",
            marginLeft: "8px"
        }}>{value}</span>
    </div>
);

export default Field;
