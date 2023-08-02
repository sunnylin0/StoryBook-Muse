import React from 'react';
import escapeHtml from "./util/html-escape";
import "./util/string.extensions"

interface TextProps {
    children?: any;
    editable?: boolean;
    dominantBaseline?: string;
    textAnchor?: string;
    fontSize?: number;
    fontFamily?: string;
    x?: number;
    y?: number;

}
function Text({
    children,
    editable,
    dominantBaseline = "hanging",
    textAnchor = "hanging",
    fontSize,
    fontFamily,
    x = 0,
    y = 0,
    ...props }: TextProps) {
    if (typeof children === "string") {
        return (
            <text
                x={x.toNumPoint(2)}
                y={y.toNumPoint(2)}
                style={
                    editable
                        ? {
                            cursor: "pointer",
                        }
                        : null
                }
                dominantBaseline={dominantBaseline}
                textAnchor={textAnchor}
                fontSize={fontSize}
                fontFamily={fontFamily}
                stroke="none"
                fontWeight="bold"               
                fill="currentColor"
                dangerouslySetInnerHTML={{ __html: escapeHtml(children) }}
                {...props}
            ></text>
        );
    }
    return (
        <text
            x={x}
            y={ y}
            style={
                editable
                    ? {
                        cursor: "pointer",
                    }
                    : null
            }
            dominantBaseline={dominantBaseline}
            textAnchor={textAnchor}
            fontSize={fontSize}
            fontFamily={fontFamily }
            stroke="none"
            fontWeight="bold"
            fill="currentColor"
            {...props}
        >
            {children}
        </text>
    );
}
export default Text;