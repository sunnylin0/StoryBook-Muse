import React from "react";
//import MuseConfig from "./MuseConfig";
import SoundNote, { INote, Note } from "./SoundNote";
import { Border } from "./Border";
import Codec from "./Codec";

import { computed, observable } from "mobx";
import { observer, useObserver } from "mobx-react";
import Fraction from "./Fraction";
//import { Track } from "./MuseTrack";
//import { SelectionBar } from "./Selector";

import gStore, { SoundConfig } from "./SoundConfig"

interface Baseline {
    y: number;
    s: number;
    e: number;
}

export interface IRow {
    notes: INote[];
}

export class Row implements Codec {
    readonly config: SoundConfig;
    @observable index: number;
    @observable track: any;//Track;
    @observable notes: Note[] = [];
    @observable isSelect: boolean = false;
    @computed get width(): number {
        let ww = (this.track ? 0 : 1);
        return ww;
        //return this.track.barsWidth[this.index];
    }
    @computed get height(): number {
        let h = 0;
        this.notes.forEach((it) => {
            let u = it.height + it.marginBottom;
            h = u > h ? u : h;
        });
        return h;
    }
    @computed get x(): number {
        let ww = (this.track ? 0 : 1);
        return ww;
        //return this.track.barsX[this.index];
    }
    @computed get y(): number {
        return 0;
    }
    @computed get notesTime(): Fraction[] {
        return this.notes.map((it) => it.time);
    }
    @computed get notesTimeSum(): Fraction {
        return this.notesTime
            .reduce((a, b) => a.plus(b), new Fraction())
            .plus(new Fraction().init(1, 1));
    }
    @computed get notesWidth(): number[] {
        return this.notes.map((it) => it.width);
    }
    @computed get notesX(): number[] {
        let space = this.width - this.notesWidthSum;
        let unit = new Fraction().init(space, 1).divide(this.notesTimeSum);
        let x = unit.toNumber();
        return this.notesWidth.map((it, idx) => {
            let r = x;
            x += it + this.notesTime[idx].multiply(unit).toNumber();
            return r;
        });
    }
    @computed get preNotesMaxHeight(): number {
        return Math.max(...this.notes.map((it) => it.preHeight));
    }
    @computed get notesMaxHeight(): number {
        let ww = (this.track ? 0 : 1);
        return ww;
        //return this.track.notesMaxHeight;
    }
    @computed get preNotesMaxMarginBottom(): number {
        return Math.max(...this.notes.map((it) => it.preMarginBottom));
    }
    @computed get notesMaxMarginBottom(): number {
        let ww = (this.track ? 0 : 1);
        return ww;
        //return this.track.notesMaxMarginBottom;
    }
    @computed get baselineGroup(): Baseline[] {
        let r: {
            y: number;
            s: number;
            e: number;
        }[] = [];
        for (let i = 0; ; ++i) {
            let x = 0;
            let s = 0;
            let e = -1;
            this.notes.forEach((it, idx) => {
                if (it.l > i) {
                    e = idx;
                    x++;
                } else {
                    if (s <= e) r.push({ y: i, s: s, e: e });
                    s = idx + 1;
                    e = idx;
                }
            });
            if (s <= e) r.push({ y: i, s: s, e: e });
            if (x === 0) {
                break;
            }
        }
        return r;
    }
    @computed get notesWidthSum(): number {
        let w = 0;
        this.notes.forEach((it) => (w += it.width));
        return w;
    }

    constructor(o: IRow, index: number, config: SoundConfig = null) {
        this.index = index;
        this.decode(o);
        this.config = config;
    }
    addNote(index: number) {
        this.notes.splice(index, 0, new Note({ n: "0" }, this, this.notes.length));
        this.notes.forEach((it, idx) => (it.index = idx));
    }
    removeNote(index: number) {
        this.notes = this.notes.filter((it, idx) => idx !== index);
        this.notes.forEach((it, idx) => (it.index = idx));
    }
    setSelect(i: boolean) {
        this.isSelect = i;
    }
    getThis() {
        return this;
    }
    decode(o: IRow): void {
        if (o.notes !== undefined) {
            o.notes.forEach((it: INote, idx) => {
                this.notes.push(new Note(it, this, idx));
            });
        }
    }
    code(): IRow {
        let notes: INote[] = this.notes.map((it) => it.code());
        return { notes };
    }
}
/** 繪小節線 */
const BarLine: React.FC<{ w: number; h: number; clazz: string }> = (props: {
    w: number;
    h: number;
    clazz: string;
}) => {
    let [width, height] = useObserver(() => {
        return [props.w, props.h];
    });
    return (
        <line
            className={props.clazz + "__bar-line"}
            x1={width}
            y1={0}
            x2={width}
            y2={height}
            strokeWidth={1}
            stroke="black"
        />
    );
};
/** 繪拍子線 */
const BaseLine: React.FC<{ bar: Row; clazz: string }> = ({
    bar,
    clazz,
}: {
    bar: Row;
    clazz: string;
}) => {
    let [baselineGroup, notes] = useObserver(() => {
        return [bar.baselineGroup, bar.notes];
    });
    return (
        <g className={clazz + "__base-line"}>
            {baselineGroup.map((it, idx) => (
                <line
                    key={idx}
                    x1={notes[it.s].x}
                    y1={notes[it.s].height + (it.y + 1) * gStore.lineGap}
                    x2={notes[it.e].x + bar.notes[it.e].width}
                    y2={notes[it.s].height + (it.y + 1) * gStore.lineGap}
                    stroke={"black"}
                    strokeWidth={1}
                />
            ))}
        </g>
    );
};

@observer
class SoundRow extends React.Component<{ row: Row }, {}> {
    render() {
        let notes = this.props.row.notes;
        let clazz = "muse-bar";
        return (
            <g
                className={clazz}
                transform={
                    "translate(" + this.props.row.x + "," + this.props.row.y + ")"
                }
                width={this.props.row.width}
                height={this.props.row.height}
            >
                <Border
                    w={this.props.row.width}
                    h={this.props.row.height}
                    x={0}
                    y={0}
                    clazz={clazz}
                    show={this.props.row.isSelect}
                />
                <BarLine
                    w={this.props.row.width}
                    h={this.props.row.height}
                    clazz={clazz}
                />
                {notes.map((it, idx) => (
                    <SoundNote key={idx} note={it} dx={100 + 40*idx} y={100} w={20} h={20}/>
                ))}
                <BaseLine bar={this.props.row} clazz={clazz} />
            </g>
        );
    }
}

export default SoundRow;
