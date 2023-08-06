import React from "react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import state from "./global/state";
import { wrappedAction } from "./global/history";
import Styles from "./txViewText.module.css";
import Codec from "./Codec";
import Selector, { SelectionRow, SelectionNote } from './txSelector'


let paragraphs: IMeasure = {
    rows: [{
        key: 'l_1239485',
        notes: [
            { key: 'n_1129074', n: '6', color: '#527' },
            { key: 'n_1229074', n: '1', color: '#520' },
            { key: 'n_1329074', n: '2', color: '#527' },
            { key: 'n_1429074', n: '5', color: '#f0f' },
            { key: 'n_1529074', n: '2', color: '#527' },
            { key: 'n_1629074', n: '0', color: '#cc7' }]
    }, {
        key: 'l_34539485',
        notes: [
            { key: 'n_2122071', n: '3', color: '#527' },
            { key: 'n_2222072', n: '3', color: '#520' },
            { key: 'n_2322073', n: '6', color: '#527' },
            { key: 'n_2422074', n: '5', color: '#0ff' },
            { key: 'n_2522075', n: '1', color: '#527' },
            { key: 'n_2622276', n: '7', color: '#cc7' }]
    }, {
        key: 'l_56539485',
        notes: [
            { key: 'n_3123074', n: '2', color: '#527' },
            { key: 'n_3223074', n: '4', color: '#520' },
            { key: 'n_3323074', n: '6', color: '#527' },
            { key: 'n_3423074', n: '3', color: '#0f3' },
            { key: 'n_3523074', n: '1', color: '#527' },
            { key: 'n_3623074', n: '9', color: '#cc7' }]
    }
    ]
}

export interface INote {
    key?: string;
    type?: string;
    n: string;
    note?: string;
    color?: string;
}

export interface IRow {
    key?: string;
    // 符号列表
    notes: INote[] | null;
    type?: string;
    // 是否两端对齐
    alignJustify?: boolean;
}

export interface IMeasure {
    key?: string;
    // 符号列表
    rows: IRow[] | null;
    type?: string;
    // 是否两端对齐
    alignJustify?: boolean;
}

function renderSubText(vNote: VNote) {
    //const handleClick2 = wrappedAction(() => {
    //    state.selectedNotationKey = notation.key;
    //    state.shouldNotationBlurAfterClick = false;
    //    placeTie(notation);
    //});

    const handleClick = (ev) => {

        Selector.instance.selectNote(vNote)
        console.log(`isSelect ${vNote.n}  ${vNote.isSelect} ${vNote.key}`)
        state.selectedNotationKey = vNote.key;
        state.shouldNotationBlurAfterClick = false;
        console.log(" handleClick = wrappedAction==>\n" +
            state.selectedNotationKey + " : " + vNote.key);
    }
    console.log(`rst ${vNote.n}`)
    return (
        <text
            onClick={(ev) => { wrappedAction(`click ${vNote.n} ${vNote.key}`, () => { handleClick(ev) })() }}
            //onClick={handleClick}
            fontSize={20}
            x={vNote.x} y={vNote.y}
            className={
                //state.selectedNotationKey === vNote.key
                vNote.isSelect
                    ? Styles.selectedNotation123
                    : ""
            }>
            {vNote.n}
        </text>
    )
}


export class VNote implements Codec, SelectionNote {
    @observable iNote: INote;
    @observable parentRow: VRow | null;
    @observable key: string;
    @observable type: string;
    @observable n: string;
    @observable x: number;
    @observable y: number;
    @observable t: number;
    @observable l: number = 0;//這拍子長短，4分音符 1線，8分音符 2線，6分音符 3線
    @observable p: number = 0;//畫附點音附 的個數
    @observable d: number = 0;//這有數字越大 空白 越少?? 不知道
    @observable color: string;
    @observable index: number;
    @observable isSelect: boolean = false;
    @observable isMove: boolean = false;
    constructor(o: INote, row: VRow, index: number) {
        this.index = index;
        this.iNote = o;
        this.parentRow = row;
        this.decode(o);
    }
    setIsMove(s: boolean) {
        this.isMove = s;
    }
    setSelect(s: boolean) {
        this.isSelect = s;
    }
    setNum(n: string) {
        this.n = n;
    }
    addSubNote(index: number) {

    }
    removeSubNote(index: number) {

    }
    reducePoint(h: number) {
        this.t += h;
    }
    /** 下拍子線設定 幾個 */
    reduceLine(l: number) {
        this.l += l;
        if (this.l < 0) {
            this.l = 0;
        }
    }
    /** 附點音符設定 幾個 */
    reduceTailPoint(p: number) {
        this.p += p;
        if (this.p < 0) {
            this.p = 0;
        }
    }
    getThis() {
        return this;
    }

    decode(o: INote): void {
        if (o.n !== undefined) {
            this.n = o.n;
            this.key = o.key
            this.type = o.type
        }
    }
    decodeGlobal(o: INote): void {
        if (o.n !== undefined) {
            this.n = o.n;
            this.key = o.key
            this.type = o.type
        }
    }
    code() {
        return {
            key: this.key,
            type: this.type,
            n: this.n,
            note: this.n
        };
    }
}


@observer
class ViewNote extends React.Component<{ vNote: VNote }> {
    render() {
        let clazz = "ViewNote";
        return (
            <g
                className={clazz}
            >{
                    renderSubText(this.props.vNote)
                }
            </g>
        );
    }
}



export class VRow implements Codec, SelectionRow {
    //readonly config: MuseConfig;
    @observable key: string;
    @observable index: number;
    @observable notes: VNote[] = [];
    @observable iRow: IRow = null;

    @observable parentMeasure: IMeasure = null;
    @observable isMove: boolean = false;
    @observable isSelect: boolean = false;
    @computed get x(): number {       //return this.measure.rowsX[this.index];
        return 0;
    }
    @computed get y(): number {
        return 0//this.measure.rowsY[this.index];

    }
    constructor(o: IRow, measure: IMeasure, index: number) {
        this.iRow = o;
        this.index = index;
        this.parentMeasure = measure;
        this.decode(o);
    }
    setIsMove(s: boolean) {
        this.isMove = s;
    }
    setSelect(i: boolean) {
        this.isSelect = i;
    }
    getThis() {
        return this;
    }
    addNote(index: number) {

    }
    removeNote(index: number) {

    }
    decode(o: IRow): void {
        if (o.notes !== undefined) {
            o.notes.forEach((it: INote, idx) => {
                //this.noises.push(new Noise(it, this, idx));
                this.notes.push(new VNote(it, this, idx));
            });
        }
    }
    decodeGlobal(o: IRow): void {
        const ths = this;
        if (o.notes !== undefined) {
            o.notes.forEach((it, idx) => {
                if (ths.notes.length >= idx) {
                    ths.notes[idx].decodeGlobal(it);
                }
                else
                    ths.notes.push(new VNote(it, ths, idx));
            })
            if (this.notes.length > o.notes.length)
                this.notes.slice(o.notes.length)
        }
    }

    code(): IRow {
        let notes: INote[] = this.notes.map((it) => it.code());
        return { notes };
    }
}


@observer
class ViewRow extends React.Component<{ vRow: VRow }> {

    render() {
        let clazz = "ViewRow";
        return (
            <g
                className={clazz}
                width='400'
                height='300'
            >{this.props.vRow.notes.map((it, idx, par) => {
                it.x = 40 + 40 * idx;
                it.y = 0;
                return (
                    <ViewNote key={idx} vNote={it} />
                )
            })}
            </g>
        );
    }
}




export class Measure {
    @observable iMeasure: IMeasure;
    @observable key: string;
    @observable rows: VRow[] = [];
    @observable parent: {};
    @observable n: string;
    @observable x: number;
    @observable y: number;
    @observable color: string;
    @observable index: number;
    @observable isSelect: boolean = false;
    @observable isMove: boolean = false;
    constructor(o: IMeasure, index: number) {
        this.index = index;
        this.iMeasure = o;
        this.decode(o);
    }

    decode(o: IMeasure): void {
        const t: IMeasure = {
            type: "notation",
            key: `n_${String(Math.random())}`,
            rows: []
        };
        if (o) {
            Object.assign(t, o);
        }

        if (o.rows !== undefined) {
            o.rows.forEach((it, idx) => {
                this.rows.push(new VRow(it, this, idx));
            })
        }
    }
    decodeGlobal(o: IMeasure): void {
        const ths = this;
        if (o.rows !== undefined) {
            o.rows.forEach((it, idx) => {
                if (ths.rows.length >= idx) {
                    ths.rows[idx].decodeGlobal(o.rows[idx]);
                }
                else {
                    ths.rows.push(new VRow(o.rows[idx], ths, idx));
                }
            })
            if (this.rows.length > o.rows.length)
                this.rows.slice(o.rows.length)
        }
    }
    code(): IMeasure {
        let rows: IRow[] = this.rows.map((it) => it.code());
        return { rows };
    }
}

@observer
class ViewMeasure extends React.Component<{ vMeasure: Measure }> {

    render() {

        let clazz = "ViewMeasure";
        return (
            <g
                className={clazz}
                width='400'
                height='1300'
            >{this.props.vMeasure.rows.map((it, idx) => {
                return (<g key={idx}
                    transform={
                        "translate(" + (40) + "," + (40 + 40 * idx) + ")"
                    }>
                    <ViewRow vRow={it} />
                </g>
                )
            })}
            </g>
        );
    }
}
class globalData {
    static ViewMeasure = new Measure(paragraphs, 1)
}
//let globalMeasure = () => { return new Measure(paragraphs, 1) }
const globaldata = new globalData()
export const getStoreCode = () => {

    return { 'paragraphs': globalData.ViewMeasure.code() }
}
export const globalDecode = (gStory: IMeasure) => {
    globalData.ViewMeasure.decodeGlobal(gStory)
}
export let globalStore = getStoreCode()

const GlobalContext = React.createContext(globalStore);


export const ViewTextApp: React.FC<{}> = () => {
    return (<GlobalContext.Provider value={globalStore}>
        <ViewMeasure vMeasure={globalData.ViewMeasure} />
    </GlobalContext.Provider>
    )
}

export default ViewMeasure;
