"use strict";

export function modalOpenNewChat(new_state) {
    new_state.visual = Object.assign({}, new_state.visual);
    new_state.visual.activeModal = "ModalNewChat";
}

export function modalCloseNewChat(new_state) {
    if (new_state.visual.activeModal === "ModalNewChat") {
        new_state.visual = Object.assign({}, new_state.visual);
        new_state.visual.activeModal = null;
    }
}

