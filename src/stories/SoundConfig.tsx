
import { VERSION } from "./global/version";
export default class SoundConfig {    
    noteHeight = 22;
    noteWidth = 11;
    noteFontSize = 22;
    noteFontFamily = 'sans-serif';
    sigFontSize = 14;
    trackGap = 10;
    lineGap = 40;

    noiseHeight = 22;
    noiseWidth = 11;
    noiseFontSize = 22;
    noiseFontFamily = 'sans-serif';
    //sigFontSize = 14;
    measureGap = 10;
    paragraphGap = 40;


    pageE = 1.414;
    pageWidth = 1000;
    pageMarginHorizontal = 100;
    pageMarginVertical = 110;

    infoTitleFontSize = 34;
    infoSubtitleFontSize = 22;
    infoGap = 7;
    infoFontSize = 20;

    pageIndexFontSize = 20;
    /*  font-family: source - code - pro, Menlo, Monaco, Consolas, 'Courier New', monospace;*/
    textFontFamily = 'source - code - pro, Menlo, Monaco, Consolas, "Courier New", monospace';

    showBorder = false;



    /* 增加的 */
    version = VERSION;
    canvasWidth = 896;
    canvasHeight = 1024;
    defaultFontSize = 16;
    defaultSubFontSize = 12;
    defaultFontFamily = 'sans-serif';

    pointGap = 5;
    tailPointGap = 8;
    pointRound = 1.5;
    title: "无标题";
    tone: "C";
    marginHorizontal: 64;
    marginTop: 32;
    gapAfterTitle: 16;
    gapAfterHeader: 32;
    gapBetweenParagraph: 32;
    gapBetweenNotation: 16;
    beat: [4, 4];
    speed: 75;
    authors: ["佚名  作词", "简谱编辑器  制谱"];
    notations: [];

}


const initialData = {
    version: VERSION,
    canvasWidth: 896,
    canvasHeight: 1024,
    defaultFontSize: 16,
    defaultSubFontSize: 12,
    defaultFontFamily : 'source - code - pro, Menlo, Monaco, Consolas, "Courier New", monospace',

    pointGap : 5,
    tailPointGap : 8,
    pointRound : 1.5,

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
};

function getDefaultGlobalData() {
    return JSON.parse(JSON.stringify(initialData));
}