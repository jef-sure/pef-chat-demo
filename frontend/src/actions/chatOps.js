"use strict";
/**
 * Created by anton on 13.02.17.
 */
import wsAjax from '../lib/wsAjax';

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
        });
    }
}
