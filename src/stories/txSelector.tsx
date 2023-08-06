
import { toJS } from 'mobx'
//import { Row, IRow } from "./txMuseRow";
//import { Note, SubNote, INote } from "./txMuseNote";
//import { Note } from 'esbuild';
import { INote, IRow, IMeasure, VNote, VRow, Measure } from "./txViewText";

import {
    go,
    runInWrappedAction,
    unwrappedAction,
    wrappedAction,
} from "./global/history";

export interface SelectionNote {
    setIsMove: (s: boolean) => void;
    setSelect: (i: boolean) => void;
    setNum: (n: string) => void;
    getThis: () => VNote;
    reduceLine: (l: number) => void;
    reduceTailPoint: (p: number) => void;
}

export interface SelectionRow {
    setIsMove: (s: boolean) => void;
    setSelect: (i: boolean) => void;
    getThis: () => any;
    addNote: (index: number) => void;
    removeNote: (index: number) => void;
}

interface globalSateProp {
    selectedNotationKey?: string;
    /** 记录上次选中的符号，之后可恢复焦点 */
    lastSelectedNotationKey?: string;
    selectedNotationObject?: string;
    /** 记录上次选中的符号，之后可恢复焦点 */
    lastSelectedNotationObject?: object;

    /** 当前点击事件是否应该让符号失去焦点。应该在符号自身和菜单等点击事件中将其置为false  */
    shouldNotationBlurAfterClick?: boolean;
    /** 正在操作的连音线起点  */
    tieSourceKey?: string;
    /** 帮助弹窗是否可见  */
    helpDialogVisible?: boolean;
    /** 配置项弹窗是否可见  */
    configDialogVisible?: boolean;
    /** 复制剪贴的内容  */
    clipboardContent?: any;
}

class Selector {

    //subnote: SelectionSubNote | null = null;
    note: SelectionNote | null = null;
    row: SelectionRow | null = null;

    isObjectMove: any | null = null;
    static instance = new Selector();

    selectedNotationKey?: string;
    /** 记录上次选中的符号，之后可恢复焦点 */
    lastSelectedNotationKey?: string;
    selectedNotationObject?: string;
    /** 记录上次选中的符号，之后可恢复焦点 */
    lastSelectedNotationObject?: object;
    /** 当前点击事件是否应该让符号失去焦点。应该在符号自身和菜单等点击事件中将其置为false  */
    shouldNotationBlurAfterClick?: boolean;
    /** 正在操作的连音线起点  */
    tieSourceKey?: string;
    /** 帮助弹窗是否可见  */
    helpDialogVisible?: boolean;
    /** 配置项弹窗是否可见  */
    configDialogVisible?: boolean;
    /** 复制剪贴的内容  */
    clipboardContent?: any;

    private constructor() {
        console.log(`select load keydown addEventlist`)
        document.addEventListener(
            "keydown", (ev) => {
                wrappedAction(`wAct keyDown ${ev.key} `, () => {
                    console.log(`keydown ${ev.key}`)
                    this.handleKeyDownEventListener(ev)
                })()
            }
        );
    }

    handleKeyDownEventListener(ev) {
        if (!this.keyNote(ev)) {
            if (!this.keyRow(ev)) {
                ev.returnValue = false;
            } else ev.returnValue = false;
        } else ev.returnValue = false;
        this.keyGlobal(ev)
    }
    moveObject(o: any) {
        console.log("moveObject(o: any)");
        this.isObjectMove?.setIsMove(false);
        this.isObjectMove = o;
        this.isObjectMove.setIsMove(true);
    }


    // 创建符号
    createNotation(initial: INote = null): INote {
        const st: INote = {
            type: "notation",
            key: `n_${String(Math.random())}`,
            n: "0@0|0",
            note: '0'
        };
        if (initial) {
            Object.assign(st, initial);
        }
        return st;
    }
    cloneNotation(notation: INote): INote {
        const origin = JSON.parse(JSON.stringify(toJS(notation)));
        delete origin.key;
        const n = this.createNotation(origin);
        return n;
    }



    // 新建段落
    createRow(initial: IRow): IRow {
        const p: IRow = {
            type: "paragraph",
            key: `p_${String(Math.random())}`,
            // 符号列表
            notes: [],
            // 是否两端对齐
            alignJustify: null,
        };
        if (initial) {
            Object.assign(p, initial);
        }
        return p;
    }
    createRowWithNotations(): IRow {
        return this.createRow({
            notes: [
                this.createNotation({ n: "0" }),
                this.createNotation({ n: "0" }),
                this.createNotation({ n: "0" }),
                this.createNotation({ n: "0" }),
                this.createNotation({ n: "|" }),
            ],
        });
    }
    cloneRow(paragraph): IRow {
        const origin = JSON.parse(JSON.stringify(toJS(paragraph)));
        delete origin.key;
        origin.notations = paragraph.notations.map((n) => this.cloneNotation(n));
        return this.createRow(origin);
    }



    keyNote(ev: KeyboardEvent): boolean {
        if (this.note !== null) {
            switch (ev.key) {
                case "Escape":
                    this.note.setSelect(false);
                    this.note = null;
                    this.row?.setSelect(true);
                    return true;
                case "Backspace":

                    return true;
                case " ":
                    return true;

                case "ArrowUp":
                    if (this.row) {
                        let l = this.row.getThis().notes.length;
                        if (l > this.note.getThis().index + 1) {
                            this.note.setSelect(false);
                            this.note = this.row.getThis().notes[
                                this.note.getThis().index + 1
                            ];
                            this.note.setSelect(true);
                        }
                    }
                    return true;
                case "ArrowDown":
                    if (this.row) {
                        if (this.note.getThis().index > 0) {
                            this.note.setSelect(false);
                            this.note = this.row.getThis().notes[this.note.getThis().index - 1];
                            this.note.setSelect(true);
                        }
                    }
                    return true;
                case "ArrowLeft":
                    return true;
                case "ArrowRight":
                    return true;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "-":
                    this.note.setNum(ev.key);
                    return true;

                case "q":
                    this.note.reduceLine(-1);
                    return true;

                default:
                    return false;
            }
        } else return false;
    }

    keyRow(ev: KeyboardEvent): boolean {
        if (this.row !== null) {
            switch (ev.key) {
                case "Enter":
                    if (this.row.getThis().noises.length <= 0) {
                        this.row.addNote(this.row.getThis().noises.length);
                    }
                    this.note = this.row.getThis().noises[0];
                    this.note.setSelect(true);
                    this.row.setSelect(false);
                    return true;
                case "Escape":
                    this.row.setSelect(false);
                    this.row = null;
                    return true;
                case " ":
                    this.row.addNote(this.row.getThis().noises.length);
                    return true;
                case "Backspace":
                    return true;

                default:
                    return false;
            }
        } else return false;
    }


    keyGlobal(ev: KeyboardEvent) {
        const inputKey = ev.key.toLowerCase();
        const shift = ev.shiftKey;
        const ctrl = ev.ctrlKey;
        // 全局
        switch (true) {
            case inputKey === "z" && ctrl && !shift:
                go(-1);
                break;
            case inputKey === "y" && ctrl && !shift:
            case inputKey === "z" && ctrl && shift:
                go(1);
                break;
            case inputKey === "s" && ctrl && !shift: {
                ev.preventDefault();
                //saveFile();
                break;
            }
            case inputKey === "o" && ctrl && !shift: {
                ev.preventDefault();
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json";
                input.onchange = null;// handleOpenFile;
                input.click();
                break;
            }
            case inputKey === "?" && !ctrl: {
                if (this.helpDialogVisible) {
                    this.helpDialogVisible = false;
                } else {
                    this.configDialogVisible = false;
                    this.helpDialogVisible = true;
                }
                break;
            }
            default:
                break;
        }
    }

    selectNote(s: SelectionNote) {
        this.note?.setSelect(false);
        this.note = s;
        this.note.setSelect(true);
    }
    selectRow(s: SelectionRow) {
        this.row?.setSelect(false);
        this.row = s;
        if (this.note === null) this.row.setSelect(true);
    }



}

export default Selector;
