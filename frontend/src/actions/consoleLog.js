"use strict";
import * as Constants from './constants';
import axios from 'axios';

export function consoleLog(level, message) {
    return {
        type: Constants.CONSOLE_LOG,
        payload: {message: message, level: level}
    }
}

export function consoleLogHide() {
    return {
        type: Constants.CONSOLE_LOG_HIDE,
    }
}
