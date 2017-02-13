"use strict";

export function parseDate(dateFromServer) {
  var isoStr = dateFromServer.replace(' ', 'T').replace(/([+-]\d\d)$/, '$1:00').replace(/([+-]\d\d)(\d\d)$/, '$1:$2');
  return new Date(isoStr);
}

export function toServerDate(date) {
  return date.toISOString();
}
