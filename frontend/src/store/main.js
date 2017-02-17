"use strict";
export function initialStateStore() {
    let ret = {
        state: {
            isLoggedIn: false,
        },
        location: window.location.hash.substr(1),
        consoleLog: {
            isVisible: false,
            log: []
        },
        model: {},
        visual: {
            isHeaderOn: true,
            isNavOn: true,
            isChatMemberListOn: false,
        },
        system: {
            headerText: 'PEF Front Websocket Chat Demo'
        }
    };
    if (typeof memberInfo !== 'undefined')
        ret = Object.assign({}, ret, {state: {isLoggedIn: true}}, memberInfo);
    return ret;
}