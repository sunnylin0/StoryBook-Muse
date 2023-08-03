import React from "react";
import { observable } from "mobx";
import { VERSION } from "./version";
//import { getDefaultGlobalDataWidthNotations } from "../util/editor";

// 全局数据及配置，需要持久化
export interface SoundConfig {
    version?: number;
    canvasWidth?: number;
    canvasHeight?: number;
    defaultFontSize?: number;
    defaultFontFamily?: string;
    defaultSubFontSize?: number;
    title?: string;
    tone?: string;
    marginHorizontal?: number;
    marginTop?: number;
    gapAfterTitle?: number;
    gapAfterHeader?: number;
    gapBetweenParagraph?: number;
    gapBetweenNotation?: number;
    beat?: Array<number>;
    speed?: number;
    authors?: Array<any>;
    notations?: Array<any>;

    /* 增加的 */

    noteHeight?: number;
    noteWidth?: number;
    noteFontSize?: number;
    noteFontFamily?: string;
    noteSubFontSize?: number;
    trackGap?: number;
    lineGap?: number;

    //noiseHeight?: number,
    //noiseWidth?: number,
    //noiseFontSize?: number,
    //noiseFontFamily?: string,
    sigFontSize? : number;
    measureGap?: number;
    paragraphGap?: number;


    pointGap?: number;
    tailPointGap?: number;
    pointRound?: number;
    pageE?: number;
    pageWidth?: number;
    pageMarginHorizontal?: number;
    pageMarginVertical?: number;

    infoTitleFontSize?: number;
    infoSubtitleFontSize?: number;
    infoGap?: number;
    infoFontSize?: number;

    pageIndexFontSize?: number;
    /*  font-family?: source - code - pro, Menlo, Monaco, Consolas, 'Courier New', monospace;*/
    textFontFamily?: string;

    showBorder?: boolean;
}
const initialData: SoundConfig = {
    version: VERSION,
    canvasWidth: 896,
    canvasHeight: 1024,
    defaultFontSize: 16,
    defaultFontFamily: 'sans-serif',
    defaultSubFontSize: 12,
    title: "无标题",
    tone: "C",
    marginHorizontal: 64,
    marginTop: 32,
    gapAfterTitle: 16,
    gapAfterHeader: 32,
    gapBetweenParagraph: 32,
    gapBetweenNotation: 16,
    beat: [4, 4],
    speed: 75,
    authors: ["佚名  作词", "简谱编辑器  制谱"],
    notations: [],

    /* 增加的 */

    noteHeight: 22,
    noteWidth: 11,
    noteFontSize: 22,
    noteFontFamily: 'sans-serif',
    noteSubFontSize: 18,
    trackGap: 10,
    lineGap: 40,

    //noiseHeight : 22,
    //noiseWidth : 11,
    //noiseFontSize : 22,
    //noiseFontFamily : 'sans-serif',
    sigFontSize : 14,
    measureGap: 10,
    paragraphGap: 40,


    pointGap : 5,
    tailPointGap : 8,
    pointRound : 1.5,

    pageE: 1.414,
    pageWidth: 1000,
    pageMarginHorizontal: 100,
    pageMarginVertical: 110,

    infoTitleFontSize: 34,
    infoSubtitleFontSize: 22,
    infoGap: 7,
    infoFontSize: 20,

    pageIndexFontSize: 20,
    /*  font-family: source - code - pro, Menlo, Monaco, Consolas, 'Courier New', monospace;*/
    textFontFamily: 'source - code - pro, Menlo, Monaco, Consolas, "Courier New", monospace',

    showBorder: false,
};

function getDefaultGlobalData(): SoundConfig {
    return JSON.parse(JSON.stringify(initialData));
}
function getDefaultGlobalDataWidthNotations(): SoundConfig {
    const d = getDefaultGlobalData();
    // d.paragraphs = [createParagraphWithNotations()];
    return d;
}


const globalStore = observable(getDefaultGlobalDataWidthNotations());
const GlobalContext = React.createContext(globalStore);


export default globalStore;
export { GlobalContext };
