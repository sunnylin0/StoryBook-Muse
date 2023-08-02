interface Number {
    padZero(length: number):string;
    toNumPoint(length: number):number;
}

interface String {
    padZero(length: number):string;
    toNumPoint(length: number): number;
}

String.prototype.padZero = function (length: number) {
    var s: string = String(this);
    while (s.length < length) {
        s = '0' + s;
    }
    return s;
}

/**
 *  取得 固定小數點  return (number)
 */
String.prototype.toNumPoint = function (length: number): number {
    var s: string = String(this);
    var nn: number;

    if (!Number.isNaN(s))
        nn = Number(Number(s).toFixed(length));
    else
        nn = 0;
    return nn;
}

Number.prototype.padZero = function (length: number) {
    return String(this).padZero(length)
}
/**
 *  取得 固定小數點 return (number)
 */
Number.prototype.toNumPoint = function (length: number): number {
    var num: number = Number(this);
    var nn: number;
        nn = Number(num.toFixed(length));
    return nn;
}