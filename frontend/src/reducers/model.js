"use strict"
export function initializeModel(new_state, action) {
    new_state.model = Object.assign({}, action.payload);
}

export function uninitializeModel(new_state) {
    new_state.model = {};
}
