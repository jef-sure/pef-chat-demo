"use strict";

export function toggleHeader(new_state, action) {
    new_state.visual = Object.assign({}, new_state.visual);
    new_state.visual.isHeaderOn = action.payload;
}

export function toggleNav(new_state, action) {
    new_state.visual = Object.assign({}, new_state.visual);
    new_state.visual.isNavOn = action.payload;
}

export function toggleChatMemberList(new_state, action) {
    new_state.visual = Object.assign({}, new_state.visual);
    new_state.visual.isChatMemberListOn = action.payload;
}