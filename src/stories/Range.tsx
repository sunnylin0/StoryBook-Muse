import React from 'react';
import './util/string.extensions'
interface Point {
    x: number,
    y: number
}

interface RangeProps {
    //w: number;
    //h: number;
    //x: number;
    //y: number;
    children?: any,
    clazz: string;
    show?: boolean;
    type?: string,
    editable?: boolean,
    offset?: any,
    offsetX?: number,
    offsetY?: number,
    onClick?: any;
    //onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Range: React.FC<RangeProps> = ({
    children,
    clazz,
    show=false,
    type,
    editable = false,
    offset = { x: null, y: null },
    offsetX,
    offsetY,
    onClick,
    ...props
}: RangeProps) => {
        offsetX = (offset?.x ?? offsetX) | 0;
        offsetY = (offset?.y ?? offsetY) | 0;
        return (
            <g
                className={clazz}
                type={type}
                transform={`translate(${offsetX.toNumPoint(2)},${offsetY.toNumPoint(2)})`}
                onClick={ onClick}
                style={
                    editable
                        ? {
                            cursor: "pointer",
                        }
                        : null
                }                
            >
                {children}
            </g>
        );
    
}



//const Range: React.FC<RangeProps> = ({
//    clazz,
//    show = false,
//    children,
//    type,
//    editable=false,
//    offsetX=0,
//    offsetY=0,
//    //offset = { x: 0, y: 0 },
//    //onClick,
//    //handleClick,
//    //...props
//}: RangeProps) => {
//    if (show) {

//        //offsetX = (offset?.x ?? offsetX) | 0;
//        //offsetY = (offset?.y ?? offsetY) | 0;
//        return (
//            <g
//                className={clazz}
//                type={type}
//                transform={`translate(${offsetX},${offsetY})`}
//                //onClick={onClick()}
//                style={
//                    editable
//                        ? {
//                            cursor: "pointer",
//                        }
//                        : null
//                }                
//            >
//                {children}
//            </g>
//        );
//    }
//}
export default Range;
