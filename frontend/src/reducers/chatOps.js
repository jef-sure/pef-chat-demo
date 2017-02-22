"use strict"

import {parseDate} from '../lib/dateformat';
import {convertMessageFromServer} from '../lib/messageFromServer';
import * as Constants from '../actions/constants';

export function chatJoinMember(new_state, action) {
    let chat = new_state.model.chats.find((e) => e.id == action.payload.chat_id);
    if (!chat) return;
    let am = chat.member_list.find((e) => e == action.payload.member_id);
    if (typeof am === 'undefined') {
        chat.member_list = Object.assign([], chat.member_list);
        chat.member_list.push(action.payload.member_id);
    }
}

export function chatData(new_state, action) {
    let chatIndex = new_state.model.chats.findIndex((e) => e.id == action.payload.id);
    const my_id = new_state.model.me.id;
    action.payload.canHaveEarlier = true;
    for (let ml of action.payload.message_log) {
        convertMessageFromServer(ml, my_id);
    }
    action.payload.created = parseDate(action.payload.created);
    if (chatIndex === -1) {
        new_state.model.chats = Object.assign([], new_state.model.chats);
        new_state.model.chats.push(action.payload);
    } else {
        new_state.model.chats[chatIndex] = action.payload;
    }
}
// payload: {
//     uniq_client_id: uniqClientId,
//         message: message,
//         member_id: my_id,
//         chat_id: chat_id,
//         message_time: new Date(),
//         html_message: global.markdown.render(message),
//         status: Constants.MESSAGE_MINE_SENDING,
// }

export function chatAddNewMessage(new_state, action) {
    let chat = new_state.model.chats.find((e) => e.id == action.payload.chat_id);
    if (!chat) return;
    chat.message_log = Object.assign([], chat.message_log);
    chat.message_log.push(action.payload);
}

export function chatNewMessageFromServer(new_state, action) {
    let chat = new_state.model.chats.find((e) => e.id == action.payload.chat_id);
    if (!chat) return;
    const my_id = new_state.model.me.id;
    chat.message_log = Object.assign([], chat.message_log);
    let lmsg;
    const f = () => {
        lmsg = chat.message_log.find(
            (m) => typeof m.id === 'undefined'
            && m.uniq_client_id
            && action.payload.uniq_client_id === m.uniq_client_id);
        return lmsg ? true : false;
    }
    if (action.payload.member_id === my_id && f()) {
        lmsg.id = action.payload.id;
        lmsg.message_time = parseDate(action.payload.message_time);
        lmsg.status = Constants.MESSAGE_MINE;
    } else {
        convertMessageFromServer(action.payload, my_id);
        chat.message_log.push(action.payload);
    }
}

export function chatSetTitle(new_state, action) {
    let chat = new_state.model.chats.find((e) => e.id == action.payload.id);
    if (!chat) return;
    chat.title = action.payload.title;
}

export function chatDontLoadEarlier(new_state, action) {
    let chat = new_state.model.chats.find((e) => e.id == action.payload.id);
    if (!chat) return;
    chat.canHaveEarlier = false;
}

export function chatLoadEarlier(new_state, action) {
    let chat = new_state.model.chats.find((e) => e.id == action.payload.id);
    if (!chat) return;
    chat.canHaveEarlier = false;
    const my_id = new_state.model.me.id;
    if (action.payload.message_log.length != 0) {
        chat.canHaveEarlier = true;
        for (let ml of action.payload.message_log) {
            convertMessageFromServer(ml, my_id);
        }
        let pml = chat.message_log;
        let message_log = action.payload.message_log.concat(pml);
        message_log.sort((a, b) => {
            if (typeof a.id === 'undefined' || typeof b.id === 'undefined') {
                return a.message_time - b.message_time;
            } else {
                return a.id - b.id;
            }
        });
        chat.message_log = message_log.filter((e, i, a) => {
            if (i == 0)
                return true;
            let eid = e.id || e.uniq_client_id;
            let peid = a[i - 1].id || a[i - 1].uniq_client_id;
            if (eid != peid)
                return true;
            return false;
        });

    }
}

export function chatLeaveMember(new_state, action) {
    let chat = new_state.model.chats.find((e) => e.id == action.payload.chat_id);
    if (!chat) return;
    chat.member_list = chat.member_list.filter((e) => e != action.payload.member_id);
    const my_id = new_state.model.me.id;
    if(action.payload.member_id == my_id)
        chat.message_log = [];
}


