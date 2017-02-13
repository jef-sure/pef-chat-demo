"use strict"

export function chatJoin(new_state, action) {
    if(action.payload.result === 'OK') {
        new_state.model.chats = Object.assign([],new_state.model.chats);
        let chat = new_state.model.chats.find((c) => c.id == action.meta.chat_id);
        if(chat) {
            chat.message_log = action.payload.message_log;
            chat.member_list = action.payload.member_list;
        }
    }
}