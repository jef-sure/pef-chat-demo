"use strict"
import {parseDate} from '../lib/dateformat';
import {convertMessageFromServer} from '../lib/messageFromServer';
import * as Constants from '../actions/constants';

export function initializeModel(new_state, action) {
    new_state.model = Object.assign({}, action.payload);
    const my_id = new_state.model.me.id;
    for (let chat of new_state.model.chats) {
        chat.created = parseDate(chat.created);
        for (let ml of chat.message_log) {
            convertMessageFromServer(ml, my_id);
        }
    }
}

export function uninitializeModel(new_state) {
    new_state.model = {};
    new_state.state.isLoggedIn = false;
}
