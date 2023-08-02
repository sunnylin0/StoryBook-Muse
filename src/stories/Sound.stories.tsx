import React, { Children, MouseEvent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Sound from './Sound';
import { Border, Make, OuterBorder } from './Border';
//import MuseNoise, { Noise } from './MuseNoise';
//import MuseNotation, { Notation, MuseNotationInfo } from './MuseNotation';
import MuseConfig from "./MuseConfig";
import MusePage from './MusePage';
import Text from './Text';
import Range from './Range';
//import { SoundSubNote, createNote } from './SoundNote'
import './util/string.extensions'
import P, { calcSubTextWidth } from "./util/placement";
import store ,{  IinitialData} from "./global/global"
import { Notation } from '../../src-v1/stories/MuseNotation';




let jsonResult =
    `{"title": "清平乐·禁庭春昼", "subtitle": "琵琶弹唱","author": "原曲：赵亮棋|改编记谱：团　儿","rhythmic": "6236","speed": "","C": "C",
"pages": [{"paragraphs": [{ "measures": [{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}]},
{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}  ]},
{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}  ]},
{"rows": [{"noises": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"noises": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]}  ]} ]     }],
"lines": [{ "tracks": [{  "bars": [{"notes": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"notes": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"notes": [{ "n": "0@0|0"},{"n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]},
{"notes": [{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"},{ "n": "0@0|0"}]}  ]},
{  "bars": [
{"notes": [{ "n": "6++@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]},
{"notes": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "2@1|0"},{ "n": "3@1|0"},{ "n": "5-@0|0"}]},
{"notes": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "3@0|0"},{ "n": "5-@0|0"}]},
{"notes": [{ "n": "6--@0|0"},{ "n": "3-@1|0"},{ "n": "6-@1|0"},{ "n": "2@1|0"},{ "n": "3@1|0"},{ "n": "1@0|0"}
]}  ]} ]     }]    }]}`;



// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Example/Sound',
    component: Sound,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} as ComponentMeta<typeof Sound>;

let pos: number = 0;

const Btn=(args) => {
    return (<input type="button" value="me" {...args}/>)
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Btn> = (args) => <Btn {...args} />;
export const BtnS1 = Template.bind({});
BtnS1.args = {
    onClick: () => {
        let n1 = 4;
        alert(n1.toNumPoint(2));
    }
}

const Template2: ComponentStory<typeof Border> = (args) => <svg><Border {...args} /></svg>;
export const BorderS1 = Template2.bind({});

BorderS1.args = {
    clazz: 'border',
    show: true,
    w: 20,
    h: 20,
    x: 4,
    y: 5,
    color: '#441'
};


const Template3: ComponentStory<typeof OuterBorder> = (args) => <svg><OuterBorder {...args} /></svg>;
export const OuterBorderS1 = Template3.bind({});
OuterBorderS1.args = {
    clazz: 'outerborder',
    show: true,
    w: 20,
    h: 20,
    x: 13,
    y: 15,
    color: '#414'
};

const Template4: ComponentStory<typeof Make> = (args) => <svg>123<Make {...args} /></svg>;
export const MakeS1 = Template3.bind({});
MakeS1.args = {
    clazz: 'make',
    show: true,
    w: 100,
    h: 20,
    x: 30,
    y: 30,
    color: '#144'
};


const Temp6: ComponentStory<typeof Text> = (args) => <svg> <Text >3</Text></svg>;
export const TEXT = Temp6.bind({});
TEXT.args = {
    //   notation: new Notation(JSON.parse(jsonResult), new MuseConfig())
};

const Counter: React.FC = () => {
    // We're using `MouseEvent` as type for the event.
    // It contains properties an event can have
    // and methods (such as `preventDefault` an others).
    const clickHandler = (e: MouseEvent): void => {
        e.preventDefault();
        alert(`Clicked at ${e.pageX} ${e.pageY}`);
    }

    return (
        <button onClick={clickHandler}>
            Click me!
        </button>
    );
}

const tempRR: ComponentStory<typeof Text> = (args) => <svg> <RR > <Text >3412</Text></RR></svg>;
export const TempRR = tempRR.bind({});
const RR = ({ children, ...props }: any) => {
    let clazz = "RRass";
    let handleClick = (event) => { console.log(); };
    return (
        <Range clazz={clazz}
            // children={"wer"}
            //type
            //editable=false,
            //offsetX={0}
            //offsetY={0}
            offset={{ x: 0, y: 10 }}

            onClick={() => {
                console.log("RR console.log");
            }}
        >{children}</Range>);
}

const enum notationss  {
    zero= "0",
    do= "1",
    re= "2",
    mi= "3",
    fa= "4",
    sol= "5",
    la= "6",
    si= "7",
    extend= "─",
    separator= "│",
    crackerOpen= "(",
    crackerClose= ")",
}
//import Ns = notationss;
const notes = [
    notationss.zero,
    notationss.do,
    notationss.re,
    notationss.mi,
    notationss.fa,
    notationss.sol,
    notationss.la,
    notationss.si,
];
const separators = ["│", "‖"];

export interface INote {

    n?: string;
    type?: string;
    key?: string;
    note?: string | notationss;  //0 1 2 3 4 5 6
    octave?: number;            //高八度，低八度
    duration?: number;          //音附的長度 1拍約=480， 4拍=1920
    dotted?: number;            //幾個附點音符
    fingering?: Array<any>;     //指法
    underline?: number;         //下面要畫幾條線
    breakUnderline?: boolean;   //是否要跟前面的音連在一起
    prefixSups?: any;           //升降記號 ＃　ｂ　ｏ
    topDecorators?: any;
    tieTo?: { type: "start" | "stop", num: number };       //連音線開始 結束
    slurTo?: { type: "start" | "stop", num: number };   //圓滑線開始 結束
}


// 创建符号
function createNote(initial: INote): INote {
    const clarDuration = (it: INote): number => {
        let noteLen = 480;
        if (it.underline > 0) {
            noteLen = noteLen / (it.underline*2);
        }
        //計算附點的長度，每點除 2
        if (it.dotted > 0) {
            let ln: number = noteLen;
            for (var k = 0; k < it.dotted; k++) {
                ln = ln / 2;
                noteLen = noteLen + ln ;                
            }            
        }
        return noteLen.toNumPoint(2);}
    const n: INote = {
        n: "6--2@0",
        type: "notation",
        
        key:`n_${Math.random().toString(36).substring(6)}`,//從第6個字開始抓，所以是13 - 6 = 7 個隨機數字+字母
        note: "6",
        octave: 2,
        
        dotted: 2,
        duration:0,
        underline: 2,
        breakUnderline: false,
        fingering: ["shake","shake"],
        prefixSups: ["♯"],
        topDecorators: ["5","4","3","2","1"],
        tieTo: null,
    };
    n.duration = clarDuration(n);
    if (initial) {
        Object.assign(n, initial);
    }
    return n;
}


// 新建段落
function createParagraph(initial) {
    const p = {
        type: "paragraph",
        key: `p_${Math.random().toString(36).substring(6)}`,//從第6個字開始抓，所以是13 - 6 = 7 個隨機數字+字母
        // 符号列表
        notations: [],
        // 是否两端对齐
        alignJustify: null,
    };
    if (initial) {
        Object.assign(p, initial);
    }
    return p;
}
function createParagraphWithNotations() {
 
    
    return createParagraph({
        notations: [
            createNote({ note: "0" }),
            createNote({ note: "0" }),
            createNote({ note: "0" }),
            createNote({ note: "0" }),
            createNote({ note: notationss.separator }),
        ],
    });
}


interface RNoteProps {
    offsetX?: number,
    offsetY?: number,
    w?: number,
    h?: number,
    notation: INote
}

const RNote: React.FC<RNoteProps> = ({
    offsetX=0, offsetY=0, w, h, notation
}: RNoteProps) => {

    const enum FingEnum {
        shake= "shake",
        wheel= "wheel"
    };
    const underlineOffset = P.underlineStepOffsetY * (notation.underline | 0);   
    
    // octaveInitialOffset 八度初始偏移
    const octaveInitialOffset =
        notation.octave > 0
            ? -P.octaveInitialOffsetAbove
            : P.octaveInitialOffsetBelow + underlineOffset;
    // octaveStepOffset 八度步進偏移
    const octaveStepOffset = (notation.octave > 0 ? -1 : 1) * P.octaveStepOffsetY;
    let topDecoratorOffset = 0;
    if (notation.octave > 0) {
        // 如果有高八度圆点，将顶部装饰符渲染到其上方
        topDecoratorOffset = octaveStepOffset * Math.abs(notation.octave);
    }

    ///前綴支持
    const renderPrefixSups = () => {
        const sups = notation.prefixSups || [];
        const rendered = sups.map((s, i) => {
            let props = {}
            return (<Text
                key={i + s}
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={store.defaultSubFontSize}
                fontFamily={store.defaultFontFamily}
                x={-P.xWidth - (calcSubTextWidth(sups.slice(0, i).join("")) + 2 * i)}
                y={-P.subXHeight / 2 + 2}
            >
                {s}
            </Text>);
        });
        return rendered;
    };

    const renderTopDecorators = () => {
        const decs = notation.topDecorators || [];
        const rendered = decs.map((d, i) => (
            <Text
                key={i + d}
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={store.defaultSubFontSize}
                fontFamily={ store.defaultFontFamily}
                y={topDecoratorOffset - (i + 1) * P.subXHeight + 2}
            >
                {d}
            </Text>
        ));
        return rendered;
    };

    /**
     * 創建陣列 元素為 0 的陣列
     * @param octave 陣列的個數
     */
    function composeArray(octave:number|string):Array<number>|null {
        const len = Math.abs(Number(octave));
        if (!Number.isInteger(len)) {
            return [];
        }
        return Array(len).fill(0, 0, len);
    }

    //劃指法
    const renderFingering = () => {
        const fing = notation.fingering || [];
        const rendered = fing.map((f, i) => (function () {
            switch (f.kind) {
                case FingEnum.shake:
                    console.log('FingEnum.shake.');
                    return (<Text
                        key={i + f}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize={store.defaultSubFontSize}
                        y={topDecoratorOffset - P.subXHeight * 3}>
                        k
                    </Text >);
                    break;
                case FingEnum.wheel:
                    console.log('FingEnum.wheel.');
                    return (<Text
                        key={i + f}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize={store.defaultSubFontSize}
                        y={P.subXHeight * .5}>
                        w
                    </Text >);
                    break;
                default:
                    console.log(`Sorry, we are out of ${f.kind}.`);
                    return (<Text
                        key={i + f}
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize={store.defaultSubFontSize}
                        y={topDecoratorOffset - (i + 1) * P.subXHeight + 2}>
                        {f}
                    </Text >);
            }
        }


        ));
        return rendered;
    };

    //畫本音附 01234567
    const renderNote = () => {
        let transform ;
        let props: any;
        
        if (notation.note === "string") {//notations.extend) {
            // 延音符太长了缩短一点     
            console.log("transform scale(0.8, 1)");
            transform = "scale(0.8, 1)";
        }
        props = {
            dominantBaseline: "middle",
            textAnchor: "middle",
            fontSize: store.defaultFontSize,
            fontFamily:store.defaultFontFamily,
            transform
        }
        console.log("renderNotr");
        return (
            <Text {...props}>
                {notation.note}
            </Text>
        );
    };
    // 畫 高八度 / 低八度
    const renderOctave = () => {
        return composeArray(notation.octave).map((oc, i) => (
            <circle
                key={i}
                type="octave"
                cx="0"               
                cy={(octaveInitialOffset + octaveStepOffset * i).toNumPoint(2)}
                fill="currentColor"
                r="2"
            ></circle>
        ));
    };
 
    return (
        <Range clazz={"note " + notation.key} key={notation.key} offsetX={offsetX?.toNumPoint(2)} offsetY={offsetY?.toNumPoint(2)}>

            {renderPrefixSups()}
            {renderTopDecorators()}
            
            {renderNote()}
            {composeArray(notation.dotted).map((n, i) => (
                <circle
                    key={i}
                    type="dot"
                    cx={P.xWidth +  8*(i)}
                    cy="-2"
                    r="2"
                    fill="currentColor"
                ></circle>))}
            {renderOctave()}
        </Range>
    );
}

const tempNote: ComponentStory<typeof RNote> = (args) => <svg>  <RNote
    key={pos++}
    offsetX={60}
    offsetY={50}
    w={20}
    h={22}
    notation={createNote({})}
/>
</svg>;
export const TempNote = tempNote.bind({});






//function NParagraph({ paragraph, offsetY, alignJustify }) {

interface RParagraphProps {
        paragraph?: any,
        offsetX?: number,
    offsetY?: number,
    alignJustify?:boolean
    }

const RParagraph: React.FC<RParagraphProps> = ({
    paragraph,  offsetX, offsetY, alignJustify
}: RParagraphProps) => {

    console.log("RParagraph1 -->");
    console.log(paragraph);
    const notations = paragraph.notations || [];
    console.log("RParagraph2");
    const widthCache = [];
    let itemFlexOffset = 0;
    //if (alignJustify && paragraph.notations?.length > 1) {
    //    const realWidth = calcParagraphWidth(paragraph);
    //    itemFlexOffset =
    //        (P.maxContentWidth - realWidth) / (paragraph.notations.length - 1);
    //}

    return (
        <Range clazz="Pagen" type="paragraph" offsetY={offsetY}>

            {paragraph.notations.map((n, i) => (
                <RNote
                    key={n.key}
                    notation={n}
                    offsetX={100+i * 30}
                    offsetY={100}
                />
            ))}
            
        </Range>
    );
    //return (
    //    <Range clazz="Pagen" type="paragraph" offsetY={offsetY}>
    //        {renderParagraphMask()}
    //        {renderTies()}
    //        {paragraph.notations.map((n, i) => (
    //            <RNote
    //                key={n.key}
    //                notation={n}
    //                paragraph={paragraph}
    //                offsetX={noteOffsets[i]}
    //            />
    //        ))}
    //        {renderUnderlines()}
    //    </Range>
    //);
}
const tempParag: ComponentStory<typeof RParagraph> = (args) => <svg>  <RParagraph 
    paragraph={createParagraphWithNotations()}
/>
</svg>;
export const TempParage = tempParag.bind({});