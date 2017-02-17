"use strict";
import * as Constants from './constants';
import axios from 'axios';

export function toggleHeader(currentState) {
    return {
        type: Constants.TOGGLE_HEADER,
        payload: !currentState
    }
}

export function toggleNav(currentState) {
    return {
        type: Constants.TOGGLE_NAV,
        payload: !currentState
    }
}

export function toggleChatMemberList(currentState) {
    return {
        type: Constants.TOGGLE_CHAT_MEMBER_LIST,
        payload: !currentState
    }
}
