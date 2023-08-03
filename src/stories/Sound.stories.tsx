import React, { Children, MouseEvent } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SoundNote, { createNote } from './SoundNote';
import SoundRow, { Row, IRow } from './SoundRow';
import Sound from './Sound';
import { Border, Make, OuterBorder } from './Border';
//import MuseNoise, { Noise } from './MuseNoise';
//import MuseNotation, { Notation, MuseNotationInfo } from './MuseNotation';
import Text from './Text';
import Range from './Range';
//import { SoundSubNote, createNote } from './SoundNote'
import './util/string.extensions'
import P, { calcSubTextWidth } from "./util/placement";
//import gStore ,{  IinitialData} from "./global/global"
import gStore from "./SoundConfig"





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

const Btn = (args) => {
    return (<input type="button" value="me" {...args} />)
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

const tempRR: ComponentStory<typeof Text> = (args) => <svg>  <Text >3412</Text></svg>;
export const TempTEXT = tempRR.bind({});

gStore.noteFontSize = 40;
gStore.noteSubFontSize = 30;
const tempNote: ComponentStory<typeof SoundNote> = (args) => <svg>
    <SoundNote
        dx={104} y={100} w={44} h={44}
    />
</svg>;

//畫單個音符
export const TempNote = tempNote.bind({});

/** 創建 新段落 */
function createParagraph(initial?) {
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
            createNote({ note: "1" }),
            createNote({ note: "2" }),
            createNote({ note: "3" }),
            createNote({ note: "4" }),
        ],
    });
}




let irow: IRow = {
    notes: [createNote({ note: "0" }),
    createNote({ note: "1" }),
    createNote({ note: "2" }),
    createNote({ note: "3" })]
};
let row = new Row(irow, 3);
//繪一個小節
const tempRow: ComponentStory<typeof SoundRow> = (args) => <svg>
    <SoundRow row={row} />
</svg>;
export const TempRow = tempRow.bind({});



//function nparagraph({ paragraph, offsety, alignjustify }) {

//interface rparagraphprops {
//        paragraph?: any,
//        offsetx?: number,
//    offsety?: number,
//    alignjustify?:boolean
//    }

//const RParagraph: React.FC<RParagraphProps> = ({
//    paragraph,  offsetX, offsetY, alignJustify
//}: RParagraphProps) => {

//    console.log("RParagraph1 -->");
//    console.log(paragraph);
//    const notations = paragraph.notations || [];
//    console.log("RParagraph2");
//    const widthCache = [];
//    let itemFlexOffset = 0;
//    //if (alignJustify && paragraph.notations?.length > 1) {
//    //    const realWidth = calcParagraphWidth(paragraph);
//    //    itemFlexOffset =
//    //        (P.maxContentWidth - realWidth) / (paragraph.notations.length - 1);
//    //}

//    return (
//        <Range clazz="Pagen" type="paragraph" offsetY={offsetY}>

//            {paragraph.notations.map((n, i) => (
//                <RNote
//                    key={n.key}
//                    notation={n}
//                    offsetX={100+i * 30}
//                    offsetY={100}
//                />
//            ))}

//        </Range>
//    );
//    //return (
//    //    <Range clazz="Pagen" type="paragraph" offsetY={offsetY}>
//    //        {renderParagraphMask()}
//    //        {renderTies()}
//    //        {paragraph.notations.map((n, i) => (
//    //            <RNote
//    //                key={n.key}
//    //                notation={n}
//    //                paragraph={paragraph}
//    //                offsetX={noteOffsets[i]}
//    //            />
//    //        ))}
//    //        {renderUnderlines()}
//    //    </Range>
//    //);
//}
//const tempParag: ComponentStory<typeof RParagraph> = (args) => <svg>  <RParagraph 
//    paragraph={createParagraphWithNotations()}
///>
//</svg>;
//export const TempParage = tempParag.bind({});