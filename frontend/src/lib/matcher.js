"use strict";
/**
 * Created by anton on 09.02.17.
 */
// I like to ride my bicycle

export default function matcher(pattern, exact) {
    let ridx = 0;
    let rarr = [];
    let regexp = pattern.replace(/(\.|\(|:\w+|\)|\*+)/g, (m) => {
        switch (m) {
            case '.':
                return '\\.';
            case '(':
                return '(?:';
            case ')':
                return ')?';
            case '*':
                return '[^/]*';
            case '**':
                return '.*';
            default:
                rarr[++ridx] = m.substring(1);
                return '([^/]+)';
        }
    });
    let regexObj = new RegExp('^' + regexp + (exact ? "$" : ""));
    return function (string, params) {
        let result = string.match(regexObj);
        if (result === null)
            return false;
        for (let i = 1; i < result.length; ++i)
            if (typeof result[i] !== 'undefined')
                params[rarr[i]] = result[i];
        return true;
    }
}