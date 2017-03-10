"use strict";
import * as Constants from './constants';

export function modalOpenNewChat() {
    return {
        type: Constants.MODAL_OPEN_NEW_CHAT
    }
}

export function modalCloseNewChat() {
    return {
        type: Constants.MODAL_CLOSE_NEW_CHAT
    }
}

