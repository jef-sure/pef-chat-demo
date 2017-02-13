"use strict"
export function consoleLog(new_state, action) {
    new_state.consoleLog = Object.assign({}, new_state.consoleLog);
    new_state.consoleLog.isVisible = true;
    new_state.consoleLog.log.push({logTime: new Date(), message: action.payload.message, level: action.payload.level});
}

export function consoleLogHide(new_state) {
    new_state.consoleLog = Object.assign({}, new_state.consoleLog);
    new_state.consoleLog.isVisible = false;
}