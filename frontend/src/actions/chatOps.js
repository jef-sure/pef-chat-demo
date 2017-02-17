"use strict";
/**
 * Created by anton on 13.02.17.
 */
import wsAjax from '../lib/wsAjax';
import {consoleLog} from './consoleLog';
import * as Constants from './constants';

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
        }, (response) => {
            console.log("chat join member response: ", response);
            if (response.body.result !== 'OK')
                dispatch(consoleLog('error', response.body.answer));
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
        }, (response) => {
            console.log("chat send message response: ", response);
            if (response.body.result !== 'OK')
                dispatch(consoleLog('error', response.body.answer));
        });
    }
}
