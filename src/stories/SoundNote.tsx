
import React from "react";
import { Border, OuterBorder } from "./Border";
import Text from './Text';
import Range from './Range';
//import { SoundSubNote, createNote } from './SoundNote'
import './util/string.extensions'
import P, { calcSubTextWidth } from "./util/placement";



import SoundBar,{Row, IRow } from "./SoundRow";
import Codec from "./Codec";
import Fraction from "./Fraction";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import Selector, { SelectionNote, SelectionSubNote } from "./Selector";

import gStore,{SoundConfig} from "./SoundConfig";


const enum notationss {
    zero = "0",
    do = "1",
    re = "2",
    mi = "3",
    fa = "4",
    sol = "5",
    la = "6",
    si = "7",
    extend = "─",
    separator = "│",
    crackerOpen = "(",
    crackerClose = ")",
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
    tieTo?: { type: "start" | "stop"; num: number };       //連音線開始 結束
    slurTo?: { type: "start" | "stop"; num: number };   //圓滑線開始 結束
}


/** 創建音符號 */
export function createNote(initial?: INote): INote {
    const clarDuration = (it: INote): number => {
        let noteLen = 480;
        if (it.underline > 0) {
            noteLen = noteLen / (it.underline * 2);
        }
        //計算附點的長度，每點除 2
        if (it.dotted > 0) {
            let ln: number = noteLen;
            for (var k = 0; k < it.dotted; k++) {
                ln = ln / 2;
                noteLen = noteLen + ln;
            }
        }
        return noteLen.toNumPoint(2);
    }
    // 初始值
    const n: INote = {
        n: "6--2@0",
        type: "notation",

        key: `n_${Math.random().toString(36).substring(6)}`,//從第6個字開始抓，所以是13 - 6 = 7 個隨機數字+字母
        note: "6",
        octave: -2,     //高低音個數

        dotted: 1,      //附點音個數
        duration: 0,
        underline: 2,   //下拍線個數
        breakUnderline: false,
        fingering: ["shake", "shake"],
        prefixSups: ["♯", "ｂ"],
        topDecorators: ["5", "4", "0"],
        tieTo: null,
    };
    n.duration = clarDuration(n);
    if (initial) {
        Object.assign(n, initial);
    }
    return n;
}


/** 創建 新段落 */
export function createParagraph(initial) {
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

export class SubNote  {
    readonly config: SoundConfig;
    @observable isSelect = false;
    @observable note: Note;
    @observable index: number;
    @observable x: string = "";
    @observable n: string = "";
    @observable t: number = 0;
    constructor(
        x: string,
        n: string,
        t: number,
        note: Note,
        index: number,
        config?: SoundConfig
    ) {
        this.x = x;
        this.n = n;
        this.t = t;
        this.note = note;
        this.index = index;
        this.config = config;
    }
    setSelect(s: boolean) {
        this.isSelect = s;
    }
    setNum(n: string) {
        this.n = n;
    }
    reducePoint(h: number) {
        this.t += h;
    }
    /** 下拍子線設定 幾個 */
    reduceLine(l: number) {
        this.note.l += l;
        if (this.note.l < 0) {
            this.note.l = 0;
        }
    }
    /** 附點音符設定 幾個 */
    reduceTailPoint(p: number) {
        this.note.p += p;
        if (this.note.p < 0) {
            this.note.p = 0;
        }
    }
    getThis() {
        return this;
    }
}


export class Note implements Codec  {
    readonly config: SoundConfig;
    @observable index: number;
    @observable bar: Row;
    @observable subNotes: SubNote[] = [];
    @observable isSelect: boolean = false;
    @observable l: number = 0;//這拍子長短，4分音符 1線，8分音符 2線，6分音符 3線
    @observable p: number = 0;//畫附點音附 的個數
    @observable d: number = 0;//這有數字越大 空白 越少?? 不知道
    @computed get dx(): number {
        let dxx = false;
        this.subNotes.forEach((it) => {
            if (it.x !== "") {
                dxx = true;
            }
        });
        return dxx ? this.config.sigFontSize / 2 : 0;
    }
    @computed get time(): Fraction {
        let r = new Fraction();
        r.u = 1;
        r.d *= Math.pow(2, this.l);
        r.d *= this.d;
        r.d *= Math.pow(2, this.p); //3/2 7/4 15/8
        r.u *= Math.pow(2, this.p + 1) - 1;
        return r.simplify();
    }
    @computed get notesY(): number[] {
        let r: number[] = [];
        let ny = 0;
        this.subNotes.forEach((it, idx) => {
            if (it.t < 0) {
                if (idx !== 0) {
                    let i = -it.t;
                    for (; i > 0; --i) {
                        let x = gStore.pointGap;
                        ny += x;
                    }
                }
            }
            r.push(ny);
            let h = this.config.noteHeight;
            ny += h;
            if (it.t > 0) {
                let i = it.t;
                for (; i > 0; --i) {
                    let x = this.config.pointGap;
                    ny += x;
                }
            }
        });
        return r;
    }
    @computed get pointsY(): number[] {
        let r: number[] = [];
        let py = 0;
        let ny = 0;
        let mb = 0;
        mb += this.l * this.config.pointGap;
        this.subNotes.forEach((it, idx) => {
            if (it.t < 0) {
                if (idx === 0) {
                    let i = -it.t;
                    for (; i > 0; --i) {
                        let x = this.config.pointGap;
                        mb += x / 2;
                        r.push(-mb);
                        mb += x / 2;
                    }
                }
                if (idx !== 0) {
                    let i = -it.t;
                    for (; i > 0; --i) {
                        let x = this.config.pointGap;
                        py += x / 2;
                        r.push(py);
                        py += x / 2;
                        ny += x;
                    }
                }
            }
            this.notesY.push(ny);
            let h = this.config.noteHeight;
            ny += h;
            py += h;
            if (it.t > 0) {
                let i = it.t;
                for (; i > 0; --i) {
                    let x = this.config.pointGap;
                    py += x / 2;
                    r.push(py);
                    py += x / 2;
                    ny += x;
                }
            }
        });
        return r;
    }
    /** 畫附點音附 的個數 */
    @computed get tailPointsX(): number[] {
        let r: number[] = [];
        for (let i = 0; i < this.p; ++i) {
            r.push(
                this.dx + this.config.noteWidth + (i + 1 / 2) * this.config.tailPointGap
            );
        }
        return r;
    }
    @computed get width(): number {
        return this.dx + this.config.noteWidth + this.p * this.config.tailPointGap;
    }
    @computed get preHeight(): number {
        let h = 0;
        this.subNotes.forEach((it, idx) => {
            if (it.t < 0) {
                if (idx !== 0) {
                    let i = -it.t;
                    for (; i > 0; --i) {
                        let x = this.config.pointGap;
                        h += x;
                    }
                }
            }
            h += this.config.noteHeight;
            if (it.t > 0) {
                let i = it.t;
                for (; i > 0; --i) {
                    let x = this.config.pointGap;
                    h += x;
                }
            }
        });
        return h;
    }
    @computed get height(): number {
        return this.bar.notesMaxHeight;
    }
    @computed get x(): number {
        return 0;
    }
    @computed get preMarginBottom(): number {
        let mb = 0;
        mb += this.l * this.config.pointGap;
        this.subNotes.forEach((it, idx) => {
            if (it.t < 0) {
                if (idx === 0) {
                    let i = -it.t;
                    for (; i > 0; --i) {
                        let x = this.config.pointGap;
                        mb += x;
                    }
                }
            }
        });
        return mb;
    }
    @computed get marginBottom(): number {
        return this.bar.notesMaxMarginBottom;
    }
    constructor(o: INote, bar: Row=null, idx: number=0) {
        this.config = bar.config;
        this.bar = bar;
        this.index = idx;
        this.decode(o);
    }
    setSelect(s: boolean) {
        this.isSelect = s;
    }
    reduceLine(l: number) {
        this.l += l;
        if (this.l < 0) {
            this.l = 0;
        }
    }
    reduceTailPoint(p: number) {
        this.p += p;
        if (this.p < 0) {
            this.p = 0;
        }
    }
    addSubNote(index: number) {
        this.subNotes.splice(
            index,
            0,
            new SubNote("", "0", 0, this, this.subNotes.length, this.config)
        );
        this.subNotes.forEach((it, idx) => (it.index = idx));
    }
    removeSubNote(index: number) {
        this.subNotes = this.subNotes.filter((it, idx) => idx !== index);
        this.subNotes.forEach((it, idx) => (it.index = idx));
    }
    getThis() {
        return this;
    }
    decode(o: INote): void {
        if (o.n !== undefined) {
            let n: string = o.n;
            let pos = n.search("@");
            let ns = "";
            let ts = "";
            if (pos === -1) {
                ns = n;
                ts = "0|0";
            } else {
                ns = n.substr(0, pos);
                ts = n.substr(pos + 1);
            }
            let ng = ns.split("|");
            ng.forEach((it, idx) => {
                for (let i = 0; i < it.length; ++i) {
                    if (
                        (it.charCodeAt(i) <= 57 && it.charCodeAt(i) >= 48) ||
                        it.charCodeAt(i) === 45
                    ) {
                        let x = it.substr(0, i);
                        let n = it.charAt(i);
                        let t = it.substr(i + 1).length;
                        if (t !== 0 && it.charAt(i + 1) === "-") {
                            t = -t;
                        }
                        this.subNotes.push(new SubNote(x, n, t, this, idx, this.config));
                        break;
                    }
                }
            });
            let tg = ts.split("|");
            if (tg.length === 3) {
                this.l = parseInt(tg[0]);
                this.p = parseInt(tg[1]);
                this.d = parseInt(tg[2]);
            } else if (tg.length === 2) {
                this.l = parseInt(tg[0]);
                this.p = parseInt(tg[1]);
                this.d = 1;
            } else if (tg.length === 1) {
                this.l = parseInt(tg[0]);
                this.p = 0;
                this.d = 1;
            } else {
                this.l = 0;
                this.p = 0;
                this.d = 1;
            }
        }
    }
    code(): INote {
        let ns: string = "";
        this.subNotes.forEach((it, idx) => {
            let t = "";
            if (it.t > 0) {
                for (let i = 0; i < it.t; ++i) {
                    t += "+";
                }
            } else {
                for (let i = 0; i < -it.t; ++i) {
                    t += "-";
                }
            }
            if (idx + 1 >= this.subNotes.length) {
                ns += `${it.x}${it.n}${t}`;
            } else {
                ns += `${it.x}${it.n}${t}|`;
            }
        });
        let n = `${ns}@${this.l}|${this.p}`;
        return { n };
    }
}



interface SoundRNoteProps {
    offsetX?: number;
    offsetY?: number;
    w?: number;
    h?: number;
    notation: INote;
}

const SoundRNote: React.FC<SoundRNoteProps> = ({
    offsetX = 0, offsetY = 0, w, h, notation
}: SoundRNoteProps) => {

    const enum FingEnum {
        shake = "shake",
        wheel = "wheel"
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

    /** 繪前綴文字  */
    const renderPrefixSups = () => {
        const sups = notation.prefixSups || [];
        const rendered = sups.map((s, i) => {
            let props = {}
            return (<Text
                key={i + s}
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={gStore.defaultSubFontSize}
                fontFamily={gStore.defaultFontFamily}
                x={-P.xWidth - (calcSubTextWidth(sups.slice(0, i).join("")) + 2 * i)}
                y={-P.subXHeight / 2 + 2}
            >
                {s}
            </Text>);
        });
        return rendered;
    };

    /** 繪上綴音符 */
    const renderTopDecorators = () => {
        const decs = notation.topDecorators || [];
        const rendered = decs.map((d, i) => (
            <Text
                key={i + d}
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={gStore.noteSubFontSize}
                fontFamily={gStore.noteFontFamily}
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
    function composeArray(octave: number | string): Array<number> | null {
        const len = Math.abs(Number(octave));
        if (!Number.isInteger(len)) {
            return [];
        }
        return Array(len).fill(0, 0, len);
    }

    /** 劃指法 */
    const renderFingering = () => {
        const fing = notation.fingering || [];
        const rendered = fing.map((f, i) => (function () {
            switch (f.kind) {
                case FingEnum.shake:
                    console.log('FingEnum.shake.');
                    return (
                        <Text
                            key={i + f}
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize={gStore.defaultSubFontSize}
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
                        fontSize={gStore.defaultSubFontSize}
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
                        fontSize={gStore.noteSubFontSize}
                        y={topDecoratorOffset - (i + 1) * P.subXHeight + 2}>
                        {f}
                    </Text >);
            }
        }


        ));
        return rendered;
    };

    /** 畫本音附 01234567 */
    const renderNote = () => {
        let transform;
        let props: any;

        if (notation.note === "string") {//notations.extend) {
            // 延音符太长了缩短一点
            console.log("transform scale(0.8, 1)");
            transform = "scale(0.8, 1)";
        }
        props = {
            dominantBaseline: "middle",
            textAnchor: "middle",
            fontSize: gStore.noteFontSize,
            fontFamily: gStore.noteFontFamily,
            transform
        }
        console.log("renderNotr");
        return (<g>
            <circle cx="0" cy="0" fill="red" r="1" ></circle>
            <Text {...props}>
                {notation.note}
            </Text>
        </g>
        );
    };

    /** 繪 高八度 / 低八度 */
    const renderOctave = () => {
        return composeArray(notation.octave).map((oc, i) => (
            <g key={ i}>
                <circle
                    key={i}
                    type="octave"
                    cx="0"
                    cy={(octaveInitialOffset + octaveStepOffset * i).toNumPoint(2)}
                    fill="currentColor"
                    r="2"
                ></circle>
                <circle  cx="0" cy="10" fill="red" r="1" ></circle>
            </g>
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
                    cx={P.xWidth + 8 * (i)}
                    cy="-2"
                    r="2"
                    fill="currentColor"
                ></circle>))}
            {renderOctave()}
        </Range>
    );
}



interface SoundNoteProps {
    dx: number;
    y: number;
    w: number;
    h: number;
    note?: Note;
}


observer
function SoundNote(props: SoundNoteProps) {
    const clazz = "Sound-note";
    
    return (
        <g
            className={clazz}
            transform={"translate(" +  props.dx  + "," + props.y + ")"}
            onClick={() => {
               // Selector.instance.selectNote(props.note);
            }}
        >
            <SoundRNote
                offsetX={0}
                offsetY={0}
                w={20}
                h={22}
                notation={  createNote({})}
            />
            
        
            {/*{pointGroup(props.note, clazz)}*/}
            {/*{tailPoint(props.note, clazz)}*/}
        </g>
    );

}

export default SoundNote;

