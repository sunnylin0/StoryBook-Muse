import React from "react";
import { Border, OuterBorder } from "./Border";
import MuseConfig from "./MuseConfig";
import IBar from "./MuseBar";
import Codec from "./Codec";
import Fraction from "./Fraction";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import Selector, { SelectionNote, SelectionSubNote } from "./Selector";
import { Bar } from "./MuseBar";
import Range from "./Range";





export interface INote {
    n: string;
    type?: string;
    key?: string;
    note?: string;
    octave?: number;
    dotted?: boolean;
    underline?: number;
    breakUnderline?: boolean;
    prefixSups?: any;
    topDecorators?: any;
    tieTo?: any;
}
export class createNote implements INote {
    n = "6--0@0394";
    type = "notation";
    key = `n_${String(Math.random())}`;
    note = "0";
    octave= 0;
    dotted: false;
    underline: 0;
    breakUnderline: false;
    prefixSups: [];
    topDecorators: [];
    tieTo: null;
}


export class SubNote implements SelectionSubNote {
    readonly config: MuseConfig;
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
        config: MuseConfig
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
    reduceLine(l: number) {
        this.note.l += l;
        if (this.note.l < 0) {
            this.note.l = 0;
        }
    }
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

export class Note implements Codec, SelectionNote {
    readonly config: MuseConfig;
    @observable index: number;
    @observable bar: Bar;
    @observable subNotes: SubNote[] = [];
    @observable isSelect: boolean = false;
    @observable l: number = 0;
    @observable p: number = 0;
    @observable d: number = 0;
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
                        let x = this.config.pointGap;
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
        return this.bar.notesX[this.index];
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
    constructor(o: INote, bar: Bar, idx: number) {
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
        let cnote = createNote;
        return { n };
    }
}

function castX(x: string) {
    let m: Record<string, string> = {
        S: "#",
        F: "b",
        DS: "x",
        DF: "d",
        N: "n",
    };
    return m[x] || "";
}

/**
 * �e���׭��I
 * @param note.pointsY  Y �b����m
 * @param clazz
 */
const pointGroup=(note: Note, clazz: string)=> {
    return (
        <g className={clazz + "__group-point"}>
            {note.pointsY.map((it, idx) => (
                <circle
                    key={idx}
                    r={note.config.pointRound}
                    fill="black"
                    transform={
                        "translate(" +
                        (note.dx + note.config.noteWidth / 2) +
                        "," +
                        (note.height - it + note.config.pointGap / 2) +
                        ")"
                    }
                />
            ))}
        </g>
    );
}

/**
 * �e���I����
 * @param note
 * @param clazz
 */
function tailPoint(note: Note, clazz: string) {
    return (
        <g className={clazz + "__tail-point"}>
            {note.tailPointsX.map((it, idx) => (
                <circle
                    key={idx}
                    r={note.config.pointRound}
                    fill="black"
                    transform={
                        "translate(" +
                        it +
                        "," +
                        (note.height - note.config.noteHeight / 3) +
                        ")"
                    }
                />
            ))}
        </g>
    );
}

interface SoundSubNoteProps {
    dx: number;
    y: number;
    w: number;
    h: number;
    subNote: SubNote;
}

export const SoundSubNote = observer((props: SoundSubNoteProps) => {
//observer(
//function MuseSubNote(props: MuseSubNoteProps) {
    return (
        <g
            className={"muse-note__subnote"}
            transform={"translate(" + 0 + "," + props.y + ")"}
            width={props.w}
            height={props.h}
            onClick={() => {
                Selector.instance.selectSubNote(props.subNote);
            }}
        >
            <text
                fontFamily={props.subNote.config.noteFontFamily}
                fontSize={props.subNote.config.noteFontSize}
                transform={"translate(" + props.dx + "," + 0 + ")"}
            >
                {props.subNote.n}
            </text>
            <text
                fontFamily={props.subNote.config.noteFontFamily}
                fontSize={props.subNote.config.sigFontSize}
                transform={
                    "translate(" +
                    0 +
                    "," +
                    (props.subNote.config.sigFontSize -
                        props.subNote.config.noteHeight) +
                    ")"
                }
            >
                {castX(props.subNote.x)}
            </text>
            <Border
                x={0}
                y={-props.h}
                w={props.w}
                h={props.subNote.config.noteFontSize}
                clazz={"muse-note__subnote"}
                show={props.subNote.isSelect}
            />
        </g>
    );
}

    )

observer
function SoundNote( props:any ) {    
        let clazz = "muse-note";
    return (
            <g
                className={clazz}
                transform={"translate(" + props.note.x + "," + 0 + ")"}
                width={props.note.width}
                height={props.note.height}
                onClick={() => {
                    Selector.instance.selectNote(props.note);
                }}
            >
                <OuterBorder
                    w={props.note.width}
                    h={props.note.height + props.note.marginBottom}
                    clazz={clazz}
                    show={props.note.isSelect}
                    color={"blue"}
                />
                {props.note.subNotes.map((it:any, idx:number) => (
                    <SoundSubNote
                        key={idx}
                        dx={props.note.dx}
                        y={props.note.height - props.note.notesY[idx]}
                        w={props.note.width}
                        h={22}
                        subNote={it}
                    />
                ))}
                {pointGroup(props.note, clazz)}
                {tailPoint(props.note, clazz)}
            </g>
        );
    
}

export default observer(SoundNote);
