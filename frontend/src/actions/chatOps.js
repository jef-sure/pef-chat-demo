"use strict";
/**
 * Created by anton on 13.02.17.
 */
import wsAjax from '../lib/wsAjax';
import {toServerDate} from '../lib/dateformat';
import * as Constants from './constants';
import {modalCloseNewChat} from './modal';

export function chatJoin(chat_id) {
    let ws = new wsAjax();
    return dispatch => {
        ws.send({
            ajax: {
                method: "chat join member",
                parameters: {
                    id: chat_id
                }
            }
        });
    }
}

export function sendChatMessage(chat_id, message) {
    let ws = new wsAjax();
    return (dispatch, getState) => {
        let uniqClientId = '' + Math.random();
        const my_id = getState().model.me.id;
        dispatch({
            type: Constants.CHAT_ADD_MESSAGE,
            payload: {
                uniq_client_id: uniqClientId,
                message: message,
                member_id: my_id,
                chat_id: chat_id,
                message_time: new Date(),
                html_message: global.markdown.render(message),
                status: Constants.MESSAGE_MINE_SENDING,
            }
        });
        ws.send({
            ajax: {
                method: "chat send message",
                parameters: {
                    id: chat_id,
                    message: message,
                    uniq_client_id: uniqClientId
                },
            }
        });
    }
}

export function setChatTitle(chat_id, title) {
    let ws = new wsAjax();
    return () => {
        ws.send({
            ajax: {
                method: "chat set title",
                parameters: {
                    id: chat_id,
                    title: title
                },
            }
        });
    }
}

export function loadChatEarlier(chat_id, before) {
    let ws = new wsAjax();
    return dispatch => {
        ws.send({
                ajax: {
                    method: "chat load earlier",
                    parameters: {
                        id: chat_id,
                        load_before: toServerDate(before),
                        limit: 20
                    },
                }
            }, (response) => {
                dispatch({
                    type: Constants.CHAT_LOAD_EARLIER,
                    payload: {
                        id: chat_id,
                        message_log: response.body.message_log
                    }
                });
            }
        );
    }
}

export function leaveChat(chat_id) {
    let ws = new wsAjax();
    return () => {
        ws.send({
            ajax: {
                method: "chat leave member",
                parameters: {
                    id: chat_id
                },
            }
        });
    }
}

export function destroyChat(chat_id) {
    let ws = new wsAjax();
    return () => {
        ws.send({
            ajax: {
                method: "chat delete",
                parameters: {
                    id: chat_id
                },
            }
        });
    }
}

export function makeChat(name, title) {
    let ws = new wsAjax();
    return dispatch => {
        dispatch(modalCloseNewChat());
        ws.send({
            ajax: {
                method: "chat make",
                parameters: {
                    name: name,
                    title: title
                },
            }
        }, (response) => {
            dispatch({
                type: Constants.CHAT_NEW,
                payload: response.body,
                meta: "/chat/" + response.body.id
            });
        });
    }
}

