/**
 * Created by anton on 14.02.17.
 */
"use strict";
// from http://ecmanaut.blogspot.de/2006/07/encoding-decoding-utf8-in-javascript.html
export function encode_json(struct) {
    return unescape(encodeURIComponent(JSON.stringify(struct)));
}

export function decode_json(s) {
    return JSON.parse(decodeURIComponent(escape(s)));
}
