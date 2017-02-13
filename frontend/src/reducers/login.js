"use strict"
export function loginResponse(new_state, action) {
    new_state.state = Object.assign({}, new_state.state);
    if ('errorText' in new_state.state)
        delete new_state.state.errorText;
    if (action.payload.result === 'OK') {
        new_state.state.isLoggedIn = true;
        new_state.login = action.payload.login;
    } else {
        new_state.state.isLoggedIn = false;
        if ('login' in new_state)
            delete new_state.login;
        new_state.state.errorText = action.payload.answer;
    }
}
export function loginSubmitError(new_state, action) {
    new_state.state = Object.assign({}, new_state.state);
    new_state.state.isLoggedIn = false;
    new_state.state.errorText = action.payload;
    if ('login' in new_state)
        delete new_state.login;

}

export function clearLoginError(new_state) {
    if ('errorText' in new_state.state) {
        new_state.state = Object.assign({}, new_state.state);
        delete new_state.state.errorText;
    }
}