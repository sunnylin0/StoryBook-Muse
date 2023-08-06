import { action, runInAction, toJS } from "mobx";
//import globalStore from "./global";
import { getStoreCode , globalStore, globalDecode} from '../txViewText'
import React from 'react';
const storeHistory = [];
let cursor = -1;

// ENHANCE: 使用性能更好的方案
// 比较历史记录
function _isEqual(objA, objB) {
    const cacheSet = new Set();
    function _isCommonObject(obj) {
        if (typeof obj !== "object" || obj === null) {
            return false;
        }
        const unRegularConstructors = [Promise, Map, Set, WeakMap, WeakSet];
        return !unRegularConstructors.some((c) => obj instanceof c);
    }
    function _deepEqual(obj1, obj2) {
        if (!_isCommonObject(obj1) || !_isCommonObject(obj2)) {
            return obj1 === obj2;
        }
        if (obj1 === obj2) {
            return true;
        }
        if (cacheSet.has(obj1) || cacheSet.has(obj2)) {
            return false;
        }
        cacheSet.add(obj1);
        cacheSet.add(obj2);
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        return keys1.every((key) => _deepEqual(obj1[key], obj2[key]));
    }
    return _deepEqual(objA, objB);
}

// 在历史记录中漫游
function go(span) {
    const newCursor = Math.min(
        Math.max(0, cursor + span),
        storeHistory.length - 1
    );
    if (newCursor === cursor) {
        return;
    }
    cursor = newCursor;
    Object.assign(globalStore, storeHistory[newCursor]);
    console.log(globalStore.paragraphs)
    if (globalStore) globalDecode(globalStore.paragraphs)

}

function clearHistory() {
    storeHistory.length = 0;
    cursor = -1;
}

// 包装mobx的action以实现历史记录
function executeAction(actionFunc, ...args) {
    console.log(`executeAction123 `);
    actionFunc.apply(this, args);
    const gs = getStoreCode();
    const current = toJS(gs);
    if (!_isEqual(storeHistory[cursor], current)) {
        storeHistory[++cursor] = current;
        storeHistory.length = cursor + 1;
        if (storeHistory.length > 256) {
            storeHistory.splice(0, 256 - storeHistory.length);
        }
    }
}
function wrappedAction(...args) {
    console.log('wrappedAction');
    let name, func;
    if (typeof args[0] === "function") {
        func = args[0];
    } else {
        name = args[0];
        func = args[1];
    }
    const realArgs = [name, executeAction.bind(this, func, name)];
    if (name === undefined) {
        realArgs.shift();
    }
    return action.apply(this, realArgs);
}
function runInWrappedAction(func) {
    console.log('runInWrappedAction');
    runInAction(() => {
        executeAction.call(this, func);
    });
}

// 不需要记录历史记录的时候直接使用原action
const unwrappedAction = action;
const runInUnwrappedAction = runInAction;

export {
    go,
    clearHistory,
    wrappedAction,
    runInWrappedAction,
    unwrappedAction,
    runInUnwrappedAction,
};
