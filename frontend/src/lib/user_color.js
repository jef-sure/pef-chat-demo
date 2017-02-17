'use strict';

import {murmurhash2} from './murmurhash'

function clamp(v) {
    return v > 0 ? (v < 1 ? v : 1) : 0;
}

function rgbColor(r, g, b) {
    return [r, g, b].map(function (v) {
        v = Number(Math.round(clamp(v) * 255)).toString(16);
        return v.length == 1 ? '0' + v : v;
    }).join('');
}

function HSVToRGB(h, opt_s, opt_v) {
    h *= 6;
    var s = opt_s === void(0) ? 1 : clamp(opt_s);
    var v = opt_v === void(0) ? 1 : clamp(opt_v);
    var x = v * (1 - s * Math.abs(h % 2 - 1));
    var m = v * (1 - s);
    switch (Math.floor(h) % 6) {
        case 0:
            return rgbColor(v, x, m);
        case 1:
            return rgbColor(x, v, m);
        case 2:
            return rgbColor(m, v, x);
        case 3:
            return rgbColor(m, x, v);
        case 4:
            return rgbColor(x, m, v);
        default:
            return rgbColor(v, m, x);
    }
}

export function userColor(username) {
    var hash = murmurhash2(username);
    var h = (hash >>> 16) / 0x10000;
    var s = ((hash & 0xffff) + 0x10000) / 0x20000;
    var v = Math.pow(((hash & 0xffff) >>> 1) / 0x10000, 0.33);
    return HSVToRGB(h, s, v);
}

