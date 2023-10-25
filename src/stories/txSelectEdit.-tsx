import React from 'react';
import state from "./global/state";
import { toJS } from "mobx";
import { gStory, IRow, INote } from "./txViewText";

import {
    go,
    runInWrappedAction,
    unwrappedAction,
    wrappedAction,
} from "./global/history";
import { ILine } from './MuseLine';



export interface ISelectData {
    line?: IRow;
    note?: INote;
    lineIndex?: number;
    noteIndex?; number;
}


// 创建符号
function createNotation(initial: INote = null): INote {
    const st: INote = {
        type: "notation",
        key: `n_${String(Math.random())}`,
        n: "0",
        color: '#000'
    };
    if (initial) {
        Object.assign(st, initial);
    }
    return st;
}
function cloneNotation(notation: INote): INote {
    const origin = JSON.parse(JSON.stringify(toJS(notation)));
    delete origin.key;
    const n = createNotation(origin);
    return n;
}



// 新建段落
function createParagraph(initial: IRow): IRow {
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
function createParagraphWithNotations(): IRow {
    return createParagraph({
        notes: [
            createNotation({ n: "0" }),
            createNotation({ n: "0" }),
            createNotation({ n: "0" }),
            createNotation({ n: "0" }),
            createNotation({ n: "|" }),
        ],
    });
}
function cloneParagraph(paragraph) {
    const origin = JSON.parse(JSON.stringify(toJS(paragraph)));
    delete origin.key;
    origin.notations = paragraph.notations.map((n) => cloneNotation(n));
    return createParagraph(origin);
}


// 根据key查找符号在全局记录中的位置
function findParagraphAndNotation(key) {
    let res: ISelectData;
    const paras = gStory.paragraphs.rows || [];
    paras.some((p, i) => {
        const notationIndex = (p.notes || []).findIndex((n) => n.key === key);
        if (notationIndex !== -1) {
            res.note = p.notes[notationIndex];
            res.noteIndex = notationIndex;
            res.line = p;
            res.lineIndex = i;
            return true;
        }
        return false;
    });
    return res;
}


// 画布上的点击事件
const handleClick = wrappedAction((ev) => {
    if (state.shouldNotationBlurAfterClick && state.selectedNotationKey) {
        state.lastSelectedNotationKey = state.selectedNotationKey;
        state.selectedNotationKey = null;
    }
    state.shouldNotationBlurAfterClick = true;
});

const handleKeyPress = wrappedAction((ev) => {
    console.log('handleKeyPress = wrappedAction(...) ');
    const inputKey = ev.key.toLowerCase();
    const shift = ev.shiftKey;
    const ctrl = ev.ctrlKey;

    if (state.selectedNotationKey) {
        // 仅选中符号时作用
        if (state.helpDialogVisible || state.configDialogVisible) {
            return;
        }
        const {
            line,
            note,
            lineIndex,
            noteIndex,
        } = findParagraphAndNotation(state.selectedNotationKey);
        if (!note) {
            return;
        }
        switch (true) {
            case inputKey && !ctrl && !shift:
                note.n = inputKey;
                break;
            case inputKey === "enter" && !ctrl && !shift: {
                if (line.notes[noteIndex + 1]) {
                    state.selectedNotationKey =
                        line.notes[noteIndex + 1].key;
                } else {
                    const nextNotation = createNotation();
                    line.notes.push(nextNotation);
                    state.selectedNotationKey = nextNotation.key;
                }
                break;
            }

            case inputKey === "enter" && !ctrl && shift: {
                if (line.notes[noteIndex - 1]) {
                    state.selectedNotationKey =
                        line.notes[noteIndex - 1].key;
                }
                break;
            }

            case inputKey === "enter" && ctrl && !shift: {
                const newNotation = createNotation();
                if (
                    noteIndex === line.notes.length - 1 &&
                    lineIndex === gStory.paragraphs.rows.length - 1
                ) {
                    // 在最后一个音符时ctrl+enter插入新段落并创建符号
                    gStory.paragraphs.rows.push(createParagraph({ notes: [createNotation({ n: "0" })] }));
                    state.selectedNotationKey = gStory.paragraphs.rows
                        .at(-1)
                        .notes.at(0).key;
                } else {
                    line.notes.splice(noteIndex + 1, 0, createNotation({ n: "0" }));
                    state.selectedNotationKey = createNotation({ n: "0" }).key;
                }
                break;
            }
            case inputKey === "backspace" && !ctrl && !shift:
            case inputKey === "delete" && !ctrl && !shift: {
                line.notes.splice(noteIndex, 1);
                const currNotation =
                    line.notes[noteIndex] ||
                    line.notes[noteIndex - 1];
                state.selectedNotationKey = currNotation?.key;
                break;
            }
            case inputKey === "c" && ctrl && !shift: {
                ev.preventDefault();
                state.clipboardContent = note;
                break;
            }
            case inputKey === "c" && ctrl && shift: {
                ev.preventDefault();
                state.clipboardContent = line;
                break;
            }
            case inputKey === "v" && ctrl && !shift: {
                ev.preventDefault();
                if (state.clipboardContent) {
                    switch (state.clipboardContent.type) {
                        case "notation":
                            line.notes.splice(
                                noteIndex + 1,
                                0,
                                cloneNotation(state.clipboardContent)
                            );
                            break;
                        case "paragraph":
                            gStory.paragraphs.rows.splice(
                                lineIndex + 1,
                                0,
                                cloneParagraph(state.clipboardContent)
                            );
                            break;
                        default:
                            state.clipboardContent = null;
                    }
                }
                break;
            }
            default:
                break;
        }
    } else {
        // 仅未选中符号时
        switch (true) {
            case ["h", "j", "k", "l"].includes(inputKey): {
                console.log('仅未选中符号时' + inputKey)
                break;
            }
            default:
                break;
        }
    }

    // 全局
    switch (true) {
        case inputKey === "z" && ctrl && !shift:
            go(-1);
            break;
        case inputKey === "y" && ctrl && !shift:
        case inputKey === "z" && ctrl && shift:
            go(1);
            break;
        default:
            break;
    }
});

export { handleKeyPress, handleClick };
