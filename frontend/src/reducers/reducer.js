import * as Constants from '../actions/constants';

import {initialStateStore} from '../store/main';
import {clearLoginError, loginResponse, loginSubmitError} from './login'
import {initializeModel, uninitializeModel} from './model'
import {consoleLog, consoleLogHide} from './consoleLog'
import {toggleHeader, toggleNav, toggleChatMemberList} from './toggle'
import {
    chatJoinMember,
    chatData,
    chatAddNewMessage,
    chatNewMessageFromServer,
    chatSetTitle,
    chatDontLoadEarlier,
    chatLoadEarlier,
    chatLeaveMember,
    chatDestroy,
    chatNew
} from './chatOps'

import {modalOpenNewChat,modalCloseNewChat} from './modal';

export default function reducer(state, action) {
    console.log('Reducer args: %o | %o', state, action);
    if (typeof state === 'undefined')
        return {};
    if (action.type === 'app/INIT')
        return initialStateStore();
    var new_state = Object.assign({}, state);
    switch (action.type) {
        case Constants.LOCATION_CHANGE:
            new_state.location = action.payload;
            break;
        case Constants.LOGIN_RESPONSE:
            loginResponse(new_state, action);
            break;
        case Constants.LOGIN_ERROR:
            loginSubmitError(new_state, action);
            break;
        case Constants.LOGIN_CLEAR_ERROR:
            clearLoginError(new_state);
            break;
        case Constants.MODEL_INITIALIZE:
            initializeModel(new_state, action);
            break;
        case Constants.MODEL_UNINITIALIZE:
            uninitializeModel(new_state);
            break;
        case Constants.CONSOLE_LOG:
            consoleLog(new_state, action);
            break;
        case Constants.CONSOLE_LOG_HIDE:
            consoleLogHide(new_state);
            break;
        case Constants.TOGGLE_HEADER:
            toggleHeader(new_state, action);
            break;
        case Constants.TOGGLE_NAV:
            toggleNav(new_state, action);
            break;
        case Constants.TOGGLE_CHAT_MEMBER_LIST:
            toggleChatMemberList(new_state, action);
            break;
        case Constants.CHAT_JOIN:
            chatJoinMember(new_state, action);
            break;
        case Constants.CHAT_DATA:
            chatData(new_state, action);
            break;
        case Constants.CHAT_ADD_MESSAGE:
            chatAddNewMessage(new_state, action);
            break;
        case Constants.CHAT_MESSAGE_FROM_SERVER:
            chatNewMessageFromServer(new_state, action);
            break;
        case Constants.CHAT_SET_TITLE:
            chatSetTitle(new_state, action);
            break;
        case Constants.CHAT_DONT_LOAD_EARLIER:
            chatDontLoadEarlier(new_state, action);
            break;
        case Constants.CHAT_LOAD_EARLIER:
            chatLoadEarlier(new_state, action);
            break;
        case Constants.CHAT_LEAVE:
            chatLeaveMember(new_state, action);
            break;
        case Constants.CHAT_DESTROY:
            chatDestroy(new_state, action);
            break;
        case Constants.CHAT_NEW:
            chatNew(new_state, action);
            break;
        case Constants.MODAL_OPEN_NEW_CHAT:
            modalOpenNewChat(new_state);
            break;
        case Constants.MODAL_CLOSE_NEW_CHAT:
            modalCloseNewChat(new_state);
            break;
    }
    return new_state;
}
